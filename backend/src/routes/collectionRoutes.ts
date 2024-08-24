import { Router } from 'express';
import collectionController from "../controller/collectionController";
const router = Router();

router.post('/add', collectionController.addCollection);
router.post('/getById', collectionController.getById);
router.post('/moveById', collectionController.moveById);
router.delete('/delete', collectionController.deleteById);
router.post('/rename', collectionController.rename);
router.post('/getByParentId', collectionController.getByParent);
router.post('/getAllByParentId', collectionController.getAllByParent);
router.post('/getAllByName', collectionController.getAllByName);

export default router;