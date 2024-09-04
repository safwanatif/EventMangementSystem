const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Upload folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Use your MySQL username
    password: 'Pass213095',  // Use your MySQL password
    database: 'event_management'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('MySQL Connected...');
});

// Create event with image upload
app.post('/event', upload.single('venueImage'), (req, res) => {
    console.log('POST /event received');
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    const { name, date, location, description } = req.body;
    const venueImage = req.file ? req.file.filename : null;

    const sql = 'INSERT INTO events (name, date, location, description, venue_image) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, date, location, description, venueImage], (err, result) => {
        if (err) {
            console.error('Error inserting event:', err);
            res.status(500).send('Error creating event');
            return;
        }
        res.send('Event created...');
    });
});

// Get all events with pagination
app.get('/events', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Accept 'limit' as a query parameter or default to 5
    const offset = (page - 1) * limit;

    const sql = 'SELECT * FROM events LIMIT ? OFFSET ?';
    db.query(sql, [limit, offset], (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            res.status(500).send('Error fetching events');
            return;
        }

        db.query('SELECT COUNT(*) as count FROM events', (err, countResult) => {
            if (err) {
                console.error('Error fetching event count:', err);
                res.status(500).send('Error fetching event count');
                return;
            }

            const totalEvents = countResult[0].count;
            const totalPages = Math.ceil(totalEvents / limit);

            res.json({
                events: results,
                totalPages: totalPages,
                currentPage: page
            });
        });
    });
});

// Get a single event by ID
app.get('/event/:id', (req, res) => {
    const sql = 'SELECT * FROM events WHERE id = ?';
    const eventId = req.params.id;  // Get the ID from the URL
    db.query(sql, [eventId], (err, result) => {
        if (err) {
            console.error('Error fetching event:', err);
            res.status(500).send('Error fetching event');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Event not found');
        } else {
            res.json(result[0]); // Send the first (and only) result as JSON
        }
    });
});

// Update event
app.put('/event/:id', (req, res) => {
    const { name, date, location, description } = req.body;
    const sql = 'UPDATE events SET name = ?, date = ?, location = ?, description = ? WHERE id = ?';
    db.query(sql, [name, date, location, description, req.params.id], (err, result) => {
        if (err) {
            console.error('Error updating event:', err);
            res.status(500).send('Error updating event');
            return;
        }
        res.send('Event updated...');
    });
});

// Delete event
app.delete('/event/:id', (req, res) => {
    const sql = 'DELETE FROM events WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting event:', err);
            res.status(500).send('Error deleting event');
            return;
        }
        res.send('Event deleted...');
    });
});

// Serve uploaded images from a different folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



//CONTACT US
/*
// Contact Us endpoint
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

    const sql = 'INSERT INTO contact_us (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error inserting contact form data:', err);
            res.status(500).send('Error submitting form');
            return;
        }
        res.send('Message sent successfully.');
    });
});





app.get('/contact', (req, res) => {
    const sql = 'SELECT * FROM contact_us';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching contact messages:', err);
            res.status(500).send('Error fetching contact messages');
            return;
        }
        res.json(results);
    });
});

*/

app.post('/contact', upload.none(), (req, res) => { // Use upload.none() to handle form submissions without files
    const { name, email, message } = req.body;
    console.log('Contact form data:', req.body);

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

    const sql = 'INSERT INTO contact_us (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error inserting contact form data:', err);
            res.status(500).send('Error submitting form');
            return;
        }
        res.send('Message sent successfully.');
    });
});

// Get all contact messages
app.get('/contact', (req, res) => {
    const sql = 'SELECT * FROM contact_us';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching contact messages:', err);
            res.status(500).send('Error fetching contact messages');
            return;
        }
        res.json(results);
    });
});

// Start the server
app.listen(3001, () => {
    console.log('Server started on port 3001...');
});