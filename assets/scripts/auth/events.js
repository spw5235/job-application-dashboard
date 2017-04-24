'use strict';
const apiAuth = require('./api');
const uiAuth = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const dashboardHomeUi = require('../dashboard/home-ui');
const jobsApi = require('../jobs/api');

// LOGIN EVENTS

const onSignIn = function(event) {
  event.preventDefault();
  let screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    $(".nav-mobile-ul").slideUp();
  }
  let div = ".signin-success";
  uiAuth.blinkNotify(div, "start");
  let data = getFormFields(event.target);
  apiAuth.signIn(data)
    .then((response) => {
      store.user = response.user;
      return store.user;
    })
    .done(uiAuth.signInSuccess)
    .catch(uiAuth.signInFailure);
};

const onSignUp = function(event) {
  event.preventDefault();
  let div = ".signup-success";
  uiAuth.blinkNotify(div, "start");
  let data = getFormFields(event.target);
  store.signUpEmail = data.credentials.email;
  store.signUpPassword = data.credentials.password;
  let passwordOne = data.credentials.password;
  let passwordOneLength = passwordOne.split("").length;
  let passwordTwo = data.credentials.password_confirmation;
  let passwordTwoLength = passwordTwo.split("").length;

  let passOneLengthCondition = (passwordOneLength > 0);
  let passTwoLengthCondition = (passwordTwoLength > 0);
  let passwordsEqualCondition = (passwordOne === passwordTwo);

  if ( passOneLengthCondition &&  passTwoLengthCondition && passwordsEqualCondition) {
    apiAuth.signUp(data)
      .done(uiAuth.signUpSuccess)
      .catch(uiAuth.signUpFailure);
  } else {
    $(".signup-failure").slideDown(300).text("Sign-up error. Please ensure that you are using a valid email and passwords match.");
  }
};

const onSignOut = function(event) {
  event.preventDefault();
  let div = ".signout-success";
  uiAuth.blinkNotify(div, "start");
  let data = getFormFields(event.target);
  apiAuth.signOut(data)
    .done(uiAuth.signOutSuccess)
    .fail(uiAuth.signOutFailure);
};

const onChangePassword = function(event) {
  event.preventDefault();
  let div = ".changepw-success";
  uiAuth.blinkNotify(div, "start");
  let data = getFormFields(event.target);

  if ( $(".new-password").val() === "" ) {
    $('.changepw-failure').text('Change password attempt failed. Make sure you correctly entered your original password.').show(0).delay(5000).slideUp(500);
  } else {
    apiAuth.changePassword(data)
      .then(uiAuth.cpSuccess)
      .catch(uiAuth.cpFailure);
  }

  apiAuth.changePassword(data)
    .done(uiAuth.success)
    .fail(uiAuth.failure);
};

const viewDash = function() {
  jobsApi.getJobs()
    .done(dashboardHomeUi.showJobDashTable)
    .fail(dashboardHomeUi.homeFailure);
};

const addHandlers = () => {
  $('#sign-up').on('submit', onSignUp);
  $('#sign-in').on('submit', onSignIn);
  $('#change-password').on('submit', onChangePassword);
  $('#sign-out button').on('click', onSignOut);
  $('#get-dash-btn').on('click', viewDash);
};

module.exports = {
  addHandlers,
};
