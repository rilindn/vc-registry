import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

import { FlureeClient } from "../../../../../lib/api/ApiBase";


export const POST = async (request: any) => {
  const requestBody = await request.json();
  const {did, name, description} = requestBody
  try {
    const id = uuidv4()
    const didDocumentMetadata = {
      "@id": id,
      "@type": "did:Metadata",
      "did:metadataFor": did,
      "schema:name": name,
      "schema:description": description
    }

    const res = await FlureeClient.post('/transact', {
      "@context": {
        "fl": "https://ns.flur.ee",
        "did": "https://www.w3.org/ns/did/v1#",
        "schema": "https://schema.org#",
      },
      "ledger": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`,
      "insert": [didDocumentMetadata]
    })

    return new NextResponse(JSON.stringify(didDocumentMetadata), { status: 200});
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};

export const GET = async (request: any) => {
  return new NextResponse("You don't have access here!", { status: 401 })
}