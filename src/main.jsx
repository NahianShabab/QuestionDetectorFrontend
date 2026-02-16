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


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home></Home>}>
          <Route path='profile' element={<Profile></Profile>}></Route>
          <Route path='upload-questions' element={<QuestionUploader></QuestionUploader>}></Route>
          <Route path='setter-questions' element={<SetterQuestions></SetterQuestions>}></Route>
          <Route path='composer-image' element={<ComposerImage/>}></Route>
        </Route>
        <Route path='/login' element={<Login></Login>}/>
      </Routes>
      
    </BrowserRouter>
)
