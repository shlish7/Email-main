import React from 'react'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faX} from '@fortawesome/free-solid-svg-icons'

function EmailFilter({ filterBy, onFilterBy }) {

  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
  const [isRead, setIsRead] = useState(filterBy.isRead)
  const [isSearch,setIsSearch] = useState()

  // Rendering while rendering and filterByToEdit is changing
  useEffect(() => {
    onFilterBy(filterByToEdit)
  }, [filterByToEdit])


  function handleChange({ target }) {
    const { value, name } = target
    setIsSearch(true)
    setFilterByToEdit(prev => ({ ...prev, [name]: value }))
  }

  function btnName() {
    return isRead ? "Read" : "Unread"
  }

  function onReadBtnClicked(prev) {
    setIsRead(prev => !prev)
    setFilterByToEdit(prev => ({ ...prev, ["isRead"]: !isRead }))
  }

  function onChangeSearchIcon({target}){
    setIsSearch(prev=>!prev)
    setFilterByToEdit(prev => ({ ...prev, ['txt']: '' }))


  }

  return <section className='email-filter'>
    {/* <label htmlFor="txt">Subject</label> */}
    <div className="input-container">
      {isSearch ? 
        <FontAwesomeIcon icon={faX} className='x-icon' onClick={onChangeSearchIcon}/> :
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        }
      
      
      <input className='search-input'
        value={isSearch ? filterByToEdit.txt : ''}
        onChange={handleChange}
        id="txt"
        name="txt"
        type="text"
        placeholder='Search Email...'
      />
    </div>

    <button className="isReadBtn" onClick={onReadBtnClicked}>{btnName()}</button>
  </section>

}

export default EmailFilter