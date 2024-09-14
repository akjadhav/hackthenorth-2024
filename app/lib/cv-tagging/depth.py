from transformers import DPTForDepthEstimation, DPTImageProcessor
import torch
import cv2
import numpy as np

class DepthEstimator:
    def __init__(self, model_name="Intel/dpt-large"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = DPTForDepthEstimation.from_pretrained(model_name).to(self.device)
        self.image_processor = DPTImageProcessor.from_pretrained(model_name)

    def estimate_depth(self, image_path):
        # load and preprocess the image
        image = cv2.imread(image_path)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        inputs = self.image_processor(images=image_rgb, return_tensors="pt").to(self.device)

        # perform depth estimation
        with torch.no_grad():
            outputs = self.model(**inputs)
            predicted_depth = outputs.predicted_depth

        # interpolate to original size
        prediction = torch.nn.functional.interpolate(
            predicted_depth.unsqueeze(1),
            size=image.shape[:2],
            mode="bicubic",
            align_corners=False,
        ).squeeze()

        # normalize and colorize the depth map
        depth_map = prediction.cpu().numpy()
        depth_map_normalized = cv2.normalize(depth_map, None, 0, 255, cv2.NORM_MINMAX)
        depth_map_colored = cv2.applyColorMap(depth_map_normalized.astype(np.uint8), cv2.COLORMAP_INFERNO)
        
        return depth_map_colored, depth_map