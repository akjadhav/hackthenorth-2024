from tagging.segment import ObjectDetector
from tagging.description import ImageDescriber
import cv2
import os

VIDEO_DIR = 'videos'
VIDEOS = ['floor-3.mp4']

def read_frame(video):
    cap = cv2.VideoCapture(video)
    num_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)

    cap.set(cv2.CAP_PROP_FRAME_COUNT, int(num_frames / 2))
    ret, frame = cap.read()

    if not ret:
        exit()
    
    cap.release()

    return frame

def get_bboxes(detector, frame):
    return detector.detect_objects(frame)

def get_bbox(detector, video, frame, bbox):
    x1, y1, x2, y2, conf, cls = bbox
    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

    img = frame[y1:y2, x1:x2]
    cv2.imshow(f"{cls} in {video}", img)

    while True:
        if cv2.waitKey(1) & 0xFF == ord('q'):
            cv2.destroyAllWindows()
            break
    
    return img

def get_description(describer, frame, cls):
    return describer.generate_description(frame, 'object', cls)

if __name__ == '__main__':
    detector = ObjectDetector()
    describer = ImageDescriber()

    for video in VIDEOS:
        frame = read_frame(os.path.join(VIDEO_DIR, video))
        bboxes = get_bboxes(detector, frame)

        for bbox in bboxes:
            img = get_bbox(detector, video, frame, bbox)
            description = get_description(describer, img, bbox[5])
            print(bbox[5])
            print(description)
        
        space = describer.generate_description(frame)
        print(space)
    
    cv2.destroyAllWindows()
