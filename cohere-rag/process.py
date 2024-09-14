import json
from typing import List, Dict

class Document:
    def __init__(self, id: str, content: str, metadata: Dict):
        self.id = id
        self.content = content
        self.metadata = metadata

class SpaceDocument(Document):
    def __init__(self, space_id: str, space_name: str, floor: int, floor_id: str):
        super().__init__(
            id=space_id,
            content=f"Space: {space_name}, Floor: {floor}",
            metadata={
                "space_name": space_name,
                "floor": floor,
                "floor_id": floor_id
            }
        )

class ObjectDocument(Document):
    def __init__(self, object_id: str, space_name: str, object_class: str, description: str):
        super().__init__(
            id=object_id,
            content=f"Object in {space_name}: {description}",
            metadata={
                "space_name": space_name,
                "object_class": object_class
            }
        )

def process_json(json_data: List[Dict]) -> List[Document]:
    documents = []

    for item in json_data:
        space_doc = SpaceDocument(
            space_id=item['spaceId'],
            space_name=item['space'],
            floor=item['floor'],
            floor_id=item['floorId']
        )
        documents.append(space_doc)

        for obj in item['objects']:
            obj_doc = ObjectDocument(
                object_id=obj['id'],
                space_name=item['space'],
                object_class=obj['class'],
                description=obj['description']
            )
            documents.append(obj_doc)

    return documents

def main():
    with open('camera_data.json', 'r') as f:
        json_data = json.load(f)

    documents = process_json(json_data)

    print(f"Created {len(documents)} documents for reranking.")
    for doc in documents[:5]: 
        print(f"ID: {doc.id}")
        print(f"Content: {doc.content}")
        print(f"Metadata: {doc.metadata}")
        print("---")

if __name__ == "__main__":
    main()