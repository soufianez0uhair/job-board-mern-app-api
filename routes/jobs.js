const express = require('express');
const { getJobs, createJob, getJob, updateJob, deleteJob } = require('../controllers/jobsControllers');
const {requireAuth} = require('../middleware/requireAuth');

const router = express.Router();

router
    .get('/', getJobs)
    .use(requireAuth)
    .post('/', createJob)
    .get('/:id', getJob)
    .patch('/:id', updateJob)
    .delete('/:id', deleteJob)

module.exports = router