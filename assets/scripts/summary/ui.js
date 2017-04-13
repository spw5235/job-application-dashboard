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

  console.log(data);
  let reminderSummaryObject = {
    reminders: []
  };

  // let test =   {
  //   students: [
  //   {
  //     id: 1,
  //     first_name: "Eric",
  //     last_name: "Chase",
  //     born_on: "2000-01-01",
  //     school: "School Name",
  //     teacher: "Teacher Name",
  //     grade: "4th"
  //   },
  //   {
  //     id: 2,
  //     first_name: "Bryan",
  //     last_name: "Keogh",
  //     born_on: "2001-02-02",
  //     school: "School Name",
  //     teacher: "Teacher Name",
  //     grade: "3rd"
  //   }
  // ]};
  //
  // let testInsert =
  //   {
  //       id: 3,
  //       first_name: "z",
  //       last_name: "z",
  //       born_on: "2001-02-02",
  //       school: "School Name",
  //       teacher: "Teacher Name",
  //       grade: "3rd"
  //     };
  //
  // console.log(test);
  // test.students.push(testInsert);
  // console.log(test);

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
