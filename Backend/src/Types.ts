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
    facebook?: string
    email: string
    role: boolean
    jobposition?: string
    avatar?: Buffer
    birthday?: Date
    firstname?: string
    address?: string
    lastname?: string
    cpr?: string
    phone?: string
    contract?: Contract
    shifts?: Shift[]
    newsFeed?: newsFeed[]
    createdDate: Date
}

export type EmployeeDisplay = {
    username?: string
    password?: string
    firstname?: string
    lastname?: string
    email: string
    jobposition?: string
    phone?: string
    address?: string
    avatar?: Buffer
    birthday?: Date
    role?: string
    createdDate?: Date
}

export type UserDayShift = {
    firstname?: string
    email: string
    shift?: Shift[]
    avatar?: Buffer
}

export type Shift = {
    _id?: ObjectId
    date: Date
    startTime: number
    endTime: number
    role?: string
    sickLeave?: boolean
    description?: string
}

export type IShift = {
    username: string
    date: Date
    startTime: number
    endTime: number
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
