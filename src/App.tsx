import { GoogleLogin } from '@react-oauth/google';
import axios, { AxiosRequestConfig } from 'axios';
import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import './index.css';
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
  const [activeTravelEntry, setActiveTravelEntry] = useState<Travel | undefined>(undefined)
  const [showAddForm, setShowAddForm] = useState(false)


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
    setActiveTravelEntry(editEntry)
    await refetch()
  }

  const handleDelete = async (deleteEntry: Travel) => {
    await axios.delete(`${API_URL}/api/travel/${deleteEntry.id}`)
    setActiveTravelEntry(undefined)
    await refetch()
  }

  const onClickAdd = () => {
    setShowAddForm(true)
    setActiveTravelEntry(undefined)
  }

  const refetch = async () => {
    if (userObj) {
      const data = await (await axios.get(`${API_URL}/api/user/${userObj.id}/travel`)).data as Travel[]
      const travels = data.map(t => {
        t.entryDate = new Date(t.entryDate)
        return t;
      })
      setTravelEntries(travels)
    }
  }

  const signOut = () => {
    setShowAddForm(false)
    setActiveTravelEntry(undefined)
    setGoogleUser(undefined)
    setUserObj(undefined)
    setTravelEntries([])
  }

  useEffect(() => {
    if (googleUser) { login(googleUser) };
  }, [googleUser])



  useEffect(() => {
    refetch()
  }, [userObj])

  useEffect(() => {
    if (activeTravelEntry !== undefined) {
      setShowAddForm(false)
    }
  }, [activeTravelEntry])


  return (
    <div >
      <h1 className="siteHeading">Grant Travel Co
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.00967 5.12761H11.0097C12.1142 5.12761 13.468 5.89682 14.0335 6.8457L16.5089 11H21.0097C21.562 11 22.0097 11.4477 22.0097 12C22.0097 12.5523 21.562 13 21.0097 13H16.4138L13.9383 17.1543C13.3729 18.1032 12.0191 18.8724 10.9145 18.8724H8.91454L12.4138 13H5.42485L3.99036 15.4529H1.99036L4.00967 12L4.00967 11.967L2.00967 8.54712H4.00967L5.44417 11H12.5089L9.00967 5.12761Z"
            fill="currentColor"
          />
        </svg></h1>
      {userObj && <button className="signOutButton" onClick={signOut}>Sign Out</button>}
      {travelEntries.length > 0 ? <Map travelEntries={travelEntries} onClickPin={(t) => { setActiveTravelEntry(t) }} /> : null}
      {userObj?.name ? <NewTravelEntry handlePost={(newEntry) => handlePost(newEntry)} isShowing={showAddForm} onClickAdd={onClickAdd} /> : null}
      {userObj?.name ?
        // User is authenticated so we display their travel diaries
        <>

          {activeTravelEntry ? <TravelEntry travelEntry={activeTravelEntry} handleDelete={() => handleDelete(activeTravelEntry)} handleUpdate={handleUpdate} /> :
            !showAddForm && (<>
              <p className="greeting"> Hello {userObj?.name}! Add a new entry or relive an old one...</p>
            </>)
          }
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




