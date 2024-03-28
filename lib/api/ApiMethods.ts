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

export async function fetchFluree() {
  try {
    const result = await FlureeClient.post('/query', {
      "from": "fluree-jld/387028092977721",
      "where": {
        "@id": "?id",
        "@type": "Yeti"
      },
      "select": { "?id": ["@type", "age", "name", "verified"] }
    })
    return result
  } catch (err) {
    console.log("ERROR: fetchFluree", err)
    throw err
  }
}

export async function registerUser(payload: IUserPayload) {
  try {
    const result = await axios.post('/api/user', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("🚀 ~ file: ApiMethods.ts:29 ~ registerUser ~ result:", result.data)
    return result
  } catch (err) {
    console.log("ERROR: registerUser", err)
    throw err
  }
}


export async function createCredential({issuer, userId}: {issuer: string, userId: string}) {
  try {
    const result = await axios.post('/api/user/credential', {issuer, userId}, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("🚀 ~ file: ApiMethods.ts:29 ~ registerUser ~ result:", result.data)
    return result
  } catch (err) {
    console.log("ERROR: createCredental", err)
    throw err
  }
}

export async function createDID(data?: any) {
  try {
    const result = await axios.post('/api/did', data || {} ,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("🚀 ~ file: ApiMethods.ts:29 ~ createDID ~ result:", result.data)
    return result
  } catch (err) {
    console.log("ERROR: createDID", err)
    throw err
  }
}

export async function getDidDocument(did: string) {
  try {
    const result = await axios.get(`/api/did/${did}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("🚀 ~ file: ApiMethods.ts:29 ~ createDID ~ result:", result.data)
    return result
  } catch (err) {
    console.log("ERROR: getDidDocument", err)
    throw err
  }
}

export async function getDidDocumentMetadata(did: string) {
  try {
    const result = await axios.get(`/api/did/metadata/${did}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("🚀 ~ file: ApiMethods.ts:29 ~ createDID ~ result:", result.data)
    return result
  } catch (err) {
    console.log("ERROR: getDidDocumentMetadata", err)
    throw err
  }
}

export async function createDidMetadata(payload: any) {
  try {
    const result = await axios.post('/api/did/metadata', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("🚀 ~ file: ApiMethods.ts:29 ~ createDID ~ result:", result.data)
    return result.data
  } catch (err) {
    console.log("ERROR: createDidMetadata", err)
    throw err
  }
}

export async function sendEmail({ recipientEmail, verificationCode, locationOrigin }: any) {
  try {
    const result = await axios.post('/api/auth/send-mail', {recipientEmail, verificationCode, locationOrigin})
    return result?.data
  } catch (err) {
    console.log("ERROR: sendEmail", err)
    throw err
  }
}

export async function updateUser(payload: any) {
  try {
    const result = await axios.put('/api/user', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("🚀 ~ updateUser ~ result:", result.data)
    return result
  } catch (err) {
    console.log("ERROR: updateUser", err)
    throw err
  }
}

export async function requestCredVerification({ verifier, user }: any) {
  try {
    const result = await axios.post('/api/user/credential/request-verification', {verifier, user})
    return result
  } catch (err) {
    console.log("ERROR: requestCredVerification", err)
    throw err
  }
}

export async function updateCredVerification({ id, status }: any) {
  try {
    const result = await axios.put('/api/user/credential/request-verification', {id, status})
    return result
  } catch (err) {
    console.log("ERROR: updateCredVerification", err)
    throw err
  }
}
