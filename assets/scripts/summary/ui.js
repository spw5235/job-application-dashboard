'use strict';

const store = require('../store');
const displayRemindersSummary = require('../templates/summary-table/reminders-summary.handlebars');
const displayDocumentsSummary = require('../templates/summary-table/documents-summary.handlebars');
const displayContactsSummary = require('../templates/summary-table/contacts-summary.handlebars');
const displayCommunicationsSummary = require('../templates/summary-table/communications-summary.handlebars');
// const displayEditJob = require('../templates/job/update-job-form.handlebars');
// const displayJobDashboard = require('../templates/job/get-jobs.handlebars');
// const displayJobDetails = require('../templates/job/show-job-record.handlebars');
// const displayJobCreateForm = require('../templates/job/create-job.handlebars');
// const jobsApi = require('./api');

const summaryFailure = function() {
  console.log('failure');
};

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

const documentsSummarySuccess = (data) => {
  let jobId = parseInt(store.masterJobId);

  let reminderSummaryObject = {
    documents: []
  };

  let returnedData = data.documents;
  for (let i = 0; i < returnedData.length; i++) {
    let jobIdForArray = returnedData[i].job_ref_id;
    if (jobIdForArray === jobId) {
      reminderSummaryObject.documents.push(returnedData[i]);
    }
  }

  let newObjectLength = reminderSummaryObject.documents.length;

  if (newObjectLength > 0) {
    let documentsSummaryTable = displayDocumentsSummary({
      documents: reminderSummaryObject.documents
    });
    $(".documents-summary-table-container").append(documentsSummaryTable);
  }

};

const contactsSummarySuccess = (data) => {
  let jobId = parseInt(store.masterJobId);

  let reminderSummaryObject = {
    contacts: []
  };

  let returnedData = data.contacts;
  for (let i = 0; i < returnedData.length; i++) {
    let jobIdForArray = returnedData[i].job_ref_id;
    if (jobIdForArray === jobId) {
      reminderSummaryObject.contacts.push(returnedData[i]);
    }
  }

  let newObjectLength = reminderSummaryObject.contacts.length;

  if (newObjectLength > 0) {
    let contactsSummaryTable = displayContactsSummary({
      contacts: reminderSummaryObject.contacts
    });
    $(".contacts-summary-table-container").append(contactsSummaryTable);
  }
};

const communicationsSummarySuccess = (data) => {
  let jobId = parseInt(store.masterJobId);

  let reminderSummaryObject = {
    communications: []
  };

  let returnedData = data.communications;
  for (let i = 0; i < returnedData.length; i++) {
    let jobIdForArray = returnedData[i].job_ref_id;
    if (jobIdForArray === jobId) {
      reminderSummaryObject.communications.push(returnedData[i]);
    }
  }

  let newObjectLength = reminderSummaryObject.communications.length;

  if (newObjectLength > 0) {
    let communicationsSummaryTable = displayCommunicationsSummary({
      communications: reminderSummaryObject.communications
    });
    $(".communications-summary-table-container").append(communicationsSummaryTable);
  }
}

module.exports = {
  remindersSummarySuccess,
  documentsSummarySuccess,
  summaryFailure,
  contactsSummarySuccess,
  communicationsSummarySuccess
};
