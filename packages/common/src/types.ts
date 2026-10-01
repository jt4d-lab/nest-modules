export type Brand<T, U> = T & {
    readonly __brand: U;
};
