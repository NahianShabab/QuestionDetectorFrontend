
import { useContext } from 'react'
import styles from './NavBar.module.css'
import { UserContext } from './UserContext'
import DownloadQuestionForm from './DownloadQuestionForm'


export default function NavBar(){
    const user = useContext(UserContext)
    const links = [
        {url:'/',text:'Home'},
        {url:'/profile',text:'Profile'},
        {url:'/tutorial',text:'Tutorial'},
        {url:'/login',text:'Logout'}
    ]
    if(user!==null){
        if(user.user_role==='setter'){
            links.push({url:'/upload-questions',text:'Upload Questions'})
            links.push({url:'/setter-questions',text:'My Questions'})
        }else if(user.user_role==='admin'){
            links.push({url:'/create-user',text:'Create User'})
        }else if(user.user_role==='composer'){
            links.push({url:'/composer-image',text:'Assigned Images'})
        }
    }

    
    const link_list_items = links.map(
        (l,i)=>{
            return <li key={l.url}><a href={l.url}>{l.text}</a></li>
        }
    )

    return <div className={styles.NavBar}>
        <ul>
            {link_list_items}
            {user?.user_role==='setter' && <li><DownloadQuestionForm></DownloadQuestionForm></li>}
        </ul>
    </div>
}