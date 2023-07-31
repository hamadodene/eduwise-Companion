const express = require('express')
const config = require('config')
const cors = require('cors')
const db = require("./app/models");
const Role = db.role;
const User = db.user;

const app = express();
const PORT = config.get('server.port')
const HOST = config.get('server.host')
const MONGOHOST= config.get('database.host')
const MONGOPORT= config.get('database.port')
const MONGODBNAME= config.get('database.db')

var corsOptions = {
    origin: "http://localhost:" + PORT
}


app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


//Inizialize connection to DB
db.mongoose
  .connect(`mongodb://${MONGOHOST}:${MONGOPORT}/${MONGODBNAME}`, {
    useNewUrlParser:true,
    useUnifiedTopology:true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

//Inizialize default user and role
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });

      new User({
        name: "admin",
        surname: "admin",
        birthday: "01/01/1900",
        username: "admin",
        password: "admin",
        email: "admin@localhost",
        roles: [admin]
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app)


app.listen(PORT, HOST, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error)
    }
);