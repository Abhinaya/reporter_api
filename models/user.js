var db = require("../app").db;
var Person = db.define('users', {
  full_name : String,
  id : String,
  encrypted_password: String
});

Person.getPerson = function(name, callback) {
  return Person.find({full_name: name}, callback);
};

module.exports = Person;
