'use strict';

const config = require('../config');
const store = require('../store');

// Companies API

const getCompanies = function() {
  return $.ajax({
    url: config.apiOrigin + '/companies/',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const showCompany = function() {
  return $.ajax({
    url: config.apiOrigin + '/companies/' + store.currentCompanyId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const createCompany = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/companies/',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

const deleteCompany = function(id) {
  return $.ajax({
    url: config.apiOrigin + '/companies/' + id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
  });
};

const updateCompany = function(data) {
  return $.ajax({
    url: config.apiOrigin + '/companies/' + store.currentCompanyId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token,
    },
    data,
  });
};

module.exports = {
  getCompanies,
  createCompany,
  deleteCompany,
  showCompany,
  updateCompany,
};
