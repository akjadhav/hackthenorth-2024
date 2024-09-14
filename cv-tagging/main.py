import os
import cv2
import json
from segment import ObjectDetector
from depth import DepthEstimator
from description import ImageDescriber

def process_video(video_path, output_folder):
    print(f"processing video: {video_path}")
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    video_name = os.path.splitext(os.path.basename(video_path))[0]
    video_output_folder = os.path.join(output_folder, video_name)
    os.makedirs(video_output_folder, exist_ok=True)

    object_detector = ObjectDetector()
    depth_estimator = DepthEstimator()
    image_describer = ImageDescriber()

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0
    
    video_data = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % int(fps) == 0:  # process 1 frame per second
            frame_folder = os.path.join(video_output_folder, f"frame_{frame_count:04d}")
            os.makedirs(frame_folder, exist_ok=True)

            frame_path = os.path.join(frame_folder, "frame.jpg")
            cv2.imwrite(frame_path, frame)

            depth_map_colored, depth_map = depth_estimator.estimate_depth(frame_path)
            cv2.imwrite(os.path.join(frame_folder, "depth_map.jpg"), depth_map_colored)

            detections = object_detector.detect_objects(frame_path)
            annotated_img = object_detector.annotate_image(frame_path, detections, depth_map)
            annotated_frame_path = os.path.join(frame_folder, "annotated_frame.jpg")
            cv2.imwrite(annotated_frame_path, annotated_img)

            object_info = object_detector.get_detection_info(detections, depth_map)

            description_data = image_describer.generate_description(annotated_frame_path, object_info)
            with open(os.path.join(frame_folder, "description.json"), 'w') as f:
                json.dump(description_data, f, indent=2)

            frame_data = {
                "frame_number": frame_count,
                "objects": description_data["objects"],
                "descriptions": description_data["descriptions"]
            }
            video_data.append(frame_data)

            print(f"processed frame {frame_count}")

        frame_count += 1

    cap.release()
    
    # save all video data to JSON
    json_path = os.path.join(video_output_folder, f"{video_name}_data.json")
    with open(json_path, 'w') as f:
        json.dump(video_data, f, indent=2)
    
    print(f"finished processing video: {video_path}")

def process_all_videos(video_folder, output_folder):
    video_files = [f for f in os.listdir(video_folder) if f.endswith('.mp4')]
    
    for video_file in video_files:
        video_path = os.path.join(video_folder, video_file)
        process_video(video_path, output_folder)

    print(f"finished processing all videos in folder: {video_folder}")

if __name__ == "__main__":
    video_folder = "videos"
    output_folder = "outputs"
    process_all_videos(video_folder, output_folder)