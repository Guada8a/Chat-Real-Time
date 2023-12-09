import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io("/");

// Agrega una etiqueta de audio con la URL del sonido que deseas reproducir
const notificationSound = new Audio('../src/assets/notification.mp3'); 

function App() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
    const [playSound, setPlaySound] = useState(false);

    const toggleSound = () => {
        setPlaySound(!playSound);
    };

    const getTime = () => {
        const date = new Date();
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        return `${hours}:${minutes}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newMessage = {
            body: message,
            from: 'Yo',
            time: getTime()
        };

        setMessages([...messages, newMessage]);
        socket.emit('message', message);

        setMessage('');
        // Scroll down
        const messagesDiv = document.getElementById('messages');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Hide welcome message after the first message is sent
        setShowWelcomeMessage(false);
    }

    useEffect(() => {
        // Reproduce el sonido al recibir un mensaje
        if (playSound) {
            notificationSound.play();
            setPlaySound(false);
        }
        socket.on('message', receiveMessage);

        return () => {
            socket.off('message', receiveMessage);
        };
    }, [playSound]);

    const receiveMessage = (message) => {
        setMessages(state => [...state, message]);
        // Reproduce el sonido al recibir un mensaje
        setPlaySound(true);

        // Hide welcome message after receiving a message
        setShowWelcomeMessage(false);
    };

    return (
        <div className='h-screen bg-zinc-800 text-white flex items-center justify-center'>
            <form onSubmit={handleSubmit} className='bg-zinc-900 p-10 rounded-3xl h-4/6 w-1/2'>
                <h1 className='text-3xl text-center mb-10'><span className='bg-green-700 rounded px-2 font-bold'> WebSOCK</span> Chat</h1>
                <div id="messages" className='overflow-auto h-4/6'>
                    {showWelcomeMessage && (
                        <div className="my-auto w-1/2 mx-auto p-2 rounded-md bg-indigo-950 text-center bg-opacity-90 backdrop-blur-10 shadow-lg">
                            <span className='text-sm'>¡Bienvenido! Esta es tu primera vez aquí.</span>
                        </div>
                    )}
                    {messages.map((message, i) => (
                        <li key={i} className={`my-2 p-2 table rounded-md ${message.from === 'Yo' ? 'bg-slate-700 ml-auto' : 'bg-black '}`}>
                            <span className='text-xs text-slate-500 block'>{message.from}</span>
                            <span className='text-sm'>{message.body}</span>
                            <span className='text-xs text-slate-500 block text-right'>{message.time}</span>
                        </li>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Type your message..."
                    className='border-2 border-zinc-500 p-2 w-full bg-transparent rounded-xl mb-2'
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                />
            </form>
        </div>
    );
}

export default App;
