"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_js_1 = __importDefault(require("../db.js"));
const router = express_1.default.Router();
router.route('/')
    .get(authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_js_1.default.query('SELECT * FROM qa.users');
        console.log(result.rows);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
}))
    .post(authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, first_name, last_name, email, gender } = req.body;
    console.log(`Received POST request with id: ${user_id}`);
    try {
        yield db_js_1.default.query('INSERT INTO qa.users (first_name, user_id, gender, last_name, email) VALUES ($1, $2, $3, $4, $5)', [first_name, user_id, gender, last_name, email]);
        console.log("Data inserted successfully");
        res.status(201).redirect('/users/' + user_id);
    }
    catch (err) {
        console.error(err);
        console.log('DataBase Error');
        res.status(500).send('Database error');
    }
}))
    .delete(authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body;
    try {
        yield db_js_1.default.query('DELETE FROM qa.users WHERE user_id = $1', [user_id]);
        res.status(200).send("Data deleted successfully with user_id: " + user_id);
        console.log("Data deleted successfully with user_id: " + user_id);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
}));
router.route('/:id')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Received GET request for user with id: ${req.params.id}`);
    const { id } = req.params;
    try {
        const result = yield db_js_1.default.query('SELECT * FROM qa.users WHERE user_id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
}));
router.get('/:id/events', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_js_1.default.query('SELECT * FROM qa.events WHERE user_id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows);
        }
        else {
            res.send('NO EVENT LOGS FOUND');
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
}));
function authenticateToken(req, res, next) {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    try {
        const token = req.cookies.token;
        console.log('All cookies:', req.cookies);
        console.log('Token cookie:', req.cookies.token);
        console.log("token", token);
        if (!token) {
            res.status(401).send('Access token required');
            return;
        }
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(403).send('Token Expired or Invalid');
                return;
            }
            if (typeof user === 'object' && user !== null) {
                req.user = user;
                console.log("User Authorized is: ", req.user.name);
                next();
            }
            else {
                res.status(403).send('Invalid token payload');
            }
        });
    }
    catch (error) {
        console.log("Error accessing token");
        console.log(error);
        res.status(500).json({ "error": "Error Accessing token" });
    }
}
exports.default = router;
