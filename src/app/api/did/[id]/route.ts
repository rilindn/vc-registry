import { NextResponse } from "next/server";
import { FlureeClient } from "../../../../../lib/api/ApiBase";

export const GET = async (request: any, context: any) => {
  const did = context.params.id
  if (!did) return
  
  try {
    const res = await FlureeClient.post('/query', {
        "@context": {
          "did": "https://www.w3.org/ns/did/v1#"
        },
        "select": {
          [did]: ["*", {
              "did:authentication": ["*"]
            }, {
              "did:publicKey": ["*", {
                  "did:publicKeyJwk": ["*"]
                }
              ]
            },
            { "did:service": ["*"]}
          ]
        },
        "from": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`
    })
    console.log("🚀 ~ GET ~ res:", res)
    const didDocument = res.data
    console.log("🚀 ~ GET ~ didDocument:", didDocument)

    return new NextResponse(JSON.stringify(didDocument), { status: 200});
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
}