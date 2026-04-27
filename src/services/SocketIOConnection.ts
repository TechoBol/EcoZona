import io from 'socket.io-client'

const socket = io(`${import.meta.env.VITE_API_WITHOUT_API}`)

export default socket
