import { ListWrapper } from 'angular2/src/facade/collection';
import { resolveReflectiveProviders } from './reflective_provider';
import { AbstractProviderError, NoProviderError, CyclicDependencyError, InstantiationError, OutOfBoundsError } from './reflective_exceptions';
import { CONST_EXPR } from 'angular2/src/facade/lang';
import { BaseException, unimplemented } from 'angular2/src/facade/exceptions';
import { ReflectiveKey } from './reflective_key';
import { SelfMetadata, SkipSelfMetadata } from './metadata';
import { Injector, THROW_IF_NOT_FOUND } from './injector';
var __unused; // avoid unused import when Type union types are erased
// Threshold for the dynamic version
const _MAX_CONSTRUCTION_COUNTER = 10;
const UNDEFINED = CONST_EXPR(new Object());
export class ReflectiveProtoInjectorInlineStrategy {
    constructor(protoEI, providers) {
        this.provider0 = null;
        this.provider1 = null;
        this.provider2 = null;
        this.provider3 = null;
        this.provider4 = null;
        this.provider5 = null;
        this.provider6 = null;
        this.provider7 = null;
        this.provider8 = null;
        this.provider9 = null;
        this.keyId0 = null;
        this.keyId1 = null;
        this.keyId2 = null;
        this.keyId3 = null;
        this.keyId4 = null;
        this.keyId5 = null;
        this.keyId6 = null;
        this.keyId7 = null;
        this.keyId8 = null;
        this.keyId9 = null;
        var length = providers.length;
        if (length > 0) {
            this.provider0 = providers[0];
            this.keyId0 = providers[0].key.id;
        }
        if (length > 1) {
            this.provider1 = providers[1];
            this.keyId1 = providers[1].key.id;
        }
        if (length > 2) {
            this.provider2 = providers[2];
            this.keyId2 = providers[2].key.id;
        }
        if (length > 3) {
            this.provider3 = providers[3];
            this.keyId3 = providers[3].key.id;
        }
        if (length > 4) {
            this.provider4 = providers[4];
            this.keyId4 = providers[4].key.id;
        }
        if (length > 5) {
            this.provider5 = providers[5];
            this.keyId5 = providers[5].key.id;
        }
        if (length > 6) {
            this.provider6 = providers[6];
            this.keyId6 = providers[6].key.id;
        }
        if (length > 7) {
            this.provider7 = providers[7];
            this.keyId7 = providers[7].key.id;
        }
        if (length > 8) {
            this.provider8 = providers[8];
            this.keyId8 = providers[8].key.id;
        }
        if (length > 9) {
            this.provider9 = providers[9];
            this.keyId9 = providers[9].key.id;
        }
    }
    getProviderAtIndex(index) {
        if (index == 0)
            return this.provider0;
        if (index == 1)
            return this.provider1;
        if (index == 2)
            return this.provider2;
        if (index == 3)
            return this.provider3;
        if (index == 4)
            return this.provider4;
        if (index == 5)
            return this.provider5;
        if (index == 6)
            return this.provider6;
        if (index == 7)
            return this.provider7;
        if (index == 8)
            return this.provider8;
        if (index == 9)
            return this.provider9;
        throw new OutOfBoundsError(index);
    }
    createInjectorStrategy(injector) {
        return new ReflectiveInjectorInlineStrategy(injector, this);
    }
}
export class ReflectiveProtoInjectorDynamicStrategy {
    constructor(protoInj, providers) {
        this.providers = providers;
        var len = providers.length;
        this.keyIds = ListWrapper.createFixedSize(len);
        for (var i = 0; i < len; i++) {
            this.keyIds[i] = providers[i].key.id;
        }
    }
    getProviderAtIndex(index) {
        if (index < 0 || index >= this.providers.length) {
            throw new OutOfBoundsError(index);
        }
        return this.providers[index];
    }
    createInjectorStrategy(ei) {
        return new ReflectiveInjectorDynamicStrategy(this, ei);
    }
}
export class ReflectiveProtoInjector {
    constructor(providers) {
        this.numberOfProviders = providers.length;
        this._strategy = providers.length > _MAX_CONSTRUCTION_COUNTER ?
            new ReflectiveProtoInjectorDynamicStrategy(this, providers) :
            new ReflectiveProtoInjectorInlineStrategy(this, providers);
    }
    static fromResolvedProviders(providers) {
        return new ReflectiveProtoInjector(providers);
    }
    getProviderAtIndex(index) {
        return this._strategy.getProviderAtIndex(index);
    }
}
export class ReflectiveInjectorInlineStrategy {
    constructor(injector, protoStrategy) {
        this.injector = injector;
        this.protoStrategy = protoStrategy;
        this.obj0 = UNDEFINED;
        this.obj1 = UNDEFINED;
        this.obj2 = UNDEFINED;
        this.obj3 = UNDEFINED;
        this.obj4 = UNDEFINED;
        this.obj5 = UNDEFINED;
        this.obj6 = UNDEFINED;
        this.obj7 = UNDEFINED;
        this.obj8 = UNDEFINED;
        this.obj9 = UNDEFINED;
    }
    resetConstructionCounter() { this.injector._constructionCounter = 0; }
    instantiateProvider(provider) {
        return this.injector._new(provider);
    }
    getObjByKeyId(keyId) {
        var p = this.protoStrategy;
        var inj = this.injector;
        if (p.keyId0 === keyId) {
            if (this.obj0 === UNDEFINED) {
                this.obj0 = inj._new(p.provider0);
            }
            return this.obj0;
        }
        if (p.keyId1 === keyId) {
            if (this.obj1 === UNDEFINED) {
                this.obj1 = inj._new(p.provider1);
            }
            return this.obj1;
        }
        if (p.keyId2 === keyId) {
            if (this.obj2 === UNDEFINED) {
                this.obj2 = inj._new(p.provider2);
            }
            return this.obj2;
        }
        if (p.keyId3 === keyId) {
            if (this.obj3 === UNDEFINED) {
                this.obj3 = inj._new(p.provider3);
            }
            return this.obj3;
        }
        if (p.keyId4 === keyId) {
            if (this.obj4 === UNDEFINED) {
                this.obj4 = inj._new(p.provider4);
            }
            return this.obj4;
        }
        if (p.keyId5 === keyId) {
            if (this.obj5 === UNDEFINED) {
                this.obj5 = inj._new(p.provider5);
            }
            return this.obj5;
        }
        if (p.keyId6 === keyId) {
            if (this.obj6 === UNDEFINED) {
                this.obj6 = inj._new(p.provider6);
            }
            return this.obj6;
        }
        if (p.keyId7 === keyId) {
            if (this.obj7 === UNDEFINED) {
                this.obj7 = inj._new(p.provider7);
            }
            return this.obj7;
        }
        if (p.keyId8 === keyId) {
            if (this.obj8 === UNDEFINED) {
                this.obj8 = inj._new(p.provider8);
            }
            return this.obj8;
        }
        if (p.keyId9 === keyId) {
            if (this.obj9 === UNDEFINED) {
                this.obj9 = inj._new(p.provider9);
            }
            return this.obj9;
        }
        return UNDEFINED;
    }
    getObjAtIndex(index) {
        if (index == 0)
            return this.obj0;
        if (index == 1)
            return this.obj1;
        if (index == 2)
            return this.obj2;
        if (index == 3)
            return this.obj3;
        if (index == 4)
            return this.obj4;
        if (index == 5)
            return this.obj5;
        if (index == 6)
            return this.obj6;
        if (index == 7)
            return this.obj7;
        if (index == 8)
            return this.obj8;
        if (index == 9)
            return this.obj9;
        throw new OutOfBoundsError(index);
    }
    getMaxNumberOfObjects() { return _MAX_CONSTRUCTION_COUNTER; }
}
export class ReflectiveInjectorDynamicStrategy {
    constructor(protoStrategy, injector) {
        this.protoStrategy = protoStrategy;
        this.injector = injector;
        this.objs = ListWrapper.createFixedSize(protoStrategy.providers.length);
        ListWrapper.fill(this.objs, UNDEFINED);
    }
    resetConstructionCounter() { this.injector._constructionCounter = 0; }
    instantiateProvider(provider) {
        return this.injector._new(provider);
    }
    getObjByKeyId(keyId) {
        var p = this.protoStrategy;
        for (var i = 0; i < p.keyIds.length; i++) {
            if (p.keyIds[i] === keyId) {
                if (this.objs[i] === UNDEFINED) {
                    this.objs[i] = this.injector._new(p.providers[i]);
                }
                return this.objs[i];
            }
        }
        return UNDEFINED;
    }
    getObjAtIndex(index) {
        if (index < 0 || index >= this.objs.length) {
            throw new OutOfBoundsError(index);
        }
        return this.objs[index];
    }
    getMaxNumberOfObjects() { return this.objs.length; }
}
/**
 * A ReflectiveDependency injection container used for instantiating objects and resolving
 * dependencies.
 *
 * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
 * constructor dependencies.
 *
 * In typical use, application code asks for the dependencies in the constructor and they are
 * resolved by the `Injector`.
 *
 * ### Example ([live demo](http://plnkr.co/edit/jzjec0?p=preview))
 *
 * The following example creates an `Injector` configured to create `Engine` and `Car`.
 *
 * ```typescript
 * @Injectable()
 * class Engine {
 * }
 *
 * @Injectable()
 * class Car {
 *   constructor(public engine:Engine) {}
 * }
 *
 * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
 * var car = injector.get(Car);
 * expect(car instanceof Car).toBe(true);
 * expect(car.engine instanceof Engine).toBe(true);
 * ```
 *
 * Notice, we don't use the `new` operator because we explicitly want to have the `Injector`
 * resolve all of the object's dependencies automatically.
 */
