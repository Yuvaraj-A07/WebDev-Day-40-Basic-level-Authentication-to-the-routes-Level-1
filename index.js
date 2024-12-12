import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "yuvaraj@2004",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
 try {
  const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;", 
    [email, password]
  );
  console.log(result.rows);
  res.render("secrets.ejs");
 } catch (err){
  console.log(err);
  res.send("Email already exists, try logging in.")
 }

});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1;",[email] );
    if (result.rows.length > 0){
      if(result.rows[0].password == password){
        res.render("secrets.ejs");
      } else{
        res.send("The password is incorrect.");
      }
    } else{
      res.send("The email doesn't exists, try to register.")
    }
  } catch(err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
