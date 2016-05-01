'use strict';"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var lang_1 = require('angular2/src/facade/lang');
var core_1 = require('angular2/core');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var interpolationExp = lang_1.RegExpWrapper.create('#');
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
var I18nPluralPipe = (function () {
    function I18nPluralPipe() {
    }
    I18nPluralPipe.prototype.transform = function (value, pluralMap) {
        var key;
        var valueStr;
        if (!lang_1.isStringMap(pluralMap)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(I18nPluralPipe, pluralMap);
        }
        key = value === 0 || value === 1 ? "=" + value : 'other';
        valueStr = lang_1.isPresent(value) ? value.toString() : '';
        return lang_1.StringWrapper.replaceAll(pluralMap[key], interpolationExp, valueStr);
    };
    I18nPluralPipe = __decorate([
        lang_1.CONST(),
        core_1.Pipe({ name: 'i18nPlural', pure: true }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], I18nPluralPipe);
    return I18nPluralPipe;
}());
exports.I18nPluralPipe = I18nPluralPipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9wbHVyYWxfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vcGlwZXMvaTE4bl9wbHVyYWxfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBTU8sMEJBQTBCLENBQUMsQ0FBQTtBQUNsQyxxQkFBOEMsZUFBZSxDQUFDLENBQUE7QUFDOUQsZ0RBQTJDLG1DQUFtQyxDQUFDLENBQUE7QUFFL0UsSUFBSSxnQkFBZ0IsR0FBVyxvQkFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV6RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOEJHO0FBSUg7SUFBQTtJQWNBLENBQUM7SUFiQyxrQ0FBUyxHQUFULFVBQVUsS0FBYSxFQUFFLFNBQW9DO1FBQzNELElBQUksR0FBVyxDQUFDO1FBQ2hCLElBQUksUUFBZ0IsQ0FBQztRQUVyQixFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sSUFBSSw4REFBNEIsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUVELEdBQUcsR0FBRyxLQUFLLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEdBQUcsTUFBSSxLQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3pELFFBQVEsR0FBRyxnQkFBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFFcEQsTUFBTSxDQUFDLG9CQUFhLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBaEJIO1FBQUMsWUFBSyxFQUFFO1FBQ1AsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDdEMsaUJBQVUsRUFBRTs7c0JBQUE7SUFlYixxQkFBQztBQUFELENBQUMsQUFkRCxJQWNDO0FBZFksc0JBQWMsaUJBYzFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDT05TVCxcbiAgaXNTdHJpbmdNYXAsXG4gIFN0cmluZ1dyYXBwZXIsXG4gIGlzUHJlc2VudCxcbiAgUmVnRXhwV3JhcHBlclxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtJbmplY3RhYmxlLCBQaXBlVHJhbnNmb3JtLCBQaXBlfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7SW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbn0gZnJvbSAnLi9pbnZhbGlkX3BpcGVfYXJndW1lbnRfZXhjZXB0aW9uJztcblxudmFyIGludGVycG9sYXRpb25FeHA6IFJlZ0V4cCA9IFJlZ0V4cFdyYXBwZXIuY3JlYXRlKCcjJyk7XG5cbi8qKlxuICpcbiAqICBNYXBzIGEgdmFsdWUgdG8gYSBzdHJpbmcgdGhhdCBwbHVyYWxpemVzIHRoZSB2YWx1ZSBwcm9wZXJseS5cbiAqXG4gKiAgIyMgVXNhZ2VcbiAqXG4gKiAgZXhwcmVzc2lvbiB8IGkxOG5QbHVyYWw6bWFwcGluZ1xuICpcbiAqICB3aGVyZSBgZXhwcmVzc2lvbmAgaXMgYSBudW1iZXIgYW5kIGBtYXBwaW5nYCBpcyBhbiBvYmplY3QgdGhhdCBpbmRpY2F0ZXMgdGhlIHByb3BlciB0ZXh0IGZvclxuICogIHdoZW4gdGhlIGBleHByZXNzaW9uYCBldmFsdWF0ZXMgdG8gMCwgMSwgb3Igc29tZSBvdGhlciBudW1iZXIuICBZb3UgY2FuIGludGVycG9sYXRlIHRoZSBhY3R1YWxcbiAqICB2YWx1ZSBpbnRvIHRoZSB0ZXh0IHVzaW5nIHRoZSBgI2Agc2lnbi5cbiAqXG4gKiAgIyMgRXhhbXBsZVxuICpcbiAqICBgYGBcbiAqICA8ZGl2PlxuICogICAge3sgbWVzc2FnZXMubGVuZ3RoIHwgaTE4blBsdXJhbDogbWVzc2FnZU1hcHBpbmcgfX1cbiAqICA8L2Rpdj5cbiAqXG4gKiAgY2xhc3MgTXlBcHAge1xuICogICAgbWVzc2FnZXM6IGFueVtdO1xuICogICAgbWVzc2FnZU1hcHBpbmc6IGFueSA9IHtcbiAqICAgICAgJz0wJzogJ05vIG1lc3NhZ2VzLicsXG4gKiAgICAgICc9MSc6ICdPbmUgbWVzc2FnZS4nLFxuICogICAgICAnb3RoZXInOiAnIyBtZXNzYWdlcy4nXG4gKiAgICB9XG4gKiAgICAuLi5cbiAqICB9XG4gKiAgYGBgXG4gKlxuICovXG5AQ09OU1QoKVxuQFBpcGUoe25hbWU6ICdpMThuUGx1cmFsJywgcHVyZTogdHJ1ZX0pXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSTE4blBsdXJhbFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKHZhbHVlOiBudW1iZXIsIHBsdXJhbE1hcDoge1tjb3VudDogc3RyaW5nXTogc3RyaW5nfSk6IHN0cmluZyB7XG4gICAgdmFyIGtleTogc3RyaW5nO1xuICAgIHZhciB2YWx1ZVN0cjogc3RyaW5nO1xuXG4gICAgaWYgKCFpc1N0cmluZ01hcChwbHVyYWxNYXApKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbihJMThuUGx1cmFsUGlwZSwgcGx1cmFsTWFwKTtcbiAgICB9XG5cbiAgICBrZXkgPSB2YWx1ZSA9PT0gMCB8fCB2YWx1ZSA9PT0gMSA/IGA9JHt2YWx1ZX1gIDogJ290aGVyJztcbiAgICB2YWx1ZVN0ciA9IGlzUHJlc2VudCh2YWx1ZSkgPyB2YWx1ZS50b1N0cmluZygpIDogJyc7XG5cbiAgICByZXR1cm4gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsKHBsdXJhbE1hcFtrZXldLCBpbnRlcnBvbGF0aW9uRXhwLCB2YWx1ZVN0cik7XG4gIH1cbn1cbiJdfQ==