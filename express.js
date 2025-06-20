
const express = require('express');
const path = require('path');

//const morgan = require('morgan');
const app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { title: 'Página Principal' });
});


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
