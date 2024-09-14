from ultralytics import YOLO
import cv2
import numpy as np

class ObjectDetector:
    def __init__(self):
        self.model = YOLO("yolov8n.pt")
        self.class_names = self.model.names

    def detect_objects(self, image_path):
        results = self.model(image_path)
        return results[0].boxes.data.tolist()

    def scale_depth(self, depth_value, min_depth, max_depth):
        # invert the depth value (closer objects will have lower values)
        inverted_depth = max_depth - depth_value + min_depth
        # apply logarithmic scaling
        log_depth = np.log(inverted_depth - min_depth + 1)
        # normalize to 0-1 range
        normalized_depth = (log_depth - np.log(1)) / (np.log(max_depth - min_depth + 1) - np.log(1))
        return normalized_depth

    def annotate_image(self, image_path, detections, depth_map):
        img = cv2.imread(image_path)
        min_depth = np.min(depth_map)
        max_depth = np.max(depth_map)
        
        for det in detections:
            x1, y1, x2, y2, conf, cls = det
            class_name = self.class_names[int(cls)]
            
            # calculate center of the bounding box
            center_x, center_y = int((x1 + x2) / 2), int((y1 + y2) / 2)
            # get depth value at the center of the object
            depth = depth_map[center_y, center_x]
            # scale depth value
            scaled_depth = self.scale_depth(depth, min_depth, max_depth)
            
            cv2.rectangle(img, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            cv2.putText(img, f"{class_name}: {conf:.2f}, depth: {scaled_depth:.2f}", 
                        (int(x1), int(y1)-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        return img

    def get_detection_info(self, detections, depth_map):
        min_depth = np.min(depth_map)
        max_depth = np.max(depth_map)
        info = []
        for det in detections:
            x1, y1, x2, y2, conf, cls = det
            class_name = self.class_names[int(cls)]
            center_x, center_y = int((x1 + x2) / 2), int((y1 + y2) / 2)
            depth = depth_map[center_y, center_x]
            scaled_depth = self.scale_depth(depth, min_depth, max_depth)
            info.append(f"{class_name}, confidence: {conf:.2f}, depth: {scaled_depth:.2f}")
        return info