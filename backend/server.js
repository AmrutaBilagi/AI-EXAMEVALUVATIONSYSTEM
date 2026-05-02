const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Initialize SQLite DB
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      usn TEXT UNIQUE
    )`);

    // Create Exams Table
    db.run(`CREATE TABLE IF NOT EXISTS exams (
      exam_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      subject TEXT,
      total_marks INTEGER,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create Questions Table
    db.run(`CREATE TABLE IF NOT EXISTS questions (
      question_id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER,
      question_number TEXT,
      question_text TEXT,
      marks INTEGER,
      answer_type TEXT
    )`);

    // Create Model Answers Table
    db.run(`CREATE TABLE IF NOT EXISTS model_answers (
      model_answer_id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER,
      question_id INTEGER,
      answer_text TEXT,
      keywords TEXT
    )`);

    // Create Files Table
    db.run(`CREATE TABLE IF NOT EXISTS files (
      file_id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER,
      file_type TEXT,
      file_path TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Register Endpoint
app.post('/api/register', (req, res) => {
  const { name, email, password, role, usn } = req.body;
  const finalUsn = (usn && usn.trim() !== '') ? usn.trim() : null;
  const query = `INSERT INTO users (name, email, password, role, usn) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [name, email, password, role, finalUsn], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, email, role, usn: finalUsn });
    console.log(`[BACKEND LOG] New User Registered: ${name} (${role})`);
  });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(query, [email, password], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (row) {
      res.json({ id: row.id, name: row.name, email: row.email, role: row.role, usn: row.usn });
      console.log(`[BACKEND LOG] User Logged In: ${row.name} (${row.role})`);
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });
});

// Admin Endpoint to see all users (Developer View)
app.get('/api/users', (req, res) => {
  db.all(`SELECT id, name, email, role, usn FROM users`, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Upload and Parse Question Paper
app.post('/api/upload-exam-materials', upload.fields([{ name: 'questionPaper' }, { name: 'modelAnswer' }]), async (req, res) => {
  try {
    const qpFile = req.files['questionPaper']?.[0];
    const maFile = req.files['modelAnswer']?.[0];

    if (!qpFile || !maFile) {
      return res.status(400).json({ error: 'Both files are required.' });
    }

    // Basic PDF parsing logic using pdf-parse@1.1.1
    const qpData = await pdfParse(fs.readFileSync(qpFile.path));
    const maData = await pdfParse(fs.readFileSync(maFile.path));

    const qpText = qpData.text;
    const maText = maData.text;

    // Advanced Regex for real-world question parsing (handles "1.", "Q1", "Question 1")
    const questions = [];
    const questionRegex = /(?:Q(?:uestion)?\s*)?(\d+)[\.\)]\s*(.*?)(?=\n(?:Q(?:uestion)?\s*)?\d+[\.\)]|$)/gis;
    let match;
    
    while ((match = questionRegex.exec(qpText)) !== null) {
      // Find marks in the question text e.g. [5], (5 marks), 5M
      const marksMatch = match[2].match(/(?:\[|\()?\s*(\d+)\s*(?:marks?|m)(?:\]|\))?/i);
      const marks = marksMatch ? parseInt(marksMatch[1], 10) : 5; // default 5

      questions.push({
        question_number: `Q${match[1]}`,
        question_text: match[2].trim(),
        marks: marks,
        model_answer: "Auto-extracted answer context needs review." // Real NLP would match this
      });
    }

    // Fallback if regex fails (e.g., standard unstructured text)
    if (questions.length === 0 && qpText.length > 0) {
      questions.push({
        question_number: 'Q1',
        question_text: qpText.substring(0, 200) + '...',
        marks: 10,
        model_answer: maText.substring(0, 200) + '...'
      });
    }

    res.json({
      message: 'Files uploaded and parsed successfully',
      files: {
        qpPath: qpFile.path,
        maPath: maFile.path
      },
      parsedQuestions: questions
    });
  } catch (error) {
    console.error('Error processing files', error);
    res.status(500).json({ error: 'Failed to process files.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
