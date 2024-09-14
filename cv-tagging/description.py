from groq import Groq
import base64

class ImageDescriber:
    def __init__(self):
        API_KEY = "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"
        self.client = Groq(api_key=API_KEY)

    def encode_image(self, image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    def generate_description(self, image_path, object_info):
        base64_image = self.encode_image(image_path)

        prompt = f"""Analyze this image in detail, providing a comprehensive description of approximately 10 lines. 
        Focus on the following aspects, with particular emphasis on depth and spatial relationships:
        1. Overall scene composition and setting, including the perceived depth of the scene
        2. Detailed description of each detected object, including its appearance, position, and any notable features
        3. Spatial relationships between objects, using the provided depth information as a key factor
        4. Lighting, colors, and overall atmosphere of the scene, and how they contribute to the perception of depth
        5. Any text or signage visible in the image

        Include the following object detection and depth information in your analysis: {object_info}

        For each detected object, mention its class, confidence score, and depth value, interpreting what these mean in the context of the image. 
        Explain how the depth values relate to the spatial arrangement of objects in the scene, focusing on which objects are closer or farther from the camera.

        Provide a coherent and detailed narrative that combines all these elements into a comprehensive description of the image, with a strong emphasis on the depth and spatial relationships of the objects in the scene.

        Avoid using phrases like "o'clock" to describe positions. Instead, use terms like "in the foreground," "in the background," "to the left," "to the right," etc.
        """

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

        return chat_completion.choices[0].message.content