import { useSearchParams, Link, Outlet } from 'react-router-dom'

export function Home() {

    const helpMail = 'help@gmail.com'
    const subject = 'Help'

    const [searchParam, setSearchParam] = useSearchParams()

    // function onNavigateToHelp(ev){
    //     ev.stopPropagation()
    //     ev.preventDefault()
    //     const params = new URLSearchParams({
    //         to: helpMail,
    //         subject: subject
    //     })
    //     console.log('params: ',params)
    //     setSearchParam(params)
    //     console.log('params: ',searchParam.toString())

    // }

    // const composeUrl = `/compose?status=inbox&${searchParam.toString()}`

    return (
        <section className="home">
            <h1>Welcome to our React App</h1>
            {/* <button onClick={onNavigateToHelp}>Help</button> */}
            <Link to='/compose?status=inbox&to=help@gmail.com&subject=Help' >Link</Link>
            {/* <Link to={composeUrl} onClick={onNavigateToHelp}>Link</Link> */}
            {/* <Link to={searchParam} onClick={onNavigateToHelp}>Link</Link> */}

        </section>
    )
}
