import 'reflect-metadata';
import { envSchema, EnvSchemaData } from 'env-schema';
import kebabCase from 'lodash.kebabcase';

export const ConfigSchemaSymbol = Symbol('ConfigSchemaSymbol');

interface Schema {
    required: string[];
    properties: Record<string, object>;
    nullable?: string[];
}

const initConfigSchema = {
    required: [],
    nullable: [],
    properties: {},
};

export function Config(prefix?: string): ClassDecorator {
    return <TFunction extends Object>(target: TFunction): TFunction => {
        return function () {
            const schema = Reflect.getMetadata(ConfigSchemaSymbol, target);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            loadConfig(this, schema, prefix);
        } as unknown as TFunction;
    };
}

export function Option(optionSchema = {}): PropertyDecorator {
    return (target, propertyKey): void => {
        if (!Reflect.hasMetadata(ConfigSchemaSymbol, target.constructor)) {
            Reflect.defineMetadata(ConfigSchemaSymbol, initConfigSchema, target.constructor);
        }
        const schema = Reflect.getMetadata(ConfigSchemaSymbol, target.constructor);
        schema.required.push(propertyKey);
        schema.properties[propertyKey] = optionSchema;
        Reflect.defineMetadata(ConfigSchemaSymbol, schema, target.constructor);
    };
}

export function Nullable(): PropertyDecorator {
    return (target, propertyKey): void => {
        if (!Reflect.hasMetadata(ConfigSchemaSymbol, target.constructor)) {
            Reflect.defineMetadata(ConfigSchemaSymbol, initConfigSchema, target.constructor);
        }
        const schema = Reflect.getMetadata(ConfigSchemaSymbol, target.constructor);
        schema.nullable.push(propertyKey);
        Reflect.defineMetadata(ConfigSchemaSymbol, schema, target.constructor);
    };
}

const nullable = (schema: Schema): Schema => {
    const required = schema.required.filter((name: string) => !schema.nullable?.includes(name));
    delete schema.nullable;
    return { ...schema, required };
};

const optionNameConverter = (schema: Schema, prefix?: string) => {
    const mapToKebabCase: Record<string, string> = {};
    const mapToOriginCase: Record<string, string> = {};
    const schemaProperties: Record<string, object> = {};

    for (const name of Object.keys(schema.properties)) {
        let nameInKebabCase = kebabCase(name);
        if (prefix) {
            nameInKebabCase = `${prefix}_${nameInKebabCase}`;
        }
        nameInKebabCase = nameInKebabCase.toUpperCase();

        mapToKebabCase[name] = nameInKebabCase;
        mapToOriginCase[nameInKebabCase] = name;
        schemaProperties[nameInKebabCase] = schema.properties[name];
    }

    return {
        convertedSchema: {
            ...schema,
            required: schema.required.map((name) => mapToKebabCase[name]),
            properties: schemaProperties,
        },
        envToOption: (data: EnvSchemaData, target: object) => {
            for (const [name, value] of Object.entries(data)) {
                Object.defineProperty(target, mapToOriginCase[name], { value });
            }
        },
    };
};

export const loadConfig = (target: object, schema: Schema, prefix?: string) => {
    schema = nullable(schema);
    const { convertedSchema, envToOption } = optionNameConverter(schema, prefix);
    const data: EnvSchemaData = envSchema({
        dotenv: true,
        schema: { type: 'object', ...convertedSchema },
    });
    envToOption(data, target);
};
