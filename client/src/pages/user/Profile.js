import axios from 'axios'
import React,{useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'

const Profile = () => {

  const [auth,setAuth] = useAuth();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");

  //get previous user data
  useEffect(()=>{
    const {email,name,phone,address} = auth?.user;
    setName(name);
    setEmail(email);
    setPhone(phone);
    setAddress(address);
  },[auth?.user]);

  //form function
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
        const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/profile`,{
            name,email,password,phone,address
        });
        if(data?.error){
            toast.error(data?.error);
        }else{
            setAuth({...auth,user:data.updatedUser});
            let ls = localStorage.getItem("auth");
            ls = JSON.parse(ls);
            ls.user = data.updatedUser;
            localStorage.setItem("auth",JSON.stringify(ls));
            toast.success("User Profile Updated Successfully")
        }
    } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong");
    }
}

  return (
    <Layout title={"Your Profile"}>
        <div className='container-fluid m-3 p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <UserMenu/>
                </div>
                <div className='col-md-9'>
                    <div className="register">
                        <h1 className='Page-Heading'>USER PROFILE</h1>
                        <form onSubmit={handleSubmit}>
                            <div className='Input-Div'>
                            <div className="mb-3">
                                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="form-control" placeholder='Enter Your Name' />
                            </div>
                            <div className="mb-3">
                                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" placeholder='Email Address' disabled />
                            </div>
                            <div className="mb-3">
                                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" placeholder='Password' />
                            </div>
                            <div className="mb-3">
                                <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} className="form-control" id="exampleInputPhone" placeholder='Enter Your Phone No.' />
                            </div>
                            <div className="mb-3">
                                <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} className="form-control" placeholder='Enter Your Address' />
                            </div>
                            <button type="submit" className="btn btn-primary form-btn">Update User</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Profile