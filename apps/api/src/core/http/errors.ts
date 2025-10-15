export class AppError extends Error { status: number; constructor(message: string, status = 400){ super(message); this.status = status; } }
export class UnauthorizedError extends AppError { constructor(msg='Unauthorized'){ super(msg, 401); } }
export class ForbiddenError extends AppError { constructor(msg='Forbidden'){ super(msg, 403); } }
export class NotFoundError extends AppError { constructor(msg='Not Found'){ super(msg, 404); } }