import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext";

import styles from './QuestionUploader.module.css'
import { customFetch } from "./request";

export default function QuestionUploader() {
    const user = useContext(UserContext)
    // const [cardIds, setCardIds] = useState([])
    const [uploadResults, setUploadResults] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [displayedFile, setDisplayedFile] = useState(null)

    const cards = uploadResults.map((value) => {
        return <QuestionUploaderCard
            className={styles.QuestionUploaderCard}
            key={value.result_id} result_id={value.result_id} update_result={update_upload_result}
            user={user} remove_result={remove_upload_result} result={value.result}
            is_submitting={isSubmitting}></QuestionUploaderCard>
    })
    let verified_images = []
    for (let u of uploadResults) {
        const file = u.file
        if (file !== null
            && u.result?.success === true){
            verified_images.push(<ImageCard onClick={() => {
                    setDisplayedFile(file)
                }}
                key={u.result_id} file={file} width={'300px'} height={'300px'}></ImageCard>
            );
        }
    }
    // console.log(images);



    return <div className={styles.QuestionUploader}>
        {displayedFile !== null && <div className={styles.BigImageDisplayerOverlay}>
            <ImageCard file={displayedFile} width={'800px'} height={'500px'} onClick={()=>{}}
                reducedOpacityOnHover={false}></ImageCard>
            <button onClick={() => setDisplayedFile(null)}>Close</button>
        </div>
        }
        <div>
            <h2>Images Verified {verified_images.length} </h2>
            <button>Proceed to upload</button>
        </div>
        
        {verified_images.length>0 && <div className={styles.ImageCardContainer}>
            {verified_images}
        </div>}
        {cards}
        <button onClick={add_new_upload_result}>Add A New Question</button>
    </div>

    function remove_upload_result(target_id) {
        setUploadResults(
            prevUploadResults =>
                prevUploadResults.filter((value) => value.result_id !== target_id)
        )
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


function QuestionUploaderCard({ user, result_id, result, update_result, remove_result, is_submitting }) {
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

    return <div className={styles.QuestionUploaderCard}>
        <button onClick={() => { remove_result(result_id) }} disabled={is_submitting || isUploading}>Remove</button>
        <div>
            <input type='file' disabled={isUploading || is_submitting} ref={upload_file_ref}
                onChange={(e) => {
                    const new_file = e.target.files[0] ?? null
                    update_result(result_id, null, new_file)
                }}></input>
            <button disabled={isUploading || is_submitting} onClick={upload_question}>{result === null ? 'Upload' : 'Reupload'}</button>
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
                            option_images={result.data.option_images}
                        ></QuestionUploaderSections>
                    </>
                }
            </>
        }
    </div>

    async function upload_question() {
        if (upload_file_ref.current === null) {
            return
        }
        const files = upload_file_ref.current.files
        // console.log(files);
        if (files.length <= 0) {
            return
        }
        const file = files[0]
        // console.log(file.type);
        if (!file.type.startsWith('image')) {
            return
        }

        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('img', file)
            const response = await customFetch({ link: '/setter/verify_image', method: 'POST', body: formData, isFile: true })
            if (response.ok) {
                const new_result = await response.json()
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



export function QuestionUploaderSections({ extracted_image, question_images, option_images }) {

    const question_image_fragments = question_images.map((v, i) => {
        return <img className={styles.FragmentImage} key={i} src={`data:image/png;base64,${v}`}></img>
    })
    let option_image_fragments = []
    for (let i = 0; i < option_images.length; i += 4) {
        option_image_fragments.push(
            <div style={{ border: '2px solid black', margin: '2px' }} key={i}>
                <h5>Option {i / 4 + 1}</h5>
                <img className={styles.FragmentImage} key={i} src={`data:image/png;base64,${option_images[i]}`}></img>
                <img className={styles.FragmentImage} key={i + 1} src={`data:image/png;base64,${option_images[i + 1]}`}></img>
                <img className={styles.FragmentImage} key={i + 2} src={`data:image/png;base64,${option_images[i + 2]}`}></img>
                <img className={styles.FragmentImage} key={i + 3} src={`data:image/png;base64,${option_images[i + 3]}`}></img>
            </div>
        )
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
                {option_image_fragments}
            </div>
        </div>)
}


export function ImageCard({ file, width, height,onClick,reducedOpacityOnHover=true,image_src_base64=null}) {
    const [img_url, setImgURL] = useState(null)

    useEffect(
        () => {
            if (file == null || image_src_base64!=null) {
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
    if(image_src_base64===null && img_url===null){
        return null;
    }
    return (img_url!==null || image_src_base64!==null) && <img onClick={onClick} className={`${styles.ImageCard} ${
        reducedOpacityOnHover?`${styles.ReducedOpacityOnHover}`:''}`} style={{ width: width, height: height }} 
        src={img_url===null?image_src_base64:img_url}>
    </img>
}
