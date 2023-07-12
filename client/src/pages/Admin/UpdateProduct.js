import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import { useNavigate,useParams } from 'react-router-dom';
import {Select} from 'antd';
const {Option} = Select;

const UpdateProduct = () => {

    const navigate = useNavigate();
    const params = useParams();
    const [categories,setCategories] = useState([]);
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [price,setPrice] = useState("");
    const [category,setCategory] = useState("");
    const [quantity,setQuantity] = useState("");
    const [shipping,setShipping] = useState("");
    const [photo,setPhoto] = useState("");
    const [id,setId] = useState("");

    //get single product
    const getSingleProduct = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/products/get-product/${params.slug}`);
            setName(data.product.name);
            setId(data.product._id);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setPhoto(data.product.photo);
            setShipping(data.product.shipping);
            setCategory(data.product.category._id);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getSingleProduct();
    },[])

    //get all categories
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
    },[])

    //update product function
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name",name);
            productData.append("description",description);
            productData.append("price",price);
            productData.append("quantity",quantity);
            productData.append("category",category);
            photo && productData.append("photo",photo);

            
            const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/products/update-product/${id}`,productData);
            if(data?.success){
                toast.success("Product Updated Successfully");
                navigate("/dashboard/admin/products");
            }else{
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        }
    }

    //delete product
    const handleDelete = async () => {
        try {
            let answer = window.prompt("Are Your Sure You Want To Delete This Product");
            if(!answer) return;
            const {data} = await axios.delete(`${process.env.REACT_APP_API}/api/v1/products/delete-product/${id}`);
            toast.success("Product Delete Successfully");
            navigate("/dashboard/admin/products");
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        }
    }

  return (
    <Layout title={"Dashboard - Create Product"}>
        <div className='container-fluid m-3 p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu/>
                </div>
                <div className='col-md-9'>
                    <h1>Update Product</h1>
                    <div className='m-1 w-75'>
                        <Select bordered={false} placeholder="Select a category" 
                          showSearch size='large' className='mb-3 form-select'
                          onChange={(value)=>{setCategory(value)}}
                          value={category}
                           >
                            {categories.map(c=>(
                                <Option key={c._id} value={c._id} >{c.name}</Option>
                            ))}
                        </Select>
                        <div className='mb-3'>
                            <label className='btn btn-outline-secondary col-md-12'>
                                {photo ? photo.name : "Upload Image"}
                                <input type={"file"} name="photo" accept="image/*" onChange={(e)=>setPhoto(e.target.files[0])} hidden />
                            </label>
                        </div>
                        <div className='mb-3'>
                            {photo ? (
                                <div className='text-center'>
                                    <img src={URL.createObjectURL(photo)} alt="product-image" height={"200px"} className='img img-responsive' />
                                </div>
                            ):(
                                <div className='text-center'>
                                    <img src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${id}`} height={"200px"} className="img img-responsive" alt={name}  />
                                </div> 
                            )}
                        </div>
                        <div className='mb-3'>
                            <input type={'text'} value={name} placeholder="Product Name" className='form-control' onChange={(e)=>setName(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <textarea type={'text-area'} value={description} placeholder="Product Description" className='form-control' onChange={(e)=>setDescription(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <input type={'text'} value={price} placeholder="Product Price" className='form-control' onChange={(e)=>setPrice(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <input type={'number'} value={quantity} placeholder="Quantity" className='form-control' onChange={(e)=>setQuantity(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                        <Select bordered={false} placeholder="Select Shipping" 
                          showSearch size='large' className='mb-3 form-select'
                          onChange={(value)=>{setShipping(value)}}
                          value={shipping ? "Yes" : "No"}
                           >
                               <Option value="0" >No</Option>
                               <Option value="1" >Yes</Option>
                           </Select>
                        </div>
                        <div className='mb-3'>
                            <button className='btn btn-outline-primary w-100' onClick={handleUpdate} >UPDATE PRODUCT</button>
                        </div>
                        <div className='mb-3'>
                            <button className='btn btn-outline-danger w-100' onClick={handleDelete} >DELETE PRODUCT</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</Layout>
  )
}

export default UpdateProduct