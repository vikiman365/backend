const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const uri = 'mongodb+srv://pm288199:Ajib2536@signup.iwobj.mongodb.net/?retryWrites=true&w=majority&appName=signup';

async function connectDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

connectDB();

const userSchema = new mongoose.Schema({
   
    
    name: { type: String, unique: true, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('MongoDB Node.js Project Running!');
});
app.post('/register', async (req, res) => {
    try {
        const { name, pass, user_id_victim, type } = req.body;

        if (!name || !pass) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newUser = new User({
            name,
            password: pass,  // WARNING: Use bcrypt for hashing in production
            user_id_victim,
            type
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { mongoose, User };
