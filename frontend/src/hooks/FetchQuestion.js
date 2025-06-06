import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { getServerData, postServerData } from "../helper/helper";

/** redux actions */
import * as Action from '../redux/question_reducer'

/** fetch question hook to fetch api data and set value to store */
export const useFetchQestion = () => {
    const dispatch = useDispatch();   
    const [getData, setGetData] = useState({ isLoading : false, apiData : [], serverError: null});

    useEffect(() => {
        setGetData(prev => ({...prev, isLoading : true}));

        /** async function fetch backend data */
        (async () => {
            try {
                const topic = localStorage.getItem('quizTopic') || '';
                if(topic) {
                    const { questions } = await postServerData(`${import.meta.env.VITE_SERVER_HOSTNAME}/api/questions/generate`, { topic }, data => data);
                    if(questions.length > 0){
                        setGetData(prev => ({...prev, isLoading : false}));
                        setGetData(prev => ({...prev, apiData : questions}));

                        /** dispatch an action */
                        dispatch(Action.startExamAction({ question : questions, answers: questions.map(q => q.correctAnswer) }))

                    } else{
                        throw new Error("No Question Available");
                    }
                } else {
                    throw new Error("No topic provided");
                }
            } catch (error) {
                setGetData(prev => ({...prev, isLoading : false}));
                setGetData(prev => ({...prev, serverError : error}));
            }
        })();
    }, [dispatch]);

    return [getData, setGetData];
}


/** MoveAction Dispatch function */
export const MoveNextQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.moveNextAction()); /** increase trace by 1 */
    } catch (error) {
        console.log(error)
    }
}

/** PrevAction Dispatch function */
export const MovePrevQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.movePrevAction()); /** decrease trace by 1 */
    } catch (error) {
        console.log(error)
    }
}