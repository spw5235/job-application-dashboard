'use strict';

const store = require('../store');
const displayRemindersSummary = require('../templates/summary-table/reminders-summary.handlebars');
// const displayEditJob = require('../templates/job/update-job-form.handlebars');
// const displayJobDashboard = require('../templates/job/get-jobs.handlebars');
// const displayJobDetails = require('../templates/job/show-job-record.handlebars');
// const displayJobCreateForm = require('../templates/job/create-job.handlebars');
// const jobsApi = require('./api');

const remindersSummarySuccess = (data) => {
  let jobId = parseInt(store.masterJobId);

  let reminderSummaryObject = {
    reminders: []
  };

  let returnedData = data.reminders;
  for (let i = 0; i < returnedData.length; i++) {
    let jobIdForArray = returnedData[i].job_ref_id;
    if (jobIdForArray === jobId) {
      reminderSummaryObject.reminders.push(returnedData[i]);
      // console.log(returnedData[i]);
    }
  }

  let newObjectLength = reminderSummaryObject.reminders.length;

  if (newObjectLength > 0) {
    let remindersSummaryTable = displayRemindersSummary({
      reminders: reminderSummaryObject.reminders
    });
    $(".reminders-summary-table-container").append(remindersSummaryTable);
  }

};

module.exports = {
  remindersSummarySuccess
};
