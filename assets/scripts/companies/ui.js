'use strict';

const store = require('../store');
const displayEditCompany = require('../templates/company/update-company-form.handlebars');
const displayCompanyDashboard = require('../templates/company/get-companies.handlebars');
const displayReminderDashboard = require('../templates/reminder/get-reminders.handlebars');
const displayReminderDashboardCompanyPage = require('../templates/reminder/get-reminders-company.handlebars');
const displayCompanyDetails = require('../templates/company/show-company-record.handlebars');
const displayCompanyCreateForm = require('../templates/company/create-company.handlebars');
const displayJobsTable = require('../templates/job/get-jobs.handlebars');
const displayShowJobTable = require('../templates/job/show-job-record.handlebars');
const companiesApi = require('./api');
const jobsApi = require('../jobs/api');
const remindersApi = require('../reminders/api');

// Company UI

const getReminderCompanyPageSuccess = (data) => {
  let reminderData = data.reminders;
  let currentCompanyId = parseInt(store.currentCompanyId);

  let count = 0;
  for (let i = 0; i < reminderData.length; i++) {
    let iterationCompanyId = reminderData[i].company_ref_id;

    if (iterationCompanyId === currentCompanyId) {
      data.reminders[i].show_data = true;
      count += 1;
    }
  }

  if (count > 0) {
    let insertCompId = store.currentCompanyId;
    let reminderDashboard = displayReminderDashboardCompanyPage({
      reminders: data.reminders,
      insert: insertCompId
    });

    $('.content').append(reminderDashboard);
  }
};

const getReminderSuccess = (data) => {
  let insertCompId = store.currentCompanyId;
  let reminderDashboard = displayReminderDashboard({
    reminders: data.reminders,
    insert: insertCompId
  });

  $('.content').append(reminderDashboard);

  // let dataRemindersArr = data.reminders;
  //
  // let storeArr = [];
  //
  // for (let i = 0; i < dataRemindersArr.length; i++ ) {
  //   let dateOne;
  //   let dateTwo;
  //   if (i > 0) {
  //     dateOne = (dataRemindersArr[i].reminder_date);
  //     dateTwo = (dataRemindersArr[i-1].reminder_date);
  //     if (dateOne > dateTwo) {
  //       console.log("true");
  //     }
  //   }
  // }
};

const getReminderFailure = (data) => {
  console.log(data);
};

const getJobSuccess = (data) => {

  const jobsObject = data.jobs;
  let jobsIdArr = [];
  let jobsTitleArr = [];

  for (let i = 0; i < jobsObject.length; i++) {
    jobsIdArr.push(jobsObject[i].id);
    jobsTitleArr.push(jobsObject[i].title);
  }

  $(".notification-container").children().text("");
  const numberOfJobs = data.jobs.length;
  let singleJobData = data.jobs[0];

  let singleJobDetails = displayShowJobTable({
    job: singleJobData
  });

  let jobDashboard = displayJobsTable({
    jobs: data.jobs
  });

  store.oneJobListed = (numberOfJobs === 1);

  if (numberOfJobs === 1) {
    $(".content").append(singleJobDetails);
  } else if (numberOfJobs > 1) {
    $(".content").append(jobDashboard);
  }
  // $('.company-dashboard-container').append(companyDashboard);
  const currentCompanyName = store.companyName;
  $("#job-record-btn-edit").attr("data-current-company-id", store.currentCompanyId);
  $("#job-record-delete").attr("data-current-company-id", store.currentCompanyId);
  $("#create-job-company-btn").attr("data-current-company-id", store.currentCompanyId);
  $("#job-reminder-create").attr("data-current-company-id", store.currentCompanyId);
  $(".current-company-name").text(currentCompanyName);

  remindersApi.getReminders()
    .done(getReminderCompanyPageSuccess)
    .fail(getReminderFailure);
};

const getJobFailure = () => {
  $(".notification-container").children().text("");
};

const getCompanySuccess = (data) => {
  $(".notification-container").children().text("");
  store.companyPage = false;
  store.companyDataForEdit = data;

  $(".content").children().remove();
  let companyDashboard = displayCompanyDashboard({
    companies: data.companies
  });

  $('.content').append(companyDashboard);

  remindersApi.getReminders()
    .done(getReminderSuccess)
    .fail(getReminderFailure);

};

const showCompanyRecordSuccess = (data) => {
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
  jobsApi.getJobs()
    .done(getJobSuccess)
    .fail(getJobFailure);
};
//
const showCompanyRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};
//
const showCompanyCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateForm = displayCompanyCreateForm();
  $('.content').append(showCreateForm);
};

//
const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let editCompany = displayEditCompany({
    company: store.lastShowCompanyData.company
  });
  $('.content').append(editCompany);

  $(".associate-reminder-with-company-container").attr("current-company-id", store.currentCompanyId);
  $(".associate-reminder-with-company-container").attr("current-job", store.currentJobId);

};

const getCompanyFailure = () => {
  $(".notification-container").children().text("");
  console.log('get company failure');
};

const createCompanySuccess = () => {
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Company Has Been Successfully Created");
  store.companyPage = true;
  let showCompanyDetails = displayCompanyDetails({
    company: store.createCompanyData.company
  });
  $(".content").append(showCompanyDetails);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
};

const deleteCompanySuccess = () => {
  $(".notification-container").children().text("");
  console.log('delete success');
  companiesApi.getCompanies()
    .done(getCompanySuccess)
    .fail(getCompanyFailure);
};

const deleteCompanyFailure = () => {
  $(".notification-container").children().text("");
  console.log('delete fail');
};
//
const updateCompanySuccess = (data) => {
  $(".notification-container").children().text("");
  $(".success-alert").text("Company Has Been Successfully Updated");
  store.currentCompanyId = data.company.id;
  $(".content").children().remove();
  companiesApi.showCompany()
    .done(showCompanyRecordSuccess)
    .fail(showCompanyRecordFailure);
};

const updateCompanyFailure = () => {
  $(".notification-container").children().text("");
  $("#update-company-error").text("Error: Company not updated.  Please ensure all required fields have values");
};

module.exports = {
  getCompanySuccess,
  showCompanyRecordSuccess,
  deleteCompanySuccess,
  deleteCompanyFailure,
  updateFormGenerator,
  showCompanyCreateForm,
  getCompanyFailure,
  updateCompanySuccess,
  updateCompanyFailure,
  showCompanyRecordFailure,
  createCompanySuccess,
  getReminderSuccess,
};
