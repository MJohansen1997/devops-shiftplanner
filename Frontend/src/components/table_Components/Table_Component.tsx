import React, { useState, useEffect } from 'react'
import {User, EmployeeDisplay} from "../../../../Backend/src/Types";

export const data = () => {

    let firstname = EmployeeDisplay.firstname
    const [data, setData] = useState<EmployeeDisplay[]>([])


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

    const data = React.useMemo(
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
    )

}