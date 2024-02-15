import { createKey } from "@/utils/authKeys"
import { verifyUser } from "@/utils/verifyUser"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const user = await verifyUser(req)

    if (!user || !user.isAdmin)  {
      res.status(401).json({
        status: 401,
        statusText: 'Unauthorized',
      })

      return

    } else {
      try {
        const key = await createKey()
        res.status(200).json(key)

      } catch(e) {
        console.error(e)

        res.status(500).json({
          status: 500,
          statusText: 'Internal Server Error',
        })
      }
    }
  }
}