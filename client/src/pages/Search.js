import React from 'react'
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/search'

const Search = () => {
    const [values,setValues] = useSearch();
    const navigate = useNavigate();
  return (
    <Layout title={"Search Results"}>
        <div className='container'>
            <div className='text-center'>
                <h1>Search Results</h1>
                <h6>
                    {values?.result.length < 1 ? "No Results Found" : `Found ${values?.result.length}` }
                </h6>
                <div className='d-flex flex-wrap mt-4'>
                {values.result.map(product=>(
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
    </Layout>
  )
}

export default Search