import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            <div className='footer-content-left'>
                <img src={assets.logo} alt="" />
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam quia labore quas accusantium, fugit eveniet harum vitae! At repellat soluta illum quasi quis! Deleniti itaque quae modi deserunt et? Voluptatibus!</p>
           <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
           </div>
            </div>
        <div className='footer-content-center'>
        <h2>COMPANY</h2>
        <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy</li>
        </ul>
        </div>
        <div className='footer-content-right'>
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+1-243-637-78292</li>
                <li>contact@tomato.com</li>
            </ul>
        </div>
        </div>
        <hr />
        <p className="footer-copyright">
        CopyRight 2024 @Tomato.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
