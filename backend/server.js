const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

    // Create Submissions Table
    db.run(`CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      exam_id INTEGER,
      file_path TEXT,
      score INTEGER,
      max_marks INTEGER,
      status TEXT,
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

// Admin Stats Endpoint
app.get('/api/admin/stats', async (req, res) => {
  try {
    const getUsers = () => new Promise((resolve, reject) => {
      db.all(`SELECT role, count(*) as count FROM users GROUP BY role`, [], (err, rows) => {
        if (err) reject(err); else resolve(rows);
      });
    });

    const getExamsCount = () => new Promise((resolve, reject) => {
      db.get(`SELECT count(*) as count FROM exams`, [], (err, row) => {
        if (err) reject(err); else resolve(row ? row.count : 0);
      });
    });

    const getSubmissionsCount = () => new Promise((resolve, reject) => {
      db.get(`SELECT count(*) as count FROM submissions`, [], (err, row) => {
        if (err) reject(err); else resolve(row ? row.count : 0);
      });
    });

    const getActivity = () => new Promise((resolve, reject) => {
      db.all(`
        SELECT date(uploaded_at) as date, count(*) as submissionsCount
        FROM submissions 
        GROUP BY date(uploaded_at)
        ORDER BY date(uploaded_at) DESC
        LIMIT 7
      `, [], (err, rows) => {
        if (err) reject(err); else resolve(rows);
      });
    });

    const [userRoles, examsCount, submissionsCount, activityData] = await Promise.all([
      getUsers(), getExamsCount(), getSubmissionsCount(), getActivity()
    ]);

    const usersList = await new Promise((resolve, reject) => {
      db.all(`SELECT id, role FROM users`, [], (err, rows) => {
        if (err) reject(err); else resolve(rows);
      });
    });

    res.json({
      users: usersList,
      roles: userRoles,
      examsCount,
      submissionsCount,
      activity: activityData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload and Parse Question Paper
app.post('/api/upload-exam-materials', upload.fields([{ name: 'questionPaper' }, { name: 'modelAnswer' }]), async (req, res) => {
  try {
    const qpFile = req.files['questionPaper']?.[0];
    const maFile = req.files['modelAnswer']?.[0];

    if (!qpFile || !maFile) {
      return res.status(400).json({ error: 'Both files are required.' });
    }

    // Advanced PDF parsing using PyMuPDF (fitz) via python
    const extractText = (filePath) => {
      try {
        return execSync(`python extract_pdf.py "${filePath}"`).toString('utf-8');
      } catch (err) {
        console.error('Failed to extract PDF text', err);
        return '';
      }
    };

    const qpText = extractText(qpFile.path);
    const maText = extractText(maFile.path);

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

    res.json({
      message: 'Files uploaded and parsed successfully',
      files: {
        qpPath: qpFile.path,
        maPath: maFile.path
      },
      parsedQuestions: questions,
      rawText: questions.length === 0 ? qpText : null
    });
  } catch (error) {
    console.error('Error processing files', error);
    res.status(500).json({ error: 'Failed to process files.' });
  }
});

// Upload Answer Sheet
app.post('/api/upload-answer-sheet', upload.single('answerSheet'), (req, res) => {
  const { examId, userId } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: 'Answer sheet is required.' });
  }

  // Mock AI Evaluation Score
  const score = Math.floor(Math.random() * 40) + 60; // Random score between 60 and 100
  const max_marks = 100;

  const query = `INSERT INTO submissions (user_id, exam_id, file_path, score, max_marks, status) VALUES (?, ?, ?, ?, ?, 'Evaluated')`;
  db.run(query, [userId, examId || 1, req.file.path, score, max_marks], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Answer sheet uploaded and evaluated', score, max_marks, id: this.lastID });
  });
});

// Save Exam
app.post('/api/save-exam', (req, res) => {
  const { title, subject, totalMarks, questions, createdBy } = req.body;
  
  if (!questions || !questions.length) {
    return res.status(400).json({ error: 'Questions are required.' });
  }

  db.run(`INSERT INTO exams (title, subject, total_marks, created_by) VALUES (?, ?, ?, ?)`, 
    [title || 'Midterm Exam', subject || 'Computer Science', totalMarks || 100, createdBy || 1], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      const examId = this.lastID;

      const stmtQ = db.prepare(`INSERT INTO questions (exam_id, question_number, question_text, marks) VALUES (?, ?, ?, ?)`);
      const stmtA = db.prepare(`INSERT INTO model_answers (exam_id, question_id, answer_text) VALUES (?, ?, ?)`);

      questions.forEach((q, index) => {
        stmtQ.run([examId, q.question_number, q.question_text, q.marks], function(errQ) {
          if (!errQ) {
            stmtA.run([examId, this.lastID, q.model_answer]);
          }
        });
      });

      stmtQ.finalize();
      stmtA.finalize();

      res.json({ message: 'Exam saved successfully', examId });
  });
});

// Get Teacher Submissions
app.get('/api/teacher/submissions', (req, res) => {
  const query = `
    SELECT s.id, s.score, s.max_marks, s.status, u.name, u.usn 
    FROM submissions s 
    LEFT JOIN users u ON s.user_id = u.id
    ORDER BY s.uploaded_at DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get Student Results
app.get('/api/student/results/:userId', (req, res) => {
  const query = `
    SELECT s.id, s.score, s.max_marks, s.status, s.uploaded_at, e.title as exam_title
    FROM submissions s
    LEFT JOIN exams e ON s.exam_id = e.exam_id
    WHERE s.user_id = ?
    ORDER BY s.uploaded_at DESC
  `;
  db.all(query, [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Edit User
app.put('/api/users/:id', (req, res) => {
  const { name, role } = req.body;
  const query = `UPDATE users SET name = ?, role = ? WHERE id = ?`;
  db.run(query, [name, role, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated' });
  });
});

// Delete User
app.delete('/api/users/:id', (req, res) => {
  db.run(`DELETE FROM users WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
