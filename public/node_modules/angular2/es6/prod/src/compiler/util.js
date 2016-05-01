import { IS_DART, StringWrapper } from 'angular2/src/facade/lang';
export var MODULE_SUFFIX = IS_DART ? '.dart' : '';
var CAMEL_CASE_REGEXP = /([A-Z])/g;
var DASH_CASE_REGEXP = /-([a-z])/g;
export function camelCaseToDashCase(input) {
    return StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, (m) => { return '-' + m[1].toLowerCase(); });
}
export function dashCaseToCamelCase(input) {
    return StringWrapper.replaceAllMapped(input, DASH_CASE_REGEXP, (m) => { return m[1].toUpperCase(); });
}
export function splitAtColon(input, defaultValues) {
    var parts = StringWrapper.split(input.trim(), /\s*:\s*/g);
    if (parts.length > 1) {
        return parts;
    }
    else {
        return defaultValues;
    }
}
export function sanitizeIdentifier(name) {
    return StringWrapper.replaceAll(name, /\W/g, '_');
}
