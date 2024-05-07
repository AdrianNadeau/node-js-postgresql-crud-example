module.exports = app => {
    const projects = require("../controllers/project.controller.js");
  
    var router = require("express").Router();
  
    // Create a new 
    router.post("/", projects.create);
  
    // Retrieve all 
    router.get("/", projects.findAll);

    // Retrieve a single  with id
    router.get("/:id", projects.findOne);

    // Retrieve a single  with id
    router.get("/cockpit/:id", projects.cockpit);
  
    // Update a  with id
    router.put("/:id", projects.update);
  
    // Delete a  with id
    router.delete("/:id", projects.delete);
  
    // Create a new 
    router.delete("/", projects.deleteAll);

     // Retrieve a single  with id
     router.get("/radar/:id", projects.radar);

     // Retrieve a single  with id
     router.get("/flightplan/:id", projects.flightplan);

     // Retrieve a single  with id
     router.get("/health/:id", projects.health);
    
    app.use('/projects', router);
    
  };