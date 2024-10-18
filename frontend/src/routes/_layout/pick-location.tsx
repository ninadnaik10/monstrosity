import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  Stack,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Place } from "../../client/types";
import Map from "../../components/Common/Map";
import SelectLocation from "../../components/Common/SelectLocation";
import { bookingStateAtom } from "../../states/booking-state";
import { useRecoilState } from "recoil";

export const Route = createFileRoute("/_layout/pick-location")({
  component: PickUpLocation,
});

export default function PickUpLocation() {
  const [fromPlace, setFromPlace] = useState<Place | null>(null);
  const [toPlace, setToPlace] = useState<Place | null>(null);
  const [bookingState, setBookingState] = useRecoilState(bookingStateAtom);
  useEffect(() => {
    console.log(bookingState);
    setBookingState({
      ...bookingState,
      pickup_latitude: fromPlace?.latitude || null,
      pickup_longitude: fromPlace?.longitude || null,
    });
  }, [fromPlace, toPlace]);
  useEffect(() => {
    console.log(bookingState);
    setBookingState({
      ...bookingState,
      dropoff_latitude: toPlace?.latitude || null,
      dropoff_longitude: toPlace?.longitude || null,
    });
  }, [toPlace]);
  //   const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) =>{
  //     event.preventDefault();

  //     const results = await search(term);
  //     setPlaces(results);

  // }
  return (
    <Grid templateColumns="repeat(6, 1fr)" gap={2}>
      <GridItem w="100%" p={5} bg="#252d3d">
        {/* <Flex
          justifyContent={"space-between"}
          flexDirection={"column"}
          flex={1}
          grow={1}
        >
          <Stack spacing={3}>
            <Input placeholder="From" size="lg" />
            <Input placeholder="To" size="lg" />
          </Stack>

          <Button colorScheme="blue" width="100%">
            Sticky Button
          </Button>
        </Flex> */}

        <SelectLocation
          onFromPlaceClick={(fromPlace) => setFromPlace(fromPlace)}
          onToPlaceClick={(toPlace) => setToPlace(toPlace)}
        />
      </GridItem>
      <GridItem w="100%" colSpan={4}>
        <Map fromPlace={fromPlace} toPlace={toPlace} />
      </GridItem>
    </Grid>
  );
}
