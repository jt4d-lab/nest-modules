import { Brand } from '../types';

export type Timestamp = Brand<number, 'Timestamp'>;

export interface JTTimeProvider {
    now(): Timestamp;
}
