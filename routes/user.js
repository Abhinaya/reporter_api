var Person = require('../models/user');
module.exports = function(app){
  app.get("/person/:full_name", function (req, res) {
    Person.getPerson(req.params.full_name, function(err, obj){
      var id = obj[0].id;
      res.send({id : obj[0].id, full_name : obj[0].full_name});
    });
  });
};
