import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth';

const Users = () => {

    const [users,setUsers] = useState([]);
    const [auth] = useAuth();

    //fetch all user function
    const getAllUsers = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`)
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
       if(auth?.token) getAllUsers();   
    },[auth?.token]);

  return (
    <Layout title={"Dashboard - All Users"}>
        <div className='container-fluid m-3 p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu/>
                </div>
                <div className='col-md-9'>
                    <h1>All Users</h1>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Address</th>
                            </tr>
                        </thead>
                        <tbody>
                        {users.map((user,i)=>(
                            <tr key={user._id}>
                            <td>{i+1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.address}</td>
                        </tr>
                        ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Users