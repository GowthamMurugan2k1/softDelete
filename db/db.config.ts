import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient().$extends({
    query:{
        $allModels:{
            async findMany({model,args,query}){
                if(["Video","Playlist","CategoryVideo","Category"].includes(model)){
                    args.where = {...args.where,deletedAt:null}
                }
                return query(args)
            },
            async findFirst({model,args,query}){
                if(["Video","Playlist","CategoryVideo","Category"].includes(model)){
                    args.where = {...args.where,deletedAt:null}
                }
                return query(args)
            }
        }
    }
})


