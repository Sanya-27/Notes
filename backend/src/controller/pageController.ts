import {NextFunction , Request , Response} from "express";
import {headerAuthVerify} from "../helper/Auth";
import {reqBodyValidator} from "../Handler/propType";
import CollectionDatabase from "../Database/collectionDatabase";
import responseHandler from "../Handler/responseHandler";
import UserDatabase from "../Database/userDatabase";
import pageDatabase from "../Database/pageDatabase";
import Database from "../Database";

class PageController {
    async addPage (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["name","collectionId"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { name , collectionId} = request.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.PagesDatabase.createPage(name,Number(collectionId),userObj.id).catch((res : string | null)=>res)
        if(!result) return res.json(responseHandler.CONFLICT("Page not created"))
        if(typeof result === "string") return res.json(responseHandler.CONFLICT(result))

        return res.json(responseHandler.SUCCESS(result))

    }

    async savePage (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["id","content"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { id , content} = request.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.PagesDatabase.savePage(Number(id),content,userObj.id).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Collection not created"))

        return res.json(responseHandler.SUCCESS("Page saved"))

    }

    async rename (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["id","name"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { id , name} = request.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.PagesDatabase.renameById(Number(id),userObj.id,name).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("No collection found"))

        return res.json(responseHandler.SUCCESS("Renamed page"))

    }

    async getContent (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["id"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { id , name} = request.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.PagesDatabase.findPageById(Number(id),userObj.id).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("No collection found"))

        return res.json(responseHandler.SUCCESS(result))
    }

    async deletePage (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["id"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { id , name} = request.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.PagesDatabase.deleteById(Number(id),userObj.id).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Not deleted"))

        return res.json(responseHandler.SUCCESS("Deleted"))
    }

    async moveById (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["parent","id"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { parent , id } = req.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.PagesDatabase.moveById(parent ? Number(parent) : null , Number(id) , userObj.id).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Page not moved"))
        return res.json(responseHandler.SUCCESS("Page moved successfully"))
    }
}

export default new PageController();
