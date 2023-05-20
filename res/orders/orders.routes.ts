import { Router } from 'express';

import { OrderController } from './orders.controller';

const router = Router();

router
    .get('/', OrderController.getAll)
    .get('/:id', OrderController.getOne)
    .post('/', OrderController.create)
    .put('/:id', OrderController.update)

export default router;