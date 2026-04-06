const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
    [req.user.id]
  );
  res.json(rows);
});

router.post('/', auth, async (req, res) => {
  const { type, amount, category, description, date } = req.body;
  await db.query(
    'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, type, amount, category, description, date || new Date()]
  );
  res.status(201).json({ message: 'Transaction added' });
});

router.put('/:id', auth, async (req, res) => {
  const { type, amount, category, description, date } = req.body;
  await db.query(
    'UPDATE transactions SET type=?, amount=?, category=?, description=?, date=? WHERE id=? AND user_id=?',
    [type, amount, category, description, date, req.params.id, req.user.id]
  );
  res.json({ message: 'Transaction updated' });
});

router.delete('/:id', auth, async (req, res) => {
  await db.query(
    'DELETE FROM transactions WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  res.json({ message: 'Transaction deleted' });
});

module.exports = router;