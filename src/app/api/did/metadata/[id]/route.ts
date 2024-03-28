import { NextResponse } from "next/server";

import { FlureeClient } from "../../../../../../lib/api/ApiBase";

export const GET = async (request: any, context: any) => {
  const did = context.params.id
  if (!did) return
  
  try {
    const res = await FlureeClient.post('/query', {
      "@context": {
        "did": "https://www.w3.org/ns/did/v1#",
        "schema": "https://schema.org#",
        "name": "schema:name",
        "description": "schema:description"
      },
      "where": {
        "@id": "?s",
        "did:metadataFor": did
      },
      "select": {"?s": ["*"]},
      "from": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`
    })
    const didDocumentMetadata = res.data?.[0]

    return new NextResponse(JSON.stringify(didDocumentMetadata), { status: 200});
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
}