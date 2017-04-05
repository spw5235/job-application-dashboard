'use strict';

const config = require('../config');
const store = require('../store');

// Jobs API

const getJobs = function() {
  return $.ajax({
    url: config.apiOrigin + '/companies/' + store.currentCompanyId + '/jobs',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const getJobsDropdown = function(id) {
  return $.ajax({
    url: config.apiOrigin + '/companies/' + id + '/jobs',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
}

const showJob = function() {
  return $.ajax({
    url: config.apiOrigin + '/jobs/' + store.currentJobId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const createJob = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/companies/' + store.currentCompanyId + '/jobs',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

const deleteJob = function() {
  return $.ajax({
    url: config.apiOrigin + '/jobs/' + store.currentJobId,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const updateJobManual = function(title, posting_date, post_url, salary, responsibility, requirement, deadline, comment) {
  return $.ajax({
    url: config.apiOrigin + '/jobs/' + store.currentJobId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data: {
      job: {
        title: title,
        posting_date: posting_date,
        post_url: post_url,
        salary: salary,
        responsibility: responsibility,
        requirement: requirement,
        deadline: deadline,
        comment: comment
      }
    }
  });
};

const updateJob = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/jobs/' + store.currentJobId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

module.exports = {
  createJob,
  getJobs,
  showJob,
  updateJob,
  deleteJob,
  updateJobManual,
  getJobsDropdown,
};
