// src/features/home/HomePage.jsx
import React, { useState } from 'react'

function ImgPage() {
  const [message, setMessage] = useState('')

  const imgClick = async () => {
   // ここでAPI呼び出しを行う
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
