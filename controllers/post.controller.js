

const { PostModal } = require("../database").models;
const { error, success } = require("../constants/messages")
const { errorRes, successRes } = require("../utils/formatRes")
const { validationResult } = require("express-validator");
const fs = require('fs');

exports.createPost = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorRes(
                res,
                errors.mapped(),
                error.REQUIRED_FIELD,
                400
            )
            return;
        }
        const { title, description, image, tags } = req.body
        const recordFound = await PostModal.findOne({ title })
        if (recordFound) {
            errorRes(
                res,
                null,
                error.UNIQUE_POST,
                400
            )
            return;
        }

        let _tags = [];
        if (tags) {
            if (typeof tags == 'string') {
                _tags = tags.split(',')
            } else {
                _tags = tags
            }
        }

        const newRecord = new PostModal({ title, description, tags: _tags, image, userId: req.userId })
        const saved = await newRecord.save()
        if (!saved) {
            next(saved)
        }
        successRes(
            res,
            saved,
            success.SAVE,
            201
        )
        return;
    } catch (error) {
        next(error);
    }
}
exports.updatePost = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorRes(
                res,
                errors.mapped(),
                error.REQUIRED_FIELD,
                400
            )
            return;
        }
        const { _id, tags, ...restBody } = req.body
        const recordFound = await PostModal.findById(_id);
        if (!recordFound) {
            errorRes(
                res,
                errors.mapped(),
                error.NOT_FOUND,
                400
            )
            return;
        }
        if (recordFound.userId != req.userId) {
            errorRes(
                res,
                errors.mapped(),
                error.UNAUTHORIZED_ACTION,
                400
            )
            return;
        }

        let _tags = [];
        if (tags) {
            if (typeof tags == 'string') {
                _tags = tags.split(',')
            } else {
                _tags = tags
            }
        }

        const updated = await PostModal.updateOne(
            { _id },
            {
                $set: { ...restBody, updated: new Date().toISOString() },
                $addToSet: { tags: { $each: _tags } },
            }
        )
        if (!updated) {
            return next(updated)
        }

        const exist = fs.existsSync('public/uploads')
        if (exist) {
            fs.unlink(`public/uploads/${recordFound.image}`, (err) => {
                successRes(res, null, success.UPDATE, 201)
                return;
            })
        } else {
            successRes(res, null, success.UPDATE, 201)
        }
        return;
    } catch (error) {
        next(error);
    }
}
exports.listPost = async (req, res, next) => {
    try {
        PostModal.aggregate([
            {
                '$sort': {
                    'createdAt': -1
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': '_id',
                    'as': 'user'
                }
            }, {
                '$project': {
                    'title': 1,
                    'description': 1,
                    'tags': 1,
                    'created': 1,
                    'image': 1,
                    'username': {
                        '$arrayElemAt': [
                            '$user.username', -1
                        ]
                    }
                }
            }
        ]).exec(function (err, result) {
            if (err) {
                return next(err)
            }
            successRes(res, result, null, 200)
            return;
        })

    } catch (error) {
        next(error);
    }
}
exports.deletePost = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorRes(
                res,
                errors.mapped(),
                error.REQUIRED_FIELD,
                400
            )
            return;
        }
        const post = await PostModal.findById(req.params.id)
        if (!post) {
            errorRes(res, post, error.NOT_FOUND, 400)
            return;
        }

        if (post.userId != req.userId) {
            errorRes(
                res,
                errors.mapped(),
                error.UNAUTHORIZED_ACTION,
                400
            )
            return;
        }

        PostModal.deleteOne({ _id: req.params.id }, function (err, docs) {
            if (err) {
                return next(err)
            }
            const exist = fs.existsSync('public/uploads')
            if (exist) {
                fs.unlink(`public/uploads/${docs.image}`, (err) => {
                    successRes(res, null, success.DELETED, 201)
                    return;
                })
            } else {
                successRes(res, null, success.DELETED, 201)
            }

            return;
        })
    } catch (error) {
        next(error);
    }
}
exports.getPostByTitle = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorRes(
                res,
                errors.mapped(),
                error.REQUIRED_FIELD,
                400
            )
            return;
        }
        PostModal.aggregate([
            {
                '$match': {
                    'title': req.query.title
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': '_id',
                    'as': 'user'
                }
            }, {
                '$project': {
                    'title': 1,
                    'description': 1,
                    'tags': 1,
                    'createdAt': 1,
                    'image': 1,
                    'username': {
                        '$arrayElemAt': [
                            '$user.username', -1
                        ]
                    }
                }
            }
        ]).exec(function (err, result) {
            if (err) {
                return next(err)
            }
            successRes(res, result, null, 200)
            return;
        })

    } catch (error) {
        next(error);
    }
}
exports.searchPost = async (req, res, next) => {
    try {
        const { title = '', username = '', dateRange, tags } = req.query
        let _dateRange = [];
        if (dateRange) {
            _dateRange = typeof dateRange == 'string' ? dateRange.split(',') : dateRange
        }
        let _tags = [];
        if (tags) {
            _tags = typeof tags == 'string' ? tags.split(',') : tags
        }

        PostModal.aggregate([
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': '_id',
                    'as': 'user'
                }
            }, {
                '$project': {
                    'title': 1,
                    'description': 1,
                    'tags': 1,
                    'created': 1,
                    'image': 1,
                    'username': {
                        '$arrayElemAt': [
                            '$user.username', -1
                        ]
                    }
                }
            }, {
                '$match': {
                    '$or': [
                        {
                            'title': {
                                '$regex': title,
                                '$options': 'i'
                            }
                        }, {
                            'username': username
                        }, {
                            'created': {
                                '$gte': _dateRange[0],
                                '$lt': _dateRange[1]
                            }
                        }, {
                            'tags': {
                                '$in': _tags
                            }
                        }
                    ]
                }
            }
        ]).exec(function (err, result) {
            if (err) {
                return next(err)
            }
            successRes(res, result, null, 200)
            return;
        })

    } catch (error) {
        next(error);
    }
}

