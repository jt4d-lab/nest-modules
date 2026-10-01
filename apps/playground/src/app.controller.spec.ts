import { JTTimeService } from '@jt4d/nest-common';

import { AppController } from './app.controller';

describe('AppController', () => {
    let controller: AppController;

    beforeEach(() => {
        vi.useFakeTimers();
        controller = new AppController(new JTTimeService());
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('возвращает текущую метку времени в секундах', () => {
        vi.setSystemTime(new Date('2026-10-01T19:25:22.999Z'));

        expect(controller.now()).toBe(1790882722);
    });
});
