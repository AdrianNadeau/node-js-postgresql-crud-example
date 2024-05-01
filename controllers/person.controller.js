const session = require("express-session");
const db = require("../models");
const Person = db.persons;
const Company = db.companies;
const Op = db.Sequelize.Op;
// const bcrypt = require('bcrypt');
var bcrypt = require('bcryptjs');
const saltRounds = 10;

// Create and Save a new 
exports.create = async (req, res) => {
  const company_id_fk = req.session.company.id
  
  try {
    
    const { email, first_name, last_name, initials, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email cannot be empty!" });
    } else {
      
      // Generate a salt
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          // handle error
          console.error(err);
          return;
        }

        // Hash the password using the generated salt
        bcrypt.hash(password, salt, async (err, hash)  => {
          if (err) {
            // handle error
            console.error(err);
            return;
          }

          // Print the hashed password
          
          // res.send(hash);
          const person = await Person.create({ email, first_name, last_name, initials, password: hash, company_id_fk });
          if(req.body.register_yn && req.body.register_yn == "y"){
            //registered send to control
            res.redirect('/');
          }
          else {
            res.redirect('/persons');
          }
        
        });
      });
       
    }
    } catch (error) {
    console.error("Error creating person:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.findAll = (req, res) => {
  console.log("Get all users for company")
  let company_id_fk;
  try{
    console.log("req.session:",req.session)
    if(!req.session){
        res.redirect("/pages-500")
    }
    else{
      company_id_fk = req.session.company.id
     }
  }catch(error){
    console.log("error:",error)
  }
   
      Person.findAll({ where: { company_id_fk: company_id_fk } })
        .then(data => {
          
          res.render('Pages/pages-persons', {
            persons: data
        });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving people."
          });
        });
    };
  
// Find a single  with an id
exports.login = async  (req, res) => {
  const { email, password } = req.body;
 
  //Check password by encrypted value
  // Find user by email in your database
  const person = await Person.findOne({ email });
  
  // res.send(person)
  if (!person) {
    // User not found
    return res.status(404).json({ message: "User not found." });
  }
  console.log("copmany:",person.company_id_fk)
  
  const company = await Company.findOne({ id: person.company_id_fk });
 
    if(company){
      console.log("LOGIN:",company.id)
      const session = req.session;
      session.company = company;
      session.person = person;
     
    
    }
    else{
      console.log("NO LOGIN")
    }
    res.redirect('/');
  
};

// Find a single  with an id
exports.findOne = (req, res) => {
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
//   const getHashPassword = async (password) => {
//     try {
//         const hash = await bcrypt.hash(password, saltRounds);
//         return hash;
//     } catch (error) {
//         throw new Error('Error occurred while hashing the password.');
//     }
// };
