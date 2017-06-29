const express = require('express');
const models = require("../models");
const router = express.Router();

//This goes through the entire model, takes the results into todos, then sorts the results into two variables, taking items from our todo object and filters them by t or f in the completed column.  This makes the mustaches work because it's the whole entry that's getting filtered into comp/uncomp, so {{item}} works.  Also don't forget [[]] for some dumb reason when ordering.
router.get('/', function(req, res) {
  models.todo.findAll({order: [['createdAt', 'DESC']]})
    .then(todos => {
      const comp = todos.filter(todo => !todo.completed);
      const uncomp = todos.filter(todo => todo.completed);
      res.render('todos', {
        comp: comp,
        uncomp: uncomp
      });
    });
})

router.post('/todo', function(req, res) {
  models.todo.create({
      item: req.body.todoText
    })
    .then(function() {
      res.redirect('/');
    })
})
//Hey dumbass, req.body takes name: value pairs from the HTML, so make sure you're calling by name and the value you want is in value. Don't forget this!!! Also fuck promises.
router.post('/flip', function(req, res) {
  const id = Number(req.body.completeTodo);
  models.todo.update({
    completed: 't'
  }, {
    where: {
      id: id
    }
  }).then(() => res.redirect('/'));
})

router.post('/delete', function(req, res) {
  const id = Number(req.body.deleteTodo);
  models.todo.destroy({
    where: {
      id: id
    }
  }).then(() => res.redirect('/'));
})

router.post('/update', function(req, res) {
  const id = Number(req.body.updateTodo);
  models.todo.update({
    item: req.body.updateText
  }, {
    where: {
      id: id
    }
  }).then(() => res.redirect('/'));
})

router.post('/destroy', function(req,res)  {
  models.todo.destroy({
    where:  {
      completed: 't'
    }
  }).then (() => res.redirect('/'));
})

module.exports = router;
