'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var core_1 = require('angular2/core');
/**
 * `LocationStrategy` is responsible for representing and reading route state
 * from the browser's URL. Angular provides two strategies:
 * {@link HashLocationStrategy} and {@link PathLocationStrategy} (default).
 *
 * This is used under the hood of the {@link Location} service.
 *
 * Applications should use the {@link Router} or {@link Location} services to
 * interact with application route state.
 *
 * For instance, {@link HashLocationStrategy} produces URLs like
 * `http://example.com#/foo`, and {@link PathLocationStrategy} produces
 * `http://example.com/foo` as an equivalent URL.
 *
 * See these two classes for more.
 */
var LocationStrategy = (function () {
    function LocationStrategy() {
    }
    return LocationStrategy;
}());
exports.LocationStrategy = LocationStrategy;
/**
 * The `APP_BASE_HREF` token represents the base href to be used with the
 * {@link PathLocationStrategy}.
 *
 * If you're using {@link PathLocationStrategy}, you must provide a provider to a string
 * representing the URL prefix that should be preserved when generating and recognizing
 * URLs.
 *
 * ### Example
 *
 * ```
 * import {Component} from 'angular2/core';
 * import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from 'angular2/router';
 * import {APP_BASE_HREF} from 'angular2/platform/common';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {...},
 * ])
 * class AppCmp {
 *   // ...
 * }
 *
 * bootstrap(AppCmp, [
 *   ROUTER_PROVIDERS,
 *   provide(APP_BASE_HREF, {useValue: '/my/app'})
 * ]);
 * ```
 */
