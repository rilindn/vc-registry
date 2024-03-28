import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

import { FlureeClient } from "../../../../../../lib/api/ApiBase";

export const POST = async (request: any) => {
  const requestBody = await request.json();
  const { verifier, user } = requestBody;

  if (!verifier) {
    return new NextResponse("verifier not provided!", { status: 401 });
  }

  if (!user) {
    return new NextResponse("User not provided!", { status: 401 });
  }

  try {
    // create credential verification request and assign it to the user
    const vcVerificationRequest = {
      "@context": {
        "credVerReq": "https://www.w3.org/2023/credentials/v2/credential-verification-request#"
      },
      "@id": uuidv4(),
      "@type": 'credVerReq:VerificationRequest',
      "credVerReq:verifier": {
        "@id": verifier
      },
      "credVerReq:user": {
        "@id": user
      },
      "credVerReq:status": 'pending',
      "credVerReq:createdAt": new Date(),
      "credVerReq:modifiedAt": new Date(),
    }

    const result = await FlureeClient.post('/transact', {
      "@context": {
        "fl": "https://ns.flur.ee",
        "credVerReq": "https://www.w3.org/2023/credentials/v2/credential-verification-request#"
      },
      "ledger": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`,
      "insert": [vcVerificationRequest]
    })

    // const updateUserRes = await FlureeClient.post('/transact', {
    //   "@context": {
    //     "fl": "https://ns.flur.ee",
    //     "did": "https://www.w3.org/ns/did/v1#",
    //     "cred": "https://www.w3.org/ns/credentials/v2",
    //   },
    //   "ledger": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`,
    //   "insert": [{
    //     "@id": userId,
    //     "user:cred": {"@id": credential['@id']}
    //   }]
    // })
    // console.log("🚀 ~ file: route.ts:50 ~ POST ~ updateUserRes:", updateUserRes)

    return new NextResponse(JSON.stringify(vcVerificationRequest), { status: 200 });
  } catch (err: any) {
    console.log("🚀 ~ file: route.ts:111 ~ POST ~ err:", err)
    return new NextResponse(err, {
      status: 500,
    });
  }
};

export const PUT = async (request: any) => {
  const requestBody = await request.json();
  const { id, status } = requestBody;
  console.log("🚀 ~ PUT ~ { id, status }:", { id, status })

  if (!id) {
    return new NextResponse("Verification ID not provided!", { status: 401 });
  }

  try {
    console.log('asdads', {
      "@context": {
        "fl": "https://ns.flur.ee",
        "credVerReq": "https://www.w3.org/2023/credentials/v2/credential-verification-request#"
      },
      "ledger": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`,
      "where": {
        "@id": id,
        "status": "?st"
      },
      "delete": {
        "@id": id,
        "status": "?st"
      },
      "insert": [
        {
          "@id": id,
          status
        }
      ]
    })
    const result = await FlureeClient.post('/transact', {
      "@context": {
        "fl": "https://ns.flur.ee",
        "status": "credVerReq:status",
        "credVerReq": "https://www.w3.org/2023/credentials/v2/credential-verification-request#"
      },
      "ledger": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`,
      "where": {
        "@id": id,
        "status": "?st"
      },
      "delete": {
        "@id": id,
        "status": "?st"
      },
      "insert": [
        {
          "@id": id,
          status
        }
      ]
    })

    return new NextResponse('Verification request updated!', { status: 200 });
  } catch (err: any) {
    console.log("🚀 ~ file: route.ts:111 ~ POST ~ err:", err)
    return new NextResponse(err, {
      status: 500,
    });
  }
};