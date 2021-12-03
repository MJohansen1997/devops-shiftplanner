import Axios from 'axios'
import { addDays, format } from 'date-fns'
import { UserDayShift } from '../../../../../../Backend/src/Types'
import { useParams } from "react-router-dom";
import React, { useEffect, useState} from 'react'

export const CalendarDay: React.FC = () => {
    const [currentDay, setCurrentDay] = useState(new Date())
    const [hover, setHover] = useState(false)
    const [shifts, setShifts] = useState<UserDayShift[] | undefined>([])
    const [isLoading, setLoading] = useState(true)


    const { date } = useParams();
    
    const getShifts = async () => {
        // console.log('before get')
        try {
            const result = (await Axios.post<UserDayShift[]>('http://localhost:8080/api/fetchUsersShift', { date: date }, { withCredentials: true })).data
            setShifts(result)
            setLoading(false)
            
            
            
            
            console.log('printing result of fetch of users\n')
            console.log(result)
        } catch (e) {
            console.log('couldnt fetch user shifts: ' + e)
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
    
    // if(!shifts) {
    //     // console.log("ikke loadet endnu: " + shifts)
    //     return <span data-testid="loading"> Loading elements.. </span>
    // }

    const renderHeader = () => {
        const dateFormat = 'B..BBB'
        return (
            <div className=" max-wheader bg-sky-800 text-black font-bold">
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

        for (let i = 0; i < 24; i++) {
            columns.push(
                <div className="text-center text-black text-sm sm:text-base font-bold p-1 sm:p-2" key={`tid celle ${i}`}> {i % 24}:00 </div>
            )
        }

        return (
            <div className="flex flex-col max-h-screen mx-5 mt-5" >
                {renderHeader()}
                <div className="grid grid-cols-24 grid-flow-auto divide-x-2 divide-sky-800 overflow-x-hidden overflow-y-auto gap-x-0 gap-y-2 pb-1  border border-black bg-gray-200 justify-center" data-testid="grid" key="grid">
                    {columns}
                    {console.log("logging shifts before map : " + JSON.stringify(shifts) + " & " + isLoading)}
                    { !isLoading ? (
                        shifts.map(({ firstname, email, shift }) => {
                            return shift.map(({ startTime, endTime }, index) => {
                                console.log("MAPPING OVER SHIFT: " + startTime + " & " + endTime)
                                return (
                                    <>
                                        <div
                                            className={`flex flex-col border-2 border-black col-start-${ startTime + 1} col-span-${endTime - startTime} col-end-${endTime} p-1 bg-sky-200 hover:bg-sky-400 text-black font-bold justify-center items-center `}
                                            key={`index${index}`}
                                            data-testid="resolvedshifts">
                                                
                                                <p className="flex w-full text-sm" key={`child1-${index}`}> {firstname} </p>
                                                <p className="flex w-full text-sm" key={`child2-${index}`}> {email} </p>
                                                
                                        </div>
                                        <div className="span-1"></div>
                                    </>
                                )
                            })
                        })) : (<div className="flex" data-testid="loading"> Loading elements.. </div>)
                    }
                </div>
            </div>
        )
    }

    
    return <div className="flex flex-col flex-none bg-white"> {renderCells()} </div>
}
