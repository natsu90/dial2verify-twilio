var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Json, CONST } from 'angular2/src/facade/lang';
import { Injectable, Pipe } from 'angular2/core';
/**
 * Transforms any input value using `JSON.stringify`. Useful for debugging.
 *
 * ### Example
 * {@example core/pipes/ts/json_pipe/json_pipe_example.ts region='JsonPipe'}
 */
export let JsonPipe = class JsonPipe {
    transform(value) { return Json.stringify(value); }
};
JsonPipe = __decorate([
    CONST(),
    Pipe({ name: 'json', pure: false }),
    Injectable(), 
    __metadata('design:paramtypes', [])
], JsonPipe);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbl9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL2NvbW1vbi9waXBlcy9qc29uX3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFBcUIsSUFBSSxFQUFFLEtBQUssRUFBQyxNQUFNLDBCQUEwQjtPQUNqRSxFQUFDLFVBQVUsRUFBK0IsSUFBSSxFQUFDLE1BQU0sZUFBZTtBQUUzRTs7Ozs7R0FLRztBQUlIO0lBQ0UsU0FBUyxDQUFDLEtBQVUsSUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUxEO0lBQUMsS0FBSyxFQUFFO0lBQ1AsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUM7SUFDakMsVUFBVSxFQUFFOztZQUFBO0FBR1oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQmxhbmssIGlzUHJlc2VudCwgSnNvbiwgQ09OU1R9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0luamVjdGFibGUsIFBpcGVUcmFuc2Zvcm0sIFdyYXBwZWRWYWx1ZSwgUGlwZX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5cbi8qKlxuICogVHJhbnNmb3JtcyBhbnkgaW5wdXQgdmFsdWUgdXNpbmcgYEpTT04uc3RyaW5naWZ5YC4gVXNlZnVsIGZvciBkZWJ1Z2dpbmcuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqIHtAZXhhbXBsZSBjb3JlL3BpcGVzL3RzL2pzb25fcGlwZS9qc29uX3BpcGVfZXhhbXBsZS50cyByZWdpb249J0pzb25QaXBlJ31cbiAqL1xuQENPTlNUKClcbkBQaXBlKHtuYW1lOiAnanNvbicsIHB1cmU6IGZhbHNlfSlcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBKc29uUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IGFueSk6IHN0cmluZyB7IHJldHVybiBKc29uLnN0cmluZ2lmeSh2YWx1ZSk7IH1cbn1cbiJdfQ==