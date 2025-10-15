import { Request, Response } from 'express';
import { registerDto, loginDto } from './auth.schemas.js';
import { AuthService } from './auth.service.js';

export const AuthController = {
  register: async (req: Request, res: Response) => {
    const parsed = registerDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    const user = await AuthService.register(parsed.data);
    res.status(201).json({ id: user.id, email: user.email });
  },
  login: async (req: Request, res: Response) => {
    const parsed = loginDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    const result = await AuthService.login(parsed.data.email, parsed.data.password);
    if (!result) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(result);
  }
};