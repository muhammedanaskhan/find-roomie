// Basic Imports
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Chakra UI Imports
import {
  Avatar,
  Box,
  ButtonGroup,
  Collapse,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

// Components Imports
// import { useAuth } from "@/context/auth/AuthContext";
import { links } from "./links";


import { Button } from "@/components/ui/button"

// Icon Imports
import { GrUserSettings } from "react-icons/gr";
import { HiOutlineLogout } from "react-icons/hi";

interface SidebarProps {
  isOpen: boolean;
  setOpen: () => void;
}

const CollapseMenu: React.FunctionComponent<SidebarProps> = ({
  isOpen,
  setOpen,
}) => {
  // const { user, logout } = useAuth();
  // const user ={
  //   displayName: "Test User",
  //   photoURL: "https://bit.ly/dan-abramov",

  // };

  const user = null;

  const router = useRouter();

  const logoutUser = () => {
    // logout();
    router.reload();
    router.push("/");
    setOpen();
  };

  return (
    <React.Fragment>
      <Collapse in={isOpen}>
        <Box
          display={{
            base: "none",
            lg: "none",
            md: "none",
            sm: "flex",
            xs: "flex",
          }}
          flexDir="column"
          m="5"
          p="5"
          borderRadius="md"
          zIndex={20}
          minH="xs"
          justifyContent="space-between"
          bg={useColorModeValue("white", "gray.700")}
          className="flex flex-col justify-between h-6 md:hidden shadow-md"
        >
          <Stack
            display={{
              base: "none",
              lg: "none",
              md: "none",
              sm: "flex",
              xs: "flex",
            }}
            flexDir="column"
            w="full"
            className="flex flex-col"
          >
            {links.map(
              (
                item: { link: any; name: any },
                index: React.Key | null | undefined
              ) => (
                <Link
                  key={index}
                  className="text-center text-primaryBlue font-semibold"
                  href={item.link}
                  onClick={() => setOpen()}
                >
                  {item.name}
                </Link>
              )
            )}
          </Stack>


          <Box
            display={{
              base: "none",
              md: "none",
              sm: "flex",
              xs: "flex",
            }}
          >
            {!user ? (
              <>
                <div className="flex flex-col gap-2">
                  <Link href='/login' >
                    <Button className="w-full" variant="outline" onClick={() => setOpen()}>Login</Button>
                  </Link>
                  <Link href='/register'>
                    <Button className='bg-primaryBlue text w-full' onClick={() => setOpen()}>Sign Up</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* <HStack gap="2">
                  <Button
                    colorScheme="blue"
                    as={Link}
                    href="/app/dashboard"
                    passHref
                    variant="solid"
                    size={{
                      base: "md",
                      xl: "md",
                      lg: "md",
                      sm: "sm",
                      xs: "sm",
                    }}
                    _focus={{ boxShadow: "outline" }}
                  >
                    {`Continue as ${user.displayName ?? "Test User"}`}
                  </Button>
                  <Menu>
                    <MenuButton
                      as={Avatar}
                      aria-label="User Account"
                      size="sm"
                      p="2"
                      cursor="pointer"
                      name={user?.displayName ?? "Test User"}
                      src={user?.photoURL}
                    />
                    <MenuList>
                      <MenuItem
                        style={{ margin: 0 }}
                        onClick={() => router.push("/app/settings")}
                        icon={<GrUserSettings />}
                      >
                        Settings
                      </MenuItem>
                      <MenuItem
                        style={{ margin: 0 }}
                        onClick={() => logoutUser()}
                        icon={<HiOutlineLogout />}
                      >
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack> */}
              </>
            )}
          </Box>
        </Box>
      </Collapse>
    </React.Fragment>
  );
};

export default CollapseMenu;