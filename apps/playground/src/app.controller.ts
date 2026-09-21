import { CommonService } from '@jt4d/common';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    constructor(private readonly common: CommonService) {}

    @Get()
    hello(): string {
        return this.common.format('playground is up');
    }
}
