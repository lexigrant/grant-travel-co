import { GoogleLogin } from '@react-oauth/google';
import axios, { AxiosRequestConfig } from 'axios';
import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import './App.css';
import Map from './Components/Map';
import NewTravelEntry from './Components/NewTravelEntry';
import TravelEntry from './Components/TravelEntry';
import { Travel, User } from './Types';

const API_URL = process.env.REACT_APP_API_URL

type GoogleUserObj = {
  email: string;
  sub: string;
  picture: string;
  name: string;
}

const App = () => {
  const [userObj, setUserObj] = useState<User | undefined>(undefined)
  const [travelEntries, setTravelEntries] = useState<Travel[]>([])
  const [googleUser, setGoogleUser] = useState<GoogleUserObj | undefined>(undefined)


  const signUpNewUser = async (googleUser: GoogleUserObj) => {
    const status = await (await axios.post(`${API_URL}/api/user`, {
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      googleSub: googleUser.sub
    })).status
    if (status === 201) {
      login(googleUser);
    } else {
      alert("Something went wrong. Please try again later.");
    }
  }

  const login = async (googleUser: GoogleUserObj) => {
    const data = await (await axios.get(`${API_URL}/api/user/googleSub/${googleUser.sub}`)).data as User
    if (data) {
      setUserObj(data)
    } else {
      signUpNewUser(googleUser)
    }
  }

  // Post Travel Request
  const handlePost = async (newEntry: Travel) => {
    if (userObj) {
      await axios.post(`${API_URL}/api/user/${userObj.id}/travel`, newEntry)
      await refetch()
    }
  }

  // Update Travel Request
  const handleUpdate = async (editEntry: Travel) => {
    console.log(editEntry)
    await axios.put(`${API_URL}/api/travel/${editEntry.id}`, editEntry)
    await refetch()
  }

  const handleDelete = async (deleteEntry: Travel) => {
    await axios.delete(`${API_URL}/api/travel/${deleteEntry.id}`)
    await refetch()
  }


const refetch = async () => {
  if (userObj) {
    const data = await (await axios.get(`${API_URL}/api/user/${userObj.id}/travel`)).data as Travel[]
    const travels = data.map(t => {
      t.entryDate = new Date(t.entryDate)
      return t;
    })
    const sortedTravels = travels.sort((a, b) => b.entryDate.getTime() - a.entryDate.getTime())
    setTravelEntries(travels)
  }
}

  useEffect(() => {
    if (googleUser) { login(googleUser) };
  }, [googleUser])



  useEffect(() => {
    refetch()
  }, [userObj])


  return (
    <div >
      <h1>Grant Travel Co</h1>
      {travelEntries.length > 0 ? <Map travelEntry={travelEntries[0]} /> : null}
      <NewTravelEntry handlePost={(newEntry)=>handlePost(newEntry)}/>
      {userObj?.name ?
        // User is authenticated so we display their travel diaries
        <>
          <p>HELLO</p>
          <p>{userObj.name}</p>
          {travelEntries.length > 0 ? travelEntries?.map(entry => {
            return <TravelEntry travelEntry={entry} handleDelete={()=>handleDelete(entry)} handleUpdate={handleUpdate}/>
          }) : <p>No Entries to Display</p>}
        </> :
        // User is unauthenticated, so we try to login/sign up
        <GoogleLogin onSuccess={credentialResponse => {
          const resp: any = credentialResponse.credential ? jwtDecode(credentialResponse.credential) : null;
          console.log(resp)
          if (resp) {
            setGoogleUser(resp)
          }
        }}
          onError={() => {
            console.log('Login Failed');
          }} />
      }

    </div>
  )
}

export default App;




