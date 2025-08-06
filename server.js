const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const shopRoutes = require('./routes/shop');
const doctorsRoutes = require('./routes/doctors');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'grameenKrishiSecret',
    resave: false,
    saveUninitialized: true
}));

// Authentication middleware
const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    next();
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve dashboard pages
app.get('/farmer-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'farmer-dashboard.html'));
});

app.get('/doctor-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'doctor-dashboard.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', authMiddleware, appointmentRoutes);
app.use('/api/prescriptions', authMiddleware, prescriptionRoutes);
app.use('/api/payments', authMiddleware, require('./routes/payments'));
app.use('/api/shop', authMiddleware, shopRoutes);
app.use('/api/auth', doctorsRoutes); // Adding doctors route

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
