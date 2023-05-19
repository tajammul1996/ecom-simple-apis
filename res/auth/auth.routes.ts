import { Router } from 'express';

import { AuthController } from './auth.controller';

const router = Router();

router
    .post('/login', AuthController.login)
    .post('/register', AuthController.register)
    .post('/logout', AuthController.logout)
    .get('/me', AuthController.protect, AuthController.me)

export default router;