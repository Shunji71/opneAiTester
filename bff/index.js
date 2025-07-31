const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(cors())

app.get('/api/img', async (req, res) => {
  try {
    const response = await axios.get('https://dog.ceo/api/breeds/image/random')
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ message: 'Spring API呼び出しに失敗しました' })
  }
})

app.listen(PORT, () => {
  console.log(`✅ BFF サーバー起動: http://localhost:${PORT}`)
})
