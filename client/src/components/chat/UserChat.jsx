import { useFetchRecipient } from '../../hooks/useFetchRecipent'
import { Stack } from 'react-bootstrap'
import avatar from '../../assets/avatar.svg'
export const UserChat = ({ chat, user }) => {
    const { recipientUser, error } = useFetchRecipient(chat, user)
    return (
        <Stack direction='horizontal' gap={3} className='user-card align-items-center p-2 justify-content-between'
            role='button'>
            <div className='d-flex'>
                <div className='me-2'>
                    <img src={avatar} height={'35px'} />
                </div>
                <div className='text-content'>
                    <div className='name'>{recipientUser?.name}</div>
                    <div className='text'>Text Message</div>
                </div>
            </div>
            <div className='d-flex flex-column align-align-items-end'>
                <div className='date'>
                    12/04/2024
                </div>
                <div className='this-user-notifications'>
                    2
                </div>
                <span className='user-online'></span>
            </div>
        </Stack>
    )
}
