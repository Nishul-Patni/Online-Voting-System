const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const port = 5000;

connectToMongo();


app.use(express.json());

app.use('/api/auth', require('./routes/auth')); 
app.use('/api/election', require('./routes/election'));

app.get('/', (req, res)=>{
    res.send("This is working fine");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})