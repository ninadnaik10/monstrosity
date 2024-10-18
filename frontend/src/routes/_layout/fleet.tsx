import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { BookingService, LocationService, VehicleService } from "../../client";
import { BeatLoader } from "react-spinners";
import { useRecoilState, useRecoilValue } from "recoil";
import { bookingStateAtom } from "../../states/booking-state";
import { setTimeout } from "timers/promises";

export const Route = createFileRoute("/_layout/fleet")({
  component: ChooseFleet,
});

function getItemsQueryOptions(data: any) {
  // @ts-ignore
  const distance: number = LocationService.getDistance(data);
  const queryKey = ["vehicles", distance];
  if (!distance) {
    return {
      queryFn: async (): Promise<VehiclePriceEstimates> => {
        return { vehicles: [] };
      },
      queryKey,
    };
  }
  return {
    queryFn: async (): Promise<VehiclePriceEstimates> => {
      const response = await VehicleService.getVehiclesPriceEstimates(distance);
      console.log(response);
      // @ts-ignore
      return response;
    },
    queryKey,
  };
}

export interface VehiclePriceEstimates {
  vehicles: {
    base_price: string;
    capacity: number;
    description: string;
    estimated_price: number;
    name: string;
    price_per_km: string;
    vehicle_type_id: string;
  }[];
}

export default function ChooseFleet() {
  const [cardSelected, setCardSelected] = useState<number>();
  const handleSelectCard = (index: number) => {
    setCardSelected(index);
    setBookingState({
      ...bookingState,
      vehicle_type_id: vehicles?.vehicles[index].vehicle_type_id || null,
      estimated_price: vehicles?.vehicles[index].estimated_price || null,
    });
  };

  const navigate = useNavigate({ from: "/_layout/fleet" });

  const [bookingState, setBookingState] = useRecoilState(bookingStateAtom);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const handleBookNowSubmit = async () => {
    setIsSubmitLoading(true);

    await BookingService.postBooking(bookingState);

    setIsSubmitLoading(false);

    navigate({ to: "/" });
  };
  const {
    data: vehicles,
    isLoading,
    isPlaceholderData,
  } = useQuery<VehiclePriceEstimates>({
    ...getItemsQueryOptions({
      from: [bookingState.pickup_latitude, bookingState.pickup_longitude],
      to: [bookingState.dropoff_latitude, bookingState.dropoff_longitude],
    }), // Use the actual distance from state
    placeholderData: (prevData: VehiclePriceEstimates | undefined) =>
      prevData || { vehicles: [] },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (vehicles) {
    console.log(vehicles);
  }

  return (
    <div>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {vehicles?.vehicles?.map((vehicle, index) => (
          <GridItem key={vehicle.vehicle_type_id}>
            {" "}
            {/* Use the correct key */}
            <Card
              cursor={"pointer"}
              border={"1px"}
              borderColor={cardSelected === index ? "#fff" : "transparent"}
              as={Button}
              onClick={() => handleSelectCard(index)}
              w={"100%"}
              h={"100%"}
            >
              <CardHeader>
                <Heading size="md"> {vehicle.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text>{vehicle.description}</Text>
              </CardBody>
              <CardFooter>{"Rs. " + vehicle.estimated_price}</CardFooter>
            </Card>
          </GridItem>
        ))}
      </Grid>
      <Button
        onClick={handleBookNowSubmit}
        isLoading={isSubmitLoading}
        spinner={<BeatLoader size={8} color="white" />}
      >
        Book Now
      </Button>
    </div>
  );
}
