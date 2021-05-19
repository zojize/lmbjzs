import type {
    OutputFormatES,
    OutputFormatAmdCommonjs,
    OutputFormatGlobals,
    OutputFormatBare,
    OutputFormatUmd,
} from 'peggy';
import { generate } from 'peggy';
import { createFilter } from '@rollup/pluginutils';
import type { Plugin } from 'rollup';

export interface PluginPeggyOptions {
    include?: string[];
    exclude?: string[];
    parserBuildOptions?:
    | OutputFormatES
    | OutputFormatAmdCommonjs
    | OutputFormatGlobals
    | OutputFormatBare
    | OutputFormatUmd;
}

const defaultOptions: PluginPeggyOptions = {
    include: ['*.pegjs', '**/*.pegjs'],
    exclude: [],
    parserBuildOptions: {
        output: 'source',
        format: 'es',
    },
};

function definePlugin(plugin: Plugin): Plugin {
    return plugin;
}

export default ({
    include = defaultOptions.include,
    exclude = defaultOptions.exclude,
    parserBuildOptions = defaultOptions.parserBuildOptions,
}: PluginPeggyOptions = defaultOptions) =>
    definePlugin({
        name: 'plugin-peggy',
        transform(grammar: string, id) {
            const filter = createFilter(include, exclude);
            if (filter(id)) {
                const code = generate(
                    grammar,
                    parserBuildOptions as OutputFormatES,
                );
                return { code };
            }
            return null;
        },
    });
