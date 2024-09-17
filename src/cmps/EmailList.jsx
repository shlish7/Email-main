import React from 'react'
import EmailPreview from './EmailPreview'

function EmailList({emails, onRemove, onUpdateEmail, filterBy}) {
    console.log('list ', filterBy);

    return (
        <section className="email-list-section">
            <ul className="email-list-ul">
            {emails.map(email => (
                <div key={email.id} className='email-item'>
                     <EmailPreview email={email}  key={email.id} onUpdateEmail={onUpdateEmail} />
                     { filterBy.toLowerCase()=== 'trash' &&<button onClick={() => onRemove(email.id)}>Remove</button>}


                </div>
                            

            ))}

            </ul>
            </section>
    )
}

export default EmailList