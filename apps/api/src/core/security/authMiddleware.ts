import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function auth(requiredRoles?: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      (req as any).user = payload;
      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}