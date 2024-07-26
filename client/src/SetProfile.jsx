import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Form from 'react-bootstrap/Form';
import { faWorm } from '@fortawesome/free-solid-svg-icons'
import Dropdown from 'react-bootstrap/Dropdown';

function SetProfile({ username, setUserId }) {
    const [bio, setBio] = useState('')
    const [pronouns, setPronouns] = useState('')
    const [pfp, setPfp] = useState(null)
    const [pfpUrl, setPfpUrl] = useState('')
    const [saveProf, setSaveProf] = useState(null)

    const handlePfpChange = (e) => {
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
                pfp: pfpUrl
            })
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                setSaveProf("okay")
                setUserId(data)
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }


    return (
        <>
            <br></br><br></br><br></br><br></br><br></br>
            <Form className="form-signin">
            <div className="text-center mb-6">
                <FontAwesomeIcon icon={faWorm} className='hobby-logo' style={{color: '#4e9c90', fontSize: '70px'}}/>
                <br></br>
                <h1 className="h3 mb-3 font-weight-normal" style={{fontSize: '50px'}}>Set Profile</h1>
            </div>

            <Form.Group className="mb-4" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Introduce yourself! Write your bio </Form.Label>
                <Form.Control as="textarea" rows={3} onChange={(e)=> setBio(e.target.value)} value={bio}/>
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-4">
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Select Your Pronouns
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setPronouns('She/Her')}>She/Her</Dropdown.Item>
                    <Dropdown.Item onClick={() => setPronouns('He/Him')}>He/Him</Dropdown.Item>
                    <Dropdown.Item onClick={() => setPronouns('They/Them')}>They/Them</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            {pronouns && <p><br></br>Selected: {pronouns}</p>}
            </Form.Group>
            
            <Form.Group controlId="formFile" className="mb-4">
                <Form.Label>Select a profile picture</Form.Label>
                <Form.Control type="file" onChange={handlePfpChange}/>
            </Form.Group>
      <button  type='submit' onClick={handleSubmit} className='log-btn' style={{width: '300px', height: '60px', fontSize:'18px', marginRight:'10px', backgroundColor: '#4e9c90', color: 'white', textAlign:'center'}}>Save Profile</button>
      {saveProf && (<Navigate to={`/interests`} replace={true}/>)}
      
      <p className="mt-5 mb-3 text-muted text-center">&copy; 2024</p>
    
    </Form>
        </>
    )
}

export default SetProfile