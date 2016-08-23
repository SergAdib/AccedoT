var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

// @Model of Movies list for mongoDB
var ifLink = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

var meta = new Schema({
  name  : String,
  value : String
});

var content = new Schema({
  url       : { type: String, required: true, validate: ifLink },
  format    : { type: String, default: 'mp4' },
  width     : { type: Number, default: 640 },
  height    : { type: Number, default: 480 },
  language  : String,
  duration  : Number,
  geoLock   : { type: Boolean, default: false },
  id        : { type: String, required: true, unique: true }
});

var credit = new Schema({
  role  : String,
  name  : String
});

var rating = new Schema({
  scheme  : String,
  rating  : String
});

var image = new Schema({
  type   : { type: String, required: true},
  url    : { type: String, required: true, validate: ifLink },
  width  : Number,
  height : Number,
  id     : { type: String, required: true}
});

var category = new Schema({
  title       : { type: String, required: true},
  description : { type: String, required: true},
  id          : { type: String, required: true}
});

var movieList = new Schema({
  title           : { type: String, required: true },
  description     : { type: String, required: true },
  type            : { type: String, default: 'Movie' },
  publishedDate   : { type: Date, default: Date.now },
  availableDate   : { type: Date, default: Date.now },
  metadata        : [ meta ],
  contents        : [ content ],
  credits         : [ credit ],
  parentalRatings : [ rating ],
  images          : [ image ],
  categories      : [ category ],
  id              : { type: String, required: true }
});

module.exports = mongoose.model('movieList', movieList);
