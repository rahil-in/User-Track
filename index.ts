import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies i.e form submissions
app.use(cookieParser()); //Middleware to parse cookies


import users from './routes/users.js';
import userReg from './routes/userReg.js';
import userLogin from './routes/userLogin.js';


app.get('/', (req, res) => {
  res.json({
    "Hello World!": "Welcome to the Express.js server!", "status": "running"
  });
});
app.use('/users', users);
app.use('/Register', userReg);
app.use('/login', userLogin)


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});