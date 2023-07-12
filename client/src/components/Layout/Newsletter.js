import React from 'react'
import "../../styles/Newsletter.css";

const Newsletter = () => {
  return (
    <>
       <div>
  <div id="newsletter">
    <form action>
      <div className="seal">
        <i className="fa fa-envelope-o" />
      </div>
      <div className="title">
        Newsletter
      </div>
      <label htmlFor="email">
        Send us your email, we'll make sure you never miss a thing!
      </label>
      <input type="text" placeholder="enter your email here" />
      <input type="submit" defaultValue="subscribe now" />
    </form>
  </div>
  <div className="shadow" />
</div>

    </>
  )
}

export default Newsletter