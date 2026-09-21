import { resolve } from 'node:path';

import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    root: import.meta.dirname,
    // esbuild не умеет emitDecoratorMetadata, а Nest DI на неё опирается — трансформируем через swc.
    plugins: [
        swc.vite({
            jsc: {
                parser: {
                    syntax: 'typescript',
                    decorators: true,
                },
                transform: {
                    decoratorMetadata: true,
                    legacyDecorator: true,
                    useDefineForClassFields: false,
                },
                target: 'es2022',
            },
        }),
    ],
    resolve: {
        alias: {
            // Резолвим workspace-пакеты в исходники, чтобы тесты не требовали предварительной сборки.
            '@jt4d/common': resolve(import.meta.dirname, '../../packages/common/src/index.ts'),
        },
    },
    test: {
        name: '@jt4d/playground',
        globals: true,
        environment: 'node',
        include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
        setupFiles: ['src/test-setup.ts'],
        server: {
            deps: {
                // packages/common/src лежит вне `root` — оставляем его в pipeline трансформации,
                // иначе unplugin-swc не проставит метаданные декораторов.
                inline: [/[\\/]packages[\\/]/],
            },
        },
    },
});
