'use strict';

const displayDashboard = require('../templates/dashboard/dashboard-home.handlebars');
const jobsApi = require('../jobs/api');
const jobsUi = require('../jobs/ui');

const blinkNotify = function(div, status) {
  let blinkHtml = '<div id="processing">Processing...</div>';
  $(div).append(blinkHtml);

  const blinkAnimation = function() {
    $("#processing").fadeIn(300);
    $("#processing").fadeOut(500);
  };

  if (status === "start") {
    console.log('start is true');
    setInterval(blinkAnimation, 0);
  } else {
    clearInterval(blinkAnimation);
  }
};

const signInSuccess = function() {
  $("#processing").remove();
  $("#change-password").show();
  $(".nav-main-container").show();
  $(".notification-container").children().text("");
  $(".success-alert").text("You have successfully signed-in");
  $('#sign-in').hide();
  $('#sign-up').hide();
  $(".content").children().remove();
  $(".form-clear").val('');
  $(".homepage-content").hide();
  $("#sign-out").show();
  jobsApi.getJobs()
    .done(jobsUi.getJobSuccess)
    .fail(jobsUi.getJobFailure);
};

const signInFailure = function() {
  $("#processing").remove();
  $(".notification-container").children().text("");
  $('.signin-failure').text('Failed sign-in attempt. User email may not exist and/or passwords may not match').show(0).delay(4000).slideUp(500);
};

const signUpSuccess = function() {
  $("#processing").remove();
  $(".signup-failure").text("");
  $(".notification-container").children().text("");
  let transferEmail = $("#sign-up .signup-email").val();
  $("#sign-in .signin-email").val(transferEmail);
  $("#sign-up").removeClass("open");
  $("#sign-in").addClass("open");
  $(".signin-success").slideDown(300).text("You have successfully signed-up.  Please sign-in to continue").delay(3500).slideUp(300);
};

const signUpFailure = function() {
  $("#processing").remove();
  $(".notification-container").children().text("");
  $(".signup-failure").slideDown(300).text("Sign-up error. Please ensure that you are using a valid email and passwords match.");
};

const signOutSuccess = function() {
  $("#processing").remove();
  $(".nav-main-container").hide();
  $(".notification-container").children().text("");
  $(".success-alert").text("You have successfully signed-out.  Please sign-in to continue");
  $('.content').children().remove();
  $("#sign-up").show();
  $("#sign-in").show();
  $(".form-clear").val('');
  $(".nav-main-container").hide();
  $(".homepage-content").show();
};

const signOutFailure = function() {
  $("#processing").remove();
  $(".notification-container").children().text("");
  $(".failure-alert").text("Error: You have not successfully signed-out.  Please close your browser");
  $('.content').children().remove();
};

const cpSuccess = function() {
  $("#processing").remove();
  $(".notification-container").children().text("");
  $("#change-password").removeClass("open");
  $(".success-alert").text("Your password has been successfully changed");
};

const cpFailure = function() {
  $("#processing").remove();
  $('.changepw-failure').text('Change password attempt failed. Make sure you correctly entered your original password.').show(0).delay(5000).slideUp(500);
};

module.exports = {
  signInSuccess,
  signInFailure,
  signUpSuccess,
  signUpFailure,
  signOutSuccess,
  signOutFailure,
  cpSuccess,
  cpFailure,
  blinkNotify,
};
