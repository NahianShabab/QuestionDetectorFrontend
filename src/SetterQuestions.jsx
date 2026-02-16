

import { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { BigImageDisplayerOverlay, ImageCard } from './QuestionUploader';
import { customFetch } from './request';
import styles from './SetterQuestions.module.css'



export default function SetterQuestions() {
    const [mode, setMode] = useState('submitted')
    const [all_questions, setAllQuestions] = useState(null)
    const [bigImageSource,setBigImageSource] = useState(null)
    const [isSendingRequest,setIsSendingRequest] = useState(false)
    const [selectedSubmitted,setSelectedSubmitted] = useState(new Set())
    const [selectedTranscribed,setSelectedTranscribed] = useState(new Set())

    useEffect(
        () => {
            load_all_questions()
        }, []
    )

    return <div className={styles.SetterQuestions}>
        <div className={styles.Header}>
            <a href='' onClick={(e) => { e.preventDefault(); if(isSendingRequest) return; setMode('submitted') }}
                className={`${styles.HeaderItem} ${mode === 'submitted' ?
                    styles.HeaderItemSelected : ''}`}>Submitted</a>

            <a href='' onClick={(e) => { e.preventDefault();if(isSendingRequest) return; setMode('transcribed') }}
                className={`${styles.HeaderItem} ${mode === 'transcribed' ?
                    styles.HeaderItemSelected : ''}`}>Transcribed</a>

            <a href='' onClick={(e) => { e.preventDefault();if(isSendingRequest) return; setMode('confirmed') }}
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
                    {selectedSubmitted.size!=0 && <div className={styles.SelectedContainer}>
                        {selectedSubmitted.size} Selected
                        <br></br>
                        <button disabled={isSendingRequest} 
                        onClick={()=>{
                            setSelectedSubmitted(new Set(
                                all_questions.submitted.map(v=>v.question_id)
                            ))
                        }}
                        >Select All</button>
                        <button disabled={isSendingRequest} 
                        onClick={()=>{
                            setSelectedSubmitted(new Set())
                        }}>Deselect All</button>
                        
                        <button disabled={isSendingRequest} onClick={()=>{delete_questions(selectedSubmitted)}}>Delete</button>
                    </div>}
                    {
                        all_questions.submitted.map(v=>
                        <QuestionCard key={v.question_id} question_id={v.question_id} is_confirmed={false} 
                        setBigImageSource={setBigImageSource} is_selected={selectedSubmitted.has(v.question_id)}
                        addToSelected={
                            ()=>{setSelectedSubmitted(prev=>new Set([...prev,v.question_id]))}}
                        removeFromSelected={()=>{setSelectedSubmitted(prev=>{
                            const copy = new Set(prev)
                            copy.delete(v.question_id)
                            return copy
                        })}}
                        ></QuestionCard>)
                    }
                    
                </div>
                <div className={`${mode === 'transcribed' ? '' : styles.Hidden}`}>
                    {selectedTranscribed.size!=0 && <div className={styles.SelectedContainer}>
                        {selectedTranscribed.size} Selected
                        <br></br>
                        <button disabled={isSendingRequest} 
                        onClick={()=>{
                            setSelectedTranscribed(new Set(
                                all_questions.transcribed.map(v=>v.question_id)
                            ))
                        }}
                        >Select All</button>
                        <button disabled={isSendingRequest} 
                        onClick={()=>{
                            setSelectedTranscribed(new Set())
                        }}>Deselect All</button>
                        
                        <button disabled={isSendingRequest} 
                        onClick={confirm_questions}>Confirm</button>
                        <button disabled={isSendingRequest} onClick={()=>{delete_questions(selectedTranscribed)}}>Delete</button>
                    </div>}
                    {
                        all_questions.transcribed.map(v=>
                        <QuestionCard key={v.question_id} question_id={v.question_id} is_confirmed={false} 
                        setBigImageSource={setBigImageSource} is_selected={selectedTranscribed.has(v.question_id)}
                        addToSelected={
                            ()=>{setSelectedTranscribed(prev=>new Set([...prev,v.question_id]))}}
                        removeFromSelected={()=>{setSelectedTranscribed(prev=>{
                            const copy = new Set(prev)
                            copy.delete(v.question_id)
                            return copy
                        })}}
                        question_transcription = {v.question_transcription}
                        options={v.options}
                        ></QuestionCard>)
                    }
                    
                </div>
                <div className={`${mode === 'confirmed' ? '' : styles.Hidden}`}>
                    
                    {   
                        all_questions.confirmed.map(v=>
                        <QuestionCard key={v.question_id} question_id={v.question_id} is_confirmed={true} 
                        setBigImageSource={setBigImageSource} is_selected={false}
                        addToSelected={()=>{}}
                        question_transcription = {v.question_transcription}
                        options={v.options}
                        ></QuestionCard>)
                    }
                    
                </div>
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

    async function delete_questions(question_sets){
        try{
            setIsSendingRequest(true)
            const questions_ids = [...question_sets]
            const response = await customFetch({link:'/setter/delete-questions',method:'DELETE',body:questions_ids})
            const result = await response.json()
            alert(result)
            window.location.reload()
        }catch(e){
            console.log(e);
            alert('Could not delete!')
        }finally{
            setIsSendingRequest(false)
        }
    }

    async function confirm_questions(){
        try{
            setIsSendingRequest(true)
            const questions_ids = [...selectedTranscribed]
            const response = await customFetch({link:'/setter/confirm-questions',method:'PATCH',body:questions_ids})
            const result = await response.json()
            alert(result)
            window.location.reload()
        }catch(e){
            console.log(e);
            alert('Could not Confirm!')
        }finally{
            setIsSendingRequest(false)
        }
    }
}


function QuestionCard({ question_id, is_confirmed,is_selected, options, question_transcription,setBigImageSource,
        addToSelected,removeFromSelected
        }) {
    const [image,setImage] = useState(null)
    useEffect(
        () => {
            console.log('Question Card Use Effect Called');
            console.log(question_transcription);
            
            load_image()
        }, []
    )
    return <div className={styles.QuestionCard}>
        {is_confirmed && <img src="icons8-confirmed.gif" className={styles.QuestionCardSuccessImage}></img>}
        <input type='checkbox' onChange={(e)=>{
            if(e.target.checked){
                addToSelected()
            }else{
                removeFromSelected()
            }
        }} checked={is_selected}></input>
        <ImageCard reducedOpacityOnHover={true}
        image_src_base64={image} height={'300px'} onClick={()=>{setBigImageSource(image)}} 
        ></ImageCard>
        {question_transcription && <h4><b><i>Question:</i></b> {question_transcription}</h4>}
        {options && <div>
            <h5>Options:</h5>
            <ul>
                {
                    options.map((v)=>{
                        return <li key={v.option_id}>{v.is_correct?<b>{'[Correct Option] '}</b>:''}{v.option_transcription}</li>
                    })
                }
            </ul>
        </div>}
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