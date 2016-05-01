var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CONST, isStringMap, StringWrapper, isPresent, RegExpWrapper } from 'angular2/src/facade/lang';
import { Injectable, Pipe } from 'angular2/core';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
var interpolationExp = RegExpWrapper.create('#');
/**
 *
 *  Maps a value to a string that pluralizes the value properly.
 *
 *  ## Usage
 *
 *  expression | i18nPlural:mapping
 *
 *  where `expression` is a number and `mapping` is an object that indicates the proper text for
 *  when the `expression` evaluates to 0, 1, or some other number.  You can interpolate the actual
 *  value into the text using the `#` sign.
 *
 *  ## Example
 *
 *  ```
 *  <div>
 *    {{ messages.length | i18nPlural: messageMapping }}
 *  </div>
 *
 *  class MyApp {
 *    messages: any[];
 *    messageMapping: any = {
 *      '=0': 'No messages.',
 *      '=1': 'One message.',
 *      'other': '# messages.'
 *    }
 *    ...
 *  }
 *  ```
 *
 */
let I18nPluralPipe_1;
export let I18nPluralPipe = I18nPluralPipe_1 = class I18nPluralPipe {
    transform(value, pluralMap) {
        var key;
        var valueStr;
        if (!isStringMap(pluralMap)) {
            throw new InvalidPipeArgumentException(I18nPluralPipe_1, pluralMap);
        }
        key = value === 0 || value === 1 ? `=${value}` : 'other';
        valueStr = isPresent(value) ? value.toString() : '';
        return StringWrapper.replaceAll(pluralMap[key], interpolationExp, valueStr);
    }
};
I18nPluralPipe = I18nPluralPipe_1 = __decorate([
    CONST(),
    Pipe({ name: 'i18nPlural', pure: true }),
    Injectable(), 
    __metadata('design:paramtypes', [])
], I18nPluralPipe);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9wbHVyYWxfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vcGlwZXMvaTE4bl9wbHVyYWxfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUNMLEtBQUssRUFDTCxXQUFXLEVBQ1gsYUFBYSxFQUNiLFNBQVMsRUFDVCxhQUFhLEVBQ2QsTUFBTSwwQkFBMEI7T0FDMUIsRUFBQyxVQUFVLEVBQWlCLElBQUksRUFBQyxNQUFNLGVBQWU7T0FDdEQsRUFBQyw0QkFBNEIsRUFBQyxNQUFNLG1DQUFtQztBQUU5RSxJQUFJLGdCQUFnQixHQUFXLGFBQWEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFekQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCRztBQUlIOztJQUNFLFNBQVMsQ0FBQyxLQUFhLEVBQUUsU0FBb0M7UUFDM0QsSUFBSSxHQUFXLENBQUM7UUFDaEIsSUFBSSxRQUFnQixDQUFDO1FBRXJCLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLElBQUksNEJBQTRCLENBQUMsZ0JBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRUQsR0FBRyxHQUFHLEtBQUssS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUN6RCxRQUFRLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFFcEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlFLENBQUM7QUFDSCxDQUFDO0FBakJEO0lBQUMsS0FBSyxFQUFFO0lBQ1AsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFDdEMsVUFBVSxFQUFFOztrQkFBQTtBQWVaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ09OU1QsXG4gIGlzU3RyaW5nTWFwLFxuICBTdHJpbmdXcmFwcGVyLFxuICBpc1ByZXNlbnQsXG4gIFJlZ0V4cFdyYXBwZXJcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7SW5qZWN0YWJsZSwgUGlwZVRyYW5zZm9ybSwgUGlwZX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge0ludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb259IGZyb20gJy4vaW52YWxpZF9waXBlX2FyZ3VtZW50X2V4Y2VwdGlvbic7XG5cbnZhciBpbnRlcnBvbGF0aW9uRXhwOiBSZWdFeHAgPSBSZWdFeHBXcmFwcGVyLmNyZWF0ZSgnIycpO1xuXG4vKipcbiAqXG4gKiAgTWFwcyBhIHZhbHVlIHRvIGEgc3RyaW5nIHRoYXQgcGx1cmFsaXplcyB0aGUgdmFsdWUgcHJvcGVybHkuXG4gKlxuICogICMjIFVzYWdlXG4gKlxuICogIGV4cHJlc3Npb24gfCBpMThuUGx1cmFsOm1hcHBpbmdcbiAqXG4gKiAgd2hlcmUgYGV4cHJlc3Npb25gIGlzIGEgbnVtYmVyIGFuZCBgbWFwcGluZ2AgaXMgYW4gb2JqZWN0IHRoYXQgaW5kaWNhdGVzIHRoZSBwcm9wZXIgdGV4dCBmb3JcbiAqICB3aGVuIHRoZSBgZXhwcmVzc2lvbmAgZXZhbHVhdGVzIHRvIDAsIDEsIG9yIHNvbWUgb3RoZXIgbnVtYmVyLiAgWW91IGNhbiBpbnRlcnBvbGF0ZSB0aGUgYWN0dWFsXG4gKiAgdmFsdWUgaW50byB0aGUgdGV4dCB1c2luZyB0aGUgYCNgIHNpZ24uXG4gKlxuICogICMjIEV4YW1wbGVcbiAqXG4gKiAgYGBgXG4gKiAgPGRpdj5cbiAqICAgIHt7IG1lc3NhZ2VzLmxlbmd0aCB8IGkxOG5QbHVyYWw6IG1lc3NhZ2VNYXBwaW5nIH19XG4gKiAgPC9kaXY+XG4gKlxuICogIGNsYXNzIE15QXBwIHtcbiAqICAgIG1lc3NhZ2VzOiBhbnlbXTtcbiAqICAgIG1lc3NhZ2VNYXBwaW5nOiBhbnkgPSB7XG4gKiAgICAgICc9MCc6ICdObyBtZXNzYWdlcy4nLFxuICogICAgICAnPTEnOiAnT25lIG1lc3NhZ2UuJyxcbiAqICAgICAgJ290aGVyJzogJyMgbWVzc2FnZXMuJ1xuICogICAgfVxuICogICAgLi4uXG4gKiAgfVxuICogIGBgYFxuICpcbiAqL1xuQENPTlNUKClcbkBQaXBlKHtuYW1lOiAnaTE4blBsdXJhbCcsIHB1cmU6IHRydWV9KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEkxOG5QbHVyYWxQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybSh2YWx1ZTogbnVtYmVyLCBwbHVyYWxNYXA6IHtbY291bnQ6IHN0cmluZ106IHN0cmluZ30pOiBzdHJpbmcge1xuICAgIHZhciBrZXk6IHN0cmluZztcbiAgICB2YXIgdmFsdWVTdHI6IHN0cmluZztcblxuICAgIGlmICghaXNTdHJpbmdNYXAocGx1cmFsTWFwKSkge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb24oSTE4blBsdXJhbFBpcGUsIHBsdXJhbE1hcCk7XG4gICAgfVxuXG4gICAga2V5ID0gdmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IDEgPyBgPSR7dmFsdWV9YCA6ICdvdGhlcic7XG4gICAgdmFsdWVTdHIgPSBpc1ByZXNlbnQodmFsdWUpID8gdmFsdWUudG9TdHJpbmcoKSA6ICcnO1xuXG4gICAgcmV0dXJuIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbChwbHVyYWxNYXBba2V5XSwgaW50ZXJwb2xhdGlvbkV4cCwgdmFsdWVTdHIpO1xuICB9XG59XG4iXX0=