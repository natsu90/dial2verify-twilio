import { unimplemented } from 'angular2/src/facade/exceptions';
import { ChangeDetectorRef } from '../change_detection/change_detector_ref';
import { ChangeDetectionStrategy } from 'angular2/src/core/change_detection/constants';
export class ViewRef extends ChangeDetectorRef {
    /**
     * @internal
     */
    get changeDetectorRef() { return unimplemented(); }
    ;
    get destroyed() { return unimplemented(); }
}
/**
 * Represents an Angular View.
 *
 * <!-- TODO: move the next two paragraphs to the dev guide -->
 * A View is a fundamental building block of the application UI. It is the smallest grouping of
 * Elements which are created and destroyed together.
 *
 * Properties of elements in a View can change, but the structure (number and order) of elements in
 * a View cannot. Changing the structure of Elements can only be done by inserting, moving or
 * removing nested Views via a {@link ViewContainerRef}. Each View can contain many View Containers.
 * <!-- /TODO -->
 *
 * ### Example
 *
 * Given this template...
 *
 * ```
 * Count: {{items.length}}
 * <ul>
 *   <li *ngFor="var item of items">{{item}}</li>
 * </ul>
 * ```
 *
 * ... we have two {@link ProtoViewRef}s:
 *
 * Outer {@link ProtoViewRef}:
 * ```
 * Count: {{items.length}}
 * <ul>
 *   <template ngFor var-item [ngForOf]="items"></template>
 * </ul>
 * ```
 *
 * Inner {@link ProtoViewRef}:
 * ```
 *   <li>{{item}}</li>
 * ```
 *
 * Notice that the original template is broken down into two separate {@link ProtoViewRef}s.
 *
 * The outer/inner {@link ProtoViewRef}s are then assembled into views like so:
 *
 * ```
 * <!-- ViewRef: outer-0 -->
 * Count: 2
 * <ul>
 *   <template view-container-ref></template>
 *   <!-- ViewRef: inner-1 --><li>first</li><!-- /ViewRef: inner-1 -->
 *   <!-- ViewRef: inner-2 --><li>second</li><!-- /ViewRef: inner-2 -->
 * </ul>
 * <!-- /ViewRef: outer-0 -->
 * ```
 */
