const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Todo = require('../models/Todo');
data = [];

const urlencodedParser = bodyParser.urlencoded({extended: false});

//welcome Page 
router.get('/', (req, res) => {
	res.render('Welcome');
});

//welcome Page 
router.get('/todo', ensureAuthenticated, (req, res) => {
	res.render('todo', {todos: data});
});

//welcome Page 
router.post('/todo', urlencodedParser, (req, res) => {
	const item = new Todo({
		name: req.body.item
	});
	data.push(item);
	item.save();
	res.redirect('/todo');
});


module.exports = router; 
