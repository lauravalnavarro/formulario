
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const passport = require('passport')

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
  secret: 'secretKey',

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))



mongoose.connect(process.env.MONGODB_URL ||'mongodb://localhost:27017/formulario', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

// definimos el schema
const schema = mongoose.Schema({
  name: 
    {type: String},
  email: 
    {type: String},
  password:
    {type: String}
});

// definimos el modelo
const Formulario = mongoose.model("Formulario", schema);

Formulario.authenticate = async (email, password) => {
  // buscamos el usuario utilizando el email
  const user = await mongoose.model("Formulario").findOne({ email: email });

  if (user) {
    // si existe comparamos la contraseña
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) reject(err);
        resolve(result === true ? user : null);
      });
      
    });
    
    return user;
  };

  return null;
};

app.get('/register', (req, res) =>{
  res.render('registro');
  
});

app.get('/', async (req, res) =>{
  if(req.session.userId){
    const usuarios = await Formulario.find()
    res.render('tabla', {usuarios});
  }else{
    res.redirect('/login');
  };
 
});

app.post('/register', (req,res) => {
  console.log(req.body);
  res.redirect('/');
   bcrypt.hash(req.body.password, 10).then(function(hash) {
     Formulario.create({name:req.body.name, email: req.body.email, password: hash});
  });
  
});


app.get('/login', (req, res)=>{
  res.render('login');
});

app.post('/login', async(req,res)=>{
  const email = req.body.email;
  const password = req.body.password;

  try{
    const user = await Formulario.authenticate(email, password);
    console.log(user);
    if (user){
      req.session.userId = user._id;
      return res.redirect('/');
    }else {
      res.redirect('/register');
    };
  }catch(e){
    return console.error(e);
  };

});

app.get('/logout', (req,res)=>{
  req.logout();
  req.session = null;
  res.redirect('/');
});

app.listen(3000, () => console.log('Listening on port 3000!'));