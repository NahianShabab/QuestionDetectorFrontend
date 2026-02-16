import { useEffect, useState } from 'react'
import styles from './ComposerImage.module.css'
import { customFetch } from './request'
import { ImageCard } from './QuestionUploader'


export default function ComposerImage(){
    const [imageInfo,setImageInfo] = useState(null)
    const [isSendingRequest,setIsSendingRequest] = useState(false)
    const [transcript,setTranscript] = useState('')

    useEffect(
        ()=>{
            load_next_image_info()
        },[]
    )

    return <div className={styles.ComposerImage}>
        {!imageInfo && <b>{isSendingRequest?'Loading...':'No Images left'}</b>}  
        {imageInfo && 
            <div>
                <ImageCard  file={null}
                reducedOpacityOnHover={false} 
                width={'600px'}
                image_src_base64={`data:image/png;base64,${imageInfo.image}`}></ImageCard>
                <div>
                    <input value={transcript} onChange={(e)=>{setTranscript(e.target.value)}} ></input><br></br>
                    <button disabled={isSendingRequest}
                    onClick={()=>{send_image_transcript(transcript)}}>Submit</button>{' '}
                    <button disabled={isSendingRequest}
                    onClick={()=>{send_image_transcript('')}}
                    >Empty</button>
                </div>
            </div>
        }
    </div>

    async function send_image_transcript(transcript_text){
        try{
            setIsSendingRequest(true)
            const response = await customFetch({link:`/composer/transcribe-image?image_id=${
                imageInfo.image_id}&image_type=${imageInfo.image_type}&transcript=${
                    transcript_text}`,method:'PUT'})
            if(response.ok){
                const result = await response.json()
                if(result.success){
                    // alert(result.message)
                    setImageInfo(null)
                    setTranscript('')
                    await load_next_image_info()
                }else{
                    alert(result.message)
                }
            }else{
                alert('Error in response!')
            }
        }catch(e){
            console.log(e);
            alert('Error!')
        }finally{
            setIsSendingRequest(false)
        }
    }
    async function load_next_image_info(){
        try{
            setIsSendingRequest(true)
            const response = await customFetch({link:'/composer/next-image',method:'GET'})
            if(response.ok){
                const result = await response.json()
                setImageInfo(result)
                console.log(result);
                
            }
        }catch(e){
            console.log(e);
            
        }finally{
            setIsSendingRequest(false)
        }
    }
}