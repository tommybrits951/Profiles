const mongoose = require('mongoose');

const { Schema } = mongoose;

// Nested schema for comment replies
const replySchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	text: { type: String, required: true, trim: true, maxlength: 1000 },
	image: { type: String, default: null },
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true, _id: true });

// Comment schema (can contain replies)
const commentSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	text: { type: String, required: true, trim: true, maxlength: 2000 },
	image: { type: String, default: null },
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	replies: [replySchema]
}, { timestamps: true, _id: true });

// Main Post schema
const postSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true, trim: true, maxlength: 5000 },
	images: [{ type: String, default: null }],
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	comments: [commentSchema],
	visibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' }
}, {
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

// Virtuals for quick counts
postSchema.virtual('likesCount').get(function() {
	return this.likes ? this.likes.length : 0;
});

postSchema.virtual('commentsCount').get(function() {
	return this.comments ? this.comments.length : 0;
});

commentSchema.virtual('likesCount').get(function() {
	return this.likes ? this.likes.length : 0;
});

commentSchema.virtual('repliesCount').get(function() {
	return this.replies ? this.replies.length : 0;
});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;

