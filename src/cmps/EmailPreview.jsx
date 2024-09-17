import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import EmailDetails from './EmailDetails';
import whiteStar from '../assets/imgs/whiteStar.png'
import yellowStar from '../assets/imgs/yellowStar.png'
import { emailService } from '../services/email.service'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEnvelope, faEnvelopeOpen, faTrashCan,faStar } from '@fortawesome/free-regular-svg-icons'
import { utilService } from '../services/util.service';

function EmailPreview({ email, onUpdateEmail }) {

    const [openDetails, setOpenDetails] = useState(false)
    const [isRead, setIsRead] = useState(email.isRead || false)
    const [showIcons, setShowIcons] = useState(false)

    useEffect(() => {

    }, [isRead, showIcons])

    const currentDate = utilService.currentDateTime()

    function onOpenEmail() {
        setOpenDetails(prev => !prev)
        setIsRead(true)
        const update = { ...email, isRead: true }
        emailService.save(update)


    }
    function changeStar(e) {
        e.stopPropagation()
        e.preventDefault()
        const emailToUpdate = { ...email, isStarred: !email.isStarred }
        onUpdateEmail(emailToUpdate)


    }

    function showEmailIcons() {
        setShowIcons(prev => !prev)
    }

    function chagneToUnread(e) {
        e.stopPropagation()
        e.preventDefault()
        setIsRead(prev => !prev)
        const update = { ...email, isRead: false }
        // emailService.save(update)
        onUpdateEmail(update)
    }



    function onMoveToTrash(e) {
        e.stopPropagation()
        e.preventDefault()
        const emailToUpdate = { ...email, removedAt: currentDate }
        onUpdateEmail(emailToUpdate)
    }


    return (
        // className="email-preview-li"
        <li onClick={onOpenEmail} onMouseEnter={showEmailIcons} onMouseLeave={showEmailIcons} className={isRead ? 'email-clicked' : 'email-preview-li'}>
            <section className='radio-and-star'>
            <input type="checkbox" className='checkbox-btn'/>
            {/* <FontAwesomeIcon icon={faStar} className="star-icon" /> */}
            
            <img onClick={changeStar} src={email.isStarred ? yellowStar : whiteStar} alt="" className='star-image'/>
            </section>
            {/* <Link className='link-to-details' to={`/emailDetails/${email.id}`}> */}
            <Link className={isRead ? 'link-to-details-read' : 'link-to-details-unread'} to={`/emailDetails/${email.id}`}>

                <span className='email-from'>{email.from}</span>
                <span className='email-subject'>{email.subject}</span>
                {showIcons && <>
              
                    <section className="email-preview-icons">
                    {!isRead ? < FontAwesomeIcon icon={faEnvelope} className='envelope-icon' onClick={chagneToUnread}/> :
                    <FontAwesomeIcon icon={faEnvelopeOpen} className='envelope-icon' onClick={chagneToUnread} />
                    }
                    <FontAwesomeIcon icon={faTrashCan} className='trash-icon' onClick={onMoveToTrash} />
                    </section>
                </>

                }
                {!showIcons && <span className='email-date'>{email.sentAt}</span>}
            </Link>
        </li>

    )
}

export default EmailPreview



