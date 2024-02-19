require("dotenv").config();

const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Blog = require('./models/blog');

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

console.log("My name is:", process.env.myname);

const app = express();
const PORT = process.env.PORT || 8000;

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB connected"));    // Local-host URL: "mongodb://localhost:27017/blogify"

// Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve("./public")));

// View-engine
app.set("view engine", "ejs");
app.set('views', path.resolve('./views'));

// Routes
app.get("/", async (req, res) => {
    const allBlog = await Blog.find({}).sort({'ctreatedAt': -1});

    res.render("home", {
        user: req.user,
        blogs: allBlog
    });
});

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

// Starting the server
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));