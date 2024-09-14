from ultralytics import YOLO
import cv2

class ObjectDetector:
    def __init__(self):
        self.model = YOLO("yolov8n.pt")

    def detect_objects(self, image_path):
        results = self.model(image_path)
        return results[0].boxes.data.tolist()

    def annotate_image(self, image_path, detections):
        img = cv2.imread(image_path)
        for det in detections:
            x1, y1, x2, y2, conf, cls = det
            cv2.rectangle(img, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            cv2.putText(img, f"Class: {int(cls)}, Conf: {conf:.2f}", (int(x1), int(y1)-10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        return img