import { Router } from 'express';
import { CartController } from './cart.controller';


const router = Router();

router
  .get('/', CartController.getAll)
  .delete('/', CartController.deleteAll)
  .delete('/:id', CartController.deleteOne)
  .put('/:id', CartController.updateOne)
  .post('/', CartController.addItemToCart)

export default router;