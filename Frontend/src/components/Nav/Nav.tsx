import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"

import { Collapse } from 'flowbite';
import type { CollapseOptions, CollapseInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import Link from 'next/link';
import Image from 'next/image';


function Nav() {


    return (
        <div className='border-b-2 border-grayAlpha400 sticky top-0'>
            <nav className="bg-white border-gray-200 dark:bg-gray-900 w-full backdrop-blur">
                <div className=" px-4 flex flex-wrap items-center justify-between mx-auto py-4 sm:px-12 ">
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image width={32} height={32} src="/findroomieIcon.webp" className="h-8" alt="Flowbite Logo" priority />
                        <span className="self-center text-2xl font-lemon  whitespace-nowrap dark:text-white ">findroomie</span>
                    </Link>

                    <div className="hidden w-full lg:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <Link href="#" className="block py-2 px-3 text-gray-500" aria-current="page">Home</Link>
                            </li>
                            <li>
                                <Link href="#" className="block py-2 px-3 text-gray-500 hover:primaryBlue ">About</Link>
                            </li>
                            <li>
                                <Link href="#" className="block py-2 px-3 text-gray-500 ">Services</Link>
                            </li>
                            <li>
                                <Link href="#" className="block py-2 px-3 text-gray-500">Pricing</Link>
                            </li>
                            <li>
                                <Link href="#" className="block py-2 px-3 text-gray-500">Contact</Link>
                            </li> 
                        </ul>
                    </div>
                    <div className='hidden lg:flex gap-4'>
                        <Button variant="outline" >Login</Button>
                        <Link href='/register'>
                            <Button className='bg-primaryBlue text'>Sign Up</Button>
                        </Link>

                    </div>
                </div>
            </nav>


        </div>
    )
}

export default Nav