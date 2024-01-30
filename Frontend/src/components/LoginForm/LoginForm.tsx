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
import { useLoginUserQuery } from "@/queries/profileQueries"

import NProgress from "nprogress";
import toast, { Toaster } from 'react-hot-toast';
import { AxiosError } from "axios"

import Cookies from "universal-cookie";
import useGetAccessToken from "@/hooks/useGetAccessToken"

const formSchema = z.object({
    usernameOrEmail: z.string(),
    password: z.string().min(8, {
        message: "Paasword must be of minimum 8 characters",
    }),
})

export function LoginForm() {

    const { mutateAsync: loginUser } = useLoginUserQuery();

    const cookies = new Cookies();

    const getAccessToken = useGetAccessToken()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })


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
            NProgress.done();
            toast.success(`You're logged in`)

            console.log(result)

            cookies.set("TOKEN", result.data.refreshToken, {
                path: "/",
            });

            // console.log(cookies.get("TOKEN"))

        } catch (error) {
            NProgress.done();

            const axiosError = error as AxiosError;

            if (axiosError?.response?.status === 400) {
                toast.error('User does not exists')
            }
        }
        console.log(values)
    }

    return (
        <>
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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paasword</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe67@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <p>Don&apos;t have an account? <span><Link href='/register'>Register</Link></span></p>
                    <Button type="submit" className="w-full bg-primaryBlue">Submit</Button>
                </form>
            </Form>
            <button className="btn" onClick={getAccessToken}>generate access token</button>
        </>

    )
}