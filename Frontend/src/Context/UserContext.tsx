import Axios from 'axios'
import { authUser } from 'devops-shiftplanner/Backend/src/Types'
import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'

type authContextValue = {
    user: authUser
    setUser: Dispatch<SetStateAction<authUser>>
}

export const UserContext = createContext<authContextValue | undefined>(undefined)

const UserContextProvider = props => {
    const [user, setUser] = useState<authUser>({
        id: '',
        role: false,
        loggedOn: false,
    })

    const checkCookieLogin = async () => {
        console.log('is this being called?')
        const result = (
            await Axios.post<
                { success: true; data: { id: string; role: boolean } } | { success: false; errorMessage: string }
            >(`${process.env.REACT_APP_URL}/api/checkCookie`, { data: '' }, { withCredentials: true })
        ).data

        if (result.success) {
            const formatUser: authUser = { id: result.data.id, role: result.data.role, loggedOn: true }
            setUser(formatUser)
        } 
    }

    useEffect(() => {
        checkCookieLogin()
    }, [])

    return <UserContext.Provider value={{ user, setUser }}>{props.children}</UserContext.Provider>
}

export default UserContextProvider
