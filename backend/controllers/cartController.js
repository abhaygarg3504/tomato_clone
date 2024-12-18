import userModel from "../models/userModel.js";

// add items to cart
const addToCart = async(req, res) =>{
  try{
    let userData = await userModel.findById({_id: req.body.userId});
    let cartData = await userData.cartData;
 
    if(!cartData[req.body.itemId]){
     cartData[req.body.itemId] = 1;
    }
    else{
     cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, {cartData});
    res.json({success: true, message: "Added To cart"})
  }
  catch(err){
    console.log(`Error is ${err}`, err);
    res.json({success: false, message: "Can't added To cart"})
  }
}

// remove items from cart

const removeItems = async(req, res)=>{
  try{
  let userData = await userModel.findById(req.body.userId);
  let cartData = await userData.cartData;
  if(cartData[req.body.itemId] > 0){
     cartData[req.body.itemId] -= 1;
  }
  await userModel.findByIdAndUpdate(req.body.userId, {cartData});
  res.json({success: true, message:"removed successfully"})
  }
  catch(err){
   console.log(`Error is ${err}`, err);
   res.json({success: true, message: "Error is there"});
  }
}

// fetch user Cart
const getCart= async(req, res) => {
  try{
     let userData = await userModel.findById(req.body.userId);
     let cartdata = await userData.cartData;
     res.json({success: true, cartdata});
  }
  catch(err){
    console.log(`Error is ${err}`, err);
    res.json({success: false, message: "Error"});
  }
}

export {addToCart, removeItems, getCart};
