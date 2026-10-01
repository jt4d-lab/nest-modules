import { JTTimeService, type Timestamp } from '@jt4d/nest-common';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    constructor(private readonly time: JTTimeService) {}

    @Get()
    now(): Timestamp {
        return this.time.now();
    }
}
