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
            console.log("result")

            if(result.statusCode === 200){
                notifyRegisterSuccess(result?.data?.fullName)
            }
            
            if (result.data.isUserAuthenticated) {
                router.push('user-profile')
            } else {

                const logindata: LoginUserData = {
                    email: result.data.email,
                    password: userData.password
                }
                loginUser(logindata)
            }
            NProgress.done();
        } catch (error) {
            console.log(`Error registering user ${error}`)
            NProgress.done();

            const axiosError = error as AxiosError;
            if (axiosError?.response?.status === 409) {
                toast.error('User already exists.');
              } else {
                toast.error('An error occurred during registration.');
              }
        }
    }


    return (
        <Form {...form}>
            <Toaster />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-1/4 min-w-64 max-w-lg">
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
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="j@d@sssup" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <p>Already have an account? <span><Link href='/login'>Login</Link></span></p>
                <Button type="submit" className="w-full bg-primaryBlue">Submit</Button>
                
            </form>
        </Form>
    )
}