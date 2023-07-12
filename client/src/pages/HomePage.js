import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout'
import {Checkbox, Radio} from 'antd'
import { prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import Start from '../components/Layout/Start';

const HomePage = () => {
  const [cart,setCart] = useCart();
  const [products,setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [checked,setChecked] = useState([]);
  const [radio,setRadio] = useState([]);
  const [total,setTotal] = useState(0);
  const [page,setPage] = useState(1);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  //get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/products/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(()=>{
    if(!checked.length || !radio.length) getAllProducts();
  },[checked.length,radio.length]);

  //get categories
  const getAllCategory = async () =>{
    try {
        const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
        if(data?.success){
            setCategories(data?.category);
        }
    } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong");
    }
  }

  useEffect(()=>{
    getAllCategory();
    getTotal();
  },[]);

  //handle filter function
  const handleFilter = (value,id) => {
    let all = [...checked];
    if(value){
      all.push(id);
    }else{
      all = all.filter((c)=>c!==id)
    }
    setChecked(all);
  };

  //get total count
  const getTotal = async () => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/products/product-count`);
      if(data?.success){
        setTotal(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    if(page === 1) return;
    loadMore();
  },[page]);

  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/products/product-list/${page}`);
      setLoading(false);
      setProducts([...products,...data.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  //get filtered products
  const filterProducts = async () => {
    try {
      const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/products/product-filters`,{checked,radio});
      setProducts(data?.products);
    } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong In Filtering Product");
    }
  }

  useEffect(()=>{
    if(checked.length || radio.length) filterProducts();
  },[checked,radio]);

  return (
    <Layout title={"Best offers are here!!!"}>
    <div className='container-fluid w-75'>
      <Start/>
    </div>
    <hr/>
        <div className='row mt-5'>
          <div className='col-md-2'>
            <h4 className='text-center'>Filter By Category</h4>
            <div className='d-flex flex-column ms-2'>
              {categories.map((c)=>(
                <Checkbox key={c._id} onChange={(e)=>handleFilter(e.target.checked,c._id)} >
                  {c.name}
                </Checkbox>
              ))}
            </div>
            {/* Price Filter */}
            <h4 className='text-center mt-4'>Filter By Price</h4>
            <div className='d-flex flex-column ms-2'>
              <Radio.Group onChange={e => setRadio(e.target.value)}>
                {prices.map((p)=>(
                  <div key={p._id}> 
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className='d-flex flex-column ms-2 mt-3'>
              <button className='btn btn-outline-secondary' onClick={()=>window.location.reload()}>Reset Filters</button>
            </div>
          </div>
          <div className='col-md-9'>
            <h1 className='text-center'>All Products</h1>
            <div className='d-flex flex-wrap'>
              {products.map(product=>(
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
            <div className='m-3 p-3'>
              {
                products && products.length < total && (
                  <button className='btn btn-info' onClick={(e)=>{
                    e.preventDefault();
                    setPage(page + 1);
                  }}>
                    {loading ? "Loading..." : "Load More"}
                  </button>
                )
              }
            </div>
          </div>
        </div>
        <hr/>
    </Layout>
  )
}

export default HomePage