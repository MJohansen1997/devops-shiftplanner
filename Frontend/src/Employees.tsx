import Axios from 'axios'
import { EmployeeDisplay } from 'devops-shiftplanner/Backend/src/Types'
import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from './Context/UserContext'

export const Employees = () => {
    // const { user, setUser } = useContext(UserContext)
    const [data, setData] = useState<EmployeeDisplay[]>([])
    const history = useHistory()

    // const getOneUser = async () => {
    //     const result = (
    //         await Axios.post<User>('http://localhost:8080/login', user.id, { withCredentials: true })
    //     ).data

    //     setData(result)
    //     console.log(result)
    // }

    const getAllUsers = async () => {
        const result = (
            await Axios.get<EmployeeDisplay[]>(`${process.env.REACT_APP_URL}/api/getEmployees`, {
                withCredentials: true,
            })
        ).data

        console.log(result)

        setData(result)
        console.log(result)
    }

    const getAvatar = (image: Buffer | undefined) => {
        if (typeof image === 'undefined') {
            return (
                <img className="object-scale-down h-12 w-full" src="https://freesvg.org/img/abstract-user-flat-4.png" />
            )
        }
        return image
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    return (
        <tbody>
            {data.map(r => (
                <tr>
                    <td>{getAvatar(r.avatar)}</td>
                    <td>{r.firstname}</td>
                    <td>{r.lastname}</td>
                    <td>{r.email}</td>
                    <td>{r.jobposition}</td>
                    <td>{r.phone}</td>
                    <td>{r.birthday}</td>
                </tr>
            ))}
        </tbody>
    )
}
