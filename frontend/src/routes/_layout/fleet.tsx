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
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { VehicleService } from "../../client";
import { useRecoilValue } from "recoil";
import { bookingState } from "../../states/booking-state";

export const Route = createFileRoute("/_layout/fleet")({
  component: ChooseFleet,
});

function getItemsQueryOptions(distance: number | null) {
  const queryKey = ["vehicles", distance]; // Always provide queryKey with at least 2 elements
  if (!distance) {
    return {
      queryFn: async (): Promise<VehiclePriceEstimates> => {
        return { vehicles: [] }; // Return an empty list of vehicles when distance is null
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
    estimated_price: string;
    name: string;
    price_per_km: string;
    vehicle_type_id: string;
  }[];
}

export default function ChooseFleet() {
  const queryClient = useQueryClient();

  const { distance } = useRecoilValue(bookingState);
  const [cardSelected, setCardSelected] = useState<number>();
  const handleSelectCard = (index: number) => {
    setCardSelected(index);
  };
  const {
    data: vehicles,
    isLoading,
    isPlaceholderData,
  } = useQuery<VehiclePriceEstimates>({
    ...getItemsQueryOptions(44), // Use the actual distance from state
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
    </div>
  );
}
