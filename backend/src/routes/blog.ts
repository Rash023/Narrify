
import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'


export const blogRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    }
}>();



//middleware for blog
blogRouter.use('/*',async (c,next)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const header=await c.req.header("authorization")?.replace("Bearer ","").trim() || "";
    const response= await verify(header,c.env.JWT_SECRET);
    
    if(response.id){
      await next()
    }
    else{
      c.status(403) 
      return c.json({error:"unauthorized"})
    }
    
  
  });


  blogRouter.post('/',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
        const body=await c.req.json();
        const newBlog=await prisma.post.create({
            data:{
                title:body.title,
                content:body.content,
                authorId:"1"
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


  
  blogRouter.get('/',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
        const body=await c.req.json();
        const newBlog=await prisma.post.findFirst({
            where:{
                id:body.id
            },
            
        });

        return c.json({blog:newBlog})
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
       
        const blogs=await prisma.post.findMany();

        return c.json({blogs})
    }

    catch(error){
        c.status(411);
        c.json({error:"Internal Server Error"});
    }
  })