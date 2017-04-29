'use strict';

const jobsApi = require('../jobs/api');
const apiAuth = require('./api');
const store = require('../store');
const dashboardHomeUi = require('../dashboard/home-ui');
const remindersApi = require('../reminders/api');
const communicationsApi = require('../communications/api');

const blinkNotify = function(div, status) {
  let blinkHtml = '<div id="processing">Processing...</div>';
  $(div).append(blinkHtml);

  const blinkAnimation = function() {
    $("#processing").fadeIn(300);
    $("#processing").fadeOut(500);
  };

  if (status === "start") {
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
  let screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    $("#nav-mobile-dropdown").show();
    $(".nav-mobile-ul").slideUp();
  }
  if (screenWidth < 500) {
    $("#web-logo h3").text('Dashboard');
  }

  remindersApi.getReminders()
    .done(dashboardHomeUi.showRemindersApproachDashTable)
    .fail(dashboardHomeUi.homeFailure);
};

const signInFailure = function() {
  $("#processing").remove();
  $(".disable-btn").prop("disabled",false);
  $(".notification-container").children().text("");
  $('.signin-failure').text('Failed sign-in attempt. User email may not exist and/or passwords may not match').show(0).delay(4000).slideUp(500);
};

const signUpSuccess = function() {
  let data = {
    credentials: {
        email: "blank",
        password: "blank"
      }
  };

  data.credentials.email = store.signUpEmail;
  data.credentials.password = store.signUpPassword;

  apiAuth.signIn(data)
    .then((response) => {
      store.user = response.user;
      return store.user;
    })
    .done(signInSuccess)
    .catch(signInFailure);
};

const signUpFailure = function() {
  $("#processing").remove();
  $(".disable-btn").prop("disabled", false);
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
  $("#sign-out").hide();
  $("#change-password").hide();
  let screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    $("#nav-mobile-dropdown").hide();
  }
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
