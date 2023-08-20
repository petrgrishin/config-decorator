# config-decorator
PoC: simple config decorator with type casting, validation and env-driven out of the box

## TL;DR

```typescript
import { Config, Nullable, Option } from './config.decorator';

@Config('app')
export class AppConfig {
    @Option({
        type: 'number',
        default: 3000,
    })
    @Nullable()
    public readonly port!: number;
}

const appConfig = new AppConfig();
console.log(appConfig.port);
// 3000
```

Environment:
```dotenv
APP_PORT=3000
```
