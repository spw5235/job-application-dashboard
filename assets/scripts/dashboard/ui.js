'use strict';

const store = require('../store');
const displayExistingCompanies = require('../templates/dashboard/existing-company.handlebars');
// const displaySample = require('../templates/job/tag-job.handlebars');
const linkLogic = require('./link-logic');

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
  linkLogic.linkClassIdGen(formCategory, listCategory);

  // linkLogic.radioClassIdNameGen(formCategory, listCategory);

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
