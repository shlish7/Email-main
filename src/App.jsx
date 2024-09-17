
import { HashRouter as Router, Route, Routes } from "react-router-dom"

import { AboutUs } from './pages/AboutUs'
import { EmailIndex } from './pages/EmailIndex'
import { Home } from './pages/Home'
import { AppHeader } from "./cmps/AppHeader"
import { AppFooter } from "./cmps/AppFooter"
import EmailDetails from "./cmps/EmailDetails"
import EmailPreview from "./cmps/EmailPreview"
import { EmailCompose } from "./cmps/EmailCompose"
import { UserMessage } from "./cmps/UserMessage"


export function App() {

    return (
        <>
        <Router>
            <Routes>
            <Route path='/Home' element={<Home/>} />

                <Route path="/" element={<EmailIndex />} >
                    <Route path='/Compose/:emailId?' element={<EmailCompose />} />
                </Route>
                <Route path="/emailDetails/:id" element={<EmailDetails />} />


            </Routes>

        </Router >

        <UserMessage/>
        </>

    )
}

