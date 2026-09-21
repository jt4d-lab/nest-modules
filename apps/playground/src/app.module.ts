import { CommonModule } from '@jt4d/common';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

@Module({
    imports: [CommonModule.forRoot({ prefix: 'playground' })],
    controllers: [AppController],
})
export class AppModule {}
