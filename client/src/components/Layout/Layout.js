import React from 'react'
import Footer from './Footer'
import Header from './Header'
import {Helmet} from "react-helmet"
import {Toaster} from "react-hot-toast"

const Layout = ({children,description,title,keywords,author}) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description}/>
        <meta name="keywords" content={keywords}/>
        <meta name="author" content={author}/>
        <title>{title}</title>
      </Helmet>
    <Header/>
        <main style={{minHeight:"75vh"}}>
          <Toaster/>
            {children}
        </main>
    <Footer/>
    </div>
  )
}

Layout.defaultProps = {
  title : "Ecommerce Website - Shop Now",
  author : "Nimish Dureja",
  description : "Mern Stack Project",
  keywords: "TechStack - MongoDB,Express,React and NodeJs"
}

export default Layout