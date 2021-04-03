import 'reflect-metadata';
import { Container, decorate, injectable, inject, unmanaged, interfaces } from 'inversify';
import ServiceProviderScope from './ServiceProviderScope';

// This is a wrapper around Inversify to make the dependency injection more readable
// Instead of calling the decorate(inject()) method multiple times we can now just pass an array of arguments to inject
// Another option would be to use the decorators in the classes itself but I prever to keep the IoC implementation outside my classes so I can easily replace inverisy when neccessary.
export default abstract class ServiceProvider {
    public constructor(protected readonly container: Container) {}

    protected register(
        type: symbol,
        target: any,
        dependencies: Array<symbol> = [],
        scope: ServiceProviderScope = ServiceProviderScope.default
    ) {
        this.makeInjectable(target);
        this.bind(type, target, scope);
        this.injectDependencies(target, dependencies);
    }

    protected constant(type: symbol, value: any) {
        this.container.bind(type).toConstantValue(value);
    }

    protected dynamic(type: symbol, value: (context: interfaces.Context) => any) {
        this.container.bind(type).toDynamicValue(value);
    }

    protected makeInjectable(target: any) {
        decorate(injectable(), target);
    }

    private bind(type: symbol, target: any, scope: ServiceProviderScope) {
        const instance = this.container.bind(type).to(target);

        if (scope === ServiceProviderScope.singleton) {
            instance.inSingletonScope();
        } else if (scope === ServiceProviderScope.request) {
            instance.inRequestScope();
        }
    }

    private injectDependencies(target: any, dependencies: Array<symbol>) {
        for (const index in dependencies) {
            if (dependencies[index] === null) {
                // Inversify requires you to pass unmanaged if you do not want to inject something
                // This might sometimes be neccessary if you want to fallback on the default value
                decorate(unmanaged(), target, parseInt(index));
            } else {
                decorate(inject(dependencies[index]), target, parseInt(index));
            }
        }
    }

    public abstract bindServices(): void;
}
