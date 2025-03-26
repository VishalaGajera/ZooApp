require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./Config/Database');
const UserRouter = require('./Routes/UserRoutes');
const AdoptionRouter = require('./Routes/AdoptionRoutes');
const FeedbackRouter = require('./Routes/FeedbackRoutes');
const AdminRouter = require('./Routes/AdminRoutes');

const app = express();
app.use(cors());
app.use(express.json());

connectDatabase();

// Routes
app.use("/api/admin", AdminRouter);
app.use("/api/user", UserRouter);
app.use("/api/adoption", AdoptionRouter);
app.use("/api/feedback", FeedbackRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is Running on PORT: ${PORT}`)
})