import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    // Prepare order items
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    // Construct order data
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2, // Add any additional charges
    };

    // Debugging logs
    console.log("Order Data:", orderData);
    console.log("API Endpoint:", url + "/api/order/place");

    try {
      // Send API request with the token in the Authorization header
      const response = await axios.post(
        url + "/api/order/place", 
        orderData, 
        {
          headers: { 
            Authorization: `Bearer ${token}`  // Correct token format with "Bearer"
          }
        }
      );

      // Debugging response
      console.log("API Response:", response.data);

      // Check API response for success
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      // Log any errors during the request
      console.error("Error placing order:", error);

      // Show error alert with details
      alert(
        "An error occurred while placing the order. Details: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="Enter First Name" />
          <input name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Enter Last Name" />
        </div>
        <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Enter Your Email" />
        <input name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Enter Your Street" />
        <div className="multi-fields">
          <input name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="Enter Your City" />
          <input name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="Enter Your State" />
        </div>
        <div className="multi-fields">
          <input name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip Code" />
          <input name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input name="phone" onChange={onChangeHandler} value={data.phone} type="number" placeholder="Enter Your Phone Number" />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 20}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Total</p>
            <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</p>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
