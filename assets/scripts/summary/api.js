'use strict';

const config = require('../config');
const store = require('../store');

// Jobs API

const getCommunications = function() {
  return $.ajax({
    url: config.apiOrigin + '/communications/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const getContacts = function() {
  return $.ajax({
    url: config.apiOrigin + '/contacts/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const getDocuments = function() {
  return $.ajax({
    url: config.apiOrigin + '/documents/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const getReminders = function() {
  return $.ajax({
    url: config.apiOrigin + '/reminders/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

module.exports = {
  getReminders,
  getDocuments,
  getContacts,
  getCommunications,
};
