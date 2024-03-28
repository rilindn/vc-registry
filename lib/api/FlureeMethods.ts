import axios from "axios"
import { FlureeClient } from "./ApiBase"

interface IUserPayload {
  "@id": string
  name: string
  email: string
  password: string,
  verificationCode: string,
  emailVerified: boolean
}

export async function findUser(email: string) {
  try {
    // Read user data from file
    const result = await FlureeClient.post('/query', {
      "@context": {
        "email": "user:email",
        "password": "user:password",
        "emailVerified": "user:emailVerified",
        "verificationCode": "user:verificationCode",
        "name": "user:userName",
        "role": "user:role",
        "person": "http://thinkgraph.org/ontologies/core/person#",
        "did": "https://www.w3.org/ns/did/v1#"
      },
      "from": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`,
      "where": {
        "@id": "?id",
        "user:email": email
      },
      "select": {
        "?id": [
          "*", {
            "person:did": [
              "*",
              { "did:authentication": ["*"] },
              {
                "did:publicKey": [
                  "*",
                  { "did:publicKeyJwk": ["*"] }
                ]
              },
              { "did:service": ["*"] }
            ]
          }
        ]
      }
    })
    return result?.data?.[0]
  } catch (err) {
    console.log("🚀 ~ file: ApiMethods.ts:26 ~ fetchFluree ~ err:", err)
    throw err
  }
}

export async function listUsers({ excludeUsers }: {excludeUsers: String[]}) {
  try {
    const result = await FlureeClient.post('/query', {
      "@context": {
        "fl": "https://ns.flur.ee",
        "person": "http://thinkgraph.org/ontologies/core/person#",
        "did": "https://www.w3.org/ns/did/v1#",
        "email": "user:email",
        "password": "user:password",
        "emailVerified": "user:emailVerified",
        "verificationCode": "user:verificationCode",
        "name": "user:userName",
        "role": "user:role",
        "didDocument": "person:did"
      },
      "from": `fluree-jld/387028092978210`,
      "where": [{
        "@id": "?id",
        "user:email": "?email",
        "user:role": "BasicUser"
      }, [
        'filter',
        ...(excludeUsers.map(email =>
          `(not= ?email \"${email}\")`
        ))
      ]],
      "select": { "?id": ["*"] }
    })
    console.log("🚀 ~ file: FlureeMethods.ts:68 ~ listUsers ~ result?.data:", result)
    return result?.data
  } catch (err) {
    console.log("🚀 ~ file: ApiMethods.ts:26 ~ fetchFluree ~ err:", err)
    throw err
  }
}

export async function getCredVerificationRequestByUser(user: string) {
  try {
    const result = await FlureeClient.post('/query', {
      "@context": {
        "fl": "https://ns.flur.ee",
        "credVerReq": "https://www.w3.org/2023/credentials/v2/credential-verification-request#",
        "verifier": "credVerReq:verifier",
        "user": "credVerReq:user",
        "status": "credVerReq:status",
        "createdAt": "credVerReq:createdAt",
        "modifiedAt": "credVerReq:createdAt"
      },
      "from": `fluree-jld/387028092978210`,
      "where": {
        "@id": "?id",
        "@type": "credVerReq:VerificationRequest",
        "user": {
          "@id": user
        }
      },
      "select": {
        "?id": ["*",
          { "user": ["*"] },
          {"verifier": ["*"]}   
        ]
      }
    })
    console.log("🚀 ~ file: getCredVerificationRequestByUser:", result)
    return result?.data
  } catch (err) {
    console.log("🚀 ~ getCredVerificationRequestByUser ~ err:", err)
    throw err
  }
}

export async function getCredVerificationRequestsByVerifier(verifier: any) {
  try {
    const result = await FlureeClient.post('/query', {
      "@context": {
        "fl": "https://ns.flur.ee",
        "credVerReq": "https://www.w3.org/2023/credentials/v2/credential-verification-request#",
        "verifier": "credVerReq:verifier",
        "user": "credVerReq:user",
        "status": "credVerReq:status",
        "createdAt": "credVerReq:createdAt",
        "modifiedAt": "credVerReq:createdAt",
      },
      "from": `fluree-jld/387028092978210`,
      "where": {
        "@id": "?id",
        "@type": "credVerReq:VerificationRequest",
        "verifier": {
          "@id": verifier
        }
      },
      "select": { "?id": [
        "*",
        {"user": ["*"]},
        {"verifier": ["*"]}
      ] }
    })
    console.log("🚀 ~ file: getCredVerificationRequestsByVerifier:", result)
    return result?.data
  } catch (err) {
    console.log("ERROR: getCredVerificationRequestsByVerifier", err)
    throw err
  }
}

export async function registerUser(payload: IUserPayload) {
  try {
    const result = await FlureeClient.post('/transact', {
      "@context": {
        "fl": "https://ns.flur.ee",
        "person": "http://thinkgraph.org/ontologies/core/person#"
      },
      "ledger": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`,
      "insert": [payload]
    })
  } catch (err) {
    console.log("🚀 ~ file: ApiMethods.ts:26 ~ fetchFluree ~ err:", err)
    throw err
  }
}

export async function sendEmail({ recipientEmail, verificationCode }: any) {
  try {
    const result = await axios.post('/api/auth/send-mail', { recipientEmail, verificationCode })
    console.log("🚀 ~ file: ApiMethods.ts:12 ~ registerUser ~ result:", result)
  } catch (err) {
    throw err
  }
}

export async function updateUser(payload: Partial<IUserPayload>) {
  console.log("🚀 ~ file: ApiMethods.ts:10 ~ registerUser ~ payload:", payload)
  try {
    const result = await axios.put('/api/user', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("🚀 ~ file: ApiMethods.ts:29 ~ registerUser ~ result:", result)
  } catch (err) {
    throw err
  }
}

export async function transactFluree(payload: any) {
  try {
    const result = await FlureeClient.post('/transact', payload)
    console.log("🚀 ~ file: FlureeMethods.js:23 ~ transact ~ result:", result.data)
  } catch (err) {
    console.log("🚀 ~ file: ApiMethods.ts:26 ~ fetchFluree ~ err:", err)
    // throw err
  }
}

export async function queryFluree(queryPaylaod: any) {
  try {
    const result = await FlureeClient.post('/query', queryPaylaod)
    return result.data
  } catch (err) {
    console.log("Error:", err)
    throw err
  }
}