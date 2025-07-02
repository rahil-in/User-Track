import express from "express";
const router = express.Router();
import pool from "../db.js";
import bcrypt from 'bcrypt';
router.use(express.urlencoded({ extended: true })); 

router.route('/')
    .post(async (req, res) => {
        try {
            var hashedPassword = await bcrypt.hash(req.body.password, 10);
            console.log(`Received POST request with username: ${req.body.user_name}, password: ${hashedPassword}`);
        }
        catch (err) {
            console.error(err);
            res.status(500).send('Error hashing password');
            return;
        }
        try {
            console.log(`Inserting user: ${req.body.user_name}`);
            console.log(`Hashed password: ${hashedPassword}`);
            const result = await pool.query('SELECT * FROM qa.authentication_details WHERE user_name = $1', [req.body.user_name]);
            if (result.rows.length > 0) {
                console.log(`User already exists: ${req.body.user_name}`);
                res.status(409).send('User already exists');
                return;
            }
            else{
                await pool.query('INSERT INTO qa.authentication_details (user_name, password) VALUES ($1, $2)', [req.body.user_name, hashedPassword]);
                console.log("Data inserted successfully");
                res.status(201).send('User registered successfully');
                }
            } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

export default router;