import { stringify, isBlank } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { resolveForwardRef } from './forward_ref';
/**
 * A unique object used for retrieving items from the {@link ReflectiveInjector}.
 *
 * Keys have:
 * - a system-wide unique `id`.
 * - a `token`.
 *
 * `Key` is used internally by {@link ReflectiveInjector} because its system-wide unique `id` allows
 * the
 * injector to store created objects in a more efficient way.
 *
 * `Key` should not be created directly. {@link ReflectiveInjector} creates keys automatically when
 * resolving
 * providers.
 */
export class ReflectiveKey {
    /**
     * Private
     */
    constructor(token, id) {
        this.token = token;
        this.id = id;
        if (isBlank(token)) {
            throw new BaseException('Token must be defined!');
        }
    }
    /**
     * Returns a stringified token.
     */
    get displayName() { return stringify(this.token); }
    /**
     * Retrieves a `Key` for a token.
     */
    static get(token) {
        return _globalKeyRegistry.get(resolveForwardRef(token));
    }
    /**
     * @returns the number of keys registered in the system.
     */
    static get numberOfKeys() { return _globalKeyRegistry.numberOfKeys; }
}
/**
 * @internal
 */
export class KeyRegistry {
    constructor() {
        this._allKeys = new Map();
    }
    get(token) {
        if (token instanceof ReflectiveKey)
            return token;
        if (this._allKeys.has(token)) {
            return this._allKeys.get(token);
        }
        var newKey = new ReflectiveKey(token, ReflectiveKey.numberOfKeys);
        this._allKeys.set(token, newKey);
        return newKey;
    }
    get numberOfKeys() { return this._allKeys.size; }
}
var _globalKeyRegistry = new KeyRegistry();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9rZXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTlEMWlHUVZHLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9kaS9yZWZsZWN0aXZlX2tleS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFNBQVMsRUFBZSxPQUFPLEVBQUMsTUFBTSwwQkFBMEI7T0FDakUsRUFBQyxhQUFhLEVBQW1CLE1BQU0sZ0NBQWdDO09BQ3ZFLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxlQUFlO0FBRS9DOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0g7SUFDRTs7T0FFRztJQUNILFlBQW1CLEtBQWEsRUFBUyxFQUFVO1FBQWhDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxJQUFJLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3BELENBQUM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLFdBQVcsS0FBYSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0Q7O09BRUc7SUFDSCxPQUFPLEdBQUcsQ0FBQyxLQUFhO1FBQ3RCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxXQUFXLFlBQVksS0FBYSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBRUQ7O0dBRUc7QUFDSDtJQUFBO1FBQ1UsYUFBUSxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO0lBZXRELENBQUM7SUFiQyxHQUFHLENBQUMsS0FBYTtRQUNmLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxhQUFhLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRWpELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUVELElBQUksTUFBTSxHQUFHLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELElBQUksWUFBWSxLQUFhLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUVELElBQUksa0JBQWtCLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7c3RyaW5naWZ5LCBDT05TVCwgVHlwZSwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgV3JhcHBlZEV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7cmVzb2x2ZUZvcndhcmRSZWZ9IGZyb20gJy4vZm9yd2FyZF9yZWYnO1xuXG4vKipcbiAqIEEgdW5pcXVlIG9iamVjdCB1c2VkIGZvciByZXRyaWV2aW5nIGl0ZW1zIGZyb20gdGhlIHtAbGluayBSZWZsZWN0aXZlSW5qZWN0b3J9LlxuICpcbiAqIEtleXMgaGF2ZTpcbiAqIC0gYSBzeXN0ZW0td2lkZSB1bmlxdWUgYGlkYC5cbiAqIC0gYSBgdG9rZW5gLlxuICpcbiAqIGBLZXlgIGlzIHVzZWQgaW50ZXJuYWxseSBieSB7QGxpbmsgUmVmbGVjdGl2ZUluamVjdG9yfSBiZWNhdXNlIGl0cyBzeXN0ZW0td2lkZSB1bmlxdWUgYGlkYCBhbGxvd3NcbiAqIHRoZVxuICogaW5qZWN0b3IgdG8gc3RvcmUgY3JlYXRlZCBvYmplY3RzIGluIGEgbW9yZSBlZmZpY2llbnQgd2F5LlxuICpcbiAqIGBLZXlgIHNob3VsZCBub3QgYmUgY3JlYXRlZCBkaXJlY3RseS4ge0BsaW5rIFJlZmxlY3RpdmVJbmplY3Rvcn0gY3JlYXRlcyBrZXlzIGF1dG9tYXRpY2FsbHkgd2hlblxuICogcmVzb2x2aW5nXG4gKiBwcm92aWRlcnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWZsZWN0aXZlS2V5IHtcbiAgLyoqXG4gICAqIFByaXZhdGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0b2tlbjogT2JqZWN0LCBwdWJsaWMgaWQ6IG51bWJlcikge1xuICAgIGlmIChpc0JsYW5rKHRva2VuKSkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ1Rva2VuIG11c3QgYmUgZGVmaW5lZCEnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZ2lmaWVkIHRva2VuLlxuICAgKi9cbiAgZ2V0IGRpc3BsYXlOYW1lKCk6IHN0cmluZyB7IHJldHVybiBzdHJpbmdpZnkodGhpcy50b2tlbik7IH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGEgYEtleWAgZm9yIGEgdG9rZW4uXG4gICAqL1xuICBzdGF0aWMgZ2V0KHRva2VuOiBPYmplY3QpOiBSZWZsZWN0aXZlS2V5IHtcbiAgICByZXR1cm4gX2dsb2JhbEtleVJlZ2lzdHJ5LmdldChyZXNvbHZlRm9yd2FyZFJlZih0b2tlbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHRoZSBudW1iZXIgb2Yga2V5cyByZWdpc3RlcmVkIGluIHRoZSBzeXN0ZW0uXG4gICAqL1xuICBzdGF0aWMgZ2V0IG51bWJlck9mS2V5cygpOiBudW1iZXIgeyByZXR1cm4gX2dsb2JhbEtleVJlZ2lzdHJ5Lm51bWJlck9mS2V5czsgfVxufVxuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgS2V5UmVnaXN0cnkge1xuICBwcml2YXRlIF9hbGxLZXlzID0gbmV3IE1hcDxPYmplY3QsIFJlZmxlY3RpdmVLZXk+KCk7XG5cbiAgZ2V0KHRva2VuOiBPYmplY3QpOiBSZWZsZWN0aXZlS2V5IHtcbiAgICBpZiAodG9rZW4gaW5zdGFuY2VvZiBSZWZsZWN0aXZlS2V5KSByZXR1cm4gdG9rZW47XG5cbiAgICBpZiAodGhpcy5fYWxsS2V5cy5oYXModG9rZW4pKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYWxsS2V5cy5nZXQodG9rZW4pO1xuICAgIH1cblxuICAgIHZhciBuZXdLZXkgPSBuZXcgUmVmbGVjdGl2ZUtleSh0b2tlbiwgUmVmbGVjdGl2ZUtleS5udW1iZXJPZktleXMpO1xuICAgIHRoaXMuX2FsbEtleXMuc2V0KHRva2VuLCBuZXdLZXkpO1xuICAgIHJldHVybiBuZXdLZXk7XG4gIH1cblxuICBnZXQgbnVtYmVyT2ZLZXlzKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9hbGxLZXlzLnNpemU7IH1cbn1cblxudmFyIF9nbG9iYWxLZXlSZWdpc3RyeSA9IG5ldyBLZXlSZWdpc3RyeSgpO1xuIl19