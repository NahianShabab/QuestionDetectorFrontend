import { useContext, useRef, useState } from "react";
import { UserContext } from "./UserContext";

import './QuestionUploader.css'
import { customFetch } from "./request";

export default function QuestionUploader(){
    const user = useContext(UserContext)
    const [cardIds,setCardIds] = useState([])

    const cards = cardIds.map((cardId)=>{
        return <QuestionUploaderCard
        className="QuestionUploaderCard" 
        key={cardId} user={user} removeEntry={removeEntry} cardId={cardId}></QuestionUploaderCard>
    })

    return <div className="QuestionUploader">
        {cards}
        <button onClick={addEntry}>Add A New Question</button>
    </div>

    function removeEntry(cardId){
        setCardIds(cardIds.filter(
            id=>id!==cardId
        ))
    }
    function addEntry(){
        setCardIds(
            [...cardIds,Date.now()]
        )
        
    }



}


function QuestionUploaderCard({user,cardId,removeEntry}){
    const [result,setResult] = useState(null)
    const [isUploading,setIsUploading] = useState(false)
    const upload_file_ref = useRef(null)
    return <div className="QuestionUploaderCard">
        <button onClick={()=>{removeEntry(cardId)}}>Remove</button>
        <div>
            <input type='file' disabled={isUploading} ref={upload_file_ref} onChange={(e)=>{setResult(null)}}></input>
            <button disabled={isUploading} onClick={upload_question}>{result===null?'Upload':'Reupload'}</button>
        </div>
        {result!==null && 
        <>
            {
                !result.success &&
                <>
                    <div>
                        <span style={{color:'red'}}>{result.message}</span>
                        <img className="FailureIcon" src='error.png'></img>
                    </div>
                </>
                
            }
            {
                result.success && 
                <>
                    <img className="QuestionFullImage" src={`data:image/png;base64,${result.data.extracted_image}`}></img>
                    <img className="SuccessIcon" src='success.png'></img> 
                </>
            }
        </>
        }
    </div>

    async function upload_question(){
        if(upload_file_ref.current===null){
            return
        }
        const files = upload_file_ref.current.files
        // console.log(files);
        if(files.length<=0){
            return
        }
        const file = files[0]
        // console.log(file.type);
        if(!file.type.startsWith('image')){
            return
        }

        try{
            setIsUploading(true)
            const formData = new FormData()
            formData.append('img',file)
            const response = await customFetch({link:'/setter/image',method:'POST',body:formData,isFile:true})
            if(response.ok){
                const result = await response.json()
                setResult(result)
                console.log(result);
                
            }else{
                console.log('Error in uploading');
                
            }
        }catch(e){
            console.log(e);
            
        }finally{
            setIsUploading(false)
        }
        
        
    }
} 