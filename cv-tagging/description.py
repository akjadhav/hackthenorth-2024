import os
import base64
import json
import hashlib
from groq import Groq
from dotenv import load_dotenv
from openai import OpenAI

class ImageDescriber:
    def __init__(self, model="gpt4"):
        self.model = model
        load_dotenv()
        if model == "groq":
            self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        elif model == "gpt4":
            self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        else:
            raise ValueError("Invalid model specified. Choose 'groq' or 'gpt4'.")

    def encode_image(self, image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

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

    def generate_description(self, image_path, object_info):
        base64_image = self.encode_image(image_path)

        objects_with_ids = {}
        for i, obj_string in enumerate(object_info):
            obj_data = self.parse_object_info(obj_string)
            obj_id = self.generate_object_id(obj_data['class'], obj_data['confidence'], obj_data['depth'])
            objects_with_ids[obj_id] = obj_data

        prompt = f"""Analyze this image in detail, focusing on the following:
        1. Overall scene composition and setting
        2. Detailed description of each detected object, including appearance, position, and notable features
        3. Spatial relationships between objects, using the provided depth information
        4. Lighting, colors, and overall atmosphere of the scene
        5. Any visible text or signage

        Object detection and depth information: {json.dumps(objects_with_ids, indent=2)}

        For each detected object, describe its appearance, position, and any relevant details. Use the depth values to explain the spatial arrangement of objects in the scene.

        Provide a structured JSON response with the following format:
        {{
            "objects": {{
                "object_id": {{
                    "class": "detected class",
                    "confidence": 0.0,
                    "depth": 0.0
                }}
            }},
            "descriptions": {{
                "object_id": "detailed description of the object"
            }},
            "scene_analysis": {{
                "composition": "description of overall scene composition",
                "lighting_and_colors": "description of lighting and colors",
                "atmosphere": "description of overall atmosphere",
                "text_and_signage": "description of any visible text or signage"
            }}
        }}

        Ensure that each object_id in the "descriptions" section corresponds to an object_id in the "objects" section.
        Do not include any additional text or explanations outside of the JSON structure.
        """

        if self.model == "groq":
            return self._generate_groq_description(base64_image, prompt)
        elif self.model == "gpt4":
            return self._generate_gpt4_description(image_path, prompt)

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

    def _generate_gpt4_description(self, image_path, prompt):
        with open(image_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')

        response = self.client.chat.completions.create(
            model="gpt-4-vision-preview",
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
        content = content.strip()

        if content.startswith('```json'):
            content = content[7:]
        if content.endswith('```'):
            content = content[:-3]

        content = content.strip()
        
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            print(f"Error: Unable to parse JSON response from API. Error: {str(e)}")
            print(f"Content causing the error: {content}")
            return {"objects": {}, "descriptions": {}, "scene_analysis": {}}