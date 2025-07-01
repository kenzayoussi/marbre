const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// CSV Writer setup
const csvFilePath = path.join(__dirname, 'contacts.csv');
const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
        {id: 'name', title: 'Name'},
        {id: 'email', title: 'Email'},
        {id: 'phone', title: 'Phone'},
        {id: 'message', title: 'Message'},
        {id: 'date', title: 'Date'}
    ],
    append: fs.existsSync(csvFilePath)
});

// Nodemailer transporter (replace with your SMTP config)
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // e.g., smtp.gmail.com for Gmail
    port: 587,
    secure: false,
    auth: {
        user: 'your@email.com',
        pass: 'yourpassword'
    }
});

app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    const date = new Date().toISOString();
    // Send email
    try {
        await transporter.sendMail({
            from: 'your@email.com',
            to: 'batlimousstone@gmail.com', // Change to your receiving email
            subject: 'Nouvelle commande',
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Failed to send email.' });
    }
    // Write to CSV
    try {
        await csvWriter.writeRecords([{ name, email, phone, message, date }]);
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Failed to save to CSV.' });
    }
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 