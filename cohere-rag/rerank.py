import json
import os
import cohere
from dotenv import load_dotenv
from typing import List
from process import Document, process_json

load_dotenv("../.env.local")
print(os.getenv('CO_API_KEY'))

co = cohere.Client(api_key=os.getenv('CO_API_KEY'))

def prepare_documents_for_rerank(documents: List[Document]):
    return [
        {
            "id": doc.id,
            "text": doc.content,
            "metadata": doc.metadata
        } for doc in documents
    ]

def rerank_documents(query: str, documents: List[Document], top_n: int = 5):
    prepared_docs = prepare_documents_for_rerank(documents)
    
    results = co.rerank(
        model="rerank-english-v3.0",
        query=query,
        documents=prepared_docs,
        top_n=top_n,
        return_documents=True
    )
    
    return results

def main():
    # load and process the JSON data
    with open('camera_data.json', 'r') as f:
        json_data = json.load(f)
    
    documents = process_json(json_data)

    # example queries
    space_query = "Find conference rooms on the third floor"
    object_query = "Locate suitcases in any space"

    # rerank for spaces
    print("Reranking spaces:")
    space_results = rerank_documents(space_query, [doc for doc in documents if isinstance(doc, SpaceDocument)])
    for result in space_results:
        print(f"Relevance: {result.relevance_score:.4f}")
        print(f"Content: {result.document['text']}")
        print(f"Metadata: {result.document['metadata']}")
        print("---")

    # rerank for objects
    print("\nReranking objects:")
    object_results = rerank_documents(object_query, [doc for doc in documents if isinstance(doc, ObjectDocument)])
    for result in object_results:
        print(f"Relevance: {result.relevance_score:.4f}")
        print(f"Content: {result.document['text']}")
        print(f"Metadata: {result.document['metadata']}")
        print("---")

if __name__ == "__main__":
    main()