export class EmbeddedViewRef extends ViewRef {
    get rootNodes() { return unimplemented(); }
    ;
}
export class ViewRef_ {
    constructor(_view) {
        this._view = _view;
        this._view = _view;
    }
    get internalView() { return this._view; }
    /**
     * Return `ChangeDetectorRef`
     */
    get changeDetectorRef() { return this; }
    get rootNodes() { return this._view.flatRootNodes; }
    setLocal(variableName, value) { this._view.setLocal(variableName, value); }
    hasLocal(variableName) { return this._view.hasLocal(variableName); }
    get destroyed() { return this._view.destroyed; }
    markForCheck() { this._view.markPathToRootAsCheckOnce(); }
    detach() { this._view.cdMode = ChangeDetectionStrategy.Detached; }
    detectChanges() { this._view.detectChanges(false); }
    checkNoChanges() { this._view.detectChanges(true); }
    reattach() {
        this._view.cdMode = ChangeDetectionStrategy.CheckAlways;
        this.markForCheck();
    }
    onDestroy(callback) { this._view.disposables.push(callback); }
    destroy() { this._view.destroy(); }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19yZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTlEMWlHUVZHLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld19yZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxnQ0FBZ0M7T0FFckQsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHlDQUF5QztPQUVsRSxFQUFDLHVCQUF1QixFQUFDLE1BQU0sOENBQThDO0FBRXBGLDZCQUFzQyxpQkFBaUI7SUFDckQ7O09BRUc7SUFDSCxJQUFJLGlCQUFpQixLQUF3QixNQUFNLENBQW9CLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQzs7SUFFekYsSUFBSSxTQUFTLEtBQWMsTUFBTSxDQUFVLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUcvRCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvREc7QUFDSCxxQ0FBOEMsT0FBTztJQVduRCxJQUFJLFNBQVMsS0FBWSxNQUFNLENBQVEsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQU0zRCxDQUFDO0FBRUQ7SUFDRSxZQUFvQixLQUFtQjtRQUFuQixVQUFLLEdBQUwsS0FBSyxDQUFjO1FBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFBQyxDQUFDO0lBRWhFLElBQUksWUFBWSxLQUFtQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFdkQ7O09BRUc7SUFDSCxJQUFJLGlCQUFpQixLQUF3QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUUzRCxJQUFJLFNBQVMsS0FBWSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBRTNELFFBQVEsQ0FBQyxZQUFvQixFQUFFLEtBQVUsSUFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTlGLFFBQVEsQ0FBQyxZQUFvQixJQUFhLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckYsSUFBSSxTQUFTLEtBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUV6RCxZQUFZLEtBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRSxNQUFNLEtBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN4RSxhQUFhLEtBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELGNBQWMsS0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsUUFBUTtRQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLHVCQUF1QixDQUFDLFdBQVcsQ0FBQztRQUN4RCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELFNBQVMsQ0FBQyxRQUFrQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFeEUsT0FBTyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dW5pbXBsZW1lbnRlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7aXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3RvclJlZn0gZnJvbSAnLi4vY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0b3JfcmVmJztcbmltcG9ydCB7QXBwVmlld30gZnJvbSAnLi92aWV3JztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3l9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vY29uc3RhbnRzJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZpZXdSZWYgZXh0ZW5kcyBDaGFuZ2VEZXRlY3RvclJlZiB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGdldCBjaGFuZ2VEZXRlY3RvclJlZigpOiBDaGFuZ2VEZXRlY3RvclJlZiB7IHJldHVybiA8Q2hhbmdlRGV0ZWN0b3JSZWY+dW5pbXBsZW1lbnRlZCgpOyB9O1xuXG4gIGdldCBkZXN0cm95ZWQoKTogYm9vbGVhbiB7IHJldHVybiA8Ym9vbGVhbj51bmltcGxlbWVudGVkKCk7IH1cblxuICBhYnN0cmFjdCBvbkRlc3Ryb3koY2FsbGJhY2s6IEZ1bmN0aW9uKTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIEFuZ3VsYXIgVmlldy5cbiAqXG4gKiA8IS0tIFRPRE86IG1vdmUgdGhlIG5leHQgdHdvIHBhcmFncmFwaHMgdG8gdGhlIGRldiBndWlkZSAtLT5cbiAqIEEgVmlldyBpcyBhIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrIG9mIHRoZSBhcHBsaWNhdGlvbiBVSS4gSXQgaXMgdGhlIHNtYWxsZXN0IGdyb3VwaW5nIG9mXG4gKiBFbGVtZW50cyB3aGljaCBhcmUgY3JlYXRlZCBhbmQgZGVzdHJveWVkIHRvZ2V0aGVyLlxuICpcbiAqIFByb3BlcnRpZXMgb2YgZWxlbWVudHMgaW4gYSBWaWV3IGNhbiBjaGFuZ2UsIGJ1dCB0aGUgc3RydWN0dXJlIChudW1iZXIgYW5kIG9yZGVyKSBvZiBlbGVtZW50cyBpblxuICogYSBWaWV3IGNhbm5vdC4gQ2hhbmdpbmcgdGhlIHN0cnVjdHVyZSBvZiBFbGVtZW50cyBjYW4gb25seSBiZSBkb25lIGJ5IGluc2VydGluZywgbW92aW5nIG9yXG4gKiByZW1vdmluZyBuZXN0ZWQgVmlld3MgdmlhIGEge0BsaW5rIFZpZXdDb250YWluZXJSZWZ9LiBFYWNoIFZpZXcgY2FuIGNvbnRhaW4gbWFueSBWaWV3IENvbnRhaW5lcnMuXG4gKiA8IS0tIC9UT0RPIC0tPlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogR2l2ZW4gdGhpcyB0ZW1wbGF0ZS4uLlxuICpcbiAqIGBgYFxuICogQ291bnQ6IHt7aXRlbXMubGVuZ3RofX1cbiAqIDx1bD5cbiAqICAgPGxpICpuZ0Zvcj1cInZhciBpdGVtIG9mIGl0ZW1zXCI+e3tpdGVtfX08L2xpPlxuICogPC91bD5cbiAqIGBgYFxuICpcbiAqIC4uLiB3ZSBoYXZlIHR3byB7QGxpbmsgUHJvdG9WaWV3UmVmfXM6XG4gKlxuICogT3V0ZXIge0BsaW5rIFByb3RvVmlld1JlZn06XG4gKiBgYGBcbiAqIENvdW50OiB7e2l0ZW1zLmxlbmd0aH19XG4gKiA8dWw+XG4gKiAgIDx0ZW1wbGF0ZSBuZ0ZvciB2YXItaXRlbSBbbmdGb3JPZl09XCJpdGVtc1wiPjwvdGVtcGxhdGU+XG4gKiA8L3VsPlxuICogYGBgXG4gKlxuICogSW5uZXIge0BsaW5rIFByb3RvVmlld1JlZn06XG4gKiBgYGBcbiAqICAgPGxpPnt7aXRlbX19PC9saT5cbiAqIGBgYFxuICpcbiAqIE5vdGljZSB0aGF0IHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSBpcyBicm9rZW4gZG93biBpbnRvIHR3byBzZXBhcmF0ZSB7QGxpbmsgUHJvdG9WaWV3UmVmfXMuXG4gKlxuICogVGhlIG91dGVyL2lubmVyIHtAbGluayBQcm90b1ZpZXdSZWZ9cyBhcmUgdGhlbiBhc3NlbWJsZWQgaW50byB2aWV3cyBsaWtlIHNvOlxuICpcbiAqIGBgYFxuICogPCEtLSBWaWV3UmVmOiBvdXRlci0wIC0tPlxuICogQ291bnQ6IDJcbiAqIDx1bD5cbiAqICAgPHRlbXBsYXRlIHZpZXctY29udGFpbmVyLXJlZj48L3RlbXBsYXRlPlxuICogICA8IS0tIFZpZXdSZWY6IGlubmVyLTEgLS0+PGxpPmZpcnN0PC9saT48IS0tIC9WaWV3UmVmOiBpbm5lci0xIC0tPlxuICogICA8IS0tIFZpZXdSZWY6IGlubmVyLTIgLS0+PGxpPnNlY29uZDwvbGk+PCEtLSAvVmlld1JlZjogaW5uZXItMiAtLT5cbiAqIDwvdWw+XG4gKiA8IS0tIC9WaWV3UmVmOiBvdXRlci0wIC0tPlxuICogYGBgXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbWJlZGRlZFZpZXdSZWYgZXh0ZW5kcyBWaWV3UmVmIHtcbiAgLyoqXG4gICAqIFNldHMgYHZhbHVlYCBvZiBsb2NhbCB2YXJpYWJsZSBjYWxsZWQgYHZhcmlhYmxlTmFtZWAgaW4gdGhpcyBWaWV3LlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0TG9jYWwodmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGlzIHZpZXcgaGFzIGEgbG9jYWwgdmFyaWFibGUgY2FsbGVkIGB2YXJpYWJsZU5hbWVgLlxuICAgKi9cbiAgYWJzdHJhY3QgaGFzTG9jYWwodmFyaWFibGVOYW1lOiBzdHJpbmcpOiBib29sZWFuO1xuXG4gIGdldCByb290Tm9kZXMoKTogYW55W10geyByZXR1cm4gPGFueVtdPnVuaW1wbGVtZW50ZWQoKTsgfTtcblxuICAvKipcbiAgICogRGVzdHJveXMgdGhlIHZpZXcgYW5kIGFsbCBvZiB0aGUgZGF0YSBzdHJ1Y3R1cmVzIGFzc29jaWF0ZWQgd2l0aCBpdC5cbiAgICovXG4gIGFic3RyYWN0IGRlc3Ryb3koKTtcbn1cblxuZXhwb3J0IGNsYXNzIFZpZXdSZWZfIGltcGxlbWVudHMgRW1iZWRkZWRWaWV3UmVmIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmlldzogQXBwVmlldzxhbnk+KSB7IHRoaXMuX3ZpZXcgPSBfdmlldzsgfVxuXG4gIGdldCBpbnRlcm5hbFZpZXcoKTogQXBwVmlldzxhbnk+IHsgcmV0dXJuIHRoaXMuX3ZpZXc7IH1cblxuICAvKipcbiAgICogUmV0dXJuIGBDaGFuZ2VEZXRlY3RvclJlZmBcbiAgICovXG4gIGdldCBjaGFuZ2VEZXRlY3RvclJlZigpOiBDaGFuZ2VEZXRlY3RvclJlZiB7IHJldHVybiB0aGlzOyB9XG5cbiAgZ2V0IHJvb3ROb2RlcygpOiBhbnlbXSB7IHJldHVybiB0aGlzLl92aWV3LmZsYXRSb290Tm9kZXM7IH1cblxuICBzZXRMb2NhbCh2YXJpYWJsZU5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQgeyB0aGlzLl92aWV3LnNldExvY2FsKHZhcmlhYmxlTmFtZSwgdmFsdWUpOyB9XG5cbiAgaGFzTG9jYWwodmFyaWFibGVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3ZpZXcuaGFzTG9jYWwodmFyaWFibGVOYW1lKTsgfVxuXG4gIGdldCBkZXN0cm95ZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl92aWV3LmRlc3Ryb3llZDsgfVxuXG4gIG1hcmtGb3JDaGVjaygpOiB2b2lkIHsgdGhpcy5fdmlldy5tYXJrUGF0aFRvUm9vdEFzQ2hlY2tPbmNlKCk7IH1cbiAgZGV0YWNoKCk6IHZvaWQgeyB0aGlzLl92aWV3LmNkTW9kZSA9IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRldGFjaGVkOyB9XG4gIGRldGVjdENoYW5nZXMoKTogdm9pZCB7IHRoaXMuX3ZpZXcuZGV0ZWN0Q2hhbmdlcyhmYWxzZSk7IH1cbiAgY2hlY2tOb0NoYW5nZXMoKTogdm9pZCB7IHRoaXMuX3ZpZXcuZGV0ZWN0Q2hhbmdlcyh0cnVlKTsgfVxuICByZWF0dGFjaCgpOiB2b2lkIHtcbiAgICB0aGlzLl92aWV3LmNkTW9kZSA9IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkNoZWNrQWx3YXlzO1xuICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBvbkRlc3Ryb3koY2FsbGJhY2s6IEZ1bmN0aW9uKSB7IHRoaXMuX3ZpZXcuZGlzcG9zYWJsZXMucHVzaChjYWxsYmFjayk7IH1cblxuICBkZXN0cm95KCkgeyB0aGlzLl92aWV3LmRlc3Ryb3koKTsgfVxufVxuIl19