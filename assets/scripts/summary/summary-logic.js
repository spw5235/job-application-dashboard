'use strict';

const summaryApi = require('./api');
const summaryUi = require('./ui');
const store = require('../store');

const initiateJobSummaryTables = function(jobId) {
  store.masterJobId = jobId;
  summaryApi.getReminders()
    .done(summaryUi.remindersSummarySuccess)
    .fail(summaryUi.summaryFailure);
  summaryApi.getDocuments()
    .done(summaryUi.documentsSummarySuccess)
    .fail(summaryUi.summaryFailure);
  summaryApi.getContacts()
    .done(summaryUi.contactsSummarySuccess)
    .fail(summaryUi.summaryFailure);
  summaryApi.getCommunications()
    .done(summaryUi.communicationsSummarySuccess)
    .fail(summaryUi.summaryFailure);
};

const removeDuplicateRows = function ($table) {
  function getVisibleRowText($row){
      return $row.find('td:visible').text().toLowerCase();
  }

  $table.find('tr').each(function(index, row){
      let $row = $(row);
      $row.nextAll('tr').each(function(index, next){
          let $next = $(next);
          if (getVisibleRowText($next) === getVisibleRowText($row)) {
            $next.remove();
          }
      });
  });
};


module.exports = {
  removeDuplicateRows,
  initiateJobSummaryTables,
};
