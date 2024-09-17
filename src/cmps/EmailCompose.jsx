import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams ,useNavigate, useOutletContext } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faMinus, faArrowsUpDown, faX } from '@fortawesome/free-solid-svg-icons'
import { emailService } from '../services/email.service';
import { utilService } from '../services/util.service';


export function EmailCompose() {
  const navigate = useNavigate();
  const [emailToEdit, setEmailToEdit] = useState(emailService.createEmail())

  const [searchParam, setSearchParam] = useSearchParams()
  const { onSaveEmail } = useOutletContext()
  const timeoutIdRef = useRef()

  useEffect(() => {
    const status = searchParam.get('status')
    const sendTo = searchParam.get('to')
    const subject = searchParam.get('subject')   
    
    if (sendTo || subject) {
      setEmailToEdit((prevEmail) => ({
        ...prevEmail,
        to: sendTo || prevEmail.to,
        subject: subject || prevEmail.subject,
      }))
    }

    // console.log('status: ',status)
    // console.log('sendTo: ',sendTo)
    // console.log('subject: ',subject)
}, [searchParam])

  useEffect(()=>{
    clearTimeout(timeoutIdRef.current)
    timeoutIdRef.current = setTimeout(()=>onSaveEmailDraft(emailToEdit), 2000)

    return () => clearTimeout(timeoutIdRef.current);

  },[emailToEdit])

  const currentDate = utilService.currentDateTime()

  const { id, subject, body, isRead, isStarred, sentAt, removedAt, from, to, isDraft } = emailToEdit


  function handleChange({ target }) {
    let { name: field, value, type } = target
    switch (type) {
      case 'number':
      case 'range':
        value = +value
        break;
      case 'checkbox':
        value = target.checked
        break
      default:
        break;
    }
    setEmailToEdit((prevEmail) => ({ 
      ...prevEmail, 
      [field]: value, 
      // sentAt: currentDate, 
      sentAt: utilService.currentDateTime(), 
      from: 'sharon@gmail.com',
      isDraft: true }))
      
  }

  function onSubmitEmail(ev) {
    ev.preventDefault()
    console.log('email: ', emailToEdit)
    setEmailToEdit((prevEmail) => ({...prevEmail, ['isDreaft']:false }))
    onSaveEmailDraft(emailToEdit)
    onCloseModal()
  }

  function onCloseModal() {
    navigate("/")
  }

  async function onSaveEmailDraft(email) {
    try {
      console.log('email: form onsave draft', email);
     // if(!email.id) {

        const savedEmail = await onSaveEmail(email)
        setEmailToEdit(savedEmail)
    //  }
        // setEmailToEdit(updatedEmail)

    }
    catch (err) {
        console.log(err)
        showErrorMsg('Couldnt save email')

    }

}


console.log(emailToEdit);
  return (
    <section className='compose-modal-container'>
      <form className="compose-form" onSubmit={onSubmitEmail}>
        <section className='compose-box-title'>
          <span className='compose-span-title'>New Message</span>
          <section className="modal-icons">
            <FontAwesomeIcon icon={faMinus} />
            <FontAwesomeIcon className="arrow-icon" icon={faArrowsUpDown} />
            <FontAwesomeIcon className="close-modal-icon" icon={faX} onClick={onCloseModal} />
          </section>
        </section>
        <section className='send-to-section'>
          <span className='send-to-span'>To</span>
          <input onChange={handleChange} className='send-to-input' type="email" value={to} id="sendTo" name="to" />
        </section>
        <section className='send-to-section'>
          <span className='subject-span'>Subject</span>
          <input onChange={handleChange} className='subject-input' type="text" value={subject} id="subject" name="subject" />
        </section>
        <textarea onChange={handleChange} className='body-input' value={body} id="mailBody" name="body" rows="4" cols="50" />
        <button className='send-btn'>Send</button>
      </form>
    </section>


  )
}

