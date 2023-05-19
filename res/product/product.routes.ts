import { Router } from 'express';

import { ProductController } from './product.controller';

const router = Router();

router
    .get('/', ProductController.getAll)
    .get('/:id', ProductController.getOne)

export default router;