export class ReflectiveInjector {
    /**
     * Turns an array of provider definitions into an array of resolved providers.
     *
     * A resolution is a process of flattening multiple nested arrays and converting individual
     * providers into an array of {@link ResolvedReflectiveProvider}s.
     *
     * ### Example ([live demo](http://plnkr.co/edit/AiXTHi?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var providers = ReflectiveInjector.resolve([Car, [[Engine]]]);
     *
     * expect(providers.length).toEqual(2);
     *
     * expect(providers[0] instanceof ResolvedReflectiveProvider).toBe(true);
     * expect(providers[0].key.displayName).toBe("Car");
     * expect(providers[0].dependencies.length).toEqual(1);
     * expect(providers[0].factory).toBeDefined();
     *
     * expect(providers[1].key.displayName).toBe("Engine");
     * });
     * ```
     *
     * See {@link ReflectiveInjector#fromResolvedProviders} for more info.
     */
    static resolve(providers) {
        return resolveReflectiveProviders(providers);
    }
    /**
     * Resolves an array of providers and creates an injector from those providers.
     *
     * The passed-in providers can be an array of `Type`, {@link Provider},
     * or a recursive array of more providers.
     *
     * ### Example ([live demo](http://plnkr.co/edit/ePOccA?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
     * expect(injector.get(Car) instanceof Car).toBe(true);
     * ```
     *
     * This function is slower than the corresponding `fromResolvedProviders`
     * because it needs to resolve the passed-in providers first.
     * See {@link Injector#resolve} and {@link Injector#fromResolvedProviders}.
     */
    static resolveAndCreate(providers, parent = null) {
        var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
        return ReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
    }
    /**
     * Creates an injector from previously resolved providers.
     *
     * This API is the recommended way to construct injectors in performance-sensitive parts.
     *
     * ### Example ([live demo](http://plnkr.co/edit/KrSMci?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var providers = ReflectiveInjector.resolve([Car, Engine]);
     * var injector = ReflectiveInjector.fromResolvedProviders(providers);
     * expect(injector.get(Car) instanceof Car).toBe(true);
     * ```
     */
    static fromResolvedProviders(providers, parent = null) {
        return new ReflectiveInjector_(ReflectiveProtoInjector.fromResolvedProviders(providers), parent);
    }
    /**
     * @deprecated
     */
    static fromResolvedBindings(providers) {
        return ReflectiveInjector.fromResolvedProviders(providers);
    }
    /**
     * Parent of this injector.
     *
     * <!-- TODO: Add a link to the section of the user guide talking about hierarchical injection.
     * -->
     *
     * ### Example ([live demo](http://plnkr.co/edit/eosMGo?p=preview))
     *
     * ```typescript
     * var parent = ReflectiveInjector.resolveAndCreate([]);
     * var child = parent.resolveAndCreateChild([]);
     * expect(child.parent).toBe(parent);
     * ```
     */
    get parent() { return unimplemented(); }
    /**
     * @internal
     */
    debugContext() { return null; }
    /**
     * Resolves an array of providers and creates a child injector from those providers.
     *
     * <!-- TODO: Add a link to the section of the user guide talking about hierarchical injection.
     * -->
     *
     * The passed-in providers can be an array of `Type`, {@link Provider},
     * or a recursive array of more providers.
     *
     * ### Example ([live demo](http://plnkr.co/edit/opB3T4?p=preview))
     *
     * ```typescript
     * class ParentProvider {}
     * class ChildProvider {}
     *
     * var parent = ReflectiveInjector.resolveAndCreate([ParentProvider]);
     * var child = parent.resolveAndCreateChild([ChildProvider]);
     *
     * expect(child.get(ParentProvider) instanceof ParentProvider).toBe(true);
     * expect(child.get(ChildProvider) instanceof ChildProvider).toBe(true);
     * expect(child.get(ParentProvider)).toBe(parent.get(ParentProvider));
     * ```
     *
     * This function is slower than the corresponding `createChildFromResolved`
     * because it needs to resolve the passed-in providers first.
     * See {@link Injector#resolve} and {@link Injector#createChildFromResolved}.
     */
    resolveAndCreateChild(providers) {
        return unimplemented();
    }
    /**
     * Creates a child injector from previously resolved providers.
     *
     * <!-- TODO: Add a link to the section of the user guide talking about hierarchical injection.
     * -->
     *
     * This API is the recommended way to construct injectors in performance-sensitive parts.
     *
     * ### Example ([live demo](http://plnkr.co/edit/VhyfjN?p=preview))
     *
     * ```typescript
     * class ParentProvider {}
     * class ChildProvider {}
     *
     * var parentProviders = ReflectiveInjector.resolve([ParentProvider]);
     * var childProviders = ReflectiveInjector.resolve([ChildProvider]);
     *
     * var parent = ReflectiveInjector.fromResolvedProviders(parentProviders);
     * var child = parent.createChildFromResolved(childProviders);
     *
     * expect(child.get(ParentProvider) instanceof ParentProvider).toBe(true);
     * expect(child.get(ChildProvider) instanceof ChildProvider).toBe(true);
     * expect(child.get(ParentProvider)).toBe(parent.get(ParentProvider));
     * ```
     */
    createChildFromResolved(providers) {
        return unimplemented();
    }
    /**
     * Resolves a provider and instantiates an object in the context of the injector.
     *
     * The created object does not get cached by the injector.
     *
     * ### Example ([live demo](http://plnkr.co/edit/yvVXoB?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var injector = ReflectiveInjector.resolveAndCreate([Engine]);
     *
     * var car = injector.resolveAndInstantiate(Car);
     * expect(car.engine).toBe(injector.get(Engine));
     * expect(car).not.toBe(injector.resolveAndInstantiate(Car));
     * ```
     */
    resolveAndInstantiate(provider) { return unimplemented(); }
    /**
     * Instantiates an object using a resolved provider in the context of the injector.
     *
     * The created object does not get cached by the injector.
     *
     * ### Example ([live demo](http://plnkr.co/edit/ptCImQ?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var injector = ReflectiveInjector.resolveAndCreate([Engine]);
     * var carProvider = ReflectiveInjector.resolve([Car])[0];
     * var car = injector.instantiateResolved(carProvider);
     * expect(car.engine).toBe(injector.get(Engine));
     * expect(car).not.toBe(injector.instantiateResolved(carProvider));
     * ```
     */
    instantiateResolved(provider) { return unimplemented(); }
}
export class ReflectiveInjector_ {
    /**
     * Private
     */
    constructor(_proto /* ProtoInjector */, _parent = null, _debugContext = null) {
        this._debugContext = _debugContext;
        /** @internal */
        this._constructionCounter = 0;
        this._proto = _proto;
        this._parent = _parent;
        this._strategy = _proto._strategy.createInjectorStrategy(this);
    }
    /**
     * @internal
     */
    debugContext() { return this._debugContext(); }
    get(token, notFoundValue = THROW_IF_NOT_FOUND) {
        return this._getByKey(ReflectiveKey.get(token), null, null, notFoundValue);
    }
    getAt(index) { return this._strategy.getObjAtIndex(index); }
    get parent() { return this._parent; }
    /**
     * @internal
     * Internal. Do not use.
     * We return `any` not to export the InjectorStrategy type.
     */
    get internalStrategy() { return this._strategy; }
    resolveAndCreateChild(providers) {
        var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
        return this.createChildFromResolved(ResolvedReflectiveProviders);
    }
    createChildFromResolved(providers) {
        var proto = new ReflectiveProtoInjector(providers);
        var inj = new ReflectiveInjector_(proto);
        inj._parent = this;
        return inj;
    }
    resolveAndInstantiate(provider) {
        return this.instantiateResolved(ReflectiveInjector.resolve([provider])[0]);
    }
    instantiateResolved(provider) {
        return this._instantiateProvider(provider);
    }
    /** @internal */
    _new(provider) {
        if (this._constructionCounter++ > this._strategy.getMaxNumberOfObjects()) {
            throw new CyclicDependencyError(this, provider.key);
        }
        return this._instantiateProvider(provider);
    }
    _instantiateProvider(provider) {
        if (provider.multiProvider) {
            var res = ListWrapper.createFixedSize(provider.resolvedFactories.length);
            for (var i = 0; i < provider.resolvedFactories.length; ++i) {
                res[i] = this._instantiate(provider, provider.resolvedFactories[i]);
            }
            return res;
        }
        else {
            return this._instantiate(provider, provider.resolvedFactories[0]);
        }
    }
    _instantiate(provider, ResolvedReflectiveFactory) {
        var factory = ResolvedReflectiveFactory.factory;
        var deps = ResolvedReflectiveFactory.dependencies;
        var length = deps.length;
        var d0;
        var d1;
        var d2;
        var d3;
        var d4;
        var d5;
        var d6;
        var d7;
        var d8;
        var d9;
        var d10;
        var d11;
        var d12;
        var d13;
        var d14;
        var d15;
        var d16;
        var d17;
        var d18;
        var d19;
        try {
            d0 = length > 0 ? this._getByReflectiveDependency(provider, deps[0]) : null;
            d1 = length > 1 ? this._getByReflectiveDependency(provider, deps[1]) : null;
            d2 = length > 2 ? this._getByReflectiveDependency(provider, deps[2]) : null;
            d3 = length > 3 ? this._getByReflectiveDependency(provider, deps[3]) : null;
            d4 = length > 4 ? this._getByReflectiveDependency(provider, deps[4]) : null;
            d5 = length > 5 ? this._getByReflectiveDependency(provider, deps[5]) : null;
            d6 = length > 6 ? this._getByReflectiveDependency(provider, deps[6]) : null;
            d7 = length > 7 ? this._getByReflectiveDependency(provider, deps[7]) : null;
            d8 = length > 8 ? this._getByReflectiveDependency(provider, deps[8]) : null;
            d9 = length > 9 ? this._getByReflectiveDependency(provider, deps[9]) : null;
            d10 = length > 10 ? this._getByReflectiveDependency(provider, deps[10]) : null;
            d11 = length > 11 ? this._getByReflectiveDependency(provider, deps[11]) : null;
            d12 = length > 12 ? this._getByReflectiveDependency(provider, deps[12]) : null;
            d13 = length > 13 ? this._getByReflectiveDependency(provider, deps[13]) : null;
            d14 = length > 14 ? this._getByReflectiveDependency(provider, deps[14]) : null;
            d15 = length > 15 ? this._getByReflectiveDependency(provider, deps[15]) : null;
            d16 = length > 16 ? this._getByReflectiveDependency(provider, deps[16]) : null;
            d17 = length > 17 ? this._getByReflectiveDependency(provider, deps[17]) : null;
            d18 = length > 18 ? this._getByReflectiveDependency(provider, deps[18]) : null;
            d19 = length > 19 ? this._getByReflectiveDependency(provider, deps[19]) : null;
        }
        catch (e) {
            if (e instanceof AbstractProviderError || e instanceof InstantiationError) {
                e.addKey(this, provider.key);
            }
            throw e;
        }
        var obj;
        try {
            switch (length) {
                case 0:
                    obj = factory();
                    break;
                case 1:
                    obj = factory(d0);
                    break;
                case 2:
                    obj = factory(d0, d1);
                    break;
                case 3:
                    obj = factory(d0, d1, d2);
                    break;
                case 4:
                    obj = factory(d0, d1, d2, d3);
                    break;
                case 5:
                    obj = factory(d0, d1, d2, d3, d4);
                    break;
                case 6:
                    obj = factory(d0, d1, d2, d3, d4, d5);
                    break;
                case 7:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6);
                    break;
                case 8:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7);
                    break;
                case 9:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8);
                    break;
                case 10:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9);
                    break;
                case 11:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10);
                    break;
                case 12:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11);
                    break;
                case 13:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12);
                    break;
                case 14:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13);
                    break;
                case 15:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14);
                    break;
                case 16:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15);
                    break;
                case 17:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16);
                    break;
                case 18:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17);
                    break;
                case 19:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18);
                    break;
                case 20:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19);
                    break;
                default:
                    throw new BaseException(`Cannot instantiate '${provider.key.displayName}' because it has more than 20 dependencies`);
            }
        }
        catch (e) {
            throw new InstantiationError(this, e, e.stack, provider.key);
        }
        return obj;
    }
    _getByReflectiveDependency(provider, dep) {
        return this._getByKey(dep.key, dep.lowerBoundVisibility, dep.upperBoundVisibility, dep.optional ? null : THROW_IF_NOT_FOUND);
    }
    _getByKey(key, lowerBoundVisibility, upperBoundVisibility, notFoundValue) {
        if (key === INJECTOR_KEY) {
            return this;
        }
        if (upperBoundVisibility instanceof SelfMetadata) {
            return this._getByKeySelf(key, notFoundValue);
        }
        else {
            return this._getByKeyDefault(key, notFoundValue, lowerBoundVisibility);
        }
    }
    /** @internal */
    _throwOrNull(key, notFoundValue) {
        if (notFoundValue !== THROW_IF_NOT_FOUND) {
            return notFoundValue;
        }
        else {
            throw new NoProviderError(this, key);
        }
    }
    /** @internal */
    _getByKeySelf(key, notFoundValue) {
        var obj = this._strategy.getObjByKeyId(key.id);
        return (obj !== UNDEFINED) ? obj : this._throwOrNull(key, notFoundValue);
    }
    /** @internal */
    _getByKeyDefault(key, notFoundValue, lowerBoundVisibility) {
        var inj;
        if (lowerBoundVisibility instanceof SkipSelfMetadata) {
            inj = this._parent;
        }
        else {
            inj = this;
        }
        while (inj instanceof ReflectiveInjector_) {
            var inj_ = inj;
            var obj = inj_._strategy.getObjByKeyId(key.id);
            if (obj !== UNDEFINED)
                return obj;
            inj = inj_._parent;
        }
        if (inj !== null) {
            return inj.get(key.token, notFoundValue);
        }
        else {
            return this._throwOrNull(key, notFoundValue);
        }
    }
    get displayName() {
        return `ReflectiveInjector(providers: [${_mapProviders(this, (b) => ` "${b.key.displayName}" `).join(", ")}])`;
    }
    toString() { return this.displayName; }
}
var INJECTOR_KEY = ReflectiveKey.get(Injector);
function _mapProviders(injector, fn) {
    var res = [];
    for (var i = 0; i < injector._proto.numberOfProviders; ++i) {
        res.push(fn(injector._proto.getProviderAtIndex(i)));
    }
    return res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9pbmplY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2RpL3JlZmxlY3RpdmVfaW5qZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBa0IsV0FBVyxFQUFDLE1BQU0sZ0NBQWdDO09BRXBFLEVBSUwsMEJBQTBCLEVBQzNCLE1BQU0sdUJBQXVCO09BQ3ZCLEVBQ0wscUJBQXFCLEVBQ3JCLGVBQWUsRUFDZixxQkFBcUIsRUFDckIsa0JBQWtCLEVBRWxCLGdCQUFnQixFQUNqQixNQUFNLHlCQUF5QjtPQUN6QixFQUFPLFVBQVUsRUFBWSxNQUFNLDBCQUEwQjtPQUM3RCxFQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDcEUsRUFBQyxhQUFhLEVBQUMsTUFBTSxrQkFBa0I7T0FDdkMsRUFBQyxZQUFZLEVBQWdCLGdCQUFnQixFQUFDLE1BQU0sWUFBWTtPQUNoRSxFQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLFlBQVk7QUFFdkQsSUFBSSxRQUFjLENBQUMsQ0FBRSx1REFBdUQ7QUFFNUUsb0NBQW9DO0FBQ3BDLE1BQU0seUJBQXlCLEdBQUcsRUFBRSxDQUFDO0FBQ3JDLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFPM0M7SUF1QkUsWUFBWSxPQUFnQyxFQUFFLFNBQXVDO1FBdEJyRixjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUU3QyxXQUFNLEdBQVcsSUFBSSxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxJQUFJLENBQUM7UUFDdEIsV0FBTSxHQUFXLElBQUksQ0FBQztRQUN0QixXQUFNLEdBQVcsSUFBSSxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxJQUFJLENBQUM7UUFDdEIsV0FBTSxHQUFXLElBQUksQ0FBQztRQUN0QixXQUFNLEdBQVcsSUFBSSxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxJQUFJLENBQUM7UUFDdEIsV0FBTSxHQUFXLElBQUksQ0FBQztRQUN0QixXQUFNLEdBQVcsSUFBSSxDQUFDO1FBR3BCLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFFOUIsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3BDLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3BDLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3BDLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3BDLENBQUM7SUFDSCxDQUFDO0lBRUQsa0JBQWtCLENBQUMsS0FBYTtRQUM5QixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN0QyxFQUFF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LENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUM7UUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxhQUFhLENBQUMsS0FBYTtRQUN6QixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMs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YixJQUFJLENBQUM7WUFDSCxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM1RSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM1RSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM1RSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM1RSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM1RSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM1RSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM1RSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM1RSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM1RSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM1RSxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvRSxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvRSxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvRSxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvRSxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvRSxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvRSxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvRSxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvRSxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvRSxHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNqRixDQUFFO1FBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxxQkFBcUIsSUFBSSxDQUFDLFlBQVksa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUMxRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUVELElBQUksR0FBRyxDQUFDO1FBQ1IsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDZixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO29CQUNoQixLQUFLLENBQUM7Z0JBQ1IsS0FBSyxDQUFDO29CQUNKLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2xCLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3RCLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMxQixLQUFLLENBQUM7Z0JBQ1IsS0FBSyxDQUFDO29CQUNKLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQzlCLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ2xDLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUN0QyxLQUFLLENBQUM7Z0JBQ1IsS0FBSyxDQUFDO29CQUNKLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQzFDLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQzlDLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNsRCxLQUFLLENBQUM7Z0JBQ1IsS0FBSyxFQUFFO29CQUNMLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3RELEtBQUssQ0FBQztnQkFDUixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzNELEtBQUssQ0FBQztnQkFDUixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNoRSxLQUFLLENBQUM7Z0JBQ1IsS0FBSyxFQUFFO29CQUNMLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3JFLEtBQUssQ0FBQztnQkFDUixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzFFLEtBQUssQ0FBQztnQkFDUixLQUFLLEVBQUU7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Q0FBQyxJQUFJLENBQUM7SUFDN0ksQ0FBQztJQUVELFFBQVEsS0FBYSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVELElBQUksWUFBWSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFL0MsdUJBQXVCLFFBQTZCLEVBQUUsRUFBWTtJQUNoRSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUMzRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01hcCwgTWFwV3JhcHBlciwgTGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1Byb3ZpZGVyLCBQcm92aWRlckJ1aWxkZXIsIHByb3ZpZGV9IGZyb20gJy4vcHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIsXG4gIFJlZmxlY3RpdmVEZXBlbmRlbmN5LFxuICBSZXNvbHZlZFJlZmxlY3RpdmVGYWN0b3J5LFxuICByZXNvbHZlUmVmbGVjdGl2ZVByb3ZpZGVyc1xufSBmcm9tICcuL3JlZmxlY3RpdmVfcHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgQWJzdHJhY3RQcm92aWRlckVycm9yLFxuICBOb1Byb3ZpZGVyRXJyb3IsXG4gIEN5Y2xpY0RlcGVuZGVuY3lFcnJvcixcbiAgSW5zdGFudGlhdGlvbkVycm9yLFxuICBJbnZhbGlkUHJvdmlkZXJFcnJvcixcbiAgT3V0T2ZCb3VuZHNFcnJvclxufSBmcm9tICcuL3JlZmxlY3RpdmVfZXhjZXB0aW9ucyc7XG5pbXBvcnQge1R5cGUsIENPTlNUX0VYUFIsIGlzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgdW5pbXBsZW1lbnRlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7UmVmbGVjdGl2ZUtleX0gZnJvbSAnLi9yZWZsZWN0aXZlX2tleSc7XG5pbXBvcnQge1NlbGZNZXRhZGF0YSwgSG9zdE1ldGFkYXRhLCBTa2lwU2VsZk1ldGFkYXRhfSBmcm9tICcuL21ldGFkYXRhJztcbmltcG9ydCB7SW5qZWN0b3IsIFRIUk9XX0lGX05PVF9GT1VORH0gZnJvbSAnLi9pbmplY3Rvcic7XG5cbnZhciBfX3VudXNlZDogVHlwZTsgIC8vIGF2b2lkIHVudXNlZCBpbXBvcnQgd2hlbiBUeXBlIHVuaW9uIHR5cGVzIGFyZSBlcmFzZWRcblxuLy8gVGhyZXNob2xkIGZvciB0aGUgZHluYW1pYyB2ZXJzaW9uXG5jb25zdCBfTUFYX0NPTlNUUlVDVElPTl9DT1VOVEVSID0gMTA7XG5jb25zdCBVTkRFRklORUQgPSBDT05TVF9FWFBSKG5ldyBPYmplY3QoKSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVmbGVjdGl2ZVByb3RvSW5qZWN0b3JTdHJhdGVneSB7XG4gIGdldFByb3ZpZGVyQXRJbmRleChpbmRleDogbnVtYmVyKTogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXI7XG4gIGNyZWF0ZUluamVjdG9yU3RyYXRlZ3koaW5qOiBSZWZsZWN0aXZlSW5qZWN0b3JfKTogUmVmbGVjdGl2ZUluamVjdG9yU3RyYXRlZ3k7XG59XG5cbmV4cG9ydCBjbGFzcyBSZWZsZWN0aXZlUHJvdG9JbmplY3RvcklubGluZVN0cmF0ZWd5IGltcGxlbWVudHMgUmVmbGVjdGl2ZVByb3RvSW5qZWN0b3JTdHJhdGVneSB7XG4gIHByb3ZpZGVyMDogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIgPSBudWxsO1xuICBwcm92aWRlcjE6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXIyOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlciA9IG51bGw7XG4gIHByb3ZpZGVyMzogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIgPSBudWxsO1xuICBwcm92aWRlcjQ6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXI1OiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlciA9IG51bGw7XG4gIHByb3ZpZGVyNjogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIgPSBudWxsO1xuICBwcm92aWRlcjc6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXI4OiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlciA9IG51bGw7XG4gIHByb3ZpZGVyOTogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIgPSBudWxsO1xuXG4gIGtleUlkMDogbnVtYmVyID0gbnVsbDtcbiAga2V5SWQxOiBudW1iZXIgPSBudWxsO1xuICBrZXlJZDI6IG51bWJlciA9IG51bGw7XG4gIGtleUlkMzogbnVtYmVyID0gbnVsbDtcbiAga2V5SWQ0OiBudW1iZXIgPSBudWxsO1xuICBrZXlJZDU6IG51bWJlciA9IG51bGw7XG4gIGtleUlkNjogbnVtYmVyID0gbnVsbDtcbiAga2V5SWQ3OiBudW1iZXIgPSBudWxsO1xuICBrZXlJZDg6IG51bWJlciA9IG51bGw7XG4gIGtleUlkOTogbnVtYmVyID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcm90b0VJOiBSZWZsZWN0aXZlUHJvdG9JbmplY3RvciwgcHJvdmlkZXJzOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcltdKSB7XG4gICAgdmFyIGxlbmd0aCA9IHByb3ZpZGVycy5sZW5ndGg7XG5cbiAgICBpZiAobGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wcm92aWRlcjAgPSBwcm92aWRlcnNbMF07XG4gICAgICB0aGlzLmtleUlkMCA9IHByb3ZpZGVyc1swXS5rZXkuaWQ7XG4gICAgfVxuICAgIGlmIChsZW5ndGggPiAxKSB7XG4gICAgICB0aGlzLnByb3ZpZGVyMSA9IHByb3ZpZGVyc1sxXTtcbiAgICAgIHRoaXMua2V5SWQxID0gcHJvdmlkZXJzWzFdLmtleS5pZDtcbiAgICB9XG4gICAgaWYgKGxlbmd0aCA+IDIpIHtcbiAgICAgIHRoaXMucHJvdmlkZXIyID0gcHJvdmlkZXJzWzJdO1xuICAgICAgdGhpcy5rZXlJZDIgPSBwcm92aWRlcnNbMl0ua2V5LmlkO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gMykge1xuICAgICAgdGhpcy5wcm92aWRlcjMgPSBwcm92aWRlcnNbM107XG4gICAgICB0aGlzLmtleUlkMyA9IHByb3ZpZGVyc1szXS5rZXkuaWQ7XG4gICAgfVxuICAgIGlmIChsZW5ndGggPiA0KSB7XG4gICAgICB0aGlzLnByb3ZpZGVyNCA9IHByb3ZpZGVyc1s0XTtcbiAgICAgIHRoaXMua2V5SWQ0ID0gcHJvdmlkZXJzWzRdLmtleS5pZDtcbiAgICB9XG4gICAgaWYgKGxlbmd0aCA+IDUpIHtcbiAgICAgIHRoaXMucHJvdmlkZXI1ID0gcHJvdmlkZXJzWzVdO1xuICAgICAgdGhpcy5rZXlJZDUgPSBwcm92aWRlcnNbNV0ua2V5LmlkO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gNikge1xuICAgICAgdGhpcy5wcm92aWRlcjYgPSBwcm92aWRlcnNbNl07XG4gICAgICB0aGlzLmtleUlkNiA9IHByb3ZpZGVyc1s2XS5rZXkuaWQ7XG4gICAgfVxuICAgIGlmIChsZW5ndGggPiA3KSB7XG4gICAgICB0aGlzLnByb3ZpZGVyNyA9IHByb3ZpZGVyc1s3XTtcbiAgICAgIHRoaXMua2V5SWQ3ID0gcHJvdmlkZXJzWzddLmtleS5pZDtcbiAgICB9XG4gICAgaWYgKGxlbmd0aCA+IDgpIHtcbiAgICAgIHRoaXMucHJvdmlkZXI4ID0gcHJvdmlkZXJzWzhdO1xuICAgICAgdGhpcy5rZXlJZDggPSBwcm92aWRlcnNbOF0ua2V5LmlkO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gOSkge1xuICAgICAgdGhpcy5wcm92aWRlcjkgPSBwcm92aWRlcnNbOV07XG4gICAgICB0aGlzLmtleUlkOSA9IHByb3ZpZGVyc1s5XS5rZXkuaWQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJvdmlkZXJBdEluZGV4KGluZGV4OiBudW1iZXIpOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlciB7XG4gICAgaWYgKGluZGV4ID09IDApIHJldHVybiB0aGlzLnByb3ZpZGVyMDtcbiAgICBpZiAoaW5kZXggPT0gMSkgcmV0dXJuIHRoaXMucHJvdmlkZXIxO1xuICAgIGlmIChpbmRleCA9PSAyKSByZXR1cm4gdGhpcy5wcm92aWRlcjI7XG4gICAgaWYgKGluZGV4ID09IDMpIHJldHVybiB0aGlzLnByb3ZpZGVyMztcbiAgICBpZiAoaW5kZXggPT0gNCkgcmV0dXJuIHRoaXMucHJvdmlkZXI0O1xuICAgIGlmIChpbmRleCA9PSA1KSByZXR1cm4gdGhpcy5wcm92aWRlcjU7XG4gICAgaWYgKGluZGV4ID09IDYpIHJldHVybiB0aGlzLnByb3ZpZGVyNjtcbiAgICBpZiAoaW5kZXggPT0gNykgcmV0dXJuIHRoaXMucHJvdmlkZXI3O1xuICAgIGlmIChpbmRleCA9PSA4KSByZXR1cm4gdGhpcy5wcm92aWRlcjg7XG4gICAgaWYgKGluZGV4ID09IDkpIHJldHVybiB0aGlzLnByb3ZpZGVyOTtcbiAgICB0aHJvdyBuZXcgT3V0T2ZCb3VuZHNFcnJvcihpbmRleCk7XG4gIH1cblxuICBjcmVhdGVJbmplY3RvclN0cmF0ZWd5KGluamVjdG9yOiBSZWZsZWN0aXZlSW5qZWN0b3JfKTogUmVmbGVjdGl2ZUluamVjdG9yU3RyYXRlZ3kge1xuICAgIHJldHVybiBuZXcgUmVmbGVjdGl2ZUluamVjdG9ySW5saW5lU3RyYXRlZ3koaW5qZWN0b3IsIHRoaXMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWZsZWN0aXZlUHJvdG9JbmplY3RvckR5bmFtaWNTdHJhdGVneSBpbXBsZW1lbnRzIFJlZmxlY3RpdmVQcm90b0luamVjdG9yU3RyYXRlZ3kge1xuICBrZXlJZHM6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RvSW5qOiBSZWZsZWN0aXZlUHJvdG9JbmplY3RvciwgcHVibGljIHByb3ZpZGVyczogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJbXSkge1xuICAgIHZhciBsZW4gPSBwcm92aWRlcnMubGVuZ3RoO1xuXG4gICAgdGhpcy5rZXlJZHMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUobGVuKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRoaXMua2V5SWRzW2ldID0gcHJvdmlkZXJzW2ldLmtleS5pZDtcbiAgICB9XG4gIH1cblxuICBnZXRQcm92aWRlckF0SW5kZXgoaW5kZXg6IG51bWJlcik6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyIHtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMucHJvdmlkZXJzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IE91dE9mQm91bmRzRXJyb3IoaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcm92aWRlcnNbaW5kZXhdO1xuICB9XG5cbiAgY3JlYXRlSW5qZWN0b3JTdHJhdGVneShlaTogUmVmbGVjdGl2ZUluamVjdG9yXyk6IFJlZmxlY3RpdmVJbmplY3RvclN0cmF0ZWd5IHtcbiAgICByZXR1cm4gbmV3IFJlZmxlY3RpdmVJbmplY3RvckR5bmFtaWNTdHJhdGVneSh0aGlzLCBlaSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlZmxlY3RpdmVQcm90b0luamVjdG9yIHtcbiAgc3RhdGljIGZyb21SZXNvbHZlZFByb3ZpZGVycyhwcm92aWRlcnM6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyW10pOiBSZWZsZWN0aXZlUHJvdG9JbmplY3RvciB7XG4gICAgcmV0dXJuIG5ldyBSZWZsZWN0aXZlUHJvdG9JbmplY3Rvcihwcm92aWRlcnMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RyYXRlZ3k6IFJlZmxlY3RpdmVQcm90b0luamVjdG9yU3RyYXRlZ3k7XG4gIG51bWJlck9mUHJvdmlkZXJzOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IocHJvdmlkZXJzOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcltdKSB7XG4gICAgdGhpcy5udW1iZXJPZlByb3ZpZGVycyA9IHByb3ZpZGVycy5sZW5ndGg7XG4gICAgdGhpcy5fc3RyYXRlZ3kgPSBwcm92aWRlcnMubGVuZ3RoID4gX01BWF9DT05TVFJVQ1RJT05fQ09VTlRFUiA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFJlZmxlY3RpdmVQcm90b0luamVjdG9yRHluYW1pY1N0cmF0ZWd5KHRoaXMsIHByb3ZpZGVycykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBSZWZsZWN0aXZlUHJvdG9JbmplY3RvcklubGluZVN0cmF0ZWd5KHRoaXMsIHByb3ZpZGVycyk7XG4gIH1cblxuICBnZXRQcm92aWRlckF0SW5kZXgoaW5kZXg6IG51bWJlcik6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyYXRlZ3kuZ2V0UHJvdmlkZXJBdEluZGV4KGluZGV4KTtcbiAgfVxufVxuXG5cblxuZXhwb3J0IGludGVyZmFjZSBSZWZsZWN0aXZlSW5qZWN0b3JTdHJhdGVneSB7XG4gIGdldE9iakJ5S2V5SWQoa2V5SWQ6IG51bWJlcik6IGFueTtcbiAgZ2V0T2JqQXRJbmRleChpbmRleDogbnVtYmVyKTogYW55O1xuICBnZXRNYXhOdW1iZXJPZk9iamVjdHMoKTogbnVtYmVyO1xuXG4gIHJlc2V0Q29uc3RydWN0aW9uQ291bnRlcigpOiB2b2lkO1xuICBpbnN0YW50aWF0ZVByb3ZpZGVyKHByb3ZpZGVyOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcik6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIFJlZmxlY3RpdmVJbmplY3RvcklubGluZVN0cmF0ZWd5IGltcGxlbWVudHMgUmVmbGVjdGl2ZUluamVjdG9yU3RyYXRlZ3kge1xuICBvYmowOiBhbnkgPSBVTkRFRklORUQ7XG4gIG9iajE6IGFueSA9IFVOREVGSU5FRDtcbiAgb2JqMjogYW55ID0gVU5ERUZJTkVEO1xuICBvYmozOiBhbnkgPSBVTkRFRklORUQ7XG4gIG9iajQ6IGFueSA9IFVOREVGSU5FRDtcbiAgb2JqNTogYW55ID0gVU5ERUZJTkVEO1xuICBvYmo2OiBhbnkgPSBVTkRFRklORUQ7XG4gIG9iajc6IGFueSA9IFVOREVGSU5FRDtcbiAgb2JqODogYW55ID0gVU5ERUZJTkVEO1xuICBvYmo5OiBhbnkgPSBVTkRFRklORUQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGluamVjdG9yOiBSZWZsZWN0aXZlSW5qZWN0b3JfLFxuICAgICAgICAgICAgICBwdWJsaWMgcHJvdG9TdHJhdGVneTogUmVmbGVjdGl2ZVByb3RvSW5qZWN0b3JJbmxpbmVTdHJhdGVneSkge31cblxuICByZXNldENvbnN0cnVjdGlvbkNvdW50ZXIoKTogdm9pZCB7IHRoaXMuaW5qZWN0b3IuX2NvbnN0cnVjdGlvbkNvdW50ZXIgPSAwOyB9XG5cbiAgaW5zdGFudGlhdGVQcm92aWRlcihwcm92aWRlcjogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmluamVjdG9yLl9uZXcocHJvdmlkZXIpO1xuICB9XG5cbiAgZ2V0T2JqQnlLZXlJZChrZXlJZDogbnVtYmVyKTogYW55IHtcbiAgICB2YXIgcCA9IHRoaXMucHJvdG9TdHJhdGVneTtcbiAgICB2YXIgaW5qID0gdGhpcy5pbmplY3RvcjtcblxuICAgIGlmIChwLmtleUlkMCA9PT0ga2V5SWQpIHtcbiAgICAgIGlmICh0aGlzLm9iajAgPT09IFVOREVGSU5FRCkge1xuICAgICAgICB0aGlzLm9iajAgPSBpbmouX25ldyhwLnByb3ZpZGVyMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmowO1xuICAgIH1cbiAgICBpZiAocC5rZXlJZDEgPT09IGtleUlkKSB7XG4gICAgICBpZiAodGhpcy5vYmoxID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgdGhpcy5vYmoxID0gaW5qLl9uZXcocC5wcm92aWRlcjEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqMTtcbiAgICB9XG4gICAgaWYgKHAua2V5SWQyID09PSBrZXlJZCkge1xuICAgICAgaWYgKHRoaXMub2JqMiA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgIHRoaXMub2JqMiA9IGluai5fbmV3KHAucHJvdmlkZXIyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iajI7XG4gICAgfVxuICAgIGlmIChwLmtleUlkMyA9PT0ga2V5SWQpIHtcbiAgICAgIGlmICh0aGlzLm9iajMgPT09IFVOREVGSU5FRCkge1xuICAgICAgICB0aGlzLm9iajMgPSBpbmouX25ldyhwLnByb3ZpZGVyMyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmozO1xuICAgIH1cbiAgICBpZiAocC5rZXlJZDQgPT09IGtleUlkKSB7XG4gICAgICBpZiAodGhpcy5vYmo0ID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgdGhpcy5vYmo0ID0gaW5qLl9uZXcocC5wcm92aWRlcjQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqNDtcbiAgICB9XG4gICAgaWYgKHAua2V5SWQ1ID09PSBrZXlJZCkge1xuICAgICAgaWYgKHRoaXMub2JqNSA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgIHRoaXMub2JqNSA9IGluai5fbmV3KHAucHJvdmlkZXI1KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iajU7XG4gICAgfVxuICAgIGlmIChwLmtleUlkNiA9PT0ga2V5SWQpIHtcbiAgICAgIGlmICh0aGlzLm9iajYgPT09IFVOREVGSU5FRCkge1xuICAgICAgICB0aGlzLm9iajYgPSBpbmouX25ldyhwLnByb3ZpZGVyNik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmo2O1xuICAgIH1cbiAgICBpZiAocC5rZXlJZDcgPT09IGtleUlkKSB7XG4gICAgICBpZiAodGhpcy5vYmo3ID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgdGhpcy5vYmo3ID0gaW5qLl9uZXcocC5wcm92aWRlcjcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqNztcbiAgICB9XG4gICAgaWYgKHAua2V5SWQ4ID09PSBrZXlJZCkge1xuICAgICAgaWYgKHRoaXMub2JqOCA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgIHRoaXMub2JqOCA9IGluai5fbmV3KHAucHJvdmlkZXI4KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iajg7XG4gICAgfVxuICAgIGlmIChwLmtleUlkOSA9PT0ga2V5SWQpIHtcbiAgICAgIGlmICh0aGlzLm9iajkgPT09IFVOREVGSU5FRCkge1xuICAgICAgICB0aGlzLm9iajkgPSBpbmouX25ldyhwLnByb3ZpZGVyOSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmo5O1xuICAgIH1cblxuICAgIHJldHVybiBVTkRFRklORUQ7XG4gIH1cblxuICBnZXRPYmpBdEluZGV4KGluZGV4OiBudW1iZXIpOiBhbnkge1xuICAgIGlmIChpbmRleCA9PSAwKSByZXR1cm4gdGhpcy5vYmowO1xuICAgIGlmIChpbmRleCA9PSAxKSByZXR1cm4gdGhpcy5vYmoxO1xuICAgIGlmIChpbmRleCA9PSAyKSByZXR1cm4gdGhpcy5vYmoyO1xuICAgIGlmIChpbmRleCA9PSAzKSByZXR1cm4gdGhpcy5vYmozO1xuICAgIGlmIChpbmRleCA9PSA0KSByZXR1cm4gdGhpcy5vYmo0O1xuICAgIGlmIChpbmRleCA9PSA1KSByZXR1cm4gdGhpcy5vYmo1O1xuICAgIGlmIChpbmRleCA9PSA2KSByZXR1cm4gdGhpcy5vYmo2O1xuICAgIGlmIChpbmRleCA9PSA3KSByZXR1cm4gdGhpcy5vYmo3O1xuICAgIGlmIChpbmRleCA9PSA4KSByZXR1cm4gdGhpcy5vYmo4O1xuICAgIGlmIChpbmRleCA9PSA5KSByZXR1cm4gdGhpcy5vYmo5O1xuICAgIHRocm93IG5ldyBPdXRPZkJvdW5kc0Vycm9yKGluZGV4KTtcbiAgfVxuXG4gIGdldE1heE51bWJlck9mT2JqZWN0cygpOiBudW1iZXIgeyByZXR1cm4gX01BWF9DT05TVFJVQ1RJT05fQ09VTlRFUjsgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBSZWZsZWN0aXZlSW5qZWN0b3JEeW5hbWljU3RyYXRlZ3kgaW1wbGVtZW50cyBSZWZsZWN0aXZlSW5qZWN0b3JTdHJhdGVneSB7XG4gIG9ianM6IGFueVtdO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm90b1N0cmF0ZWd5OiBSZWZsZWN0aXZlUHJvdG9JbmplY3RvckR5bmFtaWNTdHJhdGVneSxcbiAgICAgICAgICAgICAgcHVibGljIGluamVjdG9yOiBSZWZsZWN0aXZlSW5qZWN0b3JfKSB7XG4gICAgdGhpcy5vYmpzID0gTGlzdFdyYXBwZXIuY3JlYXRlRml4ZWRTaXplKHByb3RvU3RyYXRlZ3kucHJvdmlkZXJzLmxlbmd0aCk7XG4gICAgTGlzdFdyYXBwZXIuZmlsbCh0aGlzLm9ianMsIFVOREVGSU5FRCk7XG4gIH1cblxuICByZXNldENvbnN0cnVjdGlvbkNvdW50ZXIoKTogdm9pZCB7IHRoaXMuaW5qZWN0b3IuX2NvbnN0cnVjdGlvbkNvdW50ZXIgPSAwOyB9XG5cbiAgaW5zdGFudGlhdGVQcm92aWRlcihwcm92aWRlcjogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmluamVjdG9yLl9uZXcocHJvdmlkZXIpO1xuICB9XG5cbiAgZ2V0T2JqQnlLZXlJZChrZXlJZDogbnVtYmVyKTogYW55IHtcbiAgICB2YXIgcCA9IHRoaXMucHJvdG9TdHJhdGVneTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcC5rZXlJZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChwLmtleUlkc1tpXSA9PT0ga2V5SWQpIHtcbiAgICAgICAgaWYgKHRoaXMub2Jqc1tpXSA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgICAgdGhpcy5vYmpzW2ldID0gdGhpcy5pbmplY3Rvci5fbmV3KHAucHJvdmlkZXJzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm9ianNbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFVOREVGSU5FRDtcbiAgfVxuXG4gIGdldE9iakF0SW5kZXgoaW5kZXg6IG51bWJlcik6IGFueSB7XG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLm9ianMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgT3V0T2ZCb3VuZHNFcnJvcihpbmRleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub2Jqc1tpbmRleF07XG4gIH1cblxuICBnZXRNYXhOdW1iZXJPZk9iamVjdHMoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMub2Jqcy5sZW5ndGg7IH1cbn1cblxuLyoqXG4gKiBBIFJlZmxlY3RpdmVEZXBlbmRlbmN5IGluamVjdGlvbiBjb250YWluZXIgdXNlZCBmb3IgaW5zdGFudGlhdGluZyBvYmplY3RzIGFuZCByZXNvbHZpbmdcbiAqIGRlcGVuZGVuY2llcy5cbiAqXG4gKiBBbiBgSW5qZWN0b3JgIGlzIGEgcmVwbGFjZW1lbnQgZm9yIGEgYG5ld2Agb3BlcmF0b3IsIHdoaWNoIGNhbiBhdXRvbWF0aWNhbGx5IHJlc29sdmUgdGhlXG4gKiBjb25zdHJ1Y3RvciBkZXBlbmRlbmNpZXMuXG4gKlxuICogSW4gdHlwaWNhbCB1c2UsIGFwcGxpY2F0aW9uIGNvZGUgYXNrcyBmb3IgdGhlIGRlcGVuZGVuY2llcyBpbiB0aGUgY29uc3RydWN0b3IgYW5kIHRoZXkgYXJlXG4gKiByZXNvbHZlZCBieSB0aGUgYEluamVjdG9yYC5cbiAqXG4gKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvanpqZWMwP3A9cHJldmlldykpXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGNyZWF0ZXMgYW4gYEluamVjdG9yYCBjb25maWd1cmVkIHRvIGNyZWF0ZSBgRW5naW5lYCBhbmQgYENhcmAuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQEluamVjdGFibGUoKVxuICogY2xhc3MgRW5naW5lIHtcbiAqIH1cbiAqXG4gKiBASW5qZWN0YWJsZSgpXG4gKiBjbGFzcyBDYXIge1xuICogICBjb25zdHJ1Y3RvcihwdWJsaWMgZW5naW5lOkVuZ2luZSkge31cbiAqIH1cbiAqXG4gKiB2YXIgaW5qZWN0b3IgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbQ2FyLCBFbmdpbmVdKTtcbiAqIHZhciBjYXIgPSBpbmplY3Rvci5nZXQoQ2FyKTtcbiAqIGV4cGVjdChjYXIgaW5zdGFuY2VvZiBDYXIpLnRvQmUodHJ1ZSk7XG4gKiBleHBlY3QoY2FyLmVuZ2luZSBpbnN0YW5jZW9mIEVuZ2luZSkudG9CZSh0cnVlKTtcbiAqIGBgYFxuICpcbiAqIE5vdGljZSwgd2UgZG9uJ3QgdXNlIHRoZSBgbmV3YCBvcGVyYXRvciBiZWNhdXNlIHdlIGV4cGxpY2l0bHkgd2FudCB0byBoYXZlIHRoZSBgSW5qZWN0b3JgXG4gKiByZXNvbHZlIGFsbCBvZiB0aGUgb2JqZWN0J3MgZGVwZW5kZW5jaWVzIGF1dG9tYXRpY2FsbHkuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZWZsZWN0aXZlSW5qZWN0b3IgaW1wbGVtZW50cyBJbmplY3RvciB7XG4gIC8qKlxuICAgKiBUdXJucyBhbiBhcnJheSBvZiBwcm92aWRlciBkZWZpbml0aW9ucyBpbnRvIGFuIGFycmF5IG9mIHJlc29sdmVkIHByb3ZpZGVycy5cbiAgICpcbiAgICogQSByZXNvbHV0aW9uIGlzIGEgcHJvY2VzcyBvZiBmbGF0dGVuaW5nIG11bHRpcGxlIG5lc3RlZCBhcnJheXMgYW5kIGNvbnZlcnRpbmcgaW5kaXZpZHVhbFxuICAgKiBwcm92aWRlcnMgaW50byBhbiBhcnJheSBvZiB7QGxpbmsgUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJ9cy5cbiAgICpcbiAgICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L0FpWFRIaT9wPXByZXZpZXcpKVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgRW5naW5lIHtcbiAgICogfVxuICAgKlxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIENhciB7XG4gICAqICAgY29uc3RydWN0b3IocHVibGljIGVuZ2luZTpFbmdpbmUpIHt9XG4gICAqIH1cbiAgICpcbiAgICogdmFyIHByb3ZpZGVycyA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlKFtDYXIsIFtbRW5naW5lXV1dKTtcbiAgICpcbiAgICogZXhwZWN0KHByb3ZpZGVycy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAqXG4gICAqIGV4cGVjdChwcm92aWRlcnNbMF0gaW5zdGFuY2VvZiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcikudG9CZSh0cnVlKTtcbiAgICogZXhwZWN0KHByb3ZpZGVyc1swXS5rZXkuZGlzcGxheU5hbWUpLnRvQmUoXCJDYXJcIik7XG4gICAqIGV4cGVjdChwcm92aWRlcnNbMF0uZGVwZW5kZW5jaWVzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICogZXhwZWN0KHByb3ZpZGVyc1swXS5mYWN0b3J5KS50b0JlRGVmaW5lZCgpO1xuICAgKlxuICAgKiBleHBlY3QocHJvdmlkZXJzWzFdLmtleS5kaXNwbGF5TmFtZSkudG9CZShcIkVuZ2luZVwiKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBTZWUge0BsaW5rIFJlZmxlY3RpdmVJbmplY3RvciNmcm9tUmVzb2x2ZWRQcm92aWRlcnN9IGZvciBtb3JlIGluZm8uXG4gICAqL1xuICBzdGF0aWMgcmVzb2x2ZShwcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPik6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyW10ge1xuICAgIHJldHVybiByZXNvbHZlUmVmbGVjdGl2ZVByb3ZpZGVycyhwcm92aWRlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmVzIGFuIGFycmF5IG9mIHByb3ZpZGVycyBhbmQgY3JlYXRlcyBhbiBpbmplY3RvciBmcm9tIHRob3NlIHByb3ZpZGVycy5cbiAgICpcbiAgICogVGhlIHBhc3NlZC1pbiBwcm92aWRlcnMgY2FuIGJlIGFuIGFycmF5IG9mIGBUeXBlYCwge0BsaW5rIFByb3ZpZGVyfSxcbiAgICogb3IgYSByZWN1cnNpdmUgYXJyYXkgb2YgbW9yZSBwcm92aWRlcnMuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9lUE9jY0E/cD1wcmV2aWV3KSlcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIEVuZ2luZSB7XG4gICAqIH1cbiAgICpcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBDYXIge1xuICAgKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbmdpbmU6RW5naW5lKSB7fVxuICAgKiB9XG4gICAqXG4gICAqIHZhciBpbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKFtDYXIsIEVuZ2luZV0pO1xuICAgKiBleHBlY3QoaW5qZWN0b3IuZ2V0KENhcikgaW5zdGFuY2VvZiBDYXIpLnRvQmUodHJ1ZSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIHNsb3dlciB0aGFuIHRoZSBjb3JyZXNwb25kaW5nIGBmcm9tUmVzb2x2ZWRQcm92aWRlcnNgXG4gICAqIGJlY2F1c2UgaXQgbmVlZHMgdG8gcmVzb2x2ZSB0aGUgcGFzc2VkLWluIHByb3ZpZGVycyBmaXJzdC5cbiAgICogU2VlIHtAbGluayBJbmplY3RvciNyZXNvbHZlfSBhbmQge0BsaW5rIEluamVjdG9yI2Zyb21SZXNvbHZlZFByb3ZpZGVyc30uXG4gICAqL1xuICBzdGF0aWMgcmVzb2x2ZUFuZENyZWF0ZShwcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBJbmplY3RvciA9IG51bGwpOiBSZWZsZWN0aXZlSW5qZWN0b3Ige1xuICAgIHZhciBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcnMgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShwcm92aWRlcnMpO1xuICAgIHJldHVybiBSZWZsZWN0aXZlSW5qZWN0b3IuZnJvbVJlc29sdmVkUHJvdmlkZXJzKFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVycywgcGFyZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluamVjdG9yIGZyb20gcHJldmlvdXNseSByZXNvbHZlZCBwcm92aWRlcnMuXG4gICAqXG4gICAqIFRoaXMgQVBJIGlzIHRoZSByZWNvbW1lbmRlZCB3YXkgdG8gY29uc3RydWN0IGluamVjdG9ycyBpbiBwZXJmb3JtYW5jZS1zZW5zaXRpdmUgcGFydHMuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9LclNNY2k/cD1wcmV2aWV3KSlcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIEVuZ2luZSB7XG4gICAqIH1cbiAgICpcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBDYXIge1xuICAgKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbmdpbmU6RW5naW5lKSB7fVxuICAgKiB9XG4gICAqXG4gICAqIHZhciBwcm92aWRlcnMgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShbQ2FyLCBFbmdpbmVdKTtcbiAgICogdmFyIGluamVjdG9yID0gUmVmbGVjdGl2ZUluamVjdG9yLmZyb21SZXNvbHZlZFByb3ZpZGVycyhwcm92aWRlcnMpO1xuICAgKiBleHBlY3QoaW5qZWN0b3IuZ2V0KENhcikgaW5zdGFuY2VvZiBDYXIpLnRvQmUodHJ1ZSk7XG4gICAqIGBgYFxuICAgKi9cbiAgc3RhdGljIGZyb21SZXNvbHZlZFByb3ZpZGVycyhwcm92aWRlcnM6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBJbmplY3RvciA9IG51bGwpOiBSZWZsZWN0aXZlSW5qZWN0b3Ige1xuICAgIHJldHVybiBuZXcgUmVmbGVjdGl2ZUluamVjdG9yXyhSZWZsZWN0aXZlUHJvdG9JbmplY3Rvci5mcm9tUmVzb2x2ZWRQcm92aWRlcnMocHJvdmlkZXJzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgc3RhdGljIGZyb21SZXNvbHZlZEJpbmRpbmdzKHByb3ZpZGVyczogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJbXSk6IFJlZmxlY3RpdmVJbmplY3RvciB7XG4gICAgcmV0dXJuIFJlZmxlY3RpdmVJbmplY3Rvci5mcm9tUmVzb2x2ZWRQcm92aWRlcnMocHJvdmlkZXJzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFBhcmVudCBvZiB0aGlzIGluamVjdG9yLlxuICAgKlxuICAgKiA8IS0tIFRPRE86IEFkZCBhIGxpbmsgdG8gdGhlIHNlY3Rpb24gb2YgdGhlIHVzZXIgZ3VpZGUgdGFsa2luZyBhYm91dCBoaWVyYXJjaGljYWwgaW5qZWN0aW9uLlxuICAgKiAtLT5cbiAgICpcbiAgICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L2Vvc01Hbz9wPXByZXZpZXcpKVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIHZhciBwYXJlbnQgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbXSk7XG4gICAqIHZhciBjaGlsZCA9IHBhcmVudC5yZXNvbHZlQW5kQ3JlYXRlQ2hpbGQoW10pO1xuICAgKiBleHBlY3QoY2hpbGQucGFyZW50KS50b0JlKHBhcmVudCk7XG4gICAqIGBgYFxuICAgKi9cbiAgZ2V0IHBhcmVudCgpOiBJbmplY3RvciB7IHJldHVybiB1bmltcGxlbWVudGVkKCk7IH1cblxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGRlYnVnQ29udGV4dCgpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlcyBhbiBhcnJheSBvZiBwcm92aWRlcnMgYW5kIGNyZWF0ZXMgYSBjaGlsZCBpbmplY3RvciBmcm9tIHRob3NlIHByb3ZpZGVycy5cbiAgICpcbiAgICogPCEtLSBUT0RPOiBBZGQgYSBsaW5rIHRvIHRoZSBzZWN0aW9uIG9mIHRoZSB1c2VyIGd1aWRlIHRhbGtpbmcgYWJvdXQgaGllcmFyY2hpY2FsIGluamVjdGlvbi5cbiAgICogLS0+XG4gICAqXG4gICAqIFRoZSBwYXNzZWQtaW4gcHJvdmlkZXJzIGNhbiBiZSBhbiBhcnJheSBvZiBgVHlwZWAsIHtAbGluayBQcm92aWRlcn0sXG4gICAqIG9yIGEgcmVjdXJzaXZlIGFycmF5IG9mIG1vcmUgcHJvdmlkZXJzLlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvb3BCM1Q0P3A9cHJldmlldykpXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogY2xhc3MgUGFyZW50UHJvdmlkZXIge31cbiAgICogY2xhc3MgQ2hpbGRQcm92aWRlciB7fVxuICAgKlxuICAgKiB2YXIgcGFyZW50ID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW1BhcmVudFByb3ZpZGVyXSk7XG4gICAqIHZhciBjaGlsZCA9IHBhcmVudC5yZXNvbHZlQW5kQ3JlYXRlQ2hpbGQoW0NoaWxkUHJvdmlkZXJdKTtcbiAgICpcbiAgICogZXhwZWN0KGNoaWxkLmdldChQYXJlbnRQcm92aWRlcikgaW5zdGFuY2VvZiBQYXJlbnRQcm92aWRlcikudG9CZSh0cnVlKTtcbiAgICogZXhwZWN0KGNoaWxkLmdldChDaGlsZFByb3ZpZGVyKSBpbnN0YW5jZW9mIENoaWxkUHJvdmlkZXIpLnRvQmUodHJ1ZSk7XG4gICAqIGV4cGVjdChjaGlsZC5nZXQoUGFyZW50UHJvdmlkZXIpKS50b0JlKHBhcmVudC5nZXQoUGFyZW50UHJvdmlkZXIpKTtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgc2xvd2VyIHRoYW4gdGhlIGNvcnJlc3BvbmRpbmcgYGNyZWF0ZUNoaWxkRnJvbVJlc29sdmVkYFxuICAgKiBiZWNhdXNlIGl0IG5lZWRzIHRvIHJlc29sdmUgdGhlIHBhc3NlZC1pbiBwcm92aWRlcnMgZmlyc3QuXG4gICAqIFNlZSB7QGxpbmsgSW5qZWN0b3IjcmVzb2x2ZX0gYW5kIHtAbGluayBJbmplY3RvciNjcmVhdGVDaGlsZEZyb21SZXNvbHZlZH0uXG4gICAqL1xuICByZXNvbHZlQW5kQ3JlYXRlQ2hpbGQocHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pOiBSZWZsZWN0aXZlSW5qZWN0b3Ige1xuICAgIHJldHVybiB1bmltcGxlbWVudGVkKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNoaWxkIGluamVjdG9yIGZyb20gcHJldmlvdXNseSByZXNvbHZlZCBwcm92aWRlcnMuXG4gICAqXG4gICAqIDwhLS0gVE9ETzogQWRkIGEgbGluayB0byB0aGUgc2VjdGlvbiBvZiB0aGUgdXNlciBndWlkZSB0YWxraW5nIGFib3V0IGhpZXJhcmNoaWNhbCBpbmplY3Rpb24uXG4gICAqIC0tPlxuICAgKlxuICAgKiBUaGlzIEFQSSBpcyB0aGUgcmVjb21tZW5kZWQgd2F5IHRvIGNvbnN0cnVjdCBpbmplY3RvcnMgaW4gcGVyZm9ybWFuY2Utc2Vuc2l0aXZlIHBhcnRzLlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvVmh5ZmpOP3A9cHJldmlldykpXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogY2xhc3MgUGFyZW50UHJvdmlkZXIge31cbiAgICogY2xhc3MgQ2hpbGRQcm92aWRlciB7fVxuICAgKlxuICAgKiB2YXIgcGFyZW50UHJvdmlkZXJzID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmUoW1BhcmVudFByb3ZpZGVyXSk7XG4gICAqIHZhciBjaGlsZFByb3ZpZGVycyA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlKFtDaGlsZFByb3ZpZGVyXSk7XG4gICAqXG4gICAqIHZhciBwYXJlbnQgPSBSZWZsZWN0aXZlSW5qZWN0b3IuZnJvbVJlc29sdmVkUHJvdmlkZXJzKHBhcmVudFByb3ZpZGVycyk7XG4gICAqIHZhciBjaGlsZCA9IHBhcmVudC5jcmVhdGVDaGlsZEZyb21SZXNvbHZlZChjaGlsZFByb3ZpZGVycyk7XG4gICAqXG4gICAqIGV4cGVjdChjaGlsZC5nZXQoUGFyZW50UHJvdmlkZXIpIGluc3RhbmNlb2YgUGFyZW50UHJvdmlkZXIpLnRvQmUodHJ1ZSk7XG4gICAqIGV4cGVjdChjaGlsZC5nZXQoQ2hpbGRQcm92aWRlcikgaW5zdGFuY2VvZiBDaGlsZFByb3ZpZGVyKS50b0JlKHRydWUpO1xuICAgKiBleHBlY3QoY2hpbGQuZ2V0KFBhcmVudFByb3ZpZGVyKSkudG9CZShwYXJlbnQuZ2V0KFBhcmVudFByb3ZpZGVyKSk7XG4gICAqIGBgYFxuICAgKi9cbiAgY3JlYXRlQ2hpbGRGcm9tUmVzb2x2ZWQocHJvdmlkZXJzOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcltdKTogUmVmbGVjdGl2ZUluamVjdG9yIHtcbiAgICByZXR1cm4gdW5pbXBsZW1lbnRlZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmVzIGEgcHJvdmlkZXIgYW5kIGluc3RhbnRpYXRlcyBhbiBvYmplY3QgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGluamVjdG9yLlxuICAgKlxuICAgKiBUaGUgY3JlYXRlZCBvYmplY3QgZG9lcyBub3QgZ2V0IGNhY2hlZCBieSB0aGUgaW5qZWN0b3IuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC95dlZYb0I/cD1wcmV2aWV3KSlcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIEVuZ2luZSB7XG4gICAqIH1cbiAgICpcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBDYXIge1xuICAgKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbmdpbmU6RW5naW5lKSB7fVxuICAgKiB9XG4gICAqXG4gICAqIHZhciBpbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKFtFbmdpbmVdKTtcbiAgICpcbiAgICogdmFyIGNhciA9IGluamVjdG9yLnJlc29sdmVBbmRJbnN0YW50aWF0ZShDYXIpO1xuICAgKiBleHBlY3QoY2FyLmVuZ2luZSkudG9CZShpbmplY3Rvci5nZXQoRW5naW5lKSk7XG4gICAqIGV4cGVjdChjYXIpLm5vdC50b0JlKGluamVjdG9yLnJlc29sdmVBbmRJbnN0YW50aWF0ZShDYXIpKTtcbiAgICogYGBgXG4gICAqL1xuICByZXNvbHZlQW5kSW5zdGFudGlhdGUocHJvdmlkZXI6IFR5cGUgfCBQcm92aWRlcik6IGFueSB7IHJldHVybiB1bmltcGxlbWVudGVkKCk7IH1cblxuICAvKipcbiAgICogSW5zdGFudGlhdGVzIGFuIG9iamVjdCB1c2luZyBhIHJlc29sdmVkIHByb3ZpZGVyIGluIHRoZSBjb250ZXh0IG9mIHRoZSBpbmplY3Rvci5cbiAgICpcbiAgICogVGhlIGNyZWF0ZWQgb2JqZWN0IGRvZXMgbm90IGdldCBjYWNoZWQgYnkgdGhlIGluamVjdG9yLlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvcHRDSW1RP3A9cHJldmlldykpXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBFbmdpbmUge1xuICAgKiB9XG4gICAqXG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgQ2FyIHtcbiAgICogICBjb25zdHJ1Y3RvcihwdWJsaWMgZW5naW5lOkVuZ2luZSkge31cbiAgICogfVxuICAgKlxuICAgKiB2YXIgaW5qZWN0b3IgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbRW5naW5lXSk7XG4gICAqIHZhciBjYXJQcm92aWRlciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlKFtDYXJdKVswXTtcbiAgICogdmFyIGNhciA9IGluamVjdG9yLmluc3RhbnRpYXRlUmVzb2x2ZWQoY2FyUHJvdmlkZXIpO1xuICAgKiBleHBlY3QoY2FyLmVuZ2luZSkudG9CZShpbmplY3Rvci5nZXQoRW5naW5lKSk7XG4gICAqIGV4cGVjdChjYXIpLm5vdC50b0JlKGluamVjdG9yLmluc3RhbnRpYXRlUmVzb2x2ZWQoY2FyUHJvdmlkZXIpKTtcbiAgICogYGBgXG4gICAqL1xuICBpbnN0YW50aWF0ZVJlc29sdmVkKHByb3ZpZGVyOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcik6IGFueSB7IHJldHVybiB1bmltcGxlbWVudGVkKCk7IH1cblxuICBhYnN0cmFjdCBnZXQodG9rZW46IGFueSwgbm90Rm91bmRWYWx1ZT86IGFueSk6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIFJlZmxlY3RpdmVJbmplY3Rvcl8gaW1wbGVtZW50cyBSZWZsZWN0aXZlSW5qZWN0b3Ige1xuICBwcml2YXRlIF9zdHJhdGVneTogUmVmbGVjdGl2ZUluamVjdG9yU3RyYXRlZ3k7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbnN0cnVjdGlvbkNvdW50ZXI6IG51bWJlciA9IDA7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF9wcm90bzogYW55IC8qIFByb3RvSW5qZWN0b3IgKi87XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF9wYXJlbnQ6IEluamVjdG9yO1xuICAvKipcbiAgICogUHJpdmF0ZVxuICAgKi9cbiAgY29uc3RydWN0b3IoX3Byb3RvOiBhbnkgLyogUHJvdG9JbmplY3RvciAqLywgX3BhcmVudDogSW5qZWN0b3IgPSBudWxsLFxuICAgICAgICAgICAgICBwcml2YXRlIF9kZWJ1Z0NvbnRleHQ6IEZ1bmN0aW9uID0gbnVsbCkge1xuICAgIHRoaXMuX3Byb3RvID0gX3Byb3RvO1xuICAgIHRoaXMuX3BhcmVudCA9IF9wYXJlbnQ7XG4gICAgdGhpcy5fc3RyYXRlZ3kgPSBfcHJvdG8uX3N0cmF0ZWd5LmNyZWF0ZUluamVjdG9yU3RyYXRlZ3kodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBkZWJ1Z0NvbnRleHQoKTogYW55IHsgcmV0dXJuIHRoaXMuX2RlYnVnQ29udGV4dCgpOyB9XG5cbiAgZ2V0KHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU6IGFueSA9IFRIUk9XX0lGX05PVF9GT1VORCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEJ5S2V5KFJlZmxlY3RpdmVLZXkuZ2V0KHRva2VuKSwgbnVsbCwgbnVsbCwgbm90Rm91bmRWYWx1ZSk7XG4gIH1cblxuICBnZXRBdChpbmRleDogbnVtYmVyKTogYW55IHsgcmV0dXJuIHRoaXMuX3N0cmF0ZWd5LmdldE9iakF0SW5kZXgoaW5kZXgpOyB9XG5cbiAgZ2V0IHBhcmVudCgpOiBJbmplY3RvciB7IHJldHVybiB0aGlzLl9wYXJlbnQ7IH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEludGVybmFsLiBEbyBub3QgdXNlLlxuICAgKiBXZSByZXR1cm4gYGFueWAgbm90IHRvIGV4cG9ydCB0aGUgSW5qZWN0b3JTdHJhdGVneSB0eXBlLlxuICAgKi9cbiAgZ2V0IGludGVybmFsU3RyYXRlZ3koKTogYW55IHsgcmV0dXJuIHRoaXMuX3N0cmF0ZWd5OyB9XG5cbiAgcmVzb2x2ZUFuZENyZWF0ZUNoaWxkKHByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+KTogUmVmbGVjdGl2ZUluamVjdG9yIHtcbiAgICB2YXIgUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJzID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmUocHJvdmlkZXJzKTtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVDaGlsZEZyb21SZXNvbHZlZChSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcnMpO1xuICB9XG5cbiAgY3JlYXRlQ2hpbGRGcm9tUmVzb2x2ZWQocHJvdmlkZXJzOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcltdKTogUmVmbGVjdGl2ZUluamVjdG9yIHtcbiAgICB2YXIgcHJvdG8gPSBuZXcgUmVmbGVjdGl2ZVByb3RvSW5qZWN0b3IocHJvdmlkZXJzKTtcbiAgICB2YXIgaW5qID0gbmV3IFJlZmxlY3RpdmVJbmplY3Rvcl8ocHJvdG8pO1xuICAgIGluai5fcGFyZW50ID0gdGhpcztcbiAgICByZXR1cm4gaW5qO1xuICB9XG5cbiAgcmVzb2x2ZUFuZEluc3RhbnRpYXRlKHByb3ZpZGVyOiBUeXBlIHwgUHJvdmlkZXIpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlUmVzb2x2ZWQoUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmUoW3Byb3ZpZGVyXSlbMF0pO1xuICB9XG5cbiAgaW5zdGFudGlhdGVSZXNvbHZlZChwcm92aWRlcjogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9pbnN0YW50aWF0ZVByb3ZpZGVyKHByb3ZpZGVyKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX25ldyhwcm92aWRlcjogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIpOiBhbnkge1xuICAgIGlmICh0aGlzLl9jb25zdHJ1Y3Rpb25Db3VudGVyKysgPiB0aGlzLl9zdHJhdGVneS5nZXRNYXhOdW1iZXJPZk9iamVjdHMoKSkge1xuICAgICAgdGhyb3cgbmV3IEN5Y2xpY0RlcGVuZGVuY3lFcnJvcih0aGlzLCBwcm92aWRlci5rZXkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5faW5zdGFudGlhdGVQcm92aWRlcihwcm92aWRlcik7XG4gIH1cblxuICBwcml2YXRlIF9pbnN0YW50aWF0ZVByb3ZpZGVyKHByb3ZpZGVyOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcik6IGFueSB7XG4gICAgaWYgKHByb3ZpZGVyLm11bHRpUHJvdmlkZXIpIHtcbiAgICAgIHZhciByZXMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUocHJvdmlkZXIucmVzb2x2ZWRGYWN0b3JpZXMubGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvdmlkZXIucmVzb2x2ZWRGYWN0b3JpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcmVzW2ldID0gdGhpcy5faW5zdGFudGlhdGUocHJvdmlkZXIsIHByb3ZpZGVyLnJlc29sdmVkRmFjdG9yaWVzW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbnN0YW50aWF0ZShwcm92aWRlciwgcHJvdmlkZXIucmVzb2x2ZWRGYWN0b3JpZXNbMF0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luc3RhbnRpYXRlKHByb3ZpZGVyOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgUmVzb2x2ZWRSZWZsZWN0aXZlRmFjdG9yeTogUmVzb2x2ZWRSZWZsZWN0aXZlRmFjdG9yeSk6IGFueSB7XG4gICAgdmFyIGZhY3RvcnkgPSBSZXNvbHZlZFJlZmxlY3RpdmVGYWN0b3J5LmZhY3Rvcnk7XG4gICAgdmFyIGRlcHMgPSBSZXNvbHZlZFJlZmxlY3RpdmVGYWN0b3J5LmRlcGVuZGVuY2llcztcbiAgICB2YXIgbGVuZ3RoID0gZGVwcy5sZW5ndGg7XG5cbiAgICB2YXIgZDA6IGFueTtcbiAgICB2YXIgZDE6IGFueTtcbiAgICB2YXIgZDI6IGFueTtcbiAgICB2YXIgZDM6IGFueTtcbiAgICB2YXIgZDQ6IGFueTtcbiAgICB2YXIgZDU6IGFueTtcbiAgICB2YXIgZDY6IGFueTtcbiAgICB2YXIgZDc6IGFueTtcbiAgICB2YXIgZDg6IGFueTtcbiAgICB2YXIgZDk6IGFueTtcbiAgICB2YXIgZDEwOiBhbnk7XG4gICAgdmFyIGQxMTogYW55O1xuICAgIHZhciBkMTI6IGFueTtcbiAgICB2YXIgZDEzOiBhbnk7XG4gICAgdmFyIGQxNDogYW55O1xuICAgIHZhciBkMTU6IGFueTtcbiAgICB2YXIgZDE2OiBhbnk7XG4gICAgdmFyIGQxNzogYW55O1xuICAgIHZhciBkMTg6IGFueTtcbiAgICB2YXIgZDE5OiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgIGQwID0gbGVuZ3RoID4gMCA/IHRoaXMuX2dldEJ5UmVmbGVjdGl2ZURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbMF0pIDogbnVsbDtcbiAgICAgIGQxID0gbGVuZ3RoID4gMSA/IHRoaXMuX2dldEJ5UmVmbGVjdGl2ZURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbMV0pIDogbnVsbDtcbiAgICAgIGQyID0gbGVuZ3RoID4gMiA/IHRoaXMuX2dldEJ5UmVmbGVjdGl2ZURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbMl0pIDogbnVsbDtcbiAgICAgIGQzID0gbGVuZ3RoID4gMyA/IHRoaXMuX2dldEJ5UmVmbGVjdGl2ZURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbM10pIDogbnVsbDtcbiAgICAgIGQ0ID0gbGVuZ3RoID4gNCA/IHRoaXMuX2dldEJ5UmVmbGVjdGl2ZURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbNF0pIDogbnVsbDtcbiAgICAgIGQ1ID0gbGVuZ3RoID4gNSA/IHRoaXMuX2dldEJ5UmVmbGVjdGl2ZURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbNV0pIDogbnVsbDtcbiAgICAgIGQ2ID0gbGVuZ3RoID4gNiA/IHRoaXMuX2dldEJ5UmVmbGVjdGl2ZURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbNl0pIDogbnVsbDtcbiAgICAgIGQ3ID0gbGVuZ3RoID4gNyA/IHRoaXMuX2dldEJ5UmVmbGVjdGl2ZURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbN10pIDogbnVsbDtcbiAgICAgIGQ4ID0gbGVuZ3RoID4gOCA/IHRoaXMuX2dldEJ5UmVmbGVjdGl2ZURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbOF0pIDogbnVsbDtcbiAgICAgIGQ5ID0gbGVuZ3RoID4gOSA/IHRoaXMuX2dldEJ5UmVmbGVjdGl2ZURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbOV0pIDogbnVsbDtcbiAgICAgIGQxMCA9IGxlbmd0aCA+IDEwID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxMF0pIDogbnVsbDtcbiAgICAgIGQxMSA9IGxlbmd0aCA+IDExID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxMV0pIDogbnVsbDtcbiAgICAgIGQxMiA9IGxlbmd0aCA+IDEyID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxMl0pIDogbnVsbDtcbiAgICAgIGQxMyA9IGxlbmd0aCA+IDEzID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxM10pIDogbnVsbDtcbiAgICAgIGQxNCA9IGxlbmd0aCA+IDE0ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxNF0pIDogbnVsbDtcbiAgICAgIGQxNSA9IGxlbmd0aCA+IDE1ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxNV0pIDogbnVsbDtcbiAgICAgIGQxNiA9IGxlbmd0aCA+IDE2ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxNl0pIDogbnVsbDtcbiAgICAgIGQxNyA9IGxlbmd0aCA+IDE3ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxN10pIDogbnVsbDtcbiAgICAgIGQxOCA9IGxlbmd0aCA+IDE4ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxOF0pIDogbnVsbDtcbiAgICAgIGQxOSA9IGxlbmd0aCA+IDE5ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxOV0pIDogbnVsbDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEFic3RyYWN0UHJvdmlkZXJFcnJvciB8fCBlIGluc3RhbmNlb2YgSW5zdGFudGlhdGlvbkVycm9yKSB7XG4gICAgICAgIGUuYWRkS2V5KHRoaXMsIHByb3ZpZGVyLmtleSk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHZhciBvYmo7XG4gICAgdHJ5IHtcbiAgICAgIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA2OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA5OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcsIGQ4LCBkOSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcsIGQ4LCBkOSwgZDEwKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcsIGQ4LCBkOSwgZDEwLCBkMTEsIGQxMik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcsIGQ4LCBkOSwgZDEwLCBkMTEsIGQxMiwgZDEzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxNTpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSwgZDEyLCBkMTMsIGQxNCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTY6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcsIGQ4LCBkOSwgZDEwLCBkMTEsIGQxMiwgZDEzLCBkMTQsIGQxNSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTc6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcsIGQ4LCBkOSwgZDEwLCBkMTEsIGQxMiwgZDEzLCBkMTQsIGQxNSwgZDE2KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxODpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSwgZDEyLCBkMTMsIGQxNCwgZDE1LCBkMTYsXG4gICAgICAgICAgICAgICAgICAgICAgICBkMTcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE5OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDksIGQxMCwgZDExLCBkMTIsIGQxMywgZDE0LCBkMTUsIGQxNixcbiAgICAgICAgICAgICAgICAgICAgICAgIGQxNywgZDE4KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyMDpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSwgZDEyLCBkMTMsIGQxNCwgZDE1LCBkMTYsXG4gICAgICAgICAgICAgICAgICAgICAgICBkMTcsIGQxOCwgZDE5KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcbiAgICAgICAgICAgICAgYENhbm5vdCBpbnN0YW50aWF0ZSAnJHtwcm92aWRlci5rZXkuZGlzcGxheU5hbWV9JyBiZWNhdXNlIGl0IGhhcyBtb3JlIHRoYW4gMjAgZGVwZW5kZW5jaWVzYCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgbmV3IEluc3RhbnRpYXRpb25FcnJvcih0aGlzLCBlLCBlLnN0YWNrLCBwcm92aWRlci5rZXkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlcjogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwOiBSZWZsZWN0aXZlRGVwZW5kZW5jeSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEJ5S2V5KGRlcC5rZXksIGRlcC5sb3dlckJvdW5kVmlzaWJpbGl0eSwgZGVwLnVwcGVyQm91bmRWaXNpYmlsaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXAub3B0aW9uYWwgPyBudWxsIDogVEhST1dfSUZfTk9UX0ZPVU5EKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEJ5S2V5KGtleTogUmVmbGVjdGl2ZUtleSwgbG93ZXJCb3VuZFZpc2liaWxpdHk6IE9iamVjdCwgdXBwZXJCb3VuZFZpc2liaWxpdHk6IE9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgbm90Rm91bmRWYWx1ZTogYW55KTogYW55IHtcbiAgICBpZiAoa2V5ID09PSBJTkpFQ1RPUl9LRVkpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh1cHBlckJvdW5kVmlzaWJpbGl0eSBpbnN0YW5jZW9mIFNlbGZNZXRhZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldEJ5S2V5U2VsZihrZXksIG5vdEZvdW5kVmFsdWUpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9nZXRCeUtleURlZmF1bHQoa2V5LCBub3RGb3VuZFZhbHVlLCBsb3dlckJvdW5kVmlzaWJpbGl0eSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdGhyb3dPck51bGwoa2V5OiBSZWZsZWN0aXZlS2V5LCBub3RGb3VuZFZhbHVlOiBhbnkpOiBhbnkge1xuICAgIGlmIChub3RGb3VuZFZhbHVlICE9PSBUSFJPV19JRl9OT1RfRk9VTkQpIHtcbiAgICAgIHJldHVybiBub3RGb3VuZFZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgTm9Qcm92aWRlckVycm9yKHRoaXMsIGtleSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZ2V0QnlLZXlTZWxmKGtleTogUmVmbGVjdGl2ZUtleSwgbm90Rm91bmRWYWx1ZTogYW55KTogYW55IHtcbiAgICB2YXIgb2JqID0gdGhpcy5fc3RyYXRlZ3kuZ2V0T2JqQnlLZXlJZChrZXkuaWQpO1xuICAgIHJldHVybiAob2JqICE9PSBVTkRFRklORUQpID8gb2JqIDogdGhpcy5fdGhyb3dPck51bGwoa2V5LCBub3RGb3VuZFZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2dldEJ5S2V5RGVmYXVsdChrZXk6IFJlZmxlY3RpdmVLZXksIG5vdEZvdW5kVmFsdWU6IGFueSwgbG93ZXJCb3VuZFZpc2liaWxpdHk6IE9iamVjdCk6IGFueSB7XG4gICAgdmFyIGluajogSW5qZWN0b3I7XG5cbiAgICBpZiAobG93ZXJCb3VuZFZpc2liaWxpdHkgaW5zdGFuY2VvZiBTa2lwU2VsZk1ldGFkYXRhKSB7XG4gICAgICBpbmogPSB0aGlzLl9wYXJlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaiA9IHRoaXM7XG4gICAgfVxuXG4gICAgd2hpbGUgKGluaiBpbnN0YW5jZW9mIFJlZmxlY3RpdmVJbmplY3Rvcl8pIHtcbiAgICAgIHZhciBpbmpfID0gPFJlZmxlY3RpdmVJbmplY3Rvcl8+aW5qO1xuICAgICAgdmFyIG9iaiA9IGlual8uX3N0cmF0ZWd5LmdldE9iakJ5S2V5SWQoa2V5LmlkKTtcbiAgICAgIGlmIChvYmogIT09IFVOREVGSU5FRCkgcmV0dXJuIG9iajtcbiAgICAgIGluaiA9IGlual8uX3BhcmVudDtcbiAgICB9XG4gICAgaWYgKGluaiAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGluai5nZXQoa2V5LnRva2VuLCBub3RGb3VuZFZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3Rocm93T3JOdWxsKGtleSwgbm90Rm91bmRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGRpc3BsYXlOYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBSZWZsZWN0aXZlSW5qZWN0b3IocHJvdmlkZXJzOiBbJHtfbWFwUHJvdmlkZXJzKHRoaXMsIChiOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcikgPT4gYCBcIiR7Yi5rZXkuZGlzcGxheU5hbWV9XCIgYCkuam9pbihcIiwgXCIpfV0pYDtcbiAgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRpc3BsYXlOYW1lOyB9XG59XG5cbnZhciBJTkpFQ1RPUl9LRVkgPSBSZWZsZWN0aXZlS2V5LmdldChJbmplY3Rvcik7XG5cbmZ1bmN0aW9uIF9tYXBQcm92aWRlcnMoaW5qZWN0b3I6IFJlZmxlY3RpdmVJbmplY3Rvcl8sIGZuOiBGdW5jdGlvbik6IGFueVtdIHtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGluamVjdG9yLl9wcm90by5udW1iZXJPZlByb3ZpZGVyczsgKytpKSB7XG4gICAgcmVzLnB1c2goZm4oaW5qZWN0b3IuX3Byb3RvLmdldFByb3ZpZGVyQXRJbmRleChpKSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG4iXX0=