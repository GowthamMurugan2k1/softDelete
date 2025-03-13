"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
dotenv_1.default.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;
// middleware
app.use(express_1.default.urlencoded({ extended: true }));
//Error Middleware
app.use(errorMiddleware_1.errorMiddleware);
app.use(express_1.default.json());
const corsOptions = {
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
// router 
app.use('/api/v1', routes_1.default);
app.listen(PORT, () => {
    console.log(`server running successfully port ${PORT}`);
});
