import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from "react-hot-toast"
import axios from "axios";
import {useNavigate} from "react-router-dom"
import "../../styles/AuthStyles.css"

const ForgotPassword = () => {

    const [email,setEmail] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [answer,setAnswer] = useState("");

    const navigate = useNavigate();

    //form function
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgotpassword`,{
               email,newPassword,answer
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
    <Layout title={"Forgot Password"}>
        <div className="register">
            <h1 className='Page-Heading'>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div className='Input-Div'>
                <div className="mb-3">
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" required placeholder='Email Address' />
                </div>
                <div className="mb-3">
                    <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="form-control" required placeholder='New Password' />
                </div>
                <div className="mb-3">
                    <input type="text" value={answer} onChange={(e)=>setAnswer(e.target.value)} className="form-control" required placeholder='Your Answer' />
                </div>
                <button type="submit" className="btn btn-primary form-btn">Change Password</button>
                </div>
            </form>
        </div>
    </Layout>
  )
}

export default ForgotPassword