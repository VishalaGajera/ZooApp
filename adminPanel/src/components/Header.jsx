import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LuLayoutGrid, LuMoon, LuUsers, LuSun } from "react-icons/lu";
import { FiLayers, FiLogOut, FiUser } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiMenuUnfold3Line } from "react-icons/ri";
import { VscFeedback } from 'react-icons/vsc';
import { FaHandsHoldingCircle } from "react-icons/fa6";

const Header = () => {
    const [dropDownMenu, setDropDownMenu] = useState(false);
    const [notificationMenu, setNotificationMenu] = useState(false);
    const [theme, setTheme] = useState('light');
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };
      

    return (
        <div className='flex h-full w-full'>
            <div className="bg-white h-full text-main w-72 hidden lg:block min-w-72">
                <h2 className="flex border-b border-lightBlue h-20 justify-center items-center">
                    <Link to={"/"}>
                        <img src="https://modavenextjs.vercel.app/images/logo/logo.svg" alt="" className="w-36" />
                    </Link>
                </h2>
                <ul className="p-4 space-y-3">
                    <li className='w-full'>
                        <Link to={'/'} className={`list-navItem ${isActive('/') ? 'active-navItem' : ""}`}>
                            <div className='flex gap-3 items-center'>
                                <span><LuLayoutGrid className='text-xl' /></span>
                                Dashboard
                            </div>
                        </Link>
                    </li>
                    <li className='w-full'>
                        <Link to={'/user'} className={`list-navItem  ${isActive('/user') ? 'active-navItem' : ""}`}>
                            <div className='flex gap-3 items-center'>
                                <span><LuUsers className='text-xl' /></span>
                                User
                            </div>
                        </Link>
                    </li>
                    <li className='w-full'>
                        <Link to={'/adoption'} className={`list-navItem  ${isActive('/adoption') ? 'active-navItem' : ""}`}>
                            <div className='flex gap-3 items-center'>
                                <span><FaHandsHoldingCircle className='text-xl' /></span>
                                Adoptions
                            </div>
                        </Link>
                    </li>
                    <li className='w-full'>
                        <Link to={'/feedback'} className={`list-navItem  ${isActive('/feedback') ? 'active-navItem' : ""}`}>
                            <div className='flex gap-3 items-center'>
                                <span><VscFeedback className='text-xl' /></span>
                                Feedback
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className='flex flex-col h-full w-full min-h-screen'>
                <div className='flex bg-white h-20 justify-between shadow-lg gap-3 items-center px-5 py-5'>
                    <div className='flex gap-2 items-center lg:hidden'>
                        <Link to={"/"}>
                            <img src="https://modavenextjs.vercel.app/images/logo/logo.svg" alt="" className="w-36" />
                        </Link>
                        <span className='text-secondary_2 text-3xl'><RiMenuUnfold3Line /></span>
                    </div>
                    <div className='flex justify-end w-full items-end'>
                        <ul className='flex gap-5 items-center'>
                            <li className='hidden lg:flex'>
                                <span className='flex bg-surface h-10 justify-center rounded-full text-xl w-10 cursor-pointer items-center'onClick={toggleTheme}>{theme === 'light' ? <LuMoon /> : <LuSun />}</span>
                            </li>
                            <li className='hidden lg:flex relative'>
                                <div className='cursor-pointer relative' onClick={() => setNotificationMenu(!notificationMenu)}>
                                    <span className='flex bg-primary h-4 justify-center rounded-full text-white text-xs w-4 -right-0.5 -top-0.5 absolute after:-z-10 after:absolute after:animate-ping after:bg-primary after:h-4 after:right-0 after:rounded-full after:top-0 after:w-4 items-center z-20'>1</span>
                                    <span className='flex bg-surface h-10 justify-center rounded-full text-xl w-10 items-center'><IoMdNotificationsOutline /></span>
                                </div>
                                {
                                    notificationMenu && (
                                        <div className='flex flex-col bg-white p-5 rounded-lg shadow-custom w-96 absolute gap-5 right-0 top-14'>
                                            <h1 className='text-xl font-bold'>Notifications</h1>
                                            <div className='bg-lightBlue h-0.5 w-full'></div>
                                            <ul className='flex flex-col gap-5'>
                                                <li className='flex gap-3 items-center'>
                                                    <span className='bg-blue bg-opacity-10 p-4 rounded-full text-2xl text-blue'><VscFeedback /></span>
                                                    <div>
                                                        <h2 className='font-semibold'>New Feedback</h2>
                                                        <p className='text-secondary_2 text-sm leading-4 line-clamp-2'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, tenetur?</p>
                                                    </div>
                                                </li>
                                                <li className='flex gap-3 items-center'>
                                                    <span className='bg-opacity-10 bg-primary p-4 rounded-full text-2xl text-primary'><FaHandsHoldingCircle /></span>
                                                    <div>
                                                        <h2 className='font-semibold'>New Adoption</h2>
                                                        <p className='text-secondary_2 text-sm leading-4 line-clamp-2'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, tenetur?</p>
                                                    </div>
                                                </li>
                                                <li className='flex gap-3 items-center'>
                                                    <span className='bg-blue bg-opacity-10 p-4 rounded-full text-2xl text-blue'><VscFeedback /></span>
                                                    <div>
                                                        <h2 className='font-semibold'>New Feedback</h2>
                                                        <p className='text-secondary_2 text-sm leading-4 line-clamp-2'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, tenetur?</p>
                                                    </div>
                                                </li>
                                                <li className='flex gap-3 items-center'>
                                                    <span className='bg-opacity-10 bg-primary p-4 rounded-full text-2xl text-primary'><FaHandsHoldingCircle /></span>
                                                    <div>
                                                        <h2 className='font-semibold'>New Adoption</h2>
                                                        <p className='text-secondary_2 text-sm leading-4 line-clamp-2'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, tenetur?</p>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div>
                                                <button className='bg-blue border border-blue p-3 rounded-lg text-white w-full font-semibold hover:bg-transparent hover:text-blue smoothly-transaction'>View All</button>
                                            </div>
                                        </div>
                                    )
                                }
                            </li>
                            <li className='bg-surface h-7 w-px hidden lg:flex'></li>
                            <li className='hidden lg:flex min-w-max relative'>
                                <Link className='flex gap-3 items-center' onClick={() => setDropDownMenu(!dropDownMenu)}>
                                    <div className='h-10 rounded-full w-10'>
                                        <img src="https://remosnextjs.vercel.app/images/avatar/user-1.png" alt="" className='h-full w-full' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-bold'>Kristin Waston</span>
                                        <span className='text-secondary_2 text-xs'>Admin</span>
                                    </div>
                                </Link>
                                {dropDownMenu && (
                                    <ul className='flex flex-col bg-white p-5 rounded-lg shadow-custom w-full absolute gap-3 right-0 top-14'>
                                        <li><Link to={'/profile'} className='flex cursor-pointer font-semibold gap-3 items-center' onClick={() => setDropDownMenu(false)}><span className='text-secondary_2 text-xl'><FiUser /></span>Profile</Link></li>
                                        <li><Link className='flex cursor-pointer font-semibold gap-3 items-center'><span className='text-secondary_2 text-xl'><FiLogOut /></span>Log out</Link></li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='flex-grow bg-lightBlue overflow-y-auto scrollbar-hide'>
                    <Outlet />
                </div>
                <section className='flex bg-white h-20 justify-center w-full items-center'>
                    <span className='flex h-20 gap-1 items-center'>Copyright © 2025.</span>
                </section>
            </div>
        </div>
    );
}

export default Header;