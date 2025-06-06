import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/** Custom Hook */
import { useFetchQestion } from '../hooks/FetchQuestion'
import { updateResult } from '../hooks/setResult'

export default function Questions({ onChecked, submitted, setSubmitted }) {

    const [checked, setChecked] = useState(undefined)
    const { trace } = useSelector(state => state.questions);
    const result = useSelector(state => state.result.result);
    const [{ isLoading, apiData, serverError}] = useFetchQestion() 

    const questions = useSelector(state => state.questions.queue[state.questions.trace])
    const dispatch = useDispatch()

    useEffect(() => {
        setChecked(undefined); // Reset checked when question changes
    }, [trace]);

    useEffect(() => {
        dispatch(updateResult({ trace, checked}))
    }, [checked])
    
    function onSelect(i){
        if (!submitted) {
            onChecked(i)
            setChecked(i)
            dispatch(updateResult({ trace, checked}))
        }
    }

    function handleSubmit() {
        if (checked !== undefined) {
            setSubmitted(true)
        }
    }

    if(isLoading) return <h3 className='text-light'>isLoading</h3>
    if (serverError) {
        return (
          <h3 className='text-light'>
            {typeof serverError === 'object' ? serverError.message : String(serverError)}
          </h3>
        );
      }
      
  return (
    <div className='questions'>
        <h2 className='text-light'>{questions?.question}</h2>

        <ul key={questions?.id}>
            {
                questions?.options.map((q, i) => (
                    <li key={i}>
                        <input 
                            type="radio"
                            value={false}
                            name="options"
                            id={`q${i}-option`}
                            onChange={() => onSelect(i)}
                            disabled={submitted}
                            checked={checked === i}
                        />

                        <label className='text-primary' htmlFor={`q${i}-option`}>{q}</label>
                        <div className={`check ${checked === i ? 'checked' : ''}`}></div>
                    </li>
                ))
            }
        </ul>

        {!submitted && (
            <button className='btn-submit' onClick={handleSubmit} disabled={checked === undefined}>
                Submit Answer
            </button>
        )}

        {submitted && (
            <div className='answer-section'>
                <p><strong>Correct Answer:</strong> {questions.correctAnswer}</p>
                <p><strong>Explanation:</strong> {questions.explanation}</p>
            </div>
        )}
    </div>
  )
}
