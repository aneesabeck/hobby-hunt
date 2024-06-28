import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import './SetProfile.css'

function SetProfile() {
    const [bio, setBio] = useState('')
    const [pronouns, setPronouns] = useState('')
    const [pfp, setPfp] = useState(null)
    const [pfpUrl, setPfpUrl] = useState('')
    const [saveProf, setSaveProf] = useState(null)

    const { username } = useParams();

    const handlePfpChange = (e) => {
        // changes image to url
        const file = e.target.files[0]
        setPfp(file)
        if (!file || !file.type.startsWith('image/')){
            console.error("Please select an image file")
        }
        const reader = new FileReader()
        reader.onload = () => {
            setPfpUrl(reader.result)
        }
        reader.readAsDataURL(file)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${username}/profile-setup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bio: bio,
                pronouns: pronouns,
                pfp: pfp
            })
        })
            .then(response => {
                if (response.ok) {
                    setSaveProf(response.json())
                    return response.json()
                }
                throw new Error('failed to set profile')
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }


    return (
        <div>
            <h1>Set Up Your Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label><input onChange={(e)=> setBio(e.target.value)} value={bio} placeholder='Short Bio'></input></label>
                </div>
                <div>
                    {/* might change to dropdown to have options */}
                    <label><input onChange={(e)=> setPronouns(e.target.value)} value={pronouns} placeholder='Pronouns'></input></label>
                </div>
                <div>
                    <label><input type='file' accept="image/*" onChange={handlePfpChange}></input></label>
                </div>
                <img src={pfpUrl}/>
                <button type='submit'>Save Profile</button>
            </form>
            {saveProf && (<Navigate to={`/${username}/interests`} replace={true}/>)}
        </div>
    )
}

export default SetProfile