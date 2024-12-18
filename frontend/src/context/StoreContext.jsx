import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

// Default export for StoreContextProvider
const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Add an item to the cart
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  
    if (token) {
      try {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { Authorization: `Bearer ${token}`,} });
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    } else {
      console.log("No token found. User might not be authenticated.");
    }
  };
  

  // Remove an item from the cart
  const removeFromCart = async (itemId) => {
    // setCartItems((prev) => {
      // const newCart = { ...prev };
      // if (newCart[itemId] > 1) {
      //   newCart[itemId] -= 1; // Decrement quantity
      // } else {
      //   delete newCart[itemId]; // Remove item from cart
      // }
      // return newCart;
      setCartItems((prev) => ({...prev, [itemId]: prev[itemId]-1}));
      if(token){
        await axios.post(url+"/api/cart/remove", {itemId}, {headers:{token}});
      }
  };

  // Calculate total cart amount
  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const itemInfo = food_list.find((product) => product._id === itemId);
      return total + (itemInfo ? itemInfo.price * cartItems[itemId] : 0);
    }, 0);
  };

  // Fetch food list from API
  const fetchFoodList = async () => {
    try {
        const response = await axios.get(url + "/api/food/list"); 
        setFoodList(response.data.data);
    } catch (error) {
        console.error("Error fetching food list:", error);
    }
};

  const loadCartData = async(token)=>{
    const response = await axios.post(url+"/api/cart/get", {}, {headers:{token}});
    setCartItems(response.data.cartData);
  }

  useEffect(() => {
    const loadData = async () => {
      const savedToken = localStorage.getItem("token");
      console.log("Token fetched from localStorage:", savedToken); // Debug
      if (savedToken) {
        setToken(savedToken);
        // await loadCartData(savedToken); // Ensure token is passed correctly
      }
      await fetchFoodList();
    };
    loadData();
  }, []);
  

  // Synchronize cart items and token with local storage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("token", token);
  }, [cartItems, token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider; // Default export for provider
