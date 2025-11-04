const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxlength: [50, "First name cannot exceed 50 characters"],
        minlength: [2, "First name must be at least 2 characters"],
      },
      middle: {
        type: String,
        required: false,
        maxlength: 50,
        trim: true,
      },
      last: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        maxlength: [50, "Last name cannot exceed 50 characters"],
        minlength: [2, "Last name must be at least 2 characters"],
      },
    },
    info: {
      dob: {
        type: Date,
        required: [true, "Date of birth is required"],
      },
      gender: {
        type: String,
        default: "Private",
        enum: {
          values: ["Private", "Male", "Female"],
          message: "{VALUE} is not a valid gender option",
        },
      },
      bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot exceed 500 characters"],
      },
      interests: [
        {
          type: String,
          trim: true,
        },
      ],
      occupation: {
        title: {
          type: String,
          trim: true,
        },
        company: {
          type: String,
          trim: true,
        },
      },
    },
    contact: {
      phone: {
        type: String,
        minLength: 10,
        maxLength: 15,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false,
      },
    },
    location: {
      city: {
        type: String,
        trim: true,
      },
      postal: {
        type: String,
        minLength: 5,
        maxLength: 10,
        required: [true, "Postal code is required"],
      },
      state: {
        type: String,
        trim: true,
        enum: [
          "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
          "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
          "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
          "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
          "DC", "AS", "GU", "MP", "PR", "UM", "VI",
        ],
      },
      country: {
        type: String,
        default: "USA",
        trim: true,
      },
    },
    social: {
      website: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
      linkedin: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
    },
    friends: [
      {
        friend: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        since: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "blocked"],
          default: "pending",
        },
      },
    ],
    privacy: {
      profile: {
        type: String,
        enum: ["public", "friends", "private"],
        default: "public",
      },
      posts: {
        type: String,
        enum: ["public", "friends", "private"],
        default: "public",
      },
      friends: {
        type: String,
        enum: ["private", "public", "friends"],
        default: "public",
      },
    },
    status: {
      lastActive: {
        type: Date,
        default: Date.now,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== VIRTUALS ====================

// Fixed virtual for full name
userSchema.virtual("full_name").get(function () {
  const parts = [this.name.first];
  if (this.name.middle) parts.push(this.name.middle);
  parts.push(this.name.last);
  return parts.join(" ");
});

// Virtual for age calculation
userSchema.virtual("age").get(function () {
  if (!this.info.dob) return null;
  const today = new Date();
  const birthDate = new Date(this.info.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for friend count
userSchema.virtual("friendCount").get(function () {
  return this.friends.filter((f) => f.status === "accepted").length;
});

// ==================== MIDDLEWARE ====================

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("contact.password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.contact.password = await bcrypt.hash(this.contact.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastActive timestamp
userSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.status.lastActive = Date.now();
  }
  next();
});

// ==================== INSTANCE METHODS ====================

// Compare password for authentication
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.contact.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// Get public profile (respecting privacy settings)
userSchema.methods.getPublicProfile = function (requestingUserId = null) {
  const profile = {
    _id: this._id,
    full_name: this.full_name,
    status: {
      isVerified: this.status.isVerified,
      lastActive: this.status.lastActive,
    },
  };

  const isFriend = this.friends.some(
    (f) => f.friend.toString() === requestingUserId?.toString() && f.status === "accepted"
  );

  // Profile visibility
  if (this.privacy.profile === "public" || 
      (this.privacy.profile === "friends" && isFriend) ||
      this._id.toString() === requestingUserId?.toString()) {
    profile.info = this.info;
    profile.location = this.location;
    profile.social = this.social;
    profile.age = this.age;
  }

  // Friends visibility
  if (this.privacy.friends === "public" || 
      (this.privacy.friends === "friends" && isFriend) ||
      this._id.toString() === requestingUserId?.toString()) {
    profile.friendCount = this.friendCount;
  }

  return profile;
};

// Send friend request
userSchema.methods.sendFriendRequest = async function (targetUserId) {
  // Check if already friends or request exists
  const existingRequest = this.friends.find(
    (f) => f.friend.toString() === targetUserId.toString()
  );

  if (existingRequest) {
    throw new Error("Friend request already exists or users are already friends");
  }

  this.friends.push({
    friend: targetUserId,
    status: "pending",
  });

  return await this.save();
};

// Accept friend request
userSchema.methods.acceptFriendRequest = async function (friendUserId) {
  const friendRequest = this.friends.find(
    (f) => f.friend.toString() === friendUserId.toString() && f.status === "pending"
  );

  if (!friendRequest) {
    throw new Error("Friend request not found");
  }

  friendRequest.status = "accepted";
  return await this.save();
};

// Remove friend
userSchema.methods.removeFriend = async function (friendUserId) {
  this.friends = this.friends.filter(
    (f) => f.friend.toString() !== friendUserId.toString()
  );
  return await this.save();
};

// Block user
userSchema.methods.blockUser = async function (userId) {
  const existingEntry = this.friends.find(
    (f) => f.friend.toString() === userId.toString()
  );

  if (existingEntry) {
    existingEntry.status = "blocked";
  } else {
    this.friends.push({
      friend: userId,
      status: "blocked",
    });
  }

  return await this.save();
};

// Check if users are friends
userSchema.methods.isFriendsWith = function (userId) {
  return this.friends.some(
    (f) => f.friend.toString() === userId.toString() && f.status === "accepted"
  );
};

// Update last active timestamp
userSchema.methods.updateActivity = async function () {
  this.status.lastActive = Date.now();
  return await this.save();
};

// Add interest
userSchema.methods.addInterest = async function (interest) {
  if (!this.info.interests.includes(interest)) {
    this.info.interests.push(interest);
    return await this.save();
  }
  return this;
};

// Remove interest
userSchema.methods.removeInterest = async function (interest) {
  this.info.interests = this.info.interests.filter((i) => i !== interest);
  return await this.save();
};

// ==================== STATIC METHODS ====================

// Find user by email (fixed)
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ "contact.email": email }).populate("friends.friend", "-contact.password");
};

