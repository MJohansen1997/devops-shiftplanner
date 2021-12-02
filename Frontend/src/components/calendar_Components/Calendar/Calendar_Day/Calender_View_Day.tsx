import React, {useState, useEffect} from "react";
import { addMonths, format, isSameMonth, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, getWeek, getISOWeek, isSameDay  } from "date-fns";
import {Link} from "react-router-dom";
import Axios from 'axios'
import { IFruitData, User, Shift, UserDayShift } from 'devops-shiftplanner/Backend/src/Types'


export const CalendarDay = () => {
    const [currentDay, setCurrentDay] = useState(new Date())

    const [shifts, setShifts] = useState<UserDayShift[]>([])

    const getShifts = async () => {
        console.log("before get")
        try {
            const result = (await Axios.post<[]>('http://localhost:8080/api/fetchUsersShift', {date: "2021-11-27"}, { withCredentials: true })).data  
            setShifts(result)
            console.log("printing result of fetch of users\n")
            console.log(result)
        } catch (e) {
            console.log("couldnt fetch user shifts: " + e)
        }

        
        
    }

    useEffect(() => {
        getShifts()
    }, [])



    function nextDay() {
        setCurrentDay(addDays(currentDay, +1))
    }
    function prevDay() {
        setCurrentDay(addDays(currentDay, -1))
    }
    
    
    const renderShifts = () => {
        
        console.log("inside render shifts: " + JSON.stringify(shifts))
        // return shifts ? (
        //     <>
        //         {shifts.map(({firstname, email, shifts}) => {
        //             return(
        //                 {shifts.map(({startTime, endTime}) => {
        //                     return (           
        //                         <div className={`flex rounded-lg ml-1 border-2 border-black col-start-${startTime} col-end-${endTime} p-3 bg-amber-200 text-black font-bold justify-center`} key={firstname}>
        //                             {firstname}
        //                             {email}
        //                         </div>
        //                     )
        //                 })}
        //             )
        //         })
        //         }
        //      </>
        //      ) : (<div> Loading elements.. </div>)
    }

    const renderHeader = () => {
        const dateFormat = 'B..BBB'
        return (
            <div className="header bg-gray-600">
                <div className="icon cursor-pointer ml-5" onClick={prevDay}>
                    {' '}
                    chevron_left{' '}
                </div>
                <span className=""> {format(currentDay, dateFormat)} </span>
                <div className="icon cursor-pointer" onClick={nextDay}>
                    {' '}
                    chevron_right{' '}
                </div>
            </div>
        )
    }

    const renderCells = () => {
        let columns = [] as any

        for (let i = 4; i <= 27; i++) {
            if (i != 4) {
                columns.push(
                    <div className="border-l-2 border-black text-center text-black text-sm sm:text-base font-bold p-1 sm:p-2">
                        {' '}
                        {i % 24}:00{' '}
                    </div>
                )
            } else {
                columns.push(
                    <div className="text-center text-black text-sm sm:text-base font-bold p-1 sm:p-2">
                        {' '}
                        {i % 24}:00{' '}
                    </div>
                )
            }
        }

        return (
            <div className="flex flex-col flex-none max-h-screen mx-5 mt-5 bg-sky-100 ">
                <div className="grid grid-cols-24 overflow-y-auto overflow-x-hidden gap-x-0 gap-y-2 pb-1 grid-flow-row border border-black bg-darkgrey">
                    {columns}  
                    {renderShifts()}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-auto bg-white">
            {renderHeader()}
            {renderCells()}
        </div>
    )
}
