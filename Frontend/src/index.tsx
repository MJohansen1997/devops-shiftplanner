import * as ReactDOM from 'react-dom'
import UserContextProvider from './Context/UserContext'
import './index.css'
import { MainBody } from './MainBody'

ReactDOM.render(
    <UserContextProvider>
        <MainBody />
    </UserContextProvider>,
    document.getElementById('root')
)
