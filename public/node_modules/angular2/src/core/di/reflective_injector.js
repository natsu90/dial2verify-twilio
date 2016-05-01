'use strict';"use strict";
var collection_1 = require('angular2/src/facade/collection');
var reflective_provider_1 = require('./reflective_provider');
var reflective_exceptions_1 = require('./reflective_exceptions');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var reflective_key_1 = require('./reflective_key');
var metadata_1 = require('./metadata');
var injector_1 = require('./injector');
var __unused; // avoid unused import when Type union types are erased
// Threshold for the dynamic version
var _MAX_CONSTRUCTION_COUNTER = 10;
var UNDEFINED = lang_1.CONST_EXPR(new Object());
var ReflectiveProtoInjectorInlineStrategy = (function () {
    function ReflectiveProtoInjectorInlineStrategy(protoEI, providers) {
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
    ReflectiveProtoInjectorInlineStrategy.prototype.getProviderAtIndex = function (index) {
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
        throw new reflective_exceptions_1.OutOfBoundsError(index);
    };
    ReflectiveProtoInjectorInlineStrategy.prototype.createInjectorStrategy = function (injector) {
        return new ReflectiveInjectorInlineStrategy(injector, this);
    };
    return ReflectiveProtoInjectorInlineStrategy;
}());
exports.ReflectiveProtoInjectorInlineStrategy = ReflectiveProtoInjectorInlineStrategy;
var ReflectiveProtoInjectorDynamicStrategy = (function () {
    function ReflectiveProtoInjectorDynamicStrategy(protoInj, providers) {
        this.providers = providers;
        var len = providers.length;
        this.keyIds = collection_1.ListWrapper.createFixedSize(len);
        for (var i = 0; i < len; i++) {
            this.keyIds[i] = providers[i].key.id;
        }
    }
    ReflectiveProtoInjectorDynamicStrategy.prototype.getProviderAtIndex = function (index) {
        if (index < 0 || index >= this.providers.length) {
            throw new reflective_exceptions_1.OutOfBoundsError(index);
        }
        return this.providers[index];
    };
    ReflectiveProtoInjectorDynamicStrategy.prototype.createInjectorStrategy = function (ei) {
        return new ReflectiveInjectorDynamicStrategy(this, ei);
    };
    return ReflectiveProtoInjectorDynamicStrategy;
}());
exports.ReflectiveProtoInjectorDynamicStrategy = ReflectiveProtoInjectorDynamicStrategy;
var ReflectiveProtoInjector = (function () {
    function ReflectiveProtoInjector(providers) {
        this.numberOfProviders = providers.length;
        this._strategy = providers.length > _MAX_CONSTRUCTION_COUNTER ?
            new ReflectiveProtoInjectorDynamicStrategy(this, providers) :
            new ReflectiveProtoInjectorInlineStrategy(this, providers);
    }
    ReflectiveProtoInjector.fromResolvedProviders = function (providers) {
        return new ReflectiveProtoInjector(providers);
    };
    ReflectiveProtoInjector.prototype.getProviderAtIndex = function (index) {
        return this._strategy.getProviderAtIndex(index);
    };
    return ReflectiveProtoInjector;
}());
exports.ReflectiveProtoInjector = ReflectiveProtoInjector;
var ReflectiveInjectorInlineStrategy = (function () {
    function ReflectiveInjectorInlineStrategy(injector, protoStrategy) {
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
    ReflectiveInjectorInlineStrategy.prototype.resetConstructionCounter = function () { this.injector._constructionCounter = 0; };
    ReflectiveInjectorInlineStrategy.prototype.instantiateProvider = function (provider) {
        return this.injector._new(provider);
    };
    ReflectiveInjectorInlineStrategy.prototype.getObjByKeyId = function (keyId) {
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
    };
    ReflectiveInjectorInlineStrategy.prototype.getObjAtIndex = function (index) {
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
        throw new reflective_exceptions_1.OutOfBoundsError(index);
    };
    ReflectiveInjectorInlineStrategy.prototype.getMaxNumberOfObjects = function () { return _MAX_CONSTRUCTION_COUNTER; };
    return ReflectiveInjectorInlineStrategy;
}());
exports.ReflectiveInjectorInlineStrategy = ReflectiveInjectorInlineStrategy;
var ReflectiveInjectorDynamicStrategy = (function () {
    function ReflectiveInjectorDynamicStrategy(protoStrategy, injector) {
        this.protoStrategy = protoStrategy;
        this.injector = injector;
        this.objs = collection_1.ListWrapper.createFixedSize(protoStrategy.providers.length);
        collection_1.ListWrapper.fill(this.objs, UNDEFINED);
    }
    ReflectiveInjectorDynamicStrategy.prototype.resetConstructionCounter = function () { this.injector._constructionCounter = 0; };
    ReflectiveInjectorDynamicStrategy.prototype.instantiateProvider = function (provider) {
        return this.injector._new(provider);
    };
    ReflectiveInjectorDynamicStrategy.prototype.getObjByKeyId = function (keyId) {
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
    };
    ReflectiveInjectorDynamicStrategy.prototype.getObjAtIndex = function (index) {
        if (index < 0 || index >= this.objs.length) {
            throw new reflective_exceptions_1.OutOfBoundsError(index);
        }
        return this.objs[index];
    };
    ReflectiveInjectorDynamicStrategy.prototype.getMaxNumberOfObjects = function () { return this.objs.length; };
    return ReflectiveInjectorDynamicStrategy;
}());
exports.ReflectiveInjectorDynamicStrategy = ReflectiveInjectorDynamicStrategy;
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
var ReflectiveInjector = (function () {
    function ReflectiveInjector() {
    }
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
    ReflectiveInjector.resolve = function (providers) {
        return reflective_provider_1.resolveReflectiveProviders(providers);
    };
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
    ReflectiveInjector.resolveAndCreate = function (providers, parent) {
        if (parent === void 0) { parent = null; }
        var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
        return ReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
    };
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
    ReflectiveInjector.fromResolvedProviders = function (providers, parent) {
        if (parent === void 0) { parent = null; }
        return new ReflectiveInjector_(ReflectiveProtoInjector.fromResolvedProviders(providers), parent);
    };
    /**
     * @deprecated
     */
    ReflectiveInjector.fromResolvedBindings = function (providers) {
        return ReflectiveInjector.fromResolvedProviders(providers);
    };
    Object.defineProperty(ReflectiveInjector.prototype, "parent", {
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
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    /**
     * @internal
     */
    ReflectiveInjector.prototype.debugContext = function () { return null; };
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
    ReflectiveInjector.prototype.resolveAndCreateChild = function (providers) {
        return exceptions_1.unimplemented();
    };
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
    ReflectiveInjector.prototype.createChildFromResolved = function (providers) {
        return exceptions_1.unimplemented();
    };
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
    ReflectiveInjector.prototype.resolveAndInstantiate = function (provider) { return exceptions_1.unimplemented(); };
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
    ReflectiveInjector.prototype.instantiateResolved = function (provider) { return exceptions_1.unimplemented(); };
    return ReflectiveInjector;
}());
exports.ReflectiveInjector = ReflectiveInjector;
var ReflectiveInjector_ = (function () {
    /**
     * Private
     */
    function ReflectiveInjector_(_proto /* ProtoInjector */, _parent, _debugContext) {
        if (_parent === void 0) { _parent = null; }
        if (_debugContext === void 0) { _debugContext = null; }
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
    ReflectiveInjector_.prototype.debugContext = function () { return this._debugContext(); };
    ReflectiveInjector_.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = injector_1.THROW_IF_NOT_FOUND; }
        return this._getByKey(reflective_key_1.ReflectiveKey.get(token), null, null, notFoundValue);
    };
    ReflectiveInjector_.prototype.getAt = function (index) { return this._strategy.getObjAtIndex(index); };
    Object.defineProperty(ReflectiveInjector_.prototype, "parent", {
        get: function () { return this._parent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReflectiveInjector_.prototype, "internalStrategy", {
        /**
         * @internal
         * Internal. Do not use.
         * We return `any` not to export the InjectorStrategy type.
         */
        get: function () { return this._strategy; },
        enumerable: true,
        configurable: true
    });
    ReflectiveInjector_.prototype.resolveAndCreateChild = function (providers) {
        var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
        return this.createChildFromResolved(ResolvedReflectiveProviders);
    };
    ReflectiveInjector_.prototype.createChildFromResolved = function (providers) {
        var proto = new ReflectiveProtoInjector(providers);
        var inj = new ReflectiveInjector_(proto);
        inj._parent = this;
        return inj;
    };
    ReflectiveInjector_.prototype.resolveAndInstantiate = function (provider) {
        return this.instantiateResolved(ReflectiveInjector.resolve([provider])[0]);
    };
    ReflectiveInjector_.prototype.instantiateResolved = function (provider) {
        return this._instantiateProvider(provider);
    };
    /** @internal */
    ReflectiveInjector_.prototype._new = function (provider) {
        if (this._constructionCounter++ > this._strategy.getMaxNumberOfObjects()) {
            throw new reflective_exceptions_1.CyclicDependencyError(this, provider.key);
        }
        return this._instantiateProvider(provider);
    };
    ReflectiveInjector_.prototype._instantiateProvider = function (provider) {
        if (provider.multiProvider) {
            var res = collection_1.ListWrapper.createFixedSize(provider.resolvedFactories.length);
            for (var i = 0; i < provider.resolvedFactories.length; ++i) {
                res[i] = this._instantiate(provider, provider.resolvedFactories[i]);
            }
            return res;
        }
        else {
            return this._instantiate(provider, provider.resolvedFactories[0]);
        }
    };
    ReflectiveInjector_.prototype._instantiate = function (provider, ResolvedReflectiveFactory) {
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
            if (e instanceof reflective_exceptions_1.AbstractProviderError || e instanceof reflective_exceptions_1.InstantiationError) {
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
                    throw new exceptions_1.BaseException("Cannot instantiate '" + provider.key.displayName + "' because it has more than 20 dependencies");
            }
        }
        catch (e) {
            throw new reflective_exceptions_1.InstantiationError(this, e, e.stack, provider.key);
        }
        return obj;
    };
    ReflectiveInjector_.prototype._getByReflectiveDependency = function (provider, dep) {
        return this._getByKey(dep.key, dep.lowerBoundVisibility, dep.upperBoundVisibility, dep.optional ? null : injector_1.THROW_IF_NOT_FOUND);
    };
    ReflectiveInjector_.prototype._getByKey = function (key, lowerBoundVisibility, upperBoundVisibility, notFoundValue) {
        if (key === INJECTOR_KEY) {
            return this;
        }
        if (upperBoundVisibility instanceof metadata_1.SelfMetadata) {
            return this._getByKeySelf(key, notFoundValue);
        }
        else {
            return this._getByKeyDefault(key, notFoundValue, lowerBoundVisibility);
        }
    };
    /** @internal */
    ReflectiveInjector_.prototype._throwOrNull = function (key, notFoundValue) {
        if (notFoundValue !== injector_1.THROW_IF_NOT_FOUND) {
            return notFoundValue;
        }
        else {
            throw new reflective_exceptions_1.NoProviderError(this, key);
        }
    };
    /** @internal */
    ReflectiveInjector_.prototype._getByKeySelf = function (key, notFoundValue) {
        var obj = this._strategy.getObjByKeyId(key.id);
        return (obj !== UNDEFINED) ? obj : this._throwOrNull(key, notFoundValue);
    };
    /** @internal */
    ReflectiveInjector_.prototype._getByKeyDefault = function (key, notFoundValue, lowerBoundVisibility) {
        var inj;
        if (lowerBoundVisibility instanceof metadata_1.SkipSelfMetadata) {
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
    };
    Object.defineProperty(ReflectiveInjector_.prototype, "displayName", {
        get: function () {
            return "ReflectiveInjector(providers: [" + _mapProviders(this, function (b) { return (" \"" + b.key.displayName + "\" "); }).join(", ") + "])";
        },
        enumerable: true,
        configurable: true
    });
    ReflectiveInjector_.prototype.toString = function () { return this.displayName; };
    return ReflectiveInjector_;
}());
exports.ReflectiveInjector_ = ReflectiveInjector_;
var INJECTOR_KEY = reflective_key_1.ReflectiveKey.get(injector_1.Injector);
function _mapProviders(injector, fn) {
    var res = [];
    for (var i = 0; i < injector._proto.numberOfProviders; ++i) {
        res.push(fn(injector._proto.getProviderAtIndex(i)));
    }
    return res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9pbmplY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2RpL3JlZmxlY3RpdmVfaW5qZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDJCQUEyQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBRTVFLG9DQUtPLHVCQUF1QixDQUFDLENBQUE7QUFDL0Isc0NBT08seUJBQXlCLENBQUMsQ0FBQTtBQUNqQyxxQkFBMEMsMEJBQTBCLENBQUMsQ0FBQTtBQUNyRSwyQkFBMkMsZ0NBQWdDLENBQUMsQ0FBQTtBQUM1RSwrQkFBNEIsa0JBQWtCLENBQUMsQ0FBQTtBQUMvQyx5QkFBMkQsWUFBWSxDQUFDLENBQUE7QUFDeEUseUJBQTJDLFlBQVksQ0FBQyxDQUFBO0FBRXhELElBQUksUUFBYyxDQUFDLENBQUUsdURBQXVEO0FBRTVFLG9DQUFvQztBQUNwQyxJQUFNLHlCQUF5QixHQUFHLEVBQUUsQ0FBQztBQUNyQyxJQUFNLFNBQVMsR0FBRyxpQkFBVSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQztBQU8zQztJQXVCRSwrQ0FBWSxPQUFnQyxFQUFFLFNBQXVDO1FBdEJyRixjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUM3QyxjQUFTLEdBQStCLElBQUksQ0FBQztRQUU3QyxXQUFNLEdBQVcsSUFBSSxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxJQUFJLENBQUM7UUFDdEIsV0FBTSxHQUFXLElBQUksQ0FBQztRQUN0QixXQUFNLEdBQVcsSUFBSSxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxJQUFJLENBQUM7UUFDdEIsV0FBTSxHQUFXLElBQUksQ0FBQztRQUN0QixXQUFNLEdBQVcsSUFBSSxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxJQUFJLENBQUM7UUFDdEIsV0FBTSxHQUFXLElBQUksQ0FBQztRQUN0QixXQUFNLEdBQVcsSUFBSSxDQUFDO1FBR3BCLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFFOUIsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3BDLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3BDLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3BDLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3BDLENBQUM7SUFDSCxDQUFDO0lBRUQsa0VBQWtCLEdBQWxCLFVBQW1CLEtBQWE7UUFDOUIsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3RDLE1BQU0sSUFBSSx3Q0FBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsc0VBQXNCLEdBQXRCLFVBQXVCLFFBQTZCO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLGdDQUFnQyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQ0gsNENBQUM7QUFBRCxDQUFDLEFBckZELElBcUZDO0FBckZZLDZDQUFxQyx3Q0FxRmpELENBQUE7QUFFRDtJQUdFLGdEQUFZLFFBQWlDLEVBQVMsU0FBdUM7UUFBdkMsY0FBUyxHQUFULFNBQVMsQ0FBOEI7UUFDM0YsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUUzQixJQUFJLENBQUMsTUFBTSxHQUFHLHdCQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRS9DLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN2QyxDQUFDO0lBQ0gsQ0FBQztJQUVELG1FQUFrQixHQUFsQixVQUFtQixLQUFhO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoRCxNQUFNLElBQUksd0NBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCx1RUFBc0IsR0FBdEIsVUFBdUIsRUFBdUI7UUFDNUMsTUFBTSxDQUFDLElBQUksaUNBQWlDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDSCw2Q0FBQztBQUFELENBQUMsQUF2QkQsSUF1QkM7QUF2QlksOENBQXNDLHlDQXVCbEQsQ0FBQTtBQUVEO0lBU0UsaUNBQVksU0FBdUM7UUFDakQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLHlCQUF5QjtZQUN4QyxJQUFJLHNDQUFzQyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUM7WUFDM0QsSUFBSSxxQ0FBcUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQWJNLDZDQUFxQixHQUE1QixVQUE2QixTQUF1QztRQUNsRSxNQUFNLENBQUMsSUFBSSx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBYUQsb0RBQWtCLEdBQWxCLFVBQW1CLEtBQWE7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNILDhCQUFDO0FBQUQsQ0FBQyxBQW5CRCxJQW1CQztBQW5CWSwrQkFBdUIsMEJBbUJuQyxDQUFBO0FBYUQ7SUFZRSwwQ0FBbUIsUUFBNkIsRUFDN0IsYUFBb0Q7UUFEcEQsYUFBUSxHQUFSLFFBQVEsQ0FBcUI7UUFDN0Isa0JBQWEsR0FBYixhQUFhLENBQXVDO1FBWnZFLFNBQUksR0FBUSxTQUFTLENBQUM7UUFDdEIsU0FBSSxHQUFRLFNBQVMsQ0FBQztRQUN0QixTQUFJLEdBQVEsU0FBUyxDQUFDO1FBQ3RCLFNBQUksR0FBUSxTQUFTLENBQUM7UUFDdEIsU0FBSSxHQUFRLFNBQVMsQ0FBQztRQUN0QixTQUFJLEdBQVEsU0FBUyxDQUFDO1FBQ3RCLFNBQUksR0FBUSxTQUFTLENBQUM7UUFDdEIsU0FBSSxHQUFRLFNBQVMsQ0FBQztRQUN0QixTQUFJLEdBQVEsU0FBUyxDQUFDO1FBQ3RCLFNBQUksR0FBUSxTQUFTLENBQUM7SUFHb0QsQ0FBQztJQUUzRSxtRUFBd0IsR0FBeEIsY0FBbUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVFLDhEQUFtQixHQUFuQixVQUFvQixRQUFvQztRQUN0RCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELHdEQUFhLEdBQWIsVUFBYyxLQUFhO1FBQ3pCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDM0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUV4QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuQixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuQixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuQixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuQixDQUFDO1FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsd0RBQWEsR0FBYixVQUFjLEtBQWE7UUFDekIsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pDLE1BQU0sSUFBSSx3Q0FBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsZ0VBQXFCLEdBQXJCLGNBQWtDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7SUFDdkUsdUNBQUM7QUFBRCxDQUFDLEFBeEdELElBd0dDO0FBeEdZLHdDQUFnQyxtQ0F3RzVDLENBQUE7QUFHRDtJQUdFLDJDQUFtQixhQUFxRCxFQUNyRCxRQUE2QjtRQUQ3QixrQkFBYSxHQUFiLGFBQWEsQ0FBd0M7UUFDckQsYUFBUSxHQUFSLFFBQVEsQ0FBcUI7UUFDOUMsSUFBSSxDQUFDLElBQUksR0FBRyx3QkFBVyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLHdCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELG9FQUF3QixHQUF4QixjQUFtQyxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFNUUsK0RBQW1CLEdBQW5CLFVBQW9CLFFBQW9DO1FBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQseURBQWEsR0FBYixVQUFjLEtBQWE7UUFDekIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUUzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLENBQUM7UUFDSCxDQUFDO1FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQseURBQWEsR0FBYixVQUFjLEtBQWE7UUFDekIsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sSUFBSSx3Q0FBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELGlFQUFxQixHQUFyQixjQUFrQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzlELHdDQUFDO0FBQUQsQ0FBQyxBQXhDRCxJQXdDQztBQXhDWSx5Q0FBaUMsb0NBd0M3QyxDQUFBO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0NHO0FBQ0g7SUFBQTtJQWlQQSxDQUFDO0lBaFBDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWdDRztJQUNJLDBCQUFPLEdBQWQsVUFBZSxTQUF5QztRQUN0RCxNQUFNLENBQUMsZ0RBQTBCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BeUJHO0lBQ0ksbUNBQWdCLEdBQXZCLFVBQXdCLFNBQXlDLEVBQ3pDLE1BQXVCO1FBQXZCLHNCQUF1QixHQUF2QixhQUF1QjtRQUM3QyxJQUFJLDJCQUEyQixHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FxQkc7SUFDSSx3Q0FBcUIsR0FBNUIsVUFBNkIsU0FBdUMsRUFDdkMsTUFBdUI7UUFBdkIsc0JBQXVCLEdBQXZCLGFBQXVCO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLG1CQUFtQixDQUFDLHVCQUF1QixDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxFQUN4RCxNQUFNLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDSSx1Q0FBb0IsR0FBM0IsVUFBNEIsU0FBdUM7UUFDakUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFpQkQsc0JBQUksc0NBQU07UUFkVjs7Ozs7Ozs7Ozs7OztXQWFHO2FBQ0gsY0FBeUIsTUFBTSxDQUFDLDBCQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBR2xEOztPQUVHO0lBQ0gseUNBQVksR0FBWixjQUFzQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVwQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0EwQkc7SUFDSCxrREFBcUIsR0FBckIsVUFBc0IsU0FBeUM7UUFDN0QsTUFBTSxDQUFDLDBCQUFhLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXdCRztJQUNILG9EQUF1QixHQUF2QixVQUF3QixTQUF1QztRQUM3RCxNQUFNLENBQUMsMEJBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F1Qkc7SUFDSCxrREFBcUIsR0FBckIsVUFBc0IsUUFBeUIsSUFBUyxNQUFNLENBQUMsMEJBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVqRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F1Qkc7SUFDSCxnREFBbUIsR0FBbkIsVUFBb0IsUUFBb0MsSUFBUyxNQUFNLENBQUMsMEJBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUc1Rix5QkFBQztBQUFELENBQUMsQUFqUEQsSUFpUEM7QUFqUHFCLDBCQUFrQixxQkFpUHZDLENBQUE7QUFFRDtJQVFFOztPQUVHO0lBQ0gsNkJBQVksTUFBVyxDQUFDLG1CQUFtQixFQUFFLE9BQXdCLEVBQ2pELGFBQThCO1FBREwsdUJBQXdCLEdBQXhCLGNBQXdCO1FBQ3pELDZCQUFzQyxHQUF0QyxvQkFBc0M7UUFBOUIsa0JBQWEsR0FBYixhQUFhLENBQWlCO1FBVmxELGdCQUFnQjtRQUNoQix5QkFBb0IsR0FBVyxDQUFDLENBQUM7UUFVL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7T0FFRztJQUNILDBDQUFZLEdBQVosY0FBc0IsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFcEQsaUNBQUcsR0FBSCxVQUFJLEtBQVUsRUFBRSxhQUF1QztRQUF2Qyw2QkFBdUMsR0FBdkMsNkNBQXVDO1FBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDhCQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVELG1DQUFLLEdBQUwsVUFBTSxLQUFhLElBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6RSxzQkFBSSx1Q0FBTTthQUFWLGNBQXlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFPL0Msc0JBQUksaURBQWdCO1FBTHBCOzs7O1dBSUc7YUFDSCxjQUE4QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRXRELG1EQUFxQixHQUFyQixVQUFzQixTQUF5QztRQUM3RCxJQUFJLDJCQUEyQixHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELHFEQUF1QixHQUF2QixVQUF3QixTQUF1QztRQUM3RCxJQUFJLEtBQUssR0FBRyxJQUFJLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELElBQUksR0FBRyxHQUFHLElBQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxtREFBcUIsR0FBckIsVUFBc0IsUUFBeUI7UUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVELGlEQUFtQixHQUFuQixVQUFvQixRQUFvQztRQUN0RCxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsa0NBQUksR0FBSixVQUFLLFFBQW9DO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekUsTUFBTSxJQUFJLDZDQUFxQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVPLGtEQUFvQixHQUE1QixVQUE2QixRQUFvQztRQUMvRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFJLEdBQUcsR0FBRyx3QkFBVyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQzNELEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RSxDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRSxDQUFDO0lBQ0gsQ0FBQztJQUVPLDBDQUFZLEdBQXBCLFVBQXFCLFFBQW9DLEVBQ3BDLHlCQUFvRDtRQUN2RSxJQUFJLE9BQU8sR0FBRyx5QkFBeUIsQ0FBQyxPQUFPLENBQUM7UUFDaEQsSUFBSSxJQUFJLEdBQUcseUJBQXlCLENBQUMsWUFBWSxDQUFDO1FBQ2xELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFekIsSUFBSSxFQUFPLENBQUM7UUFDWixJQUFJLEVBQU8sQ0FBQztRQUNaLElBQUksRUFBTyxDQUFDO1FBQ1osSUFBSSxFQUFPLENBQUM7UUFDWixJQUFJLEVBQU8sQ0FBQztRQUNaLElBQUksRUFBTyxDQUFDO1FBQ1osSUFBSSxFQUFPLENBQUM7UUFDWixJQUFJLEVBQU8sQ0FBQztRQUNaLElBQUksRUFBTyxDQUFDO1FBQ1osSUFBSSxFQUFPLENBQUM7UUFDWixJQUFJLEdBQVEsQ0FBQztRQUNiLElBQUksR0FBUSxDQUFDO1FBQ2IsSUFBSSxHQUFRLENBQUM7UUFDYixJQUFJLEdBQVEsQ0FBQztRQUNiLElBQUksR0FBUSxDQUFDO1FBQ2IsSUFBSSxHQUFRLENBQUM7UUFDYixJQUFJLEdBQVEsQ0FBQztRQUNiLElBQUksR0FBUSxDQUFDO1FBQ2IsSUFBSSxHQUFRLENBQUM7UUFDYixJQUFJLEdBQVEsQ0FBQztRQUNiLElBQUksQ0FBQztZQUNILEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVFLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQy9FLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQy9FLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQy9FLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQy9FLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQy9FLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQy9FLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQy9FLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQy9FLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQy9FLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2pGLENBQUU7UUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLDZDQUFxQixJQUFJLENBQUMsWUFBWSwwQ0FBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUM7UUFDVixDQUFDO1FBRUQsSUFBSSxHQUFHLENBQUM7UUFDUixJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNmLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7b0JBQ2hCLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbEIsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDdEIsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQzFCLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDOUIsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDbEMsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3RDLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDMUMsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDOUMsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ2xELEtBQUssQ0FBQztnQkFDUixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDdEQsS0FBSyxDQUFDO2dCQUNSLEtBQUssRUFBRTtvQkFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDM0QsS0FBSyxDQUFDO2dCQUNSLEtBQUssRUFBRTtvQkFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2hFLEtBQUssQ0FBQztnQkFDUixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDckUsS0FBSyxDQUFDO2dCQUNSLEtBQUssRUFBRTtvQkFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDMUUsS0FBSyxDQUFDO2dCQUNSLEtBQUssRUFBRTtvQkFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQy9FLEtBQUssQ0FBQztnQkFDUixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDcEYsS0FBSyxDQUFDO2dCQUNSLEtBQUssRUFBRTtvQkFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDekYsS0FBSyxDQUFDO2dCQUNSLEtBQUssRUFBRTtvQkFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQ3pFLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixLQUFLLENBQUM7Z0JBQ1IsS0FBSyxFQUFFO29CQUNMLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFDekUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUN4QixLQUFLLENBQUM7Z0JBQ1IsS0FBSyxFQUFFO29CQUNMLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFDekUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDN0IsS0FBSyxDQUFDO2dCQUNSO29CQUNFLE1BQU0sSUFBSSwwQkFBYSxDQUNuQix5QkFBdUIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLCtDQUE0QyxDQUFDLENBQUM7WUFDckcsQ0FBQztRQUNILENBQUU7UUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxJQUFJLDBDQUFrQixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU8sd0RBQTBCLEdBQWxDLFVBQW1DLFFBQW9DLEVBQ3BDLEdBQXlCO1FBQzFELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxvQkFBb0IsRUFDM0QsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsNkJBQWtCLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU8sdUNBQVMsR0FBakIsVUFBa0IsR0FBa0IsRUFBRSxvQkFBNEIsRUFBRSxvQkFBNEIsRUFDOUUsYUFBa0I7UUFDbEMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsWUFBWSx1QkFBWSxDQUFDLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFaEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDekUsQ0FBQztJQUNILENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsMENBQVksR0FBWixVQUFhLEdBQWtCLEVBQUUsYUFBa0I7UUFDakQsRUFBRSxDQUFDLENBQUMsYUFBYSxLQUFLLDZCQUFrQixDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsYUFBYSxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sSUFBSSx1Q0FBZSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QyxDQUFDO0lBQ0gsQ0FBQztJQUVELGdCQUFnQjtJQUNoQiwyQ0FBYSxHQUFiLFVBQWMsR0FBa0IsRUFBRSxhQUFrQjtRQUNsRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLFNBQVMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLDhDQUFnQixHQUFoQixVQUFpQixHQUFrQixFQUFFLGFBQWtCLEVBQUUsb0JBQTRCO1FBQ25GLElBQUksR0FBYSxDQUFDO1FBRWxCLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixZQUFZLDJCQUFnQixDQUFDLENBQUMsQ0FBQztZQUNyRCxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNyQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVELE9BQU8sR0FBRyxZQUFZLG1CQUFtQixFQUFFLENBQUM7WUFDMUMsSUFBSSxJQUFJLEdBQXdCLEdBQUcsQ0FBQztZQUNwQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0MsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLFNBQVMsQ0FBQztnQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2xDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3JCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMvQyxDQUFDO0lBQ0gsQ0FBQztJQUVELHNCQUFJLDRDQUFXO2FBQWY7WUFDRSxNQUFNLENBQUMsb0NBQWtDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsVUFBQyxDQUE2QixJQUFLLE9BQUEsU0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsU0FBSSxFQUExQixDQUEwQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFJLENBQUM7UUFDN0ksQ0FBQzs7O09BQUE7SUFFRCxzQ0FBUSxHQUFSLGNBQXFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNqRCwwQkFBQztBQUFELENBQUMsQUFsUkQsSUFrUkM7QUFsUlksMkJBQW1CLHNCQWtSL0IsQ0FBQTtBQUVELElBQUksWUFBWSxHQUFHLDhCQUFhLENBQUMsR0FBRyxDQUFDLG1CQUFRLENBQUMsQ0FBQztBQUUvQyx1QkFBdUIsUUFBNkIsRUFBRSxFQUFZO0lBQ2hFLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQzNELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TWFwLCBNYXBXcmFwcGVyLCBMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7UHJvdmlkZXIsIFByb3ZpZGVyQnVpbGRlciwgcHJvdmlkZX0gZnJvbSAnLi9wcm92aWRlcic7XG5pbXBvcnQge1xuICBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcixcbiAgUmVmbGVjdGl2ZURlcGVuZGVuY3ksXG4gIFJlc29sdmVkUmVmbGVjdGl2ZUZhY3RvcnksXG4gIHJlc29sdmVSZWZsZWN0aXZlUHJvdmlkZXJzXG59IGZyb20gJy4vcmVmbGVjdGl2ZV9wcm92aWRlcic7XG5pbXBvcnQge1xuICBBYnN0cmFjdFByb3ZpZGVyRXJyb3IsXG4gIE5vUHJvdmlkZXJFcnJvcixcbiAgQ3ljbGljRGVwZW5kZW5jeUVycm9yLFxuICBJbnN0YW50aWF0aW9uRXJyb3IsXG4gIEludmFsaWRQcm92aWRlckVycm9yLFxuICBPdXRPZkJvdW5kc0Vycm9yXG59IGZyb20gJy4vcmVmbGVjdGl2ZV9leGNlcHRpb25zJztcbmltcG9ydCB7VHlwZSwgQ09OU1RfRVhQUiwgaXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCB1bmltcGxlbWVudGVkfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtSZWZsZWN0aXZlS2V5fSBmcm9tICcuL3JlZmxlY3RpdmVfa2V5JztcbmltcG9ydCB7U2VsZk1ldGFkYXRhLCBIb3N0TWV0YWRhdGEsIFNraXBTZWxmTWV0YWRhdGF9IGZyb20gJy4vbWV0YWRhdGEnO1xuaW1wb3J0IHtJbmplY3RvciwgVEhST1dfSUZfTk9UX0ZPVU5EfSBmcm9tICcuL2luamVjdG9yJztcblxudmFyIF9fdW51c2VkOiBUeXBlOyAgLy8gYXZvaWQgdW51c2VkIGltcG9ydCB3aGVuIFR5cGUgdW5pb24gdHlwZXMgYXJlIGVyYXNlZFxuXG4vLyBUaHJlc2hvbGQgZm9yIHRoZSBkeW5hbWljIHZlcnNpb25cbmNvbnN0IF9NQVhfQ09OU1RSVUNUSU9OX0NPVU5URVIgPSAxMDtcbmNvbnN0IFVOREVGSU5FRCA9IENPTlNUX0VYUFIobmV3IE9iamVjdCgpKTtcblxuZXhwb3J0IGludGVyZmFjZSBSZWZsZWN0aXZlUHJvdG9JbmplY3RvclN0cmF0ZWd5IHtcbiAgZ2V0UHJvdmlkZXJBdEluZGV4KGluZGV4OiBudW1iZXIpOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcjtcbiAgY3JlYXRlSW5qZWN0b3JTdHJhdGVneShpbmo6IFJlZmxlY3RpdmVJbmplY3Rvcl8pOiBSZWZsZWN0aXZlSW5qZWN0b3JTdHJhdGVneTtcbn1cblxuZXhwb3J0IGNsYXNzIFJlZmxlY3RpdmVQcm90b0luamVjdG9ySW5saW5lU3RyYXRlZ3kgaW1wbGVtZW50cyBSZWZsZWN0aXZlUHJvdG9JbmplY3RvclN0cmF0ZWd5IHtcbiAgcHJvdmlkZXIwOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlciA9IG51bGw7XG4gIHByb3ZpZGVyMTogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIgPSBudWxsO1xuICBwcm92aWRlcjI6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXIzOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlciA9IG51bGw7XG4gIHByb3ZpZGVyNDogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIgPSBudWxsO1xuICBwcm92aWRlcjU6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXI2OiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlciA9IG51bGw7XG4gIHByb3ZpZGVyNzogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIgPSBudWxsO1xuICBwcm92aWRlcjg6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXI5OiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlciA9IG51bGw7XG5cbiAga2V5SWQwOiBudW1iZXIgPSBudWxsO1xuICBrZXlJZDE6IG51bWJlciA9IG51bGw7XG4gIGtleUlkMjogbnVtYmVyID0gbnVsbDtcbiAga2V5SWQzOiBudW1iZXIgPSBudWxsO1xuICBrZXlJZDQ6IG51bWJlciA9IG51bGw7XG4gIGtleUlkNTogbnVtYmVyID0gbnVsbDtcbiAga2V5SWQ2OiBudW1iZXIgPSBudWxsO1xuICBrZXlJZDc6IG51bWJlciA9IG51bGw7XG4gIGtleUlkODogbnVtYmVyID0gbnVsbDtcbiAga2V5SWQ5OiBudW1iZXIgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RvRUk6IFJlZmxlY3RpdmVQcm90b0luamVjdG9yLCBwcm92aWRlcnM6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyW10pIHtcbiAgICB2YXIgbGVuZ3RoID0gcHJvdmlkZXJzLmxlbmd0aDtcblxuICAgIGlmIChsZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnByb3ZpZGVyMCA9IHByb3ZpZGVyc1swXTtcbiAgICAgIHRoaXMua2V5SWQwID0gcHJvdmlkZXJzWzBdLmtleS5pZDtcbiAgICB9XG4gICAgaWYgKGxlbmd0aCA+IDEpIHtcbiAgICAgIHRoaXMucHJvdmlkZXIxID0gcHJvdmlkZXJzWzFdO1xuICAgICAgdGhpcy5rZXlJZDEgPSBwcm92aWRlcnNbMV0ua2V5LmlkO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gMikge1xuICAgICAgdGhpcy5wcm92aWRlcjIgPSBwcm92aWRlcnNbMl07XG4gICAgICB0aGlzLmtleUlkMiA9IHByb3ZpZGVyc1syXS5rZXkuaWQ7XG4gICAgfVxuICAgIGlmIChsZW5ndGggPiAzKSB7XG4gICAgICB0aGlzLnByb3ZpZGVyMyA9IHByb3ZpZGVyc1szXTtcbiAgICAgIHRoaXMua2V5SWQzID0gcHJvdmlkZXJzWzNdLmtleS5pZDtcbiAgICB9XG4gICAgaWYgKGxlbmd0aCA+IDQpIHtcbiAgICAgIHRoaXMucHJvdmlkZXI0ID0gcHJvdmlkZXJzWzRdO1xuICAgICAgdGhpcy5rZXlJZDQgPSBwcm92aWRlcnNbNF0ua2V5LmlkO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gNSkge1xuICAgICAgdGhpcy5wcm92aWRlcjUgPSBwcm92aWRlcnNbNV07XG4gICAgICB0aGlzLmtleUlkNSA9IHByb3ZpZGVyc1s1XS5rZXkuaWQ7XG4gICAgfVxuICAgIGlmIChsZW5ndGggPiA2KSB7XG4gICAgICB0aGlzLnByb3ZpZGVyNiA9IHByb3ZpZGVyc1s2XTtcbiAgICAgIHRoaXMua2V5SWQ2ID0gcHJvdmlkZXJzWzZdLmtleS5pZDtcbiAgICB9XG4gICAgaWYgKGxlbmd0aCA+IDcpIHtcbiAgICAgIHRoaXMucHJvdmlkZXI3ID0gcHJvdmlkZXJzWzddO1xuICAgICAgdGhpcy5rZXlJZDcgPSBwcm92aWRlcnNbN10ua2V5LmlkO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gOCkge1xuICAgICAgdGhpcy5wcm92aWRlcjggPSBwcm92aWRlcnNbOF07XG4gICAgICB0aGlzLmtleUlkOCA9IHByb3ZpZGVyc1s4XS5rZXkuaWQ7XG4gICAgfVxuICAgIGlmIChsZW5ndGggPiA5KSB7XG4gICAgICB0aGlzLnByb3ZpZGVyOSA9IHByb3ZpZGVyc1s5XTtcbiAgICAgIHRoaXMua2V5SWQ5ID0gcHJvdmlkZXJzWzldLmtleS5pZDtcbiAgICB9XG4gIH1cblxuICBnZXRQcm92aWRlckF0SW5kZXgoaW5kZXg6IG51bWJlcik6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyIHtcbiAgICBpZiAoaW5kZXggPT0gMCkgcmV0dXJuIHRoaXMucHJvdmlkZXIwO1xuICAgIGlmIChpbmRleCA9PSAxKSByZXR1cm4gdGhpcy5wcm92aWRlcjE7XG4gICAgaWYgKGluZGV4ID09IDIpIHJldHVybiB0aGlzLnByb3ZpZGVyMjtcbiAgICBpZiAoaW5kZXggPT0gMykgcmV0dXJuIHRoaXMucHJvdmlkZXIzO1xuICAgIGlmIChpbmRleCA9PSA0KSByZXR1cm4gdGhpcy5wcm92aWRlcjQ7XG4gICAgaWYgKGluZGV4ID09IDUpIHJldHVybiB0aGlzLnByb3ZpZGVyNTtcbiAgICBpZiAoaW5kZXggPT0gNikgcmV0dXJuIHRoaXMucHJvdmlkZXI2O1xuICAgIGlmIChpbmRleCA9PSA3KSByZXR1cm4gdGhpcy5wcm92aWRlcjc7XG4gICAgaWYgKGluZGV4ID09IDgpIHJldHVybiB0aGlzLnByb3ZpZGVyODtcbiAgICBpZiAoaW5kZXggPT0gOSkgcmV0dXJuIHRoaXMucHJvdmlkZXI5O1xuICAgIHRocm93IG5ldyBPdXRPZkJvdW5kc0Vycm9yKGluZGV4KTtcbiAgfVxuXG4gIGNyZWF0ZUluamVjdG9yU3RyYXRlZ3koaW5qZWN0b3I6IFJlZmxlY3RpdmVJbmplY3Rvcl8pOiBSZWZsZWN0aXZlSW5qZWN0b3JTdHJhdGVneSB7XG4gICAgcmV0dXJuIG5ldyBSZWZsZWN0aXZlSW5qZWN0b3JJbmxpbmVTdHJhdGVneShpbmplY3RvciwgdGhpcyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlZmxlY3RpdmVQcm90b0luamVjdG9yRHluYW1pY1N0cmF0ZWd5IGltcGxlbWVudHMgUmVmbGVjdGl2ZVByb3RvSW5qZWN0b3JTdHJhdGVneSB7XG4gIGtleUlkczogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IocHJvdG9Jbmo6IFJlZmxlY3RpdmVQcm90b0luamVjdG9yLCBwdWJsaWMgcHJvdmlkZXJzOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcltdKSB7XG4gICAgdmFyIGxlbiA9IHByb3ZpZGVycy5sZW5ndGg7XG5cbiAgICB0aGlzLmtleUlkcyA9IExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZShsZW4pO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGhpcy5rZXlJZHNbaV0gPSBwcm92aWRlcnNbaV0ua2V5LmlkO1xuICAgIH1cbiAgfVxuXG4gIGdldFByb3ZpZGVyQXRJbmRleChpbmRleDogbnVtYmVyKTogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIge1xuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5wcm92aWRlcnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgT3V0T2ZCb3VuZHNFcnJvcihpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyc1tpbmRleF07XG4gIH1cblxuICBjcmVhdGVJbmplY3RvclN0cmF0ZWd5KGVpOiBSZWZsZWN0aXZlSW5qZWN0b3JfKTogUmVmbGVjdGl2ZUluamVjdG9yU3RyYXRlZ3kge1xuICAgIHJldHVybiBuZXcgUmVmbGVjdGl2ZUluamVjdG9yRHluYW1pY1N0cmF0ZWd5KHRoaXMsIGVpKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmVmbGVjdGl2ZVByb3RvSW5qZWN0b3Ige1xuICBzdGF0aWMgZnJvbVJlc29sdmVkUHJvdmlkZXJzKHByb3ZpZGVyczogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJbXSk6IFJlZmxlY3RpdmVQcm90b0luamVjdG9yIHtcbiAgICByZXR1cm4gbmV3IFJlZmxlY3RpdmVQcm90b0luamVjdG9yKHByb3ZpZGVycyk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zdHJhdGVneTogUmVmbGVjdGl2ZVByb3RvSW5qZWN0b3JTdHJhdGVneTtcbiAgbnVtYmVyT2ZQcm92aWRlcnM6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihwcm92aWRlcnM6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyW10pIHtcbiAgICB0aGlzLm51bWJlck9mUHJvdmlkZXJzID0gcHJvdmlkZXJzLmxlbmd0aDtcbiAgICB0aGlzLl9zdHJhdGVneSA9IHByb3ZpZGVycy5sZW5ndGggPiBfTUFYX0NPTlNUUlVDVElPTl9DT1VOVEVSID9cbiAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUmVmbGVjdGl2ZVByb3RvSW5qZWN0b3JEeW5hbWljU3RyYXRlZ3kodGhpcywgcHJvdmlkZXJzKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFJlZmxlY3RpdmVQcm90b0luamVjdG9ySW5saW5lU3RyYXRlZ3kodGhpcywgcHJvdmlkZXJzKTtcbiAgfVxuXG4gIGdldFByb3ZpZGVyQXRJbmRleChpbmRleDogbnVtYmVyKTogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIge1xuICAgIHJldHVybiB0aGlzLl9zdHJhdGVneS5nZXRQcm92aWRlckF0SW5kZXgoaW5kZXgpO1xuICB9XG59XG5cblxuXG5leHBvcnQgaW50ZXJmYWNlIFJlZmxlY3RpdmVJbmplY3RvclN0cmF0ZWd5IHtcbiAgZ2V0T2JqQnlLZXlJZChrZXlJZDogbnVtYmVyKTogYW55O1xuICBnZXRPYmpBdEluZGV4KGluZGV4OiBudW1iZXIpOiBhbnk7XG4gIGdldE1heE51bWJlck9mT2JqZWN0cygpOiBudW1iZXI7XG5cbiAgcmVzZXRDb25zdHJ1Y3Rpb25Db3VudGVyKCk6IHZvaWQ7XG4gIGluc3RhbnRpYXRlUHJvdmlkZXIocHJvdmlkZXI6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyKTogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgUmVmbGVjdGl2ZUluamVjdG9ySW5saW5lU3RyYXRlZ3kgaW1wbGVtZW50cyBSZWZsZWN0aXZlSW5qZWN0b3JTdHJhdGVneSB7XG4gIG9iajA6IGFueSA9IFVOREVGSU5FRDtcbiAgb2JqMTogYW55ID0gVU5ERUZJTkVEO1xuICBvYmoyOiBhbnkgPSBVTkRFRklORUQ7XG4gIG9iajM6IGFueSA9IFVOREVGSU5FRDtcbiAgb2JqNDogYW55ID0gVU5ERUZJTkVEO1xuICBvYmo1OiBhbnkgPSBVTkRFRklORUQ7XG4gIG9iajY6IGFueSA9IFVOREVGSU5FRDtcbiAgb2JqNzogYW55ID0gVU5ERUZJTkVEO1xuICBvYmo4OiBhbnkgPSBVTkRFRklORUQ7XG4gIG9iajk6IGFueSA9IFVOREVGSU5FRDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5qZWN0b3I6IFJlZmxlY3RpdmVJbmplY3Rvcl8sXG4gICAgICAgICAgICAgIHB1YmxpYyBwcm90b1N0cmF0ZWd5OiBSZWZsZWN0aXZlUHJvdG9JbmplY3RvcklubGluZVN0cmF0ZWd5KSB7fVxuXG4gIHJlc2V0Q29uc3RydWN0aW9uQ291bnRlcigpOiB2b2lkIHsgdGhpcy5pbmplY3Rvci5fY29uc3RydWN0aW9uQ291bnRlciA9IDA7IH1cblxuICBpbnN0YW50aWF0ZVByb3ZpZGVyKHByb3ZpZGVyOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcik6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuaW5qZWN0b3IuX25ldyhwcm92aWRlcik7XG4gIH1cblxuICBnZXRPYmpCeUtleUlkKGtleUlkOiBudW1iZXIpOiBhbnkge1xuICAgIHZhciBwID0gdGhpcy5wcm90b1N0cmF0ZWd5O1xuICAgIHZhciBpbmogPSB0aGlzLmluamVjdG9yO1xuXG4gICAgaWYgKHAua2V5SWQwID09PSBrZXlJZCkge1xuICAgICAgaWYgKHRoaXMub2JqMCA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgIHRoaXMub2JqMCA9IGluai5fbmV3KHAucHJvdmlkZXIwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iajA7XG4gICAgfVxuICAgIGlmIChwLmtleUlkMSA9PT0ga2V5SWQpIHtcbiAgICAgIGlmICh0aGlzLm9iajEgPT09IFVOREVGSU5FRCkge1xuICAgICAgICB0aGlzLm9iajEgPSBpbmouX25ldyhwLnByb3ZpZGVyMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmoxO1xuICAgIH1cbiAgICBpZiAocC5rZXlJZDIgPT09IGtleUlkKSB7XG4gICAgICBpZiAodGhpcy5vYmoyID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgdGhpcy5vYmoyID0gaW5qLl9uZXcocC5wcm92aWRlcjIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqMjtcbiAgICB9XG4gICAgaWYgKHAua2V5SWQzID09PSBrZXlJZCkge1xuICAgICAgaWYgKHRoaXMub2JqMyA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgIHRoaXMub2JqMyA9IGluai5fbmV3KHAucHJvdmlkZXIzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iajM7XG4gICAgfVxuICAgIGlmIChwLmtleUlkNCA9PT0ga2V5SWQpIHtcbiAgICAgIGlmICh0aGlzLm9iajQgPT09IFVOREVGSU5FRCkge1xuICAgICAgICB0aGlzLm9iajQgPSBpbmouX25ldyhwLnByb3ZpZGVyNCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmo0O1xuICAgIH1cbiAgICBpZiAocC5rZXlJZDUgPT09IGtleUlkKSB7XG4gICAgICBpZiAodGhpcy5vYmo1ID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgdGhpcy5vYmo1ID0gaW5qLl9uZXcocC5wcm92aWRlcjUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqNTtcbiAgICB9XG4gICAgaWYgKHAua2V5SWQ2ID09PSBrZXlJZCkge1xuICAgICAgaWYgKHRoaXMub2JqNiA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgIHRoaXMub2JqNiA9IGluai5fbmV3KHAucHJvdmlkZXI2KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iajY7XG4gICAgfVxuICAgIGlmIChwLmtleUlkNyA9PT0ga2V5SWQpIHtcbiAgICAgIGlmICh0aGlzLm9iajcgPT09IFVOREVGSU5FRCkge1xuICAgICAgICB0aGlzLm9iajcgPSBpbmouX25ldyhwLnByb3ZpZGVyNyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmo3O1xuICAgIH1cbiAgICBpZiAocC5rZXlJZDggPT09IGtleUlkKSB7XG4gICAgICBpZiAodGhpcy5vYmo4ID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgdGhpcy5vYmo4ID0gaW5qLl9uZXcocC5wcm92aWRlcjgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqODtcbiAgICB9XG4gICAgaWYgKHAua2V5SWQ5ID09PSBrZXlJZCkge1xuICAgICAgaWYgKHRoaXMub2JqOSA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgIHRoaXMub2JqOSA9IGluai5fbmV3KHAucHJvdmlkZXI5KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iajk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFVOREVGSU5FRDtcbiAgfVxuXG4gIGdldE9iakF0SW5kZXgoaW5kZXg6IG51bWJlcik6IGFueSB7XG4gICAgaWYgKGluZGV4ID09IDApIHJldHVybiB0aGlzLm9iajA7XG4gICAgaWYgKGluZGV4ID09IDEpIHJldHVybiB0aGlzLm9iajE7XG4gICAgaWYgKGluZGV4ID09IDIpIHJldHVybiB0aGlzLm9iajI7XG4gICAgaWYgKGluZGV4ID09IDMpIHJldHVybiB0aGlzLm9iajM7XG4gICAgaWYgKGluZGV4ID09IDQpIHJldHVybiB0aGlzLm9iajQ7XG4gICAgaWYgKGluZGV4ID09IDUpIHJldHVybiB0aGlzLm9iajU7XG4gICAgaWYgKGluZGV4ID09IDYpIHJldHVybiB0aGlzLm9iajY7XG4gICAgaWYgKGluZGV4ID09IDcpIHJldHVybiB0aGlzLm9iajc7XG4gICAgaWYgKGluZGV4ID09IDgpIHJldHVybiB0aGlzLm9iajg7XG4gICAgaWYgKGluZGV4ID09IDkpIHJldHVybiB0aGlzLm9iajk7XG4gICAgdGhyb3cgbmV3IE91dE9mQm91bmRzRXJyb3IoaW5kZXgpO1xuICB9XG5cbiAgZ2V0TWF4TnVtYmVyT2ZPYmplY3RzKCk6IG51bWJlciB7IHJldHVybiBfTUFYX0NPTlNUUlVDVElPTl9DT1VOVEVSOyB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFJlZmxlY3RpdmVJbmplY3RvckR5bmFtaWNTdHJhdGVneSBpbXBsZW1lbnRzIFJlZmxlY3RpdmVJbmplY3RvclN0cmF0ZWd5IHtcbiAgb2JqczogYW55W107XG5cbiAgY29uc3RydWN0b3IocHVibGljIHByb3RvU3RyYXRlZ3k6IFJlZmxlY3RpdmVQcm90b0luamVjdG9yRHluYW1pY1N0cmF0ZWd5LFxuICAgICAgICAgICAgICBwdWJsaWMgaW5qZWN0b3I6IFJlZmxlY3RpdmVJbmplY3Rvcl8pIHtcbiAgICB0aGlzLm9ianMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUocHJvdG9TdHJhdGVneS5wcm92aWRlcnMubGVuZ3RoKTtcbiAgICBMaXN0V3JhcHBlci5maWxsKHRoaXMub2JqcywgVU5ERUZJTkVEKTtcbiAgfVxuXG4gIHJlc2V0Q29uc3RydWN0aW9uQ291bnRlcigpOiB2b2lkIHsgdGhpcy5pbmplY3Rvci5fY29uc3RydWN0aW9uQ291bnRlciA9IDA7IH1cblxuICBpbnN0YW50aWF0ZVByb3ZpZGVyKHByb3ZpZGVyOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcik6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuaW5qZWN0b3IuX25ldyhwcm92aWRlcik7XG4gIH1cblxuICBnZXRPYmpCeUtleUlkKGtleUlkOiBudW1iZXIpOiBhbnkge1xuICAgIHZhciBwID0gdGhpcy5wcm90b1N0cmF0ZWd5O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwLmtleUlkcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHAua2V5SWRzW2ldID09PSBrZXlJZCkge1xuICAgICAgICBpZiAodGhpcy5vYmpzW2ldID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgICB0aGlzLm9ianNbaV0gPSB0aGlzLmluamVjdG9yLl9uZXcocC5wcm92aWRlcnNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub2Jqc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gVU5ERUZJTkVEO1xuICB9XG5cbiAgZ2V0T2JqQXRJbmRleChpbmRleDogbnVtYmVyKTogYW55IHtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMub2Jqcy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBPdXRPZkJvdW5kc0Vycm9yKGluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vYmpzW2luZGV4XTtcbiAgfVxuXG4gIGdldE1heE51bWJlck9mT2JqZWN0cygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5vYmpzLmxlbmd0aDsgfVxufVxuXG4vKipcbiAqIEEgUmVmbGVjdGl2ZURlcGVuZGVuY3kgaW5qZWN0aW9uIGNvbnRhaW5lciB1c2VkIGZvciBpbnN0YW50aWF0aW5nIG9iamVjdHMgYW5kIHJlc29sdmluZ1xuICogZGVwZW5kZW5jaWVzLlxuICpcbiAqIEFuIGBJbmplY3RvcmAgaXMgYSByZXBsYWNlbWVudCBmb3IgYSBgbmV3YCBvcGVyYXRvciwgd2hpY2ggY2FuIGF1dG9tYXRpY2FsbHkgcmVzb2x2ZSB0aGVcbiAqIGNvbnN0cnVjdG9yIGRlcGVuZGVuY2llcy5cbiAqXG4gKiBJbiB0eXBpY2FsIHVzZSwgYXBwbGljYXRpb24gY29kZSBhc2tzIGZvciB0aGUgZGVwZW5kZW5jaWVzIGluIHRoZSBjb25zdHJ1Y3RvciBhbmQgdGhleSBhcmVcbiAqIHJlc29sdmVkIGJ5IHRoZSBgSW5qZWN0b3JgLlxuICpcbiAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9qemplYzA/cD1wcmV2aWV3KSlcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgY3JlYXRlcyBhbiBgSW5qZWN0b3JgIGNvbmZpZ3VyZWQgdG8gY3JlYXRlIGBFbmdpbmVgIGFuZCBgQ2FyYC5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBASW5qZWN0YWJsZSgpXG4gKiBjbGFzcyBFbmdpbmUge1xuICogfVxuICpcbiAqIEBJbmplY3RhYmxlKClcbiAqIGNsYXNzIENhciB7XG4gKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbmdpbmU6RW5naW5lKSB7fVxuICogfVxuICpcbiAqIHZhciBpbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKFtDYXIsIEVuZ2luZV0pO1xuICogdmFyIGNhciA9IGluamVjdG9yLmdldChDYXIpO1xuICogZXhwZWN0KGNhciBpbnN0YW5jZW9mIENhcikudG9CZSh0cnVlKTtcbiAqIGV4cGVjdChjYXIuZW5naW5lIGluc3RhbmNlb2YgRW5naW5lKS50b0JlKHRydWUpO1xuICogYGBgXG4gKlxuICogTm90aWNlLCB3ZSBkb24ndCB1c2UgdGhlIGBuZXdgIG9wZXJhdG9yIGJlY2F1c2Ugd2UgZXhwbGljaXRseSB3YW50IHRvIGhhdmUgdGhlIGBJbmplY3RvcmBcbiAqIHJlc29sdmUgYWxsIG9mIHRoZSBvYmplY3QncyBkZXBlbmRlbmNpZXMgYXV0b21hdGljYWxseS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlZmxlY3RpdmVJbmplY3RvciBpbXBsZW1lbnRzIEluamVjdG9yIHtcbiAgLyoqXG4gICAqIFR1cm5zIGFuIGFycmF5IG9mIHByb3ZpZGVyIGRlZmluaXRpb25zIGludG8gYW4gYXJyYXkgb2YgcmVzb2x2ZWQgcHJvdmlkZXJzLlxuICAgKlxuICAgKiBBIHJlc29sdXRpb24gaXMgYSBwcm9jZXNzIG9mIGZsYXR0ZW5pbmcgbXVsdGlwbGUgbmVzdGVkIGFycmF5cyBhbmQgY29udmVydGluZyBpbmRpdmlkdWFsXG4gICAqIHByb3ZpZGVycyBpbnRvIGFuIGFycmF5IG9mIHtAbGluayBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcn1zLlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvQWlYVEhpP3A9cHJldmlldykpXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBFbmdpbmUge1xuICAgKiB9XG4gICAqXG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgQ2FyIHtcbiAgICogICBjb25zdHJ1Y3RvcihwdWJsaWMgZW5naW5lOkVuZ2luZSkge31cbiAgICogfVxuICAgKlxuICAgKiB2YXIgcHJvdmlkZXJzID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmUoW0NhciwgW1tFbmdpbmVdXV0pO1xuICAgKlxuICAgKiBleHBlY3QocHJvdmlkZXJzLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICpcbiAgICogZXhwZWN0KHByb3ZpZGVyc1swXSBpbnN0YW5jZW9mIFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyKS50b0JlKHRydWUpO1xuICAgKiBleHBlY3QocHJvdmlkZXJzWzBdLmtleS5kaXNwbGF5TmFtZSkudG9CZShcIkNhclwiKTtcbiAgICogZXhwZWN0KHByb3ZpZGVyc1swXS5kZXBlbmRlbmNpZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgKiBleHBlY3QocHJvdmlkZXJzWzBdLmZhY3RvcnkpLnRvQmVEZWZpbmVkKCk7XG4gICAqXG4gICAqIGV4cGVjdChwcm92aWRlcnNbMV0ua2V5LmRpc3BsYXlOYW1lKS50b0JlKFwiRW5naW5lXCIpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIFNlZSB7QGxpbmsgUmVmbGVjdGl2ZUluamVjdG9yI2Zyb21SZXNvbHZlZFByb3ZpZGVyc30gZm9yIG1vcmUgaW5mby5cbiAgICovXG4gIHN0YXRpYyByZXNvbHZlKHByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+KTogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJbXSB7XG4gICAgcmV0dXJuIHJlc29sdmVSZWZsZWN0aXZlUHJvdmlkZXJzKHByb3ZpZGVycyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZXMgYW4gYXJyYXkgb2YgcHJvdmlkZXJzIGFuZCBjcmVhdGVzIGFuIGluamVjdG9yIGZyb20gdGhvc2UgcHJvdmlkZXJzLlxuICAgKlxuICAgKiBUaGUgcGFzc2VkLWluIHByb3ZpZGVycyBjYW4gYmUgYW4gYXJyYXkgb2YgYFR5cGVgLCB7QGxpbmsgUHJvdmlkZXJ9LFxuICAgKiBvciBhIHJlY3Vyc2l2ZSBhcnJheSBvZiBtb3JlIHByb3ZpZGVycy5cbiAgICpcbiAgICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L2VQT2NjQT9wPXByZXZpZXcpKVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgRW5naW5lIHtcbiAgICogfVxuICAgKlxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIENhciB7XG4gICAqICAgY29uc3RydWN0b3IocHVibGljIGVuZ2luZTpFbmdpbmUpIHt9XG4gICAqIH1cbiAgICpcbiAgICogdmFyIGluamVjdG9yID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW0NhciwgRW5naW5lXSk7XG4gICAqIGV4cGVjdChpbmplY3Rvci5nZXQoQ2FyKSBpbnN0YW5jZW9mIENhcikudG9CZSh0cnVlKTtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgc2xvd2VyIHRoYW4gdGhlIGNvcnJlc3BvbmRpbmcgYGZyb21SZXNvbHZlZFByb3ZpZGVyc2BcbiAgICogYmVjYXVzZSBpdCBuZWVkcyB0byByZXNvbHZlIHRoZSBwYXNzZWQtaW4gcHJvdmlkZXJzIGZpcnN0LlxuICAgKiBTZWUge0BsaW5rIEluamVjdG9yI3Jlc29sdmV9IGFuZCB7QGxpbmsgSW5qZWN0b3IjZnJvbVJlc29sdmVkUHJvdmlkZXJzfS5cbiAgICovXG4gIHN0YXRpYyByZXNvbHZlQW5kQ3JlYXRlKHByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IEluamVjdG9yID0gbnVsbCk6IFJlZmxlY3RpdmVJbmplY3RvciB7XG4gICAgdmFyIFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVycyA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlKHByb3ZpZGVycyk7XG4gICAgcmV0dXJuIFJlZmxlY3RpdmVJbmplY3Rvci5mcm9tUmVzb2x2ZWRQcm92aWRlcnMoUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJzLCBwYXJlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5qZWN0b3IgZnJvbSBwcmV2aW91c2x5IHJlc29sdmVkIHByb3ZpZGVycy5cbiAgICpcbiAgICogVGhpcyBBUEkgaXMgdGhlIHJlY29tbWVuZGVkIHdheSB0byBjb25zdHJ1Y3QgaW5qZWN0b3JzIGluIHBlcmZvcm1hbmNlLXNlbnNpdGl2ZSBwYXJ0cy5cbiAgICpcbiAgICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L0tyU01jaT9wPXByZXZpZXcpKVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgRW5naW5lIHtcbiAgICogfVxuICAgKlxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIENhciB7XG4gICAqICAgY29uc3RydWN0b3IocHVibGljIGVuZ2luZTpFbmdpbmUpIHt9XG4gICAqIH1cbiAgICpcbiAgICogdmFyIHByb3ZpZGVycyA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlKFtDYXIsIEVuZ2luZV0pO1xuICAgKiB2YXIgaW5qZWN0b3IgPSBSZWZsZWN0aXZlSW5qZWN0b3IuZnJvbVJlc29sdmVkUHJvdmlkZXJzKHByb3ZpZGVycyk7XG4gICAqIGV4cGVjdChpbmplY3Rvci5nZXQoQ2FyKSBpbnN0YW5jZW9mIENhcikudG9CZSh0cnVlKTtcbiAgICogYGBgXG4gICAqL1xuICBzdGF0aWMgZnJvbVJlc29sdmVkUHJvdmlkZXJzKHByb3ZpZGVyczogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IEluamVjdG9yID0gbnVsbCk6IFJlZmxlY3RpdmVJbmplY3RvciB7XG4gICAgcmV0dXJuIG5ldyBSZWZsZWN0aXZlSW5qZWN0b3JfKFJlZmxlY3RpdmVQcm90b0luamVjdG9yLmZyb21SZXNvbHZlZFByb3ZpZGVycyhwcm92aWRlcnMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBzdGF0aWMgZnJvbVJlc29sdmVkQmluZGluZ3MocHJvdmlkZXJzOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcltdKTogUmVmbGVjdGl2ZUluamVjdG9yIHtcbiAgICByZXR1cm4gUmVmbGVjdGl2ZUluamVjdG9yLmZyb21SZXNvbHZlZFByb3ZpZGVycyhwcm92aWRlcnMpO1xuICB9XG5cblxuICAvKipcbiAgICogUGFyZW50IG9mIHRoaXMgaW5qZWN0b3IuXG4gICAqXG4gICAqIDwhLS0gVE9ETzogQWRkIGEgbGluayB0byB0aGUgc2VjdGlvbiBvZiB0aGUgdXNlciBndWlkZSB0YWxraW5nIGFib3V0IGhpZXJhcmNoaWNhbCBpbmplY3Rpb24uXG4gICAqIC0tPlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvZW9zTUdvP3A9cHJldmlldykpXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogdmFyIHBhcmVudCA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKFtdKTtcbiAgICogdmFyIGNoaWxkID0gcGFyZW50LnJlc29sdmVBbmRDcmVhdGVDaGlsZChbXSk7XG4gICAqIGV4cGVjdChjaGlsZC5wYXJlbnQpLnRvQmUocGFyZW50KTtcbiAgICogYGBgXG4gICAqL1xuICBnZXQgcGFyZW50KCk6IEluamVjdG9yIHsgcmV0dXJuIHVuaW1wbGVtZW50ZWQoKTsgfVxuXG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZGVidWdDb250ZXh0KCk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmVzIGFuIGFycmF5IG9mIHByb3ZpZGVycyBhbmQgY3JlYXRlcyBhIGNoaWxkIGluamVjdG9yIGZyb20gdGhvc2UgcHJvdmlkZXJzLlxuICAgKlxuICAgKiA8IS0tIFRPRE86IEFkZCBhIGxpbmsgdG8gdGhlIHNlY3Rpb24gb2YgdGhlIHVzZXIgZ3VpZGUgdGFsa2luZyBhYm91dCBoaWVyYXJjaGljYWwgaW5qZWN0aW9uLlxuICAgKiAtLT5cbiAgICpcbiAgICogVGhlIHBhc3NlZC1pbiBwcm92aWRlcnMgY2FuIGJlIGFuIGFycmF5IG9mIGBUeXBlYCwge0BsaW5rIFByb3ZpZGVyfSxcbiAgICogb3IgYSByZWN1cnNpdmUgYXJyYXkgb2YgbW9yZSBwcm92aWRlcnMuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9vcEIzVDQ/cD1wcmV2aWV3KSlcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjbGFzcyBQYXJlbnRQcm92aWRlciB7fVxuICAgKiBjbGFzcyBDaGlsZFByb3ZpZGVyIHt9XG4gICAqXG4gICAqIHZhciBwYXJlbnQgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbUGFyZW50UHJvdmlkZXJdKTtcbiAgICogdmFyIGNoaWxkID0gcGFyZW50LnJlc29sdmVBbmRDcmVhdGVDaGlsZChbQ2hpbGRQcm92aWRlcl0pO1xuICAgKlxuICAgKiBleHBlY3QoY2hpbGQuZ2V0KFBhcmVudFByb3ZpZGVyKSBpbnN0YW5jZW9mIFBhcmVudFByb3ZpZGVyKS50b0JlKHRydWUpO1xuICAgKiBleHBlY3QoY2hpbGQuZ2V0KENoaWxkUHJvdmlkZXIpIGluc3RhbmNlb2YgQ2hpbGRQcm92aWRlcikudG9CZSh0cnVlKTtcbiAgICogZXhwZWN0KGNoaWxkLmdldChQYXJlbnRQcm92aWRlcikpLnRvQmUocGFyZW50LmdldChQYXJlbnRQcm92aWRlcikpO1xuICAgKiBgYGBcbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBzbG93ZXIgdGhhbiB0aGUgY29ycmVzcG9uZGluZyBgY3JlYXRlQ2hpbGRGcm9tUmVzb2x2ZWRgXG4gICAqIGJlY2F1c2UgaXQgbmVlZHMgdG8gcmVzb2x2ZSB0aGUgcGFzc2VkLWluIHByb3ZpZGVycyBmaXJzdC5cbiAgICogU2VlIHtAbGluayBJbmplY3RvciNyZXNvbHZlfSBhbmQge0BsaW5rIEluamVjdG9yI2NyZWF0ZUNoaWxkRnJvbVJlc29sdmVkfS5cbiAgICovXG4gIHJlc29sdmVBbmRDcmVhdGVDaGlsZChwcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPik6IFJlZmxlY3RpdmVJbmplY3RvciB7XG4gICAgcmV0dXJuIHVuaW1wbGVtZW50ZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY2hpbGQgaW5qZWN0b3IgZnJvbSBwcmV2aW91c2x5IHJlc29sdmVkIHByb3ZpZGVycy5cbiAgICpcbiAgICogPCEtLSBUT0RPOiBBZGQgYSBsaW5rIHRvIHRoZSBzZWN0aW9uIG9mIHRoZSB1c2VyIGd1aWRlIHRhbGtpbmcgYWJvdXQgaGllcmFyY2hpY2FsIGluamVjdGlvbi5cbiAgICogLS0+XG4gICAqXG4gICAqIFRoaXMgQVBJIGlzIHRoZSByZWNvbW1lbmRlZCB3YXkgdG8gY29uc3RydWN0IGluamVjdG9ycyBpbiBwZXJmb3JtYW5jZS1zZW5zaXRpdmUgcGFydHMuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9WaHlmak4/cD1wcmV2aWV3KSlcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjbGFzcyBQYXJlbnRQcm92aWRlciB7fVxuICAgKiBjbGFzcyBDaGlsZFByb3ZpZGVyIHt9XG4gICAqXG4gICAqIHZhciBwYXJlbnRQcm92aWRlcnMgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShbUGFyZW50UHJvdmlkZXJdKTtcbiAgICogdmFyIGNoaWxkUHJvdmlkZXJzID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmUoW0NoaWxkUHJvdmlkZXJdKTtcbiAgICpcbiAgICogdmFyIHBhcmVudCA9IFJlZmxlY3RpdmVJbmplY3Rvci5mcm9tUmVzb2x2ZWRQcm92aWRlcnMocGFyZW50UHJvdmlkZXJzKTtcbiAgICogdmFyIGNoaWxkID0gcGFyZW50LmNyZWF0ZUNoaWxkRnJvbVJlc29sdmVkKGNoaWxkUHJvdmlkZXJzKTtcbiAgICpcbiAgICogZXhwZWN0KGNoaWxkLmdldChQYXJlbnRQcm92aWRlcikgaW5zdGFuY2VvZiBQYXJlbnRQcm92aWRlcikudG9CZSh0cnVlKTtcbiAgICogZXhwZWN0KGNoaWxkLmdldChDaGlsZFByb3ZpZGVyKSBpbnN0YW5jZW9mIENoaWxkUHJvdmlkZXIpLnRvQmUodHJ1ZSk7XG4gICAqIGV4cGVjdChjaGlsZC5nZXQoUGFyZW50UHJvdmlkZXIpKS50b0JlKHBhcmVudC5nZXQoUGFyZW50UHJvdmlkZXIpKTtcbiAgICogYGBgXG4gICAqL1xuICBjcmVhdGVDaGlsZEZyb21SZXNvbHZlZChwcm92aWRlcnM6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyW10pOiBSZWZsZWN0aXZlSW5qZWN0b3Ige1xuICAgIHJldHVybiB1bmltcGxlbWVudGVkKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZXMgYSBwcm92aWRlciBhbmQgaW5zdGFudGlhdGVzIGFuIG9iamVjdCBpbiB0aGUgY29udGV4dCBvZiB0aGUgaW5qZWN0b3IuXG4gICAqXG4gICAqIFRoZSBjcmVhdGVkIG9iamVjdCBkb2VzIG5vdCBnZXQgY2FjaGVkIGJ5IHRoZSBpbmplY3Rvci5cbiAgICpcbiAgICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L3l2VlhvQj9wPXByZXZpZXcpKVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgRW5naW5lIHtcbiAgICogfVxuICAgKlxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIENhciB7XG4gICAqICAgY29uc3RydWN0b3IocHVibGljIGVuZ2luZTpFbmdpbmUpIHt9XG4gICAqIH1cbiAgICpcbiAgICogdmFyIGluamVjdG9yID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW0VuZ2luZV0pO1xuICAgKlxuICAgKiB2YXIgY2FyID0gaW5qZWN0b3IucmVzb2x2ZUFuZEluc3RhbnRpYXRlKENhcik7XG4gICAqIGV4cGVjdChjYXIuZW5naW5lKS50b0JlKGluamVjdG9yLmdldChFbmdpbmUpKTtcbiAgICogZXhwZWN0KGNhcikubm90LnRvQmUoaW5qZWN0b3IucmVzb2x2ZUFuZEluc3RhbnRpYXRlKENhcikpO1xuICAgKiBgYGBcbiAgICovXG4gIHJlc29sdmVBbmRJbnN0YW50aWF0ZShwcm92aWRlcjogVHlwZSB8IFByb3ZpZGVyKTogYW55IHsgcmV0dXJuIHVuaW1wbGVtZW50ZWQoKTsgfVxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZXMgYW4gb2JqZWN0IHVzaW5nIGEgcmVzb2x2ZWQgcHJvdmlkZXIgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGluamVjdG9yLlxuICAgKlxuICAgKiBUaGUgY3JlYXRlZCBvYmplY3QgZG9lcyBub3QgZ2V0IGNhY2hlZCBieSB0aGUgaW5qZWN0b3IuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9wdENJbVE/cD1wcmV2aWV3KSlcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIEVuZ2luZSB7XG4gICAqIH1cbiAgICpcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBDYXIge1xuICAgKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbmdpbmU6RW5naW5lKSB7fVxuICAgKiB9XG4gICAqXG4gICAqIHZhciBpbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKFtFbmdpbmVdKTtcbiAgICogdmFyIGNhclByb3ZpZGVyID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmUoW0Nhcl0pWzBdO1xuICAgKiB2YXIgY2FyID0gaW5qZWN0b3IuaW5zdGFudGlhdGVSZXNvbHZlZChjYXJQcm92aWRlcik7XG4gICAqIGV4cGVjdChjYXIuZW5naW5lKS50b0JlKGluamVjdG9yLmdldChFbmdpbmUpKTtcbiAgICogZXhwZWN0KGNhcikubm90LnRvQmUoaW5qZWN0b3IuaW5zdGFudGlhdGVSZXNvbHZlZChjYXJQcm92aWRlcikpO1xuICAgKiBgYGBcbiAgICovXG4gIGluc3RhbnRpYXRlUmVzb2x2ZWQocHJvdmlkZXI6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyKTogYW55IHsgcmV0dXJuIHVuaW1wbGVtZW50ZWQoKTsgfVxuXG4gIGFic3RyYWN0IGdldCh0b2tlbjogYW55LCBub3RGb3VuZFZhbHVlPzogYW55KTogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgUmVmbGVjdGl2ZUluamVjdG9yXyBpbXBsZW1lbnRzIFJlZmxlY3RpdmVJbmplY3RvciB7XG4gIHByaXZhdGUgX3N0cmF0ZWd5OiBSZWZsZWN0aXZlSW5qZWN0b3JTdHJhdGVneTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29uc3RydWN0aW9uQ291bnRlcjogbnVtYmVyID0gMDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgX3Byb3RvOiBhbnkgLyogUHJvdG9JbmplY3RvciAqLztcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgX3BhcmVudDogSW5qZWN0b3I7XG4gIC8qKlxuICAgKiBQcml2YXRlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihfcHJvdG86IGFueSAvKiBQcm90b0luamVjdG9yICovLCBfcGFyZW50OiBJbmplY3RvciA9IG51bGwsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2RlYnVnQ29udGV4dDogRnVuY3Rpb24gPSBudWxsKSB7XG4gICAgdGhpcy5fcHJvdG8gPSBfcHJvdG87XG4gICAgdGhpcy5fcGFyZW50ID0gX3BhcmVudDtcbiAgICB0aGlzLl9zdHJhdGVneSA9IF9wcm90by5fc3RyYXRlZ3kuY3JlYXRlSW5qZWN0b3JTdHJhdGVneSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGRlYnVnQ29udGV4dCgpOiBhbnkgeyByZXR1cm4gdGhpcy5fZGVidWdDb250ZXh0KCk7IH1cblxuICBnZXQodG9rZW46IGFueSwgbm90Rm91bmRWYWx1ZTogYW55ID0gVEhST1dfSUZfTk9UX0ZPVU5EKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0QnlLZXkoUmVmbGVjdGl2ZUtleS5nZXQodG9rZW4pLCBudWxsLCBudWxsLCBub3RGb3VuZFZhbHVlKTtcbiAgfVxuXG4gIGdldEF0KGluZGV4OiBudW1iZXIpOiBhbnkgeyByZXR1cm4gdGhpcy5fc3RyYXRlZ3kuZ2V0T2JqQXRJbmRleChpbmRleCk7IH1cblxuICBnZXQgcGFyZW50KCk6IEluamVjdG9yIHsgcmV0dXJuIHRoaXMuX3BhcmVudDsgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogSW50ZXJuYWwuIERvIG5vdCB1c2UuXG4gICAqIFdlIHJldHVybiBgYW55YCBub3QgdG8gZXhwb3J0IHRoZSBJbmplY3RvclN0cmF0ZWd5IHR5cGUuXG4gICAqL1xuICBnZXQgaW50ZXJuYWxTdHJhdGVneSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fc3RyYXRlZ3k7IH1cblxuICByZXNvbHZlQW5kQ3JlYXRlQ2hpbGQocHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pOiBSZWZsZWN0aXZlSW5qZWN0b3Ige1xuICAgIHZhciBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcnMgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShwcm92aWRlcnMpO1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUNoaWxkRnJvbVJlc29sdmVkKFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVycyk7XG4gIH1cblxuICBjcmVhdGVDaGlsZEZyb21SZXNvbHZlZChwcm92aWRlcnM6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyW10pOiBSZWZsZWN0aXZlSW5qZWN0b3Ige1xuICAgIHZhciBwcm90byA9IG5ldyBSZWZsZWN0aXZlUHJvdG9JbmplY3Rvcihwcm92aWRlcnMpO1xuICAgIHZhciBpbmogPSBuZXcgUmVmbGVjdGl2ZUluamVjdG9yXyhwcm90byk7XG4gICAgaW5qLl9wYXJlbnQgPSB0aGlzO1xuICAgIHJldHVybiBpbmo7XG4gIH1cblxuICByZXNvbHZlQW5kSW5zdGFudGlhdGUocHJvdmlkZXI6IFR5cGUgfCBQcm92aWRlcik6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGVSZXNvbHZlZChSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShbcHJvdmlkZXJdKVswXSk7XG4gIH1cblxuICBpbnN0YW50aWF0ZVJlc29sdmVkKHByb3ZpZGVyOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcik6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbnRpYXRlUHJvdmlkZXIocHJvdmlkZXIpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbmV3KHByb3ZpZGVyOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcik6IGFueSB7XG4gICAgaWYgKHRoaXMuX2NvbnN0cnVjdGlvbkNvdW50ZXIrKyA+IHRoaXMuX3N0cmF0ZWd5LmdldE1heE51bWJlck9mT2JqZWN0cygpKSB7XG4gICAgICB0aHJvdyBuZXcgQ3ljbGljRGVwZW5kZW5jeUVycm9yKHRoaXMsIHByb3ZpZGVyLmtleSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9pbnN0YW50aWF0ZVByb3ZpZGVyKHByb3ZpZGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luc3RhbnRpYXRlUHJvdmlkZXIocHJvdmlkZXI6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyKTogYW55IHtcbiAgICBpZiAocHJvdmlkZXIubXVsdGlQcm92aWRlcikge1xuICAgICAgdmFyIHJlcyA9IExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZShwcm92aWRlci5yZXNvbHZlZEZhY3Rvcmllcy5sZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm92aWRlci5yZXNvbHZlZEZhY3Rvcmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICByZXNbaV0gPSB0aGlzLl9pbnN0YW50aWF0ZShwcm92aWRlciwgcHJvdmlkZXIucmVzb2x2ZWRGYWN0b3JpZXNbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbnRpYXRlKHByb3ZpZGVyLCBwcm92aWRlci5yZXNvbHZlZEZhY3Rvcmllc1swXSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5zdGFudGlhdGUocHJvdmlkZXI6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICBSZXNvbHZlZFJlZmxlY3RpdmVGYWN0b3J5OiBSZXNvbHZlZFJlZmxlY3RpdmVGYWN0b3J5KTogYW55IHtcbiAgICB2YXIgZmFjdG9yeSA9IFJlc29sdmVkUmVmbGVjdGl2ZUZhY3RvcnkuZmFjdG9yeTtcbiAgICB2YXIgZGVwcyA9IFJlc29sdmVkUmVmbGVjdGl2ZUZhY3RvcnkuZGVwZW5kZW5jaWVzO1xuICAgIHZhciBsZW5ndGggPSBkZXBzLmxlbmd0aDtcblxuICAgIHZhciBkMDogYW55O1xuICAgIHZhciBkMTogYW55O1xuICAgIHZhciBkMjogYW55O1xuICAgIHZhciBkMzogYW55O1xuICAgIHZhciBkNDogYW55O1xuICAgIHZhciBkNTogYW55O1xuICAgIHZhciBkNjogYW55O1xuICAgIHZhciBkNzogYW55O1xuICAgIHZhciBkODogYW55O1xuICAgIHZhciBkOTogYW55O1xuICAgIHZhciBkMTA6IGFueTtcbiAgICB2YXIgZDExOiBhbnk7XG4gICAgdmFyIGQxMjogYW55O1xuICAgIHZhciBkMTM6IGFueTtcbiAgICB2YXIgZDE0OiBhbnk7XG4gICAgdmFyIGQxNTogYW55O1xuICAgIHZhciBkMTY6IGFueTtcbiAgICB2YXIgZDE3OiBhbnk7XG4gICAgdmFyIGQxODogYW55O1xuICAgIHZhciBkMTk6IGFueTtcbiAgICB0cnkge1xuICAgICAgZDAgPSBsZW5ndGggPiAwID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1swXSkgOiBudWxsO1xuICAgICAgZDEgPSBsZW5ndGggPiAxID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxXSkgOiBudWxsO1xuICAgICAgZDIgPSBsZW5ndGggPiAyID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1syXSkgOiBudWxsO1xuICAgICAgZDMgPSBsZW5ndGggPiAzID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1szXSkgOiBudWxsO1xuICAgICAgZDQgPSBsZW5ndGggPiA0ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1s0XSkgOiBudWxsO1xuICAgICAgZDUgPSBsZW5ndGggPiA1ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1s1XSkgOiBudWxsO1xuICAgICAgZDYgPSBsZW5ndGggPiA2ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1s2XSkgOiBudWxsO1xuICAgICAgZDcgPSBsZW5ndGggPiA3ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1s3XSkgOiBudWxsO1xuICAgICAgZDggPSBsZW5ndGggPiA4ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1s4XSkgOiBudWxsO1xuICAgICAgZDkgPSBsZW5ndGggPiA5ID8gdGhpcy5fZ2V0QnlSZWZsZWN0aXZlRGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1s5XSkgOiBudWxsO1xuICAgICAgZDEwID0gbGVuZ3RoID4gMTAgPyB0aGlzLl9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzEwXSkgOiBudWxsO1xuICAgICAgZDExID0gbGVuZ3RoID4gMTEgPyB0aGlzLl9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzExXSkgOiBudWxsO1xuICAgICAgZDEyID0gbGVuZ3RoID4gMTIgPyB0aGlzLl9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzEyXSkgOiBudWxsO1xuICAgICAgZDEzID0gbGVuZ3RoID4gMTMgPyB0aGlzLl9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzEzXSkgOiBudWxsO1xuICAgICAgZDE0ID0gbGVuZ3RoID4gMTQgPyB0aGlzLl9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzE0XSkgOiBudWxsO1xuICAgICAgZDE1ID0gbGVuZ3RoID4gMTUgPyB0aGlzLl9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzE1XSkgOiBudWxsO1xuICAgICAgZDE2ID0gbGVuZ3RoID4gMTYgPyB0aGlzLl9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzE2XSkgOiBudWxsO1xuICAgICAgZDE3ID0gbGVuZ3RoID4gMTcgPyB0aGlzLl9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzE3XSkgOiBudWxsO1xuICAgICAgZDE4ID0gbGVuZ3RoID4gMTggPyB0aGlzLl9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzE4XSkgOiBudWxsO1xuICAgICAgZDE5ID0gbGVuZ3RoID4gMTkgPyB0aGlzLl9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzE5XSkgOiBudWxsO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgQWJzdHJhY3RQcm92aWRlckVycm9yIHx8IGUgaW5zdGFuY2VvZiBJbnN0YW50aWF0aW9uRXJyb3IpIHtcbiAgICAgICAgZS5hZGRLZXkodGhpcywgcHJvdmlkZXIua2V5KTtcbiAgICAgIH1cbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFyIG9iajtcbiAgICB0cnkge1xuICAgICAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcsIGQ4KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDksIGQxMCwgZDExKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSwgZDEyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSwgZDEyLCBkMTMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE1OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDksIGQxMCwgZDExLCBkMTIsIGQxMywgZDE0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxNjpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSwgZDEyLCBkMTMsIGQxNCwgZDE1KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxNzpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSwgZDEyLCBkMTMsIGQxNCwgZDE1LCBkMTYpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE4OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDksIGQxMCwgZDExLCBkMTIsIGQxMywgZDE0LCBkMTUsIGQxNixcbiAgICAgICAgICAgICAgICAgICAgICAgIGQxNyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTk6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcsIGQ4LCBkOSwgZDEwLCBkMTEsIGQxMiwgZDEzLCBkMTQsIGQxNSwgZDE2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZDE3LCBkMTgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDIwOlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDksIGQxMCwgZDExLCBkMTIsIGQxMywgZDE0LCBkMTUsIGQxNixcbiAgICAgICAgICAgICAgICAgICAgICAgIGQxNywgZDE4LCBkMTkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgICAgICBgQ2Fubm90IGluc3RhbnRpYXRlICcke3Byb3ZpZGVyLmtleS5kaXNwbGF5TmFtZX0nIGJlY2F1c2UgaXQgaGFzIG1vcmUgdGhhbiAyMCBkZXBlbmRlbmNpZXNgKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgSW5zdGFudGlhdGlvbkVycm9yKHRoaXMsIGUsIGUuc3RhY2ssIHByb3ZpZGVyLmtleSk7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBwcml2YXRlIF9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KHByb3ZpZGVyOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXA6IFJlZmxlY3RpdmVEZXBlbmRlbmN5KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0QnlLZXkoZGVwLmtleSwgZGVwLmxvd2VyQm91bmRWaXNpYmlsaXR5LCBkZXAudXBwZXJCb3VuZFZpc2liaWxpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlcC5vcHRpb25hbCA/IG51bGwgOiBUSFJPV19JRl9OT1RfRk9VTkQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0QnlLZXkoa2V5OiBSZWZsZWN0aXZlS2V5LCBsb3dlckJvdW5kVmlzaWJpbGl0eTogT2JqZWN0LCB1cHBlckJvdW5kVmlzaWJpbGl0eTogT2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICBub3RGb3VuZFZhbHVlOiBhbnkpOiBhbnkge1xuICAgIGlmIChrZXkgPT09IElOSkVDVE9SX0tFWSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHVwcGVyQm91bmRWaXNpYmlsaXR5IGluc3RhbmNlb2YgU2VsZk1ldGFkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0QnlLZXlTZWxmKGtleSwgbm90Rm91bmRWYWx1ZSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldEJ5S2V5RGVmYXVsdChrZXksIG5vdEZvdW5kVmFsdWUsIGxvd2VyQm91bmRWaXNpYmlsaXR5KTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF90aHJvd09yTnVsbChrZXk6IFJlZmxlY3RpdmVLZXksIG5vdEZvdW5kVmFsdWU6IGFueSk6IGFueSB7XG4gICAgaWYgKG5vdEZvdW5kVmFsdWUgIT09IFRIUk9XX0lGX05PVF9GT1VORCkge1xuICAgICAgcmV0dXJuIG5vdEZvdW5kVmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBOb1Byb3ZpZGVyRXJyb3IodGhpcywga2V5KTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9nZXRCeUtleVNlbGYoa2V5OiBSZWZsZWN0aXZlS2V5LCBub3RGb3VuZFZhbHVlOiBhbnkpOiBhbnkge1xuICAgIHZhciBvYmogPSB0aGlzLl9zdHJhdGVneS5nZXRPYmpCeUtleUlkKGtleS5pZCk7XG4gICAgcmV0dXJuIChvYmogIT09IFVOREVGSU5FRCkgPyBvYmogOiB0aGlzLl90aHJvd09yTnVsbChrZXksIG5vdEZvdW5kVmFsdWUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZ2V0QnlLZXlEZWZhdWx0KGtleTogUmVmbGVjdGl2ZUtleSwgbm90Rm91bmRWYWx1ZTogYW55LCBsb3dlckJvdW5kVmlzaWJpbGl0eTogT2JqZWN0KTogYW55IHtcbiAgICB2YXIgaW5qOiBJbmplY3RvcjtcblxuICAgIGlmIChsb3dlckJvdW5kVmlzaWJpbGl0eSBpbnN0YW5jZW9mIFNraXBTZWxmTWV0YWRhdGEpIHtcbiAgICAgIGluaiA9IHRoaXMuX3BhcmVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5qID0gdGhpcztcbiAgICB9XG5cbiAgICB3aGlsZSAoaW5qIGluc3RhbmNlb2YgUmVmbGVjdGl2ZUluamVjdG9yXykge1xuICAgICAgdmFyIGlual8gPSA8UmVmbGVjdGl2ZUluamVjdG9yXz5pbmo7XG4gICAgICB2YXIgb2JqID0gaW5qXy5fc3RyYXRlZ3kuZ2V0T2JqQnlLZXlJZChrZXkuaWQpO1xuICAgICAgaWYgKG9iaiAhPT0gVU5ERUZJTkVEKSByZXR1cm4gb2JqO1xuICAgICAgaW5qID0gaW5qXy5fcGFyZW50O1xuICAgIH1cbiAgICBpZiAoaW5qICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaW5qLmdldChrZXkudG9rZW4sIG5vdEZvdW5kVmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdGhyb3dPck51bGwoa2V5LCBub3RGb3VuZFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZGlzcGxheU5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYFJlZmxlY3RpdmVJbmplY3Rvcihwcm92aWRlcnM6IFske19tYXBQcm92aWRlcnModGhpcywgKGI6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyKSA9PiBgIFwiJHtiLmtleS5kaXNwbGF5TmFtZX1cIiBgKS5qb2luKFwiLCBcIil9XSlgO1xuICB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZGlzcGxheU5hbWU7IH1cbn1cblxudmFyIElOSkVDVE9SX0tFWSA9IFJlZmxlY3RpdmVLZXkuZ2V0KEluamVjdG9yKTtcblxuZnVuY3Rpb24gX21hcFByb3ZpZGVycyhpbmplY3RvcjogUmVmbGVjdGl2ZUluamVjdG9yXywgZm46IEZ1bmN0aW9uKTogYW55W10ge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW5qZWN0b3IuX3Byb3RvLm51bWJlck9mUHJvdmlkZXJzOyArK2kpIHtcbiAgICByZXMucHVzaChmbihpbmplY3Rvci5fcHJvdG8uZ2V0UHJvdmlkZXJBdEluZGV4KGkpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cbiJdfQ==