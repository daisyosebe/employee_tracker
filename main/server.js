const express = require('express');

const routes = require("./routes")

const port = 3001;
const app = express();

inquirer.prompt([
    {
        type: "input",
        message: "What is the name of the department?",
        name : "department",
    },
    {
        type: "input",
        message: "What is the name of the Role? ",
        name : "role"
    },
    {
        type: "input",
        message: "what is the salary of the role ",
        name : "salary"
    }

]).then (response => {
    if(response.shape == "circle"){
        const shape = new circle(response.shapeColor)
    }
});






app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);