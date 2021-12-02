import { authUser } from 'devops-shiftplanner/Backend/src/Types'
import React, { createContext, Dispatch, SetStateAction, useState } from 'react'

export type authContextValue = {
    user: authUser
    setUser: Dispatch<SetStateAction<authUser>>
}

export const UserContext = createContext<authContextValue | undefined>(undefined)

const UserContextProvider = props => {
    const [user, setUser] = useState<authUser>({
        id: 'Hej',
        role: false,
        loggedOn: false,
    })

    return <UserContext.Provider value={{ user, setUser }}>{props.children}</UserContext.Provider>
}

export default UserContextProvider
