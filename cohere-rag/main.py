import json
from process import SpaceDocument, ObjectDocument, process_json
from rerank import rerank_documents

def display_results(results, title):
    print(f"\n{title}")
    for i, result in enumerate(results.results, 1):
        print(f"{i}. Relevance: {result.relevance_score:.4f}")
        print(f"   Content: {result.document.text}")
        print(f"   Metadata: {result.document.metadata}")
        print("---")

def main():
    # load and process the JSON data
    with open('target_data.json', 'r') as f:
        json_data = json.load(f)
    
    documents = process_json(json_data)

    while True:
        # Ask user for reranking intent
        intent = input("Enter 'space' to rerank spaces, 'object' to rerank objects, or 'quit' to exit: ").lower()
        
        if intent == 'quit':
            break
        elif intent not in ['space', 'object']:
            print("Invalid choice. Please enter 'space', 'object', or 'quit'.")
            continue

        # Get user query
        query = input("Enter your query: ")

        # Filter documents based on user's intent
        if intent == 'space':
            filtered_docs = [doc for doc in documents if isinstance(doc, SpaceDocument)]
            title = "Reranking spaces:"
        else:  # intent == 'object'
            filtered_docs = [doc for doc in documents if isinstance(doc, ObjectDocument)]
            title = "Reranking objects:"

        # Perform reranking
        rerank_results = rerank_documents(query, filtered_docs)

        # Display results
        display_results(rerank_results, title)

if __name__ == "__main__":
    main()