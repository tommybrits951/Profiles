const mongoose = require("mongoose");




const userSchema = new mongoose.Schema(
  {
    first_name: {
      required: true,
      trim: true,
      type: String,
      maxlength: 50
    },
    last_name: {
      required: true,
      type: String,
      trim: true,
      maxlength: 50
    },
    dob: {
      type: Date,
      required: true,
    },
    postal: {
      type: Number,
      length: 5,
      required: true,
    },
    gender: {
      type: String,
      default: "Private",
      emum: ["Private", "Male", "Female"]
    },
    email: {
      required: true,
      type: String,
      unique: true
    },
    password: {
      required: true,
      type: String
    },
    friends: [{
      friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      since: {
        type: Date,
        defualt: new Date()
      }
    }],
    requests: {
      sent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }],
      received: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }]
    },
    images: [{
      type: String
    }]
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('age').get(function() {
  if (!this.dob) return null;
  const today = new Date()
  const birth = new Date(this.dob)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
})

userSchema.virtual('full_name').get(function() {
  return `${this.first_name} ${this.last_name}`
}).set(function(v) {
  const first_name = v.substring(0, v.indexOf(" "))
  const last_name = v.substring(v.indexOf(" ") + 1)
  this.set({first_name, last_name})
})

module.exports = mongoose.model("User", userSchema);
