import detectron2
from detectron2 import model_zoo
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from detectron2.utils.visualizer import Visualizer
from detectron2.data import MetadataCatalog, DatasetCatalog
import cv2
import numpy as np
import torch

class ObjectDetector:
    def __init__(self):
        cfg = get_cfg()
        cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"))
        cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.75
        cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml")
        cfg.MODEL.DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
        
        self.model = DefaultPredictor(cfg)

        metadata = MetadataCatalog.get(cfg.DATASETS.TRAIN[0] if len(cfg.DATASETS.TRAIN) > 0 else "coco_2017_train")
        self.class_names = metadata.thing_classes

    def detect_objects(self, frame):
        results = self.model(frame)
        
        pred_classes = results["instances"].pred_classes
        pred_boxes = results["instances"].pred_boxes
        pred_scores = results["instances"].scores

        pred_boxes_list = pred_boxes.tensor.tolist()
        
        output = []

        for box, score, cls_idx in zip(pred_boxes_list, pred_scores, pred_classes):
            class_name = self.class_names[cls_idx.item()]
            output.append(box + [score.item(), class_name])

        return output

    def scale_depth(self, depth_value, min_depth, max_depth):
        # invert the depth value (closer objects will have lower values)
        inverted_depth = max_depth - depth_value + min_depth

        # apply logarithmic scaling
        log_depth = np.log(inverted_depth - min_depth + 1)

        # normalize to 0-1 range
        normalized_depth = (log_depth - np.log(1)) / (np.log(max_depth - min_depth + 1) - np.log(1))

        return normalized_depth

    def annotate_image(self, frame, detections, depth_map):
        img = np.copy(frame)

        min_depth = np.min(depth_map)
        max_depth = np.max(depth_map)
        
        for det in detections:
            x1, y1, x2, y2, conf, class_name = det
            
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
            x1, y1, x2, y2, conf, class_name = det
            center_x, center_y = int((x1 + x2) / 2), int((y1 + y2) / 2)
            depth = depth_map[center_y, center_x]
            scaled_depth = self.scale_depth(depth, min_depth, max_depth)
            info.append(f"{class_name}, confidence: {conf:.2f}, depth: {scaled_depth:.2f}")

        return info
