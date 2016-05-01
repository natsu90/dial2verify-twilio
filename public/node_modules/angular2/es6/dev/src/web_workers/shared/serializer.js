var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { isArray, isPresent, serializeEnum } from "angular2/src/facade/lang";
import { BaseException } from 'angular2/src/facade/exceptions';
import { Map, StringMapWrapper, MapWrapper } from "angular2/src/facade/collection";
import { RenderComponentType } from "angular2/src/core/render/api";
import { Injectable } from "angular2/src/core/di";
import { RenderStore } from 'angular2/src/web_workers/shared/render_store';
import { ViewEncapsulation, VIEW_ENCAPSULATION_VALUES } from 'angular2/src/core/metadata/view';
import { LocationType } from './serialized_types';
// PRIMITIVE is any type that does not need to be serialized (string, number, boolean)
// We set it to String so that it is considered a Type.
export const PRIMITIVE = String;
export let Serializer = class Serializer {
    constructor(_renderStore) {
        this._renderStore = _renderStore;
    }
    serialize(obj, type) {
        if (!isPresent(obj)) {
            return null;
        }
        if (isArray(obj)) {
            return obj.map(v => this.serialize(v, type));
        }
        if (type == PRIMITIVE) {
            return obj;
        }
        if (type == RenderStoreObject) {
            return this._renderStore.serialize(obj);
        }
        else if (type === RenderComponentType) {
            return this._serializeRenderComponentType(obj);
        }
        else if (type === ViewEncapsulation) {
            return serializeEnum(obj);
        }
        else if (type === LocationType) {
            return this._serializeLocation(obj);
        }
        else {
            throw new BaseException("No serializer for " + type.toString());
        }
    }
    deserialize(map, type, data) {
        if (!isPresent(map)) {
            return null;
        }
        if (isArray(map)) {
            var obj = [];
            map.forEach(val => obj.push(this.deserialize(val, type, data)));
            return obj;
        }
        if (type == PRIMITIVE) {
            return map;
        }
        if (type == RenderStoreObject) {
            return this._renderStore.deserialize(map);
        }
        else if (type === RenderComponentType) {
            return this._deserializeRenderComponentType(map);
        }
        else if (type === ViewEncapsulation) {
            return VIEW_ENCAPSULATION_VALUES[map];
        }
        else if (type === LocationType) {
            return this._deserializeLocation(map);
        }
        else {
            throw new BaseException("No deserializer for " + type.toString());
        }
    }
    mapToObject(map, type) {
        var object = {};
        var serialize = isPresent(type);
        map.forEach((value, key) => {
            if (serialize) {
                object[key] = this.serialize(value, type);
            }
            else {
                object[key] = value;
            }
        });
        return object;
    }
    /*
     * Transforms a Javascript object (StringMap) into a Map<string, V>
     * If the values need to be deserialized pass in their type
     * and they will be deserialized before being placed in the map
     */
    objectToMap(obj, type, data) {
        if (isPresent(type)) {
            var map = new Map();
            StringMapWrapper.forEach(obj, (val, key) => { map.set(key, this.deserialize(val, type, data)); });
            return map;
        }
        else {
            return MapWrapper.createFromStringMap(obj);
        }
    }
    _serializeLocation(loc) {
        return {
            'href': loc.href,
            'protocol': loc.protocol,
            'host': loc.host,
            'hostname': loc.hostname,
            'port': loc.port,
            'pathname': loc.pathname,
            'search': loc.search,
            'hash': loc.hash,
            'origin': loc.origin
        };
    }
    _deserializeLocation(loc) {
        return new LocationType(loc['href'], loc['protocol'], loc['host'], loc['hostname'], loc['port'], loc['pathname'], loc['search'], loc['hash'], loc['origin']);
    }
    _serializeRenderComponentType(obj) {
        return {
            'id': obj.id,
            'templateUrl': obj.templateUrl,
            'slotCount': obj.slotCount,
            'encapsulation': this.serialize(obj.encapsulation, ViewEncapsulation),
            'styles': this.serialize(obj.styles, PRIMITIVE)
        };
    }
    _deserializeRenderComponentType(map) {
        return new RenderComponentType(map['id'], map['templateUrl'], map['slotCount'], this.deserialize(map['encapsulation'], ViewEncapsulation), this.deserialize(map['styles'], PRIMITIVE));
    }
};
Serializer = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [RenderStore])
], Serializer);
export class RenderStoreObject {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFPLE9BQU8sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFrQixNQUFNLDBCQUEwQjtPQUMxRixFQUFDLGFBQWEsRUFBbUIsTUFBTSxnQ0FBZ0M7T0FFdkUsRUFBQyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFDLE1BQU0sZ0NBQWdDO09BQ3pFLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSw4QkFBOEI7T0FDekQsRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0I7T0FDeEMsRUFBQyxXQUFXLEVBQUMsTUFBTSw4Q0FBOEM7T0FDakUsRUFBQyxpQkFBaUIsRUFBRSx5QkFBeUIsRUFBQyxNQUFNLGlDQUFpQztPQUNyRixFQUFDLFlBQVksRUFBQyxNQUFNLG9CQUFvQjtBQUUvQyxzRkFBc0Y7QUFDdEYsdURBQXVEO0FBQ3ZELE9BQU8sTUFBTSxTQUFTLEdBQVMsTUFBTSxDQUFDO0FBR3RDO0lBQ0UsWUFBb0IsWUFBeUI7UUFBekIsaUJBQVksR0FBWixZQUFZLENBQWE7SUFBRyxDQUFDO0lBRWpELFNBQVMsQ0FBQyxHQUFRLEVBQUUsSUFBUztRQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBUyxHQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJ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QUFtQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUMvQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxFQUN6RCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7QUFDSCxDQUFDO0FBckhEO0lBQUMsVUFBVSxFQUFFOztjQUFBO0FBd0hiO0FBQWdDLENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VHlwZSwgaXNBcnJheSwgaXNQcmVzZW50LCBzZXJpYWxpemVFbnVtLCBkZXNlcmlhbGl6ZUVudW19IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmdcIjtcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgV3JhcHBlZEV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcblxuaW1wb3J0IHtNYXAsIFN0cmluZ01hcFdyYXBwZXIsIE1hcFdyYXBwZXJ9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb25cIjtcbmltcG9ydCB7UmVuZGVyQ29tcG9uZW50VHlwZX0gZnJvbSBcImFuZ3VsYXIyL3NyYy9jb3JlL3JlbmRlci9hcGlcIjtcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcImFuZ3VsYXIyL3NyYy9jb3JlL2RpXCI7XG5pbXBvcnQge1JlbmRlclN0b3JlfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3JlbmRlcl9zdG9yZSc7XG5pbXBvcnQge1ZpZXdFbmNhcHN1bGF0aW9uLCBWSUVXX0VOQ0FQU1VMQVRJT05fVkFMVUVTfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YS92aWV3JztcbmltcG9ydCB7TG9jYXRpb25UeXBlfSBmcm9tICcuL3NlcmlhbGl6ZWRfdHlwZXMnO1xuXG4vLyBQUklNSVRJVkUgaXMgYW55IHR5cGUgdGhhdCBkb2VzIG5vdCBuZWVkIHRvIGJlIHNlcmlhbGl6ZWQgKHN0cmluZywgbnVtYmVyLCBib29sZWFuKVxuLy8gV2Ugc2V0IGl0IHRvIFN0cmluZyBzbyB0aGF0IGl0IGlzIGNvbnNpZGVyZWQgYSBUeXBlLlxuZXhwb3J0IGNvbnN0IFBSSU1JVElWRTogVHlwZSA9IFN0cmluZztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNlcmlhbGl6ZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yZW5kZXJTdG9yZTogUmVuZGVyU3RvcmUpIHt9XG5cbiAgc2VyaWFsaXplKG9iajogYW55LCB0eXBlOiBhbnkpOiBPYmplY3Qge1xuICAgIGlmICghaXNQcmVzZW50KG9iaikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICByZXR1cm4gKDxhbnlbXT5vYmopLm1hcCh2ID0+IHRoaXMuc2VyaWFsaXplKHYsIHR5cGUpKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gUFJJTUlUSVZFKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSBSZW5kZXJTdG9yZU9iamVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlclN0b3JlLnNlcmlhbGl6ZShvYmopO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gUmVuZGVyQ29tcG9uZW50VHlwZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NlcmlhbGl6ZVJlbmRlckNvbXBvbmVudFR5cGUob2JqKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFZpZXdFbmNhcHN1bGF0aW9uKSB7XG4gICAgICByZXR1cm4gc2VyaWFsaXplRW51bShvYmopO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gTG9jYXRpb25UeXBlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2VyaWFsaXplTG9jYXRpb24ob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXCJObyBzZXJpYWxpemVyIGZvciBcIiArIHR5cGUudG9TdHJpbmcoKSk7XG4gICAgfVxuICB9XG5cbiAgZGVzZXJpYWxpemUobWFwOiBhbnksIHR5cGU6IGFueSwgZGF0YT86IGFueSk6IGFueSB7XG4gICAgaWYgKCFpc1ByZXNlbnQobWFwKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KG1hcCkpIHtcbiAgICAgIHZhciBvYmo6IGFueVtdID0gW107XG4gICAgICAoPGFueVtdPm1hcCkuZm9yRWFjaCh2YWwgPT4gb2JqLnB1c2godGhpcy5kZXNlcmlhbGl6ZSh2YWwsIHR5cGUsIGRhdGEpKSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSBQUklNSVRJVkUpIHtcbiAgICAgIHJldHVybiBtYXA7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT0gUmVuZGVyU3RvcmVPYmplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJTdG9yZS5kZXNlcmlhbGl6ZShtYXApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gUmVuZGVyQ29tcG9uZW50VHlwZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2Rlc2VyaWFsaXplUmVuZGVyQ29tcG9uZW50VHlwZShtYXApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gVmlld0VuY2Fwc3VsYXRpb24pIHtcbiAgICAgIHJldHVybiBWSUVXX0VOQ0FQU1VMQVRJT05fVkFMVUVTW21hcF07XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBMb2NhdGlvblR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZXNlcmlhbGl6ZUxvY2F0aW9uKG1hcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFwiTm8gZGVzZXJpYWxpemVyIGZvciBcIiArIHR5cGUudG9TdHJpbmcoKSk7XG4gICAgfVxuICB9XG5cbiAgbWFwVG9PYmplY3QobWFwOiBNYXA8c3RyaW5nLCBhbnk+LCB0eXBlPzogVHlwZSk6IE9iamVjdCB7XG4gICAgdmFyIG9iamVjdCA9IHt9O1xuICAgIHZhciBzZXJpYWxpemUgPSBpc1ByZXNlbnQodHlwZSk7XG5cbiAgICBtYXAuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgaWYgKHNlcmlhbGl6ZSkge1xuICAgICAgICBvYmplY3Rba2V5XSA9IHRoaXMuc2VyaWFsaXplKHZhbHVlLCB0eXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIC8qXG4gICAqIFRyYW5zZm9ybXMgYSBKYXZhc2NyaXB0IG9iamVjdCAoU3RyaW5nTWFwKSBpbnRvIGEgTWFwPHN0cmluZywgVj5cbiAgICogSWYgdGhlIHZhbHVlcyBuZWVkIHRvIGJlIGRlc2VyaWFsaXplZCBwYXNzIGluIHRoZWlyIHR5cGVcbiAgICogYW5kIHRoZXkgd2lsbCBiZSBkZXNlcmlhbGl6ZWQgYmVmb3JlIGJlaW5nIHBsYWNlZCBpbiB0aGUgbWFwXG4gICAqL1xuICBvYmplY3RUb01hcChvYmo6IHtba2V5OiBzdHJpbmddOiBhbnl9LCB0eXBlPzogVHlwZSwgZGF0YT86IGFueSk6IE1hcDxzdHJpbmcsIGFueT4ge1xuICAgIGlmIChpc1ByZXNlbnQodHlwZSkpIHtcbiAgICAgIHZhciBtYXAgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICAgICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKG9iaixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsLCBrZXkpID0+IHsgbWFwLnNldChrZXksIHRoaXMuZGVzZXJpYWxpemUodmFsLCB0eXBlLCBkYXRhKSk7IH0pO1xuICAgICAgcmV0dXJuIG1hcDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1hcFdyYXBwZXIuY3JlYXRlRnJvbVN0cmluZ01hcChvYmopO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NlcmlhbGl6ZUxvY2F0aW9uKGxvYzogTG9jYXRpb25UeXBlKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2hyZWYnOiBsb2MuaHJlZixcbiAgICAgICdwcm90b2NvbCc6IGxvYy5wcm90b2NvbCxcbiAgICAgICdob3N0JzogbG9jLmhvc3QsXG4gICAgICAnaG9zdG5hbWUnOiBsb2MuaG9zdG5hbWUsXG4gICAgICAncG9ydCc6IGxvYy5wb3J0LFxuICAgICAgJ3BhdGhuYW1lJzogbG9jLnBhdGhuYW1lLFxuICAgICAgJ3NlYXJjaCc6IGxvYy5zZWFyY2gsXG4gICAgICAnaGFzaCc6IGxvYy5oYXNoLFxuICAgICAgJ29yaWdpbic6IGxvYy5vcmlnaW5cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfZGVzZXJpYWxpemVMb2NhdGlvbihsb2M6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogTG9jYXRpb25UeXBlIHtcbiAgICByZXR1cm4gbmV3IExvY2F0aW9uVHlwZShsb2NbJ2hyZWYnXSwgbG9jWydwcm90b2NvbCddLCBsb2NbJ2hvc3QnXSwgbG9jWydob3N0bmFtZSddLCBsb2NbJ3BvcnQnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NbJ3BhdGhuYW1lJ10sIGxvY1snc2VhcmNoJ10sIGxvY1snaGFzaCddLCBsb2NbJ29yaWdpbiddKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NlcmlhbGl6ZVJlbmRlckNvbXBvbmVudFR5cGUob2JqOiBSZW5kZXJDb21wb25lbnRUeXBlKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2lkJzogb2JqLmlkLFxuICAgICAgJ3RlbXBsYXRlVXJsJzogb2JqLnRlbXBsYXRlVXJsLFxuICAgICAgJ3Nsb3RDb3VudCc6IG9iai5zbG90Q291bnQsXG4gICAgICAnZW5jYXBzdWxhdGlvbic6IHRoaXMuc2VyaWFsaXplKG9iai5lbmNhcHN1bGF0aW9uLCBWaWV3RW5jYXBzdWxhdGlvbiksXG4gICAgICAnc3R5bGVzJzogdGhpcy5zZXJpYWxpemUob2JqLnN0eWxlcywgUFJJTUlUSVZFKVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9kZXNlcmlhbGl6ZVJlbmRlckNvbXBvbmVudFR5cGUobWFwOiB7W2tleTogc3RyaW5nXTogYW55fSk6IFJlbmRlckNvbXBvbmVudFR5cGUge1xuICAgIHJldHVybiBuZXcgUmVuZGVyQ29tcG9uZW50VHlwZShtYXBbJ2lkJ10sIG1hcFsndGVtcGxhdGVVcmwnXSwgbWFwWydzbG90Q291bnQnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZShtYXBbJ2VuY2Fwc3VsYXRpb24nXSwgVmlld0VuY2Fwc3VsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplKG1hcFsnc3R5bGVzJ10sIFBSSU1JVElWRSkpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFJlbmRlclN0b3JlT2JqZWN0IHt9XG4iXX0=