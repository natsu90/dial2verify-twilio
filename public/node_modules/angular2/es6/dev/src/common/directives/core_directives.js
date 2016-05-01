import { CONST_EXPR } from 'angular2/src/facade/lang';
import { NgClass } from './ng_class';
import { NgFor } from './ng_for';
import { NgIf } from './ng_if';
import { NgTemplateOutlet } from './ng_template_outlet';
import { NgStyle } from './ng_style';
import { NgSwitch, NgSwitchWhen, NgSwitchDefault } from './ng_switch';
import { NgPlural, NgPluralCase } from './ng_plural';
/**
 * A collection of Angular core directives that are likely to be used in each and every Angular
 * application.
 *
 * This collection can be used to quickly enumerate all the built-in directives in the `directives`
 * property of the `@Component` annotation.
 *
 * ### Example ([live demo](http://plnkr.co/edit/yakGwpCdUkg0qfzX5m8g?p=preview))
 *
 * Instead of writing:
 *
 * ```typescript
 * import {NgClass, NgIf, NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault} from 'angular2/common';
 * import {OtherDirective} from './myDirectives';
 *
 * @Component({
 *   selector: 'my-component',
 *   templateUrl: 'myComponent.html',
 *   directives: [NgClass, NgIf, NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault, OtherDirective]
 * })
 * export class MyComponent {
 *   ...
 * }
 * ```
 * one could import all the core directives at once:
 *
 * ```typescript
 * import {CORE_DIRECTIVES} from 'angular2/common';
 * import {OtherDirective} from './myDirectives';
 *
 * @Component({
 *   selector: 'my-component',
 *   templateUrl: 'myComponent.html',
 *   directives: [CORE_DIRECTIVES, OtherDirective]
 * })
 * export class MyComponent {
 *   ...
 * }
 * ```
 */
