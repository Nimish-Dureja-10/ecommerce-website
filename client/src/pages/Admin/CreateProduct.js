import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import { useNavigate } from 'react-router-dom';
import {Select} from 'antd';
const {Option} = Select;


const CreateProduct = () => {
    const navigate = useNavigate();
    const [categories,setCategories] = useState([]);
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [price,setPrice] = useState("");
    const [category,setCategory] = useState("");
    const [quantity,setQuantity] = useState("");
    const [shipping,setShipping] = useState("");
    const [photo,setPhoto] = useState("");

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

    //create product function
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name",name);
            productData.append("description",description);
            productData.append("price",price);
            productData.append("quantity",quantity);
            productData.append("category",category);
            // productData.append("shipping",shipping);
            productData.append("photo",photo);

            const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/products/create-product`,productData);
            if(data?.success){
                toast.success("Product Created Successfully");
                navigate("/dashboard/admin/products");
            }else{
                toast.error(data?.message);
            }
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
                    <h1>Create Product</h1>
                    <div className='m-1 w-75'>
                        <Select bordered={false} placeholder="Select a category" 
                          showSearch size='large' className='mb-3 form-select'
                          onChange={(value)=>{setCategory(value)}}
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
                            {photo && (
                                <div className='text-center'>
                                    <img src={URL.createObjectURL(photo)} alt="product-image" height={"200px"} className='img img-responsive' />
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
                           >
                               <Option value="0" >No</Option>
                               <Option value="1" >Yes</Option>
                           </Select>
                        </div>
                        <div className='mb-3'>
                            <button className='btn btn-outline-primary w-100' onClick={handleCreate} >CREATE PRODUCT</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default CreateProduct