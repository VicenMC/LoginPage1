const express = require('express');
const morgan = require('morgan');
const cookieparser = require('cookie-parser');

const app = express();
//Middleware para cookie de req
app.use(cookieparser());
//Midleware para urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const users = [
  {id: 1, name: 'Franco', email: 'Franco@mail.com', password: '1234'},
  {id: 2, name: 'Toni', email: 'Toni@mail.com', password: '1234'}
]

app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

const isAuthenticated = (req, res, next) => {
  // Si NO hay un usuario logueado redirigir a /login de lo contrario llamar a next()
  const {userId} = req.cookies;
  const loggedUser = users.find((user) => user.id.toString() === userId);
  if(loggedUser){
    next()
  }else{
    return res.redirect('/login');
  }
}

const isNotAuthenticated = (req, res, next) => {
  // Si hay un usuario logueado redirigir a /home de lo contrario llamar a next()
  const {userId} = req.cookies;
  const loggedUser = users.find((user) => user.id.toString() === userId);
  if(loggedUser){
    return res.redirect('/home')
  }else{
    next();
  }
}

app.use(morgan('dev'));

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Bienvenidos a Henry!</h1>
//   `)
// });

app.get('/', (req, res) => {
  res.send(`
  <link type="text/css" href="css/homePage.css" rel="stylesheet">
  <body>
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap" rel="stylesheet">
  
    ${req.cookies.userId ? `
    <div class="loggedContainer">
    <h1>Log out</h1>
    <p>Are you sure that you want to log out of your account?</p>
      <a class="buttonEnter" href='/home'>Return to profile</a>
      <form method='post' action='/logout'>
        <button class="buttonReturn">Log out</button>
      </form>
      </div>
      ` : `
      <div class="Container">
    <h1>Welcome to Henry!</h1>
    <p>Please enter or register</p>
      <a class="buttonEnter" href='/login'>Login</a>
      <a class="buttonEnter" href='/register'>Register</a>
      <input class="buttonReturn" type='submit' value='Return to website' />
      <div class="iconContainer">
      <a class="iconHolder" href="https://twitter.com/Vicen_2000" target="_blank">
      <ion-icon name="logo-twitter"></ion-icon>
      </a>
      <a class="iconHolder" href="https://www.linkedin.com/in/víctorrp" target="_blank">
      <ion-icon name="globe-outline"></ion-icon>
      </a>
      <a class="iconHolder" href="https://github.com/VicenMC" target="_blank">
      <ion-icon name="logo-github"></ion-icon>
      </a>
      </div>
      </div>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>  
    `}
  `)
});

//Formulario de registro si no recibe nada por req.cookies
app.get('/register',isNotAuthenticated, (req, res) => {
  res.send(`
  <link type="text/css" href="css/registerPage.css" rel="stylesheet">
  <div class="container">
    <h1>Register</h1>
    <p>Please enter your name, email and password</p>
    <form class="registerForm" method='post' action='/register'>
      <input class="inputField" name='name' placeholder='Name' required />
      <input class="inputField" type='email' name='email' placeholder='Email' required />
      <input class="inputField" type='password' name='password' placeholder='Password' required />
      <input class="buttonEnter" type='submit' value='Register' />
    </form>
    <p>Already have an account?</p>
    <a class="logButton" href='/login'>Login</a>
    <div class="iconContainer">
    <a class="iconHolder" href="https://twitter.com/Vicen_2000" target="_blank">
    <ion-icon name="logo-twitter"></ion-icon>
    </a>
    <a class="iconHolder" href="https://www.linkedin.com/in/víctorrp" target="_blank">
    <ion-icon name="globe-outline"></ion-icon>
    </a>
    <a class="iconHolder" href="https://github.com/VicenMC" target="_blank">
    <ion-icon name="logo-github"></ion-icon>
    </a>
    </div>
    </div>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
  `)
});

//Formulario de login
app.get('/login',isNotAuthenticated,  (req, res) => {
  res.send(`
  <link type="text/css" href="css/loginPage.css" rel="stylesheet">
  <div class="container">
    <h1>Login</h1>
    <p>Please enter your email and password</p>
    <form method='post' action='/login'>
      <input class="inputField" type='email' name='email' placeholder='Email' required />
      <input class="inputField" type='password' name='password' placeholder='Password' required />
      <input class="buttonEnter" type='submit' value='Login' />
    </form>
    <p>Don't have an account yet?</p>
    <a class="logButton" href='/register'>Register</a>
    <div class="iconContainer">
     <a class="iconHolder" href="https://twitter.com/Vicen_2000" target="_blank">
    <ion-icon name="logo-twitter"></ion-icon>
    </a>
    <a class="iconHolder" href="https://www.linkedin.com/in/víctorrp" target="_blank">
    <ion-icon name="globe-outline"></ion-icon>
    </a>
    <a class="iconHolder" href="https://github.com/VicenMC" target="_blank">
    <ion-icon name="logo-github"></ion-icon>
    </a>
    </div>
    </div>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
  `)
});

//Posts
app.post('/login', (req, res) => {
  const {email, password} = req.body;
  if(email && password){
    const foundUser = users.find((user) => user.email === email)
    if(!foundUser){
      return res.redirect('/login')
    }
    if(foundUser.password === password){
      res.cookie('userId', foundUser.id);
      return res.redirect('home')
    }
  }
  // 2) Verificar que ambos datos hayan sido provistos
  // Si ambos datos fueron provistos:
  //   a) Obtener del listado de usuarios (si existe) el que tenga dicho email y contraseña
  //   b) Guardar los datos del usuario en la cookie: res.cookie('userId', user.id) donde el primer
  //   parámetro es el nombre de la cookie y el segundo su valor
  //   c) Redirigir a /home
  // En el caso de que no exista un usuario con esos datos o directamente no se hayan provisto o
  // el email o la password, redirigir a /login
});

app.get('/home', isAuthenticated, (req, res) => {
  const { userId } = req.cookies;
  //Guarda los datos como string en cookie, por lo que debemos convertir el id a string para compararlo
  const user = users.find((user) => user.id.toString() === userId);
  //Completar: obtener el usuario correspondiente del array 'users' tomando como
              //            referencia el id de usuario almacenado en la cookie
    res.send(`
    <link type="text/css" href="css/homeUser.css" rel="stylesheet">
    <div class="container">
    <h1>Welcome ${user.name}</h1>
    <p>${user.email}</p>
    <a class="returnButton"href='/'>Return</a>
    </div>
  `)
});

app.post('/register', (req, res) => {
  const {name, email, password} = req.body;
  if(!name || !email || !password){
    return res.redirect('/register');
  }
  const existEmail = users.find((user) => user.email === email);
  if(existEmail){
    return res.redirect('/register');
  }
  else{
    const newUser ={id: users.length + 1, name, email, password}
    users.push(newUser);
    return res.redirect('/')
  }
  // 1) Obtener el name, email y password desde el body del request
  // 2) Verificar que los tres datos hayan sido provistos
  // Si todos los datos fueron provistos:
  //   a) Buscar dentro del listado de usuarios si existe alguno que tenga dicho email para evitar
  //      que existan dos usuarios con mismo mail
  //   b) Crear un nuevo objeto con los datos del usuario y pushearlo al array de users
  //   c) Redirigir a la pantalla inicial '/'
  // En el caso de que ya exista un usuario con ese email o no se hayan provisto o
  // el name o el email o la password, redirigir a /register
});

app.post('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/');
});

app.listen(3000, (err) => {
  if(err) {
   console.log(err);
 } else {
   console.log('Listening on localhost:3000');
 }
});
