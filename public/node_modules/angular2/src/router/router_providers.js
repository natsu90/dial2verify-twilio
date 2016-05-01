'use strict';"use strict";
var router_providers_common_1 = require('./router_providers_common');
var core_1 = require('angular2/core');
var browser_platform_location_1 = require('angular2/src/platform/browser/location/browser_platform_location');
var common_1 = require('angular2/platform/common');
var lang_1 = require('angular2/src/facade/lang');
/**
 * A list of {@link Provider}s. To use the router, you must add this to your application.
 *
 * ### Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
 *
 * ```
 * import {Component} from 'angular2/core';
 * import {
 *   ROUTER_DIRECTIVES,
 *   ROUTER_PROVIDERS,
 *   RouteConfig
 * } from 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {...},
 * ])
 * class AppCmp {
 *   // ...
 * }
 *
 * bootstrap(AppCmp, [ROUTER_PROVIDERS]);
 * ```
 */
exports.ROUTER_PROVIDERS = lang_1.CONST_EXPR([
    router_providers_common_1.ROUTER_PROVIDERS_COMMON,
    lang_1.CONST_EXPR(new core_1.Provider(common_1.PlatformLocation, { useClass: browser_platform_location_1.BrowserPlatformLocation })),
]);
/**
 * Use {@link ROUTER_PROVIDERS} instead.
 *
 * @deprecated
 */
exports.ROUTER_BINDINGS = exports.ROUTER_PROVIDERS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3Byb3ZpZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9yb3V0ZXIvcm91dGVyX3Byb3ZpZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0NBQXNDLDJCQUEyQixDQUFDLENBQUE7QUFDbEUscUJBQXVCLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZDLDBDQUVPLGtFQUFrRSxDQUFDLENBQUE7QUFDMUUsdUJBQStCLDBCQUEwQixDQUFDLENBQUE7QUFDMUQscUJBQXlCLDBCQUEwQixDQUFDLENBQUE7QUFFcEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJHO0FBQ1Usd0JBQWdCLEdBQVUsaUJBQVUsQ0FBQztJQUNoRCxpREFBdUI7SUFDdkIsaUJBQVUsQ0FBQyxJQUFJLGVBQVEsQ0FBQyx5QkFBZ0IsRUFBRSxFQUFDLFFBQVEsRUFBRSxtREFBdUIsRUFBQyxDQUFDLENBQUM7Q0FDaEYsQ0FBQyxDQUFDO0FBRUg7Ozs7R0FJRztBQUNVLHVCQUFlLEdBQUcsd0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JPVVRFUl9QUk9WSURFUlNfQ09NTU9OfSBmcm9tICcuL3JvdXRlcl9wcm92aWRlcnNfY29tbW9uJztcbmltcG9ydCB7UHJvdmlkZXJ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQnJvd3NlclBsYXRmb3JtTG9jYXRpb25cbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIvbG9jYXRpb24vYnJvd3Nlcl9wbGF0Zm9ybV9sb2NhdGlvbic7XG5pbXBvcnQge1BsYXRmb3JtTG9jYXRpb259IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2NvbW1vbic7XG5pbXBvcnQge0NPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbi8qKlxuICogQSBsaXN0IG9mIHtAbGluayBQcm92aWRlcn1zLiBUbyB1c2UgdGhlIHJvdXRlciwgeW91IG11c3QgYWRkIHRoaXMgdG8geW91ciBhcHBsaWNhdGlvbi5cbiAqXG4gKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvaVJVUDhCNU9VYnhDV1EzQWNJRG0pKVxuICpcbiAqIGBgYFxuICogaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuICogaW1wb3J0IHtcbiAqICAgUk9VVEVSX0RJUkVDVElWRVMsXG4gKiAgIFJPVVRFUl9QUk9WSURFUlMsXG4gKiAgIFJvdXRlQ29uZmlnXG4gKiB9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlcic7XG4gKlxuICogQENvbXBvbmVudCh7ZGlyZWN0aXZlczogW1JPVVRFUl9ESVJFQ1RJVkVTXX0pXG4gKiBAUm91dGVDb25maWcoW1xuICogIHsuLi59LFxuICogXSlcbiAqIGNsYXNzIEFwcENtcCB7XG4gKiAgIC8vIC4uLlxuICogfVxuICpcbiAqIGJvb3RzdHJhcChBcHBDbXAsIFtST1VURVJfUFJPVklERVJTXSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IFJPVVRFUl9QUk9WSURFUlM6IGFueVtdID0gQ09OU1RfRVhQUihbXG4gIFJPVVRFUl9QUk9WSURFUlNfQ09NTU9OLFxuICBDT05TVF9FWFBSKG5ldyBQcm92aWRlcihQbGF0Zm9ybUxvY2F0aW9uLCB7dXNlQ2xhc3M6IEJyb3dzZXJQbGF0Zm9ybUxvY2F0aW9ufSkpLFxuXSk7XG5cbi8qKlxuICogVXNlIHtAbGluayBST1VURVJfUFJPVklERVJTfSBpbnN0ZWFkLlxuICpcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCBjb25zdCBST1VURVJfQklORElOR1MgPSBST1VURVJfUFJPVklERVJTO1xuIl19