const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllTodos = catchAsyncErrors(async (req, res, next) => {
    const todos = await prisma.todo.findMany();
    res.status(200).json({
        success: true,
        message: "All Todos fetched successfully",
        todos
    });
});


exports.createTodo = catchAsyncErrors(async (req, res, next) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: "Title and description are required"
        });
    }

    const todo = await prisma.todo.create({
        data: { title, description, completed: false }
    });

    res.status(201).json({
        success: true,
        message: "Todo created successfully",
        todo
    });
});


exports.deleteTodo = catchAsyncErrors(async (req, res, next) => {
    const id = parseInt(req.params.id);

    await prisma.todo.delete({
        where: { id }
    });

    res.status(200).json({
        success: true,
        message: `Deleted Todo with id -> ${id} successfully`,
    });
});


exports.updateTodo = catchAsyncErrors(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { title, description, completed } = req.body;

    const todo = await prisma.todo.update({
        where: { id },
        data: { title, description, completed }
    });

    res.status(200).json({
        success: true,
        message: `Updated Todo with id -> ${id} successfully`,
        todo
    });
});
