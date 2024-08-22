// Basic Imports
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Chakra UI Imports
import {
  Box,
  Flex,
  Stack,
  Text,
  ButtonGroup,
  IconButton,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { Button } from "@/components/ui/button"


// Components Imports
// import Logo from "@/common/components/Logo";
import NavItems from "./NavItems";
import CollapseMenu from "./CollapseMenu";
// import ColorModeSwitcher from "@/website/ColorModeSwitcher";
// import { useAuth } from "@/context/auth/AuthContext";

// Icon Imports
import { FiMenu } from "react-icons/fi";
import { GrUserSettings } from "react-icons/gr";
import { HiOutlineLogout } from "react-icons/hi";
import Image from "next/image";
import { Profile } from "./Profile";
import axios from "axios";
import { useGetUserDataQuery } from "@/queries/profileQueries";
import { get } from "http";
import { set } from "nprogress";


const Header: React.FunctionComponent = () => {

  // const user ={
  //   displayName: "Test User",
  //   photoURL: "https://bit.ly/dan-abramov",

  // };

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('');

  const { mutateAsync: getUser } = useGetUserDataQuery();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsUserAuthenticated(false);
    } else {
      setIsUserAuthenticated(true);

      const fetchGetUser = async () => {
        const result = await getUser();

        setAvatar(result.data.avatar);
        setUsername(result.data.fullName);
      }
      fetchGetUser()
    }
  }, []);

  console.log("userData", userData);


  const user = null;

  const [isOpen, setOpen] = useState(false);

  // const { user, logout } = useAuth();
  const router = useRouter();

  const logoutUser = () => {
    // logout();
    router.reload();
    router.push("/");
  };

  const handleToggle = () => {
    setOpen((prevState: boolean) => !prevState);
  };

  return (
    <React.Fragment>
      <Box
        position="fixed"
        top="0"
        zIndex="10"
        minW="100%"
        px={{ base: 20, lg: 20, md: 20, sm: 0, xs: 0 }}
      >
        <Flex
          backdropFilter="blur(4px)"
          border="none"
          minH="60px"
          py={{ base: 2, md: 3 }}
          px={{ base: 4, md: 7 }}
          alignSelf="center"
        >
          <Stack
            flex={{ base: 1, md: 1 }}
            justify="space-between"
            direction="row"
            align="center"
            cursor="pointer"
          >
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <Image width={32} height={32} src="/findroomieIcon.webp" className="h-8" alt="Flowbite Logo" priority />
              <span className="self-center text-2xl font-lemon  whitespace-nowrap dark:text-white ">findroomie</span>
            </Link>
          </Stack>
          <NavItems />
          <Stack
            flex={{ base: 1, md: 1 }}
            justify="end"
            direction="row"
            align="center"
            spacing="3"
            mx={{
              base: 0,
            }}
          >
            <Link href={'/listing/roommate'} className="mr-4">
              <button className="hidden sm:flex text-primaryBlue border font-montserrat text-[14px] border-primaryBlue px-6 py-1 rounded-[56px] relative">Listing <span className="absolute bg-white text-[24px] top-[-20px] right-1 font-geist-sans w-[20px]">+</span></button>
            </Link>

            {isUserAuthenticated && <div className="md:hidden gap-2 mr-2">
              <Profile avatar={avatar} userName={username} />
            </div>}
            {/* <ColorModeSwitcher /> */}
            <Box display={{ md: "none", lg: "none" }}>
              <IconButton
                variant="outline"
                icon={<FiMenu />}
                colorScheme="blue"
                onClick={handleToggle}
                border="2px"
                aria-label={"Hamburger Menu"}
                _focus={{ boxShadow: "outline" }}
              />
            </Box>
            <Box
              display={{
                base: "flex",
                md: "flex",
                sm: "none",
                xs: "none",
              }}
            >
              {!isUserAuthenticated ? (
                <>
                  <div className="hidden md:flex gap-2">
                    <Link href='/login'>
                      <Button variant="outline" className="hover:">Login</Button>
                    </Link>
                    <Link href='/register'>
                      <Button className='hover:bg-primaryBlue bg-primaryBlue text'>Sign Up</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden md:flex gap-2">
                    <Profile avatar={avatar} userName={username} />
                  </div>
                </>
              )}
            </Box>
          </Stack>
        </Flex>

        <CollapseMenu
          isOpen={isOpen}
          setOpen={handleToggle}
          isUserAuthenticated={isUserAuthenticated}
          avatar={avatar}
          userName={username} />
      </Box>
    </React.Fragment>
  );
};

export default Header;


