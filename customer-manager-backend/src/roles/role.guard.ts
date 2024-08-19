import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/roles/role.enum';
import { ROLES_KEY } from 'src/roles/roles.decorator';
import { NOT_AUTHORIZED } from 'src/utils/messageConstants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const _canActive = requiredRoles.some((role) => role === user?.role);

    if (_canActive) return _canActive;

    throw new ForbiddenException(NOT_AUTHORIZED);
  }
}
