import axios from "axios"
import { UserDayShift,  Shift } from '../../../../../Backend/src/Types'
import { render, screen } from '@testing-library/react';

export const getDayShifts = async (date: string): Promise<UserDayShift[] | undefined> => {
   try {
      const fetchUserShifts = (await axios.post<UserDayShift[]>(`${process.env.REACT_APP_URL}api/fetchUsersShift`, {date: date}, { withCredentials: true })).data
      if(fetchUserShifts == undefined) {
         console.log("data undefined")
      }  
      return fetchUserShifts
   } catch (e) {
       console.log("couldnt fetch user shifts: " + e)
       
   }
}