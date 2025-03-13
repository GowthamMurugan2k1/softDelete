import express from 'express';
import { handleCreateVideo, handleDeleteVideo, handleFetchVideo } from '../controller/video-controller';

const videoRouter = express.Router()

videoRouter.post('/',handleCreateVideo)
videoRouter.get('/',handleFetchVideo)
videoRouter.delete('/:videoId',handleDeleteVideo)

export default videoRouter;

