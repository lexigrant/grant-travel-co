import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { useState } from 'react';
import './App.css';

type user = {
  name: string;
}

function App() {
  const [userObj, setUserObj] = useState({} as user)
  return (
    <div >
      <h1>Grant Travel Co</h1>
      {userObj.name ? <><p>HELLO</p>
        <p>{userObj.name}</p></> :
        <GoogleLogin onSuccess={credentialResponse => {
        const resp: any = credentialResponse.credential ? jwtDecode(credentialResponse.credential) : null;
        console.log(resp)
        if (resp) {
          setUserObj(resp)
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

