import { CohereClient } from "cohere-ai";
import { Document } from "./process";

const cohere = new CohereClient({
  token: process.env.CO_API_KEY || "",
});

interface PreparedDocument {
  [key: string]: string;
}

function prepareDocumentsForRerank(documents: Document[]): PreparedDocument[] {
  return documents.map((doc) => ({
    id: doc.id,
    text: doc.content,
  }));
}

export async function rerankDocuments(query: string, documents: Document[], topN: number = 5) {
  const preparedDocs = prepareDocumentsForRerank(documents);

  const results = await cohere.rerank({
    model: "rerank-english-v3.0",
    query,
    documents: preparedDocs,
    topN: topN,
  });

  return results.results.map(result => ({
    ...result,
    originalDocument: documents[result.index],
  }));
}