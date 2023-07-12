import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import AdminMenu from '../../components/Layout/AdminMenu.js'
import Layout from "../../components/Layout/Layout.js"


const Products = () => {
    
    const [products,setProducts] = useState([]);

    //get all products
    const getAllProducts = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/products/get-product`);
            if(data?.success){
                toast.success("All Products List");
                setProducts(data.products);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    //lifecycle method 
    useEffect(()=>{
        getAllProducts();
    },[])

    return (
    <Layout>
        <div className='container-fluid m-3 w-75 p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>Product List</h1>
                    <div className='d-flex'>
                        {products.map(product=>(
                            <Link to={`/dashboard/admin/product/${product.slug}`} key={product._id} className="product-link">
                                <div className="card m-2" style={{width: '18rem'}} >
                                    <img src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`} className="card-img-top" alt={product.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Products