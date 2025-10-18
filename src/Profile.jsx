
import { useContext } from 'react'
import styles from './Profile.module.css'
import { UserContext } from './UserContext'
import { get_user_role_as_string } from './Utils'
export default function Profile(){
    const user = useContext(UserContext)

    return user!==null && <div className={styles.Profile}>
        <div className={styles.ProfileBox}>
            <table>
                <tbody>
                    <tr>
                        <td><b>Username</b></td>
                        <td>{user.username}</td>
                    </tr>
                    <tr>
                        <td><b>Role</b></td>
                        <td>{get_user_role_as_string(user.user_role)}</td>
                    </tr>
                    <tr>
                        <td><b>First Name</b></td>
                        <td>{user.first_name}</td>
                    </tr>
                    <tr>
                        <td><b>Last Name</b></td>
                        <td>{user.last_name===null?<i style={{color:'gray'}}>Not Given</i>:user.last_name}</td>
                    </tr>

                    <tr>
                        <td><b>Email</b></td>
                        <td>{user.email===null?<i style={{color:'gray'}}>Not Given</i>:user.email}</td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>
}