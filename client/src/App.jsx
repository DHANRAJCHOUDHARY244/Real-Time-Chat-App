import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap'
import NavBar from './components/NavBar';
function App() {
    return (<>
    <NavBar/>
        <Container className='text-secondary' >
            <Routes>
                <Route path='/' element={<Chat />} />
                <Route path='/login' element={<Login />} />
                <Route path='/reg' element={<Register />} />
                <Route path='*' element={<Navigate to={"/"} />} />
            </Routes>
        </Container>
    </>)
}

export default App
