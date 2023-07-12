import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout'

const CategoryProduct = () => {

  const [products,setProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(()=>{
    if(params?.slug) getProductByCategory();
  },[params?.slug]);

  const getProductByCategory = async () => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/products/product-category/${params.slug}`);
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout title={"Category - Products"}>
      <div className='container mt-3'>
        <h4 className='text-center text-uppercase'>Category - {category?.name}</h4>
        <h5 className='text-center'>{products?.length} results found</h5>
        <div className='row'>
          <div className='col-md-9 offset-1'>
            <div className='d-flex flex-wrap'>
                {products.map(product=>(
                    <div key={product._id} className="card m-2" style={{width: '18rem'}} >
                        <img src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`} className="card-img-top" alt={product.name} />
                        <div className="card-body">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="card-text">{product.description.substring(0.30)}</p>
                            <p className="card-text">₹ {product.price}</p>
                            <button className="btn btn-outline-primary" onClick={()=>navigate(`/product/${product.slug}`)}>Details</button>
                            <button className="btn btn-outline-success ms-4">Add To Cart</button>
                        </div>
                    </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </Layout>
  )
}

export default CategoryProduct