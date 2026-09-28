import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const ROLES = {
  ANONYMOUS: 'anonymous',
  DEVELOPER: 'developer',
  CONTRIBUTOR: 'contributor',
  PROVIDER: 'provider',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export interface JwtPayload {
  userId: string;
  role: Role;
  providerId?: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'development-super-secret-key-do-not-use-in-prod';

export class AuthEngine {
  /**
   * Generates a signed JWT token for a user.
   */
  static generateToken(userId: string, role: Role = ROLES.DEVELOPER, providerId?: string): string {
    const payload: JwtPayload = { userId, role };
    if (providerId) payload.providerId = providerId;
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  /**
   * Verifies and decodes a JWT token. Throws an error if invalid.
   */
  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (err) {
      throw new Error('Invalid or expired authentication token');
    }
  }

  /**
   * RBAC check: Returns true if the user's role meets or exceeds the required level.
   */
  static hasPermission(userRole: Role, requiredRole: Role): boolean {
    const roleHierarchy = [
      ROLES.ANONYMOUS,
      ROLES.DEVELOPER,
      ROLES.CONTRIBUTOR,
      ROLES.PROVIDER,
      ROLES.MODERATOR,
      ROLES.ADMIN
    ];

    const userLevel = roleHierarchy.indexOf(userRole);
    const requiredLevel = roleHierarchy.indexOf(requiredRole);

    return userLevel >= requiredLevel;
  }
}
