import express from "express"
import cors from "cors"
import twitchRouter from "./routes/twitch"
import "./services/OAuth2Strategy"
import "./services/JSONWebTokenStrategy"

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/twitch", twitchRouter)

app.get("/api", (_req, res) => {
    res.send("test")
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log("server running on port ", PORT)
})
