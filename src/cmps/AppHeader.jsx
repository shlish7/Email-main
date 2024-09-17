import { NavLink } from "react-router-dom"
import React, { useState, useEffect } from 'react'

import gmailLogo from '../assets/imgs/gmailLogo.png'

export function AppHeader() {
    return <header className="app-header">
        {/* <h1>Emails</h1> */}
        <img src={gmailLogo} alt="" className="gmail-logo"/>
        <nav>
            <NavLink to="/" >Home</NavLink>
            <NavLink to="/aboutUs" >About Us</NavLink>
            <NavLink to="/emailIndex" >Email</NavLink>
        </nav>
    </header>
}
