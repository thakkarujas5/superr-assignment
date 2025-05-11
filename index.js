const express = require('express');


const app = express();

app.use(express.json())

const eventRoutes = require('./routes/eventRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/reports', reportRoutes);

app.listen(5005, () => {
    console.log("Server running")
});




