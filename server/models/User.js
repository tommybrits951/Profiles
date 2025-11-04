const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require('path')
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
      minlength: [2, "First name must be at least 2 characters"],
    },
    middleName: {
      type: String,
      required: false,
      maxlength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
      minlength: [2, "Last name must be at least 2 characters"],
    },

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
      type: String,
      required: false,
      trim: true,
    },

    phone: {
      type: Number,
      minlength: 10,
      maxlength: 10,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't include password in query results by default
    },
    city: {
      type: String,
      trim: true,
    },
    postal: {
      type: Number,
      minlength: 5,
      maxlength: 5,
      required: [true, "Postal code is required"],
    },
    state: {
      type: String,
      trim: true,
      enum: [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
        "DC",
        "AS",
        "GU",
        "MP",
        "PR",
        "UM",
        "VI",
      ],
    },
    country: {
      type: String,
      default: "USA",
      trim: true,
    },
    pic: {
      type: String,
      trim: true,
      default: '../images/profile/default.png'
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
    lastActive: {
      type: Date,
      default: Date.now,
    },
    lastModified: {
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
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



// Update dates before save
userSchema.pre("save", (next) => {
  this.lastModified = Date.now;
  this.lastActive = Date.now;
  next();
});

// Static Methods

// Query methods for email, postal, city and state
userSchema.static("findByEmail", function (email) {
  return this.findOne({ email: email }).populate("friends", "-password");
});

userSchema.static("findByPostal", (postal) => {
  return this.find({ postal: postal }).exec();
});

userSchema.static("findByLocation", (city, state) => {
  const query = {};
  if (city) query["location.city"] = city;
  if (state) query["location.state"] = state;
  return this.find(query);
});



// Friend requests
userSchema.method("sendFriendRequest", async (friendId) => {
  const existingRequest = await this.friends.find(
    (f) => f.friend.toString() === friendId.toString()
  );
  if (existingRequest) {
    throw new Error("Friend Request Already Exists");
  }
  this.friends.push({
    friend: friendId,
    status: "pending",
    since: Date.now,
  });
  return await this.save();
});

userSchema.method("acceptFriendRequest", async (friendId) => {
  const request = await this.friends.findOne({
    friend: friendId,
    status: "pending",
  });
  if (!request) {
    throw new Error("Couldn't find friend request.");
  }
  request.status = "accepted";
  return await this.save();
});

userSchema.method("removeFriend", async (friendId) => {
  this.friends = this.friends.filter(
    (f) => f.friend.toString() !== friendId.toString()
  );
  return await this.save();
});

userSchema.method("isFriend", (friendId) => {
  return this.friends.some(
    (f) =>
      f.friend.toString() === friendId.toString() && f.status === "accepted"
  );
});



module.exports = mongoose.model("User", userSchema);
