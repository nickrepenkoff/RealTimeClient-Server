import React, {useRef} from 'react';
import {useEffect, useState} from "react";
import axios from "axios";

const WebSockets = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const [connected, setConnected] = useState(false); 
    const [username, setUsername] = useState('');
    const socket = useRef()

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prevState => [message, ...prevState])
        }
        socket.current.onerror = () => {
            console.log('Socket error')
        }
        socket.current.onclose = () => {
            console.log('Socket has been closed')
        }
    }
    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if(!connected){
        return(
            <div className='center'>
                <div className="form">
                    <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder='Type your name'/>
                    <button onClick={connect}>Sign in</button>
                </div>
            </div>
        )
    }

    return (
        <div className='center'>
            <div>
                <div className="form">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(mes => (
                        <div key={mes.id}>
                            {mes.event === 'connection'
                                ? <div className='connection_message'>User {mes.username} has connected</div>
                                : <div className='message'>{mes.username}: {mes.message}</div>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WebSockets;
