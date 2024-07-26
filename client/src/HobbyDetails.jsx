import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'


const HobbyDetails = ({ username, hobbyId, hobbyName}) => {
    const [tools, setTools] = useState('')
    useEffect(() => {
        fetchDetails()
    }, [username])
    
    const fetchDetails = async () => {
        if (hobbyId == null) {
            return
        }
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/${hobbyId}/get-tools`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`status: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            setTools(data)
        })
        .catch(error => {
            console.error('error fetching tools:', error)
        })
    
    }
    return (
        <>
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} hobbyName={hobbyName} hobbyId={parseInt(hobbyId)}/>

        <div className='text-center' style={{marginBottom:'100px', marginTop:'60px'}}>
          <h1>{hobbyName} Details</h1>
          <h3>Here are some ways to engage in your hobby without overspending</h3>
          <br></br>
          <div className="text-center mb-4" style={{border: '1.5px solid #4e9c90', margin: '20px 30px 70px 30px', borderRadius: '8px', boxShadow: '0px 0px 20px #4e9c90', backgroundColor: '#4e9c90', color: 'white', padding:'40px'}}>
        <br></br>
        <p>{tools}</p>
        </div>
        </div>

        <footer className="container">
            <hr></hr>
            <p className="float-right"><a href="#">Back to top</a></p>
            <p style={{marginBottom:'100px'}}>&copy; 2024 Hobby Hunt, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
        </footer>
        </>
    )
}

export default HobbyDetails;