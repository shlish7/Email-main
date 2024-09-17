import React, { useState, useRef, useEffect } from 'react'
import { eventBusService } from '../services/event-bus.service'

export  function UserMessage() {

    const [msg,setMsg] =useState(null)
    const timeoutIdRef = useRef()

    useEffect(()=>{
        const unsubscribe = eventBusService.on('show-user-msg',msg=>{
            clearTimeout(timeoutIdRef.current)
            setMsg(msg)
            timeoutIdRef.current = setTimeout(onCloseMsg, 2000)
        })
        return unsubscribe
    },[])


    function onCloseMsg(){  
        setMsg(null)
    }

    if(!msg) return <></>
  return (
    <div className={'user-msg ' + msg.type}>
        <h4>{msg.txt}</h4>
        <button onClick={onCloseMsg} className='close-btn'>X</button>
    </div>
  )
}
