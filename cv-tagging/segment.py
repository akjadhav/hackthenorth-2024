from ultralytics import YOLO
import cv2
import os
import random

def detect_objects(image_path):
    model = YOLO("yolov8n.pt")
    results = model(image_path)
    return results[0].boxes.data.tolist()

def process_random_frames(frames_folder, num_frames=5):
    frames = [f for f in os.listdir(frames_folder) if f.endswith('.jpg')]
    selected_frames = random.sample(frames, min(num_frames, len(frames)))

    for frame in selected_frames:
        frame_path = os.path.join(frames_folder, frame)
        detections = detect_objects(frame_path)

        # Load the image to draw bounding boxes
        img = cv2.imread(frame_path)
        for det in detections:
            x1, y1, x2, y2, conf, cls = det
            cv2.rectangle(img, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            cv2.putText(img, f"Class: {int(cls)}, Conf: {conf:.2f}", (int(x1), int(y1)-10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        # Save the annotated image
        output_path = os.path.join(frames_folder, f"annotated_{frame}")
        cv2.imwrite(output_path, img)
        print(f"Processed and saved: {output_path}")

if __name__ == "__main__":
    frames_folder = "cv-tagging/frames"
    process_random_frames(frames_folder)