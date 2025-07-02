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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
router.route('/')
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name, password } = req.body;
    try {
        const result = yield db_js_1.default.query('SELECT * FROM qa.authentication_details WHERE user_name = $1', [user_name]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = yield bcrypt_1.default.compare(password, user.password);
            if (match) {
                console.log(`Login successful for user: ${user_name}`);
                //JWT
                const user = { name: user_name };
                const secret = process.env.ACCESS_TOKEN_SECRET;
                if (!secret)
                    throw new Error('ACCESS_TOKEN_SECRET is not defined');
                const access_token = jsonwebtoken_1.default.sign(user, secret, { expiresIn: '3m' });
                res.cookie('token', access_token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 3 * 60 * 1000 // 3 minutes to match JWT expiry
                });
                res.json({ access_token: access_token });
            }
            else {
                console.log(`Login failed for user: ${user_name}`);
                res.status(401).send('Invalid credentials');
            }
        }
        else {
            res.status(404).send('User not found');
            return;
        }
    }
    catch (_a) {
        console.error("error in user login");
        res.status(500).send('Database error');
    }
}));
exports.default = router;
