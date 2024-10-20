import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";

import type { BookingPublic, UserPublic } from "../../client";

interface ActionsMenuProps {
  type: string;
  value: UserPublic | BookingPublic;
  disabled?: boolean;
}

const ActionsMenu = ({ disabled }: ActionsMenuProps) => {
  const acceptModal = useDisclosure();
  // const deleteModal = useDisclosure();

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
            onClick={acceptModal.onOpen}
            icon={<FiEdit fontSize="16px" color="green" />}
          >
            Accept Booking
          </MenuItem>
          {/* <MenuItem
            onClick={deleteModal.onOpen}
            icon={<FiTrash fontSize="16px" />}
            color="ui.danger"
          >
            Delete {type}
          </MenuItem> */}
        </MenuList>
        {/* {type === "User" ? (
          <EditUser
            user={value as UserPublic}
            isOpen={acceptModal.isOpen}
            onClose={acceptModal.onClose}
          />
        ) : (
          // <EditItem
          //   item={value as BookingPublic}
          //   isOpen={acceptModal.isOpen}
          //   onClose={acceptModal.onClose}
          // />
        )}
        <Delete
          type={type}
          id={value.user_id}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        /> */}
      </Menu>
    </>
  );
};

export default ActionsMenu;
