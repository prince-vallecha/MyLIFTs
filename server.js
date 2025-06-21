const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require('./config/db');
const User = require('./models/User');
const path = require('path');

const app = express();
const PORT = 5000;

// ✅ Middleware to parse JSON
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());  // Ensures JSON parsing works
app.use(express.static(path.join(__dirname)));

// Login route
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email: username });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({ message: "Login successful" });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// SWOT analysis route
app.post("/analyze", (req, res) => {
    const { Strength, Weakness, Opportunities, Threats } = req.body;
    console.log("Received Data:", req.body);

    if (!Strength || !Weakness || !Opportunities || !Threats) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    res.json({
        message: "SWOT analysis processed successfully!",
        Strength,
        Weakness,
        Opportunities,
        Threats
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
