const express = require('express');
const { getAllTodos, createTodo, deleteTodo, updateTodo } = require('../controllers/todoController');


const router = express.Router();

router.route('/all').get(getAllTodos); 
router.route('/add').post(createTodo); 
router.route('/delete/:id').delete(deleteTodo); 
router.route('/update/:id').put(updateTodo); 

module.exports = router;