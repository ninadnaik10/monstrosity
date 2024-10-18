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

// export interface BookingCreate {
//     pickup_latitude: string;
//     pickup_longitude: string;
//     dropoff_latitude: string;
//     dropoff_longitude: string;
//     estimate_price: number;
//     distance: number;
// }