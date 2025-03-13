"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const video_1 = __importDefault(require("./video"));
const playlist_1 = __importDefault(require("./playlist"));
const router = express_1.default.Router();
router.use('/video', video_1.default);
router.use('/playlist', playlist_1.default);
exports.default = router;
