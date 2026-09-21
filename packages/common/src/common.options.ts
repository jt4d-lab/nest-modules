export interface CommonModuleOptions {
    /** Префикс, добавляемый ко всем сообщениям. */
    prefix: string;
}

export const COMMON_MODULE_OPTIONS = Symbol('COMMON_MODULE_OPTIONS');
