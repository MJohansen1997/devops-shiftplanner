import bcrypt from 'bcryptjs'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { connect, ObjectId } from 'mongodb'
import multer from 'multer'
import { Auth, RequestSession } from './Auth'
import { authUser, DbSettings, EmployeeDisplay, IFruitData, User } from './Types'

export const Server = async () => {
    const rootDir = 'public'

    const upload = multer({
        storage: multer.diskStorage({}),
        limits: {
            fileSize: 200000000,
        },
    })

    const app = express()

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

    //if (process.env.NODE_ENV === 'production') {
    //app.use(express.static(rootDir))
    // } else {
    app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
    // }

    const dbSettings: DbSettings = {
        username: 'admin',
        password: '8m9SqwY234',
        host: '130.225.170.205',
        port: '27017',
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

    app.post('/api/random', async (req: RequestSession, res) => {
        console.log('hellotherefriend')
        res.send('hellotherefriend')
    })

    app.post('/api/login', async (req, res) => {
        console.log(req.body)
        const authUser = await userColl.findOne({ username: new RegExp(req.body.username, 'i') })

        console.log(authUser)

        console.log(req.body.password)

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
    app.get('/api/getUsersForDay', async (req, res) => {
        const users = await userColl.find(req).toArray()
        res.send(users)
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
        const users = await userColl.find({"shifts.date": {$regex : "2021-11"}}).toArray()
        // const users = await userColl.find({"shifts.date": {$regex : req}}).toArray()
        res.send(users)
    })

    app.get('/api', async (req, res) => {
        console.log('hello world')
        res.send('hi')
    })

    Auth({ app, client, userColl })
    const port = process.env.NODE_ENV || 8080

    app.listen(port, () => console.log(`Listening on port ${port}!`))
}

Server()
