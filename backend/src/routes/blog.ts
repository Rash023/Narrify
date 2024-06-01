
import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { createBlogInput,updateBlogInput } from "@rash023/narrify";




export const blogRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    },
    Variables:{
        id:string

    }
}>();



//middleware for blog
blogRouter.use('/*',async (c,next)=>{
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
        const header= c.req.header("authorization")?.replace("Bearer ","")|| "";
        const user= await verify(header,c.env.JWT_SECRET);
        
        if(user){
            //@ts-ignore
            c.set("id",user.id);
            await next();
        }
        else{
          c.status(403) 
          return c.json({error:"unauthorized"})
        }
        
    }
    catch(error){
        c.status(404);
        c.json({error:"Internal Server error"});
    }
   
  
  });


  blogRouter.post('/',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
        const userId=c.get("id");

        const body=await c.req.json();
        const {success}=createBlogInput.safeParse(body);

        if(!success){
            c.status(411);
            c.json({message:"Invalid input"})
        }
        const newBlog=await prisma.post.create({
            data:{
                title:body.title,
                content:body.content,
                authorId:userId
            }
        });

        return c.json({id:newBlog.id})
    }

    catch(error){
        c.status(411);
        c.json({error:"Internal Server Error"});
    }
  })


  blogRouter.put('/',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
        const body=await c.req.json();
        const {success}=updateBlogInput.safeParse(body);
        if(!success){
            c.status(411);
            c.json({message:"Invalid input"});
        }
        const newBlog=await prisma.post.update({
            where:{
                id:body.id
            },
            data:{
                title:body.title,
                content:body.content
               
            }
        });

        return c.json({id:newBlog.id})
    }

    catch(error){
        c.status(411);
        c.json({error:"Internal Server Error"});
    }
  })

  
  blogRouter.get('/bulk',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
        const id=c.req.param("id");
        const blogs=await prisma.post.findMany(id);

        return c.json({blogs})
    }

    catch(error){
        c.status(411);
        c.json({error:"Internal Server Error"});
    }
  })

  
  blogRouter.get('/:id',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{


        const id=c.req.param("id");
        const newBlog=await prisma.post.findFirst({
            where:{
                id,
            },
            
        });

        return c.json({blog:newBlog})
    }

    catch(error){
        c.status(411);
        c.json({error:"Internal Server Error"});
    }
  })

