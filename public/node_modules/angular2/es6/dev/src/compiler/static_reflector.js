import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { isArray, isPresent, isPrimitive } from 'angular2/src/facade/lang';
import { AttributeMetadata, DirectiveMetadata, ComponentMetadata, ContentChildrenMetadata, ContentChildMetadata, InputMetadata, HostBindingMetadata, HostListenerMetadata, OutputMetadata, PipeMetadata, ViewMetadata, ViewChildMetadata, ViewChildrenMetadata, ViewQueryMetadata, QueryMetadata } from 'angular2/src/core/metadata';
/**
 * A token representing the a reference to a static type.
 *
 * This token is unique for a moduleId and name and can be used as a hash table key.
 */
export class StaticType {
    constructor(moduleId, name) {
        this.moduleId = moduleId;
        this.name = name;
    }
}
/**
 * A static reflector implements enough of the Reflector API that is necessary to compile
 * templates statically.
 */
export class StaticReflector {
    constructor(host) {
        this.host = host;
        this.typeCache = new Map();
        this.annotationCache = new Map();
        this.propertyCache = new Map();
        this.parameterCache = new Map();
        this.metadataCache = new Map();
        this.conversionMap = new Map();
        this.initializeConversionMap();
    }
    importUri(typeOrFunc) { return typeOrFunc.moduleId; }
    /**
     * getStatictype produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param moduleId the module identifier as would be passed to an import statement.
     * @param name the name of the type.
     */
    getStaticType(moduleId, name) {
        let key = `"${moduleId}".${name}`;
        let result = this.typeCache.get(key);
        if (!isPresent(result)) {
            result = new StaticType(moduleId, name);
            this.typeCache.set(key, result);
        }
        return result;
    }
    annotations(type) {
        let annotations = this.annotationCache.get(type);
        if (!isPresent(annotations)) {
            let classMetadata = this.getTypeMetadata(type);
            if (isPresent(classMetadata['decorators'])) {
                annotations = classMetadata['decorators']
                    .map(decorator => this.convertKnownDecorator(type.moduleId, decorator))
                    .filter(decorator => isPresent(decorator));
            }
            else {
                annotations = [];
            }
            this.annotationCache.set(type, annotations);
        }
        return annotations;
    }
    propMetadata(type) {
        let propMetadata = this.propertyCache.get(type);
        if (!isPresent(propMetadata)) {
            let classMetadata = this.getTypeMetadata(type);
            propMetadata = this.getPropertyMetadata(type.moduleId, classMetadata['members']);
            if (!isPresent(propMetadata)) {
                propMetadata = {};
            }
            this.propertyCache.set(type, propMetadata);
        }
        return propMetadata;
    }
    parameters(type) {
        let parameters = this.parameterCache.get(type);
        if (!isPresent(parameters)) {
            let classMetadata = this.getTypeMetadata(type);
            if (isPresent(classMetadata)) {
                let members = classMetadata['members'];
                if (isPresent(members)) {
                    let ctorData = members['__ctor__'];
                    if (isPresent(ctorData)) {
                        let ctor = ctorData.find(a => a['__symbolic'] === 'constructor');
                        parameters = this.simplify(type.moduleId, ctor['parameters']);
                    }
                }
            }
            if (!isPresent(parameters)) {
                parameters = [];
            }
            this.parameterCache.set(type, parameters);
        }
        return parameters;
    }
    initializeConversionMap() {
        let core_metadata = 'angular2/src/core/metadata';
        let conversionMap = this.conversionMap;
        conversionMap.set(this.getStaticType(core_metadata, 'Directive'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            if (!isPresent(p0)) {
                p0 = {};
            }
            return new DirectiveMetadata({
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
        conversionMap.set(this.getStaticType(core_metadata, 'Component'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            if (!isPresent(p0)) {
                p0 = {};
            }
            return new ComponentMetadata({
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
        conversionMap.set(this.getStaticType(core_metadata, 'Input'), (moduleContext, expression) => new InputMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'Output'), (moduleContext, expression) => new OutputMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'View'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            if (!isPresent(p0)) {
                p0 = {};
            }
            return new ViewMetadata({
                templateUrl: p0['templateUrl'],
                template: p0['template'],
                directives: p0['directives'],
                pipes: p0['pipes'],
                encapsulation: p0['encapsulation'],
                styles: p0['styles'],
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'Attribute'), (moduleContext, expression) => new AttributeMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'Query'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            let p1 = this.getDecoratorParameter(moduleContext, expression, 1);
            if (!isPresent(p1)) {
                p1 = {};
            }
            return new QueryMetadata(p0, { descendants: p1.descendants, first: p1.first });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'ContentChildren'), (moduleContext, expression) => new ContentChildrenMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'ContentChild'), (moduleContext, expression) => new ContentChildMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'ViewChildren'), (moduleContext, expression) => new ViewChildrenMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'ViewChild'), (moduleContext, expression) => new ViewChildMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'ViewQuery'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            let p1 = this.getDecoratorParameter(moduleContext, expression, 1);
            if (!isPresent(p1)) {
                p1 = {};
            }
            return new ViewQueryMetadata(p0, {
                descendants: p1['descendants'],
                first: p1['first'],
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'Pipe'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            if (!isPresent(p0)) {
                p0 = {};
            }
            return new PipeMetadata({
                name: p0['name'],
                pure: p0['pure'],
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'HostBinding'), (moduleContext, expression) => new HostBindingMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'HostListener'), (moduleContext, expression) => new HostListenerMetadata(this.getDecoratorParameter(moduleContext, expression, 0), this.getDecoratorParameter(moduleContext, expression, 1)));
        return null;
    }
    convertKnownDecorator(moduleContext, expression) {
        let converter = this.conversionMap.get(this.getDecoratorType(moduleContext, expression));
        if (isPresent(converter))
            return converter(moduleContext, expression);
        return null;
    }
    getDecoratorType(moduleContext, expression) {
        if (isMetadataSymbolicCallExpression(expression)) {
            let target = expression['expression'];
            if (isMetadataSymbolicReferenceExpression(target)) {
                let moduleId = this.normalizeModuleName(moduleContext, target['module']);
                return this.getStaticType(moduleId, target['name']);
            }
        }
        return null;
    }
    getDecoratorParameter(moduleContext, expression, index) {
        if (isMetadataSymbolicCallExpression(expression) && isPresent(expression['arguments']) &&
            expression['arguments'].length <= index + 1) {
            return this.simplify(moduleContext, expression['arguments'][index]);
        }
        return null;
    }
    getPropertyMetadata(moduleContext, value) {
        if (isPresent(value)) {
            let result = {};
            StringMapWrapper.forEach(value, (value, name) => {
                let data = this.getMemberData(moduleContext, value);
                if (isPresent(data)) {
                    let propertyData = data.filter(d => d['kind'] == "property")
                        .map(d => d['directives'])
                        .reduce((p, c) => p.concat(c), []);
                    if (propertyData.length != 0) {
                        StringMapWrapper.set(result, name, propertyData);
                    }
                }
            });
            return result;
        }
        return {};
    }
    // clang-format off
    getMemberData(moduleContext, member) {
        // clang-format on
        let result = [];
        if (isPresent(member)) {
            for (let item of member) {
                result.push({
                    kind: item['__symbolic'],
                    directives: isPresent(item['decorators']) ?
                        item['decorators']
                            .map(decorator => this.convertKnownDecorator(moduleContext, decorator))
                            .filter(d => isPresent(d)) :
                        null
                });
            }
        }
        return result;
    }
    /** @internal */
    simplify(moduleContext, value) {
        let _this = this;
        function simplify(expression) {
            if (isPrimitive(expression)) {
                return expression;
            }
            if (isArray(expression)) {
                let result = [];
                for (let item of expression) {
                    result.push(simplify(item));
                }
                return result;
            }
            if (isPresent(expression)) {
                if (isPresent(expression['__symbolic'])) {
                    switch (expression['__symbolic']) {
                        case "binop":
                            let left = simplify(expression['left']);
                            let right = simplify(expression['right']);
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
                            let operand = simplify(expression['operand']);
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
                            let indexTarget = simplify(expression['expression']);
                            let index = simplify(expression['index']);
                            if (isPresent(indexTarget) && isPrimitive(index))
                                return indexTarget[index];
                            return null;
                        case "select":
                            let selectTarget = simplify(expression['expression']);
                            let member = simplify(expression['member']);
                            if (isPresent(selectTarget) && isPrimitive(member))
                                return selectTarget[member];
                            return null;
                        case "reference":
                            let referenceModuleName = _this.normalizeModuleName(moduleContext, expression['module']);
                            let referenceModule = _this.getModuleMetadata(referenceModuleName);
                            let referenceValue = referenceModule['metadata'][expression['name']];
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
                let result = {};
                StringMapWrapper.forEach(expression, (value, name) => { result[name] = simplify(value); });
                return result;
            }
            return null;
        }
        return simplify(value);
    }
    getModuleMetadata(module) {
        let moduleMetadata = this.metadataCache.get(module);
        if (!isPresent(moduleMetadata)) {
            moduleMetadata = this.host.getMetadataFor(module);
            if (!isPresent(moduleMetadata)) {
                moduleMetadata = { __symbolic: "module", module: module, metadata: {} };
            }
            this.metadataCache.set(module, moduleMetadata);
        }
        return moduleMetadata;
    }
    getTypeMetadata(type) {
        let moduleMetadata = this.getModuleMetadata(type.moduleId);
        let result = moduleMetadata['metadata'][type.name];
        if (!isPresent(result)) {
            result = { __symbolic: "class" };
        }
        return result;
    }
    normalizeModuleName(from, to) {
        if (to.startsWith('.')) {
            return pathTo(from, to);
        }
        return to;
    }
}
function isMetadataSymbolicCallExpression(expression) {
    return !isPrimitive(expression) && !isArray(expression) && expression['__symbolic'] == 'call';
}
function isMetadataSymbolicReferenceExpression(expression) {
    return !isPrimitive(expression) && !isArray(expression) &&
        expression['__symbolic'] == 'reference';
}
function isClassMetadata(expression) {
    return !isPrimitive(expression) && !isArray(expression) && expression['__symbolic'] == 'class';
}
function splitPath(path) {
    return path.split(/\/|\\/g);
}
function resolvePath(pathParts) {
    let result = [];
    ListWrapper.forEachWithIndex(pathParts, (part, index) => {
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
    let result = to;
    if (to.startsWith('.')) {
        let fromParts = splitPath(from);
        fromParts.pop(); // remove the file name.
        let toParts = splitPath(to);
        result = resolvePath(fromParts.concat(toParts));
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3JlZmxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9zdGF0aWNfcmVmbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BQ3JFLEVBQ0wsT0FBTyxFQUdQLFNBQVMsRUFDVCxXQUFXLEVBR1osTUFBTSwwQkFBMEI7T0FDMUIsRUFDTCxpQkFBaUIsRUFDakIsaUJBQWlCLEVBQ2pCLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsb0JBQW9CLEVBQ3BCLGFBQWEsRUFDYixtQkFBbUIsRUFDbkIsb0JBQW9CLEVBQ3BCLGNBQWMsRUFDZCxZQUFZLEVBQ1osWUFBWSxFQUNaLGlCQUFpQixFQUNqQixvQkFBb0IsRUFDcEIsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDZCxNQUFNLDRCQUE0QjtBQW9CbkM7Ozs7R0FJRztBQUNIO0lBQ0UsWUFBbUIsUUFBZ0IsRUFBUyxJQUFZO1FBQXJDLGFBQVEsR0FBUixRQUFRLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO0lBQUcsQ0FBQztBQUM5RCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0g7SUFNRSxZQUFvQixJQUF5QjtRQUF6QixTQUFJLEdBQUosSUFBSSxDQUFxQjtRQUxyQyxjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7UUFDMUMsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQztRQUMvQyxrQkFBYSxHQUFHLElBQUksR0FBRyxFQUFvQyxDQUFDO1FBQzVELG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUM7UUFDOUMsa0JBQWEsR0FBRyxJQUFJLEdBQUcsRUFBZ0MsQ0FBQztRQXlFeEQsa0JBQWEsR0FBRyxJQUFJLEdBQUcsRUFBK0QsQ0FBQztRQXhFOUMs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QUM7UUFDdkIsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFFLHdCQUF3QjtRQUMxQyxJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUIsTUFBTSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdFdyYXBwZXIsIFN0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1xuICBpc0FycmF5LFxuICBpc0JsYW5rLFxuICBpc051bWJlcixcbiAgaXNQcmVzZW50LFxuICBpc1ByaW1pdGl2ZSxcbiAgaXNTdHJpbmcsXG4gIFR5cGVcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7XG4gIEF0dHJpYnV0ZU1ldGFkYXRhLFxuICBEaXJlY3RpdmVNZXRhZGF0YSxcbiAgQ29tcG9uZW50TWV0YWRhdGEsXG4gIENvbnRlbnRDaGlsZHJlbk1ldGFkYXRhLFxuICBDb250ZW50Q2hpbGRNZXRhZGF0YSxcbiAgSW5wdXRNZXRhZGF0YSxcbiAgSG9zdEJpbmRpbmdNZXRhZGF0YSxcbiAgSG9zdExpc3RlbmVyTWV0YWRhdGEsXG4gIE91dHB1dE1ldGFkYXRhLFxuICBQaXBlTWV0YWRhdGEsXG4gIFZpZXdNZXRhZGF0YSxcbiAgVmlld0NoaWxkTWV0YWRhdGEsXG4gIFZpZXdDaGlsZHJlbk1ldGFkYXRhLFxuICBWaWV3UXVlcnlNZXRhZGF0YSxcbiAgUXVlcnlNZXRhZGF0YSxcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEnO1xuaW1wb3J0IHtSZWZsZWN0b3JSZWFkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdG9yX3JlYWRlcic7XG5cbi8qKlxuICogVGhlIGhvc3Qgb2YgdGhlIHN0YXRpYyByZXNvbHZlciBpcyBleHBlY3RlZCB0byBiZSBhYmxlIHRvIHByb3ZpZGUgbW9kdWxlIG1ldGFkYXRhIGluIHRoZSBmb3JtIG9mXG4gKiBNb2R1bGVNZXRhZGF0YS4gQW5ndWxhciAyIENMSSB3aWxsIHByb2R1Y2UgdGhpcyBtZXRhZGF0YSBmb3IgYSBtb2R1bGUgd2hlbmV2ZXIgYSAuZC50cyBmaWxlcyBpc1xuICogcHJvZHVjZWQgYW5kIHRoZSBtb2R1bGUgaGFzIGV4cG9ydGVkIHZhcmlhYmxlcyBvciBjbGFzc2VzIHdpdGggZGVjb3JhdG9ycy4gTW9kdWxlIG1ldGFkYXRhIGNhblxuICogYWxzbyBiZSBwcm9kdWNlZCBkaXJlY3RseSBmcm9tIFR5cGVTY3JpcHQgc291cmNlcyBieSB1c2luZyBNZXRhZGF0YUNvbGxlY3RvciBpbiB0b29scy9tZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdGF0aWNSZWZsZWN0b3JIb3N0IHtcbiAgLyoqXG4gICAqICBSZXR1cm4gYSBNb2R1bGVNZXRhZGF0YSBmb3IgdGhlIGdpdmUgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0gbW9kdWxlSWQgaXMgYSBzdHJpbmcgaWRlbnRpZmllciBmb3IgYSBtb2R1bGUgaW4gdGhlIGZvcm0gdGhhdCB3b3VsZCBleHBlY3RlZCBpbiBhXG4gICAqICAgICAgICAgICAgICAgICBtb2R1bGUgaW1wb3J0IG9mIGFuIGltcG9ydCBzdGF0ZW1lbnQuXG4gICAqIEByZXR1cm5zIHRoZSBtZXRhZGF0YSBmb3IgdGhlIGdpdmVuIG1vZHVsZS5cbiAgICovXG4gIGdldE1ldGFkYXRhRm9yKG1vZHVsZUlkOiBzdHJpbmcpOiB7W2tleTogc3RyaW5nXTogYW55fTtcbn1cblxuLyoqXG4gKiBBIHRva2VuIHJlcHJlc2VudGluZyB0aGUgYSByZWZlcmVuY2UgdG8gYSBzdGF0aWMgdHlwZS5cbiAqXG4gKiBUaGlzIHRva2VuIGlzIHVuaXF1ZSBmb3IgYSBtb2R1bGVJZCBhbmQgbmFtZSBhbmQgY2FuIGJlIHVzZWQgYXMgYSBoYXNoIHRhYmxlIGtleS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRpY1R5cGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbW9kdWxlSWQ6IHN0cmluZywgcHVibGljIG5hbWU6IHN0cmluZykge31cbn1cblxuLyoqXG4gKiBBIHN0YXRpYyByZWZsZWN0b3IgaW1wbGVtZW50cyBlbm91Z2ggb2YgdGhlIFJlZmxlY3RvciBBUEkgdGhhdCBpcyBuZWNlc3NhcnkgdG8gY29tcGlsZVxuICogdGVtcGxhdGVzIHN0YXRpY2FsbHkuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0aWNSZWZsZWN0b3IgaW1wbGVtZW50cyBSZWZsZWN0b3JSZWFkZXIge1xuICBwcml2YXRlIHR5cGVDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBTdGF0aWNUeXBlPigpO1xuICBwcml2YXRlIGFubm90YXRpb25DYWNoZSA9IG5ldyBNYXA8U3RhdGljVHlwZSwgYW55W10+KCk7XG4gIHByaXZhdGUgcHJvcGVydHlDYWNoZSA9IG5ldyBNYXA8U3RhdGljVHlwZSwge1trZXk6IHN0cmluZ106IGFueX0+KCk7XG4gIHByaXZhdGUgcGFyYW1ldGVyQ2FjaGUgPSBuZXcgTWFwPFN0YXRpY1R5cGUsIGFueVtdPigpO1xuICBwcml2YXRlIG1ldGFkYXRhQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywge1trZXk6IHN0cmluZ106IGFueX0+KCk7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaG9zdDogU3RhdGljUmVmbGVjdG9ySG9zdCkgeyB0aGlzLmluaXRpYWxpemVDb252ZXJzaW9uTWFwKCk7IH1cblxuICBpbXBvcnRVcmkodHlwZU9yRnVuYzogYW55KTogc3RyaW5nIHsgcmV0dXJuICg8U3RhdGljVHlwZT50eXBlT3JGdW5jKS5tb2R1bGVJZDsgfVxuXG4gIC8qKlxuICAgKiBnZXRTdGF0aWN0eXBlIHByb2R1Y2VzIGEgVHlwZSB3aG9zZSBtZXRhZGF0YSBpcyBrbm93biBidXQgd2hvc2UgaW1wbGVtZW50YXRpb24gaXMgbm90IGxvYWRlZC5cbiAgICogQWxsIHR5cGVzIHBhc3NlZCB0byB0aGUgU3RhdGljUmVzb2x2ZXIgc2hvdWxkIGJlIHBzZXVkby10eXBlcyByZXR1cm5lZCBieSB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIG1vZHVsZUlkIHRoZSBtb2R1bGUgaWRlbnRpZmllciBhcyB3b3VsZCBiZSBwYXNzZWQgdG8gYW4gaW1wb3J0IHN0YXRlbWVudC5cbiAgICogQHBhcmFtIG5hbWUgdGhlIG5hbWUgb2YgdGhlIHR5cGUuXG4gICAqL1xuICBwdWJsaWMgZ2V0U3RhdGljVHlwZShtb2R1bGVJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBTdGF0aWNUeXBlIHtcbiAgICBsZXQga2V5ID0gYFwiJHttb2R1bGVJZH1cIi4ke25hbWV9YDtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy50eXBlQ2FjaGUuZ2V0KGtleSk7XG4gICAgaWYgKCFpc1ByZXNlbnQocmVzdWx0KSkge1xuICAgICAgcmVzdWx0ID0gbmV3IFN0YXRpY1R5cGUobW9kdWxlSWQsIG5hbWUpO1xuICAgICAgdGhpcy50eXBlQ2FjaGUuc2V0KGtleSwgcmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBhbm5vdGF0aW9ucyh0eXBlOiBTdGF0aWNUeXBlKTogYW55W10ge1xuICAgIGxldCBhbm5vdGF0aW9ucyA9IHRoaXMuYW5ub3RhdGlvbkNhY2hlLmdldCh0eXBlKTtcbiAgICBpZiAoIWlzUHJlc2VudChhbm5vdGF0aW9ucykpIHtcbiAgICAgIGxldCBjbGFzc01ldGFkYXRhID0gdGhpcy5nZXRUeXBlTWV0YWRhdGEodHlwZSk7XG4gICAgICBpZiAoaXNQcmVzZW50KGNsYXNzTWV0YWRhdGFbJ2RlY29yYXRvcnMnXSkpIHtcbiAgICAgICAgYW5ub3RhdGlvbnMgPSAoPGFueVtdPmNsYXNzTWV0YWRhdGFbJ2RlY29yYXRvcnMnXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChkZWNvcmF0b3IgPT4gdGhpcy5jb252ZXJ0S25vd25EZWNvcmF0b3IodHlwZS5tb2R1bGVJZCwgZGVjb3JhdG9yKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihkZWNvcmF0b3IgPT4gaXNQcmVzZW50KGRlY29yYXRvcikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW5ub3RhdGlvbnMgPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYW5ub3RhdGlvbkNhY2hlLnNldCh0eXBlLCBhbm5vdGF0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiBhbm5vdGF0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBwcm9wTWV0YWRhdGEodHlwZTogU3RhdGljVHlwZSk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgICBsZXQgcHJvcE1ldGFkYXRhID0gdGhpcy5wcm9wZXJ0eUNhY2hlLmdldCh0eXBlKTtcbiAgICBpZiAoIWlzUHJlc2VudChwcm9wTWV0YWRhdGEpKSB7XG4gICAgICBsZXQgY2xhc3NNZXRhZGF0YSA9IHRoaXMuZ2V0VHlwZU1ldGFkYXRhKHR5cGUpO1xuICAgICAgcHJvcE1ldGFkYXRhID0gdGhpcy5nZXRQcm9wZXJ0eU1ldGFkYXRhKHR5cGUubW9kdWxlSWQsIGNsYXNzTWV0YWRhdGFbJ21lbWJlcnMnXSk7XG4gICAgICBpZiAoIWlzUHJlc2VudChwcm9wTWV0YWRhdGEpKSB7XG4gICAgICAgIHByb3BNZXRhZGF0YSA9IHt9O1xuICAgICAgfVxuICAgICAgdGhpcy5wcm9wZXJ0eUNhY2hlLnNldCh0eXBlLCBwcm9wTWV0YWRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcE1ldGFkYXRhO1xuICB9XG5cbiAgcHVibGljIHBhcmFtZXRlcnModHlwZTogU3RhdGljVHlwZSk6IGFueVtdIHtcbiAgICBsZXQgcGFyYW1ldGVycyA9IHRoaXMucGFyYW1ldGVyQ2FjaGUuZ2V0KHR5cGUpO1xuICAgIGlmICghaXNQcmVzZW50KHBhcmFtZXRlcnMpKSB7XG4gICAgICBsZXQgY2xhc3NNZXRhZGF0YSA9IHRoaXMuZ2V0VHlwZU1ldGFkYXRhKHR5cGUpO1xuICAgICAgaWYgKGlzUHJlc2VudChjbGFzc01ldGFkYXRhKSkge1xuICAgICAgICBsZXQgbWVtYmVycyA9IGNsYXNzTWV0YWRhdGFbJ21lbWJlcnMnXTtcbiAgICAgICAgaWYgKGlzUHJlc2VudChtZW1iZXJzKSkge1xuICAgICAgICAgIGxldCBjdG9yRGF0YSA9IG1lbWJlcnNbJ19fY3Rvcl9fJ107XG4gICAgICAgICAgaWYgKGlzUHJlc2VudChjdG9yRGF0YSkpIHtcbiAgICAgICAgICAgIGxldCBjdG9yID0gKDxhbnlbXT5jdG9yRGF0YSkuZmluZChhID0+IGFbJ19fc3ltYm9saWMnXSA9PT0gJ2NvbnN0cnVjdG9yJyk7XG4gICAgICAgICAgICBwYXJhbWV0ZXJzID0gdGhpcy5zaW1wbGlmeSh0eXBlLm1vZHVsZUlkLCBjdG9yWydwYXJhbWV0ZXJzJ10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFpc1ByZXNlbnQocGFyYW1ldGVycykpIHtcbiAgICAgICAgcGFyYW1ldGVycyA9IFtdO1xuICAgICAgfVxuICAgICAgdGhpcy5wYXJhbWV0ZXJDYWNoZS5zZXQodHlwZSwgcGFyYW1ldGVycyk7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbWV0ZXJzO1xuICB9XG5cbiAgcHJpdmF0ZSBjb252ZXJzaW9uTWFwID0gbmV3IE1hcDxTdGF0aWNUeXBlLCAobW9kdWxlQ29udGV4dDogc3RyaW5nLCBleHByZXNzaW9uOiBhbnkpID0+IGFueT4oKTtcbiAgcHJpdmF0ZSBpbml0aWFsaXplQ29udmVyc2lvbk1hcCgpOiBhbnkge1xuICAgIGxldCBjb3JlX21ldGFkYXRhID0gJ2FuZ3VsYXIyL3NyYy9jb3JlL21ldGFkYXRhJztcbiAgICBsZXQgY29udmVyc2lvbk1hcCA9IHRoaXMuY29udmVyc2lvbk1hcDtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ0RpcmVjdGl2ZScpLFxuICAgICAgICAgICAgICAgICAgICAgIChtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcDAgPSB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNQcmVzZW50KHAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwMCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEaXJlY3RpdmVNZXRhZGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwMFsnc2VsZWN0b3InXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBwMFsnaW5wdXRzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IHAwWydvdXRwdXRzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czogcDBbJ2V2ZW50cyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBob3N0OiBwMFsnaG9zdCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kaW5nczogcDBbJ2JpbmRpbmdzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyczogcDBbJ3Byb3ZpZGVycyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRBczogcDBbJ2V4cG9ydEFzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJpZXM6IHAwWydxdWVyaWVzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ0NvbXBvbmVudCcpLFxuICAgICAgICAgICAgICAgICAgICAgIChtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcDAgPSB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNQcmVzZW50KHAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwMCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb21wb25lbnRNZXRhZGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwMFsnc2VsZWN0b3InXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBwMFsnaW5wdXRzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IHAwWydvdXRwdXRzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHAwWydwcm9wZXJ0aWVzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czogcDBbJ2V2ZW50cyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBob3N0OiBwMFsnaG9zdCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRBczogcDBbJ2V4cG9ydEFzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZUlkOiBwMFsnbW9kdWxlSWQnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGluZ3M6IHAwWydiaW5kaW5ncyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IHAwWydwcm92aWRlcnMnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld0JpbmRpbmdzOiBwMFsndmlld0JpbmRpbmdzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdQcm92aWRlcnM6IHAwWyd2aWV3UHJvdmlkZXJzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZURldGVjdGlvbjogcDBbJ2NoYW5nZURldGVjdGlvbiddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyaWVzOiBwMFsncXVlcmllcyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogcDBbJ3RlbXBsYXRlVXJsJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBwMFsndGVtcGxhdGUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVVcmxzOiBwMFsnc3R5bGVVcmxzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlczogcDBbJ3N0eWxlcyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBwMFsnZGlyZWN0aXZlcyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwaXBlczogcDBbJ3BpcGVzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuY2Fwc3VsYXRpb246IHAwWydlbmNhcHN1bGF0aW9uJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnSW5wdXQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IElucHV0TWV0YWRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApKSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdPdXRwdXQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IE91dHB1dE1ldGFkYXRhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKSkpO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnVmlldycpLCAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4ge1xuICAgICAgbGV0IHAwID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCk7XG4gICAgICBpZiAoIWlzUHJlc2VudChwMCkpIHtcbiAgICAgICAgcDAgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgVmlld01ldGFkYXRhKHtcbiAgICAgICAgdGVtcGxhdGVVcmw6IHAwWyd0ZW1wbGF0ZVVybCddLFxuICAgICAgICB0ZW1wbGF0ZTogcDBbJ3RlbXBsYXRlJ10sXG4gICAgICAgIGRpcmVjdGl2ZXM6IHAwWydkaXJlY3RpdmVzJ10sXG4gICAgICAgIHBpcGVzOiBwMFsncGlwZXMnXSxcbiAgICAgICAgZW5jYXBzdWxhdGlvbjogcDBbJ2VuY2Fwc3VsYXRpb24nXSxcbiAgICAgICAgc3R5bGVzOiBwMFsnc3R5bGVzJ10sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ0F0dHJpYnV0ZScpLFxuICAgICAgICAgICAgICAgICAgICAgIChtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSA9PiBuZXcgQXR0cmlidXRlTWV0YWRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApKSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdRdWVyeScpLCAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4ge1xuICAgICAgbGV0IHAwID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCk7XG4gICAgICBsZXQgcDEgPSB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAxKTtcbiAgICAgIGlmICghaXNQcmVzZW50KHAxKSkge1xuICAgICAgICBwMSA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeU1ldGFkYXRhKHAwLCB7ZGVzY2VuZGFudHM6IHAxLmRlc2NlbmRhbnRzLCBmaXJzdDogcDEuZmlyc3R9KTtcbiAgICB9KTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ0NvbnRlbnRDaGlsZHJlbicpLFxuICAgICAgICAgICAgICAgICAgICAgIChtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSA9PiBuZXcgQ29udGVudENoaWxkcmVuTWV0YWRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApKSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdDb250ZW50Q2hpbGQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IENvbnRlbnRDaGlsZE1ldGFkYXRhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKSkpO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnVmlld0NoaWxkcmVuJyksXG4gICAgICAgICAgICAgICAgICAgICAgKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pID0+IG5ldyBWaWV3Q2hpbGRyZW5NZXRhZGF0YShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCkpKTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ1ZpZXdDaGlsZCcpLFxuICAgICAgICAgICAgICAgICAgICAgIChtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSA9PiBuZXcgVmlld0NoaWxkTWV0YWRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApKSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdWaWV3UXVlcnknKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHAwID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcDEgPSB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNQcmVzZW50KHAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwMSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWaWV3UXVlcnlNZXRhZGF0YShwMCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjZW5kYW50czogcDFbJ2Rlc2NlbmRhbnRzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0OiBwMVsnZmlyc3QnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnUGlwZScpLCAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4ge1xuICAgICAgbGV0IHAwID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCk7XG4gICAgICBpZiAoIWlzUHJlc2VudChwMCkpIHtcbiAgICAgICAgcDAgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUGlwZU1ldGFkYXRhKHtcbiAgICAgICAgbmFtZTogcDBbJ25hbWUnXSxcbiAgICAgICAgcHVyZTogcDBbJ3B1cmUnXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnSG9zdEJpbmRpbmcnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IEhvc3RCaW5kaW5nTWV0YWRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApKSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdIb3N0TGlzdGVuZXInKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IEhvc3RMaXN0ZW5lck1ldGFkYXRhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMSkpKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydEtub3duRGVjb3JhdG9yKG1vZHVsZUNvbnRleHQ6IHN0cmluZywgZXhwcmVzc2lvbjoge1trZXk6IHN0cmluZ106IGFueX0pOiBhbnkge1xuICAgIGxldCBjb252ZXJ0ZXIgPSB0aGlzLmNvbnZlcnNpb25NYXAuZ2V0KHRoaXMuZ2V0RGVjb3JhdG9yVHlwZShtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSk7XG4gICAgaWYgKGlzUHJlc2VudChjb252ZXJ0ZXIpKSByZXR1cm4gY29udmVydGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREZWNvcmF0b3JUeXBlKG1vZHVsZUNvbnRleHQ6IHN0cmluZywgZXhwcmVzc2lvbjoge1trZXk6IHN0cmluZ106IGFueX0pOiBTdGF0aWNUeXBlIHtcbiAgICBpZiAoaXNNZXRhZGF0YVN5bWJvbGljQ2FsbEV4cHJlc3Npb24oZXhwcmVzc2lvbikpIHtcbiAgICAgIGxldCB0YXJnZXQgPSBleHByZXNzaW9uWydleHByZXNzaW9uJ107XG4gICAgICBpZiAoaXNNZXRhZGF0YVN5bWJvbGljUmVmZXJlbmNlRXhwcmVzc2lvbih0YXJnZXQpKSB7XG4gICAgICAgIGxldCBtb2R1bGVJZCA9IHRoaXMubm9ybWFsaXplTW9kdWxlTmFtZShtb2R1bGVDb250ZXh0LCB0YXJnZXRbJ21vZHVsZSddKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGljVHlwZShtb2R1bGVJZCwgdGFyZ2V0WyduYW1lJ10pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQ6IHN0cmluZywgZXhwcmVzc2lvbjoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBudW1iZXIpOiBhbnkge1xuICAgIGlmIChpc01ldGFkYXRhU3ltYm9saWNDYWxsRXhwcmVzc2lvbihleHByZXNzaW9uKSAmJiBpc1ByZXNlbnQoZXhwcmVzc2lvblsnYXJndW1lbnRzJ10pICYmXG4gICAgICAgICg8YW55W10+ZXhwcmVzc2lvblsnYXJndW1lbnRzJ10pLmxlbmd0aCA8PSBpbmRleCArIDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnNpbXBsaWZ5KG1vZHVsZUNvbnRleHQsICg8YW55W10+ZXhwcmVzc2lvblsnYXJndW1lbnRzJ10pW2luZGV4XSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQcm9wZXJ0eU1ldGFkYXRhKG1vZHVsZUNvbnRleHQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgICBpZiAoaXNQcmVzZW50KHZhbHVlKSkge1xuICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKHZhbHVlLCAodmFsdWUsIG5hbWUpID0+IHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldE1lbWJlckRhdGEobW9kdWxlQ29udGV4dCwgdmFsdWUpO1xuICAgICAgICBpZiAoaXNQcmVzZW50KGRhdGEpKSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5RGF0YSA9IGRhdGEuZmlsdGVyKGQgPT4gZFsna2luZCddID09IFwicHJvcGVydHlcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZCA9PiBkWydkaXJlY3RpdmVzJ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChwLCBjKSA9PiAoPGFueVtdPnApLmNvbmNhdCg8YW55W10+YyksIFtdKTtcbiAgICAgICAgICBpZiAocHJvcGVydHlEYXRhLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICBTdHJpbmdNYXBXcmFwcGVyLnNldChyZXN1bHQsIG5hbWUsIHByb3BlcnR5RGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8vIGNsYW5nLWZvcm1hdCBvZmZcbiAgcHJpdmF0ZSBnZXRNZW1iZXJEYXRhKG1vZHVsZUNvbnRleHQ6IHN0cmluZywgbWVtYmVyOiB7IFtrZXk6IHN0cmluZ106IGFueSB9W10pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9W10ge1xuICAgIC8vIGNsYW5nLWZvcm1hdCBvblxuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBpZiAoaXNQcmVzZW50KG1lbWJlcikpIHtcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgbWVtYmVyKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBraW5kOiBpdGVtWydfX3N5bWJvbGljJ10sXG4gICAgICAgICAgZGlyZWN0aXZlczpcbiAgICAgICAgICAgICAgaXNQcmVzZW50KGl0ZW1bJ2RlY29yYXRvcnMnXSkgP1xuICAgICAgICAgICAgICAgICAgKDxhbnlbXT5pdGVtWydkZWNvcmF0b3JzJ10pXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcChkZWNvcmF0b3IgPT4gdGhpcy5jb252ZXJ0S25vd25EZWNvcmF0b3IobW9kdWxlQ29udGV4dCwgZGVjb3JhdG9yKSlcbiAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGQgPT4gaXNQcmVzZW50KGQpKSA6XG4gICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgc2ltcGxpZnkobW9kdWxlQ29udGV4dDogc3RyaW5nLCB2YWx1ZTogYW55KTogYW55IHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gc2ltcGxpZnkoZXhwcmVzc2lvbjogYW55KTogYW55IHtcbiAgICAgIGlmIChpc1ByaW1pdGl2ZShleHByZXNzaW9uKSkge1xuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KGV4cHJlc3Npb24pKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZig8YW55PmV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc2ltcGxpZnkoaXRlbSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICBpZiAoaXNQcmVzZW50KGV4cHJlc3Npb24pKSB7XG4gICAgICAgIGlmIChpc1ByZXNlbnQoZXhwcmVzc2lvblsnX19zeW1ib2xpYyddKSkge1xuICAgICAgICAgIHN3aXRjaCAoZXhwcmVzc2lvblsnX19zeW1ib2xpYyddKSB7XG4gICAgICAgICAgICBjYXNlIFwiYmlub3BcIjpcbiAgICAgICAgICAgICAgbGV0IGxlZnQgPSBzaW1wbGlmeShleHByZXNzaW9uWydsZWZ0J10pO1xuICAgICAgICAgICAgICBsZXQgcmlnaHQgPSBzaW1wbGlmeShleHByZXNzaW9uWydyaWdodCddKTtcbiAgICAgICAgICAgICAgc3dpdGNoIChleHByZXNzaW9uWydvcGVyYXRvciddKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnJiYnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgJiYgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnfHwnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgfHwgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCB8IHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgXiByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICYgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPT0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnIT0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgIT0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT09JzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID09PSByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICchPT0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgIT09IHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJzwnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPCByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID4gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPD0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPj0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPj0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPDwnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPDwgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPj4nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPj4gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCArIHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICogcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAvIHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJyUnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGNhc2UgXCJwcmVcIjpcbiAgICAgICAgICAgICAgbGV0IG9wZXJhbmQgPSBzaW1wbGlmeShleHByZXNzaW9uWydvcGVyYW5kJ10pO1xuICAgICAgICAgICAgICBzd2l0Y2ggKGV4cHJlc3Npb25bJ29wZXJhdG9yJ10pIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvcGVyYW5kO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIC1vcGVyYW5kO1xuICAgICAgICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuICFvcGVyYW5kO1xuICAgICAgICAgICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIH5vcGVyYW5kO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY2FzZSBcImluZGV4XCI6XG4gICAgICAgICAgICAgIGxldCBpbmRleFRhcmdldCA9IHNpbXBsaWZ5KGV4cHJlc3Npb25bJ2V4cHJlc3Npb24nXSk7XG4gICAgICAgICAgICAgIGxldCBpbmRleCA9IHNpbXBsaWZ5KGV4cHJlc3Npb25bJ2luZGV4J10pO1xuICAgICAgICAgICAgICBpZiAoaXNQcmVzZW50KGluZGV4VGFyZ2V0KSAmJiBpc1ByaW1pdGl2ZShpbmRleCkpIHJldHVybiBpbmRleFRhcmdldFtpbmRleF07XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY2FzZSBcInNlbGVjdFwiOlxuICAgICAgICAgICAgICBsZXQgc2VsZWN0VGFyZ2V0ID0gc2ltcGxpZnkoZXhwcmVzc2lvblsnZXhwcmVzc2lvbiddKTtcbiAgICAgICAgICAgICAgbGV0IG1lbWJlciA9IHNpbXBsaWZ5KGV4cHJlc3Npb25bJ21lbWJlciddKTtcbiAgICAgICAgICAgICAgaWYgKGlzUHJlc2VudChzZWxlY3RUYXJnZXQpICYmIGlzUHJpbWl0aXZlKG1lbWJlcikpIHJldHVybiBzZWxlY3RUYXJnZXRbbWVtYmVyXTtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjYXNlIFwicmVmZXJlbmNlXCI6XG4gICAgICAgICAgICAgIGxldCByZWZlcmVuY2VNb2R1bGVOYW1lID1cbiAgICAgICAgICAgICAgICAgIF90aGlzLm5vcm1hbGl6ZU1vZHVsZU5hbWUobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvblsnbW9kdWxlJ10pO1xuICAgICAgICAgICAgICBsZXQgcmVmZXJlbmNlTW9kdWxlID0gX3RoaXMuZ2V0TW9kdWxlTWV0YWRhdGEocmVmZXJlbmNlTW9kdWxlTmFtZSk7XG4gICAgICAgICAgICAgIGxldCByZWZlcmVuY2VWYWx1ZSA9IHJlZmVyZW5jZU1vZHVsZVsnbWV0YWRhdGEnXVtleHByZXNzaW9uWyduYW1lJ11dO1xuICAgICAgICAgICAgICBpZiAoaXNDbGFzc01ldGFkYXRhKHJlZmVyZW5jZVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdG8gYSBwc2V1ZG8gdHlwZVxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRTdGF0aWNUeXBlKHJlZmVyZW5jZU1vZHVsZU5hbWUsIGV4cHJlc3Npb25bJ25hbWUnXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnNpbXBsaWZ5KHJlZmVyZW5jZU1vZHVsZU5hbWUsIHJlZmVyZW5jZVZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgXCJjYWxsXCI6XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChleHByZXNzaW9uLCAodmFsdWUsIG5hbWUpID0+IHsgcmVzdWx0W25hbWVdID0gc2ltcGxpZnkodmFsdWUpOyB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBzaW1wbGlmeSh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TW9kdWxlTWV0YWRhdGEobW9kdWxlOiBzdHJpbmcpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgbGV0IG1vZHVsZU1ldGFkYXRhID0gdGhpcy5tZXRhZGF0YUNhY2hlLmdldChtb2R1bGUpO1xuICAgIGlmICghaXNQcmVzZW50KG1vZHVsZU1ldGFkYXRhKSkge1xuICAgICAgbW9kdWxlTWV0YWRhdGEgPSB0aGlzLmhvc3QuZ2V0TWV0YWRhdGFGb3IobW9kdWxlKTtcbiAgICAgIGlmICghaXNQcmVzZW50KG1vZHVsZU1ldGFkYXRhKSkge1xuICAgICAgICBtb2R1bGVNZXRhZGF0YSA9IHtfX3N5bWJvbGljOiBcIm1vZHVsZVwiLCBtb2R1bGU6IG1vZHVsZSwgbWV0YWRhdGE6IHt9fTtcbiAgICAgIH1cbiAgICAgIHRoaXMubWV0YWRhdGFDYWNoZS5zZXQobW9kdWxlLCBtb2R1bGVNZXRhZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBtb2R1bGVNZXRhZGF0YTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VHlwZU1ldGFkYXRhKHR5cGU6IFN0YXRpY1R5cGUpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgbGV0IG1vZHVsZU1ldGFkYXRhID0gdGhpcy5nZXRNb2R1bGVNZXRhZGF0YSh0eXBlLm1vZHVsZUlkKTtcbiAgICBsZXQgcmVzdWx0ID0gbW9kdWxlTWV0YWRhdGFbJ21ldGFkYXRhJ11bdHlwZS5uYW1lXTtcbiAgICBpZiAoIWlzUHJlc2VudChyZXN1bHQpKSB7XG4gICAgICByZXN1bHQgPSB7X19zeW1ib2xpYzogXCJjbGFzc1wifTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgbm9ybWFsaXplTW9kdWxlTmFtZShmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh0by5zdGFydHNXaXRoKCcuJykpIHtcbiAgICAgIHJldHVybiBwYXRoVG8oZnJvbSwgdG8pO1xuICAgIH1cbiAgICByZXR1cm4gdG87XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNNZXRhZGF0YVN5bWJvbGljQ2FsbEV4cHJlc3Npb24oZXhwcmVzc2lvbjogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAhaXNQcmltaXRpdmUoZXhwcmVzc2lvbikgJiYgIWlzQXJyYXkoZXhwcmVzc2lvbikgJiYgZXhwcmVzc2lvblsnX19zeW1ib2xpYyddID09ICdjYWxsJztcbn1cblxuZnVuY3Rpb24gaXNNZXRhZGF0YVN5bWJvbGljUmVmZXJlbmNlRXhwcmVzc2lvbihleHByZXNzaW9uOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuICFpc1ByaW1pdGl2ZShleHByZXNzaW9uKSAmJiAhaXNBcnJheShleHByZXNzaW9uKSAmJlxuICAgICAgICAgZXhwcmVzc2lvblsnX19zeW1ib2xpYyddID09ICdyZWZlcmVuY2UnO1xufVxuXG5mdW5jdGlvbiBpc0NsYXNzTWV0YWRhdGEoZXhwcmVzc2lvbjogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAhaXNQcmltaXRpdmUoZXhwcmVzc2lvbikgJiYgIWlzQXJyYXkoZXhwcmVzc2lvbikgJiYgZXhwcmVzc2lvblsnX19zeW1ib2xpYyddID09ICdjbGFzcyc7XG59XG5cbmZ1bmN0aW9uIHNwbGl0UGF0aChwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBwYXRoLnNwbGl0KC9cXC98XFxcXC9nKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVBhdGgocGF0aFBhcnRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGxldCByZXN1bHQgPSBbXTtcbiAgTGlzdFdyYXBwZXIuZm9yRWFjaFdpdGhJbmRleChwYXRoUGFydHMsIChwYXJ0LCBpbmRleCkgPT4ge1xuICAgIHN3aXRjaCAocGFydCkge1xuICAgICAgY2FzZSAnJzpcbiAgICAgIGNhc2UgJy4nOlxuICAgICAgICBpZiAoaW5kZXggPiAwKSByZXR1cm47XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnLi4nOlxuICAgICAgICBpZiAoaW5kZXggPiAwICYmIHJlc3VsdC5sZW5ndGggIT0gMCkgcmVzdWx0LnBvcCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKHBhcnQpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcvJyk7XG59XG5cbmZ1bmN0aW9uIHBhdGhUbyhmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgcmVzdWx0ID0gdG87XG4gIGlmICh0by5zdGFydHNXaXRoKCcuJykpIHtcbiAgICBsZXQgZnJvbVBhcnRzID0gc3BsaXRQYXRoKGZyb20pO1xuICAgIGZyb21QYXJ0cy5wb3AoKTsgIC8vIHJlbW92ZSB0aGUgZmlsZSBuYW1lLlxuICAgIGxldCB0b1BhcnRzID0gc3BsaXRQYXRoKHRvKTtcbiAgICByZXN1bHQgPSByZXNvbHZlUGF0aChmcm9tUGFydHMuY29uY2F0KHRvUGFydHMpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19