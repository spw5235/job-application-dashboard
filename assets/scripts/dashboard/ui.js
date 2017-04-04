'use strict'

const store = require('../store');
const displayExistingCompanies = require('../templates/dashboard/existing-company.handlebars');

// Company UI

const getExistingSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let existingCompanies = displayExistingCompanies({
    companies: data.companies
  });
  $('.content').append(existingCompanies);
};

const getExistingFailure = () => {
  $(".notification-container").children().text("");
};

module.exports = {
  getExistingSuccess,
  getExistingFailure,
};
