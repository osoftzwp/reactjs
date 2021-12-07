const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRouter = require('./userRouter');
const morgan=require('morgan');

app.use(express.json());
app.use(morgan('dev'));

app.use('/api', userRouter);

app.use('/', (req, res) => {
    res.send("Hii");
})

app.listen(5000, () => {
    console.log("local host connected successfully");
})

mongoose.connect('mongobd://localhost:27017/userAuth',
    { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log("Server connected successfully");
    })




