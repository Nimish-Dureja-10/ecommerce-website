import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import { useCart } from '../context/cart'

const ProductDetails = () => {

  const [product,setProduct] = useState({});
  const params = useParams();
  const [relatedProducts,setRelatedProducts] = useState([]);
  const navigate = useNavigate();
  const [cart,setCart] = useCart();
  
  //for initial product details
  useEffect(()=>{
    if(params?.slug) getProduct();
  },[params?.slug]);

  //get product detail
  const getProduct = async () => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/products/get-product/${params.slug}`);
      setProduct(data?.product);
      getSimilarProducts(data?.product._id,data?.product.category._id);
    } catch (error) {
      console.log(error)
    }
  }

  //get similar products functions
  const getSimilarProducts = async (pid,cid) => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/products/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout title={"Product Details"}>
      <div className='row container m-4'>
        <div className='col-md-6 border p-3'>
        <img height={"350px"} width={"350px"} src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`} className="card-img-top" alt={product.name} />
        </div>
        <div className='col-md-6'>
          <h1 className='text-center'>Products Details</h1>
          <h5>Name: {product.name}</h5>
          <h5>Description: {product.Description}</h5>
          <h5>Price: ₹ {product.price}</h5>
          <h5>Category: {product.category?.slug}</h5>
          <button className="btn btn-outline-success ms-4" onClick={()=>{setCart([...cart,product]); localStorage.setItem('cart',JSON.stringify([...cart,product])); toast.success("Item Added To Cart");}} >Add To Cart</button>
        </div>
        <hr className='mt-4' />
        <div className='row container mt-3'>
          <h4 className='text-center'>Similar Products</h4>
          {relatedProducts.length < 1 && (<h6 className='text-center'>No Similar Product Found 😔</h6>)}
          <div className='d-flex flex-wrap'>
              {relatedProducts.map(product=>(
                  <div key={product._id} className="card m-2" style={{width: '18rem'}} >
                      <img src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`} className="card-img-top" alt={product.name} />
                      <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <p className="card-text">{product.description.substring(0.30)}</p>
                          <p className="card-text">₹ {product.price}</p>
                          <button className="btn btn-outline-primary" onClick={()=>navigate(`/product/${product.slug}`)}>Details</button>
                          <button className="btn btn-outline-success ms-4" onClick={()=>{setCart([...cart,product]); localStorage.setItem('cart',JSON.stringify([...cart,product])); toast.success("Item Added To Cart");}} >Add To Cart</button>
                      </div>
                  </div>
              ))}
            </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProductDetails