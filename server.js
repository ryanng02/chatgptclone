//in package.json, we added backend scripts under "start:backend": "nodemon server.js" as we installed some nodemon, cor, express under dependencies under same file. Also had to install node.js to make npm run
const PORT = 8000 //set port
const express = require('express') //acquire packages we just installed
const cors = require ('cors')
require('dotenv').config()
const app = express()//initializing/releasing express
app.use(express.json())//allow us to work with json when we send stuff from front to back
app.use(cors())

const API_KEY = process.env.API_KEY

app.post('/completions', async (req,res)=>{
    const options= {
        method:'POST', //we are sending it so we are posting
        headers:{

            "Authorization":`Bearer ${API_KEY}`,  //important that it is backtick bearer
            "Content-Type":"application/json"    // cz we are going to be working with json
        },
        body:JSON.stringify({   //object we are sending a request through json
            model:"gpt-3.5-turbo",
            messages:[{role:"user",content:req.body.message}],
            max_tokens:100,       //every string text prompt is tokenized
        })
    }//what options like what request it is going to be, what method, what header, what message we want to send
    try{//we are going to use fetch API keyword on the backend but only able to use if we are on the latest version of node.js
        const response=await fetch('https://api.openai.com/v1/chat/completions', options) //linking create chat completion api from openai
        const data =await response.json()//json is an async method so, we have to wait its response too; we get response from above line and have to wait again
        res.send(data) //send to localhost:8000/completions
    }catch(error){
        console.error(error)
    }
})//just saying if we go to localhost:8000/completion we will get something in response; the syntax for this is having a request and response; we are doing an async function cz we want to pair it with an await
//async function makes a function return a promise and await makes the function wait for a promise; we can use a promise like an if/then statement
app.listen(PORT,() => console.log('Your server is running on PORT '+ PORT))//call back function to know which port its on
