import { useState } from 'react'
import './App.css'
import StarCanvas from './StarCanvas'
import SpaceChat from './SpaceChat'

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <StarCanvas />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        <h1 style={{ color: '#fff', marginBottom: '1rem' }}>🌌 Kimi 星域通信站</h1>
        
        {!showChat ? (
          <div className="welcome-container">
            <p style={{ color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>
              与宇宙中的 AI 探测员进行沉浸式对话
            </p>
            <button 
              onClick={() => setShowChat(true)}
              className="start-button"
            >
              开始通信 🚀
            </button>
          </div>
        ) : (
          <SpaceChat onEndChat={() => setShowChat(false)} />
        )}
      </div>
    </div>
  )
}

export default App