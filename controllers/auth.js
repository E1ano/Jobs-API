const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('You must provide email and password!');
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthenticatedError('Invalid credentials!');
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid credentials!');
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).send({ user: { name: user.name }, token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new BadRequestError('You must provide name, email and password!');
    }

    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).send({ user: { name: user.name }, token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { login, register };
