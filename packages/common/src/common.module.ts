import { DynamicModule, Module } from '@nestjs/common';

import { COMMON_MODULE_OPTIONS, CommonModuleOptions } from './common.options';
import { CommonService } from './common.service';

@Module({})
export class CommonModule {
    static forRoot(options: CommonModuleOptions): DynamicModule {
        return {
            module: CommonModule,
            providers: [
                {
                    provide: COMMON_MODULE_OPTIONS,
                    useValue: options,
                },
                CommonService,
            ],
            exports: [CommonService],
        };
    }
}
