'use strict';

const store = require('../store');
const displayEditJob = require('../templates/job/update-job-form.handlebars');
const displayJobDashboard = require('../templates/job/get-jobs.handlebars');
const displayJobDetails = require('../templates/job/show-job-record.handlebars');
const displayJobCreateForm = require('../templates/job/create-job.handlebars');
const jobsApi = require('./api');

const getJobSuccess = (data) => {
  $(".notification-container").children().text("");
  store.jobDataForEdit = data;

  $(".content").children().remove();

  let dataArr = data.jobs;

  for (let i = 0; i < dataArr.length; i++ ) {
    let unavailable = "N/A";
    let currArrayOptOne = (dataArr[i].title);
    let currArrayOptTwo = (dataArr[i].posting_date);
    let currArrayOptThree = (dataArr[i].post_url);

    if (currArrayOptOne === "" || currArrayOptOne === null) {
      dataArr[i].title = unavailable;
    }
    if (currArrayOptTwo === "" || currArrayOptTwo === null) {
      dataArr[i].posting_date = unavailable;
    }
    if (currArrayOptThree === "" || currArrayOptThree === null) {
      dataArr[i].post_url = unavailable;
    }
  }

  let jobDashboard = displayJobDashboard({
    jobs: data.jobs
  });

  $('.content').append(jobDashboard);

};

const showJobRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowJobData = data;

  let jobDetails = displayJobDetails({
    job: data.job
  });
  $('.content').append(jobDetails);
};

const showJobRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};

const showJobCreateForm = () => {

  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateJobForm = displayJobCreateForm();
  $('.content').append(showCreateJobForm);
};


const generateUpdateForm = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowJobData;

  let editJob = displayEditJob({
    job: data.job
  });
  $('.content').append(editJob);
};

const getJobFailure = () => {
  $(".notification-container").children().text("");
  console.log('get job failure');
};

const createJobSuccess = (data) => {
  console.log("createsucces");
  console.log(data);
  store.currentJobId = data.job.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Job Has Been Successfully Created");

  let showJobDetails = displayJobDetails({
    job: store.createJobData.job
  });
  $(".content").append(showJobDetails);
  $(".current").attr("data-current-job-id", store.currentJobId);
};

const deleteJobSuccess = () => {
  $(".notification-container").children().text("");
  console.log('delete success');
  jobsApi.getJobs()
    .done(getJobSuccess)
    .fail(getJobFailure);
};

const deleteJobFailure = () => {
  $(".notification-container").children().text("");
  console.log('delete fail');
};

const updateJobSuccess = (data) => {
  console.log(data);
  store.currentJobId = data.job.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Job Has Been Successfully Updated");

  let showJobDetails = displayJobDetails({
    job: data.job
  });
  $(".content").append(showJobDetails);
  $(".current").attr("data-current-job-id", store.currentJobId);
};

// const displayJobDropdownSuccess = function(data) {
//   $(".notification-container").children().text("");
//
//   let companyOptionDisplay = displayJobOptions({
//     jobs: data.jobs
//   });
//
//   let dataUpdateFormVal = parseInt($("#update-job-form").attr("data-update-form"));
//
//   $('.associate-reminder-with-job-container').append(companyOptionDisplay);
//
//   if (dataUpdateFormVal === 1) {
//     let currentJobId = store.currentJobId;
//     let valueString = '#select-option-job-name option[value=' + currentJobId + ']';
//     $(valueString).prop('selected', true);
//   }
// };

const dropDownData = function(data) {
  console.log(data);
};

module.exports = {
  getJobSuccess,
  showJobRecordSuccess,
  deleteJobSuccess,
  deleteJobFailure,
  showJobCreateForm,
  getJobFailure,
  updateJobSuccess,
  showJobRecordFailure,
  createJobSuccess,
  dropDownData,
  generateUpdateForm,
};
