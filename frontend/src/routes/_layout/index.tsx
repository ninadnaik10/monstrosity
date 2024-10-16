import {
  Box,
  Card,
  CardBody,
  Container,
  Text,
  Image,
  Stack,
  Heading,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { createFileRoute, Link } from "@tanstack/react-router";

import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const { user: currentUser } = useAuth();

  return (
    <>
      <Container maxW="full">
        <Box pt={12} m={4}>
          <Text fontSize="2xl">
            Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
          </Text>
          <Text>Welcome back, nice to see you again!</Text>
        </Box>
      </Container>
      <Container maxW="full">
        <Card maxW="sm">
          <CardBody>
            <Image
              src="assets/images/truck.svg"
              alt="truck"
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Heading size="md">Book A Fleet</Heading>
              <Text>Book a Fleet from a variety of options available.</Text>
            </Stack>
          </CardBody>
          <CardFooter>
            <ButtonGroup>
              <Button variant="solid" colorScheme="blue">
                Book now
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      </Container>
      <Container maxW="full">
        <Card maxW="sm">
          <CardBody>
            <Image
              src="assets/images/track.svg"
              alt="track"
              backgroundColor={useColorModeValue("white", "white")}
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Heading size="md">Track Your Bookings</Heading>
              <Text>Track your previously made bookings.</Text>
            </Stack>
          </CardBody>
          <CardFooter>
            <ButtonGroup>
              <Button
                variant="solid"
                colorScheme="blue"
                as={Link}
                to={"/track"}
              >
                Track now
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      </Container>
    </>
  );
}
