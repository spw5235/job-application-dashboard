'use strict';

const config = require('../config');
const store = require('../store');

// Contacts API

const getContacts = function() {
  return $.ajax({
    url: config.apiOrigin + '/contacts/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const showContact = function() {
  return $.ajax({
    url: config.apiOrigin + '/contacts/' + store.currentContactId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const createContact = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/contacts/',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

const deleteContact = function(id) {
  return $.ajax({
    url: config.apiOrigin + '/contacts/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const updateContact = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/contacts/' + store.currentContactId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

module.exports = {
  getContacts,
  createContact,
  deleteContact,
  showContact,
  updateContact,
};
