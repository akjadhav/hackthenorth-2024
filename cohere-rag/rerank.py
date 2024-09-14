import os
import cohere
from dotenv import load_dotenv
from typing import List
from process import Document

load_dotenv("../.env.local")

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