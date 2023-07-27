const express = require('express');
const config = require('config');

const app = express();
const PORT = config.get('server.port');
const HOST = config.get('server.host');


app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to EduWise-Companion");
});
  
app.listen(PORT, HOST, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);