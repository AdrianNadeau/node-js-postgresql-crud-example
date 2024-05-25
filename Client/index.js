const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config()
var router = require('./api.js');
var Authrouter = require('./AuthRouter.js');
// Add Authentication Route file with app

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', Authrouter); 
// Define a simple API endpoint
// app.get('/api/data', (req, res) => {
//     res.json({ message: 'Hello from the API' });
// });
//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

let port = process.env.PORT;


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
