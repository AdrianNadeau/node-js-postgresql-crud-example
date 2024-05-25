var express = require('express');
const axios = require('axios');
var API = express.Router();
require('dotenv').config()


//Authentications all TABs.
API.get('/login', (req, res) => {
      
      res.render('pages/pages-login'); 
  });
  API.get('/pages-login-2', function(req, res)
{
      res.render('Pages/pages-login-2');
});

API.get('/register', function(req, res)
{
      res.render('Pages/pages-register');
});
API.post('/register', async function(req, res)
{
      console.log("Post register")
      //call register backend api 
      try {
            
            // Example API call to an external API
            console.log("COMPANY_API:",process.env.API_COMPANY_URL)
            
            axios.post(process.env.API_COMPANY_URL, {
                  company_name: 'Company1',
                  company_headline:'Desc'
                  
                })
                .then(function (response) {
                  console.log(response);
                  res.send(response);
                })
                .catch(function (error) {
                  console.log(error);
                  res.send(error);
                });
            // Render the index.ejs template with data from the API
            // res.render('index', { data });
        } catch (error) {
            console.error('Error fetching data from API:', error);
            // res.render('pages/pages-login'); 
        }
});
API.get('/confirm', function(req, res)
{
      res.render('Pages/pages-register-confirm');
});


API.post('/companies', function(req, res)
{
      console.log("create Company!!!!")
      res.render('Pages/pages-register');
});
API.get('/companies', function(req, res)
{
      console.log("GET ALL COMPANIES!!!!")
      res.render('Pages/pages-register');
});


API.get('/session-expired', function(req, res)
{
      res.render('Pages/pages-session-timeout');
});

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
   
// Authrouter.get('/pages-coming-soon', function(req, res)
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
API.get('/logout', function(req, res) {
       // Destroy session on the server-side
      req.session.destroy(err => {
            if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out');
            } else {
            // Clear cookie on the client-side
            res.clearCookie('connect.sid', { path: '/' });
            res.redirect('/login'); // Redirect to login page or any other page
            }
      });
});


module.exports = API;