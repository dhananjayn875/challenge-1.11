require('dotenv').config()

const express = require('express')
const confessionRoutes = require('./routes/confessionRoutes')

const app = express()
const port = Number(process.env.PORT || 3000)

app.use(express.json())
app.get('/', (req, res) => {
  res.json({
    message: 'Dev Confessions API is running',
    endpoints: ['/api/v1/confessions'],
  })
})
app.use('/api/v1/confessions', confessionRoutes)

app.listen(port, () => {
  console.log(`running on ${port}`)
})
