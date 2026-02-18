import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.jsx'
import { BrowserRouter } from 'react-router'
import { Routes,Route } from 'react-router'
import Login from './Login.jsx'
import Profile from './Profile.jsx'
import QuestionUploader from './QuestionUploader.jsx'
import SetterQuestions from './SetterQuestions'
import ComposerImage from './ComposerImage.jsx'
import Tutorial from './Tutorial.jsx'
import { Link } from 'react-router'
import DownloadQuestionForm from './DownloadQuestionForm.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home></Home>}>
          <Route index element={
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <h1>Welcome to Question Uploader Website</h1>
               <h3>
                ❖ View the Tutorial <Link to={'/tutorial'}>video</Link>
              </h3>
              <div><DownloadQuestionForm></DownloadQuestionForm></div> 
            </div>
           
          }></Route>
          <Route path='profile' element={<Profile></Profile>}></Route>
          <Route path='upload-questions' element={<QuestionUploader></QuestionUploader>}></Route>
          <Route path='setter-questions' element={<SetterQuestions></SetterQuestions>}></Route>
          <Route path='composer-image' element={<ComposerImage/>}></Route>
          <Route path='tutorial' element={<Tutorial></Tutorial>}></Route>
        </Route>
        <Route path='/login' element={<Login></Login>}/>
      </Routes>
      
    </BrowserRouter>
)
