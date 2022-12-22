"use strict";

const Mongoose = require("mongoose");

const PostSchema = new Mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        min: [3, 'Length at least 3 chr'],
        max: [20, 'Length not greater than 20 chr']
    },
    description: {
        type: String,
        trim: true,
        required: true,
        min: [10, 'Length at least 10 chr'],
        max: [3000, 'Length not greater than 3000 chr']
    },
    tags: {
        type: Array,
        trim: true,
        default: []
    },
    image: {
        type: String,
        trim: true,
        required: true,

    },
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true
    },
    created: { type: String },
    updated: { type: String }
}, {
    timestamps: false,
    versionKey: false
});

PostSchema.pre('save', function (next) {
    this.created = new Date().toISOString()
    this.updated = new Date().toISOString()
    next();
});




exports.PostModal = Mongoose.model("post", PostSchema);
