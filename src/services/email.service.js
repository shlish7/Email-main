import { storageService } from "./async-storage.service";
import { utilService } from './util.service.js'

export const emailService = {
    query,
    getById,
    remove,
    save,
    createEmail,
    getDefaultFilter,
    getFilterFromSearchParams,
    getUnreadCountEmails

}

const STORAGE_KEY = 'emails'
const loginUser = 'sharon@gmail.com'
const loginUser2 = 'user@appsus.com'
const helpMail = 'help@gmail.com'


_createEmails()
_createUsers()

// async function query(filterBy) {
//     try {
//         let emails = await storageService.query(STORAGE_KEY)
//         // console.log('emails',emails);
//         if (filterBy) {
//             let { status = '', txt = '', isRead = null } = filterBy
//             // console.log(filterBy)
//             emails = emails.filter(email => {
//                 return (isRead === null || isRead ==='' || email.isRead === isRead) &&
//                     (          

//                         email.subject?.toLowerCase().includes(txt?.toLowerCase()) ||
//                         email.body?.toLowerCase().includes(txt?.toLowerCase()
//                         )
//                     )
//             })

//             // console.log('emails',emails);

//             const filters = {
//                 inbox: email => (email.to === 'user@appsus.com' || email.to === 'sharon@gmail.com') && email.removedAt === null,
//                 sent: email =>  !email.removedAt && email.sentAt,
//                 // sent: email => email.to === 'sharon@gmail.com' && email.removedAt === null,
//                 star: email => email.isStarred === true && email.removedAt === null,
//                 trash: email => !!email.removedAt
//             };

//             return status ? emails.filter(filters[status]) : emails;
//         }
//         // console.log('emails servie',emails);

//         return emails
//     } catch (err) {
//         console.error('Failed to fetch emails:', err);

//     }


// }


async function query(filterBy) {
    try {
        let emails = await storageService.query(STORAGE_KEY)
        // console.log('emails',emails);
        if (filterBy) {
            let { status = '', txt = '', isRead = null, sortField, sortOrderDate, sortOrderSubject } = filterBy
            // console.log(filterBy)
            emails = emails.filter(email => {
                return (isRead === null || isRead === '' || email.isRead === isRead) &&
                    (

                        email.subject?.toLowerCase().includes(txt?.toLowerCase()) ||
                        email.body?.toLowerCase().includes(txt?.toLowerCase()
                        )
                    )
            })
            const filters = {
                inbox: email => (email.to === 'user@appsus.com' || email.to === 'sharon@gmail.com') && !email.removedAt,
                sent: email => !email.removedAt && email.sentAt,
                star: email => email.isStarred === true && email.removedAt === null,
                trash: email => !!email.removedAt,
                draft: email => email.isDraft
            };

            emails = status ? emails.filter(filters[status]) : emails;
            // console.log('sortField ', sortField);

            // if (sortField==='date'){
            //     let sortOrder = sortOrderDate==='desc' ? -1 : 1
            //         console.log('Before sortOrderDate',sortOrderDate);
            //         console.log('After sortOrderDate',sortOrder);

            //         emails.sort((mail1, mail2) => {
            //             return (Date.now(mail1.sentAt) > Date.now(mail2.sentAt)? 1 : -1)*sortOrder
            //         }) 

            //     } else if( sortField=== 'subject') {
            //         let sortOrder = sortOrderSubject==='desc' ? -1 : 1

            //         console.log('sortOrder: ',sortOrder);
            //         emails.sort((mail1, mail2) => {
            //             console.log('mail1.subject.localeCompare(mail2.subject): ',mail1.subject.localeCompare(mail2.subject));
            //             return mail1.subject.localeCompare(mail2.subject)*sortOrder
            //         })
            //    }

            emails.sort((mail1, mail2) => {
                // let comparison = 0
                // let sortOrder = 'desc'
                let sortOrder 

                // console.log('sortField: ',sortField);

                switch (sortField) {
                    case 'date':
                         sortOrder = sortOrderDate === 'desc' ? -1 : 1

                        // comparison = new Date(a.sentAt) - new Date(b.sentAt)
                        return (Date.now(mail1.sentAt) > Date.now(mail2.sentAt) ? 1 : -1) * sortOrder
                        console.log('sortOrder switch: ', sortOrder);
                        // sortOrder = sortOrderDate ==='desc' ?  -comparison : comparison
                        break
                    case 'subject':
                        sortOrder = sortOrderSubject === 'desc' ? -1 : 1

                        console.log('subject', mail1.subject.localeCompare(mail2.subject));
                        return mail1.subject.localeCompare(mail2.subject) * sortOrder
                        // sortOrder = sortOrderSubject ==='desc' ?  -comparison : comparison


                        break
                    default:
                        return 0
                }
                // console.log('sortOrder: ',sortOrder);

                //return sortOrder === 'desc' ? -comparison : comparison
            });


        }
        // console.log('emails service: ',emails);
        return emails
    } catch (err) {
        console.error('Failed to fetch emails:', err);

    }


}

