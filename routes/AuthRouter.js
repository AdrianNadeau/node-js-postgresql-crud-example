const db = require("../models");
var express = require('express');
require("dotenv").config()
var Authrouter = express.Router();
const companies = require("../controllers/company.controller");
const persons = require("../controllers/person.controller");
const Company = db.companies;
const Person = db.persons;
const Op = db.Sequelize.Op;

//Authentications all TABs.
// Authrouter.get('/test', function(req, res)
// {
//       res.render('Pages/test');
// });
// Authrouter.get('/pages-coming-soon', function(req, res)
// {
//       res.render('Pages/pages-coming-soon');
// });
// Authrouter.get('/pages-lock-screen', function(req, res)
// {
//       res.render('Pages/pages-lock-screen');
// });
// Authrouter.get('/pages-lock-screen-2', function(req, res)
// {
//       res.render('Pages/pages-lock-screen-2');
// });
Authrouter.get('/login', function(req, res)
{
      res.render('Pages/pages-login');
});
Authrouter.post('/login', function(req, res)
{
      res.render('Pages/pages-login');
});
Authrouter.get('/pages-login-2', function(req, res)
{
      res.render('Pages/pages-login-2');
});

Authrouter.get('/register', function(req, res)
{
      res.render('Pages/pages-register');
});

Authrouter.post("/register", companies.create);
Authrouter.post("/login", persons.findOne);

// Authrouter.get('/pages-maintenance', function(req, res)
// {
//       res.render('Pages/pages-maintenance');
// });
// Authrouter.get('/pages-recoverpw', function(req, res)
// {
//       res.render('Pages/pages-recoverpw');
// });
// Authrouter.get('/pages-recoverpw-2', function(req, res)
// {
//       res.render('Pages/pages-recoverpw-2');
// });
// router.get("/about", function (req, res) {
//       res.send("About this wiki");
//     });
   
// Authrouter.get('/confirm', function(req, res)
// {
//       res.render('Pages/pages-register-confirm');
// });
// Authrouter.get('/pages-comingsoon', function(req, res)
// {
//       res.render('Pages/pages-comingsoon');
// });
// Authrouter.get('/logout', function(req, res) {
//       try {
//           fetch(process.env.SERVER_HOST + "/logout")
//               .then(response => {
//                   if (!response.ok) {
//                       throw new Error('Network response was not ok');
//                   } else {
//                       // destroy session
//                       res.redirect('/register');
//                   }
//               })
//               .catch(error => {
//                   console.error('Error sending data:', error);
//                   res.status(500).json({ error: error.message });
//               });
//       } catch (error) {
//           console.error('Error:', error);
//           res.status(500).json({ error: error.message });
//       }
//   });
Authrouter.get('/logout', function(req, res) {
      req.session.destroy((err) => {
            if (err) {
            console.log(err)
            return next(err)
            }
            console.log("session destroyed")
            return res.redirect("/login")
      })
});


module.exports = Authrouter;