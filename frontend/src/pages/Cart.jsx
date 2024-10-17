import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { auth, db } from '../firebase'; // Import the authentication module and Firestore
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Added updateDoc to update Firestore

const Cart = () => {
    const { products, currency, updateQuantity } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);
    const navigateTo = useNavigate(); // Rename this to avoid conflict
    const [user, setUser] = useState(null); // Local user state to manage user login state

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user); // Set user state based on authentication status
            if (!user) {
                toast.error('Please log in to see your products');
                navigateTo('/'); // Redirect if not logged in
            } else {
                // Fetch cart items if the user is logged in
                const cartDocRef = doc(db, "carts", user.uid); // Reference to the user's cart document
                const cartDoc = await getDoc(cartDocRef);

                if (cartDoc.exists()) {
                    const cartItems = cartDoc.data();
                    const tempData = [];
                    for (const items in cartItems) {
                        for (const item in cartItems[items]) {
                            if (cartItems[items][item] > 0) {
                                tempData.push({
                                    _id: items,
                                    size: item,
                                    quantity: cartItems[items][item]
                                });
                            }
                        }
                    }
                    setCartData(tempData);
                } else {
                    setCartData([]); // If no cart found, set cartData to empty
                }
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigateTo]); // Update the dependency to use navigateTo

    // Delete a specific product from Firestore and update local state
    const deleteCartItem = async (itemId, size) => {
        const user = auth.currentUser;
        if (!user) return; // Ensure user is logged in
        
        const cartDocRef = doc(db, "carts", user.uid);
        const cartDoc = await getDoc(cartDocRef);

        if (cartDoc.exists()) {
            const cartItems = cartDoc.data();
            
            if (cartItems[itemId] && cartItems[itemId][size]) {
                delete cartItems[itemId][size]; // Remove the size-specific item
                
                // If no sizes left for the item, remove the item entirely
                if (Object.keys(cartItems[itemId]).length === 0) {
                    delete cartItems[itemId];
                }
                
                // Update Firestore with the updated cart
                await updateDoc(cartDocRef, cartItems);
                
                // Update local state
                const updatedCartData = cartData.filter(
                    (cartItem) => !(cartItem._id === itemId && cartItem.size === size)
                );
                setCartData(updatedCartData);

                toast.success("Item removed from cart!");
            }
        }
    };

    return (
        <div className='border-t pt-14'>
            <div className='text-2xl mb-3'>
                <Title text1={'YOUR'} text2={'CART'} />
            </div>

            <div>
                {cartData.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    cartData.map((item, index) => {
                        const productData = products.find((product) => product._id === item._id);
                        return (
                            <div key={index} className='py-4 border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                                <div className='flex items-start gap-6'>
                                    <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                                    <div>
                                        <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                                        <div className='flex items-center gap-5 mt-2'>
                                            <p>{currency}{productData.price}</p>
                                            <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                                        </div>
                                    </div>
                                </div>
                                <input 
                                    onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
                                    type="number" 
                                    className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' 
                                    min={1} 
                                    defaultValue={item.quantity} 
                                />
                                <img 
                                    onClick={() => deleteCartItem(item._id, item.size)} // Call deleteCartItem when delete icon is clicked
                                    src={assets.bin_icon} 
                                    className='w-4 mr-4 sm:w-5 cursor-pointer' 
                                    alt="Delete"
                                />
                            </div>
                        );
                    })
                )}
            </div>

            <div className='flex justify-end my-20'>
                <div className='w-full sm:w-[450px]'>
                    <CartTotal />
                    <div className='w-full text-end'>
                        <button onClick={() => navigateTo('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
