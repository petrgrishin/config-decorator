# config-decorator
PoC: simple config decorator with type casting, validation and env-driven out of the box

## TL;DR

```typescript
import { Service } from 'fastify-decorators';
import { Config, Nullable, Option } from './config.decorator';

@Service()
@Config('app')
export class AppConfig {
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
```

Environment:
```dotenv
NODE_ENV=dev
APP_PORT=3000
```
