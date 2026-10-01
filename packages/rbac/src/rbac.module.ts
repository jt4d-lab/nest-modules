import { CommonModule } from '@jt4d/common';
import { DynamicModule, Module } from '@nestjs/common';

import { RBAC_MODULE_OPTIONS, RbacModuleOptions } from './rbac.options';
import { RbacService } from './rbac.service';

@Module({})
export class RbacModule {
    static forRoot(options: RbacModuleOptions): DynamicModule {
        return {
            module: RbacModule,
            imports: [CommonModule.forRoot({ prefix: options.prefix })],
            providers: [
                {
                    provide: RBAC_MODULE_OPTIONS,
                    useValue: options,
                },
                RbacService,
            ],
            exports: [RbacService],
        };
    }
}
