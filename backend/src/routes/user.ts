import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'


export const userRouter=new Hono<
{
    Bindings:{
        DATABASE_URL:string
        JWT_SECRET:string
    }
}>();



//route for user signup
userRouter.post('/signup',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    const body=await c.req.json();
  
    
    try{
      const user=await prisma.user.create({
        data:{
          email:body.email,
          name:body.name,
          password:body.password  
        }, 
      })
      const payload={
        id:user.id
      }
      const secret=c.env.JWT_SECRET
    
      const token=await sign(payload,
        secret)
    
    
      return c.json({jwt:token});
  
    }
    catch(error){
      c.status(411)
      c.json({error:"Internal Server Error"})
  
    }
  
  
  })
  
  //route for user sign in
  userRouter.post('/signin',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    
    try{
      const body=await c.req.json();
      const user=await prisma.user.findUnique({
        where:{
          email:body.email
        }
      });
    
      if(!user){
        return c.json({error:"User not found"});
      }
    
      const token=await sign({id:user.id},c.env.JWT_SECRET);
      c.status(200);
      return c.json({token});
    }
    catch(error){
      c.status(411)
      c.json({error:"Internal Server Error"})
    }
    
  
  })