// lib/db.ts

import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const clientOptions: MongoClientOptions = {};

const client = new MongoClient(uri, clientOptions);

export async function connectToDatabase() {
  await client.connect();
  const db = client.db('mydatabase');
  
  // Create courses collection if it doesn't exist
  await db.createCollection('courses');

  // Create quizzes collection if it doesn't exist
  await db.createCollection('quizzes');

  // Create student_course collection if it doesn't exist
  await db.createCollection('student_course');

  // Create results collection if it doesn't exist
  await db.createCollection('results');

  // Initialize the enrollment_id counter
  const countersCollection = db.collection('counters');
  await countersCollection.insertOne({ _id: new ObjectId(), enrollment_id: 'enrollment_id', sequence_value: 999 });

  return { db, client };
}