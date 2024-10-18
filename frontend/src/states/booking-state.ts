import { atom } from 'recoil';

export const bookingState = atom({
    key: 'bookingState',
    default: {
        fromCoordinates: null,
        toCoordinates: null,
        selectedVehicleId: null,
        distance: null,
    },
});