'use strict';

const store = require('../store');
const logic = require('../dashboard/logic');
const displayRemindersSummary = require('../templates/summary-table/reminders-summary.handlebars');
const displayDocumentsSummary = require('../templates/summary-table/documents-summary.handlebars');
const displayContactsSummary = require('../templates/summary-table/contacts-summary.handlebars');
const displayCommunicationsSummary = require('../templates/summary-table/communications-summary.handlebars');

const summaryFailure = function() {
  $(".failure-alert").text("An error has occured. Please try again");
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
  } else {
    $(".reminders-summary-table-container").remove();
    $(".reminders-empty-message").append("<h3>Linked Reminders</h3>");
    $(".reminders-empty-message").append("<p>There are no reminders linked to this company.</p>");
  }
  logic.dateFormatByClass();
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
  } else {
    $(".documents-summary-table-container").remove();
    $(".documents-empty-message").append("<h3>Linked Documents</h3>");
    $(".documents-empty-message").append("<p>There are no documents linked to this company.</p>");
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
  } else {
    $(".contacts-summary-table-container").remove();
    $(".contacts-empty-message").append("<h3>Linked Contacts</h3>");
    $(".contacts-empty-message").append("<p>There are no contacts linked to this company.</p>");
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
  } else {
    $(".communications-summary-table-container").remove();
    $(".communications-empty-message").append("<h3>Linked Communications</h3>");
    $(".communications-empty-message").append("<p>There are no communications linked to this company.</p>");
  }
  logic.dateFormatByClass();
};

module.exports = {
  remindersSummarySuccess,
  documentsSummarySuccess,
  summaryFailure,
  contactsSummarySuccess,
  communicationsSummarySuccess
};
