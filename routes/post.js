"use strict";

const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/uploadFiles");
const { createPost, updatePost, listPost, deletePost, getPostByTitle, searchPost } = require("../controllers/post.controller");
const { createValidator,updateValidator, deleteValidator,singlePostValidator } = require('../validators/post.validator')


router
    .post("/create", upload.single('image'), createValidator, createPost) 
    .get("/list", listPost) 
    .get("/get",singlePostValidator, getPostByTitle)
    .get("/search", searchPost)
    .put("/update", upload.single('image'),updateValidator, updatePost) 
    .delete("/delete/:id", deleteValidator, deletePost)


module.exports = router;