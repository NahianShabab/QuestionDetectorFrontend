import { useContext, useEffect, useState } from "react";
import { customFetch } from "./request";
import { Outlet } from "react-router";
import NavBar from "./NavBar";
import Footer from "./Footer";
import './Home.css'
import Modal from "./Modal";
import Profile from "./Profile";
import { UserContext } from "./UserContext";



export default function Home(){
   
    useEffect(
        ()=>{
            load_user()
        },[]
    )

    const [user,setUser] = useState(null)

    return <div className="Home">
        <UserContext value={user}>
            <NavBar></NavBar>
            {/* <Profile></Profile> */}
            <Outlet></Outlet>
            {/* <Modal></Modal> */}
            <Footer></Footer>
        </UserContext>
        
    </div>

    async function load_user(){
        try{
            const response = await customFetch({link:'/users/me',method:'GET'})
            if(response.ok){
                const result = await response.json()
                setUser(result)
            }else{
                window.location.href = '/login'
            }         
        }catch(e){

        }finally{

        }
    }
}