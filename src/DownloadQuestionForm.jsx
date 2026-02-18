
import { UserContext } from "./UserContext"
import { useContext } from "react"

export default function DownloadQuestionForm(){
    const user = useContext(UserContext)

    return (user?.user_role==='setter' && 
        <a href={'question_form.png'} download>Download Question Form</a>)
}