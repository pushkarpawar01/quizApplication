import '../styles/App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

/** import components */
import Main from './Main';
import Quiz from './Quiz';
import Result from './Result';
import Login from './Login';
import Register from './Register';
import TopicInput from './TopicInput';
import { CheckUserExist } from '../helper/helper';


/** react routes */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Register />
  },
  {
    path : '/login',
    element : <Login />
  },
  {
    path : '/register',
    element : <Register />
  },
  {
    path : '/topic',
    element : <CheckUserExist><Main /></CheckUserExist>
  },
  {
    path : '/quiz',
    element : <CheckUserExist><Quiz /></CheckUserExist>
  },
  {
    path : '/result',
    element : <CheckUserExist><Result /></CheckUserExist>
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
