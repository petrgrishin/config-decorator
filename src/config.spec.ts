import { Config, Nullable, Option } from './config.decorator';

test('Config', async () => {
    @Config('app')
    class AppConfig {
        @Option({
            type: 'string',
            default: 'dev',
        })
        public readonly env!: string;

        @Option({
            type: 'number',
            default: 3000,
        })
        @Nullable()
        public readonly port!: number;
    }

    @Config('module')
    class ModuleConfig {
        @Option({
            type: 'string',
        })
        public readonly name!: string;
    }

    @Config()
    class DefaultConfig {
        @Option({
            type: 'string',
        })
        public readonly name!: string;

        @Option({
            type: 'string',
            transform: JSON.parse,
        })
        public readonly names!: string[];
    }

    process.env.APP_ENV = 'test';
    process.env.MODULE_NAME = 'test2';
    process.env.NAME = 'test3';
    process.env.NAMES = '["test4", "test5"]';
    const defaultConfig = new DefaultConfig();
    const appConfig = new AppConfig();
    const moduleConfig = new ModuleConfig();
    expect(appConfig.env).toBe('test');
    expect(moduleConfig.name).toBe('test2');
    expect(defaultConfig.name).toBe('test3');
    expect(defaultConfig.names.length).toBe(2);
    expect(defaultConfig.names).toEqual(expect.arrayContaining(['test4', 'test5']));
});
