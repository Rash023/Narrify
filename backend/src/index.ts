import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'


const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
  }
}>()

//middleware for users
app.use('api/v1/blog/*',async (c,next)=>{
  const header=c.req.header("authorization")?.replace("Bearer ","").trim() || "";
  const response= await verify(header,c.env.JWT_SECRET);

  if(response.id){
    await next()
  }
  else{
    c.status(403) 
    return c.json({error:"unauthorized"})
  }
  

})

//handler to sign up

app.post('api/v1/signup',async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
  const body=await c.req.json();

  //db logic
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

})

//route for user sign in
app.post('api/v1/signin',async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
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
  return c.json({token});



  

})

// app.post('/blog',(c)=>{
//   const {email,password}=c.body;

//   //db logic

//   return c.json({});

// })

// app.put('/signup',(c)=>{
//   const {email,password}=c.body;

//   //db logic

//   return c.json({});

// })


// app.get('/blog',(c)=>{
//   const {email,password}=c.body;

//   //db logic

//   return c.json({});

// })
export default app
