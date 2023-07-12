import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout'
import useCategory from '../hooks/useCategory'

const Categories = () => {
  
  const categories = useCategory();
  

  return (
    <Layout title={"Product - Categories"}>
        <div className='container' style={{ marginTop: "100px" }}>
            <div className='row container'>
                {categories.map(c=>(
                    <div className='col-md-6 mt-5 mb-3 gx-3 gy-3' key={c._id}>
                        <div className="card">
                            <Link to={`/category/${c.slug}`} className="btn cat-btn">
                                {c.name}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </Layout>
  )
}

export default Categories