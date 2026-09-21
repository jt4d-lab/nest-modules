import { Test } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppModule } from './app.module';

describe('AppController', () => {
    it('использует CommonService из @jt4d/common', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        const controller = moduleRef.get(AppController);

        expect(controller.hello()).toBe('[playground] playground is up');
    });
});
