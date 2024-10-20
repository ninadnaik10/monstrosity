import {
  Button,
  Container,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";

import {
  BookingService,
  BookingPublic,
  ItemPublic,
  UserPublic,
} from "../../client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import EditUser from "../../components/Admin/EditUser";
import EditItem from "../../components/Items/EditItem";

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/my-bookings")({
  component: MyBookings,
  validateSearch: (search) => itemsSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getItemsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      BookingService.readMyItems({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["items", { page }],
  };
}

function ItemsTable() {
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const setPage = (page: number) =>
    navigate({ search: (prev) => ({ ...prev, page }) });

  const {
    data: items,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getItemsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage = !isPlaceholderData && items?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getItemsQueryOptions({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Pickup Address</Th>
              {/* <Th>Pickup City</Th> */}
              <Th>Dropoff Address</Th>
              {/* <Th>Dropoff City</Th> */}
              <Th>Price</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          {isPending ? (
            <Tbody>
              <Tr>
                {new Array(4).fill(null).map((_, index) => (
                  <Td key={index}>
                    <SkeletonText noOfLines={1} paddingBlock="16px" />
                  </Td>
                ))}
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {items?.data.map((item) => (
                <Tr key={item.booking_id} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Td>{item.booking_id}</Td>
                  <Td isTruncated maxWidth="150px">
                    {item.pickup_address}
                  </Td>
                  <Td isTruncated maxWidth="150px">
                    {item.dropoff_address}
                  </Td>
                  {/* <Td isTruncated maxWidth="150px">
                      {item.title}
                    </Td>
                    <Td isTruncated maxWidth="150px">
                      {item.title}
                    </Td> */}
                  <Td
                    color={!item.estimated_price ? "ui.dim" : "inherit"}
                    isTruncated
                    maxWidth="150px"
                  >
                    {item.estimated_price || "N/A"}
                  </Td>
                  <Td>
                    <ActionsMenu
                      type={"Item"}
                      value={item}
                      disabled={undefined}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
      <Flex
        gap={4}
        alignItems="center"
        mt={4}
        direction="row"
        justifyContent="flex-end"
      >
        <Button onClick={() => setPage(page - 1)} isDisabled={!hasPreviousPage}>
          Previous
        </Button>
        <span>Page {page}</span>
        <Button isDisabled={!hasNextPage} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </Flex>
    </>
  );
}

function MyBookings() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        My Bookings
      </Heading>

      {/* <Navbar type={"Item"} addModalAs={AddItem} /> */}
      <ItemsTable />
    </Container>
  );
}

const ActionsMenu = ({
  type,
  value,
  disabled,
}: {
  type: string;
  value: UserPublic | ItemPublic | BookingPublic;
  disabled: boolean | undefined;
}) => {
  const changeStatus = useDisclosure();

  return (
    <>
      <Menu>
        <MenuButton
          isDisabled={disabled}
          as={Button}
          rightIcon={<BsThreeDotsVertical />}
          variant="unstyled"
        />
        <MenuList>
          <MenuItem
            onClick={changeStatus.onOpen}
            icon={<FiEdit fontSize="16px" color="green" />}
          >
            Mark As Completed
          </MenuItem>
          {/* <MenuItem
              onClick={deleteModal.onOpen}
              icon={<FiTrash fontSize="16px" />}
              color="ui.danger"
            >
              Delete {type}
            </MenuItem> */}
        </MenuList>
        {type === "User" ? (
          <EditUser
            user={value as UserPublic}
            isOpen={changeStatus.isOpen}
            onClose={changeStatus.onClose}
          />
        ) : (
          <EditItem
            item={value as ItemPublic}
            isOpen={changeStatus.isOpen}
            onClose={changeStatus.onClose}
          />
        )}
        {/* <Delete
            type={type}
            id={value.id}
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.onClose}
          /> */}
      </Menu>
    </>
  );
};
