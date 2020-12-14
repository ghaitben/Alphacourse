const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app = express();


require('./config/passport')(passport);

//middlewares and view engine stuff
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//local middleware to store global variables
app.use((req ,res , next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});



//allow cors to be able to send http requests

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,accept,access_token,X-Requested-With');
    next();
});

//setting up the datbase

const db = 'mongodb://mongo:27017/database';

mongoose.set('useFindAndModify', false);

mongoose.connect(db , {
  useUnifiedTopology:true,
  useNewUrlParser:true
})
  .then(() => console.log('Database connected...'))
  .catch(error => console.log(error));





//routes
app.use(express.static(path.join(__dirname,"FrontEnd")));

app.use('/',require('./routes/api'));

app.use('/user' , require('./routes/users'));



app.get('*' , (req , res) => {
  res.render('error_page',{
    layout:"data_entry.handlebars"
  })
});




const PORT = process.env.PORT || 8000;

app.listen(PORT , () => console.log(`Server running on port ${PORT} ...`));
