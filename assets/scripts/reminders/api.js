'use strict';

const config = require('../config');
const store = require('../store');

// reminders API

const getReminders = function() {
  return $.ajax({
    url: config.apiOrigin + '/reminders',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const showReminder = function() {
  return $.ajax({
    url: config.apiOrigin + '/reminders/' + store.currentReminderId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const createReminder = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/reminders',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

const deleteReminder = function(id) {
  return $.ajax({
    url: config.apiOrigin + '/reminders/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const updateReminder = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/reminders/' + store.currentReminderId,
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
};
