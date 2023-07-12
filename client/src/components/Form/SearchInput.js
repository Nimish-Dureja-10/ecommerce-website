import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/search'

const SearchInput = () => {
  
  const [values,setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/products/search/${values.keyword}`);
        setValues({...values,result:data});
        navigate("/search");
      } catch (error) {
          console.log(error)
      }
  }

  return (
    <div className=''>
        <form className="d-flex" role="search" onSubmit={handleSubmit}>
            <input className="form-control me-2" type="search" placeholder="Search Product" aria-label="Search" value={values.keyword} onChange={(e)=>setValues({...values,keyword:e.target.value})} />
            <button className="btn btn-outline-secondary" type="submit">Search</button>
        </form>
    </div>
  )
}

export default SearchInput