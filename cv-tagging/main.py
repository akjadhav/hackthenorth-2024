import os
import cv2
from process import FrameExtractor
from depth import DepthEstimator
from description import ImageDescriber
from segment import ObjectDetector

def process_video(video_path, output_folder):
    print(f"Processing video: {video_path}")
    # Create output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Extract video name without extension
    video_name = os.path.splitext(os.path.basename(video_path))[0]
    frames_folder = os.path.join(output_folder, f"{video_name}_frames")

    # Step 1: Extract frames from video
    extractor = FrameExtractor(video_path, frames_folder)
    extractor.extract_frames()
    print(f"Finished extracting frames from video: {video_path}")

    # Initialize other processors
    depth_estimator = DepthEstimator()
    image_describer = ImageDescriber()
    object_detector = ObjectDetector()

    # Process each frame
    frames = [f for f in os.listdir(frames_folder) if f.endswith('.jpg')]
    frames.sort()

    for frame in frames:
        frame_path = os.path.join(frames_folder, frame)

        # Step 2: Estimate depth and save depth map
        depth_map = depth_estimator.estimate_depth(frame_path)
        depth_output_path = os.path.join(frames_folder, f"depth_{frame}")
        cv2.imwrite(depth_output_path, depth_map)
        print(f"Processed and saved depth map: {depth_output_path}")

        # Step 3: Generate description and save
        description = image_describer.generate_description(frame_path)
        description_output_path = os.path.join(frames_folder, f"description_{os.path.splitext(frame)[0]}.txt")
        with open(description_output_path, 'w') as f:
            f.write(description)
        print(f"Generated and saved description: {description_output_path}")

        # Step 4: Detect objects and save annotated image
        detections = object_detector.detect_objects(frame_path)
        annotated_img = object_detector.annotate_image(frame_path, detections)
        annotated_output_path = os.path.join(frames_folder, f"annotated_{frame}")
        cv2.imwrite(annotated_output_path, annotated_img)
        print(f"Processed and saved annotated image: {annotated_output_path}")

    print(f"Finished processing video: {video_path}")

def process_all_videos(video_folder, output_folder):
    video_files = [f for f in os.listdir(video_folder) if f.endswith('.mp4')]
    
    for video_file in video_files:
        video_path = os.path.join(video_folder, video_file)
        process_video(video_path, output_folder)
        print(f"Finished processing all videos in folder: {video_folder}")

if __name__ == "__main__":
    video_folder = "videos"
    output_folder = "output"
    process_all_videos(video_folder, output_folder)
