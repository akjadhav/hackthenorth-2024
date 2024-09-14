import json
from process import process_json
from rerank import rerank_documents

def main():
    # load JSON data
    with open('data.json', 'r') as f:
        json_data = json.load(f)

    # process JSON data into documents
    documents = process_json(json_data)

    print(f"Processed {len(documents)} documents.")

    while True:
        query = input("Enter your query (or 'quit' to exit): ")
        if query.lower() == 'quit':
            break

        # perform reranking
        rerank_response = rerank_documents(query, documents)

        # display results
        print("\nTop 5 relevant results:")
        for i, result in enumerate(rerank_response.results, 1):
            print(f"{i}. Relevance: {result.relevance_score:.4f}")
            print(f"   Content: {result.document.text}")
            print(f"   Metadata: {result.document.metadata}")
            print("---")

if __name__ == "__main__":
    main()