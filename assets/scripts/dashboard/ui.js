'use strict';

const store = require('../store');
const displayExistingCompanies = require('../templates/dashboard/existing-company.handlebars');
const displaySample = require('../templates/job/tag-job.handlebars');
const tagLogic = require('./taglogic');

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

const getSampleSuccess = (data) => {
  $(".notification-container").children().text("");

  let sampleHtmlDashboard = displaySample({
    jobs: data.jobs
  });

  $('#job-dropdown-in-contact-form').append(sampleHtmlDashboard);

  let formCategory = "contact";
  let listCategory = "job";
  tagLogic.IdClassGenTagHandlebars(formCategory, listCategory);

};


const getSampleFailure = function() {
  console.log("failure");
};

module.exports = {
  getExistingSuccess,
  getExistingFailure,
  getSampleFailure,
  getSampleSuccess,
};
