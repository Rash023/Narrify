import { Link } from "react-router-dom"

export function Auth({type}:{type:"signup" | "signin"}){
    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div className="">
                    <div className="text-3xl font-extrabold text-stone-600">
                    Create an account
                    </div>
                    <div className=" font-light text-stone-500">
                        Already have an account?   
                        <Link className="pl-1 underline" to={'/signin'}>Login</Link>
                    </div>
                </div>
               
            </div>
        </div>
    )
}