import cv2
import os
import threading
import time
import json
import uuid
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
from tagging.depth import DepthEstimator
from tagging.description import ImageDescriber
from tagging.segment import ObjectDetector

load_dotenv()
CAMERA_PASSWORD = os.getenv('CAMERA_PASSWORD')
ENABLE_DESCRIPTION = os.getenv('ENABLE_DESCRIPTION')

CAMERA_PORT = '554'
PAUSE_INTERVAL = 0.1
PROCESS_INTERVAL = 5  # process frames every 5 seconds
DESCRIPTION_INTERVAL = 30 # describe the latest frame every 30 seconds

ENTITY_URL = "http://localhost:3000/api/entities"

class Camera:
    def __init__(self, ip, username, space_id, port='554'):
        self.ip = ip
        self.username = username
        self.space_id = space_id
        self.password = CAMERA_PASSWORD
        self.port = CAMERA_PORT
        self.rtsp_url = f"rtsp://{self.username}:{self.password}@{self.ip}:{self.port}/stream1"
        self.cap = None
        self.frame = None
        self.processed_frame = None
        self.depth_map = None
        self.lock = threading.Lock()
        self.running = True
        self.frame_thread = threading.Thread(target=self.update_frames, daemon=True)
        self.process_thread = threading.Thread(target=self.process_frames, daemon=True)

        self.last_process_time = time.time()
        self.last_description_time = time.time()
        
        self.depth_estimator = DepthEstimator()
        self.object_detector = ObjectDetector()
        self.image_describer = ImageDescriber()
        
        self.frame_thread.start()
        self.process_thread.start()

    def open_stream(self):
        self.cap = cv2.VideoCapture(self.rtsp_url)

        if not self.cap.isOpened():
            raise Exception(f"Failed to open RTSP stream for camera {self.username}")

    def update_frames(self):
        if self.cap is None or not self.cap.isOpened():
            self.open_stream()

        while self.running:
            success, frame = self.cap.read()

            if success:
                with self.lock:
                    self.frame = frame
            else:
                print(f"Failed to read frame for {self.username}, retrying...")
                time.sleep(PAUSE_INTERVAL)

    def get_frame(self):
        with self.lock:
            return self.frame.copy() if self.frame is not None else None

    def get_processed_frame(self):
        with self.lock:
            return self.processed_frame.copy() if self.processed_frame is not None else None

    def get_depth_map(self):
        with self.lock:
            return self.depth_map.copy() if self.depth_map is not None else None

    def process_frames(self):
        while self.running:
            current_time = time.time()

            if current_time - self.last_process_time >= PROCESS_INTERVAL:
                frame = self.get_frame()

                if frame is not None:
                    self.process_frame(frame)
                    self.last_process_time = current_time

            time.sleep(PROCESS_INTERVAL)

    def process_frame(self, frame):
        depth_map_colored, depth_map = self.depth_estimator.estimate_depth(frame)
        detections = self.object_detector.detect_objects(frame)
        annotated_img = self.object_detector.annotate_image(frame, detections, depth_map)
        
        with self.lock:
            self.processed_frame = annotated_img
            self.depth_map = depth_map_colored

        current_time = time.time()

        if ENABLE_DESCRIPTION and (current_time - self.last_description_time >= DESCRIPTION_INTERVAL):
            data = {
                'spaceId': self.space_id,
                'objects': []
            }

            with ThreadPoolExecutor(max_workers=len(detections) + 1) as executor:
                future_to_detection = {executor.submit(self.generate_description_for_detection, frame, detection): detection for detection in detections}
                future_full_frame = executor.submit(self.image_describer.generate_description, frame)

                # Process the results as they complete
                for future in as_completed(future_to_detection):
                    detection, description = future.result()
                    x1, y1, x2, y2, conf, class_name = detection
                    data['objects'].append({
                        'class': class_name,
                        'description': description,
                        'id': str(uuid.uuid4()),
                        'location': [0, 0]  # TODO: determine location of object in space
                    })

                # Get the full frame description
                data['description'] = future_full_frame.result()

            r = requests.post(ENTITY_URL, json = data)

            if r.ok:
                print("Wrote description data to database")
            else:
                print("ERROR writing description data to database")

            self.last_description_time = time.time()

    def generate_description_for_detection(self, frame, detection):
        x1, y1, x2, y2, conf, class_name = detection
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        img = frame[y1:y2, x1:x2]
        description = self.image_describer.generate_description(img, 'object', class_name)
        return detection, description

    def generate_frames(self, stream_type='original'):
        while True:
            if stream_type == 'original':
                frame = self.get_frame()
            elif stream_type == 'processed':
                frame = self.get_processed_frame()
            elif stream_type == 'depth':
                frame = self.get_depth_map()
            else:
                raise ValueError("Invalid stream type")

            if frame is not None:
                # encode frame to JPEG format
                ret, buffer = cv2.imencode('.jpg', frame)
                frame = buffer.tobytes()

                # create a streaming response by yielding the JPEG frame
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            else:
                time.sleep(PAUSE_INTERVAL if stream_type == 'original' else PAUSE_INTERVAL * 10)

    def release_stream(self):
        if self.cap:
            self.cap.release()
