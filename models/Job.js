const mongoose = require('mongoose');

const JobsSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'You must provide a company!'],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, 'You must provide a position!'],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'You must provide a user!'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Jobs', JobsSchema);
