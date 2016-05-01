import { ApplicationRef } from 'angular2/src/core/application_ref';
import { isPresent, NumberWrapper } from 'angular2/src/facade/lang';
import { window } from 'angular2/src/facade/browser';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
export class ChangeDetectionPerfRecord {
    constructor(msPerTick, numTicks) {
        this.msPerTick = msPerTick;
        this.numTicks = numTicks;
    }
}
/**
 * Entry point for all Angular debug tools. This object corresponds to the `ng`
 * global variable accessible in the dev console.
 */
export class AngularTools {
    constructor(ref) {
        this.profiler = new AngularProfiler(ref);
    }
}
/**
 * Entry point for all Angular profiling-related debug tools. This object
 * corresponds to the `ng.profiler` in the dev console.
 */
export class AngularProfiler {
    constructor(ref) {
        this.appRef = ref.injector.get(ApplicationRef);
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
    timeChangeDetection(config) {
        var record = isPresent(config) && config['record'];
        var profileName = 'Change Detection';
        // Profiler is not available in Android browsers, nor in IE 9 without dev tools opened
        var isProfilerAvailable = isPresent(window.console.profile);
        if (record && isProfilerAvailable) {
            window.console.profile(profileName);
        }
        var start = DOM.performanceNow();
        var numTicks = 0;
        while (numTicks < 5 || (DOM.performanceNow() - start) < 500) {
            this.appRef.tick();
            numTicks++;
        }
        var end = DOM.performanceNow();
        if (record && isProfilerAvailable) {
            // need to cast to <any> because type checker thinks there's no argument
            // while in fact there is:
            //
            // https://developer.mozilla.org/en-US/docs/Web/API/Console/profileEnd
            window.console.profileEnd(profileName);
        }
        var msPerTick = (end - start) / numTicks;
        window.console.log(`ran ${numTicks} change detection cycles`);
        window.console.log(`${NumberWrapper.toFixed(msPerTick, 2)} ms per check`);
        return new ChangeDetectionPerfRecord(msPerTick, numTicks);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX3Rvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIvdG9vbHMvY29tbW9uX3Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUNBQW1DO09BRXpELEVBQUMsU0FBUyxFQUFFLGFBQWEsRUFBQyxNQUFNLDBCQUEwQjtPQUMxRCxFQUFDLE1BQU0sRUFBQyxNQUFNLDZCQUE2QjtPQUMzQyxFQUFDLEdBQUcsRUFBQyxNQUFNLHVDQUF1QztBQUV6RDtJQUNFLFlBQW1CLFNBQWlCLEVBQVMsUUFBZ0I7UUFBMUMsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVE7SUFBRyxDQUFDO0FBQ25FLENBQUM7QUFFRDs7O0dBR0c7QUFDSDtJQUdFLFlBQVksR0FBaUI7UUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQUMsQ0FBQztBQUM5RSxDQUFDO0FBRUQ7OztHQUdHO0FBQ0g7SUFHRSxZQUFZLEdBQWlCO1FBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUFDLENBQUM7SUFFbEY7Ozs7Ozs7Ozs7Ozs7OztPQWVHO0lBQ0gsbUJBQW1CLENBQUMsTUFBVztRQUM3QixJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELElBQUksV0FBVyxHQUFHLGtCQUFrQixDQUFDO1FBQ3JDLHNGQUFzRjtRQUN0RixJQUFJLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7WUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNELElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNqQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDakIsT0FBTyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQzVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkIsUUFBUSxFQUFFLENBQUM7UUFDYixDQUFDO1FBQ0QsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7WUFDbEMsd0VBQXdFO1lBQ3hFLDBCQUEwQjtZQUMxQixFQUFFO1lBQ0Ysc0VBQXNFO1lBQ2hFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFDRCxJQUFJLFNBQVMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDekMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxRQUFRLDBCQUEwQixDQUFDLENBQUM7UUFDOUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFMUUsTUFBTSxDQUFDLElBQUkseUJBQXlCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVELENBQUM7QUFDSCxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FwcGxpY2F0aW9uUmVmfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9hcHBsaWNhdGlvbl9yZWYnO1xuaW1wb3J0IHtDb21wb25lbnRSZWZ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9jb21wb25lbnRfZmFjdG9yeSc7XG5pbXBvcnQge2lzUHJlc2VudCwgTnVtYmVyV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7d2luZG93fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2Jyb3dzZXInO1xuaW1wb3J0IHtET019IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX2FkYXB0ZXInO1xuXG5leHBvcnQgY2xhc3MgQ2hhbmdlRGV0ZWN0aW9uUGVyZlJlY29yZCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtc1BlclRpY2s6IG51bWJlciwgcHVibGljIG51bVRpY2tzOiBudW1iZXIpIHt9XG59XG5cbi8qKlxuICogRW50cnkgcG9pbnQgZm9yIGFsbCBBbmd1bGFyIGRlYnVnIHRvb2xzLiBUaGlzIG9iamVjdCBjb3JyZXNwb25kcyB0byB0aGUgYG5nYFxuICogZ2xvYmFsIHZhcmlhYmxlIGFjY2Vzc2libGUgaW4gdGhlIGRldiBjb25zb2xlLlxuICovXG5leHBvcnQgY2xhc3MgQW5ndWxhclRvb2xzIHtcbiAgcHJvZmlsZXI6IEFuZ3VsYXJQcm9maWxlcjtcblxuICBjb25zdHJ1Y3RvcihyZWY6IENvbXBvbmVudFJlZikgeyB0aGlzLnByb2ZpbGVyID0gbmV3IEFuZ3VsYXJQcm9maWxlcihyZWYpOyB9XG59XG5cbi8qKlxuICogRW50cnkgcG9pbnQgZm9yIGFsbCBBbmd1bGFyIHByb2ZpbGluZy1yZWxhdGVkIGRlYnVnIHRvb2xzLiBUaGlzIG9iamVjdFxuICogY29ycmVzcG9uZHMgdG8gdGhlIGBuZy5wcm9maWxlcmAgaW4gdGhlIGRldiBjb25zb2xlLlxuICovXG5leHBvcnQgY2xhc3MgQW5ndWxhclByb2ZpbGVyIHtcbiAgYXBwUmVmOiBBcHBsaWNhdGlvblJlZjtcblxuICBjb25zdHJ1Y3RvcihyZWY6IENvbXBvbmVudFJlZikgeyB0aGlzLmFwcFJlZiA9IHJlZi5pbmplY3Rvci5nZXQoQXBwbGljYXRpb25SZWYpOyB9XG5cbiAgLyoqXG4gICAqIEV4ZXJjaXNlcyBjaGFuZ2UgZGV0ZWN0aW9uIGluIGEgbG9vcCBhbmQgdGhlbiBwcmludHMgdGhlIGF2ZXJhZ2UgYW1vdW50IG9mXG4gICAqIHRpbWUgaW4gbWlsbGlzZWNvbmRzIGhvdyBsb25nIGEgc2luZ2xlIHJvdW5kIG9mIGNoYW5nZSBkZXRlY3Rpb24gdGFrZXMgZm9yXG4gICAqIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBVSS4gSXQgcnVucyBhIG1pbmltdW0gb2YgNSByb3VuZHMgZm9yIGEgbWluaW11bVxuICAgKiBvZiA1MDAgbWlsbGlzZWNvbmRzLlxuICAgKlxuICAgKiBPcHRpb25hbGx5LCBhIHVzZXIgbWF5IHBhc3MgYSBgY29uZmlnYCBwYXJhbWV0ZXIgY29udGFpbmluZyBhIG1hcCBvZlxuICAgKiBvcHRpb25zLiBTdXBwb3J0ZWQgb3B0aW9ucyBhcmU6XG4gICAqXG4gICAqIGByZWNvcmRgIChib29sZWFuKSAtIGNhdXNlcyB0aGUgcHJvZmlsZXIgdG8gcmVjb3JkIGEgQ1BVIHByb2ZpbGUgd2hpbGVcbiAgICogaXQgZXhlcmNpc2VzIHRoZSBjaGFuZ2UgZGV0ZWN0b3IuIEV4YW1wbGU6XG4gICAqXG4gICAqIGBgYFxuICAgKiBuZy5wcm9maWxlci50aW1lQ2hhbmdlRGV0ZWN0aW9uKHtyZWNvcmQ6IHRydWV9KVxuICAgKiBgYGBcbiAgICovXG4gIHRpbWVDaGFuZ2VEZXRlY3Rpb24oY29uZmlnOiBhbnkpOiBDaGFuZ2VEZXRlY3Rpb25QZXJmUmVjb3JkIHtcbiAgICB2YXIgcmVjb3JkID0gaXNQcmVzZW50KGNvbmZpZykgJiYgY29uZmlnWydyZWNvcmQnXTtcbiAgICB2YXIgcHJvZmlsZU5hbWUgPSAnQ2hhbmdlIERldGVjdGlvbic7XG4gICAgLy8gUHJvZmlsZXIgaXMgbm90IGF2YWlsYWJsZSBpbiBBbmRyb2lkIGJyb3dzZXJzLCBub3IgaW4gSUUgOSB3aXRob3V0IGRldiB0b29scyBvcGVuZWRcbiAgICB2YXIgaXNQcm9maWxlckF2YWlsYWJsZSA9IGlzUHJlc2VudCh3aW5kb3cuY29uc29sZS5wcm9maWxlKTtcbiAgICBpZiAocmVjb3JkICYmIGlzUHJvZmlsZXJBdmFpbGFibGUpIHtcbiAgICAgIHdpbmRvdy5jb25zb2xlLnByb2ZpbGUocHJvZmlsZU5hbWUpO1xuICAgIH1cbiAgICB2YXIgc3RhcnQgPSBET00ucGVyZm9ybWFuY2VOb3coKTtcbiAgICB2YXIgbnVtVGlja3MgPSAwO1xuICAgIHdoaWxlIChudW1UaWNrcyA8IDUgfHwgKERPTS5wZXJmb3JtYW5jZU5vdygpIC0gc3RhcnQpIDwgNTAwKSB7XG4gICAgICB0aGlzLmFwcFJlZi50aWNrKCk7XG4gICAgICBudW1UaWNrcysrO1xuICAgIH1cbiAgICB2YXIgZW5kID0gRE9NLnBlcmZvcm1hbmNlTm93KCk7XG4gICAgaWYgKHJlY29yZCAmJiBpc1Byb2ZpbGVyQXZhaWxhYmxlKSB7XG4gICAgICAvLyBuZWVkIHRvIGNhc3QgdG8gPGFueT4gYmVjYXVzZSB0eXBlIGNoZWNrZXIgdGhpbmtzIHRoZXJlJ3Mgbm8gYXJndW1lbnRcbiAgICAgIC8vIHdoaWxlIGluIGZhY3QgdGhlcmUgaXM6XG4gICAgICAvL1xuICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NvbnNvbGUvcHJvZmlsZUVuZFxuICAgICAgKDxhbnk+d2luZG93LmNvbnNvbGUucHJvZmlsZUVuZCkocHJvZmlsZU5hbWUpO1xuICAgIH1cbiAgICB2YXIgbXNQZXJUaWNrID0gKGVuZCAtIHN0YXJ0KSAvIG51bVRpY2tzO1xuICAgIHdpbmRvdy5jb25zb2xlLmxvZyhgcmFuICR7bnVtVGlja3N9IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGVzYCk7XG4gICAgd2luZG93LmNvbnNvbGUubG9nKGAke051bWJlcldyYXBwZXIudG9GaXhlZChtc1BlclRpY2ssIDIpfSBtcyBwZXIgY2hlY2tgKTtcblxuICAgIHJldHVybiBuZXcgQ2hhbmdlRGV0ZWN0aW9uUGVyZlJlY29yZChtc1BlclRpY2ssIG51bVRpY2tzKTtcbiAgfVxufVxuIl19