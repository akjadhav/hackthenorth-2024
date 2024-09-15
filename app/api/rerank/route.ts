import { NextRequest, NextResponse } from 'next/server';
import { processJson } from '../../lib/cohere-rerank/process';
import { rerankDocuments } from '../../lib/cohere-rerank/rerank';
import { SpaceDocument, ObjectDocument } from '../../lib/cohere-rerank/process';
import targetData from '../../lib/cohere-rerank/target_data.json';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');
  const intent = searchParams.get('intent');

  if (!query || !intent) {
    return NextResponse.json(
      { error: 'Missing query or intent parameter' },
      { status: 400 }
    );
  }

  const documents = processJson(targetData);

  let filteredDocs;
  if (intent === 'space') {
    filteredDocs = documents.filter(
      (doc): doc is SpaceDocument => doc instanceof SpaceDocument
    );
  } else if (intent === 'object') {
    filteredDocs = documents.filter(
      (doc): doc is ObjectDocument => doc instanceof ObjectDocument
    );
  } else {
    return NextResponse.json(
      { error: 'Invalid intent parameter' },
      { status: 400 }
    );
  }

  const results = await rerankDocuments(query, filteredDocs);

  return NextResponse.json(results);
}
