

import { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { BigImageDisplayerOverlay, ImageCard } from './QuestionUploader';
import { customFetch } from './request';
import styles from './SetterQuestions.module.css'



export default function SetterQuestions() {
    const [mode, setMode] = useState('submitted')
    const [all_questions, setAllQuestions] = useState(null)
    const [bigImageSource,setBigImageSource] = useState(null)
    useEffect(
        () => {
            load_all_questions()
        }, []
    )

    return <div className={styles.SetterQuestions}>
        <div className={styles.Header}>
            <a href='' onClick={(e) => { e.preventDefault(); setMode('submitted') }}
                className={`${styles.HeaderItem} ${mode === 'submitted' ?
                    styles.HeaderItemSelected : ''}`}>Submitted</a>

            <a href='' onClick={(e) => { e.preventDefault(); setMode('transcribed') }}
                className={`${styles.HeaderItem} ${mode === 'transcribed' ?
                    styles.HeaderItemSelected : ''}`}>Transcribed</a>

            <a href='' onClick={(e) => { e.preventDefault(); setMode('confirmed') }}
                className={`${styles.HeaderItem} ${mode === 'confirmed' ?
                    styles.HeaderItemSelected : ''}`}>Confirmed</a>

        </div>


        {all_questions &&
            <>
                {bigImageSource!==null && <BigImageDisplayerOverlay image_src_base64={bigImageSource}
                onCloseClick={
                    ()=>{
                        setBigImageSource(null)
                    }
                }
                ></BigImageDisplayerOverlay>}
                <div className={`${mode === 'submitted' ? '' : styles.Hidden}`}>
                    {
                        all_questions.submitted.map(v=>
                        <QuestionCard key={v.question_id} question_id={v.question_id} is_confirmed={v.is_confirmed} 
                        setBigImageSource={setBigImageSource}></QuestionCard>)
                    }
                    
                </div>
                <div className={`${mode === 'transcribed' ? '' : styles.Hidden}`}>Transcribed</div>
                <div className={`${mode === 'confirmed' ? '' : styles.Hidden}`}>Confirmed</div>
            </>
        }
    </div>


    async function load_all_questions() {
        try {
            const response = await customFetch(
                { link: '/setter/questions', method: 'GET' }
            )
            if (response.ok) {
                const result = await response.json()
                console.log(result);
                setAllQuestions(result)
            }
        } catch (e) {

        } finally {

        }
    }
}


function QuestionCard({ question_id, is_confirmed, options, question_transcription,setBigImageSource}) {
    const [image,setImage] = useState(null)
    useEffect(
        () => {
            console.log('Question Card Use Effect Called');
            load_image()
        }, []
    )
    return <div className={styles.QuestionCard}>
        <ImageCard reducedOpacityOnHover={true}
        image_src_base64={image} height={'300px'} onClick={()=>{setBigImageSource(image)}} 
        ></ImageCard>
    </div>

    async function load_image(){
        try{
            const response = await customFetch({
                method:'GET',link:`/setter/question-image?question_id=${question_id}`
            })
            if(response.ok){
                const result = await response.json()
                setImage(`data:image/png;base64,${result}`)
            }
            
        }catch(e){
            console.log(e);
        }
    }
}