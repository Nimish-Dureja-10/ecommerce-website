import React from 'react'
import {Link, NavLink} from "react-router-dom";
import {GiShop} from "react-icons/gi"
import { useAuth } from '../../context/auth';
import { toast } from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import {Badge} from "antd";

const Header = () => {

  const [auth,setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const handleLogout = () => {
    setAuth({
      ...auth,user:null,token:""
    })
    localStorage.removeItem('auth')
    toast.success("Logout Successfully")
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
      <Link to="/" className="navbar-brand"><GiShop /> Ecommerce App</Link>
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      <SearchInput/>
        <li className="nav-item">
          <NavLink to="/" className="nav-link">Home</NavLink>
        </li>
        <li className="nav-item dropdown">
          <Link to={"/categories"} className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
          Categories
          </Link>
          <ul className="dropdown-menu">
            <li>
              <Link to={`/categories`} className="dropdown-item">All Categories</Link>
            </li>
            {categories?.map(c=>(
              <li><Link to={`/category/${c.slug}`} className="dropdown-item" href="#">{c.name}</Link></li>
            ))}
          </ul>
        </li>
        {
          !auth.user ? (<>
            <li className="nav-item">
          <NavLink to="/register" className="nav-link">Register</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/login" className="nav-link">Login</NavLink>
        </li>
          </>) : (<>
           <li className="nav-item dropdown">
           <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
           {auth?.user.name}
           </Link>
            <ul className="dropdown-menu">
              <li><NavLink to={`/dashboard/${auth?.user.role === 1 ? 'admin':'user'}`} className="dropdown-item">Dashboard</NavLink></li>
              <li className="nav-item"><NavLink to="/login" onClick={handleLogout} className="dropdown-item">Logout</NavLink></li>
            </ul>
        </li>
          {/* Logout Button  */}
          </>)
        }
        <li className="nav-item mt-2">
          <Badge count={cart?.length} showZero>
          <NavLink to="/cart" className="nav-link">Cart</NavLink>
          </Badge>
          
        </li>
      </ul>
    </div>
  </div>
</nav>
    </>
  )
}

export default Header