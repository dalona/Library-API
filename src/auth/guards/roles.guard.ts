// src/auth/guards/roles.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../../common/enums/roles.decorator';
  import { Role } from 'src/common/enums/role.enum';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      console.log('RolesGuard: requiredRoles', requiredRoles);
  
      // Si no se especifican roles, permitir acceso
      if (!requiredRoles) {
        console.log('RolesGuard: No roles required, allowing access');
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      console.log('RolesGuard: user', user);
  
      if (!user) {
        console.log('RolesGuard: No user found in request');
        throw new ForbiddenException('No tienes permisos para acceder a este recurso');
      }
  
      const hasRole = requiredRoles.includes(user.role);
      console.log(`RolesGuard: User role (${user.role}) has required role: ${hasRole}`);
  
      if (!hasRole) {
        throw new ForbiddenException('No tienes el rol adecuado para acceder a este recurso');
      }
  
      return hasRole;
    }
  }
  



