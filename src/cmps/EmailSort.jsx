import React from 'react'
import { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'


export function EmailSort({onFilterBy, filterBy}) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function onSortDate() {
        const newDirection = filterByToEdit.sortOrderDate === 'asc' ? 'desc' : 'asc'
   
        setFilterByToEdit(prev => ({
            ...prev,
            sortOrderDate: newDirection,
            sortField: 'date'
        }));

    }

    function onSortSubject() {

        const newDirection = filterByToEdit.sortOrderSubject === 'asc' ? 'desc' : 'asc'
        setFilterByToEdit(prev => ({
            ...prev,
            sortOrderSubject: newDirection,
            sortField: 'subject'
        }));
    }



    return (
        <section className='sort-emails'>
            <button className='sort-btn sort-date' onClick={onSortDate}>
                {filterByToEdit.sortOrderDate === 'asc' ? (
                    <FontAwesomeIcon icon={faChevronUp} className='up-arrow' />
                ) : (
                    <FontAwesomeIcon icon={faChevronDown} className='down-arrow' />
                )}
                Date
            </button>
            <button className='sort-btn sort-subject' onClick={onSortSubject}>
            {filterByToEdit.sortOrderSubject === 'asc' ? (
                    <FontAwesomeIcon icon={faChevronUp} className='up-arrow' />
                ) : (
                    <FontAwesomeIcon icon={faChevronDown} className='down-arrow' />
                )}
                Subject
            </button>
        </section>
    );
}
