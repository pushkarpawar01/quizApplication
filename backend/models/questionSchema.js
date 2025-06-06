import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    id: Number,
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
});

export default mongoose.model('Question', questionSchema);
