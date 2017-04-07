'use strict';

const store = require('../store');
const displayEditDocument = require('../templates/document/update-document-form.handlebars');
const displayDocumentDashboard = require('../templates/document/get-documents.handlebars');
const displayReminderDashboard = require('../templates/reminder/get-reminders.handlebars');
// const displayReminderDashboardDocumentPage = require('../templates/reminder/get-reminders-document.handlebars');
const displayDocumentDetails = require('../templates/document/show-document-record.handlebars');
const displayDocumentCreateForm = require('../templates/document/create-document.handlebars');
// const displayJobsTable = require('../templates/job/get-jobs.handlebars');
// const displayShowJobTable = require('../templates/job/show-job.handlebars');
const documentsApi = require('./api');
// const jobsApi = require('../jobs/api');
const remindersApi = require('../reminders/api');
//
// // Document UI
//
// const getReminderDocumentPageSuccess = (data) => {
//   let reminderData = data.reminders;
//   let currentDocumentId = parseInt(store.currentDocumentId);
//
//   let count = 0;
//   for (let i = 0; i < reminderData.length; i++) {
//     let iterationDocumentId = reminderData[i].document_ref_id;
//
//     if (iterationDocumentId === currentDocumentId) {
//       data.reminders[i].show_data = true;
//       count += 1;
//     }
//   }
//
//   if (count > 0) {
//     let insertCompId = store.currentDocumentId;
//     let reminderDashboard = displayReminderDashboardDocumentPage({
//       reminders: data.reminders,
//       insert: insertCompId
//     });
//
//     $('.content').append(reminderDashboard);
//   }
// };

const getReminderSuccess = (data) => {
  // let insertCompId = store.currentDocumentId;
  let reminderDashboard = displayReminderDashboard({
    reminders: data.reminders
    // insert: insertCompId
  });

  $('.content').append(reminderDashboard);

};

const getReminderFailure = (data) => {
  console.log(data);
};

// const getJobSuccess = (data) => {
//
//   const jobsObject = data.jobs;
//   let jobsIdArr = [];
//   let jobsTitleArr = [];
//
//   for (let i = 0; i < jobsObject.length; i++) {
//     jobsIdArr.push(jobsObject[i].id);
//     jobsTitleArr.push(jobsObject[i].title);
//   }
//
//   $(".notification-container").children().text("");
//   const numberOfJobs = data.jobs.length;
//   let singleJobData = data.jobs[0];
//
//   let singleJobDetails = displayShowJobTable({
//     job: singleJobData
//   });
//
//   let jobDashboard = displayJobsTable({
//     jobs: data.jobs
//   });
//
//   store.oneJobListed = (numberOfJobs === 1);
//
//   if (numberOfJobs === 1) {
//     $(".content").append(singleJobDetails);
//   } else if (numberOfJobs > 1) {
//     $(".content").append(jobDashboard);
//   }
//   // $('.document-dashboard-container').append(documentDashboard);
//   const currentDocumentName = store.documentName;
//   $("#job-record-btn-edit").attr("data-current-document-id", store.currentDocumentId);
//   $("#job-record-delete").attr("data-current-document-id", store.currentDocumentId);
//   $("#create-job-document-btn").attr("data-current-document-id", store.currentDocumentId);
//   $("#job-reminder-create").attr("data-current-document-id", store.currentDocumentId);
//   $(".current-document-name").text(currentDocumentName);
//
//   remindersApi.getReminders()
//     .done(getReminderDocumentPageSuccess)
//     .fail(getReminderFailure);
// };
//
// const getJobFailure = () => {
//   $(".notification-container").children().text("");
// };

const getDocumentSuccess = (data) => {
  $(".notification-container").children().text("");
  store.documentDataForEdit = data;

  $(".content").children().remove();

  let documentDashboard = displayDocumentDashboard({
    documents: data.documents
  });

  $('.content').append(documentDashboard);

};

const showDocumentRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowDocumentData = data;

  let documentDetails = displayDocumentDetails({
    document: data.document
  });
  $('.content').append(documentDetails);
};

const showDocumentRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};
//
const showDocumentCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateDocumentForm = displayDocumentCreateForm();
  $('.content').append(showCreateDocumentForm);
};

const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowDocumentData;

  let editDocument = displayEditDocument({
    document: data.document
  });
  $('.content').append(editDocument);

  $(".associate-reminder-with-document-container").attr("current-document-id", store.currentDocumentId);
  $(".associate-reminder-with-document-container").attr("current-job", store.currentJobId);

};

// const getDocumentFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('get document failure');
// };

const createDocumentSuccess = () => {
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Document Has Been Successfully Created");

  let showDocumentDetails = displayDocumentDetails({
    document: store.createDocumentData.document
  });
  $(".content").append(showDocumentDetails);
  $(".current").attr("data-current-document-id", store.currentDocumentId);
};

const deleteDocumentSuccess = () => {
  $(".notification-container").children().text("");
  console.log('delete success');
  documentsApi.getDocuments()
    .done(getDocumentSuccess)
    .fail(getDocumentFailure);
};

const deleteDocumentFailure = () => {
  $(".notification-container").children().text("");
  console.log('delete fail');
};

const updateDocumentSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".success-alert").text("Document Has Been Successfully Updated");
  store.currentDocumentId = data.document.id;
  $(".content").children().remove();
  documentsApi.showDocument()
    .done(showDocumentRecordSuccess)
    .fail(showDocumentRecordFailure);
};

// const updateDocumentFailure = () => {
//   $(".notification-container").children().text("");
//   $("#update-document-error").text("Error: Document not updated.  Please ensure all required fields have values");
// };

module.exports = {
  getDocumentSuccess,
  showDocumentRecordSuccess,
  deleteDocumentSuccess,
  deleteDocumentFailure,
  updateFormGenerator,
  showDocumentCreateForm,
  // getDocumentFailure,
  updateDocumentSuccess,
  // updateDocumentFailure,
  showDocumentRecordFailure,
  createDocumentSuccess,
  // getReminderSuccess,
};
