"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useLoginUserQuery, useRegisterUserMutation } from "@/queries/profileQueries"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import NProgress from "nprogress";

import toast, { Toaster } from 'react-hot-toast';
import { AxiosError } from "axios"
import { jwtDecode } from "jwt-decode"

import { useAppDispatch } from "@/Redux/hooks"
import { setAuth } from "@/Redux/authSlice"
import { Card } from "../ui/card"

import eyeOff from "@/assets/images/eyeOff.svg"
import eyeOn from "@/assets/images/eyeOn.svg"
import Image from "next/image"

const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    userName: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().includes('@', {
        message: "Invalid Email",
    }),
    password: z.string().min(8, {
        message: "Paasword must be of minimum 8 characters",
    }),
})

export function RegisterForm() {

    const dispatch = useAppDispatch()


    const router = useRouter();

    const notify = () => toast('Here is your toast.');

    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: "",
        },
    })

    interface RegisterUserData {
        fullName: string;
        userName: string;
        email: string;
        password: string;
    }

    interface LoginUserData {
        userName?: string;
        email?: string;
        password: string;
    }


    function onSubmit(values: z.infer<typeof formSchema>) {
        const fullName: string = values.firstName.concat(" ", values.lastName)
        const userName: string = values.userName
        const email: string = values.email
        const password: string = values.password

        const userData: RegisterUserData = {
            fullName,
            userName,
            email,
            password
        }

        handleUserRegistration(userData)
    }

    const { mutateAsync: registerUser } = useRegisterUserMutation();
    const { mutateAsync: loginUser } = useLoginUserQuery();

    const notifyRegisterSuccess = (name: string) => toast.success(`You're Registered ${name}!`)
    const notifyRegisterError = (message: string) => toast.success(`${message}!`)

    // toast.loading('Waiting...');
    const handleUserRegistration = async (userData: RegisterUserData) => {
        try {
            NProgress.start();
            const result = await registerUser(userData)
            console.log(result)

            if (!result.data.isUserAuthenticated) {
                const logindata: LoginUserData = {
                    email: result.data.email,
                    password: userData.password
                }

                const loginResult = await loginUser(logindata)

                const responseIsUserAuthenticated = loginResult.data.isUserAuthenticated;
                const responseUserName = loginResult.data.userName;
                const responseEmail = loginResult.data.email;
                const responseAccessToken = loginResult.data.accessToken;

                const decodedToken = jwtDecode<{ exp: number }>(responseAccessToken);
                const accessTokenExpiry = decodedToken.exp;

                const accessTokenExpiryTime = new Date(accessTokenExpiry * 1000);


                localStorage.setItem('accessToken', responseAccessToken);
                localStorage.setItem('accessTokenExpiryTime', accessTokenExpiryTime.toString());
                localStorage.setItem('isUserAuthenticated', 'false');
                dispatch(
                    setAuth(
                        {
                            userName: responseUserName,
                            email: responseEmail,
                            accessToken: responseAccessToken
                        }
                    )
                )

                notifyRegisterSuccess(result?.data?.fullName)


                router.push('/login/personal-details')
            } else {
                router.push('/')
            }
            NProgress.done();
        } catch (error) {
            console.log(`Error registering user ${error}`)
            NProgress.done();

            const axiosError = error as AxiosError
            if (axiosError?.response?.status === 409) {

                toast.error('User already exists.');
            } else {
                toast.error('An error occurred during registration.');
            }
        }
    }


    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleGuestLogin = async () => {
        try {
            NProgress.start();
            const guestCredentials = {
                email: "guest@findroomie.co",
                password: "Guest@123"
            };

            const loginResult = await loginUser(guestCredentials);

            if (loginResult.data.accessToken) {
                const responseAccessToken = loginResult.data.accessToken;
                const decodedToken = jwtDecode<{ exp: number }>(responseAccessToken);
                const accessTokenExpiry = decodedToken.exp;
                const accessTokenExpiryTime = new Date(accessTokenExpiry * 1000);

                localStorage.setItem('accessToken', responseAccessToken);
                localStorage.setItem('accessTokenExpiryTime', accessTokenExpiryTime.toString());

                dispatch(
                    setAuth({
                        userName: loginResult.data.userName,
                        email: loginResult.data.email,
                        accessToken: responseAccessToken
                    })
                );

                NProgress.done();
                toast.success(`Logged in as Guest!`);

                const responseIsUserAuthenticated = loginResult.data.isUserAuthenticated;
                if (!responseIsUserAuthenticated) {
                    localStorage.setItem('isUserAuthenticated', 'false');
                    router.push('/login/personal-details');
                } else {
                    router.push('/');
                }
            }
        } catch (error) {
            NProgress.done();
            toast.error('Guest login failed. Please try again.');
        }
    };

    return (
        <Card className=" p-6 sm:p-10 lg:p-12">
            <div className='flex justify-center items-center mb-8'>
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    {/* <Image width={32} height={32} src="/findroomieIcon.webp" className="h-8" alt="Flowbite Logo" priority /> */}
                    <span className="self-center text-2xl font-lemon  whitespace-nowrap dark:text-white ">findroomie</span>
                </Link>
            </div>
            <Form {...form}>
                <Toaster />
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 min-w-64 max-w-lg">
                    <div className="flex gap-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="j_doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe67@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="relative">
                        <FormField
                            control={form.control}
                            name="password"

                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type={showPassword ? 'text' : 'password'} placeholder="j@d@sssup" {...field} />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-[50px] right-2 flex items-center focus:outline-none"
                        >
                            {showPassword ? (
                                <Image src={eyeOn} alt="hide password" width={20} height={20} />
                            ) : (
                                <Image src={eyeOff} alt="show password" width={20} height={20} />
                            )}
                        </button>
                    </div>

                    <p>Already have an account? <span><Link href='/login'>Login</Link></span></p>
                    <Button type="submit" className="w-full hover:bg-primaryBlue  bg-primaryBlue">Submit</Button>

                    <div className="relative flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <Button 
                        type="button" 
                        onClick={handleGuestLogin}
                        variant="outline"
                        className="w-full border-2 border-primaryBlue text-primaryBlue hover:bg-primaryBlue hover:text-white transition-colors"
                    >
                        🚀 Try as Guest
                    </Button>

                </form>
            </Form>
        </Card>

    )
}