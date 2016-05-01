'use strict';"use strict";
var application_ref_1 = require('angular2/src/core/application_ref');
var lang_1 = require('angular2/src/facade/lang');
var browser_1 = require('angular2/src/facade/browser');
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var ChangeDetectionPerfRecord = (function () {
    function ChangeDetectionPerfRecord(msPerTick, numTicks) {
        this.msPerTick = msPerTick;
        this.numTicks = numTicks;
    }
    return ChangeDetectionPerfRecord;
}());
exports.ChangeDetectionPerfRecord = ChangeDetectionPerfRecord;
/**
 * Entry point for all Angular debug tools. This object corresponds to the `ng`
 * global variable accessible in the dev console.
 */
var AngularTools = (function () {
    function AngularTools(ref) {
        this.profiler = new AngularProfiler(ref);
    }
    return AngularTools;
}());
exports.AngularTools = AngularTools;
/**
 * Entry point for all Angular profiling-related debug tools. This object
 * corresponds to the `ng.profiler` in the dev console.
 */
var AngularProfiler = (function () {
    function AngularProfiler(ref) {
        this.appRef = ref.injector.get(application_ref_1.ApplicationRef);
    }
    /**
     * Exercises change detection in a loop and then prints the average amount of
     * time in milliseconds how long a single round of change detection takes for
     * the current state of the UI. It runs a minimum of 5 rounds for a minimum
     * of 500 milliseconds.
     *
     * Optionally, a user may pass a `config` parameter containing a map of
     * options. Supported options are:
     *
     * `record` (boolean) - causes the profiler to record a CPU profile while
     * it exercises the change detector. Example:
     *
     * ```
     * ng.profiler.timeChangeDetection({record: true})
     * ```
     */
    AngularProfiler.prototype.timeChangeDetection = function (config) {
        var record = lang_1.isPresent(config) && config['record'];
        var profileName = 'Change Detection';
        // Profiler is not available in Android browsers, nor in IE 9 without dev tools opened
        var isProfilerAvailable = lang_1.isPresent(browser_1.window.console.profile);
        if (record && isProfilerAvailable) {
            browser_1.window.console.profile(profileName);
        }
        var start = dom_adapter_1.DOM.performanceNow();
        var numTicks = 0;
        while (numTicks < 5 || (dom_adapter_1.DOM.performanceNow() - start) < 500) {
            this.appRef.tick();
            numTicks++;
        }
        var end = dom_adapter_1.DOM.performanceNow();
        if (record && isProfilerAvailable) {
            // need to cast to <any> because type checker thinks there's no argument
            // while in fact there is:
            //
            // https://developer.mozilla.org/en-US/docs/Web/API/Console/profileEnd
            browser_1.window.console.profileEnd(profileName);
        }
        var msPerTick = (end - start) / numTicks;
        browser_1.window.console.log("ran " + numTicks + " change detection cycles");
        browser_1.window.console.log(lang_1.NumberWrapper.toFixed(msPerTick, 2) + " ms per check");
        return new ChangeDetectionPerfRecord(msPerTick, numTicks);
    };
    return AngularProfiler;
}());
exports.AngularProfiler = AngularProfiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX3Rvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC00bm8zWlF2Ty50bXAvYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIvdG9vbHMvY29tbW9uX3Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnQ0FBNkIsbUNBQW1DLENBQUMsQ0FBQTtBQUVqRSxxQkFBdUMsMEJBQTBCLENBQUMsQ0FBQTtBQUNsRSx3QkFBcUIsNkJBQTZCLENBQUMsQ0FBQTtBQUNuRCw0QkFBa0IsdUNBQXVDLENBQUMsQ0FBQTtBQUUxRDtJQUNFLG1DQUFtQixTQUFpQixFQUFTLFFBQWdCO1FBQTFDLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBQUcsQ0FBQztJQUNuRSxnQ0FBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRlksaUNBQXlCLDRCQUVyQyxDQUFBO0FBRUQ7OztHQUdHO0FBQ0g7SUFHRSxzQkFBWSxHQUFpQjtRQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7SUFBQyxDQUFDO0lBQzlFLG1CQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSxvQkFBWSxlQUl4QixDQUFBO0FBRUQ7OztHQUdHO0FBQ0g7SUFHRSx5QkFBWSxHQUFpQjtRQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0NBQWMsQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUVsRjs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSCw2Q0FBbUIsR0FBbkIsVUFBb0IsTUFBVztRQUM3QixJQUFJLE1BQU0sR0FBRyxnQkFBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxJQUFJLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQztRQUNyQyxzRkFBc0Y7UUFDdEYsSUFBSSxtQkFBbUIsR0FBRyxnQkFBUyxDQUFDLGdCQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7WUFDbEMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFDRCxJQUFJLEtBQUssR0FBRyxpQkFBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ2pDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNqQixPQUFPLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBRyxDQUFDLGNBQWMsRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQzVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkIsUUFBUSxFQUFFLENBQUM7UUFDYixDQUFDO1FBQ0QsSUFBSSxHQUFHLEdBQUcsaUJBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLHdFQUF3RTtZQUN4RSwwQkFBMEI7WUFDMUIsRUFBRTtZQUNGLHNFQUFzRTtZQUNoRSxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNELElBQUksU0FBUyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQztRQUN6QyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBTyxRQUFRLDZCQUEwQixDQUFDLENBQUM7UUFDOUQsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFJLG9CQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsa0JBQWUsQ0FBQyxDQUFDO1FBRTFFLE1BQU0sQ0FBQyxJQUFJLHlCQUF5QixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBakRELElBaURDO0FBakRZLHVCQUFlLGtCQWlEM0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXBwbGljYXRpb25SZWZ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2FwcGxpY2F0aW9uX3JlZic7XG5pbXBvcnQge0NvbXBvbmVudFJlZn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2NvbXBvbmVudF9mYWN0b3J5JztcbmltcG9ydCB7aXNQcmVzZW50LCBOdW1iZXJXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHt3aW5kb3d9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYnJvd3Nlcic7XG5pbXBvcnQge0RPTX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fYWRhcHRlcic7XG5cbmV4cG9ydCBjbGFzcyBDaGFuZ2VEZXRlY3Rpb25QZXJmUmVjb3JkIHtcbiAgY29uc3RydWN0b3IocHVibGljIG1zUGVyVGljazogbnVtYmVyLCBwdWJsaWMgbnVtVGlja3M6IG51bWJlcikge31cbn1cblxuLyoqXG4gKiBFbnRyeSBwb2ludCBmb3IgYWxsIEFuZ3VsYXIgZGVidWcgdG9vbHMuIFRoaXMgb2JqZWN0IGNvcnJlc3BvbmRzIHRvIHRoZSBgbmdgXG4gKiBnbG9iYWwgdmFyaWFibGUgYWNjZXNzaWJsZSBpbiB0aGUgZGV2IGNvbnNvbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbmd1bGFyVG9vbHMge1xuICBwcm9maWxlcjogQW5ndWxhclByb2ZpbGVyO1xuXG4gIGNvbnN0cnVjdG9yKHJlZjogQ29tcG9uZW50UmVmKSB7IHRoaXMucHJvZmlsZXIgPSBuZXcgQW5ndWxhclByb2ZpbGVyKHJlZik7IH1cbn1cblxuLyoqXG4gKiBFbnRyeSBwb2ludCBmb3IgYWxsIEFuZ3VsYXIgcHJvZmlsaW5nLXJlbGF0ZWQgZGVidWcgdG9vbHMuIFRoaXMgb2JqZWN0XG4gKiBjb3JyZXNwb25kcyB0byB0aGUgYG5nLnByb2ZpbGVyYCBpbiB0aGUgZGV2IGNvbnNvbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbmd1bGFyUHJvZmlsZXIge1xuICBhcHBSZWY6IEFwcGxpY2F0aW9uUmVmO1xuXG4gIGNvbnN0cnVjdG9yKHJlZjogQ29tcG9uZW50UmVmKSB7IHRoaXMuYXBwUmVmID0gcmVmLmluamVjdG9yLmdldChBcHBsaWNhdGlvblJlZik7IH1cblxuICAvKipcbiAgICogRXhlcmNpc2VzIGNoYW5nZSBkZXRlY3Rpb24gaW4gYSBsb29wIGFuZCB0aGVuIHByaW50cyB0aGUgYXZlcmFnZSBhbW91bnQgb2ZcbiAgICogdGltZSBpbiBtaWxsaXNlY29uZHMgaG93IGxvbmcgYSBzaW5nbGUgcm91bmQgb2YgY2hhbmdlIGRldGVjdGlvbiB0YWtlcyBmb3JcbiAgICogdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIFVJLiBJdCBydW5zIGEgbWluaW11bSBvZiA1IHJvdW5kcyBmb3IgYSBtaW5pbXVtXG4gICAqIG9mIDUwMCBtaWxsaXNlY29uZHMuXG4gICAqXG4gICAqIE9wdGlvbmFsbHksIGEgdXNlciBtYXkgcGFzcyBhIGBjb25maWdgIHBhcmFtZXRlciBjb250YWluaW5nIGEgbWFwIG9mXG4gICAqIG9wdGlvbnMuIFN1cHBvcnRlZCBvcHRpb25zIGFyZTpcbiAgICpcbiAgICogYHJlY29yZGAgKGJvb2xlYW4pIC0gY2F1c2VzIHRoZSBwcm9maWxlciB0byByZWNvcmQgYSBDUFUgcHJvZmlsZSB3aGlsZVxuICAgKiBpdCBleGVyY2lzZXMgdGhlIGNoYW5nZSBkZXRlY3Rvci4gRXhhbXBsZTpcbiAgICpcbiAgICogYGBgXG4gICAqIG5nLnByb2ZpbGVyLnRpbWVDaGFuZ2VEZXRlY3Rpb24oe3JlY29yZDogdHJ1ZX0pXG4gICAqIGBgYFxuICAgKi9cbiAgdGltZUNoYW5nZURldGVjdGlvbihjb25maWc6IGFueSk6IENoYW5nZURldGVjdGlvblBlcmZSZWNvcmQge1xuICAgIHZhciByZWNvcmQgPSBpc1ByZXNlbnQoY29uZmlnKSAmJiBjb25maWdbJ3JlY29yZCddO1xuICAgIHZhciBwcm9maWxlTmFtZSA9ICdDaGFuZ2UgRGV0ZWN0aW9uJztcbiAgICAvLyBQcm9maWxlciBpcyBub3QgYXZhaWxhYmxlIGluIEFuZHJvaWQgYnJvd3NlcnMsIG5vciBpbiBJRSA5IHdpdGhvdXQgZGV2IHRvb2xzIG9wZW5lZFxuICAgIHZhciBpc1Byb2ZpbGVyQXZhaWxhYmxlID0gaXNQcmVzZW50KHdpbmRvdy5jb25zb2xlLnByb2ZpbGUpO1xuICAgIGlmIChyZWNvcmQgJiYgaXNQcm9maWxlckF2YWlsYWJsZSkge1xuICAgICAgd2luZG93LmNvbnNvbGUucHJvZmlsZShwcm9maWxlTmFtZSk7XG4gICAgfVxuICAgIHZhciBzdGFydCA9IERPTS5wZXJmb3JtYW5jZU5vdygpO1xuICAgIHZhciBudW1UaWNrcyA9IDA7XG4gICAgd2hpbGUgKG51bVRpY2tzIDwgNSB8fCAoRE9NLnBlcmZvcm1hbmNlTm93KCkgLSBzdGFydCkgPCA1MDApIHtcbiAgICAgIHRoaXMuYXBwUmVmLnRpY2soKTtcbiAgICAgIG51bVRpY2tzKys7XG4gICAgfVxuICAgIHZhciBlbmQgPSBET00ucGVyZm9ybWFuY2VOb3coKTtcbiAgICBpZiAocmVjb3JkICYmIGlzUHJvZmlsZXJBdmFpbGFibGUpIHtcbiAgICAgIC8vIG5lZWQgdG8gY2FzdCB0byA8YW55PiBiZWNhdXNlIHR5cGUgY2hlY2tlciB0aGlua3MgdGhlcmUncyBubyBhcmd1bWVudFxuICAgICAgLy8gd2hpbGUgaW4gZmFjdCB0aGVyZSBpczpcbiAgICAgIC8vXG4gICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ29uc29sZS9wcm9maWxlRW5kXG4gICAgICAoPGFueT53aW5kb3cuY29uc29sZS5wcm9maWxlRW5kKShwcm9maWxlTmFtZSk7XG4gICAgfVxuICAgIHZhciBtc1BlclRpY2sgPSAoZW5kIC0gc3RhcnQpIC8gbnVtVGlja3M7XG4gICAgd2luZG93LmNvbnNvbGUubG9nKGByYW4gJHtudW1UaWNrc30gY2hhbmdlIGRldGVjdGlvbiBjeWNsZXNgKTtcbiAgICB3aW5kb3cuY29uc29sZS5sb2coYCR7TnVtYmVyV3JhcHBlci50b0ZpeGVkKG1zUGVyVGljaywgMil9IG1zIHBlciBjaGVja2ApO1xuXG4gICAgcmV0dXJuIG5ldyBDaGFuZ2VEZXRlY3Rpb25QZXJmUmVjb3JkKG1zUGVyVGljaywgbnVtVGlja3MpO1xuICB9XG59XG4iXX0=