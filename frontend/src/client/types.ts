export interface Place {
    id: number;
    name: string;
    longitude: number;
    latitude: number;
}


export interface SearchResponse {
    features: {
        geometry: {
            coordinates: number[];
        }
        properties: {
            display_name: string;
            place_id: number
        }
    }[]
}

