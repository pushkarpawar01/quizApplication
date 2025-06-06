import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Use relative paths with forward slashes
import { questions, answers } from './data.js';
// Fix the path to point to the correct location
import Question from '../models/questionSchema.js';

dotenv.config();

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Optional: clear previous data
        await Question.deleteMany();

        // Create data with both questions and answers
        const questionData = questions.map((q, i) => ({
            ...q,
            correctAnswer: answers[i]
        }));

        await Question.insertMany(questions);
        console.log('✅ Questions seeded successfully.');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();
