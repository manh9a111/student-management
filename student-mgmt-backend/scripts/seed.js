require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Student = require('../src/models/Student');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/students';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('[seed] connected');

  const dataPath = path.join(__dirname, '..', 'seed.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const arr = JSON.parse(raw);

  await Student.deleteMany({});
  const inserted = await Student.insertMany(arr);
  console.log(`[seed] inserted: ${inserted.length}`);
  await mongoose.disconnect();
  console.log('[seed] done');
}

run().catch(err => {
  console.error('[seed] error:', err);
  process.exit(1);
});