exports.APP_BASE_HREF = lang_1.CONST_EXPR(new core_1.OpaqueToken('appBaseHref'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb25fc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci9sb2NhdGlvbi9sb2NhdGlvbl9zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQXlCLDBCQUEwQixDQUFDLENBQUE7QUFDcEQscUJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRzFDOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNIO0lBQUE7SUFTQSxDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQUFDLEFBVEQsSUFTQztBQVRxQix3QkFBZ0IsbUJBU3JDLENBQUE7QUFHRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUNVLHFCQUFhLEdBQWdCLGlCQUFVLENBQUMsSUFBSSxrQkFBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge09wYXF1ZVRva2VufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7VXJsQ2hhbmdlTGlzdGVuZXJ9IGZyb20gJy4vcGxhdGZvcm1fbG9jYXRpb24nO1xuXG4vKipcbiAqIGBMb2NhdGlvblN0cmF0ZWd5YCBpcyByZXNwb25zaWJsZSBmb3IgcmVwcmVzZW50aW5nIGFuZCByZWFkaW5nIHJvdXRlIHN0YXRlXG4gKiBmcm9tIHRoZSBicm93c2VyJ3MgVVJMLiBBbmd1bGFyIHByb3ZpZGVzIHR3byBzdHJhdGVnaWVzOlxuICoge0BsaW5rIEhhc2hMb2NhdGlvblN0cmF0ZWd5fSBhbmQge0BsaW5rIFBhdGhMb2NhdGlvblN0cmF0ZWd5fSAoZGVmYXVsdCkuXG4gKlxuICogVGhpcyBpcyB1c2VkIHVuZGVyIHRoZSBob29kIG9mIHRoZSB7QGxpbmsgTG9jYXRpb259IHNlcnZpY2UuXG4gKlxuICogQXBwbGljYXRpb25zIHNob3VsZCB1c2UgdGhlIHtAbGluayBSb3V0ZXJ9IG9yIHtAbGluayBMb2NhdGlvbn0gc2VydmljZXMgdG9cbiAqIGludGVyYWN0IHdpdGggYXBwbGljYXRpb24gcm91dGUgc3RhdGUuXG4gKlxuICogRm9yIGluc3RhbmNlLCB7QGxpbmsgSGFzaExvY2F0aW9uU3RyYXRlZ3l9IHByb2R1Y2VzIFVSTHMgbGlrZVxuICogYGh0dHA6Ly9leGFtcGxlLmNvbSMvZm9vYCwgYW5kIHtAbGluayBQYXRoTG9jYXRpb25TdHJhdGVneX0gcHJvZHVjZXNcbiAqIGBodHRwOi8vZXhhbXBsZS5jb20vZm9vYCBhcyBhbiBlcXVpdmFsZW50IFVSTC5cbiAqXG4gKiBTZWUgdGhlc2UgdHdvIGNsYXNzZXMgZm9yIG1vcmUuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMb2NhdGlvblN0cmF0ZWd5IHtcbiAgYWJzdHJhY3QgcGF0aCgpOiBzdHJpbmc7XG4gIGFic3RyYWN0IHByZXBhcmVFeHRlcm5hbFVybChpbnRlcm5hbDogc3RyaW5nKTogc3RyaW5nO1xuICBhYnN0cmFjdCBwdXNoU3RhdGUoc3RhdGU6IGFueSwgdGl0bGU6IHN0cmluZywgdXJsOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBzdHJpbmcpOiB2b2lkO1xuICBhYnN0cmFjdCByZXBsYWNlU3RhdGUoc3RhdGU6IGFueSwgdGl0bGU6IHN0cmluZywgdXJsOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBzdHJpbmcpOiB2b2lkO1xuICBhYnN0cmFjdCBmb3J3YXJkKCk6IHZvaWQ7XG4gIGFic3RyYWN0IGJhY2soKTogdm9pZDtcbiAgYWJzdHJhY3Qgb25Qb3BTdGF0ZShmbjogVXJsQ2hhbmdlTGlzdGVuZXIpOiB2b2lkO1xuICBhYnN0cmFjdCBnZXRCYXNlSHJlZigpOiBzdHJpbmc7XG59XG5cblxuLyoqXG4gKiBUaGUgYEFQUF9CQVNFX0hSRUZgIHRva2VuIHJlcHJlc2VudHMgdGhlIGJhc2UgaHJlZiB0byBiZSB1c2VkIHdpdGggdGhlXG4gKiB7QGxpbmsgUGF0aExvY2F0aW9uU3RyYXRlZ3l9LlxuICpcbiAqIElmIHlvdSdyZSB1c2luZyB7QGxpbmsgUGF0aExvY2F0aW9uU3RyYXRlZ3l9LCB5b3UgbXVzdCBwcm92aWRlIGEgcHJvdmlkZXIgdG8gYSBzdHJpbmdcbiAqIHJlcHJlc2VudGluZyB0aGUgVVJMIHByZWZpeCB0aGF0IHNob3VsZCBiZSBwcmVzZXJ2ZWQgd2hlbiBnZW5lcmF0aW5nIGFuZCByZWNvZ25pemluZ1xuICogVVJMcy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuICogaW1wb3J0IHtST1VURVJfRElSRUNUSVZFUywgUk9VVEVSX1BST1ZJREVSUywgUm91dGVDb25maWd9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlcic7XG4gKiBpbXBvcnQge0FQUF9CQVNFX0hSRUZ9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2NvbW1vbic7XG4gKlxuICogQENvbXBvbmVudCh7ZGlyZWN0aXZlczogW1JPVVRFUl9ESVJFQ1RJVkVTXX0pXG4gKiBAUm91dGVDb25maWcoW1xuICogIHsuLi59LFxuICogXSlcbiAqIGNsYXNzIEFwcENtcCB7XG4gKiAgIC8vIC4uLlxuICogfVxuICpcbiAqIGJvb3RzdHJhcChBcHBDbXAsIFtcbiAqICAgUk9VVEVSX1BST1ZJREVSUyxcbiAqICAgcHJvdmlkZShBUFBfQkFTRV9IUkVGLCB7dXNlVmFsdWU6ICcvbXkvYXBwJ30pXG4gKiBdKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgQVBQX0JBU0VfSFJFRjogT3BhcXVlVG9rZW4gPSBDT05TVF9FWFBSKG5ldyBPcGFxdWVUb2tlbignYXBwQmFzZUhyZWYnKSk7XG4iXX0=