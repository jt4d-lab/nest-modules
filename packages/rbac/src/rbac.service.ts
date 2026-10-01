import { CommonService } from '@jt4d/common';
import { Inject, Injectable } from '@nestjs/common';

import { RBAC_MODULE_OPTIONS } from './rbac.options';
import type { RbacModuleOptions } from './rbac.options';

@Injectable()
export class RbacService {
    constructor(
        @Inject(RBAC_MODULE_OPTIONS)
        private readonly options: RbacModuleOptions,
        private readonly common: CommonService,
    ) {}

    /** Выдано ли роли указанное разрешение. */
    can(role: string, permission: string): boolean {
        return this.options.roles?.[role]?.includes(permission) ?? false;
    }

    /** Отчёт о доступе, форматированный через CommonService. */
    describeAccess(role: string, permission: string): string {
        const verdict = this.can(role, permission) ? 'allowed' : 'denied';

        return this.common.format(`${role} -> ${permission}: ${verdict}`);
    }
}
