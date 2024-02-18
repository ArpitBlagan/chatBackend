import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: any; // Modify 'any' to match the actual type of req.user if possible
  }
}