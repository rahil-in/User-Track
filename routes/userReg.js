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
const router = express_1.default.Router();
const db_js_1 = __importDefault(require("../db.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
router.use(express_1.default.urlencoded({ extended: true }));
router.route('/')
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
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
        const result = yield db_js_1.default.query('SELECT * FROM qa.authentication_details WHERE user_name = $1', [req.body.user_name]);
        if (result.rows.length > 0) {
            console.log(`User already exists: ${req.body.user_name}`);
            res.status(409).send('User already exists');
            return;
        }
        else {
            yield db_js_1.default.query('INSERT INTO qa.authentication_details (user_name, password) VALUES ($1, $2)', [req.body.user_name, hashedPassword]);
            console.log("Data inserted successfully");
            res.status(201).send('User registered successfully');
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
}));
exports.default = router;
