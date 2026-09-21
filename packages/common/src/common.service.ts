import { Inject, Injectable } from '@nestjs/common';

import { COMMON_MODULE_OPTIONS } from './common.options';
import type { CommonModuleOptions } from './common.options';

@Injectable()
export class CommonService {
    constructor(
        @Inject(COMMON_MODULE_OPTIONS)
        private readonly options: CommonModuleOptions,
    ) {}

    format(message: string): string {
        return `[${this.options.prefix}] ${message}`;
    }
}
