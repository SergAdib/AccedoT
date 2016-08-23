// @Routes for Server --> API for movies list and history

var app       = require('express');
var mongoose  = require('mongoose');

var list = require('./listmodel');
var hist   = require('./historymodel');
mongoose.model('movieList', list);
mongoose.model('movieList', hist);

var movieList = mongoose.model('movieList');
var history = mongoose.model('history');

// @@ Movie List API section
// # Get the list and send to client
app.get('/mlist', function(req, res) {
  if (movieList) {
    movieList.find(function(err, list) {
      if (err) {
        res.send(err)
      }
      else {
        res.json(list);
      }
    });
  } else {
    console.log('movieList not found');
  }
});

// # If update invoked from client
app.post('/mlist', function(req, res) {
  let err = 'You can not create and insert movie instance! Please refer API documentation.';
  res.status(500).send({error: err});
});

// # If delete invoked from client
app.delete('/mlist', function(req, res) {
  let err = 'You can not delete list nor movie instance! Please refer API documentation.';
  res.status(500).send({error: err});
});

// @@ History API section
// # Get the session history and send to client
app.get('/history/:session_id', function(req, res) {
  if (history) {
    history.find({
      session_id : req.params.session_id
    }, function(err, stamp) {
      if (err) {
        res.send(err)
      }
      else {
        res.json(stamp);
      }
    });
  } else {
    console.log('History not found');
  }
});

// # If create or update invoked from client
app.post('/history', function(req, res) {
  if (history) {
    let session = req.body;
    let id = session.session_id;
    history.find({
      session_id : id
    }, function(err, stamp) {
      if (err) {
        res.send(err)
      }
      else if (stamp == null) {
        // Create new history record
        history.create(session, function(err, stamp) {
          if (err)
            res.send(err);
          res.status(200).send('History successfully created');
        });
      } else {
        // Update existing history record
        history.update({session_id : id}, session, {upsert:true}, function(err, stamp) {
          if (err)
            res.status(500).send({ error: err });
          res.status(200).send('History successfully updated');
        });
      }
    });
  } else {
    console.log('History not found');
  }
});

// # If delete invoked from client
app.delete('/history/:session_id', function(req, res) {
  if (history) {
    history.remove({
      session_id : req.params.session_id
    }, function(err, stamp) {
      if (err) {
        res.send(err)
      }
      else {
        res.sendStatus(200);
      }
    });
  } else {
    console.log('History not found');
  }
});

module.exports = app;
