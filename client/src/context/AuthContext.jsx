import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl, postRequest } from '../utils/services';

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [registerError, setRegisterError] = useState(null)
    const [registerLoading, setRegisterLoading] = useState(null)
    const [registerInfo, setRegisterInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)
    }, [])

    useEffect(() => {
        const user = localStorage.getItem("User")
        setUser(JSON.parse(user))
    }, []);
    const registerUser = useCallback(async (e) => {
        e.preventDefault()
        setRegisterLoading(true)
        setRegisterError(null)
        const response = await postRequest(`${baseUrl}/auth/reg`, JSON.stringify(registerInfo))
        setRegisterLoading(false)
        if (response.error) return setRegisterError(response)
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
    }, [registerInfo])

    return (<AuthContext.Provider value={{
        user, registerInfo, updateRegisterInfo, registerUser, registerError, registerLoading
    }} >
        {children}
    </AuthContext.Provider>)
} 