import express from "express"
import cors from "cors"

export const app = express()
app.use(cors())

app.use(express.static("build"))

app.get("/api", (req, res) => {
    res.send("<h1>test</h1>")
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("server running on port ", PORT)
})