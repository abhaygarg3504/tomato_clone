import React, { useState, useEffect, useContext } from 'react';
import './LoginPopUp.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopUp = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext); // Ensure you use useContext properly
    
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: ""
    });

    useEffect(() => {
        console.log(data); // For debugging purposes
    }, [data]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target; // Destructure for cleaner code
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateData = () => {
        const { name, email, password, phoneNumber } = data;
        if (currState === "Sign-Up") {
            if (!name || !phoneNumber) {
                alert("Name and Phone Number are required.");
                return false;
            }
        }
        if (!email || !password) {
            alert("Email and Password are required.");
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email format.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submitting: ", data);

        if (!validateData()) return; // Stop if validation fails

        const newUrl = `${url}/api/user/${currState === "Login" ? "login" : "register"}`;

        try {
            const response = await axios.post(newUrl, data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                console.error("Error Response: ", error.response.data);
                alert(error.response.data.message || "An error occurred");
            } else {
                console.error("Error: ", error.message);
                alert("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img src={assets.cross_icon} alt="" onClick={() => setShowLogin(false)} />
                </div>
                {currState === "Sign-Up" && (
                    <>
                        <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Enter Your Name' required />
                        <input name='phoneNumber' onChange={onChangeHandler} value={data.phoneNumber} type="text" placeholder='Enter your Phone Number' required />
                    </>
                )}
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email' required />
                <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Enter your Password' required />
                <button type='submit'>{currState === "Sign-Up" ? "Create Account" : "Login"}</button>
                <div className="login-popup-condition">
                    <label>
                        <input type="checkbox" required />
                        <p>By agreeing, I accept the terms, conditions & privacy policy</p>
                    </label>
                </div>
                {currState === "Login" ? (
                    <p>Create a new Account? <span onClick={() => setCurrState("Sign-Up")}>Click Here</span></p>
                ) : (
                    <p>Already Have an Account? <span onClick={() => setCurrState("Login")}>Login Here</span></p>
                )}
            </form>
        </div>
    );
};

export default LoginPopUp;
