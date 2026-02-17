import { useEffect } from "react";
import { LoginForm } from "../../features/LoginForm";
import { useAuth } from "../../hooks/useAuth";
import { io } from "socket.io-client";

export function TestingPage() {
  const { player, isAuthenticated, logout, activeToken } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      const socket = io('http://localhost:3000/chat', {
        auth: {
          'accessToken': activeToken
        },
        withCredentials: true,
        transports: ['websocket'],
      });
      console.log(socket);

      socket.on('players_broadcast', (data) => {
        console.log(data);
      })

      return () => {
        socket.disconnect();
      }
    }
  },[isAuthenticated])

  async function Logout() {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {isAuthenticated ? (<div className="chat-page">
        <h1 className="title">Game Page</h1>
        <p className="player-name">Player: {player?.nickname}</p>
        <ul>
          
        </ul>
        <button onClick={Logout}>Logout</button>
      </div>) : (<div className="auth-page">
        <h1 className="title">Auth Page</h1>
        <LoginForm />
      </div>)}
    </div>
  )
}