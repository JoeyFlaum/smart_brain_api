const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const { restart } = require("nodemon");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "GooseNugg3t@B(",
    database: "smart-brain",
  },
});

// db.select('*').from('users').then(data =>{
//   console.log(data)
// })

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// /signin --> POST = success/fail
app.post("/signin", (req, res) => {
  signin.handleSignIn(req, res, db, bcrypt);
});

// /register --> POST = user
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// /profile --> GET id
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// /image --> PUT --> user
app.put("/image", (req, res) => {image.handleImageCount(req, res, db)});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
