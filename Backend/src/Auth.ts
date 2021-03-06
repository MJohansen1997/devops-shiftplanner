import bcrypt from 'bcryptjs'
import MongoStore from 'connect-mongo'
import emailValidator from 'email-validator'
import core from 'express-serve-static-core'
import session from 'express-session'
import moment from 'moment'
import { Collection, MongoClient} from 'mongodb'
import {EmployeeDisplay, Shift, User} from './Types'

export type Request<TSession = any> = core.Request & {
    session?: Express.Request['session'] & {
        data?: TSession
    }
}

var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

export type RequestSession = Request<{ user: { id: string; role: boolean } }>

export const Auth = ({
    app,
    client,
    userColl,
}: {
    app: core.Express
    client: MongoClient
    userColl: Collection<User>
}) => {
    const passwordValidation = (props: { password?: string; confirmPassword?: string }) => {
        if (!props.password || props.password.length < 3) {
            return { success: false, errorMessage: 'Password is too short' }
        }

        if (!props.password || props.password.length > 32) {
            return { success: false, errorMessage: 'Password is too long' }
        }

        if (props.password !== props.confirmPassword) {
            return { success: false, errorMessage: 'Passwords do not match' }
        }

        return { success: true }
    }

    app.set('trust proxy', 1)

    app.use(
        session({
            secret: 'SomeRandomShit',
            resave: true,
            saveUninitialized: false,
            name: 'shiftplanner',
            store: MongoStore.create({ client, dbName: 'shiftplanner' }),
            ...(process.env.NODE_ENV === 'production' && { proxy: true }),
            cookie: {
                httpOnly: false,
                sameSite: 'lax',
                ...(process.env.NODE_ENV === 'production' && {
                    domain: '.devops.diplomportal.dk',
                    sameSite: 'none',
                    secure: true,
                }),
            },
        })
    )

    type IRegisterProps = {
        username: string
        password: string
        confirmPassword: string
        firstname: string
        lastname: string
        email: string
    }

    app.post('/api/random2', async (req: RequestSession, res) => {
        console.log('hellotherefriend2')
        res.send('hellotherefriend2')
    })

    app.get('/api/getEmployeesCheck', async (req: RequestSession, res) => {
        if (!req.session || !req.session.data) {
            return res.send({ success: false, errorMessage: 'Not logged in' })
        }

        const users = await userColl.find({}).toArray()

        const formattedEmployees: EmployeeDisplay[] = users.map(u => {
            return {
                firstname: u.firstname,
                lastname: u.lastname,
                email: u.email,
                jobposition: u.jobposition,
                phone: u.phone,
                avatar: u.avatar,
                birthday: u.birthday,
            }
        })

        res.send(formattedEmployees)
    })

    app.post('/api/registerFacebook', async (req: RequestSession, res) => {
        console.log("facebook login!")
        console.log(req.body.id)
        console.log(ID())
        let user = await userColl.findOne({facebook: req.body.id})
        console.log(user)
        if (!user) {
            await userColl.insertOne({
                username: ID(),
                password: ID(),
                facebook: req.body.id,
                email: req.body.email,
                firstname: req.body.first_name,
                lastname: req.body.last_name,
                createdDate: new Date(),
                role: false,
                jobposition: 'Employee',
                birthday: new Date(req.body.birthday),
                cpr: '',
                phone: '',
                shifts: [],
                newsFeed: [],
            })
            user = await userColl.findOne({facebook: req.body.id})
        }
        if (user == null)
            return res.send({success: false, errorMessage: "fuck dig din lille luder"})
        req.session!.cookie.expires = moment().add(6, 'hour').toDate()
        req.session!.data = {
            user: {
                id: user._id.toHexString(),
                role: user.role,
            },
        }
        console.log(req.session!.data)
        console.log(req.session!.data.user)
        return res.send({ success: true, data: req.session!.data.user })
    })

    app.post('/api/register', async (req: RequestSession, res) => {
        const args = req.body as Partial<IRegisterProps>

        if (req.session && req.session.data) {
            return res.send({success: false, errorMessage: 'Already logged in'})
        }

        if (!args.username || args.username.length < 3) {
            return res.send({success: false, errorMessage: 'Username is too short'})
        }

        if (args.username.length > 20) {
            return res.send({success: false, errorMessage: 'Username is too long'})
        }

        if (args.username.match(/[^-A-Za-z0-9._]/u)) {
            return res.send({success: false, errorMessage: 'Username contains invalid characters'})
        }

        const v = passwordValidation(args)

        if (!v.success) {
            return res.send(v)
        }

        if (!args.email || args.email.length < 4) {
            return res.send({success: false, errorMessage: 'Email is too short'})
        }

        //Suprise motherfucker
        if (!args.email || args.email.length > 64) {
            return res.send({success: false, errorMessage: 'Email is too long'})
        }

        // If you read this you gay
        if (!emailValidator.validate(args.email)) {
            return res.send({success: false, errorMessage: 'Email has an invalid format'})
        }

        if (await userColl.findOne({username: new RegExp(args.username, 'i')})) {
            return res.send({success: false, errorMessage: 'Username is already taken'})
        }

        if (await userColl.findOne({email: args.email})) {
            return res.send({success: false, errorMessage: 'Email is already taken'})
        }

        if (!args.password) {
            return res.send({success: false, errorMessage: 'No password supplied'})
        }

        const pw = await bcrypt.hash(args.password, 10)

        // TODO fix roller
        const roleTemp = true
        const birthdayTemp = null

        await userColl.insertOne({
            username: args.username,
            password: pw,
            email: args.email,
            firstname: args.firstname,
            lastname: args.lastname,
            createdDate: new Date(),
            role: false,
            jobposition: 'Employee',
            birthday: new Date(birthdayTemp || 0),
            cpr: '',
            phone: '',
            shifts: [],
            newsFeed: [],
        })

        res.send({ success: true })
    })

    app.post('/api/checkCookie', async (req: RequestSession, res) => {
        if (req.session && req.session.data) {
            return res.send({ success: true, data: req.session!.data.user })
        } else {
            console.log('Something is wrong')
        }
    })

    app.post('/api/login', async (req: RequestSession, res) => {
        if (req.session && req.session.data) {
            console.log('Now we in here')
            return res.send({ success: true, data: req.session!.data.user })
        }

        console.log('We do be in here')
        const authUser = await userColl.findOne({ username: new RegExp(req.body.username, 'i') })

        console.log(authUser)

        console.log(req.body.password)

        if (!authUser) {
            return res.send({ success: false, errorMessage: 'Invalid password' })
        }

        if (!bcrypt.compareSync(req.body.password, authUser.password)) {
            return res.send({ success: false, errorMessage: 'Invalid password' })
        }

        req.session!.cookie.expires = moment().add(6, 'hour').toDate()

        req.session!.data = {
            user: {
                id: authUser._id.toHexString(),
                role: authUser.role,
            },
        }

        console.log(req.session!.data)
        console.log(req.session!.data.user)
        return res.send({ success: true, data: req.session!.data.user })
    })

    app.post('/api/logout', async (req: Request, res) => {
        if (!req.session || !req.session.data) {
            return res.send({ success: false, errorMessage: 'Not logged in' })
        }

        await new Promise<void>(resolve => {
            req.session?.destroy(err => {
                if (err) {
                    console.warn('Error while destroying session', err)
                }

                resolve()
            })
        })

        req.session = undefined as any

        return res.send({ success: true })
    })
}
