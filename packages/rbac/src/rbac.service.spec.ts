import { Test } from '@nestjs/testing';

import { RbacModule } from './rbac.module';
import { RbacService } from './rbac.service';

describe('RbacService', () => {
    it('проверяет разрешения и форматирует отчёт через CommonService', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                RbacModule.forRoot({
                    prefix: 'rbac',
                    roles: {
                        admin: ['users:read', 'users:write'],
                    },
                }),
            ],
        }).compile();

        const service = moduleRef.get(RbacService);

        expect(service.can('admin', 'users:read')).toBe(true);
        expect(service.can('viewer', 'users:read')).toBe(false);
        expect(service.describeAccess('admin', 'users:read')).toBe(
            '[rbac] admin -> users:read: allowed',
        );
    });
});
