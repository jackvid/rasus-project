import { LocationData } from "./location-data.modes";

export class RouteData {
    constructor(
        public id: string,
        public location: LocationData,
        public timestamp: number,
        public routeId: number
    ) {}
}