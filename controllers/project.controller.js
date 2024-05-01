const db = require("../models");
const Project = db.projects;
const Phase = db.phases;
const Priority = db.priorities;
const Person = db.persons;
const Company = db.companies;
const sequelize= require('sequelize')
const Op = db.Sequelize.Op;

// Create and Save a new Project
exports.create = (req, res) => {
  const company_id_fk = req.session.company.id
 
   
    if (!req.body.project_name) {
      res.status(400).send({
        message: "Project Name can not be empty!"
      });
      return;
    }
    //convert dates
    let startDateTest = insertValidDate(req.body.start_date);
    let endDateTest = insertValidDate(req.body.end_date);
    let nextMilestoneDateTest = insertValidDate(req.body.next_milestone_date);
    let statusDateTest = insertValidDate(req.body.status_date);
    let deletedDateTest = insertValidDate(req.body.deleted_date);
    let changeDateTest = insertValidDate(req.body.change_date);

    // Create a Project
    const project = {
      company_id_fk : company_id_fk,
      project_name: req.body.project_name,
      project_headline :req.body.project_headline,
      project_description :req.body.project_description,
      project_why :req.body.project_why,
      project_what :req.body.project_what,
      start_date :startDateTest,
      end_date :endDateTest,
      next_milestone_date :nextMilestoneDateTest,
      status_date :statusDateTest,
      deleted_date:deletedDateTest,
      change_date:changeDateTest,
      priority_id_fk :req.body.priority_id_fk,
      sponsor_id_fk:req.body.sponsor_id_fk,
      prime_id_fk:req.body.prime_id_fk,
      phase_id_fk :req.body.phase_id_fk,
      progress :req.body.progress,
      health :req.body.health,
      project_cost :req.body.project_cost,
      effort:req.body.effort,
      benefit:req.body.benefit,
      impact:req.body.impact,
      complexity:req.body.complexity,
      tags:req.body.tags,
      issue:req.body.issue,
      actions:req.body.actions,
      attachment :req.body.attachment
    };
    // Save Project in the database
    Project.create(project)
      .then(async data => {
        console.log("-----------------------------------------data",data)
        // Retrieve data from all sources
        const [phasesData, prioritiesData, personsData, projectsData] = await Promise.all([
          Phase.findAll(),
          Priority.findAll(),
          Person.findAll(),
          Project.findAll() // Assuming Project.findAll() returns a Promise
      ]);
      
      // Custom SQL query
      const query = "SELECT proj.project_name, proj.start_date, proj.end_date, proj.health, prime_person.first_name AS prime_first_name, prime_person.last_name AS prime_last_name, sponsor_person.first_name AS sponsor_first_name, sponsor_person.last_name AS sponsor_last_name, proj.project_cost, phases.phase_name FROM projects proj LEFT JOIN persons prime_person ON prime_person.id = proj.prime_id_fk LEFT JOIN persons sponsor_person ON sponsor_person.id = proj.sponsor_id_fk LEFT JOIN phases ON phases.id = proj.phase_id_fk WHERE proj.company_id_fk = ? ;"
      
      await db.sequelize.query(query, {
          replacements: {id: company_id_fk},
          type: db.sequelize.QueryTypes.SELECT
      }).then(data => {
          // Render the page when all data retrieval operations are complete
          console.log()
          res.render('Pages/pages-projects', {
              projects: projectsData,
              phases: phasesData,
              priorities: prioritiesData,
              sponsors: personsData,
              primes: personsData
          });
      }).catch(err => {
          res.status(500).send({
              message: err.message || "Some error occurred while retrieving data."
          });
      });
      })
      .catch(err => {
        
        res.status(500).send({
          
          message:
            err.message || "Some error occurred while creating the Project."
          
        });
      });
  };

// Retrieve all  from the database.
exports.findAll = async (req, res) => {
  // const company_id_fk = req.session.company.id
  // console.log("company_id_fk:",company_id_fk)
        try {
          console.log("Get all projects for company")
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
          console.log("company_id_fk:",company_id_fk)
          // Retrieve data from all sources
          const [phasesData, prioritiesData, personsData, projectsData] = await Promise.all([
              Phase.findAll(),
              Priority.findAll(),
              Person.findAll(),
              Project.findAll() // Assuming Project.findAll() returns a Promise
          ]);
          const query ='SELECT proj.company_id_fk, proj.project_name, proj.start_date, proj.end_date, proj.health, prime_person.first_name AS prime_first_name, prime_person.last_name AS prime_last_name, sponsor_person.first_name AS sponsor_first_name, sponsor_person.last_name AS sponsor_last_name, proj.project_cost, phases.phase_name FROM projects proj LEFT JOIN persons prime_person ON prime_person.id = proj.prime_id_fk LEFT JOIN persons sponsor_person ON sponsor_person.id = proj.sponsor_id_fk LEFT JOIN phases ON phases.id = proj.phase_id_fk WHERE proj.company_id_fk = ?';
          
       await db.sequelize.query(query, {
        replacements: [company_id_fk],
              type: db.sequelize.QueryTypes.SELECT
          }).then(data => {
              // Render the page when all data retrieval operations are complete
              res.render('Pages/pages-projects', {
                  projects: data,
                  phases: phasesData,
                  priorities: prioritiesData,
                  sponsors: personsData,
                  primes: personsData
              });
          }).catch(err => {
              res.status(500).send({
                  message: err.message || "Some error occurred while retrieving data."
              });
          });
      
          // // Custom SQL query
          // const query = "SELECT proj.company_id_fk, proj.project_name, proj.start_date, proj.end_date, proj.health, prime_person.first_name AS prime_first_name, prime_person.last_name AS prime_last_name, sponsor_person.first_name AS sponsor_first_name, sponsor_person.last_name AS sponsor_last_name, proj.project_cost, phases.phase_name FROM projects proj LEFT JOIN persons prime_person ON prime_person.id = proj.prime_id_fk LEFT JOIN persons sponsor_person ON sponsor_person.id = proj.sponsor_id_fk LEFT JOIN phases ON phases.id = proj.phase_id_fk where proj.company_id_fk = ?;"
          
          // await db.sequelize.query(query, {
          //   replacements: {id: company_id_fk},
          //     type: db.sequelize.QueryTypes.SELECT
          // }).then(data => {
          //     // Render the page when all data retrieval operations are complete
          //     console.log("************************************************* data:",data)
          //     const session = req.session;
          //     session.company = company;
          //     session.person = person;
          //     res.render('Pages/pages-projects', {
          //         projects: projectsData,
          //         phases: phasesData,
          //         priorities: prioritiesData,
          //         sponsors: personsData,
          //         primes: personsData
          //     });
          // }).catch(err => {
          //     res.status(500).send({
          //         message: err.message || "Some error occurred while retrieving data."
          //     });
          // });
          
      }
      catch(error){
        console.log("error:", error)
      }
           
    };
// Find a single Project with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Project.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Project with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Project with id=" + id
        });
      });
  };

// Update a Project by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Project.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Project was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Project with id=${id}. Maybe Project was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Project with id=" + id
        });
      });
  };

// Delete a Project with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Project.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Project was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Project with id=${id}. Maybe Project was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Project with id=" + id
        });
      });
  };

// Delete all  from the database.
exports.deleteAll = (req, res) => {
  Project.destroy({
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
  function insertValidDate(dateString) {
    var date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return null; // Return null for invalid dates
    } else {
      return date; // Return the valid date
    }
  }

