import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import './MultiSelect.css'

function MultiSelect({ interests, selected, toggleOptions }) {
    return (
        <div className='c-multi-select-dropdown'>
            <div className='c-multi-select-dropdown-selected'>
                <div> 0 Selected </div>
            </div>
            <ul className='c-multi-select-dropdown-options'>
                <li className='c-multi-select-dropdown-option'>
                    <input type='checkbox' className='c-multi-select-dropdown-option-checkbox'></input>
                    <span>interest</span>
                </li>
            </ul>
        </div>
    )

}

export default MultiSelect