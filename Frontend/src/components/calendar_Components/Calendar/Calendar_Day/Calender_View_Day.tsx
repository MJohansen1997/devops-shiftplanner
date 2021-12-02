import Axios from 'axios'
import { addDays, format } from 'date-fns'
import { UserDayShift } from '../../../../../../Backend/src/Types'
import React, { useEffect, useState } from 'react'
export const CalendarDay = props => {
    const [currentDay, setCurrentDay] = useState(new Date())
    const [hover, setHover] = useState(false)
    const [shifts, setShifts] = useState<UserDayShift[]>([])

    const getShifts = async () => {
        console.log('before get')
        try {
            const result = (
                await Axios.post<[]>(
                    'http://localhost:8080/api/fetchUsersShift',
                    { date: props.date },
                    { withCredentials: true }
                )
            ).data
            setShifts(result)
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

    const renderHeader = () => {
        const dateFormat = 'B..BBB'
        return (
            <div className="header bg-sky-800 text-black font-bold">
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
                <div className="text-center text-black text-sm sm:text-base font-bold p-1 sm:p-2"> {i % 24}:00 </div>
            )
        }

        return (
            <div className="flex flex-col max-h-screen mx-5 mt-5">
                {renderHeader()}
                <div className="grid grid-cols-24 grid-flow-auto divide-x-2 divide-sky-800 overflow-x-hidden overflow-y-auto gap-x-0 gap-y-2 pb-1  border border-black bg-gray-200 justify-center">
                    {columns}
                    {shifts ? (
                        shifts.map(({ firstname, email, shift }) => {
                            return shift.map(({ startTime, endTime }, index) => {
                                return (
                                    <>
                                        <div
                                            className={`flex flex-col border-2 border-black col-start-${
                                                startTime + 1
                                            } col-span-${
                                                endTime - startTime
                                            } col-end-${endTime} p-1 bg-sky-200 hover:bg-sky-400 text-black font-bold justify-center items-center `}
                                            key={index}
                                        >
                                            <p className="flex w-full text-sm"> {firstname} </p>
                                            <p className="flex w-full text-sm"> {email} </p>
                                        </div>
                                        <div className="span-1"></div>
                                    </>
                                )
                            })
                        })
                    ) : (
                        <div> Loading elements.. </div>
                    )}
                </div>
            </div>
        )
    }

    return <div className="flex flex-col flex-none bg-white">{renderCells()}</div>
}
