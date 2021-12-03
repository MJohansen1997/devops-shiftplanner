import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    getISODay,
    getISOWeek,
    isSameDay,
    isSameMonth,
    parseISO,
    startOfMonth,
    startOfWeek,
} from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import './Calendar_View__Month.css'
import { ShiftComponent } from './Calender_Shift_Component'
import Axios from 'axios'
import {RegisterShiftForm} from "../../../RegisterForm/RegisterShift.tsx";
import {DeleteShiftForm} from "../../../RegisterForm/DeleteShift.tsx";


export const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const history = useHistory()

    const [workingUsers, setWorkingUsers] = useState([])
    /*const [shifts, setShifts] = useState([
        { name: 'Shania', timeStart: '08:00', timeEnd: '16:00', date: new Date() },
        { name: 'Mikkel', timeStart: '10:00', timeEnd: '14:00', date: addDays(new Date(), -1) },
        { name: 'Mads', timeStart: '??:??', timeEnd: '??:??', date: new Date() },
        { name: 'Jacob', timeStart: '09:00', timeEnd: '16:00', date: addDays(new Date(), -3) },
    ])
    */
    useEffect(() => {
        Axios({
            method: 'post',
            url: `${process.env.REACT_APP_URL}/api/getUsersForMonth`,
            data: {
                "date": format(currentMonth, 'yyyy-MM'),
                "datep1": format(addMonths(currentMonth, 1), 'yyyy-MM'),
                "datem1": format(addMonths(currentMonth, -1), 'yyyy-MM')
            }
        }).then((response) => {
            setWorkingUsers(response.data);
        }).finally(() => {
        });
    }, [currentMonth])


    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1))
    }

    const prevMonth = () => {
        setCurrentMonth(addMonths(currentMonth, -1))
    }

    const [isOpen, setIsOpen] = useState(false)
    const togglePop = () => {
        setIsOpen(!isOpen)
    }

    const renderHeader = () => {
        const dateFormat = 'LLLL yyyy'
        return (
            <div className="header">
                <div className="grid-cols-2 divide-x-2">
                    <button className="text-black " onClick={togglePop}>
                        {' '}
                        Opret vagt{' '}
                    </button>
                    {isOpen && <RegisterShiftForm popValues={{ isOpen, setIsOpen }} />}
                    {/*<button className="text-black " onClick={togglePop}>*/}
                    {/*    {' '}*/}
                    {/*    Slet vagt{' '}*/}
                    {/*</button>*/}
                    {/*{isOpen && <DeleteShiftForm popValues={{ isOpen, setIsOpen }} />}*/}
                </div>

                <div className="icon cursor-pointer ml-5" onClick={prevMonth}>
                    {' '}
                    chevron_left{' '}
                </div>
                <span className=""> {format(currentMonth, dateFormat)} </span>
                <div className="icon cursor-pointer" onClick={nextMonth}>
                    {' '}
                    chevron_right{' '}
                </div>
            </div>
        )
    }

    const renderDays = () => {
        const dateFormat = 'EEE'
        const days = []

        let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 })
        days.push(<div className="border-filler" className={`h-full w-5`}></div>)
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col text-center box-content" key={i}>
                    {format(addDays(startDate, i % 7), dateFormat)}
                </div>
            )
        }
        return (
            <div className="days flex flex-wrap flex-row w-full uppercase font-normal text-base border divide-x">
                {days}
            </div>
        )
    }

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

        const dateFormat = 'd'
        const rows = []

        let days = []
        let day = startDate
        let formattedDate = ''

        while (day <= endDate) {
            //Inserting a collumn with the week numer first.
            days.push(
                <div className={`flex flex-col justify-end h-40 w-5`}>
                    <div className="font-bold">{getISOWeek(day)}</div>
                </div>
            )
            //then we insert the days.
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat)
                days.push(
                    <div
                        className={`col cell ${!isSameMonth(day, monthStart) ? 'disabled' : ''}`}
                        key={day}
                        // onClick={() => history.push('/calendarDay')}
                    >
                        <div className="number font-bold float-right pr-3 pt-3 text-xs ">{formattedDate}</div>
                        <Link to={`/calendarDay/${format(day, 'yyyy-MM-dd')}`}>
                            <div className="clear-right overflow-y-auto h-32 text-base disable-scrollbars">
                                {workingUsers.map(({ firstname, shifts }) =>
                                    <ul>
                                        {shifts.map(({ date, startTime, endTime }) =>
                                        // Link for routing to day page
                                        isSameDay(day, parseISO(date)) ? (
                                            <li className={'float-left'}>
                                                    <ShiftComponent name={firstname} timeStart={startTime} timeEnd={endTime} />
                                                {' '}
                                            </li>
                                        ) : (
                                            <li className='false'/>
                                        )
                                    )}
                                    </ul>
                                )}
                            </div>
                        </Link>
                    </div>
                )
                day = addDays(day, 1)
            }
            rows.push(
                <div className="row" key={day}>
                    {days}
                </div>
            )
            days = []
        }
        return <div className="body">{rows}</div>
    }

    return (
        <main className="calendar p-5 leading-none">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </main>
    )
}
