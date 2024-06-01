import { Link,useNavigate } from "react-router-dom"
import {LabelledInput} from "./LabelledInput";
import { useState } from "react";
import axios from "axios";
import { SignUpInput } from "@rash023/narrify";
import dotenv from 'dotenv';
dotenv.config();

export function Auth({type}:{type:"signup" | "signin"}){
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignUpInput>({
        email: "",
        password: "",
        name: ""
        
    });

    async function sendRequest() {
        try {
            const response = await axios.post(`${process.env.BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data;

            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch(e) {
            alert("Error while signing up")
            // alert the user here that the request failed
        }
    }
    return (
        <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-3xl font-extrabold text-stone-600 ">
                        Create an account
                    </div>
                    <div className="text-stone-600">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?" }
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                </div>
                <div className="pt-8">
                    {type === "signup" ? <LabelledInput label="Name" placeholder="Rashid Mazhar..." onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} /> : null}
                    <LabelledInput label="email" placeholder="example@gmail.com" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        })
                    }} />
                    <LabelledInput label="Password" type={"password"} placeholder="123456" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                 <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-stone-600 hover:bg-stone-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-stone-600 dark:hover:bg-stone-500 dark:focus:ring-gray-700 dark:border-gray-700">
  {type === "signup" ? "Sign up" : "Sign in"}
</button>

                </div>
            </div>
        </div>
    </div>
    )
}



