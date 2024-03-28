import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

import { FlureeClient } from "../../../../lib/api/ApiBase";
import { findUser } from "../../../../lib/api/FlureeMethods";

export const POST = async (request: any) => {
  const requestBody = await request.json();
  const { email, password, did } = requestBody;

  if (!email) {
    return new NextResponse("Email not provided!", { status: 401 });
  }

  const existingUser = await findUser(email)
  // console.log("🚀 ~ file: route.ts:67 ~ POST ~ existingUser:", existingUser)

  if (existingUser) {
    return new NextResponse("Email is already in use!", { status: 400 });
  }


  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4()
    const currentDate = new Date().toISOString()
    const user = {
      "@id": `sys:user:${id}`,
      "@type": "User",
      // We have not created the person yet, so we cannot add the ID below.
      // "person:personId": { "@id": `person:${id}` },
      "user:userName": requestBody.name,
      "user:email": email,
      "user:role": "BasicUser",
      "user:password": hashedPassword,
      "user:dateCreated": currentDate,
      // This assumes that this user is being created by himself as he/she's creating the account
      // Otherwise it will be someone else's Id such as an admin
      "user:createdUserId": `sys:user:${id}`,
      "user:dateModified": currentDate,
      // This assumes that this user is being created by himself as he/she's creating the account or modifing the account
      // Otherwise it will be someone else's Id such as an admin
      "user:modifiedUserId": `sys:user:${id}`,
      "user:verificationCode": requestBody.verificationCode,
      "user:emailVerified": false,
      "person:did": [{ "@id": did }],
    };
    console.log("🚀 ~ POST ~ user:", user)

    const result = await FlureeClient.post('/transact', {
      "@context": {
        "fl": "https://ns.flur.ee",
        "person": "http://thinkgraph.org/ontologies/core/person#"
      },
      "ledger": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`,
      "insert": [user]
    })
    return new NextResponse("User is registered successfully!", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};

export const PUT = async (request: any) => {
  const requestBody = await request.json();
  const { email, updateData, replace = false } = requestBody;

  if (!email) {
    return new NextResponse("Invalid email!", { status: 400 });
  }
  if (typeof updateData !== 'object' && updateData !== null) {
    return new NextResponse("Invalid update data!", { status: 400 });
  }

  const existingUser = await findUser(email)
  console.log("🚀 ~ existingUser:", existingUser)
  if (!existingUser) {
    return new NextResponse("User not found!", { status: 404 });
  }

  try {
    console.log('transactio', {
      "@context": {
        "emailVerified": "user:emailVerified"
      },
      "ledger": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`,
      ...(replace && {
        "where": {
          "@id": existingUser['@id'],
          ...Object.fromEntries(Object.keys(updateData).map(key => [key, "?anyValues"]))
        },
        "delete": {
          "@id": existingUser['@id'],
          ...Object.fromEntries(Object.keys(updateData).map(key => [key, "?anyValues"]))
        }
      }),
      "insert": [
        {
          "@id": existingUser['@id'],
          ...updateData
        }
      ]
    })
    const result = await FlureeClient.post('/transact', {
      "@context": {
        "emailVerified": "user:emailVerified"
      },
      "ledger": `fluree-jld/${process.env.NEXT_PUBLIC_LEDGER}`,
      ...(replace && {
        "where": {
          "@id": existingUser['@id'],
          ...Object.fromEntries(Object.keys(updateData).map(key => [key, "?anyValues"]))
        },
        "delete": {
          "@id": existingUser['@id'],
          ...Object.fromEntries(Object.keys(updateData).map(key => [key, "?anyValues"]))
        }
      }),
      "insert": [
        {
          "@id": existingUser['@id'],
          ...updateData
        }
      ]
    })
    return new NextResponse("User updated successfully!", { status: 200 });
  } catch (err: any) {
    console.log("❌ USER: PUT", err)
    return new NextResponse(err, {
      status: 500,
    });
  }
};

export const GET = async (request: any) => {
  return new NextResponse('test', { status: 200 })
}