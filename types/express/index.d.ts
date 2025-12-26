import { AuthUser } from "../auth/auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
