'use strict';

const config = require('../config');
const store = require('../store');

// Documents API

const getDocuments = function() {
  return $.ajax({
    url: config.apiOrigin + '/documents/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const showDocument = function() {
  return $.ajax({
    url: config.apiOrigin + '/documents/' + store.currentDocumentId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const createDocument = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/documents/',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

const deleteDocument = function(id) {
  return $.ajax({
    url: config.apiOrigin + '/documents/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const updateDocument = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/documents/' + store.currentDocumentId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

module.exports = {
  getDocuments,
  createDocument,
  deleteDocument,
  showDocument,
  updateDocument,
};
