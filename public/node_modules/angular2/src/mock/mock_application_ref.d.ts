import { ApplicationRef } from 'angular2/src/core/application_ref';
import { Type } from 'angular2/src/facade/lang';
import { ComponentRef, ComponentFactory } from 'angular2/src/core/linker/component_factory';
import { Injector } from 'angular2/src/core/di';
import { NgZone } from 'angular2/src/core/zone/ng_zone';
/**
 * A no-op implementation of {@link ApplicationRef}, useful for testing.
 */
export declare class MockApplicationRef extends ApplicationRef {
    registerBootstrapListener(listener: (ref: ComponentRef) => void): void;
    registerDisposeListener(dispose: () => void): void;
    bootstrap(componentFactory: ComponentFactory): ComponentRef;
    injector: Injector;
    zone: NgZone;
    run(callback: Function): any;
    waitForAsyncInitializers(): Promise<any>;
    dispose(): void;
    tick(): void;
    componentTypes: Type[];
}
