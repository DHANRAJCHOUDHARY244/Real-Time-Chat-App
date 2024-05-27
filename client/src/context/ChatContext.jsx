import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl, getRequest, postRequest } from '../utils/services';
import { io } from 'socket.io-client'

export const ChatContext = createContext()

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)
    const [potentialChats, setPotentialChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [isMessagesLoading, setIsMessagesLoading] = useState(false)
    const [messagesError, setMessagesError] = useState(null)
    const [sendTextMessageError, setSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    console.log(onlineUsers, 'onlineUsers');

    useEffect(() => {
        const newSocket = io('http://localhost:3000')
        setSocket(newSocket)
        return () => { newSocket.disconnect() }
    }, [user])

    useEffect(() => {
        if (socket === null) return
        socket.emit('addNewUser', user?._id)
        socket.on('getOnlineUsers', (users) => setOnlineUsers(users))
    }, [socket])
    useEffect(() => {
        const getUser = async () => {
            const response = await getRequest(`${baseUrl}/auth`)
            if (response.error) console.log("Error fetching user data", response);
            const pChats = response.data.filter(u => {
                let isChatCreated = false
                if (user?._id === u._id) return false
                if (userChats) {
                    isChatCreated = userChats?.some(chats => { return chats.members[0] === u._id || chats.members[1] === u._id })
                }
                return !isChatCreated
            })
            setPotentialChats(pChats)
        }
        getUser()
    }, [])

    useEffect(() => {
        const getUserChat = async () => {
            if (user?._id) {
                setIsUserChatsLoading(true)
                setUserChatsError(null)
                const response = await getRequest(`${baseUrl}/chat/${user?._id}`)
                setIsUserChatsLoading(false)
                if (response.error) {
                    return setUserChatsError(response)
                }
                setUserChats(response)
            }
        }
        getUserChat()
    }, [user])

    useEffect(() => {
        const getMessages = async () => {
            setIsMessagesLoading(true)
            setMessagesError(null)
            const response = await getRequest(`${baseUrl}/message/${currentChat?._id}`)
            setIsMessagesLoading(false)
            if (response.error) {
                return setMessagesError(response)
            }
            setMessages(response)
        }
        getMessages()
    }, [currentChat])

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log('No message to send');
        const response = await postRequest(`${baseUrl}/message`,
            JSON.stringify
                ({
                    text: textMessage,
                    senderId: sender._id,
                    chatId: currentChatId
                }))
        if (response.error) return setSendTextMessageError(response)
        setNewMessage(response)
        setMessages((prev) => [...prev, response])
        setTextMessage("")
    }, [])

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    }, [])

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chat`, JSON.stringify({
            firstId, secondId
        }))
        if (response.error) return console.log("Error creating chat", response);
        console.log(response, "Chat created");
        setUserChats((prev) => [...prev, response])
    }, [])

    return (
        <ChatContext.Provider
            value={
                {
                    userChats, isUserChatsLoading,
                    userChatsError, potentialChats,
                    createChat, updateCurrentChat, currentChat,
                    messages, isMessagesLoading, messagesError,
                    sendTextMessage
                }
            }
        >
            {children}
        </ChatContext.Provider>
    )
}