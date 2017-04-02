'use strict';

// const store = require('../store');
const displayNewSessionDash = require('../templates/dashboard/new-job-home.handlebars');
// const apiStudents = require('../students/api');
// const uiDashBoard = require('./ui');
// const displaySessionCreateForm = require('../templates/job/new-job-form.handlebars');

const onShowCreateDash = function(event) {
  event.preventDefault();
  $(".content").children().remove();
  let showCreateDashHome = displayNewSessionDash();
  $('.content').append(showCreateDashHome);
};
//
// const onExistingStudent = function(event) {
//   event.preventDefault();
//   apiStudents.getStudents()
//     .done(uiDashBoard.getExistingSuccess)
//     .fail(uiDashBoard.getExistingFailure);
// };
//
// const onCreateFromExisting = function(event) {
//   event.preventDefault();
//   store.currentStudentId = $(this).attr("data-current-student-id");
//   $(".content").children().remove();
//   let showCreateForm = displaySessionCreateForm();
//   $('.content').append(showCreateForm);
//   $(".current").attr("data-current-job-id", store.currentSessionId);
//   $(".current").attr("data-current-student-id", store.currentStudentId);
// };

const addHandlers = () => {
  // $('.content').on('click', '#dashboard-new-job-btn', onShowCreateDash)
  $('.content').on('click', '#dashboard-new-job-btn', onShowCreateDash);
  // $('.content').on('click', '#new-job-existing-student', onExistingStudent);
  // $('.content').on('click', '.dashboard-existing-create-btn', onCreateFromExisting);
};

module.exports = {
  addHandlers,
};
