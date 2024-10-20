import React, { useState, Fragment, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Divider,
} from "@chakra-ui/react";
import { Place } from "../../client/types";
import { MapService } from "../../client";
import { useNavigate } from "@tanstack/react-router";

interface LocationSearchProps {
  onFromPlaceClick: (place: Place) => void;
  onToPlaceClick: (place: Place) => void;
}

export default function LocationSearch({
  onFromPlaceClick,
  onToPlaceClick,
}: LocationSearchProps) {
  const navigate = useNavigate({ from: "/_layout/pick-location" });

  const handleChooseFleetSubmit = () => {
    navigate({ to: "/fleet" });
  };
  const [fromTerm, setFromTerm] = useState("");
  const [toTerm, setToTerm] = useState("");
  const [fromPlaces, setFromPlaces] = useState<Place[]>([]);
  const [toPlaces, setToPlaces] = useState<Place[]>([]);
  const [chooseFleetButtonDisabled, setChooseFleetButtonDisabled] =
    useState(true);

  const mapService = new MapService();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fromResults = await mapService.search(fromTerm);
    const toResults = await mapService.search(toTerm);
    setFromPlaces(fromResults);
    setToPlaces(toResults);
  };

  useEffect(() => {
    if (fromPlaces.length > 0 && toPlaces.length > 0) {
      setChooseFleetButtonDisabled(false);
    } else {
      setChooseFleetButtonDisabled(true);
    }
  }, [fromPlaces, toPlaces]);

  const renderPlacesList = (
    places: Place[],
    onPlaceClick: (place: Place) => void
  ) => (
    <VStack align="stretch" spacing={2} mt={2}>
      {places.map((place) => (
        <Fragment key={place.id}>
          <HStack justify="space-between">
            <Text fontSize="sm">{place.name}</Text>
            <Button
              size="xs"
              colorScheme="blue"
              onClick={() => onPlaceClick(place)}
            >
              Go
            </Button>
          </HStack>
          <Divider />
        </Fragment>
      ))}
    </VStack>
  );

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel htmlFor="from">From</FormLabel>
            <Input
              id="from"
              value={fromTerm}
              onChange={(event) => setFromTerm(event.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="to">To</FormLabel>
            <Input
              id="to"
              value={toTerm}
              onChange={(event) => setToTerm(event.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Search
          </Button>
        </VStack>
      </form>

      <Heading size="md" mt={6}>
        From Locations
      </Heading>
      {renderPlacesList(fromPlaces, onFromPlaceClick)}

      <Heading size="md" mt={6}>
        To Locations
      </Heading>
      {renderPlacesList(toPlaces, onToPlaceClick)}

      <Button
        colorScheme="green"
        width="100%"
        disabled={chooseFleetButtonDisabled}
        // @ts-ignore
        onClick={() => handleChooseFleetSubmit()}
      >
        Choose Fleet
      </Button>
    </Box>
  );
}
