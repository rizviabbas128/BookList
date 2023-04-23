const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const userRouter = require('./routes/user')
const bookRouter = require('./routes/book');
const port = 4000 || process.env.port;
const secret = 'book';
const app = express();

app.use(express.json());
app.use(cors());

const url = `mongodb+srv://booklist:booklist@cluster0.kqeuwax.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url).then(() => console.log(`connection to mongoDb success`)).then(() => {
    app.listen(port, () => console.log(`server is up at port ${port}`))
}).catch(() => console.log(`connection to mongoDb Failed !`));

//crud operation

app.use('/book', (req, res , next) => {
    const token = req.headers.authorization;// if bearer in token before then (token = req.headers.authorization?.split("Bearer")[1];)
    if(token) {
        jwt.verify(token, secret , function(err, decoded) {
            if(err) {
                return res.status(403).json({
                    status: "Failed",
                    message: "Token is not Valid"
                })
            }
            req.user = decoded.data;
            next();
          });
    }else {
        res.status(403).json({
            status: "Failed",
            message: "User is not authenticated"
        })
    }
})

app.use("/user", userRouter);
app.use("/", bookRouter);