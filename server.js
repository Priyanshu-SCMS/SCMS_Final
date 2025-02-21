const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Env variables load karo
dotenv.config();

// Express App Initialize Karo
const app = express();
app.use(express.json());
app.use(cors());


const { upload, uploadFileToGCS } = require("./upload");

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileName = await uploadFileToGCS(req.file);
    res.json({ success: true, filePath: `https://storage.googleapis.com/smart-campus-files/${fileName}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const ResultModel = require("./models/ResultModel"); // Model Import Karo

// Result Fetch Karne Ka API
app.post("/getResult", async (req, res) => {
  try {
    const { prn, motherName } = req.body;

    // **Validation: PRN 15 Digits Ka Hona Chahiye**
    if (!prn || prn.length !== 15) {
      return res.status(400).json({ error: "PRN must be exactly 15 digits long!" });
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



// MongoDB Connect Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// Server Start Function
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
