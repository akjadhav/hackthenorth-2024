import cv2
import os

class FrameExtractor:
    def __init__(self, video_path, output_folder):
        self.video_path = video_path
        self.output_folder = output_folder

    def extract_frames(self):
        if not os.path.exists(self.output_folder):
            os.makedirs(self.output_folder)

        video = cv2.VideoCapture(self.video_path)
        fps = int(video.get(cv2.CAP_PROP_FPS))
        frame_count = 0

        while True:
            success, frame = video.read()
            if not success:
                break
            
            if frame_count % fps == 0:  # Extract one frame per second
                frame_path = os.path.join(self.output_folder, f"{frame_count:04d}.jpg")
                cv2.imwrite(frame_path, frame)
            
            frame_count += 1

        video.release()
        print(f"Extracted frames from the video at 1 fps.")