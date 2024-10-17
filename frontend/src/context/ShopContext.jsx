import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets"; // Assuming products are coming from assets
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { db } from '../firebase'; // Import your Firebase configuration
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore methods
import { auth } from '../firebase'; // Import the authentication module

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();

    // Fetch cart items from Firestore when the component mounts
    useEffect(() => {
        const fetchCartItems = async () => {
            const user = auth.currentUser;
            if (user) {
                const cartDocRef = doc(db, "carts", user.uid);
                const cartDoc = await getDoc(cartDocRef);
                
                if (cartDoc.exists()) {
                    setCartItems(cartDoc.data());
                } else {
                    setCartItems({});
                }
            }
        };

        fetchCartItems();
    }, []);

    // Save cart items to Firestore whenever they are updated
    useEffect(() => {
        const saveCartItems = async () => {
            const user = auth.currentUser;
            if (user) {
                const cartDocRef = doc(db, "carts", user.uid);
                await setDoc(cartDocRef, cartItems, { merge: true }); // Use merge: true to merge cart data instead of overwriting
            }
        };

        saveCartItems();
    }, [cartItems]);

    // Add product to cart logic
    const addToCart = async (itemId, size) => {
        const user = auth.currentUser;
        if (!user) {
            toast.error('Please log in to add items to the cart.');
            return;
        }

        if (!size) {
            toast.error('Please Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        // Check if item already exists in the cart, and add/update quantity
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);

        // Save the updated cart to Firestore
        const cartDocRef = doc(db, "carts", user.uid);
        await setDoc(cartDocRef, { [itemId]: cartData[itemId] }, { merge: true }); // Merge only the updated item
    };

    const getCartCountFromDB = async () => {
        let totalCount = 0;
        const user = auth.currentUser;
    
        if (user) {
            const cartDocRef = doc(db, "carts", user.uid); // Reference to the user's cart document
            const cartDoc = await getDoc(cartDocRef);
    
            if (cartDoc.exists()) {
                const cartItems = cartDoc.data();
                for (const items in cartItems) {
                    for (const item in cartItems[items]) {
                        totalCount += cartItems[items][item] || 0;
                    }
                }
            }
        }
    
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity <= 0) {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId][size] = quantity;
        }

        setCartItems(cartData);

        // Save the updated cart to Firestore
        const user = auth.currentUser;
        if (user) {
            const cartDocRef = doc(db, "carts", user.uid);
            await setDoc(cartDocRef, cartData, { merge: true }); // Merge updated data
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                totalAmount += (itemInfo?.price || 0) * (cartItems[items][item] || 0);
            }
        }
        return totalAmount;
    };

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCartCountFromDB, updateQuantity, getCartAmount, navigate
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
