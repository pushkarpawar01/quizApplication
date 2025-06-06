import Questions from '../models/questionSchema.js';
import Results from '../models/resultSchema.js';
import {questions, answers } from '../database/data.js';

export async function getQuestions(req, res){
    try {
        const questions = await Questions.find();
        const answers = questions.map(q => q.correctAnswer);
        res.json([{ questions, answers }]);
    } catch (error) {
        res.json({ error })
    }
}
export async function insertQuestions(req, res){
    
        Questions.insertMany({ questions, answers });
    
}

export async function dropQuestions(req,res){
    try {
        await Questions.deleteMany();
        res.json({ msg: "Questions deleted successfully"})
    } catch (error) {
        res.json({ error })
    }
}

export async function getResult(req,res){
    try {
        const r = await Results.find();
        res.json(r);
    } catch (error) {
        res.json({ error })
    }
}

export async function storeResult(req, res) {
  try {
    const { username, result, attempts, points, achieved } = req.body;

    if (!username || !result) {
      return res.status(400).json({ error: "Data Not Provided...!" });
    }

    const data = await Results.create({ username, result, attempts, points, achieved });

    res.status(200).json({ msg: "Result Saved Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export async function dropResult(req,res){
    try {
        await Results.deleteMany();
        res.json({ msg: "Results deleted successfully"})
    } catch (error) {
        res.json({ error })
    }
}