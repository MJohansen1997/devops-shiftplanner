import { ObjectId } from 'mongodb'

export type DbSettings = {
    username: string
    password: string
    host: string
    port: string
}

export type authUser = {
    id: string
    role: boolean
    loggedOn: boolean
}

export type company = {
    listOfUsers: User[]
    companyId: string
    companyName: string
    companyLogo: Buffer
}

export type IRegisterProps = {
    username: string
    password: string
    confirmPassword: string
    firstname: string
    lastname: string
    email: string
}

export type User = {
    _id: ObjectId
    username: string
    password: string
    email: string
    role: boolean
    jobposition?: string
    avatar?: Buffer
    birthday?: Date
    firstname?: string
    lastname?: string
    cpr?: string
    phone?: string
    contract?: Contract
    shifts?: Shift[]
    newsFeed?: newsFeed[]
    createdDate: Date
}

export type EmployeeDisplay = {
    firstname?: string
    lastname?: string
    email: string
    jobposition?: string
    phone?: string
    avatar?: Buffer
    birthday?: Date
}

export type Shift = {
    startTime: Date
    endTime: Date
    date: Date
    role: string
    sickLeave?: boolean
    description?: string
}

export type newsFeed = {
    messageId: string
    description: string
    date: Date
}

type Contract = {
    hours: number
    role: string
    department: string
}

export type IFruitData = {
    name: string
    origin: string
    price: number
}

export type CalendarDay = {
    name: string
    startHour: number
    hour: number
}
