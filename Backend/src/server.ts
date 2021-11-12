import cors from 'cors'
import express from 'express'
import { connect } from 'mongodb'
import multer from 'multer'
import { Auth, RequestSession } from './Auth'
import { DbSettings, EmployeeDisplay, IFruitData, User } from './Types'

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

    //if (process.env.NODE_ENV === 'production') {
    app.use(express.static(rootDir))
    // } else {
    app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
    // }

    const dbSettings: DbSettings = {
        username: 'root',
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

    app.get('/fruit', async (req, res) => {
        const fruits: IFruitData[] = await fruitsColl.find({}).toArray()
        console.log(fruits)
        res.send(fruits)
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

    app.post('/createUser/uploadAvatar', upload.any(), async (req: RequestSession, res) => {
        const files = req.files as unknown as { [x: string]: Express.Multer.File }

        if (!req.session || !req.session.data) {
            return res.send({ success: false, errorMessage: 'Not logged in' })
        }

        await userColl.updateOne({ _id: req.session.data!.user.id }, { avatar: files.avatar.buffer })
    })

    // Fetching all users for a specific date to use for the frontend calendar day view.
    app.get('/fetchUsersForDay', async (req, res) => {
        const users = await userColl.find(req).toArray()
        res.send(users)
    })

    Auth({ app, client, userColl })

    const port = process.env.NODE_ENV || 8080

    app.listen(port, () => console.log(`Listening on port ${port}!`))
}

Server()
