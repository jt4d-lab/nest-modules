import { Injectable } from '@nestjs/common';

import { JTTimeProvider, Timestamp } from './time.interface';

@Injectable()
export class JTTimeService implements JTTimeProvider {
    public now(): Timestamp {
        return Math.floor(Date.now() / 1000) as Timestamp;
    }
}
