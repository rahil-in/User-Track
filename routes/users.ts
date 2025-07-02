import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();


router.route('/')
  .get(authenticateToken, async (req, res) => {// middleware function should be passed before the async function not in route
    try {
    const result = await pool.query('SELECT * FROM qa.users');
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
 })
 .post(authenticateToken, async (req, res) => {
    const { user_id, first_name, last_name, email, gender } = req.body;
    console.log(`Received POST request with id: ${user_id}`);
    try {
        await pool.query('INSERT INTO qa.users (first_name, user_id, gender, last_name, email) VALUES ($1, $2, $3, $4, $5)', [first_name, user_id, gender, last_name, email]);
        console.log("Data inserted successfully");
        res.status(201).redirect('/users/' + user_id);
    } catch (err) {
        console.error(err);
        console.log('DataBase Error')
        res.status(500).send('Database error');
    }
})
.delete(authenticateToken, async (req, res) => {
    const { user_id } = req.body;
    try {
        await pool.query('DELETE FROM qa.users WHERE user_id = $1', [user_id]);
        res.status(200).send("Data deleted successfully with user_id: " + user_id);
        console.log("Data deleted successfully with user_id: " + user_id);   
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

router.route('/:id')
.get( async (req, res) => {
  console.log(`Received GET request for user with id: ${req.params.id}`);
    const { id } = req.params;
    try {
    const result = await pool.query('SELECT * FROM qa.users WHERE user_id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('User not found');
    }
    } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
    }
  });

router.get('/:id/events', authenticateToken, async (req, res)=>{
  const {id} = req.params;
  try{
    const result = await pool.query('SELECT * FROM qa.events WHERE user_id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.send('NO EVENT LOGS FOUND');
    }
    } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
    }
})

    

  
interface User {
  id: string;
  name: string;
  email: string;
}
declare global {   // Extend Express Request interface to include 'user'
  namespace Express {
    interface Request {
      user: User;
}}}
  
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) :void {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  try{
    const token = req.cookies.token; 
    console.log('All cookies:', req.cookies); 
    console.log('Token cookie:', req.cookies.token); 
    console.log("token", token)
    if(!token) {
      res.status(401).send('Access token required');
      return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: jwt.VerifyErrors | null, user: string | jwt.JwtPayload | undefined) => {  
      if (err) {
      res.status(403).send('Token Expired or Invalid');
      return;
    }
    if (typeof user === 'object' && user !== null ) {
      req.user = user as User;
      console.log("User Authorized is: ", req.user.name);
      next();
    } else {
      res.status(403).send('Invalid token payload');
      }
    });
  }
  catch(error ) {
    console.log("Error accessing token")
    console.log(error)
    res.status(500).json({"error": "Error Accessing token"})
  }
}
export default router;