import { NextRequest, NextResponse } from 'next/server';
import { processJson } from '../../lib/cohere-rerank/process';
import { rerankDocuments } from '../../lib/cohere-rerank/rerank';
import { SpaceDocument, ObjectDocument } from '../../lib/cohere-rerank/process';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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

  const entities = await convex.query(api.entities.getAll, {});
  const documents = processJson(entities);

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
