const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
app.post('/register', async (req, res, next) =>{

  try{
    saltCount = 10;
    const {username, password }= req.body;
    const hashed = await bcrypt.hash(password, saltCount)
    let createdUser = await User.create({username: username, password:hashed})
    res.status(200)
    res.send(`successfully created user ${username}`)
    
    

  }
  catch(error){
    next(error)

  }
})
// TODO - takes req.body of {username, password} and creates a new user with the hashed password

// POST /login
app.post('/login', async (req, res, next) =>{

  try{
    const {username, password }= req.body;
    const foundUser = await User.findOne({where: {username: username}})
    if (!foundUser){
      return 'Failed'
    }
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if(isMatch){
      res.send(`successfully logged in user ${username}`)
    }
    else{
      res.send('incorrect username or password')
    }

  }
  catch(error){
    res.status(400)

  }
})
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB

// we export the app, not listening in here, so that we can run tests
module.exports = app;
