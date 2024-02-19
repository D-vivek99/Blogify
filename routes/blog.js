const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.resolve('./public/uploads/'));
    },
    filename: function (req, file, cb){
        cb(null, `${Date.now()}_${file.originalname}`);
    }
})

const upload = multer({storage: storage});

const router = Router();

router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user
    });
})

router.post("/", upload.single('coverImage'), async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    const {title, body} = req.body;
    const blog = await Blog.create({
        title: title,
        body: body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })

    return res.redirect(`/blog/${blog._id}`);
})

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

    if(!blog) return res.redirect("/");

    return res.render("blog", {
        user: req.user,
        blog,
        comments
    });
})

router.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })

    return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports = router;