var db = require("../app").db;
Person = db.define('users', {
  full_name : String,
  id : String
});

Person.getPerson = function(name, callback) {
  return Person.find({full_name: name}, callback);
};

exports.Person = Person;
