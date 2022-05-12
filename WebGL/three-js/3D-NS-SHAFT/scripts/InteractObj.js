import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

export class InteractObj {
    constructor() {
        this.events_dict = {};
    }

    /**
     * @param {String} event_name 
     * @param {Function} f 
     */
    addEvent(event_name, f) {
        this.events_dict[event_name] = f;
    }
}