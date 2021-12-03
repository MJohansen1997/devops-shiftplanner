import Axios from 'axios'
import { Shift , User} from '../../../../Backend/src/Types'
import {useContext, useState} from 'react'
import { PopUp } from '../PopUp/PopUp'
import {UserContext} from "../../Context/UserContext";

export const RegisterShiftForm = props => {
    const [popUp, setPopUp] = useState(props.setPopTrue)
    const [formData, setFormData] = useState<Shift| undefined>()

    const [shift, setShift] = useState({
        username: '',
        date: '',
        startTime: '',
        endTime: '',
    })

    const doRegister = async () => {
        const result = await Axios.post(`${process.env.REACT_APP_URL}/api/registerShift`, shift, {
            withCredentials: true,
        })
        console.log(result)
    }

    const handleChange = event => {
        const value = event.target.value
        setShift({
            ...shift,
            [event.target.name]: value,
        })
    }

    const handleSubmit = event => {
        event.preventDefault()
        setPopUp(false)
        console.log(shift)

         doRegister()
    }

    return props.popValues.isOpen ? (
            <div>
                <PopUp
                    trigger={props.popValues.isOpen}
                    setTrigger={props.popValues.setIsOpen}
                    formtype="Create new shift"
                    data-testId="PopUp"
                >
                    <div className="flex flex-col pt-4 pb-4 justify-center">
                        <div className="flex flex-col space-y-8 justify-center items-center font-bold">
                            <form className="flex flex-col space-y-3 items-center" onSubmit={handleSubmit}>

                                <label className="flex flex-col">
                                    Username:
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        name="username"
                                        value={shift.username}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    Date:
                                    <input
                                        type="text"
                                        placeholder="01-01-22"
                                        name="date"
                                        value={shift.date}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    Start time for the shift:
                                    <input
                                        type="text"
                                        placeholder="08:00"
                                        name="startTime"
                                        value={shift.startTime}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    End time for the shift:
                                    <input
                                        type="text"
                                        placeholder="16:00"
                                        name="endTime"
                                        value={shift.endTime}
                                        onChange={handleChange}
                                    />
                                </label>

                                <button className="bg-sky-200 font-bold text-black text-md w-full " type="submit">
                                    {' '}
                                    Register{' '}
                                </button>
                            </form>
                        </div>
                    </div>
                </PopUp>
            </div>
    ) : (
         <> </>
    )
}
