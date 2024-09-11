// pages/api/auth/get-user-name.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const email = req.query.email

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' })
  }

  try {
    const { db } = await connectToDatabase()
    const usersCollection = db.collection('users')

    const user = await usersCollection.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({ name: user.name })
  } catch (error) {
    console.error('Error fetching user name:', error instanceof Error ? error.message : String(error))
    res.status(500).json({ message: 'Failed to fetch user name' })
  }
}

export default handler