function getById(id) {
    return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
    return storageService.remove(STORAGE_KEY, id)
}

function createEmail(id = '', subject = '', body = '', isRead = false, isStarred = false, sentAt = '', removedAt = '', from = '', to = '') {
    return {
        id,
        subject,
        body,
        isRead,
        isStarred,
        sentAt,
        removedAt,
        from,
        to
    }
}


function getDefaultFilter() {
    return {
        status: "inbox",
        txt: "",
        isRead: null,
        sortField: 'date',
        sortOrderDate: 'desc',
        sortOrderSubject: 'desc'
    }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        // console.log('field: ', field)
        filterBy[field] = searchParams.get(field) || ''
    }
    return filterBy
}


function save(emailToSave) {
    if (emailToSave.id) {
        console.log('put', emailToSave)
        return storageService.put(STORAGE_KEY, emailToSave)
    } else {
        console.log('post', emailToSave)
        return storageService.post(STORAGE_KEY, emailToSave)
    }
}

async function getUnreadCountEmails() {
    const emails = await storageService.query(STORAGE_KEY)
    // console.log('emails Service',emails);

    return emails.filter(email => !email.isRead && (email.to === loginUser || email.to === loginUser2)).length
    // console.log('x: ',x)


}




function _createEmails() {
    let emails = utilService.loadFromStorage(STORAGE_KEY)
    if (emails && emails.length > 0) return


    // emails = [
    //     {
    //         id: 'e101',
    //         subject: 'Miss you!',
    //         body: 'Would love to catch up sometimes',
    //         isRead: false,
    //         isStarred: true,
    //         sentAt: 1551133930594,
    //         removedAt: null, //for later use from: 'momo@momo.com',
    //         from: 'momo@momo.com',
    //         to: 'user@appsus.com'
    //     },
    //     {
    //         id: 'e102',
    //         subject: 'Hello there!',
    //         body: 'How are you today',
    //         isRead: false,
    //         isStarred: false,
    //         sentAt: 1551133930594,
    //         removedAt: null, //for later use from: 'koko@koko.com',
    //         from: 'koko@koko.com',
    //         to: 'user@appsus.com'
    //     },
    //     {
    //         id: 'e103',
    //         subject: 'This is Spam',
    //         body: 'BLA BLA BLA',
    //         isRead: true,
    //         isStarred: false,
    //         sentAt: 1551133930594,
    //         removedAt: null, //for later use from: 'popo@mpopo.com',
    //         from: 'popo@mpopo.com',
    //         to: 'ilan@appsus.com'
    //     },
    //     {
    //         id: 'e104',
    //         subject: 'Lets talk',
    //         body: 'I need to talk to you',
    //         isRead: false,
    //         isStarred: false,
    //         sentAt: 1551133930594,
    //         removedAt: null, //for later use from: 'toto@toto.com',
    //         from: 'toto@toto.com',
    //         to: 'user@appsus.com'
    //     },
    //     {
    //         id: 'e105',
    //         subject: 'Sale starts in ZARA today!',
    //         body: 'Big discounts!',
    //         isRead: true,
    //         isStarred: true,
    //         sentAt: 1551133930594,
    //         removedAt: null, //for later use from: 'fofo@fofo.com',
    //         from: 'fofo@fofo.com',
    //         to: 'user@appsus.com'
    //     },
    // ]

    emails = [
        {
            "id": "e001",
            "subject": "Happy Birthday!",
            "body": "Welcome to our service! We're glad to have you with us.",
            "isRead": true,
            "isStarred": false,
            "sentAt": "24-08-2024 08:13:24",
            "removedAt": null,
            "from": "sharon@gmail.com",
            "to": "sharon@gmail.com"
        },
        {
            "id": "e002",
            "subject": "Application Approved",
            "body": "Your feedback is important to us. Please take a moment to complete our survey.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "02-07-2024 15:24:08",
            "removedAt": null,
            "from": "user89@webmail.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e003",
            "subject": "Your Invoice is Ready",
            "body": "We are pleased to inform you that your payment has been received.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "13-06-2024 09:54:33",
            "removedAt": null,
            "from": "user36@appsus.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e004",
            "subject": "Join Us for a Live Event",
            "body": "We have an important update regarding your account.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "01-01-2023 11:21:53",
            "removedAt": null,
            "from": "user99@example.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e005",
            "subject": "Payment Received",
            "body": "We are excited to announce our new product lineup.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "14-08-2024 17:03:34",
            "removedAt": null,
            "from": "user43@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e006",
            "subject": "Ticket Confirmation",
            "body": "Your order has been processed and will be delivered soon.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "14-06-2024 05:11:43",
            "removedAt": null,
            "from": "user53@appsus.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e007",
            "subject": "Invitation to Webinar",
            "body": "Your membership has been renewed successfully.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "20-06-2024 20:45:03",
            "removedAt": null,
            "from": "user98@example.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e008",
            "subject": "Invitation to Connect",
            "body": "We are excited to announce our new product lineup.",
            "isRead": false,
            "isStarred": false,
            "sentAt": "15-07-2024 18:24:23",
            "removedAt": null,
            "from": "user45@webmail.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e009",
            "subject": "Action Required: Password Reset",
            "body": "We noticed unusual activity on your account. Please verify your identity.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "11-08-2024 10:05:03",
            "removedAt": null,
            "from": "user74@company.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e010",
            "subject": "Special Discount Inside",
            "body": "We would love to get your feedback on our latest product.",
            "isRead": false,
            "isStarred": false,
            "sentAt": "22-04-2024 21:12:31",
            "removedAt": null,
            "from": "user50@example.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e011",
            "subject": "Thank You for Your Purchase",
            "body": "We appreciate your business and hope to serve you again soon.",
            "isRead": true,
            "isStarred": false,
            "sentAt": "14-06-2024 05:11:43",
            "removedAt": null,
            "from": "user29@company.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e012",
            "subject": "Time to Update Your Profile",
            "body": "Please update your profile to ensure you receive the latest updates.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "29-09-2024 15:05:03",
            "removedAt": null,
            "from": "user36@company.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e013",
            "subject": "New Features Available",
            "body": "We have some exciting news to share with you!",
            "isRead": true,
            "isStarred": false,
            "sentAt": "13-05-2024 13:05:03",
            "removedAt": null,
            "from": "user61@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e014",
            "subject": "Survey Invitation",
            "body": "Thank you for being a valued customer. Here's a special offer just for you.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "23-03-2024 11:45:32",
            "removedAt": null,
            "from": "user95@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e015",
            "subject": "Reminder: Upcoming Appointment",
            "body": "Your appointment is confirmed. We look forward to seeing you.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "20-08-2024 14:45:03",
            "removedAt": null,
            "from": "user24@webmail.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e016",
            "subject": "New Job Opportunity",
            "body": "Please find the attached document for your reference.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "25-04-2024 16:45:23",
            "removedAt": null,
            "from": "user12@appsus.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e017",
            "subject": "Payment Reminder",
            "body": "Don't miss out on this limited-time offer.",
            "isRead": true,
            "isStarred": false,
            "sentAt": "11-08-2024 10:05:03",
            "removedAt": null,
            "from": "user49@company.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e018",
            "subject": "Conference Registration",
            "body": "Thank you for registering for our conference. We look forward to seeing you there.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "26-06-2024 21:50:17",
            "removedAt": null,
            "from": "user13@webmail.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e019",
            "subject": "New Comment on Your Post",
            "body": "We noticed a new comment on your post. Please check it out.",
            "isRead": true,
            "isStarred": false,
            "sentAt": "29-07-2024 10:09:56",
            "removedAt": null,
            "from": "user14@appsus.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e020",
            "subject": "Service Maintenance Notification",
            "body": "We are excited to announce our new product lineup.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "09-06-2024 09:25:12",
            "removedAt": null,
            "from": "user52@webmail.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e021",
            "subject": "Important Document Enclosed",
            "body": "Please find the attached warranty information for your records.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "10-05-2024 18:45:32",
            "removedAt": null,
            "from": "user20@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e022",
            "subject": "Exclusive Offer Just for You",
            "body": "Please confirm your subscription to our newsletter.",
            "isRead": true,
            "isStarred": false,
            "sentAt": "12-02-2024 11:35:20",
            "removedAt": null,
            "from": "user10@webmail.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e023",
            "subject": "System Alert",
            "body": "We have received your request and are working on it.",
            "isRead": true,
            "isStarred": false,
            "sentAt": null,
            "removedAt": null,
            "from": "user58@example.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e024",
            "subject": "Reminder: Upcoming Appointment",
            "body": "Please take a moment to review the attached invoice.",
            "isRead": true,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user59@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e025",
            "subject": "Your Subscription is Expiring",
            "body": "Your subscription will expire soon. Please renew to continue enjoying our services.",
            "isRead": true,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user92@webmail.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e026",
            "subject": "Please Review Your Order",
            "body": "We are excited to announce our new product lineup.",
            "isRead": true,
            "isStarred": false,
            "sentAt": null,
            "removedAt": null,
            "from": "user75@company.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e027",
            "subject": "Upcoming Deadline",
            "body": "Don't forget to attend the meeting scheduled for tomorrow.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "14-12-2024 19:35:20",
            "removedAt": null,
            "from": "user83@example.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e028",
            "subject": "Important Security Notice",
            "body": "Your feedback is important to us. Please take a moment to complete our survey.",
            "isRead": true,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user86@company.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e029",
            "subject": "Holiday Greetings",
            "body": "We would love to get your feedback on our latest product.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "16-05-2016 23:39:20",
            "removedAt": null,
            "from": "user68@appsus.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e030",
            "subject": "Survey Invitation",
            "body": "We appreciate your business and hope to serve you again soon.",
            "isRead": true,
            "isStarred": false,
            "sentAt": "14-12-2018 20:39:20",
            "removedAt": null,
            "from": "user38@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e031",
            "subject": "Conference Registration",
            "body": "Thank you for registering for our conference. We look forward to seeing you there.",
            "isRead": true,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user91@company.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e032",
            "subject": "Action Required: Password Reset",
            "body": "We received a request to reset your password. Please follow the instructions to proceed.",
            "isRead": true,
            "isStarred": false,
            "sentAt": null,
            "removedAt": null,
            "from": "user63@example.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e033",
            "subject": "New Message from Support",
            "body": "Please take a moment to verify your email address.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "11-03-2005 09:41:20",
            "removedAt": null,
            "from": "user72@appsus.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e034",
            "subject": "Your Gift Card",
            "body": "We have a special gift just for you. Please redeem it within 30 days.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "14-12-2018 20:39:20",
            "removedAt": null,
            "from": "user27@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e035",
            "subject": "System Alert",
            "body": "We noticed unusual activity on your account. Please verify your identity.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "14-12-2018 20:39:20",
            "removedAt": null,
            "from": "user51@company.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e036",
            "subject": "Upcoming Deadline",
            "body": "We appreciate your business and hope to serve you again soon.",
            "isRead": true,
            "isStarred": false,
            "sentAt": "14-12-2018 20:39:20",
            "removedAt": null,
            "from": "user20@webmail.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e037",
            "subject": "Service Maintenance Notification",
            "body": "We noticed unusual activity on your account. Please verify your identity.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "14-12-2018 20:39:20",
            "removedAt": null,
            "from": "user28@appsus.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e038",
            "subject": "Event Reminder",
            "body": "Please find the attached document for your reference.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "14-12-2018 20:39:20",
            "removedAt": null,
            "from": "user62@example.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e039",
            "subject": "Happy Birthday!",
            "body": "Please take a moment to review the attached invoice.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "14-12-2018 20:39:20",
            "removedAt": null,
            "from": "user73@company.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e040",
            "subject": "Conference Registration",
            "body": "Please confirm your attendance at the upcoming event.",
            "isRead": true,
            "isStarred": false,
            "sentAt": "14-12-2018 20:39:20",
            "removedAt": null,
            "from": "user26@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e041",
            "subject": "Important Product Update",
            "body": "We are pleased to inform you that your payment has been received.",
            "isRead": false,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user83@example.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e042",
            "subject": "New Features Available",
            "body": "Your feedback is crucial to us. Please let us know your thoughts.",
            "isRead": true,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user74@company.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e043",
            "subject": "Account Verification Required",
            "body": "We are excited to announce our new product lineup.",
            "isRead": false,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user34@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e044",
            "subject": "Membership Renewal",
            "body": "Please review your order details and confirm.",
            "isRead": true,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user85@company.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e045",
            "subject": "Upcoming Deadline",
            "body": "Your appointment is confirmed. We look forward to seeing you.",
            "isRead": true,
            "isStarred": false,
            "sentAt": null,
            "removedAt": null,
            "from": "user21@webmail.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e046",
            "subject": "Event Reminder",
            "body": "Please take a moment to complete the attached survey.",
            "isRead": false,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user15@example.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e047",
            "subject": "Thank You for Your Feedback",
            "body": "Your feedback is crucial to us. Please let us know your thoughts.",
            "isRead": false,
            "isStarred": false,
            "sentAt": null,
            "removedAt": null,
            "from": "user90@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e048",
            "subject": "Important Account Update",
            "body": "Please update your payment information to continue using our service.",
            "isRead": true,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user60@webmail.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e049",
            "subject": "Survey Invitation",
            "body": "Thank you for being a valued customer. Here's a special offer just for you.",
            "isRead": false,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user82@example.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e050",
            "subject": "System Alert",
            "body": "We noticed unusual activity on your account. Please verify your identity.",
            "isRead": false,
            "isStarred": true,
            "sentAt": null,
            "removedAt": null,
            "from": "user64@company.com",
            "to": "user@appsus.com"
        }
    ]

    emails = [
        {
            "id": "e001",
            "subject": "Happy Birthday!",
            "body": "Welcome to our service! We're glad to have you with us.",
            "isRead": true,
            "isStarred": false,
            "sentAt": "2024-08-24T08:13:24",
            "removedAt": null,
            "from": "sharon@gmail.com",
            "to": "sharon@gmail.com",
            "isDraft": false
        },
        {
            "id": "e002",
            "subject": "Application Approved",
            "body": "Your feedback is important to us. Please take a moment to complete our survey.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "2024-07-02T15:24:08",
            "removedAt": null,
            "from": "user89@webmail.com",
            "to": "user@appsus.com",
            "isDraft": false

        },
        {
            "id": "e003",
            "subject": "Your Invoice is Ready",
            "body": "We are pleased to inform you that your payment has been received.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "2024-06-13T09:54:33",
            "removedAt": null,
            "from": "user36@appsus.com",
            "to": "user@appsus.com",
            "isDraft": false

        },
        {
            "id": "e004",
            "subject": "Join Us for a Live Event",
            "body": "We have an important update regarding your account.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "2023-01-01T11:21:53",
            "removedAt": null,
            "from": "user99@example.com",
            "to": "user@appsus.com",
            "isDraft": false

        },
        {
            "id": "e005",
            "subject": "Payment Received",
            "body": "We are excited to announce our new product lineup.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "2024-08-14T17:03:34",
            "removedAt": null,
            "from": "user43@service.com",
            "to": "user@appsus.com"
        },
        {
            "id": "e006",
            "subject": "Ticket Confirmation",
            "body": "Your order has been processed and will be delivered soon.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "2024-06-14T05:11:43",
            "removedAt": null,
            "from": "user53@appsus.com",
            "to": "user@appsus.com",
            "isDraft": false

        },
        {
            "id": "e007",
            "subject": "Invitation to Webinar",
            "body": "Your membership has been renewed successfully.",
            "isRead": true,
            "isStarred": true,
            "sentAt": "2024-06-20T20:45:03",
            "removedAt": null,
            "from": "user98@example.com",
            "to": "user@appsus.com",
            "isDraft": false

        },
        {
            "id": "e008",
            "subject": "Invitation to Connect",
            "body": "We are excited to announce our new product lineup.",
            "isRead": false,
            "isStarred": false,
            "sentAt": "2024-07-15T18:24:23",
            "removedAt": null,
            "from": "user45@webmail.com",
            "to": "user@appsus.com",
            "isDraft": false

        },
        {
            "id": "e009",
            "subject": "Action Required: Password Reset",
            "body": "We noticed unusual activity on your account. Please verify your identity.",
            "isRead": false,
            "isStarred": true,
            "sentAt": "2024-08-11T10:05:03",
            "removedAt": null,
            "from": "user74@company.com",
            "to": "user@appsus.com",
            "isDraft": false

        },
        {
            "id": "e010",
            "subject": "Special Discount Inside",
            "body": "We would love to get your feedback on our latest product.",
            "isRead": false,
            "isStarred": false,
            "sentAt": "2024-04-22T21:12:31",
            "removedAt": null,
            "from": "user50@example.com",
            "to": "user@appsus.com",
            "isDraft": false

        },
        // Additional emails would follow the same format...
    ];




    utilService.saveToStorage(STORAGE_KEY, emails)
}



function _createUsers() {
    let users = utilService.loadFromStorage(STORAGE_KEY)
    if (users && users.length > 0) return


    users = [
        {
            email: 'user@appsus.com',
            fullname: 'Mahatma Appsus'
        }
    ]

    utilService.saveToStorage(STORAGE_KEY, users)

}

function _sortEmails(emails, sortBy) {

    if (sortBy) {
        return emails.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.sentAt) - new Date(b.sentAt);
                    break;
                case 'subject':
                    comparison = a.subject.localeCompare(b.subject);
                    break;
                default:
                    return 0; // No sorting
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });




    }
}