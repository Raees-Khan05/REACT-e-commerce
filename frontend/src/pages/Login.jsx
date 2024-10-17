import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after login/signup
import { auth } from '../firebase'; // firebase.js file ko import kiya, jisme auth configured hai
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase ke methods import kiye

const Login = () => {
    const [currentState, setCurrentState] = useState('Sign Up');
    const [email, setEmail] = useState(''); // Email state
    const [password, setPassword] = useState(''); // Password state
    const [name, setName] = useState(''); // Name state for signup

    const navigate = useNavigate(); // Hook to navigate to different pages

    const onSubmitHandler = async (event) => {
        event.preventDefault(); // Form submit prevent default behaviour

        try {
            if (currentState === 'Sign Up') {
                // Signup functionality using Firebase createUserWithEmailAndPassword
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log("User Signed Up Successfully: ", userCredential.user);
                alert("Sign Up successful!");

                // Redirect to home page after signup
                navigate('/');
            } else {
                // Login functionality using Firebase signInWithEmailAndPassword
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("User Logged In Successfully: ", userCredential.user);
                alert("Login successful!");

                // Redirect to home page after login
                navigate('/');
            }
        } catch (error) {
            // Error handling for both Login and Sign Up
            console.error("Error during authentication: ", error.message);
            alert(error.message);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='text-3xl'>{currentState}</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
            </div>

            {/* Name field will only show when it's Sign Up */}
            {currentState === 'Login' ? '' : 
                <input type="text" 
                    className='w-full px-3 py-2 border border-gray-800' 
                    placeholder='Name' 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} // Name input state
                    required 
                />
            }

            <input 
                type="email" 
                className='w-full px-3 py-2 border border-gray-800' 
                placeholder='Email' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} // Email input state
                required 
            />

            <input 
                type="password" 
                className='w-full px-3 py-2 border border-gray-800' 
                placeholder='Password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} // Password input state
                required 
            />

            <div className='w-full flex justify-between text-sm mt-[-8px]'>
                <p>Forgot Your Password?</p>
                {
                    currentState === 'Login' 
                    ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create Account</p> 
                    : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
                }
            </div>

            <button className='bg-black text-white font-light px-8 py-2 mt-4'>
                {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
            </button>
        </form>
    );
}

export default Login;
