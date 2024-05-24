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
    const [loginError, setLoginError] = useState(null)
    const [loginLoading, setLoginLoading] = useState(null)
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)
    }, [])
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info)
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

    const loginUser = useCallback(async (e) => {
        e.preventDefault()
        setLoginError(null)
        setLoginLoading(true)
        const response = await postRequest(`${baseUrl}/auth/login`, JSON.stringify(loginInfo))
        setLoginLoading(false)
        if (response.error) return setLoginError(response)
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
    }, [loginInfo])

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User")
        setUser(null)
    }, [])

    return (<AuthContext.Provider value={{
        user,
        registerInfo, updateRegisterInfo, registerUser, registerError, registerLoading,
        logoutUser,
        loginError, loginLoading, loginInfo, loginUser, updateLoginInfo
    }} >
        {children}
    </AuthContext.Provider>)
} 