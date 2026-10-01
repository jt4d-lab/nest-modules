import { Module } from '@nestjs/common';

import { JTTimeService } from './time';

@Module({
    providers: [JTTimeService],
    exports: [JTTimeService],
})
export class JTCommonModule {}
