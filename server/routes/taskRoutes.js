const express = require('express');
const c = require('../controllers/taskController');

const router = express.Router();

router.get('/stats', c.getStats); // must be before '/:id' routes
router.route('/').get(c.getTasks).post(c.createTask);
router.route('/:id').put(c.updateTask).delete(c.deleteTask);
router.patch('/:id/toggle', c.toggleTask);

module.exports = router;
