import React, { useState, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { auth } from '../firebase'; // Firebase auth import
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { ShopContext } from '../context/ShopContext'; // Import ShopContext instead of getCartCountFromDB

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState(null); // State to store the user
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
    const [cartCount, setCartCount] = useState(0); // State for cart count

    // Get the getCartCountFromDB function from ShopContext using useContext
    const { getCartCountFromDB } = useContext(ShopContext);

    // Checking authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser); // Set user if logged in
                fetchCartCount(); // Fetch cart count on user login
            } else {
                setUser(null); // Set user as null if not logged in
                setCartCount(0); // Reset cart count when logged out
            }
        });

        return () => unsubscribe(); // Cleanup on component unmount
    }, []);

    // Fetch cart count from Firestore
    const fetchCartCount = async () => {
        const count = await getCartCountFromDB();
        setCartCount(count); // Update state with the fetched cart count
    };

    // Logout handler
    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out the user
            alert("You have been logged out.");
            setCartCount(0); // Reset cart count on logout
        } catch (error) {
            console.error("Error logging out: ", error);
            alert("Error logging out.");
        }
    };

    // Toggle dropdown on click
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <Link to='/'>
                <img src={assets.logo} className='w-36' alt="" />
            </Link>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>COLLECTION</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className="flex items-center gap-6">
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

                {/* Profile icon and dropdown */}
                <div className="relative">
                    <img 
                        onClick={toggleDropdown} 
                        src={assets.profile_icon} 
                        className='w-5 cursor-pointer' 
                        alt="Profile Icon" 
                    />
                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 py-2 bg-slate-100 text-gray-500 rounded shadow-lg z-50">
                            <div className="flex flex-col gap-2 py-3 px-5">
                                {user ? (
                                    <>
                                        {/* Show email or name here */}
                                        <p className='cursor-pointer text-gray-700 truncate'>
                                            {user.displayName || user.email}
                                        </p>
                                        <Link to='/orders'>
                                            <p className='cursor-pointer hover:text-black'>Orders</p>
                                        </Link>
                                        <p onClick={handleLogout} className='cursor-pointer hover:text-black'>Logout</p>
                                    </>
                                ) : (
                                    <>
                                        {/* Default My Profile when user not logged in */}
                                        <Link to='/login'>
                                            <p className='cursor-pointer hover:text-black'>Login</p>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-3.5 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
                        {cartCount} {/* Cart count coming from Firestore */}
                    </p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>

            {/* Sidebar menu for small screens */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img src={assets.dropdown_icon} className='h-4 rotate-180 cursor-pointer' alt="" />
                        <p>Back</p>
                    </div>

                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
