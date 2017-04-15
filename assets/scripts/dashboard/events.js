'use strict';

const jobsApi = require('../jobs/api');
const homeUi = require('./home-ui');
// const logic = require('./logic');

// LOGIN EVENTS

const onGetJobDash = function() {
  event.preventDefault();
  jobsApi.getJobs()
    .done(homeUi.showJobDashTable)
    .fail(homeUi.homeFailure);
};


const addHandlers = () => {
  $('.content').on('click', "#get-dash-btn", onGetJobDash);
};

module.exports = {
  addHandlers,
};
