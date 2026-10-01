import { JTCommonModule } from '@jt4d/nest-common';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

@Module({
    imports: [JTCommonModule],
    controllers: [AppController],
})
export class AppModule {}
