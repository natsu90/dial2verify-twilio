'use strict';"use strict";
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var metadata_1 = require('angular2/src/core/metadata');
/**
 * A token representing the a reference to a static type.
 *
 * This token is unique for a moduleId and name and can be used as a hash table key.
 */
var StaticType = (function () {
    function StaticType(moduleId, name) {
        this.moduleId = moduleId;
        this.name = name;
    }
    return StaticType;
}());
exports.StaticType = StaticType;
/**
 * A static reflector implements enough of the Reflector API that is necessary to compile
 * templates statically.
 */
var StaticReflector = (function () {
    function StaticReflector(host) {
        this.host = host;
        this.typeCache = new Map();
        this.annotationCache = new Map();
        this.propertyCache = new Map();
        this.parameterCache = new Map();
        this.metadataCache = new Map();
        this.conversionMap = new Map();
        this.initializeConversionMap();
    }
    StaticReflector.prototype.importUri = function (typeOrFunc) { return typeOrFunc.moduleId; };
    /**
     * getStatictype produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param moduleId the module identifier as would be passed to an import statement.
     * @param name the name of the type.
     */
    StaticReflector.prototype.getStaticType = function (moduleId, name) {
        var key = "\"" + moduleId + "\"." + name;
        var result = this.typeCache.get(key);
        if (!lang_1.isPresent(result)) {
            result = new StaticType(moduleId, name);
            this.typeCache.set(key, result);
        }
        return result;
    };
    StaticReflector.prototype.annotations = function (type) {
        var _this = this;
        var annotations = this.annotationCache.get(type);
        if (!lang_1.isPresent(annotations)) {
            var classMetadata = this.getTypeMetadata(type);
            if (lang_1.isPresent(classMetadata['decorators'])) {
                annotations = classMetadata['decorators']
                    .map(function (decorator) { return _this.convertKnownDecorator(type.moduleId, decorator); })
                    .filter(function (decorator) { return lang_1.isPresent(decorator); });
            }
            else {
                annotations = [];
            }
            this.annotationCache.set(type, annotations);
        }
        return annotations;
    };
    StaticReflector.prototype.propMetadata = function (type) {
        var propMetadata = this.propertyCache.get(type);
        if (!lang_1.isPresent(propMetadata)) {
            var classMetadata = this.getTypeMetadata(type);
            propMetadata = this.getPropertyMetadata(type.moduleId, classMetadata['members']);
            if (!lang_1.isPresent(propMetadata)) {
                propMetadata = {};
            }
            this.propertyCache.set(type, propMetadata);
        }
        return propMetadata;
    };
    StaticReflector.prototype.parameters = function (type) {
        var parameters = this.parameterCache.get(type);
        if (!lang_1.isPresent(parameters)) {
            var classMetadata = this.getTypeMetadata(type);
            if (lang_1.isPresent(classMetadata)) {
                var members = classMetadata['members'];
                if (lang_1.isPresent(members)) {
                    var ctorData = members['__ctor__'];
                    if (lang_1.isPresent(ctorData)) {
                        var ctor = ctorData.find(function (a) { return a['__symbolic'] === 'constructor'; });
                        parameters = this.simplify(type.moduleId, ctor['parameters']);
                    }
                }
            }
            if (!lang_1.isPresent(parameters)) {
                parameters = [];
            }
            this.parameterCache.set(type, parameters);
        }
        return parameters;
    };
    StaticReflector.prototype.initializeConversionMap = function () {
        var _this = this;
        var core_metadata = 'angular2/src/core/metadata';
        var conversionMap = this.conversionMap;
        conversionMap.set(this.getStaticType(core_metadata, 'Directive'), function (moduleContext, expression) {
            var p0 = _this.getDecoratorParameter(moduleContext, expression, 0);
            if (!lang_1.isPresent(p0)) {
                p0 = {};
            }
            return new metadata_1.DirectiveMetadata({
                selector: p0['selector'],
                inputs: p0['inputs'],
                outputs: p0['outputs'],
                events: p0['events'],
                host: p0['host'],
                bindings: p0['bindings'],
                providers: p0['providers'],
                exportAs: p0['exportAs'],
                queries: p0['queries'],
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'Component'), function (moduleContext, expression) {
            var p0 = _this.getDecoratorParameter(moduleContext, expression, 0);
            if (!lang_1.isPresent(p0)) {
                p0 = {};
            }
            return new metadata_1.ComponentMetadata({
                selector: p0['selector'],
                inputs: p0['inputs'],
                outputs: p0['outputs'],
                properties: p0['properties'],
                events: p0['events'],
                host: p0['host'],
                exportAs: p0['exportAs'],
                moduleId: p0['moduleId'],
                bindings: p0['bindings'],
                providers: p0['providers'],
                viewBindings: p0['viewBindings'],
                viewProviders: p0['viewProviders'],
                changeDetection: p0['changeDetection'],
                queries: p0['queries'],
                templateUrl: p0['templateUrl'],
                template: p0['template'],
                styleUrls: p0['styleUrls'],
                styles: p0['styles'],
                directives: p0['directives'],
                pipes: p0['pipes'],
                encapsulation: p0['encapsulation']
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'Input'), function (moduleContext, expression) { return new metadata_1.InputMetadata(_this.getDecoratorParameter(moduleContext, expression, 0)); });
        conversionMap.set(this.getStaticType(core_metadata, 'Output'), function (moduleContext, expression) { return new metadata_1.OutputMetadata(_this.getDecoratorParameter(moduleContext, expression, 0)); });
        conversionMap.set(this.getStaticType(core_metadata, 'View'), function (moduleContext, expression) {
            var p0 = _this.getDecoratorParameter(moduleContext, expression, 0);
            if (!lang_1.isPresent(p0)) {
                p0 = {};
            }
            return new metadata_1.ViewMetadata({
                templateUrl: p0['templateUrl'],
                template: p0['template'],
                directives: p0['directives'],
                pipes: p0['pipes'],
                encapsulation: p0['encapsulation'],
                styles: p0['styles'],
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'Attribute'), function (moduleContext, expression) { return new metadata_1.AttributeMetadata(_this.getDecoratorParameter(moduleContext, expression, 0)); });
        conversionMap.set(this.getStaticType(core_metadata, 'Query'), function (moduleContext, expression) {
            var p0 = _this.getDecoratorParameter(moduleContext, expression, 0);
            var p1 = _this.getDecoratorParameter(moduleContext, expression, 1);
            if (!lang_1.isPresent(p1)) {
                p1 = {};
            }
            return new metadata_1.QueryMetadata(p0, { descendants: p1.descendants, first: p1.first });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'ContentChildren'), function (moduleContext, expression) { return new metadata_1.ContentChildrenMetadata(_this.getDecoratorParameter(moduleContext, expression, 0)); });
        conversionMap.set(this.getStaticType(core_metadata, 'ContentChild'), function (moduleContext, expression) { return new metadata_1.ContentChildMetadata(_this.getDecoratorParameter(moduleContext, expression, 0)); });
        conversionMap.set(this.getStaticType(core_metadata, 'ViewChildren'), function (moduleContext, expression) { return new metadata_1.ViewChildrenMetadata(_this.getDecoratorParameter(moduleContext, expression, 0)); });
        conversionMap.set(this.getStaticType(core_metadata, 'ViewChild'), function (moduleContext, expression) { return new metadata_1.ViewChildMetadata(_this.getDecoratorParameter(moduleContext, expression, 0)); });
        conversionMap.set(this.getStaticType(core_metadata, 'ViewQuery'), function (moduleContext, expression) {
            var p0 = _this.getDecoratorParameter(moduleContext, expression, 0);
            var p1 = _this.getDecoratorParameter(moduleContext, expression, 1);
            if (!lang_1.isPresent(p1)) {
                p1 = {};
            }
            return new metadata_1.ViewQueryMetadata(p0, {
                descendants: p1['descendants'],
                first: p1['first'],
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'Pipe'), function (moduleContext, expression) {
            var p0 = _this.getDecoratorParameter(moduleContext, expression, 0);
            if (!lang_1.isPresent(p0)) {
                p0 = {};
            }
            return new metadata_1.PipeMetadata({
                name: p0['name'],
                pure: p0['pure'],
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'HostBinding'), function (moduleContext, expression) { return new metadata_1.HostBindingMetadata(_this.getDecoratorParameter(moduleContext, expression, 0)); });
        conversionMap.set(this.getStaticType(core_metadata, 'HostListener'), function (moduleContext, expression) { return new metadata_1.HostListenerMetadata(_this.getDecoratorParameter(moduleContext, expression, 0), _this.getDecoratorParameter(moduleContext, expression, 1)); });
        return null;
    };
    StaticReflector.prototype.convertKnownDecorator = function (moduleContext, expression) {
        var converter = this.conversionMap.get(this.getDecoratorType(moduleContext, expression));
        if (lang_1.isPresent(converter))
            return converter(moduleContext, expression);
        return null;
    };
    StaticReflector.prototype.getDecoratorType = function (moduleContext, expression) {
        if (isMetadataSymbolicCallExpression(expression)) {
            var target = expression['expression'];
            if (isMetadataSymbolicReferenceExpression(target)) {
                var moduleId = this.normalizeModuleName(moduleContext, target['module']);
                return this.getStaticType(moduleId, target['name']);
            }
        }
        return null;
    };
    StaticReflector.prototype.getDecoratorParameter = function (moduleContext, expression, index) {
        if (isMetadataSymbolicCallExpression(expression) && lang_1.isPresent(expression['arguments']) &&
            expression['arguments'].length <= index + 1) {
            return this.simplify(moduleContext, expression['arguments'][index]);
        }
        return null;
    };
    StaticReflector.prototype.getPropertyMetadata = function (moduleContext, value) {
        var _this = this;
        if (lang_1.isPresent(value)) {
            var result_1 = {};
            collection_1.StringMapWrapper.forEach(value, function (value, name) {
                var data = _this.getMemberData(moduleContext, value);
                if (lang_1.isPresent(data)) {
                    var propertyData = data.filter(function (d) { return d['kind'] == "property"; })
                        .map(function (d) { return d['directives']; })
                        .reduce(function (p, c) { return p.concat(c); }, []);
                    if (propertyData.length != 0) {
                        collection_1.StringMapWrapper.set(result_1, name, propertyData);
                    }
                }
            });
            return result_1;
        }
        return {};
    };
    // clang-format off
    StaticReflector.prototype.getMemberData = function (moduleContext, member) {
        var _this = this;
        // clang-format on
        var result = [];
        if (lang_1.isPresent(member)) {
            for (var _i = 0, member_1 = member; _i < member_1.length; _i++) {
                var item = member_1[_i];
                result.push({
                    kind: item['__symbolic'],
                    directives: lang_1.isPresent(item['decorators']) ?
                        item['decorators']
                            .map(function (decorator) { return _this.convertKnownDecorator(moduleContext, decorator); })
                            .filter(function (d) { return lang_1.isPresent(d); }) :
                        null
                });
            }
        }
        return result;
    };
    /** @internal */
    StaticReflector.prototype.simplify = function (moduleContext, value) {
        var _this = this;
        function simplify(expression) {
            if (lang_1.isPrimitive(expression)) {
                return expression;
            }
            if (lang_1.isArray(expression)) {
                var result = [];
                for (var _i = 0, _a = expression; _i < _a.length; _i++) {
                    var item = _a[_i];
                    result.push(simplify(item));
                }
                return result;
            }
            if (lang_1.isPresent(expression)) {
                if (lang_1.isPresent(expression['__symbolic'])) {
                    switch (expression['__symbolic']) {
                        case "binop":
                            var left = simplify(expression['left']);
                            var right = simplify(expression['right']);
                            switch (expression['operator']) {
                                case '&&':
                                    return left && right;
                                case '||':
                                    return left || right;
                                case '|':
                                    return left | right;
                                case '^':
                                    return left ^ right;
                                case '&':
                                    return left & right;
                                case '==':
                                    return left == right;
                                case '!=':
                                    return left != right;
                                case '===':
                                    return left === right;
                                case '!==':
                                    return left !== right;
                                case '<':
                                    return left < right;
                                case '>':
                                    return left > right;
                                case '<=':
                                    return left <= right;
                                case '>=':
                                    return left >= right;
                                case '<<':
                                    return left << right;
                                case '>>':
                                    return left >> right;
                                case '+':
                                    return left + right;
                                case '-':
                                    return left - right;
                                case '*':
                                    return left * right;
                                case '/':
                                    return left / right;
                                case '%':
                                    return left % right;
                            }
                            return null;
                        case "pre":
                            var operand = simplify(expression['operand']);
                            switch (expression['operator']) {
                                case '+':
                                    return operand;
                                case '-':
                                    return -operand;
                                case '!':
                                    return !operand;
                                case '~':
                                    return ~operand;
                            }
                            return null;
                        case "index":
                            var indexTarget = simplify(expression['expression']);
                            var index = simplify(expression['index']);
                            if (lang_1.isPresent(indexTarget) && lang_1.isPrimitive(index))
                                return indexTarget[index];
                            return null;
                        case "select":
                            var selectTarget = simplify(expression['expression']);
                            var member = simplify(expression['member']);
                            if (lang_1.isPresent(selectTarget) && lang_1.isPrimitive(member))
                                return selectTarget[member];
                            return null;
                        case "reference":
                            var referenceModuleName = _this.normalizeModuleName(moduleContext, expression['module']);
                            var referenceModule = _this.getModuleMetadata(referenceModuleName);
                            var referenceValue = referenceModule['metadata'][expression['name']];
                            if (isClassMetadata(referenceValue)) {
                                // Convert to a pseudo type
                                return _this.getStaticType(referenceModuleName, expression['name']);
                            }
                            return _this.simplify(referenceModuleName, referenceValue);
                        case "call":
                            return null;
                    }
                    return null;
                }
                var result_2 = {};
                collection_1.StringMapWrapper.forEach(expression, function (value, name) { result_2[name] = simplify(value); });
                return result_2;
            }
            return null;
        }
        return simplify(value);
    };
    StaticReflector.prototype.getModuleMetadata = function (module) {
        var moduleMetadata = this.metadataCache.get(module);
        if (!lang_1.isPresent(moduleMetadata)) {
            moduleMetadata = this.host.getMetadataFor(module);
            if (!lang_1.isPresent(moduleMetadata)) {
                moduleMetadata = { __symbolic: "module", module: module, metadata: {} };
            }
            this.metadataCache.set(module, moduleMetadata);
        }
        return moduleMetadata;
    };
    StaticReflector.prototype.getTypeMetadata = function (type) {
        var moduleMetadata = this.getModuleMetadata(type.moduleId);
        var result = moduleMetadata['metadata'][type.name];
        if (!lang_1.isPresent(result)) {
            result = { __symbolic: "class" };
        }
        return result;
    };
    StaticReflector.prototype.normalizeModuleName = function (from, to) {
        if (to.startsWith('.')) {
            return pathTo(from, to);
        }
        return to;
    };
    return StaticReflector;
}());
exports.StaticReflector = StaticReflector;
function isMetadataSymbolicCallExpression(expression) {
    return !lang_1.isPrimitive(expression) && !lang_1.isArray(expression) && expression['__symbolic'] == 'call';
}
function isMetadataSymbolicReferenceExpression(expression) {
    return !lang_1.isPrimitive(expression) && !lang_1.isArray(expression) &&
        expression['__symbolic'] == 'reference';
}
function isClassMetadata(expression) {
    return !lang_1.isPrimitive(expression) && !lang_1.isArray(expression) && expression['__symbolic'] == 'class';
}
function splitPath(path) {
    return path.split(/\/|\\/g);
}
function resolvePath(pathParts) {
    var result = [];
    collection_1.ListWrapper.forEachWithIndex(pathParts, function (part, index) {
        switch (part) {
            case '':
            case '.':
                if (index > 0)
                    return;
                break;
            case '..':
                if (index > 0 && result.length != 0)
                    result.pop();
                return;
        }
        result.push(part);
    });
    return result.join('/');
}
function pathTo(from, to) {
    var result = to;
    if (to.startsWith('.')) {
        var fromParts = splitPath(from);
        fromParts.pop(); // remove the file name.
        var toParts = splitPath(to);
        result = resolvePath(fromParts.concat(toParts));
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3JlZmxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9zdGF0aWNfcmVmbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwyQkFBNEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUM3RSxxQkFRTywwQkFBMEIsQ0FBQyxDQUFBO0FBQ2xDLHlCQWdCTyw0QkFBNEIsQ0FBQyxDQUFBO0FBb0JwQzs7OztHQUlHO0FBQ0g7SUFDRSxvQkFBbUIsUUFBZ0IsRUFBUyxJQUFZO1FBQXJDLGFBQVEsR0FBUixRQUFRLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO0lBQUcsQ0FBQztJQUM5RCxpQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRlksa0JBQVUsYUFFdEIsQ0FBQTtBQUVEOzs7R0FHRztBQUNIO0lBTUUseUJBQW9CLElBQXlCO1FBQXpCLFNBQUksR0FBSixJQUFJLENBQXFCO1FBTHJDLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBc0IsQ0FBQztRQUMxQyxvQkFBZSxHQUFHLElBQUksR0FBRyxFQUFxQixDQUFDO1FBQy9DLGtCQUFhLEdBQUcsSUFBSSxHQUFHLEVBQW9DLENBQUM7UUFDNUQsbUJBQWMsR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQztRQUM5QyxrQkFBYSxHQUFHLElBQUksR0FBRyxFQUFnQyxDQUFDO1FBeUV4RCxrQkFBYSxHQUFHLElBQUksR0FBRyxFQUErRCxDQUFDO1FBeEU5QyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUFDLENBQUM7SUFFbEYsbUNBQVMsR0FBVCxVQUFVLFVBQWUsSUFBWSxNQUFNLENBQWMsVUFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFFaEY7Ozs7OztPQU1HO0lBQ0ksdUNBQWEsR0FBcEIsVUFBcUIsUUFBZ0IsRUFBRSxJQUFZO1FB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QUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDO2dCQUN0QixLQUFLLENBQUM7WUFDUixLQUFLLElBQUk7Z0JBQ1AsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUVELGdCQUFnQixJQUFZLEVBQUUsRUFBVTtJQUN0QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFFLHdCQUF3QjtRQUMxQyxJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUIsTUFBTSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdFdyYXBwZXIsIFN0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1xuICBpc0FycmF5LFxuICBpc0JsYW5rLFxuICBpc051bWJlcixcbiAgaXNQcmVzZW50LFxuICBpc1ByaW1pdGl2ZSxcbiAgaXNTdHJpbmcsXG4gIFR5cGVcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7XG4gIEF0dHJpYnV0ZU1ldGFkYXRhLFxuICBEaXJlY3RpdmVNZXRhZGF0YSxcbiAgQ29tcG9uZW50TWV0YWRhdGEsXG4gIENvbnRlbnRDaGlsZHJlbk1ldGFkYXRhLFxuICBDb250ZW50Q2hpbGRNZXRhZGF0YSxcbiAgSW5wdXRNZXRhZGF0YSxcbiAgSG9zdEJpbmRpbmdNZXRhZGF0YSxcbiAgSG9zdExpc3RlbmVyTWV0YWRhdGEsXG4gIE91dHB1dE1ldGFkYXRhLFxuICBQaXBlTWV0YWRhdGEsXG4gIFZpZXdNZXRhZGF0YSxcbiAgVmlld0NoaWxkTWV0YWRhdGEsXG4gIFZpZXdDaGlsZHJlbk1ldGFkYXRhLFxuICBWaWV3UXVlcnlNZXRhZGF0YSxcbiAgUXVlcnlNZXRhZGF0YSxcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEnO1xuaW1wb3J0IHtSZWZsZWN0b3JSZWFkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdG9yX3JlYWRlcic7XG5cbi8qKlxuICogVGhlIGhvc3Qgb2YgdGhlIHN0YXRpYyByZXNvbHZlciBpcyBleHBlY3RlZCB0byBiZSBhYmxlIHRvIHByb3ZpZGUgbW9kdWxlIG1ldGFkYXRhIGluIHRoZSBmb3JtIG9mXG4gKiBNb2R1bGVNZXRhZGF0YS4gQW5ndWxhciAyIENMSSB3aWxsIHByb2R1Y2UgdGhpcyBtZXRhZGF0YSBmb3IgYSBtb2R1bGUgd2hlbmV2ZXIgYSAuZC50cyBmaWxlcyBpc1xuICogcHJvZHVjZWQgYW5kIHRoZSBtb2R1bGUgaGFzIGV4cG9ydGVkIHZhcmlhYmxlcyBvciBjbGFzc2VzIHdpdGggZGVjb3JhdG9ycy4gTW9kdWxlIG1ldGFkYXRhIGNhblxuICogYWxzbyBiZSBwcm9kdWNlZCBkaXJlY3RseSBmcm9tIFR5cGVTY3JpcHQgc291cmNlcyBieSB1c2luZyBNZXRhZGF0YUNvbGxlY3RvciBpbiB0b29scy9tZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdGF0aWNSZWZsZWN0b3JIb3N0IHtcbiAgLyoqXG4gICAqICBSZXR1cm4gYSBNb2R1bGVNZXRhZGF0YSBmb3IgdGhlIGdpdmUgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0gbW9kdWxlSWQgaXMgYSBzdHJpbmcgaWRlbnRpZmllciBmb3IgYSBtb2R1bGUgaW4gdGhlIGZvcm0gdGhhdCB3b3VsZCBleHBlY3RlZCBpbiBhXG4gICAqICAgICAgICAgICAgICAgICBtb2R1bGUgaW1wb3J0IG9mIGFuIGltcG9ydCBzdGF0ZW1lbnQuXG4gICAqIEByZXR1cm5zIHRoZSBtZXRhZGF0YSBmb3IgdGhlIGdpdmVuIG1vZHVsZS5cbiAgICovXG4gIGdldE1ldGFkYXRhRm9yKG1vZHVsZUlkOiBzdHJpbmcpOiB7W2tleTogc3RyaW5nXTogYW55fTtcbn1cblxuLyoqXG4gKiBBIHRva2VuIHJlcHJlc2VudGluZyB0aGUgYSByZWZlcmVuY2UgdG8gYSBzdGF0aWMgdHlwZS5cbiAqXG4gKiBUaGlzIHRva2VuIGlzIHVuaXF1ZSBmb3IgYSBtb2R1bGVJZCBhbmQgbmFtZSBhbmQgY2FuIGJlIHVzZWQgYXMgYSBoYXNoIHRhYmxlIGtleS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRpY1R5cGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbW9kdWxlSWQ6IHN0cmluZywgcHVibGljIG5hbWU6IHN0cmluZykge31cbn1cblxuLyoqXG4gKiBBIHN0YXRpYyByZWZsZWN0b3IgaW1wbGVtZW50cyBlbm91Z2ggb2YgdGhlIFJlZmxlY3RvciBBUEkgdGhhdCBpcyBuZWNlc3NhcnkgdG8gY29tcGlsZVxuICogdGVtcGxhdGVzIHN0YXRpY2FsbHkuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0aWNSZWZsZWN0b3IgaW1wbGVtZW50cyBSZWZsZWN0b3JSZWFkZXIge1xuICBwcml2YXRlIHR5cGVDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBTdGF0aWNUeXBlPigpO1xuICBwcml2YXRlIGFubm90YXRpb25DYWNoZSA9IG5ldyBNYXA8U3RhdGljVHlwZSwgYW55W10+KCk7XG4gIHByaXZhdGUgcHJvcGVydHlDYWNoZSA9IG5ldyBNYXA8U3RhdGljVHlwZSwge1trZXk6IHN0cmluZ106IGFueX0+KCk7XG4gIHByaXZhdGUgcGFyYW1ldGVyQ2FjaGUgPSBuZXcgTWFwPFN0YXRpY1R5cGUsIGFueVtdPigpO1xuICBwcml2YXRlIG1ldGFkYXRhQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywge1trZXk6IHN0cmluZ106IGFueX0+KCk7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaG9zdDogU3RhdGljUmVmbGVjdG9ySG9zdCkgeyB0aGlzLmluaXRpYWxpemVDb252ZXJzaW9uTWFwKCk7IH1cblxuICBpbXBvcnRVcmkodHlwZU9yRnVuYzogYW55KTogc3RyaW5nIHsgcmV0dXJuICg8U3RhdGljVHlwZT50eXBlT3JGdW5jKS5tb2R1bGVJZDsgfVxuXG4gIC8qKlxuICAgKiBnZXRTdGF0aWN0eXBlIHByb2R1Y2VzIGEgVHlwZSB3aG9zZSBtZXRhZGF0YSBpcyBrbm93biBidXQgd2hvc2UgaW1wbGVtZW50YXRpb24gaXMgbm90IGxvYWRlZC5cbiAgICogQWxsIHR5cGVzIHBhc3NlZCB0byB0aGUgU3RhdGljUmVzb2x2ZXIgc2hvdWxkIGJlIHBzZXVkby10eXBlcyByZXR1cm5lZCBieSB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIG1vZHVsZUlkIHRoZSBtb2R1bGUgaWRlbnRpZmllciBhcyB3b3VsZCBiZSBwYXNzZWQgdG8gYW4gaW1wb3J0IHN0YXRlbWVudC5cbiAgICogQHBhcmFtIG5hbWUgdGhlIG5hbWUgb2YgdGhlIHR5cGUuXG4gICAqL1xuICBwdWJsaWMgZ2V0U3RhdGljVHlwZShtb2R1bGVJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBTdGF0aWNUeXBlIHtcbiAgICBsZXQga2V5ID0gYFwiJHttb2R1bGVJZH1cIi4ke25hbWV9YDtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy50eXBlQ2FjaGUuZ2V0KGtleSk7XG4gICAgaWYgKCFpc1ByZXNlbnQocmVzdWx0KSkge1xuICAgICAgcmVzdWx0ID0gbmV3IFN0YXRpY1R5cGUobW9kdWxlSWQsIG5hbWUpO1xuICAgICAgdGhpcy50eXBlQ2FjaGUuc2V0KGtleSwgcmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBhbm5vdGF0aW9ucyh0eXBlOiBTdGF0aWNUeXBlKTogYW55W10ge1xuICAgIGxldCBhbm5vdGF0aW9ucyA9IHRoaXMuYW5ub3RhdGlvbkNhY2hlLmdldCh0eXBlKTtcbiAgICBpZiAoIWlzUHJlc2VudChhbm5vdGF0aW9ucykpIHtcbiAgICAgIGxldCBjbGFzc01ldGFkYXRhID0gdGhpcy5nZXRUeXBlTWV0YWRhdGEodHlwZSk7XG4gICAgICBpZiAoaXNQcmVzZW50KGNsYXNzTWV0YWRhdGFbJ2RlY29yYXRvcnMnXSkpIHtcbiAgICAgICAgYW5ub3RhdGlvbnMgPSAoPGFueVtdPmNsYXNzTWV0YWRhdGFbJ2RlY29yYXRvcnMnXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChkZWNvcmF0b3IgPT4gdGhpcy5jb252ZXJ0S25vd25EZWNvcmF0b3IodHlwZS5tb2R1bGVJZCwgZGVjb3JhdG9yKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihkZWNvcmF0b3IgPT4gaXNQcmVzZW50KGRlY29yYXRvcikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW5ub3RhdGlvbnMgPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYW5ub3RhdGlvbkNhY2hlLnNldCh0eXBlLCBhbm5vdGF0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiBhbm5vdGF0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBwcm9wTWV0YWRhdGEodHlwZTogU3RhdGljVHlwZSk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgICBsZXQgcHJvcE1ldGFkYXRhID0gdGhpcy5wcm9wZXJ0eUNhY2hlLmdldCh0eXBlKTtcbiAgICBpZiAoIWlzUHJlc2VudChwcm9wTWV0YWRhdGEpKSB7XG4gICAgICBsZXQgY2xhc3NNZXRhZGF0YSA9IHRoaXMuZ2V0VHlwZU1ldGFkYXRhKHR5cGUpO1xuICAgICAgcHJvcE1ldGFkYXRhID0gdGhpcy5nZXRQcm9wZXJ0eU1ldGFkYXRhKHR5cGUubW9kdWxlSWQsIGNsYXNzTWV0YWRhdGFbJ21lbWJlcnMnXSk7XG4gICAgICBpZiAoIWlzUHJlc2VudChwcm9wTWV0YWRhdGEpKSB7XG4gICAgICAgIHByb3BNZXRhZGF0YSA9IHt9O1xuICAgICAgfVxuICAgICAgdGhpcy5wcm9wZXJ0eUNhY2hlLnNldCh0eXBlLCBwcm9wTWV0YWRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcE1ldGFkYXRhO1xuICB9XG5cbiAgcHVibGljIHBhcmFtZXRlcnModHlwZTogU3RhdGljVHlwZSk6IGFueVtdIHtcbiAgICBsZXQgcGFyYW1ldGVycyA9IHRoaXMucGFyYW1ldGVyQ2FjaGUuZ2V0KHR5cGUpO1xuICAgIGlmICghaXNQcmVzZW50KHBhcmFtZXRlcnMpKSB7XG4gICAgICBsZXQgY2xhc3NNZXRhZGF0YSA9IHRoaXMuZ2V0VHlwZU1ldGFkYXRhKHR5cGUpO1xuICAgICAgaWYgKGlzUHJlc2VudChjbGFzc01ldGFkYXRhKSkge1xuICAgICAgICBsZXQgbWVtYmVycyA9IGNsYXNzTWV0YWRhdGFbJ21lbWJlcnMnXTtcbiAgICAgICAgaWYgKGlzUHJlc2VudChtZW1iZXJzKSkge1xuICAgICAgICAgIGxldCBjdG9yRGF0YSA9IG1lbWJlcnNbJ19fY3Rvcl9fJ107XG4gICAgICAgICAgaWYgKGlzUHJlc2VudChjdG9yRGF0YSkpIHtcbiAgICAgICAgICAgIGxldCBjdG9yID0gKDxhbnlbXT5jdG9yRGF0YSkuZmluZChhID0+IGFbJ19fc3ltYm9saWMnXSA9PT0gJ2NvbnN0cnVjdG9yJyk7XG4gICAgICAgICAgICBwYXJhbWV0ZXJzID0gdGhpcy5zaW1wbGlmeSh0eXBlLm1vZHVsZUlkLCBjdG9yWydwYXJhbWV0ZXJzJ10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFpc1ByZXNlbnQocGFyYW1ldGVycykpIHtcbiAgICAgICAgcGFyYW1ldGVycyA9IFtdO1xuICAgICAgfVxuICAgICAgdGhpcy5wYXJhbWV0ZXJDYWNoZS5zZXQodHlwZSwgcGFyYW1ldGVycyk7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbWV0ZXJzO1xuICB9XG5cbiAgcHJpdmF0ZSBjb252ZXJzaW9uTWFwID0gbmV3IE1hcDxTdGF0aWNUeXBlLCAobW9kdWxlQ29udGV4dDogc3RyaW5nLCBleHByZXNzaW9uOiBhbnkpID0+IGFueT4oKTtcbiAgcHJpdmF0ZSBpbml0aWFsaXplQ29udmVyc2lvbk1hcCgpOiBhbnkge1xuICAgIGxldCBjb3JlX21ldGFkYXRhID0gJ2FuZ3VsYXIyL3NyYy9jb3JlL21ldGFkYXRhJztcbiAgICBsZXQgY29udmVyc2lvbk1hcCA9IHRoaXMuY29udmVyc2lvbk1hcDtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ0RpcmVjdGl2ZScpLFxuICAgICAgICAgICAgICAgICAgICAgIChtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcDAgPSB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNQcmVzZW50KHAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwMCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEaXJlY3RpdmVNZXRhZGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwMFsnc2VsZWN0b3InXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBwMFsnaW5wdXRzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IHAwWydvdXRwdXRzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czogcDBbJ2V2ZW50cyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBob3N0OiBwMFsnaG9zdCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kaW5nczogcDBbJ2JpbmRpbmdzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogcDBbJ3Byb3ZpZGVycyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRBczogcDBbJ2V4cG9ydEFzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJpZXM6IHAwWydxdWVyaWVzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ0NvbXBvbmVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgIChtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcDAgPSB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNQcmVzZW50KHAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwMCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb21wb25lbnRNZXRhZGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwMFsnc2VsZWN0b3InXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBwMFsnaW5wdXRzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IHAwWydvdXRwdXRzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHAwWydwcm9wZXJ0aWVzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czogcDBbJ2V2ZW50cyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBob3N0OiBwMFsnaG9zdCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRBczogcDBbJ2V4cG9ydEFzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZUlkOiBwMFsnbW9kdWxlSWQnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGluZ3M6IHAwWydiaW5kaW5ncyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IHAwWydwcm92aWRlcnMnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld0JpbmRpbmdzOiBwMFsndmlld0JpbmRpbmdzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdQcm92aWRlcnM6IHAwWyd2aWV3UHJvdmlkZXJzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZURldGVjdGlvbjogcDBbJ2NoYW5nZURldGVjdGlvbiddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyaWVzOiBwMFsncXVlcmllcyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogcDBbJ3RlbXBsYXRlVXJsJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBwMFsndGVtcGxhdGUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVVcmxzOiBwMFsnc3R5bGVVcmxzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlczogcDBbJ3N0eWxlcyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBwMFsnZGlyZWN0aXZlcyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwaXBlczogcDBbJ3BpcGVzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuY2Fwc3VsYXRpb246IHAwWydlbmNhcHN1bGF0aW9uJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnSW5wdXQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IElucHV0TWV0YWRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApKSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdPdXRwdXQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IE91dHB1dE1ldGFkYXRhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKSkpO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnVmlldycpLCAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4ge1xuICAgICAgbGV0IHAwID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCk7XG4gICAgICBpZiAoIWlzUHJlc2VudChwMCkpIHtcbiAgICAgICAgcDAgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgVmlld01ldGFkYXRhKHtcbiAgICAgICAgdGVtcGxhdGVVcmw6IHAwWyd0ZW1wbGF0ZVVybCddLFxuICAgICAgICB0ZW1wbGF0ZTogcDBbJ3RlbXBsYXRlJ10sXG4gICAgICAgIGRpcmVjdGl2ZXM6IHAwWydkaXJlY3RpdmVzJ10sXG4gICAgICAgIHBpcGVzOiBwMFsncGlwZXMnXSxcbiAgICAgICAgZW5jYXBzdWxhdGlvbjogcDBbJ2VuY2Fwc3VsYXRpb24nXSxcbiAgICAgICAgc3R5bGVzOiBwMFsnc3R5bGVzJ10sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ0F0dHJpYnV0ZScpLFxuICAgICAgICAgICAgICAgICAgICAgIChtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSA9PiBuZXcgQXR0cmlidXRlTWV0YWRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApKSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdRdWVyeScpLCAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4ge1xuICAgICAgbGV0IHAwID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCk7XG4gICAgICBsZXQgcDEgPSB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAxKTtcbiAgICAgIGlmICghaXNQcmVzZW50KHAxKSkge1xuICAgICAgICBwMSA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeU1ldGFkYXRhKHAwLCB7ZGVzY2VuZGFudHM6IHAxLmRlc2NlbmRhbnRzLCBmaXJzdDogcDEuZmlyc3R9KTtcbiAgICB9KTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ0NvbnRlbnRDaGlsZHJlbicpLFxuICAgICAgICAgICAgICAgICAgICAgIChtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSA9PiBuZXcgQ29udGVudENoaWxkcmVuTWV0YWRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApKSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdDb250ZW50Q2hpbGQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IENvbnRlbnRDaGlsZE1ldGFkYXRhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKSkpO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnVmlld0NoaWxkcmVuJyksXG4gICAgICAgICAgICAgICAgICAgICAgKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pID0+IG5ldyBWaWV3Q2hpbGRyZW5NZXRhZGF0YShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCkpKTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ1ZpZXdDaGlsZCcpLFxuICAgICAgICAgICAgICAgICAgICAgIChtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSA9PiBuZXcgVmlld0NoaWxkTWV0YWRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApKSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdWaWV3UXVlcnknKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHAwID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcDEgPSB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNQcmVzZW50KHAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwMSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWaWV3UXVlcnlNZXRhZGF0YShwMCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjZW5kYW50czogcDFbJ2Rlc2NlbmRhbnRzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0OiBwMVsnZmlyc3QnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnUGlwZScpLCAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4ge1xuICAgICAgbGV0IHAwID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCk7XG4gICAgICBpZiAoIWlzUHJlc2VudChwMCkpIHtcbiAgICAgICAgcDAgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUGlwZU1ldGFkYXRhKHtcbiAgICAgICAgbmFtZTogcDBbJ25hbWUnXSxcbiAgICAgICAgcHVyZTogcDBbJ3B1cmUnXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnSG9zdEJpbmRpbmcnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IEhvc3RCaW5kaW5nTWV0YWRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApKSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdIb3N0TGlzdGVuZXInKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IEhvc3RMaXN0ZW5lck1ldGFkYXRhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMSkpKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydEtub3duRGVjb3JhdG9yKG1vZHVsZUNvbnRleHQ6IHN0cmluZywgZXhwcmVzc2lvbjoge1trZXk6IHN0cmluZ106IGFueX0pOiBhbnkge1xuICAgIGxldCBjb252ZXJ0ZXIgPSB0aGlzLmNvbnZlcnNpb25NYXAuZ2V0KHRoaXMuZ2V0RGVjb3JhdG9yVHlwZShtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSk7XG4gICAgaWYgKGlzUHJlc2VudChjb252ZXJ0ZXIpKSByZXR1cm4gY29udmVydGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREZWNvcmF0b3JUeXBlKG1vZHVsZUNvbnRleHQ6IHN0cmluZywgZXhwcmVzc2lvbjoge1trZXk6IHN0cmluZ106IGFueX0pOiBTdGF0aWNUeXBlIHtcbiAgICBpZiAoaXNNZXRhZGF0YVN5bWJvbGljQ2FsbEV4cHJlc3Npb24oZXhwcmVzc2lvbikpIHtcbiAgICAgIGxldCB0YXJnZXQgPSBleHByZXNzaW9uWydleHByZXNzaW9uJ107XG4gICAgICBpZiAoaXNNZXRhZGF0YVN5bWJvbGljUmVmZXJlbmNlRXhwcmVzc2lvbih0YXJnZXQpKSB7XG4gICAgICAgIGxldCBtb2R1bGVJZCA9IHRoaXMubm9ybWFsaXplTW9kdWxlTmFtZShtb2R1bGVDb250ZXh0LCB0YXJnZXRbJ21vZHVsZSddKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGljVHlwZShtb2R1bGVJZCwgdGFyZ2V0WyduYW1lJ10pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQ6IHN0cmluZywgZXhwcmVzc2lvbjoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBudW1iZXIpOiBhbnkge1xuICAgIGlmIChpc01ldGFkYXRhU3ltYm9saWNDYWxsRXhwcmVzc2lvbihleHByZXNzaW9uKSAmJiBpc1ByZXNlbnQoZXhwcmVzc2lvblsnYXJndW1lbnRzJ10pICYmXG4gICAgICAgICg8YW55W10+ZXhwcmVzc2lvblsnYXJndW1lbnRzJ10pLmxlbmd0aCA8PSBpbmRleCArIDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnNpbXBsaWZ5KG1vZHVsZUNvbnRleHQsICg8YW55W10+ZXhwcmVzc2lvblsnYXJndW1lbnRzJ10pW2luZGV4XSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQcm9wZXJ0eU1ldGFkYXRhKG1vZHVsZUNvbnRleHQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgICBpZiAoaXNQcmVzZW50KHZhbHVlKSkge1xuICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKHZhbHVlLCAodmFsdWUsIG5hbWUpID0+IHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldE1lbWJlckRhdGEobW9kdWxlQ29udGV4dCwgdmFsdWUpO1xuICAgICAgICBpZiAoaXNQcmVzZW50KGRhdGEpKSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5RGF0YSA9IGRhdGEuZmlsdGVyKGQgPT4gZFsna2luZCddID09IFwicHJvcGVydHlcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZCA9PiBkWydkaXJlY3RpdmVzJ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChwLCBjKSA9PiAoPGFueVtdPnApLmNvbmNhdCg8YW55W10+YyksIFtdKTtcbiAgICAgICAgICBpZiAocHJvcGVydHlEYXRhLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBTdHJpbmdNYXBXcmFwcGVyLnNldChyZXN1bHQsIG5hbWUsIHByb3BlcnR5RGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8vIGNsYW5nLWZvcm1hdCBvZmZcbiAgcHJpdmF0ZSBnZXRNZW1iZXJEYXRhKG1vZHVsZUNvbnRleHQ6IHN0cmluZywgbWVtYmVyOiB7IFtrZXk6IHN0cmluZ106IGFueSB9W10pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9W10ge1xuICAgIC8vIGNsYW5nLWZvcm1hdCBvblxuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBpZiAoaXNQcmVzZW50KG1lbWJlcikpIHtcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgbWVtYmVyKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBraW5kOiBpdGVtWydfX3N5bWJvbGljJ10sXG4gICAgICAgICAgZGlyZWN0aXZlczpcbiAgICAgICAgICAgICAgaXNQcmVzZW50KGl0ZW1bJ2RlY29yYXRvcnMnXSkgP1xuICAgICAgICAgICAgICAgICAgKDxhbnlbXT5pdGVtWydkZWNvcmF0b3JzJ10pXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcChkZWNvcmF0b3IgPT4gdGhpcy5jb252ZXJ0S25vd25EZWNvcmF0b3IobW9kdWxlQ29udGV4dCwgZGVjb3JhdG9yKSlcbiAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGQgPT4gaXNQcmVzZW50KGQpKSA6XG4gICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgc2ltcGxpZnkobW9kdWxlQ29udGV4dDogc3RyaW5nLCB2YWx1ZTogYW55KTogYW55IHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gc2ltcGxpZnkoZXhwcmVzc2lvbjogYW55KTogYW55IHtcbiAgICAgIGlmIChpc1ByaW1pdGl2ZShleHByZXNzaW9uKSkge1xuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KGV4cHJlc3Npb24pKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZig8YW55PmV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc2ltcGxpZnkoaXRlbSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICBpZiAoaXNQcmVzZW50KGV4cHJlc3Npb24pKSB7XG4gICAgICAgIGlmIChpc1ByZXNlbnQoZXhwcmVzc2lvblsnX19zeW1ib2xpYyddKSkge1xuICAgICAgICAgIHN3aXRjaCAoZXhwcmVzc2lvblsnX19zeW1ib2xpYyddKSB7XG4gICAgICAgICAgICBjYXNlIFwiYmlub3BcIjpcbiAgICAgICAgICAgICAgbGV0IGxlZnQgPSBzaW1wbGlmeShleHByZXNzaW9uWydsZWZ0J10pO1xuICAgICAgICAgICAgICBsZXQgcmlnaHQgPSBzaW1wbGlmeShleHByZXNzaW9uWydyaWdodCddKTtcbiAgICAgICAgICAgICAgc3dpdGNoIChleHByZXNzaW9uWydvcGVyYXRvciddKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnJiYnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgJiYgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnfHwnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgfHwgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCB8IHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgXiByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICYgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPT0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnIT0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgIT0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT09JzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID09PSByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICchPT0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgIT09IHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJzwnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPCByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID4gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPD0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPj0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPj0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPDwnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPDwgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPj4nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPj4gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCArIHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICogcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAvIHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJyUnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGNhc2UgXCJwcmVcIjpcbiAgICAgICAgICAgICAgbGV0IG9wZXJhbmQgPSBzaW1wbGlmeShleHByZXNzaW9uWydvcGVyYW5kJ10pO1xuICAgICAgICAgICAgICBzd2l0Y2ggKGV4cHJlc3Npb25bJ29wZXJhdG9yJ10pIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvcGVyYW5kO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIC1vcGVyYW5kO1xuICAgICAgICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuICFvcGVyYW5kO1xuICAgICAgICAgICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIH5vcGVyYW5kO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY2FzZSBcImluZGV4XCI6XG4gICAgICAgICAgICAgIGxldCBpbmRleFRhcmdldCA9IHNpbXBsaWZ5KGV4cHJlc3Npb25bJ2V4cHJlc3Npb24nXSk7XG4gICAgICAgICAgICAgIGxldCBpbmRleCA9IHNpbXBsaWZ5KGV4cHJlc3Npb25bJ2luZGV4J10pO1xuICAgICAgICAgICAgICBpZiAoaXNQcmVzZW50KGluZGV4VGFyZ2V0KSAmJiBpc1ByaW1pdGl2ZShpbmRleCkpIHJldHVybiBpbmRleFRhcmdldFtpbmRleF07XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY2FzZSBcInNlbGVjdFwiOlxuICAgICAgICAgICAgICBsZXQgc2VsZWN0VGFyZ2V0ID0gc2ltcGxpZnkoZXhwcmVzc2lvblsnZXhwcmVzc2lvbiddKTtcbiAgICAgICAgICAgICAgbGV0IG1lbWJlciA9IHNpbXBsaWZ5KGV4cHJlc3Npb25bJ21lbWJlciddKTtcbiAgICAgICAgICAgICAgaWYgKGlzUHJlc2VudChzZWxlY3RUYXJnZXQpICYmIGlzUHJpbWl0aXZlKG1lbWJlcikpIHJldHVybiBzZWxlY3RUYXJnZXRbbWVtYmVyXTtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjYXNlIFwicmVmZXJlbmNlXCI6XG4gICAgICAgICAgICAgIGxldCByZWZlcmVuY2VNb2R1bGVOYW1lID1cbiAgICAgICAgICAgICAgICAgIF90aGlzLm5vcm1hbGl6ZU1vZHVsZU5hbWUobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvblsnbW9kdWxlJ10pO1xuICAgICAgICAgICAgICBsZXQgcmVmZXJlbmNlTW9kdWxlID0gX3RoaXMuZ2V0TW9kdWxlTWV0YWRhdGEocmVmZXJlbmNlTW9kdWxlTmFtZSk7XG4gICAgICAgICAgICAgIGxldCByZWZlcmVuY2VWYWx1ZSA9IHJlZmVyZW5jZU1vZHVsZVsnbWV0YWRhdGEnXVtleHByZXNzaW9uWyduYW1lJ11dO1xuICAgICAgICAgICAgICBpZiAoaXNDbGFzc01ldGFkYXRhKHJlZmVyZW5jZVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdG8gYSBwc2V1ZG8gdHlwZVxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRTdGF0aWNUeXBlKHJlZmVyZW5jZU1vZHVsZU5hbWUsIGV4cHJlc3Npb25bJ25hbWUnXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnNpbXBsaWZ5KHJlZmVyZW5jZU1vZHVsZU5hbWUsIHJlZmVyZW5jZVZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgXCJjYWxsXCI6XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChleHByZXNzaW9uLCAodmFsdWUsIG5hbWUpID0+IHsgcmVzdWx0W25hbWVdID0gc2ltcGxpZnkodmFsdWUpOyB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBzaW1wbGlmeSh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TW9kdWxlTWV0YWRhdGEobW9kdWxlOiBzdHJpbmcpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgbGV0IG1vZHVsZU1ldGFkYXRhID0gdGhpcy5tZXRhZGF0YUNhY2hlLmdldChtb2R1bGUpO1xuICAgIGlmICghaXNQcmVzZW50KG1vZHVsZU1ldGFkYXRhKSkge1xuICAgICAgbW9kdWxlTWV0YWRhdGEgPSB0aGlzLmhvc3QuZ2V0TWV0YWRhdGFGb3IobW9kdWxlKTtcbiAgICAgIGlmICghaXNQcmVzZW50KG1vZHVsZU1ldGFkYXRhKSkge1xuICAgICAgICBtb2R1bGVNZXRhZGF0YSA9IHtfX3N5bWJvbGljOiBcIm1vZHVsZVwiLCBtb2R1bGU6IG1vZHVsZSwgbWV0YWRhdGE6IHt9fTtcbiAgICAgIH1cbiAgICAgIHRoaXMubWV0YWRhdGFDYWNoZS5zZXQobW9kdWxlLCBtb2R1bGVNZXRhZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBtb2R1bGVNZXRhZGF0YTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VHlwZU1ldGFkYXRhKHR5cGU6IFN0YXRpY1R5cGUpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgbGV0IG1vZHVsZU1ldGFkYXRhID0gdGhpcy5nZXRNb2R1bGVNZXRhZGF0YSh0eXBlLm1vZHVsZUlkKTtcbiAgICBsZXQgcmVzdWx0ID0gbW9kdWxlTWV0YWRhdGFbJ21ldGFkYXRhJ11bdHlwZS5uYW1lXTtcbiAgICBpZiAoIWlzUHJlc2VudChyZXN1bHQpKSB7XG4gICAgICByZXN1bHQgPSB7X19zeW1ib2xpYzogXCJjbGFzc1wifTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgbm9ybWFsaXplTW9kdWxlTmFtZShmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh0by5zdGFydHNXaXRoKCcuJykpIHtcbiAgICAgIHJldHVybiBwYXRoVG8oZnJvbSwgdG8pO1xuICAgIH1cbiAgICByZXR1cm4gdG87XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNNZXRhZGF0YVN5bWJvbGljQ2FsbEV4cHJlc3Npb24oZXhwcmVzc2lvbjogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAhaXNQcmltaXRpdmUoZXhwcmVzc2lvbikgJiYgIWlzQXJyYXkoZXhwcmVzc2lvbikgJiYgZXhwcmVzc2lvblsnX19zeW1ib2xpYyddID09ICdjYWxsJztcbn1cblxuZnVuY3Rpb24gaXNNZXRhZGF0YVN5bWJvbGljUmVmZXJlbmNlRXhwcmVzc2lvbihleHByZXNzaW9uOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuICFpc1ByaW1pdGl2ZShleHByZXNzaW9uKSAmJiAhaXNBcnJheShleHByZXNzaW9uKSAmJlxuICAgICAgICAgZXhwcmVzc2lvblsnX19zeW1ib2xpYyddID09ICdyZWZlcmVuY2UnO1xufVxuXG5mdW5jdGlvbiBpc0NsYXNzTWV0YWRhdGEoZXhwcmVzc2lvbjogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAhaXNQcmltaXRpdmUoZXhwcmVzc2lvbikgJiYgIWlzQXJyYXkoZXhwcmVzc2lvbikgJiYgZXhwcmVzc2lvblsnX19zeW1ib2xpYyddID09ICdjbGFzcyc7XG59XG5cbmZ1bmN0aW9uIHNwbGl0UGF0aChwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBwYXRoLnNwbGl0KC9cXC98XFxcXC9nKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVBhdGgocGF0aFBhcnRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGxldCByZXN1bHQgPSBbXTtcbiAgTGlzdFdyYXBwZXIuZm9yRWFjaFdpdGhJbmRleChwYXRoUGFydHMsIChwYXJ0LCBpbmRleCkgPT4ge1xuICAgIHN3aXRjaCAocGFydCkge1xuICAgICAgY2FzZSAnJzpcbiAgICAgIGNhc2UgJy4nOlxuICAgICAgICBpZiAoaW5kZXggPiAwKSByZXR1cm47XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnLi4nOlxuICAgICAgICBpZiAoaW5kZXggPiAwICYmIHJlc3VsdC5sZW5ndGggIT0gMCkgcmVzdWx0LnBvcCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKHBhcnQpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcvJyk7XG59XG5cbmZ1bmN0aW9uIHBhdGhUbyhmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgcmVzdWx0ID0gdG87XG4gIGlmICh0by5zdGFydHNXaXRoKCcuJykpIHtcbiAgICBsZXQgZnJvbVBhcnRzID0gc3BsaXRQYXRoKGZyb20pO1xuICAgIGZyb21QYXJ0cy5wb3AoKTsgIC8vIHJlbW92ZSB0aGUgZmlsZSBuYW1lLlxuICAgIGxldCB0b1BhcnRzID0gc3BsaXRQYXRoKHRvKTtcbiAgICByZXN1bHQgPSByZXNvbHZlUGF0aChmcm9tUGFydHMuY29uY2F0KHRvUGFydHMpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19