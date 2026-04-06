const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT b.id, b.category, b.amount AS budget_limit,
      COALESCE(SUM(t.amount), 0) AS spent,
      b.amount - COALESCE(SUM(t.amount), 0) AS remaining
     FROM budgets b
     LEFT JOIN transactions t ON t.user_id = b.user_id
       AND t.category = b.category
       AND t.type = 'expense'
       AND t.date BETWEEN b.start_date AND b.end_date
     WHERE b.user_id = ?
     GROUP BY b.id`,
    [req.user.id]
  );
  res.json(rows);
});

router.post('/', auth, async (req, res) => {
  const { category, amount, start_date, end_date } = req.body;
  await db.query(
    'INSERT INTO budgets (user_id, category, amount, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, category, amount, start_date, end_date]
  );
  res.status(201).json({ message: 'Budget created' });
});

router.get('/goals', auth, async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM savings_goals WHERE user_id = ?',
    [req.user.id]
  );
  res.json(rows);
});

router.post('/goals', auth, async (req, res) => {
  const { goal_name, target_amount, current_amount, deadline } = req.body;
  await db.query(
    'INSERT INTO savings_goals (user_id, goal_name, target_amount, current_amount, deadline) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, goal_name, target_amount, current_amount || 0, deadline]
  );
  res.status(201).json({ message: 'Goal created' });
});

router.put('/goals/:id', auth, async (req, res) => {
  const { current_amount } = req.body;
  await db.query(
    'UPDATE savings_goals SET current_amount = ? WHERE id = ? AND user_id = ?',
    [current_amount, req.params.id, req.user.id]
  );
  res.json({ message: 'Goal updated' });
});

module.exports = router;