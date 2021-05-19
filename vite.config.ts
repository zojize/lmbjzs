import type { UserConfig, ConfigEnv, UserConfigFn } from 'vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import peggy from './plugins/plugin-peggy';
import path from 'path';

const ConfigMode = Symbol();

function mode<M extends string, T extends Record<M, unknown>>(
    table: T,
): <K extends M>(mode: K) => T[K] {
    function fn<K extends M>(mode: K): T[K] {
        return table[mode];
    }
    fn[ConfigMode] = true;
    return fn;
}

type ModeSpecificConfigProp<T, M extends string = string> =
    | T
    | ((mode: M) => T);
type ModeSpecificConfig<T = UserConfig, M extends string = string> = {
    [K in keyof T]: T[K] extends Record<string, any>
        ? ModeSpecificConfig<T[K], M>
        : ModeSpecificConfigProp<T[K], M> | ModeSpecificConfig<T[K], M>;
};

function* traverseDeep(obj: any): Generator<{
    key: keyof any;
    value: unknown;
    get(): unknown;
    set(value: any): void;
}> {
    for (const [k, v] of Object.entries(obj)) {
        yield {
            key: k,
            value: v,
            get() {
                return obj[k];
            },
            set(value: any) {
                obj[k] = value;
            },
        };
        if (v && (typeof v === 'object' || Array.isArray(v))) {
            yield* traverseDeep(v);
        }
    }
}

function createConfig<C = UserConfig, M extends string = string>(
    common: C,
    {
        build,
        serve,
    }: {
        [K in ConfigEnv['command']]?: ModeSpecificConfig<Partial<C>, M>;
    },
): UserConfigFn {
    return defineConfig(({ command, mode }) => {
        for (const config of [common, build, serve].filter(Boolean)) {
            for (const { value, set } of traverseDeep(config)) {
                if (typeof value === 'function' && value[ConfigMode]) {
                    set(value(mode));
                }
            }
        }
        return {
            serve: Object.assign({}, common, serve),
            build: Object.assign({}, common, build),
        }[command];
    }) as UserConfigFn;
}

export default createConfig<UserConfig, 'lib' | 'page'>(
    {
        plugins: [
            vue(),
            peggy({
                parserBuildOptions: { output: 'source', format: 'es' },
            }),
        ],
    },
    {
        build: {
            root: mode({ lib: '.', page: 'page' }),
            base: './',
            build: {
                outDir: mode({ lib: 'lib', page: '../dist' }),
                emptyOutDir: true,
                assetsDir: mode({ lib: void 0, page: 'resources' }),
                lib: mode({
                    lib: {
                        name: 'lmbjzs',
                        entry: path.resolve(__dirname, 'src/index.ts'),
                    },
                    page: void 0,
                }),
            },
        },
    },
);
