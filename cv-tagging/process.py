import cv2
import os

def extract_frames(video_path, output_folder):
    # Create output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Open the video file
    video = cv2.VideoCapture(video_path)
    
    frame_count = 0
    while True:
        # Read a frame from the video
        success, frame = video.read()
        if not success:
            break
        
        # Save the frame as a JPEG image
        frame_path = os.path.join(output_folder, f"{frame_count:04d}.jpg")
        cv2.imwrite(frame_path, frame)
        
        frame_count += 1

    video.release()
    print(f"Extracted {frame_count} frames from the video.")

if __name__ == "__main__":
    video_path = "cv-tagging/video-files/video1.mp4"
    output_folder = "cv-tagging/frames"
    extract_frames(video_path, output_folder)