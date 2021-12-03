import axios from 'axios'
import {
    UserDayShift
} from '../../../../../Backend/src/Types'

export const getDayShifts = async (date: string): Promise < UserDayShift[] | undefined > => {
    try {
        const fetchUserShifts = (
            await axios.post < UserDayShift[] > (
                `${process.env.REACT_APP_URL}/api/fetchUsersShift`, {
                    date: date
                }, {
                    withCredentials: true
                }
            )
        ).data
        if (fetchUserShifts == undefined) {
            console.log('data undefined')
        }
        return fetchUserShifts
    } catch (e) {
        console.log('couldnt fetch user shifts: ' + e)
    }
}