export class LocationData {
    constructor(
        public c: string, 
        public longitude: number, 
        public latitude: number,
        public altitude: number,
        public name: string,
        public description: string[]) {}
}