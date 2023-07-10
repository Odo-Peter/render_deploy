const logger = require('../utils/logger');
const config = require('../utils/config');
const optionsSchema = require('./Options');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = config.MONGODB_URI;

logger.info('connecting to ..... MONGODB');

//connecting to the DB
mongoose
  .connect(url)
  .then(() => logger.info('Connected to MONGODB'))
  .catch((err) => logger.error('Error connecting to MONGODB', err));

//the userSchema
const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    options: [optionsSchema],
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model('User', userSchema);
