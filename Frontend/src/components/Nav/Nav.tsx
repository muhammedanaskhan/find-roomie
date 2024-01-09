import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"

import { Collapse } from 'flowbite';
import type { CollapseOptions, CollapseInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';


function Nav() {


    return (
        <div className='border-b-2 border-grayAlpha400'>
            <nav className="bg-white border-gray-200 dark:bg-gray-900 w-full backdrop-blur">
                <div className=" flex flex-wrap items-center justify-between mx-auto py-4 px-12 ">
                    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="/find-roomie.png" className="h-8" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-lemon  whitespace-nowrap dark:text-white ">findroomie</span>
                    </a>
             
                    <div className="hidden w-full lg:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <a href="#" className="block py-2 px-3 text-gray-500" aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 text-gray-500 hover:primaryBlue ">About</a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 text-gray-500 ">Services</a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 text-gray-500">Pricing</a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 text-gray-500">Contact</a>
                            </li>
                        </ul>
                    </div>
                    <div className='hidden lg:flex gap-4'>
                        <Button variant="outline" >Login</Button>
                        <Button className='bg-primaryBlue text'>Sign Up</Button>
                    </div>
                </div>
            </nav>


        </div>
    )
}

export default Nav