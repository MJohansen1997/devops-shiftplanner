import {useTable, usePagination} from 'react-table'
import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router'
import { EmployeeDisplay } from '../../../../Backend/src/Types'
import {data} from './Table_Component'

import {Button, PageButton} from "./Table_Button.js";
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid'
import Axios from "axios";
import { TableOptions } from "../../react-table-config";



export const EmployeeTable = () => {

    const columns = React.useMemo(
        () => [
            {
                Header: "Image",
                accessor: "image",
                Cell: props => (
                    <img
                        src={props.row.original.image}
                        width={60}
                        alt='Employee'
                    />
                )
            },
            {
                Header: "Name",
                accessor: "username",
            },
            {
                Header: "Birthday",
                accessor: "bday",
            },
            {
                Header: "Job-Position",
                accessor: "jobposition",
            },
            {
                Header: "Phone",
                accessor: "phone",
            },
            {
                Header: "Mail",
                accessor: "mail",
            },
        ],
        []
    )

    /*const data = React.useMemo(
        () => [
            {
                image:"https://freesvg.org/img/abstract-user-flat-4.png",
                username: 'Brin',
                bday: 26,
                jobposition: 'din mor',
                phone: '12345678',
                mail: ' email@email.com'
            }, {
                image: "https://freesvg.org/img/abstract-user-flat-4.png",
                username: 'Jac',
                bday: 22,
                jobposition: 'din mor',
                phone: '12345678',
                mail: ' email@email.com'
            }, {
                image: "https://freesvg.org/img/abstract-user-flat-4.png",
                username: 'Mik',
                bday: 40,
                jobposition: 'din mor',
                phone: '12345678',
                mail: ' email@email.com'
            }, {
                image: "https://freesvg.org/img/abstract-user-flat-4.png",
                username: 'Stef',
                bday: 30,
                jobposition: 'din mor',
                phone: '12345678',
                mail: ' email@email.com'
            }, {
                image: "https://freesvg.org/img/abstract-user-flat-4.png",
                username: 'Shan',
                bday: 32,
                jobposition: 'din mor',
                phone: '12345678',
                mail: ' email@email.com'
            }, {
                image: "https://freesvg.org/img/abstract-user-flat-4.png",
                username: 'yieks',
                bday: 37,
                jobposition: 'din mor',
                phone: '12345678',
                mail: ' email@email.com'
            },
        ],
        []
    )*/


    const [data, setData] = useState<EmployeeDisplay[]>([])

    const getAllUsers = async () => {
        const result = (
            await Axios.get('/api/getEmployees', { withCredentials: true })
        ).data

        setData(result)
        console.log(result)
    }
    const getAvatar = (image: Buffer) => {
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

    const tableInstance = useTable({columns, data},usePagination)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,

        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state,
    } = tableInstance

    return (
        <div className="bg-lightSecondary dark:bg-primary text-white px-8 py-8 m-10">
            <p>Tilføj medarbejder</p>
            <p>Fjern medarbejder</p>
            <div className="sm:flex sm:gap-x-2">
                {headerGroups.map((headerGroup) =>
                    headerGroup.headers.map((column) =>
                        column.Filter ? (
                            <div className="mt-2 sm:mt-0" key={column.id}>
                                {column.render("Filter")}
                            </div>
                        ) : null
                    )
                )}
            </div>
            <table className="rounded border border-black" {...getTableProps()}>
                <thead className="bg-lightPrimary dark:bg-secondary">
                {// Loop over the header rows
                    headerGroups.map(headerGroup => (
                        // Apply the header row props
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {// Loop over the headers in each row
                                headerGroup.headers.map(column => (
                                    // Apply the header cell props
                                    <th className=" px-24 py-3 text-white" {...column.getHeaderProps()}>
                                        {// Render the header
                                            column.render('Header')}
                                    </th>
                                ))}
                        </tr>
                    ))}
                </thead>
                {/* Apply the table body props */}
                <tbody className="divide-y bg-lightgrey" {...getTableBodyProps()}>
                {// Loop over the table rows
                    // while using page, insted of rows
                    // it shows only the rows for the active page - the amount of rows is a page
                    page.map(row => {
                        // Prepare the row for display
                        prepareRow(row)
                        return (
                            // Apply the row props
                            <tr className="text-center" {...row.getRowProps()}>
                                {// Loop over the rows cells
                                    row.cells.map(cell => {
                                        // Apply the cell props
                                        return (
                                            /*<td className="p-4" {...cell.getCellProps()}>
                                                {// Render the cell contents
                                                    cell.render('Cell')}
                                            </td>*/

                                            data.map(d => {
                                                return(
                                                    <>
                                                        {/*<td>{getAvatar(d.avatar)}</td>*/}
                                                        <td>{cell.render(d.firstname)}</td>
                                                        {/*<td>{cell.render(d.birthday)}</td>*/}
                                                        <td>{cell.render(d.jobposition)}</td>
                                                        <td>{cell.render(d.phone)}</td>
                                                        <td>{cell.render(d.email)}</td>
                                                    </>
                                            )
                                            })
                                        )
                                    })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>



            {/* Pagination */}
            <div className="py-3 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                    {/*Is showed then the there is a small window width*/}
                    <Button className="" onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
                    <Button  className="" onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex gap-x-2 items-baseline">
                        <span className="text-sm text-white">
                            {/*Page x out of y*/}
                            Page <span className="font-medium">{state.pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
                        </span>
                        <label>
                            {/*amount of listed employees*/}
                            <span className="sr-only">Items Per Page</span>
                            <select
                                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={state.pageSize}
                                onChange={e => {
                                    setPageSize(Number(e.target.value))
                                }}
                            >
                                {[5, 10, 20, 50, 100].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <PageButton
                                className="rounded-l-md"
                                onClick={() => gotoPage(0)}
                                disabled={!canPreviousPage}
                            >
                                {/*To the first page - dobbelt left arrow*/}
                                <span className="sr-only">First</span>
                                <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </PageButton>
                            <PageButton
                                className=""
                                onClick={() => previousPage()}
                                disabled={!canPreviousPage}
                            >
                                {/*Go one page back - one left arrow*/}
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </PageButton>
                            <PageButton
                                className=""
                                onClick={() => nextPage()}
                                disabled={!canNextPage
                                }>
                                {/*Go one page forward - one right arrow*/}
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </PageButton>
                            <PageButton
                                className="rounded-r-md"
                                onClick={() => gotoPage(pageCount - 1)}
                                disabled={!canNextPage}
                            >
                                {/*Go to last page - dobbel right arrow*/}
                                <span className="sr-only">Last</span>
                                <ChevronDoubleRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </PageButton>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}