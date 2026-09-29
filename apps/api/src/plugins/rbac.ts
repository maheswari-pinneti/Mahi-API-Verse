import { FastifyRequest, FastifyReply } from 'fastify';

export enum Role {
  PUBLIC = 'PUBLIC',
  USER = 'USER',
  PROVIDER = 'PROVIDER',
  MODERATOR = 'MODERATOR',
  DATA_OPERATOR = 'DATA_OPERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export const RoleHierarchy: Record<Role, number> = {
  [Role.PUBLIC]: 0,
  [Role.USER]: 10,
  [Role.PROVIDER]: 20,
  [Role.MODERATOR]: 30,
  [Role.DATA_OPERATOR]: 40,
  [Role.ADMIN]: 50,
  [Role.SUPER_ADMIN]: 100
};

export enum Permission {
  CATALOG_READ = 'catalog.read',
  CATALOG_WRITE = 'catalog.write',
  PROVIDER_VERIFY = 'provider.verify',
  PROVIDER_EDIT = 'provider.edit',
  VERIFICATION_RUN = 'verification.run',
  DOCUMENTATION_EDIT = 'documentation.edit',
  DATA_RELEASE = 'data.release',
  ADMIN_USERS = 'admin.users',
  ADMIN_SYSTEM = 'admin.system'
}

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.PUBLIC]: [Permission.CATALOG_READ],
  [Role.USER]: [Permission.CATALOG_READ],
  [Role.PROVIDER]: [Permission.CATALOG_READ, Permission.PROVIDER_EDIT],
  [Role.MODERATOR]: [
    Permission.CATALOG_READ,
    Permission.PROVIDER_VERIFY,
    Permission.DOCUMENTATION_EDIT
  ],
  [Role.DATA_OPERATOR]: [
    Permission.CATALOG_READ,
    Permission.CATALOG_WRITE,
    Permission.VERIFICATION_RUN,
    Permission.DATA_RELEASE
  ],
  [Role.ADMIN]: [
    Permission.CATALOG_READ,
    Permission.CATALOG_WRITE,
    Permission.PROVIDER_VERIFY,
    Permission.PROVIDER_EDIT,
    Permission.VERIFICATION_RUN,
    Permission.DOCUMENTATION_EDIT,
    Permission.DATA_RELEASE,
    Permission.ADMIN_USERS
  ],
  [Role.SUPER_ADMIN]: Object.values(Permission)
};

/**
 * Utility to check if a user context has the required permission.
 * Currently simulates extracting user role from request context.
 * (In a real system, this reads from JWT/Session).
 */
export function requirePermission(requiredPermission: Permission) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Mock user context extraction (Phase 8 Auth is pending)
    // Normally: const user = await request.jwtVerify() or request.session.user
    
    // Fallback: Assume PUBLIC if no token is provided. 
    // In demo environments, you can pass ?role=ADMIN to test RBAC logic.
    const query = request.query as { role?: string };
    const userRoleString = query.role || 'PUBLIC';
    
    const userRole = Role[userRoleString as keyof typeof Role] || Role.PUBLIC;
    
    const allowedPermissions = RolePermissions[userRole] || [];
    
    if (!allowedPermissions.includes(requiredPermission) && userRole !== Role.SUPER_ADMIN) {
      return reply.status(403).send({
        status: 'error',
        error: {
          code: 'FORBIDDEN',
          message: `Action requires permission: ${requiredPermission}`,
          details: { role: userRole }
        }
      });
    }
  };
}
