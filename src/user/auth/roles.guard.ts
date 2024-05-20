import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no role is passed, allow access
    if (!roles) {
      return true;
    }

    const request = await context.switchToHttp().getRequest();

    // Deny access if user or user roles are missing
    if (!request || !request.user || !request.user.role) {
      return false;
    }

    const userRoles = request.user.role;

    return this.validateRoles(roles, userRoles);
  }

  private async validateRoles(
    roles: string[],
    userRoles: string[],
  ): Promise<boolean> {
    return roles.some((role) => userRoles.includes(role));
  }
}
