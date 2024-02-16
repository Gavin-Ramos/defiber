import crypto from 'crypto'
import { client } from './client'
import { NextApiRequest } from 'next'
require("dotenv").config();
// Creates a signed hash of key using secret key 
export const hashKey = (key: string) => {
  console.log("key being passed in= ",key);
  const secret : string = process.env.SECRET_KEY!
  const hash = crypto.createHmac('sha256', secret)
    hash.update(key!)
  const  digested : string = hash.digest('hex')
  console.log("hash == ", digested)
  return digested
}

export const createKey = async () => {
  // Randomly generate a key in hex format
  const key : string = crypto.randomBytes(32).toString('hex')
  console.log("key before hashkey function call= ",key);
  // store hash in database
  const hash = hashKey(key)
  await client.authKey.create({
    data: {
      hash
    }
  })

  return key
}

export const checkKey = async (key: string) => {
  const hash = hashKey(key)

  try {
    await client.authKey.findFirstOrThrow({
      where: {
        hash
      }
    })

    return true
  } catch (e) {
    return false
  }
}

export const verifyRequestKey = async (request: NextApiRequest) => {
  const headersList = request.headers
  const key = headersList['x-auth-key']

  if (!key) {
    return false
  }

  const keyFound = await checkKey(key as string)

  return keyFound
}