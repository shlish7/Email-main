import { useState, useEffect } from "react"
import { useSearchParams, Link, Outlet, useNavigate, useOutletContext } from 'react-router-dom'


import EmailList from "../cmps/EmailList"
import EmailFilter from "../cmps/EmailFilter"
import { EmailSort } from "../cmps/EmailSort"
import { emailService } from "../services/email.service"
import { utilService } from "../services/util.service"
import EmailFolderList from "../cmps/EmailFolderList"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faTrashCan, faPaperPlane, faFile } from '@fortawesome/free-regular-svg-icons'
import { faInbox, faPen, faBars } from '@fortawesome/free-solid-svg-icons'
import gmailLogo from '../assets/imgs/gmailLogo.png'
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"




export function EmailIndex() {
    const navigate = useNavigate()

    const defaultFilter = emailService.getDefaultFilter()
    const [menuBar, setMenuBar] = useState('open')
    const [emails, setEmails] = useState([])
    const [unreadCount, setUnreadCount] = useState()
    const [activeFolder,setActiveFolder] = useState()
    const [searchParam, setSearchParam] = useSearchParams()
    const [filterBy, setFilterBy] = useState(emailService.getFilterFromSearchParams(searchParam))
    const [sortBy, setSortBy] = useState({ key: 'date', direction: 'desc' })

    const { status, txt, isRead, sortField, sortOrderDate, sortOrderSubject } = filterBy


    useEffect(() => {
        const status = searchParam.get('status') || 'inbox'
        if (searchParam) setFilterBy(prev => ({ ...prev, status: status }))
            console.log('filterBy',filterBy);
        

    }, [])

    useEffect(() => {
     
        unreadCountEmails()
    },[emails])

    useEffect(() => {

        new URLSearchParams()
        loadEmails()
        setSearchParam(utilService.getExistingProperties(filterBy))

    }, [filterBy])

    async function loadEmails() {
        try {
            const emails = await emailService.query(filterBy)
            setEmails(emails)
        } catch (err) {
            console.log(err)
            showErrorMsg('Couldnt load emails')
        }
    }

    async function removeEmail(emailId) {
        try {
            await emailService.remove(emailId)
            setEmails(email => emails.filter(email => email.id !== emailId))
            showSuccessMsg('Email removed successfully')

        } catch (err) {
            console.log(err)
            showErrorMsg('Couldnt remove email')
        }
    }

    async function onUpdateEmail(email) {
        try {
            const updatedEmail = await emailService.save(email)
            
            setEmails(prevEmails =>prevEmails.map(email => {
                if (email.id === updatedEmail.id) {
                    return updatedEmail
                } 
                else { return email }
            }))
        //    unreadCountEmails(emails)

        }
        catch (err) {
            console.log(err)
            showErrorMsg('Couldnt move email to trash')

        }

    }

    async function onSaveEmail(email) {
        //console.log('index:', email);
        try {
            //console.log('onSaveEmail Index', email);
            //console.log('email id Index', email.id);
            const emailToSave = await emailService.save(email)
            //console.log('emailToSave:', emailToSave);

            if (!email.id) {
                console.log('first time => if');
                setEmails(emails => [...emails, emailToSave])
            }
            else {
                console.log('all the time => else');
                setEmails(emails => emails.map(_email => {
                    return _email.id === emailToSave.id ? emailToSave : _email
                }

                ))
            }
            console.log('index: ', emailToSave);
            return emailToSave

            // navigate('/Compose?status=draft')
        } catch (err) {
            console.log(err)
            showErrorMsg('Couldnt sent email')

        }
    }

   async function unreadCountEmails(){
        try {
             const  unreadEmails = await emailService.getUnreadCountEmails()

            setUnreadCount(unreadEmails)

        } catch (error) {
            showErrorMsg('couldnt fetch unread emails')
        }
    }

    function handleFolderChange(folderName){
        setFilterBy(prev => ({ ...prev, status: folderName }))
        setActiveFolder(folderName)

    }

    const emailFolders = [
        { name: 'Inbox', icon: faInbox },
        { name: 'Sent', icon: faPaperPlane },
        { name: 'Star', icon: faStar },
        { name: 'Trash', icon: faTrashCan },
        { name: 'Draft', icon: faFile }

    ];

    function onFilterBy(filterBy) {
        // console.log('onFilterBy', filterBy);
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))

    }

    function onChangeMenuBar(ev){
        ev.stopPropagation()
        ev.preventDefault()
        menuBar === 'open' ? setMenuBar('close') : setMenuBar('open')
    }

    function onNavigateToCompose(ev){
        ev.stopPropagation()
        ev.preventDefault()
        console.log('compose');
        navigate("/Compose")

    }
    

    if (!emails) return <div>Loading...</div>
    return <section className="email-index-section">
        <header className="email-index-header">

            <EmailFilter filterBy={{txt, isRead}} onFilterBy={onFilterBy} />

        </header>
        <aside className={menuBar ==='open' ? "email-index-left-aside": "email-index-left-aside-closed"}>
            <div className="logo-section">
            <FontAwesomeIcon icon={faBars} className = 'menu-bar-icon' onClick={onChangeMenuBar}/>
            <img src={gmailLogo} alt="" className="gmail-logo" />
            </div>
      
            {
               menuBar==='open' ? <Link className='link-to-compose' to="/Compose">
                Compose
                <FontAwesomeIcon className="pen-icon" icon={faPen}  />
            </Link> 
            :
            <FontAwesomeIcon className="pen-icon" icon={faPen} onClick={onNavigateToCompose} />

            }
            {/* <Link className='link-to-compose' to="/Compose">
                Compose
                <FontAwesomeIcon className="pen-icon" icon={faPen} />
            </Link> */}


            <EmailFolderList 
                filterBy={filterBy.status}
                onFilterBy={onFilterBy} 
                emailFolders={emailFolders} 
                unreadCount={unreadCount} 
                onFolderChange={handleFolderChange}
                menuBar={menuBar} />

        </aside>
        <main className="emails-list">
            <EmailSort filterBy={{sortField, sortOrderDate, sortOrderSubject}}  onFilterBy={onFilterBy} />
            <EmailList emails={emails} 
            onRemove={removeEmail} 
            onUpdateEmail={onUpdateEmail} 
            filterBy={filterBy.status}  />

        </main>
        <aside className="email-index-right-aside">

        </aside>
        <Outlet context={{ onSaveEmail }} />

    </section>


}