// pages/api/auth/update-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs'; // For hashing passwords
import { connectToDatabase } from '../../../lib/db'; // Adjust the import path according to your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, otp, newPassword } = req.body;
    const { db } = await connectToDatabase();

    // Assuming OTP verification happens elsewhere or has already occurred
    // Directly proceed to update the password

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Use bcrypt to hash the new password

    // Update the user's password in the database
    const result = await db.collection('users').updateOne(
      { email }, // Assuming 'email' uniquely identifies users
      { $set: { password: hashedPassword }}
    );

    if (result.matchedCount > 0) {
      res.status(200).json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    // Handle any requests that aren't POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}