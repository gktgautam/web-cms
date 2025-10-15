import { prisma } from '../../core/prisma.js';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../../core/security/password.js';

export const AuthService = {
  register: async (data: any) => {
    const password = await hashPassword(data.password);
    const user = await prisma.user.create({ data: { ...data, password } });
    return user;
  },
  login: async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const ok = await comparePassword(password, user.password);
    if (!ok) return null;
    const accessToken = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    return { accessToken, user: { id: user.id, email: user.email, role: user.role, name: user.name } };
  }
};