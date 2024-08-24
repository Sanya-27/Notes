import { Router } from 'express';
import pageController from "../controller/pageController";
const router = Router();

router.post('/add', pageController.addPage);
router.post('/save', pageController.savePage);
router.post('/rename', pageController.rename);
router.post('/getById', pageController.getContent);
router.post('/moveById', pageController.moveById);
router.delete('/delete', pageController.deletePage);

export default router;