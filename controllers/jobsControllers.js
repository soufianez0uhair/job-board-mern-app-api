const Job = require('../models/jobModel');
const mongoose = require('mongoose');

const getJobs = async (req, res) => {
    const jobs = await Job.find({}).sort({createdAt: -1});

    if(!jobs) {
        return res
                  .status(400)
                  .json({
                    status: 'fail',
                    message: 'No job was found!'
                  })
    }

    return res
              .status(200)
              .json({
                status: 'succeess',
                data: {
                    jobs
                }
              })
}

const createJob = async (req, res) => {
    const {title, company, description} = req.body;

    try {
        const job = await Job.create({title, userId: req.userId, company, description});

        return res
                  .status(200)
                  .json({
                    sattus: 'success',
                    data: {
                        job
                    }
                  })
    } catch(err) {
        return res
                  .status(400)
                  .json({
                    status: 'fail',
                    message: err.message
                  })
    }
}

const getJob = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res
                  .status(400)
                  .json({
                    status: 'fail',
                    message: 'Invalid Id'
                  })
    }

    const job = await Job.findById(id);

    if(!job) {
        return res
                  .status(400)
                  .json({
                    status: 'fail',
                    message: 'No such job was found!'
                  })
    }

    return res
              .status(200)
              .json({
                status: 'success',
                data: {
                    job
                }
              })
}

const updateJob = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res
                  .status(400)
                  .json({
                    status: 'fail',
                    message: 'Invalid Id'
                  })
    }

    const job = await Job.findOneAndUpdate({_id: id, userId: req.userId}, {...req.body}, {new: true});

    if(!job) {
        return res
                  .status(400)
                  .json({
                    status: 'fail',
                    message: 'No such job was found!'
                  })
    }

    return res
              .status(200)
              .json({
                status: 'success',
                data: {
                    job
                }
              })
}

const deleteJob = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res
                  .status(400)
                  .json({
                    status: 'fail',
                    message: 'Invalid Id'
                  })
    }

    const job = await Job.findOneAndDelete({_id: id, userId: req.userId});

    if(!job) {
        return res
                  .status(400)
                  .json({
                    status: 'fail',
                    message: 'No such job was found!'
                  })
    }

    return res
              .status(200)
              .json({
                status: 'success',
                data: {
                    job
                }
              })
}

module.exports = {getJobs, createJob, getJob, updateJob, deleteJob}