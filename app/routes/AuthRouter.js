var express = require('express');
require("dotenv").config()
var AuthRouter = express.Router();

//Authentications all TABs.
AuthRouter.get('/test', function(req, res)
{
      res.render('Pages/test');
});
AuthRouter.get('/pages-coming-soon', function(req, res)
{
      res.render('Pages/pages-coming-soon');
});
AuthRouter.get('/pages-lock-screen', function(req, res)
{
      res.render('Pages/pages-lock-screen');
});
AuthRouter.get('/pages-lock-screen-2', function(req, res)
{
      res.render('Pages/pages-lock-screen-2');
});
AuthRouter.get('/login', function(req, res)
{
      res.render('Pages/pages-login');
});
AuthRouter.post('/login', function(req, res)
{
      // res.render('Pages/pages-login');
});
AuthRouter.get('/pages-login-2', function(req, res)
{
      res.render('Pages/pages-login-2');
});
AuthRouter.get('/pages-maintenance', function(req, res)
{
      res.render('Pages/pages-maintenance');
});
AuthRouter.get('/pages-recoverpw', function(req, res)
{
      res.render('Pages/pages-recoverpw');
});
AuthRouter.get('/pages-recoverpw-2', function(req, res)
{
      res.render('Pages/pages-recoverpw-2');
});
AuthRouter.get('/register', function(req, res)
{
      console.log("load register page")
      res.render('Pages/pages-register');
});
AuthRouter.post('/register', async (req, res) => {
      console.log("REGISTER : ",process.env.COMPANY_URL)
      try {
            const requestData = req.body; // Assuming JSON data in the request body
            console.log("requestData:",requestData);
            const response = await fetch(process.env.COMPANY_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
              });
          
              if (!response.ok) {
                throw new Error('Failed to send data to API');
              }
              const responseData = await response.json();
              
                  //if registering 
                  res.redirect('/confirm')
                  //else send to dashboard
                  // res.redirect('/control')
            } catch (error) {
              console.error('Error sending data:', error);
              res.status(500).json({ error: error.message });
            }
          });
          
   
AuthRouter.get('/confirm', function(req, res)
{
      res.render('Pages/pages-register-confirm');
});
AuthRouter.get('/pages-comingsoon', function(req, res)
{
      res.render('Pages/pages-comingsoon');
});
AuthRouter.get('/logout', function(req, res) {
      try {
          fetch(process.env.SERVER_HOST + "/logout")
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  } else {
                      // destroy session
                      res.redirect('/register');
                  }
              })
              .catch(error => {
                  console.error('Error sending data:', error);
                  res.status(500).json({ error: error.message });
              });
      } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: error.message });
      }
  });
  


module.exports = AuthRouter;