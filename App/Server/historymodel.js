'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// @Model for history records
var movie = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  watchDate: { type: Date, default: Date.now }
});

var history = new Schema({
  session_id: { type: String, required: true, unique: true },
  creationDate: { type: Date, required: true, default: Date.now },
  updatedDate: { type: Date, required: true, default: Date.now },
  watchedMovies: [movie]
});

module.exports = mongoose.model('history', history);