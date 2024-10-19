const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }); // getting jobs that only created by user
  res.status(StatusCodes.OK).send({ count: jobs.length, data: jobs });
};

const getJob = async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!job) {
    throw new NotFoundError(`Job with id ${req.params.id} not found!`);
  }

  res.status(200).send({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user._id;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).send({ job });
};

const updateJob = async (req, res) => {
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError(
      'You must provide both company and position fields!'
    );
  }

  const updatedJob = await Job.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user._id,
    },
    { company, position },
    { new: true, runValidators: true }
  );

  if (!updatedJob) {
    throw new NotFoundError(`Job with id ${req.params.id} not found!`);
  }

  res.status(StatusCodes.OK).send({ updatedJob });
};

const deleteJob = async (req, res) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!job) {
    throw new NotFoundError(`Job with id ${req.params.id} not found!`);
  }

  res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
