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

    def detect_objects(self, frame, depth_map):
        results = self.model(frame)
        
        pred_classes = results["instances"].pred_classes
        pred_boxes = results["instances"].pred_boxes
        pred_scores = results["instances"].scores

        pred_boxes_list = pred_boxes.tensor.tolist()
        
        output = []

        min_depth = np.min(depth_map)
        max_depth = np.max(depth_map)

        for box, score, cls in zip(pred_boxes_list, pred_scores, pred_classes):
            class_name = self.class_names[cls.item()]
            x1, y1, x2, y2 = map(int, box)
            
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(depth_map.shape[1] - 1, x2), min(depth_map.shape[0] - 1, y2)
            
            depth_roi = depth_map[y1:y2+1, x1:x2+1]
            avg_depth = np.mean(depth_roi)
            
            normalized_depth = self.normalize_depth(avg_depth, min_depth, max_depth)
            
            output.append(box + [score.item(), class_name, normalized_depth.item()])

        return output

    def normalize_depth(self, depth_value, min_depth, max_depth):
        # Normalize the depth value to range [0, 1]
        # 0 represents the closest point, 1 represents the furthest point
        return (depth_value - min_depth) / (max_depth - min_depth)

    def annotate_image(self, frame, detections):
        img = np.copy(frame)
        
        for det in detections:
            x1, y1, x2, y2, conf, class_name, depth = det
            
            cv2.rectangle(img, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            cv2.putText(img, f"{class_name}: {conf:.2f}, depth: {depth:.2f}", 
                        (int(x1), int(y1)-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        return img