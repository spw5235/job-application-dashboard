'use strict';

const store = require('../store');
const displayJobCreateForm = require('../templates/job/new-job-form.handlebars');
const displayJobsTable = require('../templates/job/get-jobs.handlebars');
const displayJobDetails = require('../templates/job/show-job.handlebars');
const displayJobUpdateForm = require('../templates/job/update-job-form.handlebars');
const companiesUi = require('../companies/ui');
const companiesApi = require('../companies/api');
const displayCompanyDetails = require('../templates/company/show-company-record.handlebars');
const displayReminderDashboardCompanyPage = require('../templates/reminder/get-reminders-company.handlebars');
const remindersApi = require('../reminders/api');

// Job UI

const getJobSuccess = (data) => {
  $(".notification-container").children().text("");

  $(".content").children().remove();
  let jobDashboard = displayJobsTable({
    jobs: data.jobs
  });
  // $('.company-dashboard-container').append(companyDashboard);
  $('.content').append(jobDashboard);
  store.currentJobId = $('.current').attr("data-current-job-id");
  console.log(store.currentJobId);
};

const getJobFailure = () => {
  $(".notification-container").children().text("");
};


const getReminderJobPageFailure = function() {
  console.log("failure");
};

const getReminderJobPageSuccess = (data) => {
  console.log(data);


  $('.current').attr("data-current-job-id", store.currentJobId);

  let reminderData = data.reminders;
  let currentCompanyId = parseInt(store.currentCompanyId);
  let currentJobId = parseInt(store.currentJobId);

  let count = 0;

  for (let i = 0; i < reminderData.length; i++) {
    let iterationJobId = reminderData[i].job_ref_id;
    let iterationCompanyId = reminderData[i].company_ref_id;
    let iterationCompanyIdCompanyIdRel = (iterationCompanyId === currentCompanyId);
    let iterationCompanyIdJobIdRel = (iterationJobId === currentJobId);

    if (iterationCompanyIdCompanyIdRel && iterationCompanyIdJobIdRel) {
      data.reminders[i].show_data = true;
      count += 1;
    }
  }

  console.log(count);

  if (count > 0) {
    let insertCompId = store.currentCompanyId;
    let reminderDashboard = displayReminderDashboardCompanyPage({
      reminders: data.reminders,
      insert: insertCompId
    });

    $('.content').append(reminderDashboard);
  }
};


const showJobSuccess = (data) => {
  $(".notification-container").children().text("");
  // $(".job-summary-table-container").remove();

  $(".content").children().remove();

  let companyData = store.lastShowCompanyData;
  let companyDetails = displayCompanyDetails({
    company: companyData.company
  });

  $('.content').append(companyDetails);

  let jobDetails = displayJobDetails({
    job: data.job
  });
  $('.content').append(jobDetails);

  $(".current").attr("data-current-company-id", store.currentCompanyId);
  $('.current').attr("data-current-job-id", store.currentJobId);

  remindersApi.getReminders()
    .done(getReminderJobPageSuccess)
    .fail(getReminderJobPageFailure);

};


const showCompanySuccessJobPage = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowCompanyData = data;
  store.companyName = data.company.name;
  data.company.company_page = true;
  store.companyPage = data.company.company_page;
  let companyDetails = displayCompanyDetails({
    company: data.company
  });
  $('.content').append(companyDetails);
  //
  // jobsApi.showJob()
  //   .done(showJobSuccess)
  //   .fail(showJobFailure);
};

const showJobFailure = () => {
  $(".notification-container").children().text("");
};

const generateCreateForm = () => {
  $(".content").children().remove();
  let showCreateForm = displayJobCreateForm();
  $('.content').append(showCreateForm);
  $(".current").attr("data-current-job-id", store.currentJobId);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
};

const generateUpdateForm = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  data.job.company_id = store.currentCompanyId;
  let generatedUpdateForm = displayJobUpdateForm({
    job: data.job
  });
  $('.content').append(generatedUpdateForm);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
  $(".current").attr("data-current-job-id",store.currentJobId);
};

const generateUpdateFormFailure = () => {
  $(".notification-container").children().text("");
};

const showCompanyRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowCompanyData = data;
  data.company.company_page = true;
  store.companyPage = data.company.company_page;
  let companyDetails = displayCompanyDetails({
    company: data.company
  });
  let jobDetails = displayJobDetails({
    job: store.createJobData.job
  });
  $(".content").append(companyDetails);
  $(".content").append(jobDetails);
  $(".dashboard-home-btn-company-page").remove();
  $(".current").attr("data-current-company-id",store.currentCompanyId);
  $(".current").attr("data-current-job-id",store.currentJobId);
};

const showCompanyRecordFailure = () => {
  console.log('showCompanyRecordFailure failure');
};

const createJobSuccess = () => {
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".success-alert").text("Job Successfully Created");
  $(".content").children().remove();

  companiesApi.showCompany()
    .done(showCompanyRecordSuccess)
    .fail(showCompanyRecordFailure);
};

const createJobFailure = () => {
  $(".notification-container").children().text("");
  $("#create-job-error").text("Error creating job. Please check if all required fields are entered and number values fall within the listed range.");
};

const deleteJobSuccess = () => {
  $(".notification-container").children().text("");
  companiesApi.showCompany()
    .done(companiesUi.showCompanyRecordSuccess)
    .fail(companiesUi.showCompanyRecordSuccess);
};

const deleteJobFailure = () => {
  $(".notification-container").children().text("");
};

const updateJobSuccess = (data) => {
  $(".notification-container").children().text("");
  console.log("update success");
  store.currentJobId = data.job.id;
  $(".content").children().remove();
  let jobDetails = displayJobDetails({
    job: data.job
  });
  $('.content').append(jobDetails);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
  $(".current").attr("data-current-job-id",store.currentJobId);

};

const showCompanyFailureJobPage = function() {
  console.log('failure');
};

const updateJobFailure = () => {
  $(".notification-container").children().text("");
  $("#update-job-error").text("Error updating job. Please check if all required fields are entered and number values fall within the listed range.");
};

module.exports = {
  getJobSuccess,
  getJobFailure,
  showJobSuccess,
  showJobFailure,
  createJobSuccess,
  createJobFailure,
  updateJobSuccess,
  updateJobFailure,
  deleteJobSuccess,
  deleteJobFailure,
  generateCreateForm,
  generateUpdateForm,
  generateUpdateFormFailure,
  showCompanySuccessJobPage,
  showCompanyFailureJobPage,
};
