const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    handle: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["PUBLIC", "OFFICIAL", "ADMIN"],
      default: "PUBLIC"
    },
    bio: { 
        type: String, default: '' 
    },
    avatarUrl: { 
        type: String, default: '' 
    },

     // social / stats
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, default: 0 },

    // counts for quick reads (keep in sync in code)
    counts: {
      posts: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      submittedIssues: { type: Number, default: 0 }
    },

    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
