import {NextFunction , Request , Response} from "express";
import {headerAuthVerify} from "../helper/Auth";
import {reqBodyValidator} from "../Handler/propType";
import responseHandler from "../Handler/responseHandler";
import UserDatabase from "../Database/userDatabase";
import PageDatabase from "../Database/pageDatabase";
import Database from "../Database";

class CollectionController {
    async addCollection (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["name"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { name , parent} = request.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.CollectionDatabase.addCollection(name,userObj.id,parent).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Collection not created"))

        return res.json(responseHandler.SUCCESS(result))

    }

    async getById (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["id"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { id} = request.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.CollectionDatabase.findCollectionById(Number(id),userObj.id).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("No collection found"))

        return res.json(responseHandler.SUCCESS(result))

    }

    async deleteById (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["id"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { id} = request.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.CollectionDatabase.deleteById(Number(id),userObj.id).catch((error:Error)=>"Error while deleting")
        if(typeof result === "string") return res.json(responseHandler.CONFLICT(result))

        console.log(result , id)
        return res.json(responseHandler.SUCCESS("Deleted collection"))

    }

    async rename (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["id","name"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { id , name} = request.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.CollectionDatabase.renameById(Number(id),userObj.id,name).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("No collection found"))

        return res.json(responseHandler.SUCCESS("Renamed collection"))

    }

    async getByParent (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["parent"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { parent} = req.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.CollectionDatabase.findCollectionByUserAndRoot(userObj.id,parent ? Number(parent) : null).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Collection not created"))
        return res.json(responseHandler.SUCCESS(result))
    }

    async moveById (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["parent","id"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { parent , id } = req.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await Database.CollectionDatabase.moveById(parent ? Number(parent) : null , Number(id) , userObj.id).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Collection not moved"))
        return res.json(responseHandler.SUCCESS("Collection moved successfully"))
    }

    async getAllByParent (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["parent"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { parent} = req.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const ans = []
        const resultColl = await Database.CollectionDatabase.findCollectionByUserAndRoot(userObj.id,parent ? Number(parent) : null).catch(()=>null)
        if(resultColl) ans.push(...resultColl.map((single)=>({
            ...single,
            type : "COLLECTION"
        })))

        const resultPage = await PageDatabase.findByCollectionId(Number(parent),userObj.id).catch(()=>null)
        if(resultPage) ans.push(...resultPage.map((single)=>({
            ...single,
            type : "PAGE"
        })))

        return res.json(responseHandler.SUCCESS(ans))
    }

    async getAllByName (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["name"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { name } = req.body

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const ans = []
        const resultColl = await Database.CollectionDatabase.findCollectionByUserAndName(userObj.id, name).catch(()=>null)
        if(resultColl) ans.push(...resultColl.map((single)=>({
            ...single,
            type : "COLLECTION"
        })))

        const resultPage = await PageDatabase.findByName(name,userObj.id).catch(()=>null)
        if(resultPage) ans.push(...resultPage.map((single)=>({
            ...single,
            type : "PAGE"
        })))

        return res.json(responseHandler.SUCCESS(ans))
    }
}

export default new CollectionController();
