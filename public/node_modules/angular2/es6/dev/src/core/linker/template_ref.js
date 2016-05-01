/**
 * Represents an Embedded Template that can be used to instantiate Embedded Views.
 *
 * You can access a `TemplateRef`, in two ways. Via a directive placed on a `<template>` element (or
 * directive prefixed with `*`) and have the `TemplateRef` for this Embedded View injected into the
 * constructor of the directive using the `TemplateRef` Token. Alternatively you can query for the
 * `TemplateRef` from a Component or a Directive via {@link Query}.
 *
 * To instantiate Embedded Views based on a Template, use
 * {@link ViewContainerRef#createEmbeddedView}, which will create the View and attach it to the
 * View Container.
 */
export class TemplateRef {
    /**
     * The location in the View where the Embedded View logically belongs to.
     *
     * The data-binding and injection contexts of Embedded Views created from this `TemplateRef`
     * inherit from the contexts of this location.
     *
     * Typically new Embedded Views are attached to the View Container of this location, but in
     * advanced use-cases, the View can be attached to a different container while keeping the
     * data-binding and injection context from the original location.
     *
     */
    // TODO(i): rename to anchor or location
    get elementRef() { return null; }
}
export class TemplateRef_ extends TemplateRef {
    constructor(_appElement, _viewFactory) {
        super();
        this._appElement = _appElement;
        this._viewFactory = _viewFactory;
    }
    createEmbeddedView() {
        var view = this._viewFactory(this._appElement.parentView.viewUtils, this._appElement.parentInjector, this._appElement);
        view.create(null, null);
        return view.ref;
    }
    get elementRef() { return this._appElement.elementRef; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3RlbXBsYXRlX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQTs7Ozs7Ozs7Ozs7R0FXRztBQUNIO0lBQ0U7Ozs7Ozs7Ozs7T0FVRztJQUNILHdDQUF3QztJQUN4QyxJQUFJLFVBQVUsS0FBaUIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFHL0MsQ0FBQztBQUVELGtDQUFrQyxXQUFXO0lBQzNDLFlBQW9CLFdBQXVCLEVBQVUsWUFBc0I7UUFBSSxPQUFPLENBQUM7UUFBbkUsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBVTtJQUFhLENBQUM7SUFFekYsa0JBQWtCO1FBQ2hCLElBQUksSUFBSSxHQUFpQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxJQUFJLFVBQVUsS0FBaUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0VsZW1lbnRSZWZ9IGZyb20gJy4vZWxlbWVudF9yZWYnO1xuaW1wb3J0IHtBcHBFbGVtZW50fSBmcm9tICcuL2VsZW1lbnQnO1xuaW1wb3J0IHtBcHBWaWV3fSBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IHtFbWJlZGRlZFZpZXdSZWZ9IGZyb20gJy4vdmlld19yZWYnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gRW1iZWRkZWQgVGVtcGxhdGUgdGhhdCBjYW4gYmUgdXNlZCB0byBpbnN0YW50aWF0ZSBFbWJlZGRlZCBWaWV3cy5cbiAqXG4gKiBZb3UgY2FuIGFjY2VzcyBhIGBUZW1wbGF0ZVJlZmAsIGluIHR3byB3YXlzLiBWaWEgYSBkaXJlY3RpdmUgcGxhY2VkIG9uIGEgYDx0ZW1wbGF0ZT5gIGVsZW1lbnQgKG9yXG4gKiBkaXJlY3RpdmUgcHJlZml4ZWQgd2l0aCBgKmApIGFuZCBoYXZlIHRoZSBgVGVtcGxhdGVSZWZgIGZvciB0aGlzIEVtYmVkZGVkIFZpZXcgaW5qZWN0ZWQgaW50byB0aGVcbiAqIGNvbnN0cnVjdG9yIG9mIHRoZSBkaXJlY3RpdmUgdXNpbmcgdGhlIGBUZW1wbGF0ZVJlZmAgVG9rZW4uIEFsdGVybmF0aXZlbHkgeW91IGNhbiBxdWVyeSBmb3IgdGhlXG4gKiBgVGVtcGxhdGVSZWZgIGZyb20gYSBDb21wb25lbnQgb3IgYSBEaXJlY3RpdmUgdmlhIHtAbGluayBRdWVyeX0uXG4gKlxuICogVG8gaW5zdGFudGlhdGUgRW1iZWRkZWQgVmlld3MgYmFzZWQgb24gYSBUZW1wbGF0ZSwgdXNlXG4gKiB7QGxpbmsgVmlld0NvbnRhaW5lclJlZiNjcmVhdGVFbWJlZGRlZFZpZXd9LCB3aGljaCB3aWxsIGNyZWF0ZSB0aGUgVmlldyBhbmQgYXR0YWNoIGl0IHRvIHRoZVxuICogVmlldyBDb250YWluZXIuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUZW1wbGF0ZVJlZiB7XG4gIC8qKlxuICAgKiBUaGUgbG9jYXRpb24gaW4gdGhlIFZpZXcgd2hlcmUgdGhlIEVtYmVkZGVkIFZpZXcgbG9naWNhbGx5IGJlbG9uZ3MgdG8uXG4gICAqXG4gICAqIFRoZSBkYXRhLWJpbmRpbmcgYW5kIGluamVjdGlvbiBjb250ZXh0cyBvZiBFbWJlZGRlZCBWaWV3cyBjcmVhdGVkIGZyb20gdGhpcyBgVGVtcGxhdGVSZWZgXG4gICAqIGluaGVyaXQgZnJvbSB0aGUgY29udGV4dHMgb2YgdGhpcyBsb2NhdGlvbi5cbiAgICpcbiAgICogVHlwaWNhbGx5IG5ldyBFbWJlZGRlZCBWaWV3cyBhcmUgYXR0YWNoZWQgdG8gdGhlIFZpZXcgQ29udGFpbmVyIG9mIHRoaXMgbG9jYXRpb24sIGJ1dCBpblxuICAgKiBhZHZhbmNlZCB1c2UtY2FzZXMsIHRoZSBWaWV3IGNhbiBiZSBhdHRhY2hlZCB0byBhIGRpZmZlcmVudCBjb250YWluZXIgd2hpbGUga2VlcGluZyB0aGVcbiAgICogZGF0YS1iaW5kaW5nIGFuZCBpbmplY3Rpb24gY29udGV4dCBmcm9tIHRoZSBvcmlnaW5hbCBsb2NhdGlvbi5cbiAgICpcbiAgICovXG4gIC8vIFRPRE8oaSk6IHJlbmFtZSB0byBhbmNob3Igb3IgbG9jYXRpb25cbiAgZ2V0IGVsZW1lbnRSZWYoKTogRWxlbWVudFJlZiB7IHJldHVybiBudWxsOyB9XG5cbiAgYWJzdHJhY3QgY3JlYXRlRW1iZWRkZWRWaWV3KCk6IEVtYmVkZGVkVmlld1JlZjtcbn1cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlUmVmXyBleHRlbmRzIFRlbXBsYXRlUmVmIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfYXBwRWxlbWVudDogQXBwRWxlbWVudCwgcHJpdmF0ZSBfdmlld0ZhY3Rvcnk6IEZ1bmN0aW9uKSB7IHN1cGVyKCk7IH1cblxuICBjcmVhdGVFbWJlZGRlZFZpZXcoKTogRW1iZWRkZWRWaWV3UmVmIHtcbiAgICB2YXIgdmlldzogQXBwVmlldzxhbnk+ID0gdGhpcy5fdmlld0ZhY3RvcnkodGhpcy5fYXBwRWxlbWVudC5wYXJlbnRWaWV3LnZpZXdVdGlscyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXBwRWxlbWVudC5wYXJlbnRJbmplY3RvciwgdGhpcy5fYXBwRWxlbWVudCk7XG4gICAgdmlldy5jcmVhdGUobnVsbCwgbnVsbCk7XG4gICAgcmV0dXJuIHZpZXcucmVmO1xuICB9XG5cbiAgZ2V0IGVsZW1lbnRSZWYoKTogRWxlbWVudFJlZiB7IHJldHVybiB0aGlzLl9hcHBFbGVtZW50LmVsZW1lbnRSZWY7IH1cbn1cbiJdfQ==