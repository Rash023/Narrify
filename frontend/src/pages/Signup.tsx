import {Quote} from "../components/Quote";
import {Auth} from "../components/Auth";



export function Signup(){
    return (
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2">
       
            <div>
               <Auth type="signup"/>
            </div>
            <div className="hidden lg:block">
                <Quote/>
            </div>
            
           
           
           
        </div>
    )
}