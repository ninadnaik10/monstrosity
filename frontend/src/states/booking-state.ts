import { atom } from 'recoil';
import { BookingCreate } from '../client/models';

export const bookingStateAtom = atom<BookingCreate>({
    key: 'bookingState',
    default: {
        pickup_latitude: null,
        pickup_longitude: null,
        dropoff_latitude: null,
        dropoff_longitude: null,
        estimated_price: null,
        vehicle_type_id: null,
    },
});