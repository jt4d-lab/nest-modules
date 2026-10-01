export interface RbacModuleOptions {
    /** Префикс, который RbacService передаёт в CommonService. */
    prefix: string;
    /** Карта «роль → разрешения». */
    roles?: Record<string, readonly string[]>;
}

export const RBAC_MODULE_OPTIONS = Symbol('RBAC_MODULE_OPTIONS');
