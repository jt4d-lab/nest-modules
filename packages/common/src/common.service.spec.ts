import { Test } from '@nestjs/testing';

import { CommonModule } from './common.module';
import { CommonService } from './common.service';

describe('CommonService', () => {
    it('добавляет префикс из настроек модуля', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CommonModule.forRoot({ prefix: 'jt4d' })],
        }).compile();

        const service = moduleRef.get(CommonService);

        expect(service.format('ping')).toBe('[jt4d] ping');
    });
});
