import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import './Add.css';
import axios from "axios";
import { toast } from 'react-toastify';

const Add = () => {
   const url = "http://localhost:4000";
    const [image, setImage]  = useState(false);
    const [data, setData] = useState({
        name:"",
        description: "",
        price: "",
        category:"Salad",
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({...data, [name]:value}))
    }

    const onSubmitHandler  = async(event)=>{
     event.preventDefault();
     const form = new FormData();
     form.append("name", data.name);
     form.append("description", data.description);
     form.append("price", Number(data.price));
     form.append("category", data.category);
     form.append("image", image);
     const response = await axios.post(`${url}/api/food/add`, form);
    if(response.data.success){
     setData({
        name:"",
        description: "",
        price: "",
        category: "Salad"
     })
     setImage(false);
     toast.success(response.data.message);
    }
    else{
    toast.error(response.data.message);
    }
    }

    useEffect(() =>{
     console.log(data);
    }, [data])
    
    return (
    <div className='add'>
        <form className="flex-col" onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
       <p>Upload Image</p>
       <label htmlFor="image" className='pp'>
        <img src={assets.upload_area} alt="" />
        <div
          style={{
            width: '100px', 
            height: '100px',
            backgroundImage: image ? `url(${URL.createObjectURL(image)})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div> 
       {/* get preview of upload image */}
       </label>
       <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required />
            </div>
            <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='Type Here'/>
            </div>
            <div className="add-product-description flex-col">
                <p>Product Description</p>
            <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write Your Content Here' required></textarea>
            </div>
            <div className="add-product-price">
                <div className="add-category flex-col">
                    <p>Product Category</p>
                    <select name="category">
                        <option value="Salad">Salad</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Deserts">Deserts</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Cake">Cake</option>
                        <option value="Pure Veg">Pure Veg</option>
                        <option value="Pasta">Pasta</option>
                        <option value="Noodles">Noodles</option>
                    </select>
                </div>
                <div className="add-price flex-col">
  <p>Product Price</p> {/* Update label text to match input field */}
  <input 
    onChange={onChangeHandler} 
    value={data.price} 
    type="Number" 
    name="price" // Changed from "Price" to "price" 
    placeholder='₹20' 
  />
</div>
            </div>
            <button type='submit' className='add-btn'>Add</button>
        </form>
    </div>
  )
}

export default Add
