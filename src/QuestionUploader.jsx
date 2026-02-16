import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext";

import styles from './QuestionUploader.module.css'
import { customFetch } from "./request";

export default function QuestionUploader() {
    const user = useContext(UserContext)
    // const [cardIds, setCardIds] = useState([])
    const [uploadResults, setUploadResults] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [displayedImageBase64, setDisplayedImageBase64] = useState(null)
    const fileInputRef = useRef(null)

    const cards = uploadResults.map((value) => {
        return <QuestionUploaderCard
            className={styles.QuestionUploaderCard}
            key={value.result_id} result_id={value.result_id} update_result={update_upload_result}
            user={user} remove_result={remove_upload_result} result={value.result} file={value.file}
            is_submitting={isSubmitting}></QuestionUploaderCard>
    })
    let verified_images = []
    for (let u of uploadResults) {
        const file = u.file
        if (file &&
            u.result?.success === true) {
            verified_images.push(<ImageCard onClick={() => {
                setDisplayedImageBase64(`data:image/png;base64,${u.result.data.extracted_image}`)
            }}
            image_src_base64={`data:image/png;base64,${u.result.data.extracted_image}`} 
            key={u.result_id} file={null} width={'300px'} height={'300px'}></ImageCard>
            );
        }
    }
    // console.log(images);



    return <div className={styles.QuestionUploader}>
        {displayedImageBase64 !== null && <div className={styles.BigImageDisplayerOverlay}>
            <ImageCard file={null} width={'800px'} height={'500px'} onClick={() => { }}
                reducedOpacityOnHover={false} image_src_base64={displayedImageBase64}></ImageCard>
            <button onClick={() => setDisplayedImageBase64(null)}>Close</button>
        </div>
        }
         <div className={styles.ProceedToUploadSection}>
            <h2>Images Verified : {verified_images.length} </h2>
            {isSubmitting && <img src='icons8-loading.gif'></img>}
            <button onClick={submitQuestions} disabled={isSubmitting}>Proceed to upload</button>
        </div> 

         {verified_images.length > 0 && <div className={styles.ImageCardContainer}>
            {verified_images}
        </div>} 
        <input type='file' accept="image/png, image/jpeg" hidden id='AddImagesFileInput'
        onChange={add_new_files} ref={fileInputRef} multiple/>
        <label htmlFor='AddImagesFileInput'>
            <img src="https://img.icons8.com/?size=50&id=1501&format=png&color=000000">
            </img>    
        </label>
        {cards}
        
    </div>
    async function submitQuestions() {
        try {
            console.log('Inside Submit Questions!');
            setIsSubmitting(true)
            let has_file = false
            const formData = new FormData()
            for (let u of uploadResults) {
                const file = u.file
                if (file !== null
                    && u.result?.success === true) {
                    formData.append('images',file)
                    has_file=true
                }

            }
            if(!has_file){
                return
            }
            const response = await customFetch(
                {link:'/setter/upload_question_images',body:formData,isFile:true,method:'POST'}
            )
            if(response.ok){
                const result = await response.json()
                alert('Uploaded!')
                window.location.href='/setter-questions'
            }
        } catch (e) {
            alert('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    function remove_upload_result(target_id) {
        setUploadResults(
            prevUploadResults =>
                prevUploadResults.filter((value) => value.result_id !== target_id)
        )
    }
    function add_new_files(){
        if (fileInputRef.current!=null){
            const files = Array.from(fileInputRef.current.files);
            const newUploadResults = files.map(f => ({
                result_id: crypto.randomUUID(),
                result: null,
                file: f
            }));


            setUploadResults(
                prevUploadResults => [...prevUploadResults,...newUploadResults]
            )
        }
    }
    function add_new_upload_result() {
        setUploadResults(
            prevUploadResults => [...prevUploadResults, { result_id: new Date().getTime(), result: null, file: null }]
        )


    }

    function update_upload_result(target_id, new_result, new_file) {
        setUploadResults(
            prevUploadResults => prevUploadResults.map(
                (old_value) => {
                    console.log(uploadResults);
                    return old_value.result_id === target_id ? { ...old_value, result: new_result, file: new_file } : old_value
                }
            )
        )
    }


}


function QuestionUploaderCard({ user,file, result_id, result, update_result, remove_result, is_submitting }) {
    const [isUploading, setIsUploading] = useState(false)
    const upload_file_ref = useRef(null)

    useEffect(
        () => {
            console.log('inside use effect');
            return () => {
                console.log('inside clean up');

            }

        }, [result]
    )

    useEffect(
        ()=>{
            console.log('Inside UserEffect: File Changed!')
            upload_question()
        },[file]
    )

    return <div className={styles.QuestionUploaderCard}>
        {file && <h3>{file.name}</h3>}
        <ImageCard file={file} width={90} height={90} 
        reducedOpacityOnHover={false} ></ImageCard><br/>
        {isUploading && <img src='icons8-loading.gif'></img>}
        <button onClick={() => { remove_result(result_id) }} disabled={is_submitting || isUploading}>Remove</button>
        <div>
            <input type='file' disabled={isUploading || is_submitting} ref={upload_file_ref}
                accept="image/png, image/jpeg"
                onChange={(e) => {
                    const new_file = e.target.files[0] ?? null
                    update_result(result_id, null, new_file)
                }}></input>
            {/* <button disabled={isUploading || is_submitting} onClick={upload_question}>{result === null ? 'Upload' : 'Reupload'}</button> */}
        </div>


        {result !== null &&
            <>
                {
                    !result.success &&
                    <>
                        <div>
                            <span style={{ color: 'red' }}>{result.message}</span>
                            <img className={styles.FailureIcon} src='error.png'></img>
                        </div>
                    </>

                }
                {
                    result.success &&
                    <>
                        <img className={styles.SuccessIcon} src='success.png'></img>
                        <QuestionUploaderSections extracted_image={result.data.extracted_image}
                            question_images={result.data.question_images}
                            option_images_list={result.data.option_images_list}
                        ></QuestionUploaderSections>
                    </>
                }
            </>
        }
    </div>

    async function upload_question() {
        // if (upload_file_ref.current === null) {
        //     return
        // }
        // const files = upload_file_ref.current.files
        // // console.log(files);
        // if (files.length <= 0) {
        //     return
        // }
        // const file = files[0]
        // console.log(file.type);
        console.log('Uploading Question');
        if (!file){
            return
        }
        if (!file.type.startsWith('image')) {
            return
        }

        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('img', file)
            const response = await customFetch({ link: '/setter/verify_question_image', method: 'POST', body: formData, isFile: true })
            if (response.ok) {
                const new_result = await response.json()
                console.log(new_result)
                update_result(result_id, new_result, file)
                // console.log(result);

            } else {
                console.log('Error in uploading');

            }
        } catch (e) {
            console.log(e);

        } finally {
            setIsUploading(false)
        }


    }
}



export function QuestionUploaderSections({ extracted_image, question_images, option_images_list }) {

    const question_image_fragments = question_images.map((v, i) => {
        return <img className={styles.FragmentImage} key={i} src={`data:image/png;base64,${v}`}></img>
    })
    let option_images_list_component = []
    for (let i = 0; i < option_images_list.length; i++) {
        const option_images = option_images_list[i]
        const option_images_component = []
        for(let j=0;j<option_images.length;j++){
            option_images_component.push(
                    <img className={styles.FragmentImage} key={j} 
                    src={`data:image/png;base64,${option_images[j]}`}></img>
            )
        }
        option_images_list_component.push(<>
            <div style={{ border: '2px solid black', margin: '2px' }} key={i}>
                    <h5>Option {i}</h5>
                    {option_images_component}
            </div>
        </>)
    }
    return (
        <div className={styles.QuestionUploaderCardSections}>
            <div>
                <h4>Full Question Image</h4>
                <img className={styles.QuestionFullImage} src={`data:image/png;base64,${extracted_image}`}></img>
            </div>


            <div className={styles.FragmentImageDiv}>
                <h4>Question Text</h4>
                {question_image_fragments}
            </div>
            <div>
                <h4>Options</h4>
                {option_images_list_component}
            </div>
        </div>)
}


export function ImageCard({ file, width, height, onClick, reducedOpacityOnHover = true, image_src_base64 = null }) {
    const [img_url, setImgURL] = useState(null)

    useEffect(
        () => {
            if (!file) {
                setImgURL(null)
                return
            }
            const newImgURL = URL.createObjectURL(file)
            setImgURL(newImgURL)

            return () => {
                URL.revokeObjectURL(newImgURL)
            }

        }, [file]
    )
    if (image_src_base64 === null && img_url === null) {
        return null;
    }
    return (img_url !== null || image_src_base64 !== null) && <img onClick={onClick} className={`${styles.ImageCard} ${reducedOpacityOnHover ? `${styles.ReducedOpacityOnHover}` : ''}`} style={{ width: width, height: height }}
        src={img_url === null ? image_src_base64 : img_url}>
    </img>
}


export function BigImageDisplayerOverlay({image_src_base64,onCloseClick}){
    

    return <div className={styles.BigImageDisplayerOverlay}>
    <ImageCard file={null} width={'800px'} height={'500px'} onClick={() => { }}
        reducedOpacityOnHover={false} image_src_base64={image_src_base64}></ImageCard>
    <button onClick={onCloseClick}>Close</button>
    </div>
}
