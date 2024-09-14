from groq import Groq
import os
import random
import base64

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def generate_description(image_path):
    client = Groq()
    
    base64_image = encode_image(image_path)

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Describe this image in detail."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    },
                ],
            }
        ],
        model="llava-v1.5-7b-4096-preview",
    )

    return chat_completion.choices[0].message.content

def process_random_frames(frames_folder, num_frames=5):
    frames = [f for f in os.listdir(frames_folder) if f.endswith('.jpg')]
    selected_frames = random.sample(frames, min(num_frames, len(frames)))

    for frame in selected_frames:
        frame_path = os.path.join(frames_folder, frame)
        description = generate_description(frame_path)

        # Save the description
        output_path = os.path.join(frames_folder, f"description_{frame.split('.')[0]}.txt")
        with open(output_path, 'w') as f:
            f.write(description)
        print(f"Generated and saved description: {output_path}")

if __name__ == "__main__":
    frames_folder = "cv-tagging/frames"
    process_random_frames(frames_folder)