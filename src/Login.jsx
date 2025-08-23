import { useState } from "react"

import './Login.css'
import { customFetch } from "./request"

export default function Login() {
    const [isSendingRequest, setIsSendingRequest] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    return <div className="Login">
        <div className="LoginBox">
            <h2>Login</h2>
            <div className="LoginInput">
                <input type="text" onChange={
                    (e) => {
                        setFormData({ ...formData, username: e.target.value })
                    }
                }></input>
                <label
                    className={formData.username === '' ? "BackgroundLabelVisible" : "BackgroundLabelHidden"}>
                    Username</label>
            </div>

            <div className="LoginInput">
                <label className={formData.password === '' ? "BackgroundLabelVisible" : "BackgroundLabelHidden"}>
                    Password</label><input type="text"
                        onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value })
                        }}></input>

            </div>
            <button disabled={isSendingRequest} onClick={login_request}>Login</button>
        </div>

    </div>


    async function login_request(){
        try{
            setIsSendingRequest(true)
            const response = await customFetch({link:'/users/login',method:'POST',
                isLoginRequest:true,body:formData
            })
            if(response.ok){
                const result = await response.json()
                localStorage.setItem('access_token',result.access_token)
                window.location.href = '/'
            }else{
                alert('Invalid Credentials')
            }
        }catch(e){
            alert('Could not login!')
            console.log(e);
            
        }finally{
            setIsSendingRequest(false)
        }
    }
}