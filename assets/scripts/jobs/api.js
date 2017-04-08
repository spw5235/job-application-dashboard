'use strict';

const config = require('../config');
const store = require('../store');

// Communications API

const getCommunications = function() {
  return $.ajax({
    url: config.apiOrigin + '/communications/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const showCommunication = function() {
  return $.ajax({
    url: config.apiOrigin + '/communications/' + store.currentCommunicationId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const createCommunication = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/communications/',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

const deleteCommunication = function(id) {
  return $.ajax({
    url: config.apiOrigin + '/communications/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const updateCommunication = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/communications/' + store.currentCommunicationId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

module.exports = {
  getCommunications,
  createCommunication,
  deleteCommunication,
  showCommunication,
  updateCommunication,
};
