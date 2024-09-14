import { NextRequest, NextResponse } from "next/server";
import { processJson } from "@/lib/process";
import { rerankDocuments } from "@/lib/rerank";
import { SpaceDocument, ObjectDocument } from "@/lib/process";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");
  const intent = searchParams.get("intent");

  if (!query || !intent) {
    return NextResponse.json({ error: "Missing query or intent parameter" }, { status: 400 });
  }

  const jsonData = require("../../../target_data.json");

  const documents = processJson(jsonData);

  let filteredDocs;
  if (intent === "space") {
    filteredDocs = documents.filter((doc) => doc instanceof SpaceDocument);
  } else if (intent === "object") {
    filteredDocs = documents.filter((doc) => doc instanceof ObjectDocument);
  } else {
    return NextResponse.json({ error: "Invalid intent parameter" }, { status: 400 });
  }

  const results = await rerankDocuments(query, filteredDocs);

  return NextResponse.json(results);
}