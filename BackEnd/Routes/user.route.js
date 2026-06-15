import express from "express"
import { isAuth } from "../Middleware/isAuth.js"
import { getCurrentUser, saveAssistant, saveSiteTheme, deleteAccount } from "../Controllers/user.controller.js"

const userRouter = express.Router()


userRouter.get("/current-user" , isAuth , getCurrentUser)
userRouter.post("/save-assistant" , isAuth , saveAssistant)
userRouter.post("/save-site-theme" , isAuth , saveSiteTheme)
userRouter.delete("/delete-account" , isAuth , deleteAccount)

export default userRouter