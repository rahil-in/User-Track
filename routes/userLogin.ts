import express from "express";
const router = express.Router();
import pool from "../db.js";
import bcrypt from 'bcrypt';
router.use(express.urlencoded({ extended: true })); 
import jwt from 'jsonwebtoken';

router.route('/')
    .post(async (req, res) => {
        const { user_name, password } = req.body;
        try{
            const result = await pool.query('SELECT * FROM qa.authentication_details WHERE user_name = $1', [user_name]);
            if (result.rows.length > 0) {
                const user = result.rows[0];       
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    console.log(`Login successful for user: ${user_name}`);
                    //JWT
                    const user = { name: user_name };

                    const secret = process.env.ACCESS_TOKEN_SECRET;
                    if(!secret) 
                        throw new Error('ACCESS_TOKEN_SECRET is not defined');
                    const access_token = jwt.sign(user, secret,{expiresIn: '3m'});
                    res.cookie('token', access_token, {
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 3 * 60 * 1000 // 3 minutes to match JWT expiry
                    });
                    res.json({ access_token: access_token });
                } else {
                    console.log(`Login failed for user: ${user_name}`);
                    res.status(401).send('Invalid credentials');
                }     
            } else {
            res.status(404).send('User not found');
            return
            }
        }
        catch {
            console.error("error in user login");
            res.status(500).send('Database error');
        }
    });

    

    export default router;