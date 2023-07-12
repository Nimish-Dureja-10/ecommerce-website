import React, { useState,useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auth'
import { useCart } from '../context/cart'
import { useNavigate } from 'react-router-dom'
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios'
import toast from 'react-hot-toast'

const CartPage = () => {

  const [auth,setAuth] = useAuth();
  const [cart,setCart] = useCart();
  const navigate = useNavigate();
  const [clientToken,setClientToken] = useState("");
  const [instance,setInstance] = useState("");
  const [loading,setLoading] = useState(false);

  //total price of cart function
  const totalPrice = () => {
      let total = 0;
      cart?.map(item => {total = total + item.price});
      return total;
  }

  const removeCartItem = async (pid) => {
      try {
          let myCart = [...cart];
          let index = myCart.findIndex(item => item._id === pid);
          myCart.splice(index,1);
          setCart(myCart);
          localStorage.setItem("cart",JSON.stringify(myCart));
      } catch (error) {
          console.log(error);
      }
  }

  //get payment gateway token 
  const getToken = async () => {
      try {
          const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/products/braintree/token`);
          setClientToken(data?.clientToken);
      } catch (error) {
          console.log(error);
      }
  }

  useEffect(()=>{
      getToken();
  },[auth?.token]);

  //handle Payment
  const handlePayment = async () => {
      try {
          setLoading(true);
          const {nonce} = await instance.requestPaymentMethod();
          const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/products/braintree/payment`,{
              nonce,
              cart
          });
          setLoading(false);
          localStorage.removeItem("cart");
          setCart([]);
          navigate("/dashboard/user/orders");
          toast.success('Order Placed Successfully')
      } catch (error) {
          console.log(error);
          setLoading(false);
      }
  }

  return (
    <Layout title={"Your Cart"}>
        <div className='container mt-3'>
            <div className='row'>
                <h1 className='text-center'>Your Cart</h1>
                <div className='col-md-12'>
                    <h3 className='text-center text-uppercase bg-light p-2 mb-1'>{`Hello ${auth?.token && auth?.user.name}`}</h3>
                    <h5 className='text-center'>
                        {cart?.length ? `You Have ${cart.length} Items In Your Cart ${auth?.token ? "" : "Please Login To Checkout"}`: "Your Cart Is Empty"}
                    </h5>
                </div>
            </div>
            <div className='row mb-3'>
                <div className='col-md-7 border'>
                    {
                        cart?.map((product) => (
                            <div className='row m-3'>
                                <div className='col-md-4 border p-2'>
                                    <img src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`} className="card-img-top object-fit-contain" alt={product.name} height="150px" width="150px" />
                                </div>
                                <div className='col-md-8'>
                                    <p>{product.name}</p>
                                    <p>{product.description.substring(0,60)}</p>
                                    <p>Price: ₹{product.price}</p>
                                    <button className='btn btn-outline-danger' onClick={()=>removeCartItem(product._id)}>Remove</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='col-md-5 text-center'>
                    <h4>Cart Summary</h4>
                    <p>Total Price | Checkout | Payment</p>
                    <hr/>
                    <h5>Total Price : ₹{totalPrice()}</h5>
                    {auth?.user?.address ? (
                        <>
                            <div className='mb-3 text-center'>
                                <h4>Current Address</h4>
                                <h6>
                                    {auth?.user?.address}
                                    <button className='btn btn-outline-warning w-100 mt-3' onClick={()=>navigate("/dashboard/user/profile")}>Update Address</button>
                                </h6>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='mb-3 text-center'>
                                {auth?.token ? (
                                    <button className='btn btn-outline-warning w-100 mt-3' onClick={()=>navigate("/dashboard/user/profile")}>Update Address</button>
                                ) : (
                                    <button className='btn btn-outline-warning w-100 mt-3' onClick={()=>navigate("/login",{state:"/cart"})}>Please Login to Checkout</button>
                                )}
                            </div>
                        </>
                    )}
                    <div className='mt-2'>
                        {
                            !clientToken || !cart?.length ? ("") : (
                                <>
                                <DropIn 
                                    options={{
                                    authorization:clientToken,
                                    paypal:{
                                        flow:"vault"
                                    }
                                    }}
                                    onInstance={instance=>setInstance(instance)}
                                />
                                <button className='btn btn-outline-success w-100' onClick={handlePayment} disabled={loading || !instance || !auth?.user?.address} >{loading ? "Processing..." : "Make Payment"}</button>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default CartPage