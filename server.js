const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

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

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

// /signin --> POST = success/fail
app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(res.json(database.users[0]));
  } else {
    res.status(400).json("error logging in");
  }
});

// /register --> POST = user
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => res.json(user[0]))
    .catch((err) => res.status(400).json("unable to register"));
});

// /register --> POST = user
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length) {
        return res.json(user[0]);
      } else {
        res.status(400).json("not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
});

// /image --> PUT --> user
app.put("/image", (req, res) => {
  const { id } = req.body;
  db('users').where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {res.json(entries[0])})
    .catch(err => res.status(400).json('unable to get entries'));
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
