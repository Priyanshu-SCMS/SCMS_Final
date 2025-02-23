const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Env variables load karo
dotenv.config();


const PORT = process.env.PORT || 5000;

// Express App Initialize Karo
const app = express();
app.use(express.json());
app.use(cors());

const { upload, uploadFileToGCS } = require("./upload");

// File Upload API
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required!" });
    }
    const fileName = await uploadFileToGCS(req.file);
    res.json({ success: true, filePath: `https://storage.googleapis.com/smart-campus-files/${fileName}` });
  } catch (error) {
    console.error("File Upload Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const ResultModel = require("./models/ResultModel"); // Model Import Karo
const User = require('../models/User');


// Result Fetch API
app.post("/getResult", async (req, res) => {
  try {
    const { prn, motherName } = req.body;

    if (!prn || prn.length !== 16) {
      return res.status(400).json({ error: "PRN must be exactly 16 digits long!" });
    }
    if (!motherName) {
      return res.status(400).json({ error: "Mother's name is required!" });
    }

    // MongoDB Se Result Fetch Karo
    const studentResult = await ResultModel.findOne({ prn, motherName });

    if (!studentResult) {
      return res.status(404).json({ error: "Result not found!" });
    }

    res.json(studentResult);
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const path = require("path");
const authRoutes = require(path.join(__dirname, "routes", "auth.js"));
app.use("/api/auth", authRoutes);


// Fees API Routes Include Karo
const feesRoutes = require('./routes/fees');
app.use('/fees', feesRoutes);

// MongoDB Connection Function
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is missing in .env file!");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// Server Start Karo
app.listen(PORT,async() => {
  await connectDB();
  console.log(`Server running on port: http://localhost:${PORT} `);
}); 
