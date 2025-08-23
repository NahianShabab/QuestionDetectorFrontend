
import { useContext } from 'react'
import './NavBar.css'
import { UserContext } from './UserContext'


export default function NavBar(){
    const user = useContext(UserContext)
    const links = [
        {url:'/',text:'Home'},
        {url:'/profile',text:'Profile'},
        {url:'/tutorial',text:'Tutorial'},
    ]
    if(user!==null){
        if(user.user_role==='setter'){
            links.push({url:'/upload-questions',text:'Upload Questions'})
        }else if(user.user_role==='admin'){
            links.push({url:'/create-user',text:'Create User'})
        }
    }

    const link_list_items = links.map(
        (l,i)=>{
            return <li key={i}><a href={l.url}>{l.text}</a></li>
        }
    )

    return <div className="NavBar">
        <ul>
            {link_list_items}
        </ul>
    </div>
}