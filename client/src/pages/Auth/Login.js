import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from "react-hot-toast"
import axios from "axios";
import {useNavigate,useLocation} from "react-router-dom"
import "../../styles/AuthStyles.css"
import { useAuth } from '../../context/auth';

const Login = () => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [auth,setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    //form function
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`,{
               email,password
            });
            if(res && res.data.success){
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user:res.data.user,
                    token:res.data.token
                })
                localStorage.setItem('auth',JSON.stringify(res.data));
                navigate(location.state || '/');
            }else{
                toast.error(res.data.messgae);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        }
    }

  return (
    <Layout title={"Login Here"}>
        <div className="register">
            <h1 className='Page-Heading'>Login To Your Account !!</h1>
            <form onSubmit={handleSubmit}>
                <div className='Input-Div'>
                <div className="mb-3">
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" required placeholder='Email Address' />
                </div>
                <div className="mb-3">
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" required placeholder='Password' />
                </div>
                <button type="submit" className="btn btn-primary form-btn">Login</button>
                <button type="button" className="btn btn-primary form-btn" onClick={()=>navigate("/forgotpassword")}>Forgot Password</button>
                </div>
            </form>
        </div>
    </Layout>
  )
}

export default Login