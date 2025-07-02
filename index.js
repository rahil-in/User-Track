"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies i.e form submissions
app.use((0, cookie_parser_1.default)()); //Middleware to parse cookies
const users_js_1 = __importDefault(require("./routes/users.js"));
const userReg_js_1 = __importDefault(require("./routes/userReg.js"));
const userLogin_js_1 = __importDefault(require("./routes/userLogin.js"));
app.get('/', (req, res) => {
    res.json({
        "Hello World!": "Welcome to the Express.js server!", "status": "running"
    });
});
app.use('/users', users_js_1.default);
app.use('/Register', userReg_js_1.default);
app.use('/login', userLogin_js_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
