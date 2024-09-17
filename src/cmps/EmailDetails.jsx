import React, { useState, useEffect } from 'react'
import { emailService } from '../services/email.service'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'


function EmailDetails() {

  const [email, setEmail] = useState()
  const {id} =useParams()

  useEffect(() => {
    loadEmails()
  }, [id])

  async function loadEmails() {
    try {
      const email = await emailService.getById(id)
      setEmail(email)

    } catch (err) {
      console.log(err)
      showErrorMsg('Couldnt load the email')
    }
  }

  if (!email) {
    return <div>No email data available</div>;
  }

  return (
    <>
      <div className='email-details-container'>
        <h1 className='email-subject'>{email.subject}</h1>
        <p className='email-body'>{email.body}</p>
        <Link to="/">Back</Link>
      </div>     
    </>
  )
}

export default EmailDetails
