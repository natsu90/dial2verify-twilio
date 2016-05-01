import { Type } from 'angular2/src/facade/lang';
export function hasLifecycleHook(name, obj) {
    let type = obj.constructor;
    if (!(type instanceof Type))
        return false;
    return name in type.prototype;
}
