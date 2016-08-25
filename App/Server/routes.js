'use strict';

// @Routes for Server --> API for movies list and history

var app = require('express')();
var mongoose = require('mongoose');

var movieList = require('./listmodel');
var history = require('./historymodel');

// @@ Movie List API section
// # Get the list and send to client
app.get('/mlist', function (req, res) {
  if (movieList) {
    movieList.find(function (err, list) {
      if (err) {
        res.send(err);
      } else {
        var reslist = {};
        reslist.total = list.length;
        reslist.entries = list;
        res.json(reslist);
      }
    });
  } else {
    console.log('No movieList collection found in DB');
  }
});

// # If update invoked from client
app.post('/mlist', function (req, res) {
  var err = 'You can not create or insert movie instance! Please refer API documentation.';
  res.status(500).send({ error: err });
});

// # If delete invoked from client
app.delete('/mlist/:id/:_id', function (req, res) {
  var err = 'You can not delete list nor movie instance! Please refer API documentation.';
  res.status(500).send({ error: err });
});

// @@ History API section
// # Get the session history and send to client
app.get('/history/:session_id', function (req, res) {
  if (history) {
    history.find({
      session_id: req.params.session_id
    }, function (err, stamp) {
      if (err) {
        res.send(err);
      } else {
        res.json(stamp);
      }
    });
  } else {
    console.log('No history collection found in DB');
  }
});

// # If create or update invoked from client
app.post('/history', function (req, res) {
  if (history) {
    (function () {
      var session = req.body;
      var id = session.session_id;
      history.find({
        session_id: id
      }, function (err, stamp) {
        if (err) {
          res.send(err);
        } else if (stamp == null) {
          // Create new history record
          history.create(session, function (err, stamp) {
            if (err) res.send(err);
            res.status(200).send('History successfully created');
          });
        } else {
          // Update existing history record
          history.update({ session_id: id }, session, { upsert: true }, function (err, stamp) {
            if (err) res.status(500).send({ error: err });
            res.status(200).send('History successfully updated');
          });
        }
      });
    })();
  } else {
    console.log('No history collection found in DB');
  }
});

// # If delete invoked from client
app.delete('/history/:session_id', function (req, res) {
  if (history) {
    history.remove({
      session_id: req.params.session_id
    }, function (err, stamp) {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    });
  } else {
    console.log('No history collection found in DB');
  }
});

module.exports = app;