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
var lang_1 = require("angular2/src/facade/lang");
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require("angular2/src/facade/collection");
var api_1 = require("angular2/src/core/render/api");
var di_1 = require("angular2/src/core/di");
var render_store_1 = require('angular2/src/web_workers/shared/render_store');
var view_1 = require('angular2/src/core/metadata/view');
var serialized_types_1 = require('./serialized_types');
// PRIMITIVE is any type that does not need to be serialized (string, number, boolean)
// We set it to String so that it is considered a Type.
exports.PRIMITIVE = String;
var Serializer = (function () {
    function Serializer(_renderStore) {
        this._renderStore = _renderStore;
    }
    Serializer.prototype.serialize = function (obj, type) {
        var _this = this;
        if (!lang_1.isPresent(obj)) {
            return null;
        }
        if (lang_1.isArray(obj)) {
            return obj.map(function (v) { return _this.serialize(v, type); });
        }
        if (type == exports.PRIMITIVE) {
            return obj;
        }
        if (type == RenderStoreObject) {
            return this._renderStore.serialize(obj);
        }
        else if (type === api_1.RenderComponentType) {
            return this._serializeRenderComponentType(obj);
        }
        else if (type === view_1.ViewEncapsulation) {
            return lang_1.serializeEnum(obj);
        }
        else if (type === serialized_types_1.LocationType) {
            return this._serializeLocation(obj);
        }
        else {
            throw new exceptions_1.BaseException("No serializer for " + type.toString());
        }
    };
    Serializer.prototype.deserialize = function (map, type, data) {
        var _this = this;
        if (!lang_1.isPresent(map)) {
            return null;
        }
        if (lang_1.isArray(map)) {
            var obj = [];
            map.forEach(function (val) { return obj.push(_this.deserialize(val, type, data)); });
            return obj;
        }
        if (type == exports.PRIMITIVE) {
            return map;
        }
        if (type == RenderStoreObject) {
            return this._renderStore.deserialize(map);
        }
        else if (type === api_1.RenderComponentType) {
            return this._deserializeRenderComponentType(map);
        }
        else if (type === view_1.ViewEncapsulation) {
            return view_1.VIEW_ENCAPSULATION_VALUES[map];
        }
        else if (type === serialized_types_1.LocationType) {
            return this._deserializeLocation(map);
        }
        else {
            throw new exceptions_1.BaseException("No deserializer for " + type.toString());
        }
    };
    Serializer.prototype.mapToObject = function (map, type) {
        var _this = this;
        var object = {};
        var serialize = lang_1.isPresent(type);
        map.forEach(function (value, key) {
            if (serialize) {
                object[key] = _this.serialize(value, type);
            }
            else {
                object[key] = value;
            }
        });
        return object;
    };
    /*
     * Transforms a Javascript object (StringMap) into a Map<string, V>
     * If the values need to be deserialized pass in their type
     * and they will be deserialized before being placed in the map
     */
    Serializer.prototype.objectToMap = function (obj, type, data) {
        var _this = this;
        if (lang_1.isPresent(type)) {
            var map = new collection_1.Map();
            collection_1.StringMapWrapper.forEach(obj, function (val, key) { map.set(key, _this.deserialize(val, type, data)); });
            return map;
        }
        else {
            return collection_1.MapWrapper.createFromStringMap(obj);
        }
    };
    Serializer.prototype._serializeLocation = function (loc) {
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
    };
    Serializer.prototype._deserializeLocation = function (loc) {
        return new serialized_types_1.LocationType(loc['href'], loc['protocol'], loc['host'], loc['hostname'], loc['port'], loc['pathname'], loc['search'], loc['hash'], loc['origin']);
    };
    Serializer.prototype._serializeRenderComponentType = function (obj) {
        return {
            'id': obj.id,
            'templateUrl': obj.templateUrl,
            'slotCount': obj.slotCount,
            'encapsulation': this.serialize(obj.encapsulation, view_1.ViewEncapsulation),
            'styles': this.serialize(obj.styles, exports.PRIMITIVE)
        };
    };
    Serializer.prototype._deserializeRenderComponentType = function (map) {
        return new api_1.RenderComponentType(map['id'], map['templateUrl'], map['slotCount'], this.deserialize(map['encapsulation'], view_1.ViewEncapsulation), this.deserialize(map['styles'], exports.PRIMITIVE));
    };
    Serializer = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [render_store_1.RenderStore])
    ], Serializer);
    return Serializer;
}());
exports.Serializer = Serializer;
var RenderStoreObject = (function () {
    function RenderStoreObject() {
    }
    return RenderStoreObject;
}());
exports.RenderStoreObject = RenderStoreObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQXVFLDBCQUEwQixDQUFDLENBQUE7QUFDbEcsMkJBQThDLGdDQUFnQyxDQUFDLENBQUE7QUFFL0UsMkJBQWdELGdDQUFnQyxDQUFDLENBQUE7QUFDakYsb0JBQWtDLDhCQUE4QixDQUFDLENBQUE7QUFDakUsbUJBQXlCLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsNkJBQTBCLDhDQUE4QyxDQUFDLENBQUE7QUFDekUscUJBQTJELGlDQUFpQyxDQUFDLENBQUE7QUFDN0YsaUNBQTJCLG9CQUFvQixDQUFDLENBQUE7QUFFaEQsc0ZBQXNGO0FBQ3RGLHVEQUF1RDtBQUMxQyxpQkFBUyxHQUFTLE1BQU0sQ0FBQztBQUd0QztJQUNFLG9CQUFvQixZQUF5QjtRQUF6QixpQkFBWSxHQUFaLFlBQVksQ0FBYTtJQUFHLENBQUM7SUFFakQsOEJBQVMsR0FBVCxVQUFVLEdBQVEsRUFBRSxJQUFTO1FBQTdCLGlCQXFCQztRQXBCQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQVMsR0FBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElB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Q0FBQztJQUNKLENBQUM7SUFFTyxvREFBK0IsR0FBdkMsVUFBd0MsR0FBeUI7UUFDL0QsTUFBTSxDQUFDLElBQUkseUJBQW1CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQy9DLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLHdCQUFpQixDQUFDLEVBQ3pELElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGlCQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFwSEg7UUFBQyxlQUFVLEVBQUU7O2tCQUFBO0lBcUhiLGlCQUFDO0FBQUQsQ0FBQyxBQXBIRCxJQW9IQztBQXBIWSxrQkFBVSxhQW9IdEIsQ0FBQTtBQUdEO0lBQUE7SUFBZ0MsQ0FBQztJQUFELHdCQUFDO0FBQUQsQ0FBQyxBQUFqQyxJQUFpQztBQUFwQix5QkFBaUIsb0JBQUcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VHlwZSwgaXNBcnJheSwgaXNQcmVzZW50LCBzZXJpYWxpemVFbnVtLCBkZXNlcmlhbGl6ZUVudW19IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmdcIjtcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgV3JhcHBlZEV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcblxuaW1wb3J0IHtNYXAsIFN0cmluZ01hcFdyYXBwZXIsIE1hcFdyYXBwZXJ9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb25cIjtcbmltcG9ydCB7UmVuZGVyQ29tcG9uZW50VHlwZX0gZnJvbSBcImFuZ3VsYXIyL3NyYy9jb3JlL3JlbmRlci9hcGlcIjtcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcImFuZ3VsYXIyL3NyYy9jb3JlL2RpXCI7XG5pbXBvcnQge1JlbmRlclN0b3JlfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3JlbmRlcl9zdG9yZSc7XG5pbXBvcnQge1ZpZXdFbmNhcHN1bGF0aW9uLCBWSUVXX0VOQ0FQU1VMQVRJT05fVkFMVUVTfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YS92aWV3JztcbmltcG9ydCB7TG9jYXRpb25UeXBlfSBmcm9tICcuL3NlcmlhbGl6ZWRfdHlwZXMnO1xuXG4vLyBQUklNSVRJVkUgaXMgYW55IHR5cGUgdGhhdCBkb2VzIG5vdCBuZWVkIHRvIGJlIHNlcmlhbGl6ZWQgKHN0cmluZywgbnVtYmVyLCBib29sZWFuKVxuLy8gV2Ugc2V0IGl0IHRvIFN0cmluZyBzbyB0aGF0IGl0IGlzIGNvbnNpZGVyZWQgYSBUeXBlLlxuZXhwb3J0IGNvbnN0IFBSSU1JVElWRTogVHlwZSA9IFN0cmluZztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNlcmlhbGl6ZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yZW5kZXJTdG9yZTogUmVuZGVyU3RvcmUpIHt9XG5cbiAgc2VyaWFsaXplKG9iajogYW55LCB0eXBlOiBhbnkpOiBPYmplY3Qge1xuICAgIGlmICghaXNQcmVzZW50KG9iaikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICByZXR1cm4gKDxhbnlbXT5vYmopLm1hcCh2ID0+IHRoaXMuc2VyaWFsaXplKHYsIHR5cGUpKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gUFJJTUlUSVZFKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSBSZW5kZXJTdG9yZU9iamVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlclN0b3JlLnNlcmlhbGl6ZShvYmopO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gUmVuZGVyQ29tcG9uZW50VHlwZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NlcmlhbGl6ZVJlbmRlckNvbXBvbmVudFR5cGUob2JqKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFZpZXdFbmNhcHN1bGF0aW9uKSB7XG4gICAgICByZXR1cm4gc2VyaWFsaXplRW51bShvYmopO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gTG9jYXRpb25UeXBlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2VyaWFsaXplTG9jYXRpb24ob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXCJObyBzZXJpYWxpemVyIGZvciBcIiArIHR5cGUudG9TdHJpbmcoKSk7XG4gICAgfVxuICB9XG5cbiAgZGVzZXJpYWxpemUobWFwOiBhbnksIHR5cGU6IGFueSwgZGF0YT86IGFueSk6IGFueSB7XG4gICAgaWYgKCFpc1ByZXNlbnQobWFwKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KG1hcCkpIHtcbiAgICAgIHZhciBvYmo6IGFueVtdID0gW107XG4gICAgICAoPGFueVtdPm1hcCkuZm9yRWFjaCh2YWwgPT4gb2JqLnB1c2godGhpcy5kZXNlcmlhbGl6ZSh2YWwsIHR5cGUsIGRhdGEpKSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSBQUklNSVRJVkUpIHtcbiAgICAgIHJldHVybiBtYXA7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT0gUmVuZGVyU3RvcmVPYmplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJTdG9yZS5kZXNlcmlhbGl6ZShtYXApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gUmVuZGVyQ29tcG9uZW50VHlwZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2Rlc2VyaWFsaXplUmVuZGVyQ29tcG9uZW50VHlwZShtYXApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gVmlld0VuY2Fwc3VsYXRpb24pIHtcbiAgICAgIHJldHVybiBWSUVXX0VOQ0FQU1VMQVRJT05fVkFMVUVTW21hcF07XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBMb2NhdGlvblR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZXNlcmlhbGl6ZUxvY2F0aW9uKG1hcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFwiTm8gZGVzZXJpYWxpemVyIGZvciBcIiArIHR5cGUudG9TdHJpbmcoKSk7XG4gICAgfVxuICB9XG5cbiAgbWFwVG9PYmplY3QobWFwOiBNYXA8c3RyaW5nLCBhbnk+LCB0eXBlPzogVHlwZSk6IE9iamVjdCB7XG4gICAgdmFyIG9iamVjdCA9IHt9O1xuICAgIHZhciBzZXJpYWxpemUgPSBpc1ByZXNlbnQodHlwZSk7XG5cbiAgICBtYXAuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgaWYgKHNlcmlhbGl6ZSkge1xuICAgICAgICBvYmplY3Rba2V5XSA9IHRoaXMuc2VyaWFsaXplKHZhbHVlLCB0eXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIC8qXG4gICAqIFRyYW5zZm9ybXMgYSBKYXZhc2NyaXB0IG9iamVjdCAoU3RyaW5nTWFwKSBpbnRvIGEgTWFwPHN0cmluZywgVj5cbiAgICogSWYgdGhlIHZhbHVlcyBuZWVkIHRvIGJlIGRlc2VyaWFsaXplZCBwYXNzIGluIHRoZWlyIHR5cGVcbiAgICogYW5kIHRoZXkgd2lsbCBiZSBkZXNlcmlhbGl6ZWQgYmVmb3JlIGJlaW5nIHBsYWNlZCBpbiB0aGUgbWFwXG4gICAqL1xuICBvYmplY3RUb01hcChvYmo6IHtba2V5OiBzdHJpbmddOiBhbnl9LCB0eXBlPzogVHlwZSwgZGF0YT86IGFueSk6IE1hcDxzdHJpbmcsIGFueT4ge1xuICAgIGlmIChpc1ByZXNlbnQodHlwZSkpIHtcbiAgICAgIHZhciBtYXAgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICAgICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKG9iaixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsLCBrZXkpID0+IHsgbWFwLnNldChrZXksIHRoaXMuZGVzZXJpYWxpemUodmFsLCB0eXBlLCBkYXRhKSk7IH0pO1xuICAgICAgcmV0dXJuIG1hcDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1hcFdyYXBwZXIuY3JlYXRlRnJvbVN0cmluZ01hcChvYmopO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NlcmlhbGl6ZUxvY2F0aW9uKGxvYzogTG9jYXRpb25UeXBlKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2hyZWYnOiBsb2MuaHJlZixcbiAgICAgICdwcm90b2NvbCc6IGxvYy5wcm90b2NvbCxcbiAgICAgICdob3N0JzogbG9jLmhvc3QsXG4gICAgICAnaG9zdG5hbWUnOiBsb2MuaG9zdG5hbWUsXG4gICAgICAncG9ydCc6IGxvYy5wb3J0LFxuICAgICAgJ3BhdGhuYW1lJzogbG9jLnBhdGhuYW1lLFxuICAgICAgJ3NlYXJjaCc6IGxvYy5zZWFyY2gsXG4gICAgICAnaGFzaCc6IGxvYy5oYXNoLFxuICAgICAgJ29yaWdpbic6IGxvYy5vcmlnaW5cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfZGVzZXJpYWxpemVMb2NhdGlvbihsb2M6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogTG9jYXRpb25UeXBlIHtcbiAgICByZXR1cm4gbmV3IExvY2F0aW9uVHlwZShsb2NbJ2hyZWYnXSwgbG9jWydwcm90b2NvbCddLCBsb2NbJ2hvc3QnXSwgbG9jWydob3N0bmFtZSddLCBsb2NbJ3BvcnQnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NbJ3BhdGhuYW1lJ10sIGxvY1snc2VhcmNoJ10sIGxvY1snaGFzaCddLCBsb2NbJ29yaWdpbiddKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NlcmlhbGl6ZVJlbmRlckNvbXBvbmVudFR5cGUob2JqOiBSZW5kZXJDb21wb25lbnRUeXBlKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2lkJzogb2JqLmlkLFxuICAgICAgJ3RlbXBsYXRlVXJsJzogb2JqLnRlbXBsYXRlVXJsLFxuICAgICAgJ3Nsb3RDb3VudCc6IG9iai5zbG90Q291bnQsXG4gICAgICAnZW5jYXBzdWxhdGlvbic6IHRoaXMuc2VyaWFsaXplKG9iai5lbmNhcHN1bGF0aW9uLCBWaWV3RW5jYXBzdWxhdGlvbiksXG4gICAgICAnc3R5bGVzJzogdGhpcy5zZXJpYWxpemUob2JqLnN0eWxlcywgUFJJTUlUSVZFKVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9kZXNlcmlhbGl6ZVJlbmRlckNvbXBvbmVudFR5cGUobWFwOiB7W2tleTogc3RyaW5nXTogYW55fSk6IFJlbmRlckNvbXBvbmVudFR5cGUge1xuICAgIHJldHVybiBuZXcgUmVuZGVyQ29tcG9uZW50VHlwZShtYXBbJ2lkJ10sIG1hcFsndGVtcGxhdGVVcmwnXSwgbWFwWydzbG90Q291bnQnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZShtYXBbJ2VuY2Fwc3VsYXRpb24nXSwgVmlld0VuY2Fwc3VsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplKG1hcFsnc3R5bGVzJ10sIFBSSU1JVElWRSkpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFJlbmRlclN0b3JlT2JqZWN0IHt9XG4iXX0=