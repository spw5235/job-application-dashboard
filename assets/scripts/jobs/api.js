'use strict';

const config = require('../config');
const store = require('../store');

// Jobs API

const getJobs = function() {
  return $.ajax({
    url: config.apiOrigin + '/jobs/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

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
    url: config.apiOrigin + '/jobs/',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

const deleteJob = function(id) {
  return $.ajax({
    url: config.apiOrigin + '/jobs/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
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
  getJobs,
  createJob,
  deleteJob,
  showJob,
  updateJob,
};
