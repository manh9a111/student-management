const express = require('express');
const Student = require('../models/Student');

const router = express.Router();

// GET /students?keyword=abc&page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const { keyword = '', page = 1, limit = 10 } = req.query;
    const q = keyword
      ? {
          $or: [
            { fullName: { $regex: keyword, $options: 'i' } },
            { studentCode: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } }
          ]
        }
      : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Student.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Student.countDocuments(q)
    ]);
    return res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1
    });
  } catch (err) {
    console.error('[students/list] error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /students/:id
router.get('/:id', async (req, res) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    return res.json(s);
  } catch (err) {
    console.error('[students/get] error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /students
router.post('/', async (req, res) => {
  try {
    const s = new Student(req.body);
    await s.save();
    return res.status(201).json(s);
  } catch (err) {
    console.error('[students/create] error', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'studentCode already exists' });
    }
    return res.status(400).json({ message: 'Invalid data', detail: err.message });
  }
});

// PUT /students/:id
router.put('/:id', async (req, res) => {
  try {
    const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ message: 'Not found' });
    return res.json(s);
  } catch (err) {
    console.error('[students/update] error', err);
    return res.status(400).json({ message: 'Invalid data', detail: err.message });
  }
});

// DELETE /students/:id
router.delete('/:id', async (req, res) => {
  try {
    const s = await Student.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('[students/delete] error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
