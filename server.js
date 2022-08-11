require('dotenv').config();
const express = require('express');
const bodyparser = require("body-parser");
const connectDB = require('./server/database/connection')
const app = express();

// parse request to body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use((req, res, next) => {
  if(req && req.headers && typeof req.headers.authorization === 'string'){
    let apikey = req.headers.authorization.split(' ')[1];
    if(apikey === process.env.apikey){
      next();
      return;
    }
  }
  res.sendStatus(401);
})

// mongodb connection
connectDB()

// load routers
app.use('/', require('./server/routes/router'));

// dotenv.config({path: '.env'})
// require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const PORT = process.env.PORT || 7800;

app.listen(PORT, ()=>{
  console.log(`Server is running on http://localhost:${PORT}`);
})
