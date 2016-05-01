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
var collection_1 = require('angular2/src/facade/collection');
var core_1 = require('angular2/core');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
/**
 *
 *  Generic selector that displays the string that matches the current value.
 *
 *  ## Usage
 *
 *  expression | i18nSelect:mapping
 *
 *  where `mapping` is an object that indicates the text that should be displayed
 *  for different values of the provided `expression`.
 *
 *  ## Example
 *
 *  ```
 *  <div>
 *    {{ gender | i18nSelect: inviteMap }}
 *  </div>
 *
 *  class MyApp {
 *    gender: string = 'male';
 *    inviteMap: any = {
 *      'male': 'Invite her.',
 *      'female': 'Invite him.',
 *      'other': 'Invite them.'
 *    }
 *    ...
 *  }
 *  ```
 */
var I18nSelectPipe = (function () {
    function I18nSelectPipe() {
    }
    I18nSelectPipe.prototype.transform = function (value, mapping) {
        if (!lang_1.isStringMap(mapping)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(I18nSelectPipe, mapping);
        }
        return collection_1.StringMapWrapper.contains(mapping, value) ? mapping[value] : mapping['other'];
    };
    I18nSelectPipe = __decorate([
        lang_1.CONST(),
        core_1.Pipe({ name: 'i18nSelect', pure: true }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], I18nSelectPipe);
    return I18nSelectPipe;
}());
exports.I18nSelectPipe = I18nSelectPipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9zZWxlY3RfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vcGlwZXMvaTE4bl9zZWxlY3RfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQWlDLDBCQUEwQixDQUFDLENBQUE7QUFDNUQsMkJBQStCLGdDQUFnQyxDQUFDLENBQUE7QUFDaEUscUJBQThDLGVBQWUsQ0FBQyxDQUFBO0FBQzlELGdEQUEyQyxtQ0FBbUMsQ0FBQyxDQUFBO0FBRS9FOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBSUg7SUFBQTtJQVFBLENBQUM7SUFQQyxrQ0FBUyxHQUFULFVBQVUsS0FBYSxFQUFFLE9BQWdDO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLENBQUMsa0JBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxJQUFJLDhEQUE0QixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBRUQsTUFBTSxDQUFDLDZCQUFnQixDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBVkg7UUFBQyxZQUFLLEVBQUU7UUFDUCxXQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUN0QyxpQkFBVSxFQUFFOztzQkFBQTtJQVNiLHFCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFSWSxzQkFBYyxpQkFRMUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q09OU1QsIGlzU3RyaW5nTWFwfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtJbmplY3RhYmxlLCBQaXBlVHJhbnNmb3JtLCBQaXBlfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7SW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbn0gZnJvbSAnLi9pbnZhbGlkX3BpcGVfYXJndW1lbnRfZXhjZXB0aW9uJztcblxuLyoqXG4gKlxuICogIEdlbmVyaWMgc2VsZWN0b3IgdGhhdCBkaXNwbGF5cyB0aGUgc3RyaW5nIHRoYXQgbWF0Y2hlcyB0aGUgY3VycmVudCB2YWx1ZS5cbiAqXG4gKiAgIyMgVXNhZ2VcbiAqXG4gKiAgZXhwcmVzc2lvbiB8IGkxOG5TZWxlY3Q6bWFwcGluZ1xuICpcbiAqICB3aGVyZSBgbWFwcGluZ2AgaXMgYW4gb2JqZWN0IHRoYXQgaW5kaWNhdGVzIHRoZSB0ZXh0IHRoYXQgc2hvdWxkIGJlIGRpc3BsYXllZFxuICogIGZvciBkaWZmZXJlbnQgdmFsdWVzIG9mIHRoZSBwcm92aWRlZCBgZXhwcmVzc2lvbmAuXG4gKlxuICogICMjIEV4YW1wbGVcbiAqXG4gKiAgYGBgXG4gKiAgPGRpdj5cbiAqICAgIHt7IGdlbmRlciB8IGkxOG5TZWxlY3Q6IGludml0ZU1hcCB9fVxuICogIDwvZGl2PlxuICpcbiAqICBjbGFzcyBNeUFwcCB7XG4gKiAgICBnZW5kZXI6IHN0cmluZyA9ICdtYWxlJztcbiAqICAgIGludml0ZU1hcDogYW55ID0ge1xuICogICAgICAnbWFsZSc6ICdJbnZpdGUgaGVyLicsXG4gKiAgICAgICdmZW1hbGUnOiAnSW52aXRlIGhpbS4nLFxuICogICAgICAnb3RoZXInOiAnSW52aXRlIHRoZW0uJ1xuICogICAgfVxuICogICAgLi4uXG4gKiAgfVxuICogIGBgYFxuICovXG5AQ09OU1QoKVxuQFBpcGUoe25hbWU6ICdpMThuU2VsZWN0JywgcHVyZTogdHJ1ZX0pXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSTE4blNlbGVjdFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKHZhbHVlOiBzdHJpbmcsIG1hcHBpbmc6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9KTogc3RyaW5nIHtcbiAgICBpZiAoIWlzU3RyaW5nTWFwKG1hcHBpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbihJMThuU2VsZWN0UGlwZSwgbWFwcGluZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZ01hcFdyYXBwZXIuY29udGFpbnMobWFwcGluZywgdmFsdWUpID8gbWFwcGluZ1t2YWx1ZV0gOiBtYXBwaW5nWydvdGhlciddO1xuICB9XG59XG4iXX0=