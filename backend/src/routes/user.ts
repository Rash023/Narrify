import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import {signInInput,signUpInput} from "@rash023/narrify"



export const userRouter=new Hono<
{
    Bindings:{
        DATABASE_URL:string
        JWT_SECRET:string
    }
}>();


//route for user signup
userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const { success } = signUpInput.safeParse(body);
  if (!success) {
      c.status(411);
      return c.json({
          message: "Invalid input"
      })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name
      }
    })
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET);

    return c.text(jwt)
  } catch(e) {
    console.log(e);
    c.status(411);  
    return c.text('Invalid')
  }
})
  
  //route for user sign in
  userRouter.post('/signin',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    
    try{
      const body=await c.req.json();
      const {success}=signInInput.safeParse(body);
      if(!success){
        c.status(411);
        c.json({message:"Invalid input"});
      }
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
      return c.text(token);
    }
    catch(error){
      c.status(411)
      c.json({error:"Internal Server Error"})
    }
    
  
  })