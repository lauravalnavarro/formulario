
const express = require("express");
const app = express();
const mongoose = require("mongoose");


app.use(express.urlencoded({extended: true}));
app.set('view engine', 'pug');
app.set('views', 'views');


mongoose.connect(process.env.MONGODB_URL ||'mongodb://localhost:27017/formulario', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

// definimos el schema
const schema = mongoose.Schema({
  name: 
    {type: String},
  email: 
    {type: String},
  contraseña:
    {type: String}
});

// definimos el modelo
const Formulario = mongoose.model("Formulario", schema);

app.get('/register', (req, res) =>{
  res.render('registro');
  
});

app.get('/', async (req, res) =>{
  const usuarios = await Formulario.find()
  res.render('tabla', {usuarios});
});

app.post('/register', (req,res) => {
  console.log(req.body);
  res.redirect('/');
  Formulario.create({name:req.body.name, email: req.body.email, contraseña: req.body.contraseña});
});

app.listen(3000, () => console.log('Listening on port 3000!'));