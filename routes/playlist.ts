import express from 'express';
import { handleCreatePlaylist, handleDeletePlaylist, handleFetchPlaylist } from '../controller/playlisy-controller';

const playListRouter = express.Router()

playListRouter.post('/',handleCreatePlaylist)
playListRouter.get('/',handleFetchPlaylist)
playListRouter.delete('/:id',handleDeletePlaylist)

export default playListRouter;

