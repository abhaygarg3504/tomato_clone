import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

    const handleLogout = () => {
        setToken(null); // Clear the token
        localStorage.removeItem("token"); // Clear token from local storage
        // Add any other logout-related logic if necessary
    };

    const menuItems = [
        { name: "Home", to: "/", key: "home" },
        { name: "Menu", to: "#explore-menu", key: "menu" },
        { name: "Mobile-App", to: "#app-download", key: "mobile-app" },
        { name: "Contact Us", to: "#footer", key: "contact-us" },
    ];

    return (
        <nav className='navbar'>
            <Link to='/'><img src={assets.logo} alt="Logo" className="logo" /></Link>
            <ul className='navbar-menu'>
                {menuItems.map(item => (
                    <li key={item.key}>
                        <Link to={item.to} onClick={() => setMenu(item.key)} className={menu === item.key ? "active" : ""}>
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="Search" />
                <div className='navbar-search-icon'>
                    <Link to='/cart'>
                        <img src={assets.basket_icon} alt="Cart" />
                    </Link>
                    {getTotalCartAmount() !== 0 && <div className="dot"></div>}
                </div>
                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Sign In</button>
                ) : (
                    <div className='navbar-profile'>
                        <img src={assets.profile_icon} alt="Profile" />
                        <ul className="navbar-profile-dropdown">
                            <li><img src={assets.bag_icon} alt="Orders" /><p>Orders</p></li><hr />
                            <li onClick={handleLogout}><img src={assets.logout_icon} alt="Logout" /><p>Logout</p></li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
