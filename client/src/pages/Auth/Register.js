import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from "react-hot-toast"
import axios from "axios";
import {useNavigate} from "react-router-dom"
import "../../styles/AuthStyles.css"

const Register = () => {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [phone,setPhone] = useState("");
    const [address,setAddress] = useState("");
    const [answer,setAnswer] = useState("");

    const navigate = useNavigate();

    //form function
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`,{
                name,email,password,phone,address,answer
            });
            if(res && res.data.success){
                toast.success(res.data.message);
                navigate('/login');
            }else{
                toast.error(res.data.messgae);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        }
    }

  return (
    <Layout title={"Register Here"}>
        <div className="register">
            <h1 className='Page-Heading'>Register Here</h1>
            <form onSubmit={handleSubmit}>
                <div className='Input-Div'>
                <div className="mb-3">
                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="form-control" required placeholder='Enter Your Name' />
                </div>
                <div className="mb-3">
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" required placeholder='Email Address' />
                </div>
                <div className="mb-3">
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" required placeholder='Password' />
                </div>
                <div className="mb-3">
                    <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} className="form-control" required id="exampleInputPhone" placeholder='Enter Your Phone No.' />
                </div>
                <div className="mb-3">
                    <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} className="form-control" required placeholder='Enter Your Address' />
                </div>
                <div className="mb-3">
                    <input type="text" value={answer} onChange={(e)=>setAnswer(e.target.value)} className="form-control" required placeholder='What is your favourite sports?' />
                </div>
                <button type="submit" className="btn btn-primary form-btn">Sign Up</button>
                </div>
            </form>
        </div>
    </Layout>
  )
}

export default Register