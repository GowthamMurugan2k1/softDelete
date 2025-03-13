"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const playlisy_controller_1 = require("../controller/playlisy-controller");
const playListRouter = express_1.default.Router();
playListRouter.post('/', playlisy_controller_1.handleCreatePlaylist);
playListRouter.get('/', playlisy_controller_1.handleFetchPlaylist);
playListRouter.delete('/:id', playlisy_controller_1.handleDeletePlaylist);
exports.default = playListRouter;
