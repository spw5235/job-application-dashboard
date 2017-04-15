'use strict';

const jobsApi = require('../jobs/api');
const homeUi = require('./home-ui');

// LOGIN EVENTS

const onGetDash = function() {
  event.preventDefault();
  jobsApi.getJobs()
    .done(homeUi.showJobDashTable)
    .fail(homeUi.homeFailure);
};


const addHandlers = () => {
  $('#get-dash-home-btn').on('click', onGetDash);
};

module.exports = {
  addHandlers,
};
