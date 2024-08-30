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
import { useGetUserDataQuery, useLoginUserQuery } from "@/queries/profileQueries"

import eyeOff from "@/assets/images/eyeOff.svg"
import eyeOn from "@/assets/images/eyeOn.svg"

import NProgress from "nprogress";
import toast, { Toaster } from 'react-hot-toast';
import { AxiosError } from "axios"

import Cookies from "universal-cookie";
import useGetAccessToken from "@/hooks/useGetAccessToken"

import { useAppDispatch } from "@/Redux/hooks"
import { setAuth } from "@/Redux/authSlice"

import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react"
import useCheckAccessTokenExpiry from "@/hooks/useCheckAccessTokenExpiryAndUpdate"
import isUserAuthenticated from "@/utils/Auth"
import { redirect } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { useRouter } from "next/router"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"


const formSchema = z.object({
    usernameOrEmail: z.string(),
    password: z.string().min(8, {
        message: "Paasword must be of minimum 8 characters",
    }),
})

export function LoginForm() {

    const { mutateAsync: loginUser } = useLoginUserQuery();

    useCheckAccessTokenExpiry();

    const cookies = new Cookies();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const dispatch = useAppDispatch()

    const router = useRouter()

    const { mutateAsync: getUser } = useGetUserDataQuery();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            NProgress.start();

            let result;
            if (values.usernameOrEmail.includes('@')) {
                const email = values.usernameOrEmail;
                result = await loginUser({ email, password: values.password })
            } else if (!values.usernameOrEmail.includes('@')) {
                const userName = values.usernameOrEmail;
                result = await loginUser({ userName, password: values.password })
            }

            console.log(result)

            if (result.data.accessToken) {
                localStorage.setItem('accessToken', result.data.accessToken);

                const userDetails = await getUser();
                dispatch(setAuth({
                    userName: userDetails.data.fullName,
                    email: userDetails.data.email,
                    accessToken: result.accessToken,
                    isUserAuthenticated: true,
                    avatar: userDetails.data.avatar
                }));
            }

            NProgress.done();
            toast.success(`You're logged in`)

            const responseIsUserAuthenticated = result.data.isUserAuthenticated;

            if (!responseIsUserAuthenticated) {
                localStorage.setItem('isUserAuthenticated', 'false');
                router.push('/login/personal-details');
            } else {
                router.push('/');
            }


            const responseUserName = result.data.userName;
            const responseEmail = result.data.email;
            const responseAccessToken = result.data.accessToken;

            const decodedToken = jwtDecode<{ exp: number }>(responseAccessToken);
            const accessTokenExpiry = decodedToken.exp;

            const accessTokenExpiryTime = new Date(accessTokenExpiry * 1000);
            console.log(accessTokenExpiryTime)

            localStorage.setItem('accessToken', responseAccessToken);
            localStorage.setItem('accessTokenExpiryTime', accessTokenExpiryTime.toString());

            dispatch(
                setAuth(
                    {
                        userName: responseUserName,
                        email: responseEmail,
                        accessToken: responseAccessToken
                    }
                )
            )

        } catch (error) {
            NProgress.done();

            const axiosError = error as AxiosError;

            if (axiosError?.response?.status === 400) {
                const errorData: any = axiosError.response.data;
                toast.error(errorData.message)
            }
        }
        console.log(values)
    }

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <>
            <Card className=" p-6 sm:p-10 lg:p-12">
                <div className='flex justify-center items-center mb-8'>
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        {/* <Image width={32} height={32} src="/findroomieIcon.webp" className="h-8" alt="Flowbite Logo" priority /> */}
                        <span className="self-center text-2xl font-lemon  whitespace-nowrap dark:text-white ">findroomie</span>
                    </Link>
                </div>
                <Form {...form}>
                    <Toaster />
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-1/4 min-w-64 max-w-lg">

                        <FormField
                            control={form.control}
                            name="usernameOrEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username or Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="j_doe" {...field} />
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
                                        <FormLabel>Paasword</FormLabel>
                                        <FormControl>
                                            <Input type={showPassword ? 'text' : 'password'} placeholder="Enter password..." {...field} />
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


                        <p>Don&apos;t have an account? <span><Link href='/register'>Register</Link></span></p>
                        <Button type="submit" className="w-full  hover:bg-primaryBlue bg-primaryBlue">Submit</Button>
                    </form>
                </Form>
                {/* <button className="btn" onClick={getAccessToken}>generate access token</button> */}
            </Card>

        </>

    )
}