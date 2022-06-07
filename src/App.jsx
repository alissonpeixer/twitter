import { useState } from 'react'

import { Home } from './Home'
import { Login } from './Login'
import { Signup } from './Signup'




function userInfo() {
    const userObjectInfo = localStorage.getItem('user');
    const userInfo = JSON.parse(userObjectInfo);


    if (!userObjectInfo) {
        return false

    }

    return {
        userInfo: userInfo.userInfo,
        userToken: userInfo.userToken
    }

}

export function App() {
    const [user, setUser] = useState()
    

    
    if (userInfo().userInfo || user) {
        return <Home loggedInUser={userInfo().userToken} />
    }

    return window.location.pathname === '/signup'
    ? <Signup signInUser={setUser}/>
    : <Login signInUser={setUser}/>



}
