var Person = require('../models/user').Person;
exports.getPerson = function (req, res) {
  Person.getPerson(req.params.full_name, function(err, obj){
    var id = obj[0].id;
    res.send({id : obj[0].id, full_name : obj[0].full_name});
  });
};
