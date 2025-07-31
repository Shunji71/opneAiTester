// src/features/home/HomePage.jsx
import React, { useState } from 'react'

function ImgPage() {
  const [message, setMessage] = useState('')

  const imgClick = async () => {
    // BFFを呼び出す
    try {
      const response = await fetch('http://localhost:3001/api/img')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setMessage(data.message)
    } catch (error) {
      console.error('API呼び出しに失敗:', error)
      setMessage('API呼び出しに失敗しました')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>犬画像</h1>
      <button onClick={imgClick}>API呼び出し</button>
      <p>{message}</p>
    </div>
  )
}

export default ImgPage
