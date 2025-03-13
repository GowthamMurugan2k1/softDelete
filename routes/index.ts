import express from 'express';
import videoRouter from './video';
import playListRouter from './playlist';


const router = express.Router()

router.use('/video',videoRouter)
router.use('/playlist',playListRouter)

export default router