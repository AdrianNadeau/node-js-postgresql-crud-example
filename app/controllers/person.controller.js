const db = require("../models");
const Person = db.persons;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Create and Save a new 
exports.create = (req, res) => {
  // Validate request
  if (!req.body.first_name) {
      res.status(400).send({
          message: "First Name can not be empty!"
      });
      return;
  }

  const myPlaintextPassword = req.body.password;
  
  console.log("COMPANY==================================",global.company.id)
  // Example usage
  hashPassword(myPlaintextPassword)
      .then(hash => {
          console.log("myCrypedPassword 1:", hash);

          const person = {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              initials: req.body.initials,
              company_id_fk: global.company.id,
              password: hash // Assign the hashed password here
          };
          console.log("person:", person);

          // Save in the database
          Person.create(person)
              .then(data => {
                console.log('data:',data)
                  res.send(data);
              })
              .catch(err => {
                  res.status(500).send({
                      message: err.message || "Some error occurred while creating the Person."
                  });
              });
      })
      .catch(err => {
          console.error(err);
          res.status(500).send({
              message: "Error occurred while hashing the password."
          });
      });
};

async function hashPassword(plaintextPassword) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plaintextPassword, salt);
  return hash;
}

// Retrieve all  from the database.
exports.findAll = (req, res) => {
  let company_id_fk;
  //add company id from global
  // if (global.company) {
  //   company_id_fk =  global.company.dataValues.id;
  //   console.log("add project company_id:",company_id_fk)
    
  // } else {
  //   console.log("Company object is not stored in session");
  //   res.send("Company object is not stored in session")
  // }
  
    Person.findAll({})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving people."
        });
      });
  };

// Find a single  with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Person.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Person with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Person with id=" + id
        });
      });
  };

// Update a  by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Person.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Person was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Person with id=${id}. Maybe Person was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating  with id=" + id
        });
      });
  };

// Delete a  with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Person.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Person was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Person with id=${id}. Maybe Person was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Person with id=" + id
        });
      });
  };

// Delete all  from the database.
exports.deleteAll = (req, res) => {
    Person.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Companies were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all companies."
        });
      });
  };

