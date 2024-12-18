import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
    const url = "http://localhost:4000";
    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            console.log("API Response:", response);  // Logs the full response
            if (response.data && response.data.success) {
                setList(response.data.data);
            } else {
                toast.error("Error loading list");
                console.error("Error response from server:", response.data);
            }
        } catch (error) {
            console.error("Error fetching list:", error.response || error);
            toast.error("Error fetching list");
        }
    };

    const removeFood = async (foodId) => {
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
            console.log("Remove API Response:", response);  // Logs the remove response
            if (response.data && response.data.success) {
                toast.success(response.data.message);
                await fetchList(); 
            } else {
                toast.error("Error removing item");
                console.error("Error removing item:", response.data);
            }
        } catch (error) {
            console.error("Error removing item:", error.response || error);
            toast.error("Error removing item");
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="list add flex-col">
            <p>All Food Lists</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <p>Action</p>
                </div>
                {list.map((item, index) => (
                    <div key={index} className="list-table-format">
                        <img src={`${url}/images/${item.image}`} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>${item.price}</p>
                        <p onClick={() => removeFood(item._id)} className="cursor">X</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default List;
