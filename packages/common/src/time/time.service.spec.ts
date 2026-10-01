import { JTTimeService } from './time.service';

describe('JTTimeService', () => {
    let service: JTTimeService;

    beforeEach(() => {
        vi.useFakeTimers();
        service = new JTTimeService();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('возвращает текущую метку времени в секундах, отбрасывая миллисекунды', () => {
        vi.setSystemTime(new Date('2026-10-01T19:25:22.999Z'));

        expect(service.now()).toBe(1790882722);
    });
});