// Find users by location
userSchema.statics.findByLocation = function (city, state) {
  const query = {};
  if (city) query["location.city"] = new RegExp(city, "i");
  if (state) query["location.state"] = state;
  return this.find(query);
};

// Find users by interests
userSchema.statics.findByInterests = function (interests) {
  return this.find({ "info.interests": { $in: interests } });
};

// Find active users
userSchema.statics.findActiveUsers = function (lastActiveDays = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - lastActiveDays);
  
  return this.find({
    "status.lastActive": { $gte: cutoffDate },
    "status.isActive": "active",
  });
};

// Search users by name
userSchema.statics.searchByName = function (searchTerm) {
  const regex = new RegExp(searchTerm, "i");
  return this.find({
    $or: [
      { "name.first": regex },
      { "name.last": regex },
    ],
  });
};

// Get verified users
userSchema.statics.findVerifiedUsers = function () {
  return this.find({ "status.isVerified": true, "status.isActive": "active" });
};

// Get user statistics
userSchema.statics.getUserStats = async function () {
  const totalUsers = await this.countDocuments();
  const activeUsers = await this.countDocuments({ "status.isActive": "active" });
  const verifiedUsers = await this.countDocuments({ "status.isVerified": true });
  
  return {
    total: totalUsers,
    active: activeUsers,
    verified: verifiedUsers,
    inactive: totalUsers - activeUsers,
  };
};

// ==================== INDEXES ====================

userSchema.index({ "contact.email": 1 });
userSchema.index({ "name.first": 1, "name.last": 1 });
userSchema.index({ "location.city": 1, "location.state": 1 });
userSchema.index({ "status.lastActive": -1 });
userSchema.index({ "info.interests": 1 });

module.exports = mongoose.model("User", userSchema);