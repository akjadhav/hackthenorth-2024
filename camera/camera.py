import cv2
import os
from dotenv import load_dotenv

load_dotenv()
CAMERA_PASSWORD = os.getenv('CAMERA_PASSWORD')

CAMERA_PORT = '554'

class Camera:
    def __init__(self, ip, username, port='554'):
        self.ip = ip
        self.username = username
        self.password = CAMERA_PASSWORD
        self.port = CAMERA_PORT
        self.rtsp_url = f"rtsp://{self.username}:{self.password}@{self.ip}:{self.port}/stream1"
        self.cap = None

    def open_stream(self):
        self.cap = cv2.VideoCapture(self.rtsp_url)

        if not self.cap.isOpened():
            raise Exception(f"Failed to open RTSP stream for camera {self.username}")

    def process_frame(self, frame):
        # TODO: add Krish's frame processing, upload to convex backend

        return frame

    def generate_frames(self):
        if not self.cap:
            self.open_stream()

        while True:
            success, frame = self.cap.read()

            if not success:
                break

            frame = self.process_frame(frame)

            # encode frame to JPEG format
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # create a streaming response by yielding the JPEG frame
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    def release_stream(self):
        if self.cap:
            self.cap.release()
