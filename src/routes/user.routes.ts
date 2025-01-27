import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt"
import { User } from "../entity/User";

const userRouter = Router()

const userRepository = AppDataSource.getRepository(User)

userRouter.post("/", async (req: Request, res: Response) => {
    try {

        const userBody = req.body 

        if(!userBody || !userBody.email || !userBody.nome || !userBody.senha){
            res.status(400).json("Preencha todos os dados!")
            return
        }

        const salt = await bcrypt.genSalt(10)
        const senhaCriptografada = await bcrypt.hash(userBody.senha, salt)

        userBody.senha = senhaCriptografada

        await userRepository.save(userBody)
        res.status(201).json(userBody)
        return
    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!")
    }
})

userRouter.get("/", async (req: Request, res: Response) => {
    try {
        const result = await userRepository.find()

        res.status(200).json(result)
    } catch (ex){
        res.status(500).json("Não foi possível executar a solicitação!")
    }
})

export default userRouter