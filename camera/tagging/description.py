import os
import base64
import cv2
import json
import hashlib
from groq import Groq
from dotenv import load_dotenv
from openai import OpenAI
from tagging.prompts import get_space_prompt, get_object_prompt

class ImageDescriber:
    def __init__(self, model="openai"):
        self.model = model
        load_dotenv()

        if model == "groq":
            self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        elif model == "openai":
            self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        else:
            raise ValueError("Invalid model specified. Choose 'groq' or 'openai'.")

    def encode_image(self, frame):
        success, encoded_frame = cv2.imencode('.jpg', frame)
        
        if success:
            return base64.b64encode(encoded_frame.tobytes()).decode('utf-8')
        else:
            raise ValueError("Image encoding failed")

    def generate_object_id(self, class_name, confidence, depth):
        object_string = f"{class_name}_{confidence}_{depth}"
        return hashlib.md5(object_string.encode()).hexdigest()[:8]

    def parse_object_info(self, object_info_string):
        parts = object_info_string.split(', confidence: ')
        class_name = parts[0]
        confidence, depth = parts[1].split(', depth: ')

        return {
            'class': class_name,
            'confidence': float(confidence),
            'depth': float(depth)
        }

    def generate_description(self, frame, variant='space', cls=None):
        base64_image = self.encode_image(frame)

        prompt = get_space_prompt() if variant == 'space' else get_object_prompt(cls)

        if self.model == "groq":
            return self._generate_groq_description(base64_image, prompt)
        elif self.model == "openai":
            model = "gpt-4-vision-preview" if variant == 'space' else 'gpt-4o-mini'
            return self._generate_openai_description(base64_image, prompt, model)

    def _generate_groq_description(self, base64_image, prompt):
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
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

        return self._process_api_response(chat_completion.choices[0].message.content)

    def _generate_openai_description(self, base64_image, prompt, model):
        response = self.client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1024
        )
        
        return self._process_api_response(response.choices[0].message.content)

    def _process_api_response(self, content):
        return content
