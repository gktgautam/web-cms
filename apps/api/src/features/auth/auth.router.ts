import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { auth } from '../../core/security/authMiddleware.js';
const r = Router();
r.post('/register', auth(['ADMIN']), AuthController.register);
r.post('/login', AuthController.login);
export const authRouter = r;