from transformers import pipeline
import cv2
import numpy as np
import os
import random

def estimate_depth(image_path):
    depth_estimator = pipeline(task="depth-estimation", model="intel-isl/MiDaS-small")
    
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    depth_result = depth_estimator(image_rgb)
    depth_map = depth_result["depth"]
    
    depth_map_normalized = cv2.normalize(depth_map, None, 0, 255, cv2.NORM_MINMAX)
    depth_map_colored = cv2.applyColorMap(depth_map_normalized.astype(np.uint8), cv2.COLORMAP_JET)
    
    return depth_map_colored

def process_random_frames(frames_folder, num_frames=5):
    frames = [f for f in os.listdir(frames_folder) if f.endswith('.jpg')]
    selected_frames = random.sample(frames, min(num_frames, len(frames)))

    for frame in selected_frames:
        frame_path = os.path.join(frames_folder, frame)
        depth_map = estimate_depth(frame_path)

        # Save the depth map
        output_path = os.path.join(frames_folder, f"depth_{frame}")
        cv2.imwrite(output_path, depth_map)
        print(f"Processed and saved depth map: {output_path}")

if __name__ == "__main__":
    frames_folder = "cv-tagging/frames"
    process_random_frames(frames_folder)