import { NextResponse } from "next/server";
import { createIdentifier } from "../../../../utils/did-manager";
import { FlureeClient } from "../../../../lib/api/ApiBase";


export const POST = async (request: any) => {
  const requestBody = await request?.json();
  
  try {
    // create DID and DID document and assign it to the user
    const didDocument = requestBody?.did ? JSON.parse(requestBody.did) : await createIdentifier()
    const res = await FlureeClient.post('/transact', {
      "@context": {
        "fl": "https://ns.flur.ee",
        "did": "https://www.w3.org/ns/did/v1#"
      },
      "ledger": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`,
      "insert": [didDocument]
    })

    return new NextResponse(JSON.stringify(didDocument), { status: 200});
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};
