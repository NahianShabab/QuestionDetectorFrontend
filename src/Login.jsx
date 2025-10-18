import { useState } from "react"

import styles from './Login.module.css'
import { customFetch } from "./request"

export default function Login() {
    const [isSendingRequest, setIsSendingRequest] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    return <div className={styles.Login}>
        <div className={styles.LoginBox}>
            <h2>Login</h2>
            <div className={styles.LoginInput}>
                <input type="text" disabled={isSendingRequest} onChange={
                    (e) => {
                        setFormData({ ...formData, username: e.target.value })
                    }
                }></input>
                <label
                    className={formData.username === '' ? `${styles.BackgroundLabelVisible}` : 
                    `${styles.BackgroundLabelHidden}`}>
                    Username</label>
            </div>

            <div className={styles.LoginInput}>
                <label className={formData.password === '' ? `${styles.BackgroundLabelVisible}` :
                 `${styles.BackgroundLabelHidden}`}>
                    Password</label><input type="text" disabled={isSendingRequest}
                        onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value })
                        }}></input>

            </div>
            <button disabled={isSendingRequest} onClick={login_request}>Login</button>
        </div>

    </div>


    async function login_request() {
        try {
            setIsSendingRequest(true)
            const response = await customFetch({
                link: '/users/login', method: 'POST',
                isLoginRequest: true, body: formData
            })
            if (response.ok) {
                const result = await response.json()
                localStorage.setItem('access_token', result.access_token)
                window.location.href = '/'
            } else {
                alert('Invalid Credentials')
            }
        } catch (e) {
            alert('Could not login!')
            console.log(e);

        } finally {
            setIsSendingRequest(false)
        }
    }
}