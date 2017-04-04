'use strict';

const config = require('../config');
const store = require('../store');

// Statuses API

const getReminders = function() {
  return $.ajax({
    url: config.apiOrigin + '/companies/' + store.currentCompanyId + '/jobs/' + store.currentJobId + '/statuses',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const getRemindersIteration = function(jobId) {
  return $.ajax({
    url: config.apiOrigin + '/companies/' + store.currentCompanyId + '/jobs/' + jobId + '/statuses',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const showReminder = function() {
  return $.ajax({
    url: config.apiOrigin + '/statuses/' + store.currentReminderId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const createReminder = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/companies/' + store.currentCompanyId + '/jobs/' + store.currentJobId + '/statuses',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

const deleteReminder = function(id) {
  return $.ajax({
    url: config.apiOrigin + '/statuses/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const updateReminder = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/statuses/' + store.currentReminderId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

module.exports = {
  getReminders,
  createReminder,
  deleteReminder,
  showReminder,
  updateReminder,
  getRemindersIteration,
};
