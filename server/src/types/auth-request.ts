import { Request } from 'express';
import { User } from 'src/auth/schema/user.schema';

export interface AuthenticatedRequest extends Request {
  user: User;
}