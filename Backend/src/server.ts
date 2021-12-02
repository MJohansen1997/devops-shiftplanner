import bcrypt from 'bcryptjs'
import cors from 'cors'
import express from 'express'
import { connect, ObjectId } from 'mongodb'
import multer from 'multer'
import { Auth, RequestSession } from './Auth'
import { authUser, DbSettings, EmployeeDisplay, IFruitData, User, Shift, UserDayShift} from './Types'

require('dotenv').config()
export const Server = async () => {
    const rootDir = 'public'

    const upload = multer({
        storage: multer.diskStorage({}),
        limits: {
            fileSize: 200000000,
        },
    })

    const app = express()

    if (process.env.NODE_ENV === 'production') {
        console.log('Whats popping prod')
    }

    if (process.env.NODE_ENV === 'development') {
        console.log('Whats popping develop')
    }

    app.disable('x-powered-by')

    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(err)
            res.status(err.status || 500)
            res.send(err)
        } else {
            res.sendStatus(err.status || 500)
        }
    })

    app.use(express.json())
    //app.use(bodyParser.json())

    const portie = parseInt(process.env.PORT as string)

    if (process.env.NODE_ENV === 'production') {
        app.use(cors({ credentials: true, origin: `${process.env.CORSVALUE_PROD}` }))
    } else {
        app.use(cors({ credentials: true, origin: `${process.env.CORSVALUE_DEV}` }))
    }

    const dbSettings: DbSettings = {
        username: `${process.env.USERNAMEDB}`,
        password: `${process.env.PASSWORD}`,
        host: `${process.env.HOST}`,
        port: `${process.env.PORT}`,
    }

    const client = await connect(
        `mongodb://${dbSettings.username}:${dbSettings.password}@${dbSettings.host}:${dbSettings.port}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )

    const fruitsColl = client.db('fruit').collection<IFruitData>('fruits')
    const userColl = client.db('shiftplanner').collection<User>('user')
    const shiftColl = client.db('shiftplanner').collection<Shift>('shifts')

    app.post('/api/random', async (req: RequestSession, res) => {
        res.send('hellotherefriend')
    })

    app.post('/api/login', async (req, res) => {
        const authUser = await userColl.findOne({ username: new RegExp(req.body.username, 'i') })

        if (!authUser) {
            return res.send({ success: false, errorMessage: 'Invalid password' })
        }

        if (!bcrypt.compareSync(req.body.password, authUser.password)) {
            return res.send({ success: false, errorMessage: 'Invalid password' })
        }

        //req.session!.cookie.expires = moment().add(6, 'hour').toDate()

        const user = {
            id: authUser._id.toHexString(),
            role: authUser.role,
        }

        return res.send({ success: true, data: user })
    })

    app.get('/api/getEmployees', async (req: RequestSession, res) => {
        // if (!req.session || !req.session.data) {
        //     return res.send({ success: false, errorMessage: 'Not logged in' })
        // }

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

    app.post('/api/createUser/uploadAvatar', upload.any(), async (req: RequestSession, res) => {
        const files = req.files as unknown as { [x: string]: Express.Multer.File }

        if (!req.session || !req.session.data) {
            return res.send({ success: false, errorMessage: 'Not logged in' })
        }

        await userColl.updateOne({ _id: req.session.data!.user.id }, { avatar: files.avatar.buffer })
    })

    // Fetching all users for a specific date to use for the frontend calendar day view.
    // REQ = DATE
    app.post('/api/fetchUsersShift', async (req, res) => {
        console.log("PRINTING REQ BODY: " + req.body.date)
        // get a shift
        const users = await userColl.find({shifts: {$elemMatch: {date: req.body.date}}}).toArray();
        const shiftss = await shiftColl.find({date: req.body.date}).toArray()
        console.log("FETCH USERS: " + users)

        const filteredUsers = users.filter((item) =>
            item.shifts?.filter(f =>
                f.date == req.body.date
            )
        )

        console.log("FILTERED USERS: " + JSON.stringify(filteredUsers))

        // Format the users from mongod to the desired user shift information
        const userShifts: UserDayShift[] = filteredUsers.map(s => {
            return {
                firstname: s.firstname,
                email: s.email,
                shift: s.shifts
            }
        })

        // console.log("\nUSERSHIFTS: " + userShifts)

        res.send(userShifts)
    })

    app.post('/api/getOneUser', async (req: RequestSession, res) => {
        const args = req.body as Partial<authUser>

        const user = await userColl.findOne({ _id: ObjectId(args.id) })

        if (!user) {
            return res.send({ success: false, errorMessage: 'Something went wrong retrieving your profile' })
        }

        const formattedProfile: EmployeeDisplay = {
            username: user.username,
            password: user.password,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            jobposition: user.jobposition,
            phone: user.phone,
            avatar: user.avatar,
            birthday: user.birthday,
            address: user.address,
            createdDate: user.createdDate,
        }
        res.send(formattedProfile)
    })

    app.post('/api/getUsersForMonth', async (req, res) => {
        const users = await userColl.find({ $or : [{"shifts.date": {$regex : req.body.date}}, {"shifts.date": {$regex : req.body.datep1}}, {"shifts.date": {$regex : req.body.datem1}}]}).toArray()
        res.send(users)
    })

    app.get('/api', async (req, res) => {
        console.log('hello world')
        res.send('hi')
    })

    Auth({ app, client, userColl })
    const port = 8080

    app.listen(port, () => console.log(`Listening on port ${port}!`))
}

Server()