export const CORE_DIRECTIVES = CONST_EXPR([
    NgClass,
    NgFor,
    NgIf,
    NgTemplateOutlet,
    NgStyle,
    NgSwitch,
    NgSwitchWhen,
    NgSwitchDefault,
    NgPlural,
    NgPluralCase
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZV9kaXJlY3RpdmVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL2NvbW1vbi9kaXJlY3RpdmVzL2NvcmVfZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFVBQVUsRUFBTyxNQUFNLDBCQUEwQjtPQUNsRCxFQUFDLE9BQU8sRUFBQyxNQUFNLFlBQVk7T0FDM0IsRUFBQyxLQUFLLEVBQUMsTUFBTSxVQUFVO09BQ3ZCLEVBQUMsSUFBSSxFQUFDLE1BQU0sU0FBUztPQUNyQixFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCO09BQzlDLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWTtPQUMzQixFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFDLE1BQU0sYUFBYTtPQUM1RCxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUMsTUFBTSxhQUFhO0FBRWxEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Q0c7QUFDSCxPQUFPLE1BQU0sZUFBZSxHQUFXLFVBQVUsQ0FBQztJQUNoRCxPQUFPO0lBQ1AsS0FBSztJQUNMLElBQUk7SUFDSixnQkFBZ0I7SUFDaEIsT0FBTztJQUNQLFFBQVE7SUFDUixZQUFZO0lBQ1osZUFBZTtJQUNmLFFBQVE7SUFDUixZQUFZO0NBQ2IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDT05TVF9FWFBSLCBUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtOZ0NsYXNzfSBmcm9tICcuL25nX2NsYXNzJztcbmltcG9ydCB7TmdGb3J9IGZyb20gJy4vbmdfZm9yJztcbmltcG9ydCB7TmdJZn0gZnJvbSAnLi9uZ19pZic7XG5pbXBvcnQge05nVGVtcGxhdGVPdXRsZXR9IGZyb20gJy4vbmdfdGVtcGxhdGVfb3V0bGV0JztcbmltcG9ydCB7TmdTdHlsZX0gZnJvbSAnLi9uZ19zdHlsZSc7XG5pbXBvcnQge05nU3dpdGNoLCBOZ1N3aXRjaFdoZW4sIE5nU3dpdGNoRGVmYXVsdH0gZnJvbSAnLi9uZ19zd2l0Y2gnO1xuaW1wb3J0IHtOZ1BsdXJhbCwgTmdQbHVyYWxDYXNlfSBmcm9tICcuL25nX3BsdXJhbCc7XG5cbi8qKlxuICogQSBjb2xsZWN0aW9uIG9mIEFuZ3VsYXIgY29yZSBkaXJlY3RpdmVzIHRoYXQgYXJlIGxpa2VseSB0byBiZSB1c2VkIGluIGVhY2ggYW5kIGV2ZXJ5IEFuZ3VsYXJcbiAqIGFwcGxpY2F0aW9uLlxuICpcbiAqIFRoaXMgY29sbGVjdGlvbiBjYW4gYmUgdXNlZCB0byBxdWlja2x5IGVudW1lcmF0ZSBhbGwgdGhlIGJ1aWx0LWluIGRpcmVjdGl2ZXMgaW4gdGhlIGBkaXJlY3RpdmVzYFxuICogcHJvcGVydHkgb2YgdGhlIGBAQ29tcG9uZW50YCBhbm5vdGF0aW9uLlxuICpcbiAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC95YWtHd3BDZFVrZzBxZnpYNW04Zz9wPXByZXZpZXcpKVxuICpcbiAqIEluc3RlYWQgb2Ygd3JpdGluZzpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQge05nQ2xhc3MsIE5nSWYsIE5nRm9yLCBOZ1N3aXRjaCwgTmdTd2l0Y2hXaGVuLCBOZ1N3aXRjaERlZmF1bHR9IGZyb20gJ2FuZ3VsYXIyL2NvbW1vbic7XG4gKiBpbXBvcnQge090aGVyRGlyZWN0aXZlfSBmcm9tICcuL215RGlyZWN0aXZlcyc7XG4gKlxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAnbXktY29tcG9uZW50JyxcbiAqICAgdGVtcGxhdGVVcmw6ICdteUNvbXBvbmVudC5odG1sJyxcbiAqICAgZGlyZWN0aXZlczogW05nQ2xhc3MsIE5nSWYsIE5nRm9yLCBOZ1N3aXRjaCwgTmdTd2l0Y2hXaGVuLCBOZ1N3aXRjaERlZmF1bHQsIE90aGVyRGlyZWN0aXZlXVxuICogfSlcbiAqIGV4cG9ydCBjbGFzcyBNeUNvbXBvbmVudCB7XG4gKiAgIC4uLlxuICogfVxuICogYGBgXG4gKiBvbmUgY291bGQgaW1wb3J0IGFsbCB0aGUgY29yZSBkaXJlY3RpdmVzIGF0IG9uY2U6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHtDT1JFX0RJUkVDVElWRVN9IGZyb20gJ2FuZ3VsYXIyL2NvbW1vbic7XG4gKiBpbXBvcnQge090aGVyRGlyZWN0aXZlfSBmcm9tICcuL215RGlyZWN0aXZlcyc7XG4gKlxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAnbXktY29tcG9uZW50JyxcbiAqICAgdGVtcGxhdGVVcmw6ICdteUNvbXBvbmVudC5odG1sJyxcbiAqICAgZGlyZWN0aXZlczogW0NPUkVfRElSRUNUSVZFUywgT3RoZXJEaXJlY3RpdmVdXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IHtcbiAqICAgLi4uXG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IENPUkVfRElSRUNUSVZFUzogVHlwZVtdID0gQ09OU1RfRVhQUihbXG4gIE5nQ2xhc3MsXG4gIE5nRm9yLFxuICBOZ0lmLFxuICBOZ1RlbXBsYXRlT3V0bGV0LFxuICBOZ1N0eWxlLFxuICBOZ1N3aXRjaCxcbiAgTmdTd2l0Y2hXaGVuLFxuICBOZ1N3aXRjaERlZmF1bHQsXG4gIE5nUGx1cmFsLFxuICBOZ1BsdXJhbENhc2Vcbl0pO1xuIl19