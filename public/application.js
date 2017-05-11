webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// user require with a reference to bundle the file and use it in this file
	// var example = require('./example');

	// load manifests
	// scripts

	__webpack_require__(1);

	// styles
	__webpack_require__(89);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var setAPIOrigin = __webpack_require__(3);
	var config = __webpack_require__(6);
	var authEvents = __webpack_require__(7);
	var jobEvents = __webpack_require__(39);
	var reminderEvents = __webpack_require__(54);
	var dashboardEvents = __webpack_require__(66);
	var documentEvents = __webpack_require__(67);
	var contactEvents = __webpack_require__(74);
	var communicationEvents = __webpack_require__(81);

	$(function () {
	  authEvents.addHandlers();
	  dashboardEvents.addHandlers();
	  jobEvents.addHandlers();
	  reminderEvents.addHandlers();
	  documentEvents.addHandlers();
	  contactEvents.addHandlers();
	  communicationEvents.addHandlers();
	  $("body").show();
	});

	$(function () {
	  setAPIOrigin(location, config);
	});

	// use require with a reference to bundle the file and use it in this file
	// const example = require('./example');

	// use require without a reference to ensure a file is bundled
	__webpack_require__(88);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var parseNestedQuery = __webpack_require__(4);

	/*
	  possibilites to handle and example URLs:

	  client local, api local
	    http://localhost:7165/
	  client local, api remote
	    http://localhost:7165/?environment=production
	  client remote, api local
	    https://ga-wdi-boston.github.io/browser-template/?environment=development
	    This will require allowing "unsafe scripts" in Chrome
	  client remote, api remote
	    https://ga-wdi-boston.github.io/browser-template/
	*/

	var setAPIOrigin = function setAPIOrigin(location, config) {
	  // strip the leading `'?'`
	  var search = parseNestedQuery(location.search.slice(1));

	  if (search.environment === 'development' || location.hostname === 'localhost' && search.environment !== 'production') {
	    if (!(config.apiOrigin = config.apiOrigins.development)) {
	      var port = +'GA'.split('').reduce(function (p, c) {
	        return p + c.charCodeAt().toString(16);
	      }, '');
	      config.apiOrigin = 'http://localhost:' + port;
	    }
	  } else {
	    config.apiOrigin = config.apiOrigins.production;
	  }
	};

	module.exports = setAPIOrigin;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var addNestedValue = __webpack_require__(5);

	var parseNestedQuery = function parseNestedQuery(queryString) {
	  return queryString.split('&').reduce(function (memo, element) {
	    if (element) {
	      var keyValuePair = element.split('=');
	      memo = addNestedValue(memo, keyValuePair[0], keyValuePair[1]);
	    }

	    return memo;
	  }, {});
	};

	module.exports = parseNestedQuery;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	var addNestedValue = function addNestedValue(pojo, name, value) {
	  var recurse = function recurse(pojo, keys, value) {
	    value = decodeURIComponent(value);
	    var key = decodeURIComponent(keys.shift());
	    var next = keys[0];
	    if (next === '') {
	      // key is an array
	      pojo[key] = pojo[key] || [];
	      pojo[key].push(value);
	    } else if (next) {
	      // key is a parent key
	      pojo[key] = pojo[key] || {};
	      recurse(pojo[key], keys, value);
	    } else {
	      // key is the key for value
	      pojo[key] = value;
	    }

	    return pojo;
	  };

	  var keys = name.split('[').map(function (k) {
	    return k.replace(/]$/, '');
	  });
	  return recurse(pojo, keys, value);
	};

	module.exports = addNestedValue;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var config = {
	  apiOrigins: {
	    production: 'https://job-app-dashboard.herokuapp.com'
	  }
	};

	module.exports = config;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var apiAuth = __webpack_require__(8);
	var uiAuth = __webpack_require__(10);
	var getFormFields = __webpack_require__(38);
	var store = __webpack_require__(9);
	var dashboardHomeUi = __webpack_require__(12);
	var jobsApi = __webpack_require__(11);

	// LOGIN EVENTS

	var onSignIn = function onSignIn(event) {
	  event.preventDefault();
	  $(".disable-btn").prop("disabled", true);
	  var screenWidth = window.innerWidth;
	  if (screenWidth < 768) {
	    $(".nav-mobile-ul").slideUp();
	  }
	  var div = ".signin-success";
	  uiAuth.blinkNotify(div, "start");
	  var data = getFormFields(event.target);
	  apiAuth.signIn(data).then(function (response) {
	    store.user = response.user;
	    return store.user;
	  }).done(uiAuth.signInSuccess).catch(uiAuth.signInFailure);
	};

	var onSignUp = function onSignUp(event) {
	  event.preventDefault();
	  $(".disable-btn").prop("disabled", true);
	  var div = ".signup-success";
	  uiAuth.blinkNotify(div, "start");
	  var data = getFormFields(event.target);
	  store.signUpEmail = data.credentials.email;
	  store.signUpPassword = data.credentials.password;
	  var passwordOne = data.credentials.password;
	  var passwordOneLength = passwordOne.split("").length;
	  var passwordTwo = data.credentials.password_confirmation;
	  var passwordTwoLength = passwordTwo.split("").length;

	  var passOneLengthCondition = passwordOneLength > 0;
	  var passTwoLengthCondition = passwordTwoLength > 0;
	  var passwordsEqualCondition = passwordOne === passwordTwo;

	  if (passOneLengthCondition && passTwoLengthCondition && passwordsEqualCondition) {
	    apiAuth.signUp(data).done(uiAuth.signUpSuccess).catch(uiAuth.signUpFailure);
	  } else {
	    $(".signup-failure").slideDown(300).text("Sign-up error. Please ensure that you are using a valid email and passwords match.");
	  }
	};

	var onSignOut = function onSignOut(event) {
	  event.preventDefault();
	  var div = ".signout-success";
	  uiAuth.blinkNotify(div, "start");
	  var data = getFormFields(event.target);
	  apiAuth.signOut(data).done(uiAuth.signOutSuccess).fail(uiAuth.signOutFailure);
	};

	var onChangePassword = function onChangePassword(event) {
	  event.preventDefault();
	  var div = ".changepw-success";
	  uiAuth.blinkNotify(div, "start");
	  var data = getFormFields(event.target);

	  if ($(".new-password").val() === "") {
	    $('.changepw-failure').text('Change password attempt failed. Make sure you correctly entered your original password.').show(0).delay(5000).slideUp(500);
	  } else {
	    apiAuth.changePassword(data).then(uiAuth.cpSuccess).catch(uiAuth.cpFailure);
	  }

	  apiAuth.changePassword(data).done(uiAuth.success).fail(uiAuth.failure);
	};

	var viewDash = function viewDash() {
	  jobsApi.getJobs().done(dashboardHomeUi.showJobDashTable).fail(dashboardHomeUi.homeFailure);
	};

	var onBtnOptions = function onBtnOptions() {
	  $(".disable-btn").prop("disabled", false);
	};

	var addHandlers = function addHandlers() {
	  $('#sign-up').on('submit', onSignUp);
	  $('#sign-in').on('submit', onSignIn);
	  $('#change-password').on('submit', onChangePassword);
	  $('#sign-out button').on('click', onSignOut);
	  $('#get-dash-btn').on('click', viewDash);
	  $('.dropdown-toggle').on('click', onBtnOptions);
	};

	module.exports = {
	  addHandlers: addHandlers
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var config = __webpack_require__(6);
	var store = __webpack_require__(9);

	// Login Api

	var signUp = function signUp(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/sign-up/',
	    method: 'POST',
	    data: data
	  });
	};

	var signIn = function signIn(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/sign-in/',
	    method: 'POST',
	    data: data
	  });
	};

	var signOut = function signOut() {
	  return $.ajax({
	    url: config.apiOrigin + '/sign-out/' + store.user.id,
	    method: 'DELETE',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var changePassword = function changePassword(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/change-password/' + store.user.id,
	    method: 'PATCH',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    },
	    data: data
	  });
	};

	module.exports = {
	  signUp: signUp,
	  signIn: signIn,
	  signOut: signOut,
	  changePassword: changePassword
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	var store = {};

	module.exports = store;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var jobsApi = __webpack_require__(11);
	var apiAuth = __webpack_require__(8);
	var store = __webpack_require__(9);
	var dashboardHomeUi = __webpack_require__(12);
	var remindersApi = __webpack_require__(37);
	var communicationsApi = __webpack_require__(13);

	var blinkNotify = function blinkNotify(div, status) {
	  var blinkHtml = '<div id="processing">Processing...</div>';
	  $(div).append(blinkHtml);

	  var blinkAnimation = function blinkAnimation() {
	    $("#processing").fadeIn(300);
	    $("#processing").fadeOut(500);
	  };

	  if (status === "start") {
	    setInterval(blinkAnimation, 0);
	  } else {
	    clearInterval(blinkAnimation);
	  }
	};

	var signInSuccess = function signInSuccess() {
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
	  var screenWidth = window.innerWidth;
	  if (screenWidth < 768) {
	    $("#nav-mobile-dropdown").show();
	    $(".nav-mobile-ul").slideUp();
	  }
	  if (screenWidth < 500) {
	    $("#web-logo h3").text('Dashboard');
	  }

	  remindersApi.getReminders().done(dashboardHomeUi.showRemindersApproachDashTable).fail(dashboardHomeUi.homeFailure);
	};

	var signInFailure = function signInFailure() {
	  $("#processing").remove();
	  $(".disable-btn").prop("disabled", false);
	  $(".notification-container").children().text("");
	  $('.signin-failure').text('Failed sign-in attempt. User email may not exist and/or passwords may not match').show(0).delay(4000).slideUp(500);
	};

	var signUpSuccess = function signUpSuccess() {
	  var data = {
	    credentials: {
	      email: "blank",
	      password: "blank"
	    }
	  };

	  data.credentials.email = store.signUpEmail;
	  data.credentials.password = store.signUpPassword;

	  apiAuth.signIn(data).then(function (response) {
	    store.user = response.user;
	    return store.user;
	  }).done(signInSuccess).catch(signInFailure);
	};

	var signUpFailure = function signUpFailure() {
	  $("#processing").remove();
	  $(".disable-btn").prop("disabled", false);
	  $(".notification-container").children().text("");
	  $(".signup-failure").slideDown(300).text("Sign-up error. Please ensure that you are using a valid email and passwords match.");
	};

	var signOutSuccess = function signOutSuccess() {
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
	  var screenWidth = window.innerWidth;
	  if (screenWidth < 768) {
	    $("#nav-mobile-dropdown").hide();
	  }
	};

	var signOutFailure = function signOutFailure() {
	  $("#processing").remove();
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("Error: You have not successfully signed-out.  Please close your browser");
	  $('.content').children().remove();
	};

	var cpSuccess = function cpSuccess() {
	  $("#processing").remove();
	  $(".notification-container").children().text("");
	  $("#change-password").removeClass("open");
	  $(".success-alert").text("Your password has been successfully changed");
	};

	var cpFailure = function cpFailure() {
	  $("#processing").remove();
	  $('.changepw-failure').text('Change password attempt failed. Make sure you correctly entered your original password.').show(0).delay(5000).slideUp(500);
	};

	module.exports = {
	  signInSuccess: signInSuccess,
	  signInFailure: signInFailure,
	  signUpSuccess: signUpSuccess,
	  signUpFailure: signUpFailure,
	  signOutSuccess: signOutSuccess,
	  signOutFailure: signOutFailure,
	  cpSuccess: cpSuccess,
	  cpFailure: cpFailure,
	  blinkNotify: blinkNotify
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var config = __webpack_require__(6);
	var store = __webpack_require__(9);

	// Jobs API

	var getJobs = function getJobs() {
	  return $.ajax({
	    url: config.apiOrigin + '/jobs/',
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var showJob = function showJob() {
	  return $.ajax({
	    url: config.apiOrigin + '/jobs/' + store.currentJobId,
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var createJob = function createJob(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/jobs/',
	    method: 'POST',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    },
	    data: data
	  });
	};

	var deleteJob = function deleteJob(id) {
	  return $.ajax({
	    url: config.apiOrigin + '/jobs/' + id,
	    method: 'DELETE',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var updateJob = function updateJob(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/jobs/' + store.currentJobId,
	    method: 'PATCH',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    },
	    data: data
	  });
	};

	module.exports = {
	  getJobs: getJobs,
	  createJob: createJob,
	  deleteJob: deleteJob,
	  showJob: showJob,
	  updateJob: updateJob
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var store = __webpack_require__(9);
	var communicationsApi = __webpack_require__(13);
	var documentsApi = __webpack_require__(14);
	var contactsApi = __webpack_require__(15);
	var jobsApi = __webpack_require__(11);
	var logic = __webpack_require__(16);
	var displayDashboardHome = __webpack_require__(17);

	var homeFailure = function homeFailure() {
	  $(".failure-alert").text("An error has occured. Please try again");
	};

	var todaysDate = function todaysDate() {
	  var d = new Date();
	  var month = d.getMonth() + 1;
	  var day = d.getDate();
	  var output = d.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;

	  var dateArray = output.split("/");
	  var dateNum = parseInt(dateArray[0] + dateArray[1] + dateArray[2]);
	  return dateNum;
	};

	var convertDateToNum = function convertDateToNum(date) {
	  var dateArray = date.split("-");
	  var dateNum = parseInt(dateArray[0] + dateArray[1] + dateArray[2]);
	  return dateNum;
	};

	// const isItUpcoming = function(today, deadline) {
	//   let differenceVal = deadline - today;
	//   let isWithinRange = (differenceVal <= 5 && differenceVal > 0);
	//   if (isWithinRange) {
	//     return true;
	//   } else {
	//     return false;
	//   }
	// };

	var addDateToNumApproach = function addDateToNumApproach(data, type) {

	  var sortNumber = function sortNumber(a, b) {
	    return a - b;
	  };

	  var sortNumberOverdue = function sortNumberOverdue(a, b) {
	    return b - a;
	  };

	  var newReminderDataObject = {
	    reminders: []
	  };

	  var overdueReminderDataObject = {
	    reminders: []
	  };

	  var numIdArr = [];

	  var numIdArrOverdue = [];

	  var remindersData = data.reminders;

	  var remindersDataOverdue = data.reminders;

	  var remindersDataLength = data.reminders.length;

	  for (var i = 0; i < remindersDataLength; i++) {
	    var currentRemindersDate = data.reminders[i].reminder_date;
	    var isNull = data.reminders[i].reminder_date === null;

	    if (!isNull) {
	      var currentDateToNum = convertDateToNum(currentRemindersDate).toString();
	      var currentId = data.reminders[i].id.toString();

	      var currentDateToNumDecimal = parseFloat(currentDateToNum + "." + currentId);

	      var todayDate = todaysDate();

	      if (todayDate <= currentDateToNum) {
	        numIdArr.push(currentDateToNumDecimal);
	        remindersData[i].date_to_num = currentDateToNumDecimal;
	        newReminderDataObject.reminders.push(remindersData[i]);
	      } else {
	        numIdArrOverdue.push(currentDateToNumDecimal);
	        remindersDataOverdue[i].date_to_num = currentDateToNumDecimal;
	        overdueReminderDataObject.reminders.push(remindersDataOverdue[i]);
	      }
	    }
	  }

	  store.numIdReminderArr = numIdArr.sort(sortNumber);
	  store.numIdReminderArrOverdue = numIdArrOverdue.sort(sortNumberOverdue);

	  if (type === 1) {
	    return newReminderDataObject;
	  } else if (type === 2) {
	    return overdueReminderDataObject;
	  }
	};

	//////

	var generateEmptyReminders = function generateEmptyReminders(length) {
	  var newReminderDataObject = {
	    reminders: []
	  };

	  for (var i = 0; i < length; i++) {
	    var emptyObject = {};
	    emptyObject.order_num = i;
	    newReminderDataObject.reminders[i] = emptyObject;
	  }

	  return newReminderDataObject;
	};

	var hideEmptyRows = function hideEmptyRows(tableId, rowThreshold) {
	  var jQueryTableId = tableId + " tr";
	  $(jQueryTableId).each(function () {
	    var count = 0;

	    $('td', this).each(function () {
	      var text = $(this).text().trim();

	      if (text === "") {
	        count += 1;
	      }
	    });

	    if (count === rowThreshold) {
	      $(this).remove();
	    }
	  });
	};

	var showContactDashTable = function showContactDashTable(data) {
	  var newContactDataObject = {
	    contacts: []
	  };

	  var contactOne = void 0;
	  var contactTwo = void 0;
	  var contactThree = void 0;
	  var contactFour = void 0;
	  var contactFive = void 0;

	  var contactArrLength = data.contacts.length;

	  if (contactArrLength === 0) {
	    store.isContactDashEmpty = true;
	  } else if (contactArrLength === 1) {
	    contactOne = data.contacts[contactArrLength - 1];
	    newContactDataObject.contacts.push(contactOne);
	  } else if (contactArrLength === 2) {
	    contactOne = data.contacts[contactArrLength - 1];
	    newContactDataObject.contacts.push(contactOne);
	    contactTwo = data.contacts[contactArrLength - 2];
	    newContactDataObject.contacts.push(contactTwo);
	  } else if (contactArrLength === 3) {
	    contactOne = data.contacts[contactArrLength - 1];
	    newContactDataObject.contacts.push(contactOne);
	    contactTwo = data.contacts[contactArrLength - 2];
	    newContactDataObject.contacts.push(contactTwo);
	    contactThree = data.contacts[contactArrLength - 3];
	    newContactDataObject.contacts.push(contactThree);
	  } else if (contactArrLength === 4) {
	    contactOne = data.contacts[contactArrLength - 1];
	    newContactDataObject.contacts.push(contactOne);
	    contactTwo = data.contacts[contactArrLength - 2];
	    newContactDataObject.contacts.push(contactTwo);
	    contactThree = data.contacts[contactArrLength - 3];
	    newContactDataObject.contacts.push(contactThree);
	    contactFour = data.contacts[contactArrLength - 4];
	    newContactDataObject.contacts.push(contactFour);
	  } else if (contactArrLength >= 5) {
	    contactOne = data.contacts[contactArrLength - 1];
	    newContactDataObject.contacts.push(contactOne);
	    contactTwo = data.contacts[contactArrLength - 2];
	    newContactDataObject.contacts.push(contactTwo);
	    contactThree = data.contacts[contactArrLength - 3];
	    newContactDataObject.contacts.push(contactThree);
	    contactFour = data.contacts[contactArrLength - 4];
	    newContactDataObject.contacts.push(contactFour);
	    contactFive = data.contacts[contactArrLength - 5];
	    newContactDataObject.contacts.push(contactFive);
	  }

	  data = newContactDataObject;

	  var contactFinalData = data;
	  var communicationFinalData = store.finalCommunicationData;
	  var jobFinalData = store.finalJobData;
	  var documentFinalData = store.finalDocumentData;
	  var reminderFinalData = store.finalReminderData;
	  var reminderFinalDataOverdue = store.finalReminderDataOverdue;
	  store.finalContactData = data;

	  // Converting to overdues

	  data = reminderFinalDataOverdue;

	  var remindersDataLength = data.reminders.length;

	  var revisedFinalOverdue = {
	    overdues: []
	  };

	  for (var i = 0; i < remindersDataLength; i++) {
	    var currentRemindersData = data.reminders[i];
	    revisedFinalOverdue.overdues.push(currentRemindersData);
	  }

	  reminderFinalDataOverdue = revisedFinalOverdue;
	  //

	  $('.content').children().remove();

	  var dashboardHome = displayDashboardHome({
	    reminders: reminderFinalData.reminders,
	    jobs: jobFinalData.jobs,
	    communications: communicationFinalData.communications,
	    documents: documentFinalData.documents,
	    contacts: contactFinalData.contacts,
	    overdues: reminderFinalDataOverdue.overdues
	  });

	  $('.content').append(dashboardHome);

	  hideEmptyRows("#reminder-summary-table", 3);
	  hideEmptyRows("#overdue-reminder-summary-table", 3);
	  hideEmptyRows(".job-summary-table", 3);
	  hideEmptyRows(".document-summary-table", 2);
	  hideEmptyRows(".contact-summary-table", 1);
	  hideEmptyRows(".communication-summary-table", 3);

	  var upcomingReminderLength = $("#reminder-summary-table tbody").children().length;

	  if (upcomingReminderLength === 0) {
	    $("#reminder-summary-table").remove();
	  }

	  var overdueRemindersEmptyLength = $("#overdue-reminder-summary-table tbody").children().length;

	  if (overdueRemindersEmptyLength === 0) {
	    $("#overdue-reminder-summary-table").remove();
	    // $(".all-reminders-empty").text('There are no reminders associated with your account. Click "Create Reminder" to get started.');
	  }

	  var jobEmptyLength = $(".job-summary-table tbody").children().length;

	  if (jobEmptyLength === 0) {
	    $(".job-summary-table").remove();
	    $(".job-dash-recent-table-empty").text("No jobs have been created recently");
	  }

	  var documentEmptyLength = $(".document-summary-table tbody").children().length;

	  if (documentEmptyLength === 0) {
	    $(".document-summary-table").remove();
	    $(".document-dash-recent-table-empty").text("No documents have been created recently");
	  }

	  var contactEmptyLength = $(".contact-summary-table tbody").children().length;

	  if (contactEmptyLength === 0) {
	    $(".contact-summary-table").remove();
	    $(".contact-dash-recent-table-empty").text("No contacts have been created recently");
	  }

	  var communicationEmptyLength = $(".communication-summary-table tbody").children().length;

	  if (communicationEmptyLength === 0) {
	    $(".communication-summary-table").remove();
	    $(".communication-dash-recent-table-empty").text("No communications have been created recently");
	  }

	  // The following responds to empty tables on homepage

	  if (store.isContactDashEmpty === true) {
	    $(".contact-dash-table-empty").text("No contacts have been recently added");
	    store.isContactDashEmpty = false;
	    $('.remove-contact-center').removeClass("center");
	  } else {
	    store.isContactDashEmpty = false;
	  }

	  if (store.isCommunicationDashEmpty === true) {
	    $(".communication-dash-table-empty").text("No communications have been recently added");
	    store.isCommunicationDashEmpty = false;
	    $('.remove-communication-center').removeClass("center");
	  } else {
	    store.isCommunicationDashEmpty = false;
	  }

	  if (store.isJobDashEmpty === true) {
	    $(".job-dash-table-empty").text("No deadlines occur in the next five days");
	    store.isJobDashEmpty = false;
	    $('.remove-job-center').removeClass("center");
	  } else {
	    store.isJobDashEmpty = false;
	  }

	  if (store.isReminderDashEmpty === true) {
	    $(".reminder-dash-table-empty").text("You have no reminders due in the next five days");
	    $('.hide-empty-reminder').remove();
	    $('.remove-reminder-center').removeClass("center");
	    store.isReminderDashEmpty = false;
	  } else {
	    store.isReminderDashEmpty = false;
	  }

	  if (store.isReminderDashEmptyOverdue === true) {
	    $(".reminder-dash-table-empty-overdue").text("You have no overdue reminders");
	    store.isReminderDashEmptyOverdue = false;
	  } else {
	    store.isReminderDashEmptyOverdue = false;
	  }

	  if (store.isDocumentDashEmpty === true) {
	    $(".document-dash-table-empty").text("No documents have been recently created.");
	    store.isDocumentDashEmpty = false;
	    $(".remove-document-center").removeClass("center");
	  } else {
	    store.isDocumentDashEmpty = false;
	  }

	  logic.dateFormatByClass();
	};

	var showDocumentDashTable = function showDocumentDashTable(data) {
	  var newDocumentDataObject = {
	    documents: []
	  };

	  var documentOne = void 0;
	  var documentTwo = void 0;
	  var documentThree = void 0;
	  var documentFour = void 0;
	  var documentFive = void 0;

	  var documentArrLength = data.documents.length;

	  if (documentArrLength === 0) {
	    store.isDocumentDashEmpty = true;
	  } else if (documentArrLength === 1) {
	    documentOne = data.documents[documentArrLength - 1];
	    newDocumentDataObject.documents.push(documentOne);
	  } else if (documentArrLength === 2) {
	    documentOne = data.documents[documentArrLength - 1];
	    newDocumentDataObject.documents.push(documentOne);
	    documentTwo = data.documents[documentArrLength - 2];
	    newDocumentDataObject.documents.push(documentTwo);
	  } else if (documentArrLength === 3) {
	    documentOne = data.documents[documentArrLength - 1];
	    newDocumentDataObject.documents.push(documentOne);
	    documentTwo = data.documents[documentArrLength - 2];
	    newDocumentDataObject.documents.push(documentTwo);
	    documentThree = data.documents[documentArrLength - 3];
	    newDocumentDataObject.documents.push(documentThree);
	  } else if (documentArrLength === 4) {
	    documentOne = data.documents[documentArrLength - 1];
	    newDocumentDataObject.documents.push(documentOne);
	    documentTwo = data.documents[documentArrLength - 2];
	    newDocumentDataObject.documents.push(documentTwo);
	    documentThree = data.documents[documentArrLength - 3];
	    newDocumentDataObject.documents.push(documentThree);
	    documentFour = data.documents[documentArrLength - 4];
	    newDocumentDataObject.documents.push(documentFour);
	  } else if (documentArrLength >= 5) {
	    documentOne = data.documents[documentArrLength - 1];
	    newDocumentDataObject.documents.push(documentOne);
	    documentTwo = data.documents[documentArrLength - 2];
	    newDocumentDataObject.documents.push(documentTwo);
	    documentThree = data.documents[documentArrLength - 3];
	    newDocumentDataObject.documents.push(documentThree);
	    documentFour = data.documents[documentArrLength - 4];
	    newDocumentDataObject.documents.push(documentFour);
	    documentFive = data.documents[documentArrLength - 5];
	    newDocumentDataObject.documents.push(documentFive);
	  }

	  data = newDocumentDataObject;
	  store.finalDocumentData = data;
	  logic.dateFormatByClass();
	  contactsApi.getContacts().done(showContactDashTable).fail(homeFailure);
	};

	var showCommunicationDashTable = function showCommunicationDashTable(data) {
	  var newCommunicationDataObject = {
	    communications: []
	  };

	  var communicationOne = void 0;
	  var communicationTwo = void 0;
	  var communicationThree = void 0;
	  var communicationFour = void 0;
	  var communicationFive = void 0;

	  var communicationArrLength = data.communications.length;

	  if (communicationArrLength === 0) {
	    store.isCommunicationDashEmpty = true;
	  } else if (communicationArrLength === 1) {
	    communicationOne = data.communications[communicationArrLength - 1];
	    newCommunicationDataObject.communications.push(communicationOne);
	  } else if (communicationArrLength === 2) {
	    communicationOne = data.communications[communicationArrLength - 1];
	    newCommunicationDataObject.communications.push(communicationOne);
	    communicationTwo = data.communications[communicationArrLength - 2];
	    newCommunicationDataObject.communications.push(communicationTwo);
	  } else if (communicationArrLength === 3) {
	    communicationOne = data.communications[communicationArrLength - 1];
	    newCommunicationDataObject.communications.push(communicationOne);
	    communicationTwo = data.communications[communicationArrLength - 2];
	    newCommunicationDataObject.communications.push(communicationTwo);
	    communicationThree = data.communications[communicationArrLength - 3];
	    newCommunicationDataObject.communications.push(communicationThree);
	  } else if (communicationArrLength === 4) {
	    communicationOne = data.communications[communicationArrLength - 1];
	    newCommunicationDataObject.communications.push(communicationOne);
	    communicationTwo = data.communications[communicationArrLength - 2];
	    newCommunicationDataObject.communications.push(communicationTwo);
	    communicationThree = data.communications[communicationArrLength - 3];
	    newCommunicationDataObject.communications.push(communicationThree);
	    communicationFour = data.communications[communicationArrLength - 4];
	    newCommunicationDataObject.communications.push(communicationFour);
	  } else if (communicationArrLength >= 5) {
	    communicationOne = data.communications[communicationArrLength - 1];
	    newCommunicationDataObject.communications.push(communicationOne);
	    communicationTwo = data.communications[communicationArrLength - 2];
	    newCommunicationDataObject.communications.push(communicationTwo);
	    communicationThree = data.communications[communicationArrLength - 3];
	    newCommunicationDataObject.communications.push(communicationThree);
	    communicationFour = data.communications[communicationArrLength - 4];
	    newCommunicationDataObject.communications.push(communicationFour);
	    communicationFive = data.communications[communicationArrLength - 5];
	    newCommunicationDataObject.communications.push(communicationFive);
	  }

	  data = newCommunicationDataObject;
	  store.finalCommunicationData = data;
	  logic.dateFormatByClass();
	  documentsApi.getDocuments().done(showDocumentDashTable).fail(homeFailure);
	};

	// Archived upcoming job deadlines //
	var showJobDashTable = function showJobDashTable(data) {

	  var newJobDataObject = {
	    jobs: []
	  };

	  var jobOne = void 0;
	  var jobTwo = void 0;
	  var jobThree = void 0;
	  var jobFour = void 0;
	  var jobFive = void 0;

	  var jobArrLength = data.jobs.length;

	  if (jobArrLength === 0) {
	    store.isJobDashEmpty = true;
	  } else if (jobArrLength === 1) {
	    jobOne = data.jobs[jobArrLength - 1];
	    newJobDataObject.jobs.push(jobOne);
	  } else if (jobArrLength === 2) {
	    jobOne = data.jobs[jobArrLength - 1];
	    newJobDataObject.jobs.push(jobOne);
	    jobTwo = data.jobs[jobArrLength - 2];
	    newJobDataObject.jobs.push(jobTwo);
	  } else if (jobArrLength === 3) {
	    jobOne = data.jobs[jobArrLength - 1];
	    newJobDataObject.jobs.push(jobOne);
	    jobTwo = data.jobs[jobArrLength - 2];
	    newJobDataObject.jobs.push(jobTwo);
	    jobThree = data.jobs[jobArrLength - 3];
	    newJobDataObject.jobs.push(jobThree);
	  } else if (jobArrLength === 4) {
	    jobOne = data.jobs[jobArrLength - 1];
	    newJobDataObject.jobs.push(jobOne);
	    jobTwo = data.jobs[jobArrLength - 2];
	    newJobDataObject.jobs.push(jobTwo);
	    jobThree = data.jobs[jobArrLength - 3];
	    newJobDataObject.jobs.push(jobThree);
	    jobFour = data.jobs[jobArrLength - 4];
	    newJobDataObject.jobs.push(jobFour);
	  } else if (jobArrLength >= 5) {
	    jobOne = data.jobs[jobArrLength - 1];
	    newJobDataObject.jobs.push(jobOne);
	    jobTwo = data.jobs[jobArrLength - 2];
	    newJobDataObject.jobs.push(jobTwo);
	    jobThree = data.jobs[jobArrLength - 3];
	    newJobDataObject.jobs.push(jobThree);
	    jobFour = data.jobs[jobArrLength - 4];
	    newJobDataObject.jobs.push(jobFour);
	    jobFive = data.jobs[jobArrLength - 5];
	    newJobDataObject.jobs.push(jobFive);
	  }

	  data = newJobDataObject;
	  store.finalJobData = data;
	  logic.dateFormatByClass();
	  communicationsApi.getCommunications().done(showCommunicationDashTable).fail(homeFailure);
	};

	//
	// // Archived upcoming job deadlines //
	// const showJobDashTable = (data) => {
	//   let newDataObject = {
	//     jobs: []
	//   };
	//
	//   let today = todaysDate();
	//   let allJobsData = data.jobs;
	//
	//   for (let i = 0; i < allJobsData.length; i++) {
	//     let currentDeadline = allJobsData[i].deadline;
	//
	//     if (currentDeadline !== null && currentDeadline !== undefined) {
	//
	//       let convertedNum = convertDateToNum(currentDeadline);
	//
	//       let isUpcoming = isItUpcoming(today, convertedNum);
	//
	//       if (isUpcoming) {
	//         newDataObject.jobs.push(allJobsData[i]);
	//       }
	//
	//     }
	//   }
	//
	//   if ( newDataObject.jobs.length === 0) {
	//     store.isJobDashEmpty = true;
	//   }
	//
	//   store.finalJobData = newDataObject;
	//   communicationsApi.getCommunications()
	//     .done(showCommunicationDashTable)
	//     .fail(homeFailure);
	// };


	var showRemindersApproachDashTable = function showRemindersApproachDashTable(data) {
	  $(".notification-container").children().text("");

	  ///////////////////////////////////
	  /////////////Overdue///////////////
	  ///////////////////////////////////

	  var dataOverdue = addDateToNumApproach(data, 2);

	  var dataLengthOverdue = dataOverdue.reminders.length;

	  var emptyRemindersObjectOverdue = generateEmptyReminders(dataLengthOverdue);

	  var numIdArrOverdue = store.numIdReminderArrOverdue;

	  for (var i = 0; i < numIdArrOverdue.length; i++) {
	    var numIdToStringOverdue = numIdArrOverdue[i].toString();
	    var splitIdOverdue = numIdToStringOverdue.split(".");
	    var splitIdToNumOverdue = parseInt(splitIdOverdue[1]);
	    emptyRemindersObjectOverdue.reminders[i].id = splitIdToNumOverdue;
	  }

	  for (var _i = 0; _i < emptyRemindersObjectOverdue.reminders.length; _i++) {
	    var currentEmptyDataOverdue = emptyRemindersObjectOverdue.reminders[_i];
	    var emptyDataIdOverdue = emptyRemindersObjectOverdue.reminders[_i].id;

	    for (var j = 0; j < dataOverdue.reminders.length; j++) {
	      if (dataOverdue.reminders[j].id === emptyDataIdOverdue) {
	        currentEmptyDataOverdue.reminder_date = dataOverdue.reminders[j].reminder_date;
	        currentEmptyDataOverdue.job_ref_text = dataOverdue.reminders[j].job_ref_text;
	        currentEmptyDataOverdue.reminder_type = dataOverdue.reminders[j].reminder_type;
	        currentEmptyDataOverdue.reminder_subject = dataOverdue.reminders[j].reminder_subject;
	      }
	    }
	  }

	  dataOverdue = emptyRemindersObjectOverdue;

	  if (emptyRemindersObjectOverdue.reminders.length === 0) {
	    store.isReminderDashEmptyOverdue = true;
	  }
	  store.finalReminderDataOverdue = dataOverdue;

	  ///////////////////////////////////
	  /////////////Upcoming//////////////
	  ///////////////////////////////////

	  data = addDateToNumApproach(data, 1);
	  var dataLength = data.reminders.length;

	  var emptyRemindersObject = generateEmptyReminders(dataLength);

	  var numIdArr = store.numIdReminderArr;

	  for (var _i2 = 0; _i2 < numIdArr.length; _i2++) {
	    var numIdToString = numIdArr[_i2].toString();
	    var splitId = numIdToString.split(".");
	    var splitIdToNum = parseInt(splitId[1]);
	    emptyRemindersObject.reminders[_i2].id = splitIdToNum;
	  }

	  for (var _i3 = 0; _i3 < emptyRemindersObject.reminders.length; _i3++) {
	    var currentEmptyData = emptyRemindersObject.reminders[_i3];
	    var emptyDataId = emptyRemindersObject.reminders[_i3].id;

	    for (var _j = 0; _j < data.reminders.length; _j++) {
	      if (data.reminders[_j].id === emptyDataId) {
	        currentEmptyData.reminder_date = data.reminders[_j].reminder_date;
	        currentEmptyData.job_ref_text = data.reminders[_j].job_ref_text;
	        currentEmptyData.reminder_type = data.reminders[_j].reminder_type;
	        currentEmptyData.reminder_subject = data.reminders[_j].reminder_subject;
	      }
	    }
	  }

	  data = emptyRemindersObject;

	  if (emptyRemindersObject.reminders.length === 0) {
	    store.isReminderDashEmpty = true;
	  }
	  store.finalReminderData = data;
	  logic.dateFormatByClass();
	  jobsApi.getJobs().done(showJobDashTable).fail(homeFailure);
	};

	var showMobileOptions = function showMobileOptions() {
	  var areOptionsVisible = $(".nav-mobile-ul").css("display");
	  if (areOptionsVisible === "none") {
	    $(".nav-mobile-ul").slideDown();
	  } else {
	    $(".nav-mobile-ul").slideUp();
	  }
	};

	module.exports = {
	  showJobDashTable: showJobDashTable,
	  homeFailure: homeFailure,
	  showRemindersApproachDashTable: showRemindersApproachDashTable,
	  showCommunicationDashTable: showCommunicationDashTable,
	  showMobileOptions: showMobileOptions
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var config = __webpack_require__(6);
	var store = __webpack_require__(9);

	// Communications API

	var getCommunications = function getCommunications() {
	  return $.ajax({
	    url: config.apiOrigin + '/communications/',
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var showCommunication = function showCommunication() {
	  return $.ajax({
	    url: config.apiOrigin + '/communications/' + store.currentCommunicationId,
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var createCommunication = function createCommunication(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/communications/',
	    method: 'POST',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    },
	    data: data
	  });
	};

	var deleteCommunication = function deleteCommunication(id) {
	  return $.ajax({
	    url: config.apiOrigin + '/communications/' + id,
	    method: 'DELETE',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var updateCommunication = function updateCommunication(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/communications/' + store.currentCommunicationId,
	    method: 'PATCH',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    },
	    data: data
	  });
	};

	module.exports = {
	  getCommunications: getCommunications,
	  createCommunication: createCommunication,
	  deleteCommunication: deleteCommunication,
	  showCommunication: showCommunication,
	  updateCommunication: updateCommunication
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var config = __webpack_require__(6);
	var store = __webpack_require__(9);

	// Documents API

	var getDocuments = function getDocuments() {
	  return $.ajax({
	    url: config.apiOrigin + '/documents/',
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var showDocument = function showDocument() {
	  return $.ajax({
	    url: config.apiOrigin + '/documents/' + store.currentDocumentId,
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var createDocument = function createDocument(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/documents/',
	    method: 'POST',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    },
	    data: data
	  });
	};

	var deleteDocument = function deleteDocument(id) {
	  return $.ajax({
	    url: config.apiOrigin + '/documents/' + id,
	    method: 'DELETE',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var updateDocument = function updateDocument(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/documents/' + store.currentDocumentId,
	    method: 'PATCH',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    },
	    data: data
	  });
	};

	module.exports = {
	  getDocuments: getDocuments,
	  createDocument: createDocument,
	  deleteDocument: deleteDocument,
	  showDocument: showDocument,
	  updateDocument: updateDocument
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var config = __webpack_require__(6);
	var store = __webpack_require__(9);

	// Contacts API

	var getContacts = function getContacts() {
	  return $.ajax({
	    url: config.apiOrigin + '/contacts/',
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var showContact = function showContact() {
	  return $.ajax({
	    url: config.apiOrigin + '/contacts/' + store.currentContactId,
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var createContact = function createContact(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/contacts/',
	    method: 'POST',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    },
	    data: data
	  });
	};

	var deleteContact = function deleteContact(id) {
	  return $.ajax({
	    url: config.apiOrigin + '/contacts/' + id,
	    method: 'DELETE',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var updateContact = function updateContact(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/contacts/' + store.currentContactId,
	    method: 'PATCH',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    },
	    data: data
	  });
	};

	module.exports = {
	  getContacts: getContacts,
	  createContact: createContact,
	  deleteContact: deleteContact,
	  showContact: showContact,
	  updateContact: updateContact
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var letterToNum = function letterToNum(letter) {
	  var num = void 0;
	  if (letter === "a") {
	    num = 1;
	  } else if (letter === "b") {
	    num = 2;
	  } else if (letter === "c") {
	    num = 3;
	  } else if (letter === "d") {
	    num = 4;
	  } else if (letter === "e") {
	    num = 5;
	  } else if (letter === "f") {
	    num = 6;
	  } else if (letter === "g") {
	    num = 7;
	  } else if (letter === "h") {
	    num = 8;
	  } else if (letter === "i") {
	    num = 9;
	  } else if (letter === "j") {
	    num = 10;
	  } else if (letter === "k") {
	    num = 11;
	  } else if (letter === "l") {
	    num = 12;
	  } else if (letter === "m") {
	    num = 13;
	  } else if (letter === "n") {
	    num = 14;
	  } else if (letter === "o") {
	    num = 15;
	  } else if (letter === "p") {
	    num = 16;
	  } else if (letter === "q") {
	    num = 17;
	  } else if (letter === "r") {
	    num = 18;
	  } else if (letter === "s") {
	    num = 19;
	  } else if (letter === "t") {
	    num = 20;
	  } else if (letter === "u") {
	    num = 21;
	  } else if (letter === "v") {
	    num = 22;
	  } else if (letter === "w") {
	    num = 23;
	  } else if (letter === "x") {
	    num = 24;
	  } else if (letter === "y") {
	    num = 25;
	  } else if (letter === "z") {
	    num = 26;
	  } else if (letter === " ") {
	    num = 27;
	  } else {
	    num = 0;
	  }

	  return num;
	};

	var NumToLetter = function NumToLetter(letter) {
	  var num = void 0;
	  if (num === 1) {
	    letter = "a";
	  } else if (num === 2) {
	    letter = "b";
	  } else if (letter === 3) {
	    letter = "c";
	  } else if (letter === 4) {
	    letter = "d";
	  } else if (letter === 5) {
	    letter = "e";
	  } else if (letter === 6) {
	    letter = "f";
	  } else if (letter === 7) {
	    letter = "g";
	  } else if (letter === 8) {
	    letter = "h";
	  } else if (letter === 9) {
	    letter = "i";
	  } else if (letter === 10) {
	    letter = "j";
	  } else if (letter === 11) {
	    letter = "k";
	  } else if (letter === 12) {
	    letter = "l";
	  } else if (letter === 13) {
	    letter = "m";
	  } else if (letter === 14) {
	    letter = "n";
	  } else if (letter === 15) {
	    letter = "o";
	  } else if (letter === 16) {
	    letter = "p";
	  } else if (letter === 17) {
	    letter = "q";
	  } else if (letter === 18) {
	    letter = "r";
	  } else if (letter === 19) {
	    letter = "s";
	  } else if (letter === 20) {
	    letter = "t";
	  } else if (letter === 21) {
	    letter = "u";
	  } else if (letter === 22) {
	    letter = "v";
	  } else if (letter === 23) {
	    letter = "w";
	  } else if (letter === 24) {
	    letter = "x";
	  } else if (letter === 25) {
	    letter = "y";
	  } else if (letter === 26) {
	    letter = "z";
	  } else if (letter === 27) {
	    letter = " ";
	  } else {
	    letter = "";
	  }

	  return letter;
	};

	var alphabatize = function alphabatize(company) {
	  console.log(company);

	  var nameSplit = company.toLowerCase().split("");

	  // Will need if statement for blank situation

	  var emptyArr = [];

	  for (var i = 0; i < nameSplit.length; i++) {
	    var letter = nameSplit[i];
	    var number = letterToNum(letter);
	    emptyArr.push(number);
	  }

	  console.log('convert to num arr');
	  console.log(emptyArr);

	  var convertBack = [];

	  for (var _i = 0; _i < emptyArr.length; _i++) {
	    var num = emptyArr[_i];
	    var _letter = NumToLetter(num);
	    convertBack.push(_letter);
	  }

	  console.log('letterArr');
	  console.log(convertBack);

	  convertBack = convertBack.join("");

	  console.log(convertBack);
	};

	var formatDate = function formatDate(date) {
	  if (date !== null) {
	    var splitDate = date.split("-");

	    if (splitDate.length > 1) {
	      var revisedDate = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
	      return revisedDate;
	    } else {
	      return date;
	    }
	  } else {
	    return null;
	  }
	};

	var dateFormatByClass = function dateFormatByClass() {
	  var classCollection = $(".format-date");
	  classCollection.each(function () {
	    var textVal = $(this).text();

	    if (textVal !== "") {
	      textVal = $(this).text().trim();
	      var formattedDate = formatDate(textVal);
	      // console.log(formattedDate);
	      $(this).text(formattedDate);
	    }
	    // console.log(textVal);
	  });
	};

	var convertPercentage = function convertPercentage() {
	  var allInputs = document.querySelectorAll('.text-input');
	  var allInputsLength = allInputs.length;

	  for (var i = 0; i < allInputsLength; ++i) {
	    var currentVal = allInputs[i].value;
	    var currentArr = currentVal.split("");

	    for (var j = 0; j < currentArr.length; j++) {
	      if (currentArr[j] === "%") {
	        currentArr[j] = " percent";
	      }
	    }

	    var revisedValue = currentArr.join("");

	    allInputs[i].value = revisedValue;
	  }
	};

	var defaultDate = function defaultDate() {
	  var d = new Date();
	  var month = d.getMonth() + 1;
	  var day = d.getDate();
	  var output = d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
	  return output;
	};

	var onResizeTextarea = function onResizeTextarea(currentId) {

	  // let currentId = $(this).attr("id");

	  var MaxHeight = 2000;
	  var textarea = document.getElementById(currentId);
	  var textareaRows = textarea.value.split("\n");
	  var counter = void 0;

	  if (textareaRows[0] !== "undefined" && textareaRows.length < MaxHeight) {
	    counter = textareaRows.length;
	  } else if (textareaRows.length >= MaxHeight) {
	    counter = MaxHeight;
	  } else {
	    counter = 1;
	  }

	  textarea.rows = counter;
	};

	var textAreaHeightUpdate = function textAreaHeightUpdate(divId) {
	  var text = $(divId).text();
	  var tempDiv = $('<div id="temp"></div>');
	  var currentTdWidth = $(divId).width();
	  var currentTdWidthPx = currentTdWidth.toString() + "px";
	  tempDiv.css({
	    "width": currentTdWidthPx,
	    "white-space": "pre-line",
	    "font-size": "15px"
	  });

	  tempDiv.text(text);
	  $('body').append(tempDiv);

	  var useHeight = $("#temp").height();

	  if (useHeight > 0) {
	    var useHeightPx = useHeight.toString() + "px";
	    $(divId).css("height", useHeightPx);
	  }

	  $("#temp").remove();
	};

	var convertToUrl = function convertToUrl(url) {
	  var submittedUrlArr = url.split("");
	  var returnUrl = void 0;

	  if (submittedUrlArr[0] === "w") {
	    returnUrl = "http://" + url;
	  } else {
	    returnUrl = url;
	  }

	  return returnUrl;
	};

	var displayUrl = function displayUrl() {
	  var showPath = "/...";
	  var preceding = "www.";
	  var removedPath = void 0;
	  var fullUrl = void 0;
	  var url = $(".display-url").attr("href");
	  var urlArr = void 0;
	  var isWWW = url.split("www.").length > 1;
	  var isHttp = url.split("http://").length > 1;
	  var isHttpS = url.split("https://").length > 1;
	  var isBlank = url.trim() === "";

	  if (isWWW) {
	    urlArr = url.split("www.");
	    removedPath = urlArr[1].split("/");
	    fullUrl = preceding + removedPath[0] + showPath;
	    $(".display-url").text(fullUrl);
	    $(".display-empty-p").remove();
	    return;
	  } else if (isHttpS) {
	    urlArr = url.split("https://");
	    removedPath = urlArr[1].split("/");
	    fullUrl = preceding + removedPath[0] + showPath;
	    $(".display-url").text(fullUrl);
	    $(".display-empty-p").remove();
	    return;
	  } else if (isHttp) {
	    urlArr = url.split("http://");
	    removedPath = urlArr[1].split("/");
	    fullUrl = preceding + removedPath[0] + showPath;
	    $(".display-url").text(fullUrl);
	    $(".display-empty-p").remove();
	    return;
	  } else if (isBlank) {
	    $(".display-empty-p").text("N/A");
	    $(".display-url").remove();
	    return;
	  } else {
	    $(".display-url").text("link");
	    $(".display-empty-p").remove();
	    return;
	  }
	};

	module.exports = {
	  convertToUrl: convertToUrl,
	  displayUrl: displayUrl,
	  textAreaHeightUpdate: textAreaHeightUpdate,
	  onResizeTextarea: onResizeTextarea,
	  defaultDate: defaultDate,
	  convertPercentage: convertPercentage,
	  formatDate: formatDate,
	  dateFormatByClass: dateFormatByClass,
	  alphabatize: alphabatize
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "              <tr>\n                <td class=\"hidden-xs format-date\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.reminder_date : stack1), depth0))
	    + "\n                </td>\n                <td class=\"hidden-md hidden-sm hidden-xs display-company-name get-reminders-job-ref-text\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-reminder-location\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.reminder_subject : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-reminder-submit\">\n                  <button type=\"button\" class=\"btn btn-default btn-sm view-reminder-record-btn\" data-current-reminder-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-contact-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.contact_ref_id : stack1), depth0))
	    + "\">View</button>\n                </td>\n              </tr>\n";
	},"3":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "              <tr>\n                <td class=\"hidden-xs format-date\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.reminder_date : stack1), depth0))
	    + "\n                </td>\n                <td class=\"hidden-md hidden-sm hidden-xs display-company-name get-reminders-job-ref-text\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-reminder-location\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.reminder_subject : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-reminder-submit\">\n                  <button type=\"button\" class=\"btn btn-default btn-sm view-reminder-record-btn\" data-current-reminder-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-contact-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.contact_ref_id : stack1), depth0))
	    + "\">View</button>\n                </td>\n              </tr>\n";
	},"5":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "              <tr>\n                <td class=\"display-company-name\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_name : stack1), depth0))
	    + "\n                </td>\n                <td>\n                  <button type=\"button\" class=\"btn btn-default btn-sm dashboard-job-record-btn\" data-current-job-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\">View Record</button>\n                </td>\n              </tr>\n";
	},"7":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "              <tr>\n                <td class=\"display-company-name\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_name : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-job-title hidden-xs\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.priority_num : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-job-deadline hidden-xs\">\n\n"
	    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = blockParams[0][0]) != null ? stack1.applied : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams),"inverse":container.program(10, data, 0, blockParams),"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "                </td>\n                <td>\n                  <button type=\"button\" class=\"btn btn-default btn-sm dashboard-job-record-btn\" data-current-job-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\">View</button>\n                </td>\n              </tr>\n";
	},"8":function(container,depth0,helpers,partials,data) {
	    return "                  Yes\n";
	},"10":function(container,depth0,helpers,partials,data) {
	    return "                  No\n";
	},"12":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "                <tr>\n                  <td class=\"display-document-type hidden-xs\">\n                    "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.doctype : stack1), depth0))
	    + "\n                  </td>\n                  <td class=\"display-document-subject\">\n                    "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.docsubject : stack1), depth0))
	    + "\n                  </td>\n                  <td class=\"display-document-submit\">\n                    <button type=\"button\" class=\"btn btn-default btn-sm dashboard-document-record-btn\" data-current-document-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\">View</button>\n                  </td>\n                </tr>\n";
	},"14":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "              <tr>\n                <td class=\"display-contact-full-name\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.full_name : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-contact-submit\">\n                  <button type=\"button\" class=\"btn btn-default btn-sm dashboard-contact-record-btn\" data-current-contact-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-job-ref-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-job-ref-text=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">View</button>\n                </td>\n              </tr>\n";
	},"16":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "              <tr>\n                <td class=\"hidden-xs format-date\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.c_date : stack1), depth0))
	    + "\n                </td>\n                <td class=\"hidden-md hidden-sm hidden-xs display-communication-company-name\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.c_method : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-communication-email\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.c_subject : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-communication-submit\">\n                  <button type=\"button\" class=\"btn btn-default btn-sm dashboard-communication-record-btn\" data-current-communication-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-company-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_ref_id : stack1), depth0))
	    + "\" data-current-job-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\"\n                      data-current-document-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.document_ref_id : stack1), depth0))
	    + "\">View</button>\n                </td>\n              </tr>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=depth0 != null ? depth0 : {};

	  return "<!-- <div class=\"navbar navbar-inverse navbar-fixed-left\">\n\n  <ul class=\"nav navbar-nav\">\n   <li class=\"dropdown\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">Create<span class=\"caret\"></span></a>\n     <ul class=\"dropdown-menu\" role=\"menu\">\n      <li><a href=\"https://www.test.com\">Job</a></li>\n      <li><a href=\"#\">Reminder</a></li>\n      <li><a href=\"#\">Document</a></li>\n      <li><a href=\"#\">Contact</a></li>\n      <li><a href=\"#\">Communication</a></li>\n      <li class=\"divider\"></li>\n      <li><a href=\"#\">Sub Menu4</a></li>\n      <li><a href=\"#\">Sub Menu5</a></li>\n     </ul>\n   </li>\n   <li><a href=\"#\">Dashboard</a></li>\n   <li><a href=\"#\">Jobs</a></li>\n   <li><a href=\"#\">Reminders</a></li>\n   <li><a href=\"#\">Documents</a></li>\n   <li><a href=\"#\">Contacts</a></li>\n   <li><a href=\"#\">Communications</a></li>\n  </ul>\n</div> -->\n\n\n\n<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <h1>Reminders</h1>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-xs-12 col-sm-6\">\n    <div class=\"dash-home-table\">\n      <h2>Upcoming</h2>\n        <table id=\"reminder-summary-table\" class=\"table reminder-summary-table\">\n          <thead>\n            <tr>\n              <th class=\"hidden-xs\">Notification Date</th>\n              <th class=\"hidden-md hidden-sm hidden-xs\">Company Name</th>\n              <th>Reminder Subject</th>\n              <th>View Record</th>\n            </tr>\n          </thead>\n          <tbody>\n"
	    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.reminders : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "          </tbody>\n        </table>\n        <p class=\"reminder-dash-table-empty\"></p>\n        <!-- <div class=\"center\">\n          <button id=\"generate-create-reminder-btn\" type=\"button\" class=\"btn btn-success\">Create</button>\n          <button type=\"button\" class=\"btn btn-info get-reminders\">View All</button>\n        </div> -->\n      </div>\n    </div>\n\n    <div class=\"col-xs-12 col-sm-6\">\n      <div class=\"dash-home-table hide-empty-reminder\">\n        <h2>Overdue</h2>\n        <table id=\"overdue-reminder-summary-table\" class=\"table reminder-summary-table\">\n          <thead>\n            <tr>\n              <th class=\"hidden-xs\">Notification Date</th>\n              <th class=\"hidden-md hidden-sm hidden-xs\">Company Name</th>\n              <th>Reminder Subject</th>\n              <th>View Record</th>\n            </tr>\n          </thead>\n          <tbody>\n"
	    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.overdues : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "          </tbody>\n        </table>\n        <p class=\"reminder-dash-table-empty-overdue\"></p>\n        <!-- <div class=\"center\">\n          <button id=\"generate-create-reminder-overdue-btn\" type=\"button\" class=\"btn btn-success\">Create</button>\n          <button type=\"button\" class=\"btn btn-info get-reminders\">View All</button>\n        </div> -->\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <div class=\"center remove-reminder-center\">\n        <button id=\"generate-create-reminder-overdue-btn\" type=\"button\" class=\"btn btn-success\">Create</button>\n        <button type=\"button\" class=\"btn btn-info get-reminders\">View All</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- <div class=\"col-xs-2\">\n      <div class=\"dash-home-table\">\n\n        <h2>Approaching Job Deadlines</h3>\n\n        <table class=\"table job-summary-table table-hover\">\n          <thead>\n            <tr>\n              <th>Company Name</th>\n              <th>View Record</th>\n            </tr>\n          </thead>\n          <tbody>\n"
	    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.jobs : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "          </tbody>\n        </table>\n        <p class=\"job-dash-table-empty\"></p>\n        <div class=\"center\">\n          <button id=\"dashboard-new-job-btn\" type=\"button\" class=\"btn btn-success\">Create</button>\n          <button type=\"button\" class=\"btn btn-info get-jobs\">View All</button>\n        </div>\n\n      </div>\n    </div> -->\n\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <h1>Recently Created</h1>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-sm-6\">\n      <div class=\"communication-page group-category dash-home-table\">\n        <h2>Jobs</h3>\n        <table class=\"table job-summary-table\">\n          <thead>\n            <tr>\n              <th>Company Name</th>\n              <th class=\"hidden-xs\">Priority</th>\n              <th class=\"hidden-xs\">Applied?</th>\n              <th>View Record</th>\n            </tr>\n          </thead>\n          <tbody>\n"
	    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.jobs : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "          </tbody>\n        </table>\n        <p class=\"job-dash-recent-table-empty\"></p>\n        <div class=\"center remove-job-center\">\n          <button id=\"dashboard-new-job-btn\" type=\"button\" class=\"btn btn-success\">Create</button>\n          <button type=\"button\" class=\"btn btn-info get-jobs\">View All</button>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-xs-12 col-sm-6\">\n      <div class=\"communication-page group-category dash-home-table\">\n        <h2>Documents</h3>\n          <table class=\"table document-summary-table\">\n            <thead>\n              <tr>\n                <th class=\"hidden-xs\">Document Type</th>\n                <th>Document Subject</th>\n                <th>View Record</th>\n              </tr>\n            </thead>\n            <tbody>\n"
	    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.documents : depth0),{"name":"each","hash":{},"fn":container.program(12, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "            </tbody>\n          </table>\n        <p class=\"document-dash-recent-table-empty\"></p>\n        <div class=\"remove-document-center center\">\n          <button id=\"dashboard-new-document-btn\" type=\"button\" class=\"btn btn-success\">Create</button>\n          <button type=\"button\" class=\"btn btn-info get-documents\">View All</button>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row\">\n\n    <div class=\"col-xs-12 col-sm-6\">\n      <div class=\"contact-page group-category dash-home-table\">\n\n        <h2>Contacts</h3>\n\n        <table class=\"table contact-summary-table\">\n          <thead>\n            <tr>\n              <th>Full Name</th>\n              <th>View Record</th>\n            </tr>\n          </thead>\n          <tbody>\n"
	    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.contacts : depth0),{"name":"each","hash":{},"fn":container.program(14, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "          </tbody>\n        </table>\n        <p class=\"contact-dash-recent-table-empty\"></p>\n        <div class=\"center remove-contact-center\">\n          <button id=\"dashboard-new-contact-btn\" type=\"button\" class=\"btn btn-success\">Create</button>\n          <button type=\"button\" class=\"btn btn-info get-contacts\">View All</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"col-xs-12 col-sm-6\">\n      <div class=\"communication-page group-category dash-home-table\">\n        <h2>Communications</h3>\n        <table class=\"table communication-summary-table\">\n          <thead>\n            <tr>\n              <th class=\"hidden-xs\">Date</th>\n              <th class=\"hidden-md hidden-sm hidden-xs\">Method</th>\n              <th>Subject</th>\n              <th>View Record</th>\n            </tr>\n          </thead>\n          <tbody>\n"
	    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.communications : depth0),{"name":"each","hash":{},"fn":container.program(16, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "          </tbody>\n        </table>\n        <p class=\"communication-dash-recent-table-empty\"></p>\n        <div class=\"center remove-communication-center\">\n          <button id=\"generate-create-communication-btn\" type=\"button\" class=\"btn btn-success\">Create</button>\n          <button type=\"button\" class=\"btn btn-info get-communications\">View All</button>\n        </div>\n      </div>\n    </div>\n  </div>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Create a simple path alias to allow browserify to resolve
	// the runtime on a supported path.
	module.exports = __webpack_require__(19)['default'];


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// istanbul ignore next

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _handlebarsBase = __webpack_require__(20);

	var base = _interopRequireWildcard(_handlebarsBase);

	// Each of these augment the Handlebars object. No need to setup here.
	// (This is done to easily share code between commonjs and browse envs)

	var _handlebarsSafeString = __webpack_require__(34);

	var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

	var _handlebarsException = __webpack_require__(22);

	var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

	var _handlebarsUtils = __webpack_require__(21);

	var Utils = _interopRequireWildcard(_handlebarsUtils);

	var _handlebarsRuntime = __webpack_require__(35);

	var runtime = _interopRequireWildcard(_handlebarsRuntime);

	var _handlebarsNoConflict = __webpack_require__(36);

	var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

	// For compatibility and usage outside of module systems, make the Handlebars object a namespace
	function create() {
	  var hb = new base.HandlebarsEnvironment();

	  Utils.extend(hb, base);
	  hb.SafeString = _handlebarsSafeString2['default'];
	  hb.Exception = _handlebarsException2['default'];
	  hb.Utils = Utils;
	  hb.escapeExpression = Utils.escapeExpression;

	  hb.VM = runtime;
	  hb.template = function (spec) {
	    return runtime.template(spec, hb);
	  };

	  return hb;
	}

	var inst = create();
	inst.create = create;

	_handlebarsNoConflict2['default'](inst);

	inst['default'] = inst;

	exports['default'] = inst;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9oYW5kbGViYXJzLnJ1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OEJBQXNCLG1CQUFtQjs7SUFBN0IsSUFBSTs7Ozs7b0NBSU8sMEJBQTBCOzs7O21DQUMzQix3QkFBd0I7Ozs7K0JBQ3ZCLG9CQUFvQjs7SUFBL0IsS0FBSzs7aUNBQ1Esc0JBQXNCOztJQUFuQyxPQUFPOztvQ0FFSSwwQkFBMEI7Ozs7O0FBR2pELFNBQVMsTUFBTSxHQUFHO0FBQ2hCLE1BQUksRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7O0FBRTFDLE9BQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLElBQUUsQ0FBQyxVQUFVLG9DQUFhLENBQUM7QUFDM0IsSUFBRSxDQUFDLFNBQVMsbUNBQVksQ0FBQztBQUN6QixJQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNqQixJQUFFLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDOztBQUU3QyxJQUFFLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQztBQUNoQixJQUFFLENBQUMsUUFBUSxHQUFHLFVBQVMsSUFBSSxFQUFFO0FBQzNCLFdBQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7R0FDbkMsQ0FBQzs7QUFFRixTQUFPLEVBQUUsQ0FBQztDQUNYOztBQUVELElBQUksSUFBSSxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixrQ0FBVyxJQUFJLENBQUMsQ0FBQzs7QUFFakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQzs7cUJBRVIsSUFBSSIsImZpbGUiOiJoYW5kbGViYXJzLnJ1bnRpbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBiYXNlIGZyb20gJy4vaGFuZGxlYmFycy9iYXNlJztcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbmltcG9ydCBTYWZlU3RyaW5nIGZyb20gJy4vaGFuZGxlYmFycy9zYWZlLXN0cmluZyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vaGFuZGxlYmFycy9leGNlcHRpb24nO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi9oYW5kbGViYXJzL3V0aWxzJztcbmltcG9ydCAqIGFzIHJ1bnRpbWUgZnJvbSAnLi9oYW5kbGViYXJzL3J1bnRpbWUnO1xuXG5pbXBvcnQgbm9Db25mbGljdCBmcm9tICcuL2hhbmRsZWJhcnMvbm8tY29uZmxpY3QnO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbmZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgbGV0IGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcbiAgaGIuZXNjYXBlRXhwcmVzc2lvbiA9IFV0aWxzLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgaGIuVk0gPSBydW50aW1lO1xuICBoYi50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICByZXR1cm4gcnVudGltZS50ZW1wbGF0ZShzcGVjLCBoYik7XG4gIH07XG5cbiAgcmV0dXJuIGhiO1xufVxuXG5sZXQgaW5zdCA9IGNyZWF0ZSgpO1xuaW5zdC5jcmVhdGUgPSBjcmVhdGU7XG5cbm5vQ29uZmxpY3QoaW5zdCk7XG5cbmluc3RbJ2RlZmF1bHQnXSA9IGluc3Q7XG5cbmV4cG9ydCBkZWZhdWx0IGluc3Q7XG4iXX0=


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.HandlebarsEnvironment = HandlebarsEnvironment;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utils = __webpack_require__(21);

	var _exception = __webpack_require__(22);

	var _exception2 = _interopRequireDefault(_exception);

	var _helpers = __webpack_require__(23);

	var _decorators = __webpack_require__(31);

	var _logger = __webpack_require__(33);

	var _logger2 = _interopRequireDefault(_logger);

	var VERSION = '4.0.5';
	exports.VERSION = VERSION;
	var COMPILER_REVISION = 7;

	exports.COMPILER_REVISION = COMPILER_REVISION;
	var REVISION_CHANGES = {
	  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
	  2: '== 1.0.0-rc.3',
	  3: '== 1.0.0-rc.4',
	  4: '== 1.x.x',
	  5: '== 2.0.0-alpha.x',
	  6: '>= 2.0.0-beta.1',
	  7: '>= 4.0.0'
	};

	exports.REVISION_CHANGES = REVISION_CHANGES;
	var objectType = '[object Object]';

	function HandlebarsEnvironment(helpers, partials, decorators) {
	  this.helpers = helpers || {};
	  this.partials = partials || {};
	  this.decorators = decorators || {};

	  _helpers.registerDefaultHelpers(this);
	  _decorators.registerDefaultDecorators(this);
	}

	HandlebarsEnvironment.prototype = {
	  constructor: HandlebarsEnvironment,

	  logger: _logger2['default'],
	  log: _logger2['default'].log,

	  registerHelper: function registerHelper(name, fn) {
	    if (_utils.toString.call(name) === objectType) {
	      if (fn) {
	        throw new _exception2['default']('Arg not supported with multiple helpers');
	      }
	      _utils.extend(this.helpers, name);
	    } else {
	      this.helpers[name] = fn;
	    }
	  },
	  unregisterHelper: function unregisterHelper(name) {
	    delete this.helpers[name];
	  },

	  registerPartial: function registerPartial(name, partial) {
	    if (_utils.toString.call(name) === objectType) {
	      _utils.extend(this.partials, name);
	    } else {
	      if (typeof partial === 'undefined') {
	        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
	      }
	      this.partials[name] = partial;
	    }
	  },
	  unregisterPartial: function unregisterPartial(name) {
	    delete this.partials[name];
	  },

	  registerDecorator: function registerDecorator(name, fn) {
	    if (_utils.toString.call(name) === objectType) {
	      if (fn) {
	        throw new _exception2['default']('Arg not supported with multiple decorators');
	      }
	      _utils.extend(this.decorators, name);
	    } else {
	      this.decorators[name] = fn;
	    }
	  },
	  unregisterDecorator: function unregisterDecorator(name) {
	    delete this.decorators[name];
	  }
	};

	var log = _logger2['default'].log;

	exports.log = log;
	exports.createFrame = _utils.createFrame;
	exports.logger = _logger2['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2Jhc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7cUJBQTRDLFNBQVM7O3lCQUMvQixhQUFhOzs7O3VCQUNFLFdBQVc7OzBCQUNSLGNBQWM7O3NCQUNuQyxVQUFVOzs7O0FBRXRCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFDeEIsSUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7OztBQUU1QixJQUFNLGdCQUFnQixHQUFHO0FBQzlCLEdBQUMsRUFBRSxhQUFhO0FBQ2hCLEdBQUMsRUFBRSxlQUFlO0FBQ2xCLEdBQUMsRUFBRSxlQUFlO0FBQ2xCLEdBQUMsRUFBRSxVQUFVO0FBQ2IsR0FBQyxFQUFFLGtCQUFrQjtBQUNyQixHQUFDLEVBQUUsaUJBQWlCO0FBQ3BCLEdBQUMsRUFBRSxVQUFVO0NBQ2QsQ0FBQzs7O0FBRUYsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7O0FBRTlCLFNBQVMscUJBQXFCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7QUFDbkUsTUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUMvQixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUM7O0FBRW5DLGtDQUF1QixJQUFJLENBQUMsQ0FBQztBQUM3Qix3Q0FBMEIsSUFBSSxDQUFDLENBQUM7Q0FDakM7O0FBRUQscUJBQXFCLENBQUMsU0FBUyxHQUFHO0FBQ2hDLGFBQVcsRUFBRSxxQkFBcUI7O0FBRWxDLFFBQU0scUJBQVE7QUFDZCxLQUFHLEVBQUUsb0JBQU8sR0FBRzs7QUFFZixnQkFBYyxFQUFFLHdCQUFTLElBQUksRUFBRSxFQUFFLEVBQUU7QUFDakMsUUFBSSxnQkFBUyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxFQUFFO0FBQ3RDLFVBQUksRUFBRSxFQUFFO0FBQUUsY0FBTSwyQkFBYyx5Q0FBeUMsQ0FBQyxDQUFDO09BQUU7QUFDM0Usb0JBQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM1QixNQUFNO0FBQ0wsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDekI7R0FDRjtBQUNELGtCQUFnQixFQUFFLDBCQUFTLElBQUksRUFBRTtBQUMvQixXQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDM0I7O0FBRUQsaUJBQWUsRUFBRSx5QkFBUyxJQUFJLEVBQUUsT0FBTyxFQUFFO0FBQ3ZDLFFBQUksZ0JBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLFVBQVUsRUFBRTtBQUN0QyxvQkFBTyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzdCLE1BQU07QUFDTCxVQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRTtBQUNsQyxjQUFNLHlFQUEwRCxJQUFJLG9CQUFpQixDQUFDO09BQ3ZGO0FBQ0QsVUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7S0FDL0I7R0FDRjtBQUNELG1CQUFpQixFQUFFLDJCQUFTLElBQUksRUFBRTtBQUNoQyxXQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUI7O0FBRUQsbUJBQWlCLEVBQUUsMkJBQVMsSUFBSSxFQUFFLEVBQUUsRUFBRTtBQUNwQyxRQUFJLGdCQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxVQUFVLEVBQUU7QUFDdEMsVUFBSSxFQUFFLEVBQUU7QUFBRSxjQUFNLDJCQUFjLDRDQUE0QyxDQUFDLENBQUM7T0FBRTtBQUM5RSxvQkFBTyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQy9CLE1BQU07QUFDTCxVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUM1QjtHQUNGO0FBQ0QscUJBQW1CLEVBQUUsNkJBQVMsSUFBSSxFQUFFO0FBQ2xDLFdBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5QjtDQUNGLENBQUM7O0FBRUssSUFBSSxHQUFHLEdBQUcsb0JBQU8sR0FBRyxDQUFDOzs7UUFFcEIsV0FBVztRQUFFLE1BQU0iLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlRnJhbWUsIGV4dGVuZCwgdG9TdHJpbmd9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuL2V4Y2VwdGlvbic7XG5pbXBvcnQge3JlZ2lzdGVyRGVmYXVsdEhlbHBlcnN9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQge3JlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnN9IGZyb20gJy4vZGVjb3JhdG9ycyc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcblxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSAnNC4wLjUnO1xuZXhwb3J0IGNvbnN0IENPTVBJTEVSX1JFVklTSU9OID0gNztcblxuZXhwb3J0IGNvbnN0IFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPT0gMS54LngnLFxuICA1OiAnPT0gMi4wLjAtYWxwaGEueCcsXG4gIDY6ICc+PSAyLjAuMC1iZXRhLjEnLFxuICA3OiAnPj0gNC4wLjAnXG59O1xuXG5jb25zdCBvYmplY3RUeXBlID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5kbGViYXJzRW52aXJvbm1lbnQoaGVscGVycywgcGFydGlhbHMsIGRlY29yYXRvcnMpIHtcbiAgdGhpcy5oZWxwZXJzID0gaGVscGVycyB8fCB7fTtcbiAgdGhpcy5wYXJ0aWFscyA9IHBhcnRpYWxzIHx8IHt9O1xuICB0aGlzLmRlY29yYXRvcnMgPSBkZWNvcmF0b3JzIHx8IHt9O1xuXG4gIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnModGhpcyk7XG4gIHJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnModGhpcyk7XG59XG5cbkhhbmRsZWJhcnNFbnZpcm9ubWVudC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBIYW5kbGViYXJzRW52aXJvbm1lbnQsXG5cbiAgbG9nZ2VyOiBsb2dnZXIsXG4gIGxvZzogbG9nZ2VyLmxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGZuKSB7IHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgaGVscGVycycpOyB9XG4gICAgICBleHRlbmQodGhpcy5oZWxwZXJzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oZWxwZXJzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuaGVscGVyc1tuYW1lXTtcbiAgfSxcblxuICByZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUsIHBhcnRpYWwpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgZXh0ZW5kKHRoaXMucGFydGlhbHMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIHBhcnRpYWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oYEF0dGVtcHRpbmcgdG8gcmVnaXN0ZXIgYSBwYXJ0aWFsIGNhbGxlZCBcIiR7bmFtZX1cIiBhcyB1bmRlZmluZWRgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFydGlhbHNbbmFtZV0gPSBwYXJ0aWFsO1xuICAgIH1cbiAgfSxcbiAgdW5yZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5wYXJ0aWFsc1tuYW1lXTtcbiAgfSxcblxuICByZWdpc3RlckRlY29yYXRvcjogZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGZuKSB7IHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgZGVjb3JhdG9ycycpOyB9XG4gICAgICBleHRlbmQodGhpcy5kZWNvcmF0b3JzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWNvcmF0b3JzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVyRGVjb3JhdG9yOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdG9yc1tuYW1lXTtcbiAgfVxufTtcblxuZXhwb3J0IGxldCBsb2cgPSBsb2dnZXIubG9nO1xuXG5leHBvcnQge2NyZWF0ZUZyYW1lLCBsb2dnZXJ9O1xuIl19


/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.extend = extend;
	exports.indexOf = indexOf;
	exports.escapeExpression = escapeExpression;
	exports.isEmpty = isEmpty;
	exports.createFrame = createFrame;
	exports.blockParams = blockParams;
	exports.appendContextPath = appendContextPath;
	var escape = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#x27;',
	  '`': '&#x60;',
	  '=': '&#x3D;'
	};

	var badChars = /[&<>"'`=]/g,
	    possible = /[&<>"'`=]/;

	function escapeChar(chr) {
	  return escape[chr];
	}

	function extend(obj /* , ...source */) {
	  for (var i = 1; i < arguments.length; i++) {
	    for (var key in arguments[i]) {
	      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
	        obj[key] = arguments[i][key];
	      }
	    }
	  }

	  return obj;
	}

	var toString = Object.prototype.toString;

	exports.toString = toString;
	// Sourced from lodash
	// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
	/* eslint-disable func-style */
	var isFunction = function isFunction(value) {
	  return typeof value === 'function';
	};
	// fallback for older versions of Chrome and Safari
	/* istanbul ignore next */
	if (isFunction(/x/)) {
	  exports.isFunction = isFunction = function (value) {
	    return typeof value === 'function' && toString.call(value) === '[object Function]';
	  };
	}
	exports.isFunction = isFunction;

	/* eslint-enable func-style */

	/* istanbul ignore next */
	var isArray = Array.isArray || function (value) {
	  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
	};

	exports.isArray = isArray;
	// Older IE versions do not directly support indexOf so we must implement our own, sadly.

	function indexOf(array, value) {
	  for (var i = 0, len = array.length; i < len; i++) {
	    if (array[i] === value) {
	      return i;
	    }
	  }
	  return -1;
	}

	function escapeExpression(string) {
	  if (typeof string !== 'string') {
	    // don't escape SafeStrings, since they're already safe
	    if (string && string.toHTML) {
	      return string.toHTML();
	    } else if (string == null) {
	      return '';
	    } else if (!string) {
	      return string + '';
	    }

	    // Force a string conversion as this will be done by the append regardless and
	    // the regex test will do this transparently behind the scenes, causing issues if
	    // an object's to string has escaped characters in it.
	    string = '' + string;
	  }

	  if (!possible.test(string)) {
	    return string;
	  }
	  return string.replace(badChars, escapeChar);
	}

	function isEmpty(value) {
	  if (!value && value !== 0) {
	    return true;
	  } else if (isArray(value) && value.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}

	function createFrame(object) {
	  var frame = extend({}, object);
	  frame._parent = object;
	  return frame;
	}

	function blockParams(params, ids) {
	  params.path = ids;
	  return params;
	}

	function appendContextPath(contextPath, id) {
	  return (contextPath ? contextPath + '.' : '') + id;
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNLE1BQU0sR0FBRztBQUNiLEtBQUcsRUFBRSxPQUFPO0FBQ1osS0FBRyxFQUFFLE1BQU07QUFDWCxLQUFHLEVBQUUsTUFBTTtBQUNYLEtBQUcsRUFBRSxRQUFRO0FBQ2IsS0FBRyxFQUFFLFFBQVE7QUFDYixLQUFHLEVBQUUsUUFBUTtBQUNiLEtBQUcsRUFBRSxRQUFRO0NBQ2QsQ0FBQzs7QUFFRixJQUFNLFFBQVEsR0FBRyxZQUFZO0lBQ3ZCLFFBQVEsR0FBRyxXQUFXLENBQUM7O0FBRTdCLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRTtBQUN2QixTQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNwQjs7QUFFTSxTQUFTLE1BQU0sQ0FBQyxHQUFHLG9CQUFtQjtBQUMzQyxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxTQUFLLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1QixVQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDM0QsV0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUM5QjtLQUNGO0dBQ0Y7O0FBRUQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7QUFFTSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQzs7Ozs7O0FBS2hELElBQUksVUFBVSxHQUFHLG9CQUFTLEtBQUssRUFBRTtBQUMvQixTQUFPLE9BQU8sS0FBSyxLQUFLLFVBQVUsQ0FBQztDQUNwQyxDQUFDOzs7QUFHRixJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNuQixVQUlNLFVBQVUsR0FKaEIsVUFBVSxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQzNCLFdBQU8sT0FBTyxLQUFLLEtBQUssVUFBVSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssbUJBQW1CLENBQUM7R0FDcEYsQ0FBQztDQUNIO1FBQ08sVUFBVSxHQUFWLFVBQVU7Ozs7O0FBSVgsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sSUFBSSxVQUFTLEtBQUssRUFBRTtBQUN0RCxTQUFPLEFBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsR0FBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLGdCQUFnQixHQUFHLEtBQUssQ0FBQztDQUNqRyxDQUFDOzs7OztBQUdLLFNBQVMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDcEMsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNoRCxRQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFDdEIsYUFBTyxDQUFDLENBQUM7S0FDVjtHQUNGO0FBQ0QsU0FBTyxDQUFDLENBQUMsQ0FBQztDQUNYOztBQUdNLFNBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO0FBQ3ZDLE1BQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFOztBQUU5QixRQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQzNCLGFBQU8sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ3hCLE1BQU0sSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ3pCLGFBQU8sRUFBRSxDQUFDO0tBQ1gsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2xCLGFBQU8sTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7Ozs7QUFLRCxVQUFNLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQztHQUN0Qjs7QUFFRCxNQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUFFLFdBQU8sTUFBTSxDQUFDO0dBQUU7QUFDOUMsU0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztDQUM3Qzs7QUFFTSxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDN0IsTUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLFdBQU8sSUFBSSxDQUFDO0dBQ2IsTUFBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMvQyxXQUFPLElBQUksQ0FBQztHQUNiLE1BQU07QUFDTCxXQUFPLEtBQUssQ0FBQztHQUNkO0NBQ0Y7O0FBRU0sU0FBUyxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQ2xDLE1BQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDL0IsT0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdkIsU0FBTyxLQUFLLENBQUM7Q0FDZDs7QUFFTSxTQUFTLFdBQVcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ3ZDLFFBQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFNBQU8sTUFBTSxDQUFDO0NBQ2Y7O0FBRU0sU0FBUyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxFQUFFO0FBQ2pELFNBQU8sQ0FBQyxXQUFXLEdBQUcsV0FBVyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUEsR0FBSSxFQUFFLENBQUM7Q0FDcEQiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBlc2NhcGUgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmI3gyNzsnLFxuICAnYCc6ICcmI3g2MDsnLFxuICAnPSc6ICcmI3gzRDsnXG59O1xuXG5jb25zdCBiYWRDaGFycyA9IC9bJjw+XCInYD1dL2csXG4gICAgICBwb3NzaWJsZSA9IC9bJjw+XCInYD1dLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKG9iai8qICwgLi4uc291cmNlICovKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGFyZ3VtZW50c1tpXSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcmd1bWVudHNbaV0sIGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSBhcmd1bWVudHNbaV1ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5leHBvcnQgbGV0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxuLyogZXNsaW50LWRpc2FibGUgZnVuYy1zdHlsZSAqL1xubGV0IGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbmV4cG9ydCB7aXNGdW5jdGlvbn07XG4vKiBlc2xpbnQtZW5hYmxlIGZ1bmMtc3R5bGUgKi9cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5cbi8vIE9sZGVyIElFIHZlcnNpb25zIGRvIG5vdCBkaXJlY3RseSBzdXBwb3J0IGluZGV4T2Ygc28gd2UgbXVzdCBpbXBsZW1lbnQgb3VyIG93biwgc2FkbHkuXG5leHBvcnQgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUpIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICAgIGlmIChzdHJpbmcgJiYgc3RyaW5nLnRvSFRNTCkge1xuICAgICAgcmV0dXJuIHN0cmluZy50b0hUTUwoKTtcbiAgICB9IGVsc2UgaWYgKHN0cmluZyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIGlmICghc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nICsgJyc7XG4gICAgfVxuXG4gICAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gICAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gICAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmc7XG4gIH1cblxuICBpZiAoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZyYW1lKG9iamVjdCkge1xuICBsZXQgZnJhbWUgPSBleHRlbmQoe30sIG9iamVjdCk7XG4gIGZyYW1lLl9wYXJlbnQgPSBvYmplY3Q7XG4gIHJldHVybiBmcmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsb2NrUGFyYW1zKHBhcmFtcywgaWRzKSB7XG4gIHBhcmFtcy5wYXRoID0gaWRzO1xuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kQ29udGV4dFBhdGgoY29udGV4dFBhdGgsIGlkKSB7XG4gIHJldHVybiAoY29udGV4dFBhdGggPyBjb250ZXh0UGF0aCArICcuJyA6ICcnKSArIGlkO1xufVxuIl19


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

	function Exception(message, node) {
	  var loc = node && node.loc,
	      line = undefined,
	      column = undefined;
	  if (loc) {
	    line = loc.start.line;
	    column = loc.start.column;

	    message += ' - ' + line + ':' + column;
	  }

	  var tmp = Error.prototype.constructor.call(this, message);

	  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	  for (var idx = 0; idx < errorProps.length; idx++) {
	    this[errorProps[idx]] = tmp[errorProps[idx]];
	  }

	  /* istanbul ignore else */
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, Exception);
	  }

	  try {
	    if (loc) {
	      this.lineNumber = line;

	      // Work around issue under safari where we can't directly set the column value
	      /* istanbul ignore next */
	      if (Object.defineProperty) {
	        Object.defineProperty(this, 'column', { value: column });
	      } else {
	        this.column = column;
	      }
	    }
	  } catch (nop) {
	    /* Ignore if the browser is very particular */
	  }
	}

	Exception.prototype = new Error();

	exports['default'] = Exception;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsSUFBTSxVQUFVLEdBQUcsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFbkcsU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUNoQyxNQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUc7TUFDdEIsSUFBSSxZQUFBO01BQ0osTUFBTSxZQUFBLENBQUM7QUFDWCxNQUFJLEdBQUcsRUFBRTtBQUNQLFFBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztBQUN0QixVQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7O0FBRTFCLFdBQU8sSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7R0FDeEM7O0FBRUQsTUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0FBRzFELE9BQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ2hELFFBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDOUM7OztBQUdELE1BQUksS0FBSyxDQUFDLGlCQUFpQixFQUFFO0FBQzNCLFNBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7R0FDMUM7O0FBRUQsTUFBSTtBQUNGLFFBQUksR0FBRyxFQUFFO0FBQ1AsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Ozs7QUFJdkIsVUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFO0FBQ3pCLGNBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO09BQ3hELE1BQU07QUFDTCxZQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztPQUN0QjtLQUNGO0dBQ0YsQ0FBQyxPQUFPLEdBQUcsRUFBRTs7R0FFYjtDQUNGOztBQUVELFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQzs7cUJBRW5CLFNBQVMiLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jb25zdCBlcnJvclByb3BzID0gWydkZXNjcmlwdGlvbicsICdmaWxlTmFtZScsICdsaW5lTnVtYmVyJywgJ21lc3NhZ2UnLCAnbmFtZScsICdudW1iZXInLCAnc3RhY2snXTtcblxuZnVuY3Rpb24gRXhjZXB0aW9uKG1lc3NhZ2UsIG5vZGUpIHtcbiAgbGV0IGxvYyA9IG5vZGUgJiYgbm9kZS5sb2MsXG4gICAgICBsaW5lLFxuICAgICAgY29sdW1uO1xuICBpZiAobG9jKSB7XG4gICAgbGluZSA9IGxvYy5zdGFydC5saW5lO1xuICAgIGNvbHVtbiA9IGxvYy5zdGFydC5jb2x1bW47XG5cbiAgICBtZXNzYWdlICs9ICcgLSAnICsgbGluZSArICc6JyArIGNvbHVtbjtcbiAgfVxuXG4gIGxldCB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBFeGNlcHRpb24pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAobG9jKSB7XG4gICAgICB0aGlzLmxpbmVOdW1iZXIgPSBsaW5lO1xuXG4gICAgICAvLyBXb3JrIGFyb3VuZCBpc3N1ZSB1bmRlciBzYWZhcmkgd2hlcmUgd2UgY2FuJ3QgZGlyZWN0bHkgc2V0IHRoZSBjb2x1bW4gdmFsdWVcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY29sdW1uJywge3ZhbHVlOiBjb2x1bW59KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAobm9wKSB7XG4gICAgLyogSWdub3JlIGlmIHRoZSBicm93c2VyIGlzIHZlcnkgcGFydGljdWxhciAqL1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0IGRlZmF1bHQgRXhjZXB0aW9uO1xuIl19


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.registerDefaultHelpers = registerDefaultHelpers;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _helpersBlockHelperMissing = __webpack_require__(24);

	var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

	var _helpersEach = __webpack_require__(25);

	var _helpersEach2 = _interopRequireDefault(_helpersEach);

	var _helpersHelperMissing = __webpack_require__(26);

	var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

	var _helpersIf = __webpack_require__(27);

	var _helpersIf2 = _interopRequireDefault(_helpersIf);

	var _helpersLog = __webpack_require__(28);

	var _helpersLog2 = _interopRequireDefault(_helpersLog);

	var _helpersLookup = __webpack_require__(29);

	var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

	var _helpersWith = __webpack_require__(30);

	var _helpersWith2 = _interopRequireDefault(_helpersWith);

	function registerDefaultHelpers(instance) {
	  _helpersBlockHelperMissing2['default'](instance);
	  _helpersEach2['default'](instance);
	  _helpersHelperMissing2['default'](instance);
	  _helpersIf2['default'](instance);
	  _helpersLog2['default'](instance);
	  _helpersLookup2['default'](instance);
	  _helpersWith2['default'](instance);
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7eUNBQXVDLGdDQUFnQzs7OzsyQkFDOUMsZ0JBQWdCOzs7O29DQUNQLDBCQUEwQjs7Ozt5QkFDckMsY0FBYzs7OzswQkFDYixlQUFlOzs7OzZCQUNaLGtCQUFrQjs7OzsyQkFDcEIsZ0JBQWdCOzs7O0FBRWxDLFNBQVMsc0JBQXNCLENBQUMsUUFBUSxFQUFFO0FBQy9DLHlDQUEyQixRQUFRLENBQUMsQ0FBQztBQUNyQywyQkFBYSxRQUFRLENBQUMsQ0FBQztBQUN2QixvQ0FBc0IsUUFBUSxDQUFDLENBQUM7QUFDaEMseUJBQVcsUUFBUSxDQUFDLENBQUM7QUFDckIsMEJBQVksUUFBUSxDQUFDLENBQUM7QUFDdEIsNkJBQWUsUUFBUSxDQUFDLENBQUM7QUFDekIsMkJBQWEsUUFBUSxDQUFDLENBQUM7Q0FDeEIiLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZWdpc3RlckJsb2NrSGVscGVyTWlzc2luZyBmcm9tICcuL2hlbHBlcnMvYmxvY2staGVscGVyLW1pc3NpbmcnO1xuaW1wb3J0IHJlZ2lzdGVyRWFjaCBmcm9tICcuL2hlbHBlcnMvZWFjaCc7XG5pbXBvcnQgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nIGZyb20gJy4vaGVscGVycy9oZWxwZXItbWlzc2luZyc7XG5pbXBvcnQgcmVnaXN0ZXJJZiBmcm9tICcuL2hlbHBlcnMvaWYnO1xuaW1wb3J0IHJlZ2lzdGVyTG9nIGZyb20gJy4vaGVscGVycy9sb2cnO1xuaW1wb3J0IHJlZ2lzdGVyTG9va3VwIGZyb20gJy4vaGVscGVycy9sb29rdXAnO1xuaW1wb3J0IHJlZ2lzdGVyV2l0aCBmcm9tICcuL2hlbHBlcnMvd2l0aCc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG4gIHJlZ2lzdGVyQmxvY2tIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJFYWNoKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJJZihpbnN0YW5jZSk7XG4gIHJlZ2lzdGVyTG9nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJMb29rdXAoaW5zdGFuY2UpO1xuICByZWdpc3RlcldpdGgoaW5zdGFuY2UpO1xufVxuIl19


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(21);

	exports['default'] = function (instance) {
	  instance.registerHelper('blockHelperMissing', function (context, options) {
	    var inverse = options.inverse,
	        fn = options.fn;

	    if (context === true) {
	      return fn(this);
	    } else if (context === false || context == null) {
	      return inverse(this);
	    } else if (_utils.isArray(context)) {
	      if (context.length > 0) {
	        if (options.ids) {
	          options.ids = [options.name];
	        }

	        return instance.helpers.each(context, options);
	      } else {
	        return inverse(this);
	      }
	    } else {
	      if (options.data && options.ids) {
	        var data = _utils.createFrame(options.data);
	        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
	        options = { data: data };
	      }

	      return fn(context, options);
	    }
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvYmxvY2staGVscGVyLW1pc3NpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztxQkFBc0QsVUFBVTs7cUJBRWpELFVBQVMsUUFBUSxFQUFFO0FBQ2hDLFVBQVEsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLEVBQUUsVUFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3ZFLFFBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPO1FBQ3pCLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDOztBQUVwQixRQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7QUFDcEIsYUFBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakIsTUFBTSxJQUFJLE9BQU8sS0FBSyxLQUFLLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtBQUMvQyxhQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0QixNQUFNLElBQUksZUFBUSxPQUFPLENBQUMsRUFBRTtBQUMzQixVQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3RCLFlBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUNmLGlCQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlCOztBQUVELGVBQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQ2hELE1BQU07QUFDTCxlQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUN0QjtLQUNGLE1BQU07QUFDTCxVQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUMvQixZQUFJLElBQUksR0FBRyxtQkFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsWUFBSSxDQUFDLFdBQVcsR0FBRyx5QkFBa0IsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdFLGVBQU8sR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQztPQUN4Qjs7QUFFRCxhQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDN0I7R0FDRixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJibG9jay1oZWxwZXItbWlzc2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXBwZW5kQ29udGV4dFBhdGgsIGNyZWF0ZUZyYW1lLCBpc0FycmF5fSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgbGV0IGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG4gICAgICAgIGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZm4odGhpcyk7XG4gICAgfSBlbHNlIGlmIChjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYgKGNvbnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5pZHMpIHtcbiAgICAgICAgICBvcHRpb25zLmlkcyA9IFtvcHRpb25zLm5hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIGxldCBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5uYW1lKTtcbiAgICAgICAgb3B0aW9ucyA9IHtkYXRhOiBkYXRhfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utils = __webpack_require__(21);

	var _exception = __webpack_require__(22);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('each', function (context, options) {
	    if (!options) {
	      throw new _exception2['default']('Must pass iterator to #each');
	    }

	    var fn = options.fn,
	        inverse = options.inverse,
	        i = 0,
	        ret = '',
	        data = undefined,
	        contextPath = undefined;

	    if (options.data && options.ids) {
	      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
	    }

	    if (_utils.isFunction(context)) {
	      context = context.call(this);
	    }

	    if (options.data) {
	      data = _utils.createFrame(options.data);
	    }

	    function execIteration(field, index, last) {
	      if (data) {
	        data.key = field;
	        data.index = index;
	        data.first = index === 0;
	        data.last = !!last;

	        if (contextPath) {
	          data.contextPath = contextPath + field;
	        }
	      }

	      ret = ret + fn(context[field], {
	        data: data,
	        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
	      });
	    }

	    if (context && typeof context === 'object') {
	      if (_utils.isArray(context)) {
	        for (var j = context.length; i < j; i++) {
	          if (i in context) {
	            execIteration(i, i, i === context.length - 1);
	          }
	        }
	      } else {
	        var priorKey = undefined;

	        for (var key in context) {
	          if (context.hasOwnProperty(key)) {
	            // We're running the iterations one step out of sync so we can detect
	            // the last iteration without have to scan the object twice and create
	            // an itermediate keys array.
	            if (priorKey !== undefined) {
	              execIteration(priorKey, i - 1);
	            }
	            priorKey = key;
	            i++;
	          }
	        }
	        if (priorKey !== undefined) {
	          execIteration(priorKey, i - 1, true);
	        }
	      }
	    }

	    if (i === 0) {
	      ret = inverse(this);
	    }

	    return ret;
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvZWFjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O3FCQUErRSxVQUFVOzt5QkFDbkUsY0FBYzs7OztxQkFFckIsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3pELFFBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixZQUFNLDJCQUFjLDZCQUE2QixDQUFDLENBQUM7S0FDcEQ7O0FBRUQsUUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUU7UUFDZixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU87UUFDekIsQ0FBQyxHQUFHLENBQUM7UUFDTCxHQUFHLEdBQUcsRUFBRTtRQUNSLElBQUksWUFBQTtRQUNKLFdBQVcsWUFBQSxDQUFDOztBQUVoQixRQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUMvQixpQkFBVyxHQUFHLHlCQUFrQixPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0tBQ2pGOztBQUVELFFBQUksa0JBQVcsT0FBTyxDQUFDLEVBQUU7QUFBRSxhQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUFFOztBQUUxRCxRQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDaEIsVUFBSSxHQUFHLG1CQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsQzs7QUFFRCxhQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUN6QyxVQUFJLElBQUksRUFBRTtBQUNSLFlBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQztBQUN6QixZQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7O0FBRW5CLFlBQUksV0FBVyxFQUFFO0FBQ2YsY0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLEdBQUcsS0FBSyxDQUFDO1NBQ3hDO09BQ0Y7O0FBRUQsU0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzdCLFlBQUksRUFBRSxJQUFJO0FBQ1YsbUJBQVcsRUFBRSxtQkFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsR0FBRyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDL0UsQ0FBQyxDQUFDO0tBQ0o7O0FBRUQsUUFBSSxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO0FBQzFDLFVBQUksZUFBUSxPQUFPLENBQUMsRUFBRTtBQUNwQixhQUFLLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxjQUFJLENBQUMsSUFBSSxPQUFPLEVBQUU7QUFDaEIseUJBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1dBQy9DO1NBQ0Y7T0FDRixNQUFNO0FBQ0wsWUFBSSxRQUFRLFlBQUEsQ0FBQzs7QUFFYixhQUFLLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRTtBQUN2QixjQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7Ozs7QUFJL0IsZ0JBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtBQUMxQiwyQkFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDaEM7QUFDRCxvQkFBUSxHQUFHLEdBQUcsQ0FBQztBQUNmLGFBQUMsRUFBRSxDQUFDO1dBQ0w7U0FDRjtBQUNELFlBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtBQUMxQix1QkFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3RDO09BQ0Y7S0FDRjs7QUFFRCxRQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDWCxTQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3JCOztBQUVELFdBQU8sR0FBRyxDQUFDO0dBQ1osQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoiZWFjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXBwZW5kQ29udGV4dFBhdGgsIGJsb2NrUGFyYW1zLCBjcmVhdGVGcmFtZSwgaXNBcnJheSwgaXNGdW5jdGlvbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ011c3QgcGFzcyBpdGVyYXRvciB0byAjZWFjaCcpO1xuICAgIH1cblxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm4sXG4gICAgICAgIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICByZXQgPSAnJyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgY29udGV4dFBhdGg7XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICBjb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pICsgJy4nO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWNJdGVyYXRpb24oZmllbGQsIGluZGV4LCBsYXN0KSB7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBkYXRhLmtleSA9IGZpZWxkO1xuICAgICAgICBkYXRhLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGRhdGEuZmlyc3QgPSBpbmRleCA9PT0gMDtcbiAgICAgICAgZGF0YS5sYXN0ID0gISFsYXN0O1xuXG4gICAgICAgIGlmIChjb250ZXh0UGF0aCkge1xuICAgICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBjb250ZXh0UGF0aCArIGZpZWxkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRbZmllbGRdLCB7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhbY29udGV4dFtmaWVsZF0sIGZpZWxkXSwgW2NvbnRleHRQYXRoICsgZmllbGQsIG51bGxdKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29udGV4dC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICBpZiAoaSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgICBleGVjSXRlcmF0aW9uKGksIGksIGkgPT09IGNvbnRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJpb3JLZXk7XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAvLyBXZSdyZSBydW5uaW5nIHRoZSBpdGVyYXRpb25zIG9uZSBzdGVwIG91dCBvZiBzeW5jIHNvIHdlIGNhbiBkZXRlY3RcbiAgICAgICAgICAgIC8vIHRoZSBsYXN0IGl0ZXJhdGlvbiB3aXRob3V0IGhhdmUgdG8gc2NhbiB0aGUgb2JqZWN0IHR3aWNlIGFuZCBjcmVhdGVcbiAgICAgICAgICAgIC8vIGFuIGl0ZXJtZWRpYXRlIGtleXMgYXJyYXkuXG4gICAgICAgICAgICBpZiAocHJpb3JLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmlvcktleSA9IGtleTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByaW9yS2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbn1cbiJdfQ==


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _exception = __webpack_require__(22);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('helperMissing', function () /* [args, ]options */{
	    if (arguments.length === 1) {
	      // A missing field in a {{foo}} construct.
	      return undefined;
	    } else {
	      // Someone is actually trying to call something, blow up.
	      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
	    }
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaGVscGVyLW1pc3NpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozt5QkFBc0IsY0FBYzs7OztxQkFFckIsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLEVBQUUsaUNBQWdDO0FBQ3ZFLFFBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7O0FBRTFCLGFBQU8sU0FBUyxDQUFDO0tBQ2xCLE1BQU07O0FBRUwsWUFBTSwyQkFBYyxtQkFBbUIsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDdkY7R0FDRixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJoZWxwZXItbWlzc2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi4vZXhjZXB0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbigvKiBbYXJncywgXW9wdGlvbnMgKi8pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gQSBtaXNzaW5nIGZpZWxkIGluIGEge3tmb299fSBjb25zdHJ1Y3QuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTb21lb25lIGlzIGFjdHVhbGx5IHRyeWluZyB0byBjYWxsIHNvbWV0aGluZywgYmxvdyB1cC5cbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ01pc3NpbmcgaGVscGVyOiBcIicgKyBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdLm5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH0pO1xufVxuIl19


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(21);

	exports['default'] = function (instance) {
	  instance.registerHelper('if', function (conditional, options) {
	    if (_utils.isFunction(conditional)) {
	      conditional = conditional.call(this);
	    }

	    // Default behavior is to render the positive path if the value is truthy and not empty.
	    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
	    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
	    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
	      return options.inverse(this);
	    } else {
	      return options.fn(this);
	    }
	  });

	  instance.registerHelper('unless', function (conditional, options) {
	    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaWYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztxQkFBa0MsVUFBVTs7cUJBRTdCLFVBQVMsUUFBUSxFQUFFO0FBQ2hDLFVBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFVBQVMsV0FBVyxFQUFFLE9BQU8sRUFBRTtBQUMzRCxRQUFJLGtCQUFXLFdBQVcsQ0FBQyxFQUFFO0FBQUUsaUJBQVcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQUU7Ozs7O0FBS3RFLFFBQUksQUFBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsV0FBVyxJQUFLLGVBQVEsV0FBVyxDQUFDLEVBQUU7QUFDdkUsYUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzlCLE1BQU07QUFDTCxhQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDekI7R0FDRixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsVUFBUyxXQUFXLEVBQUUsT0FBTyxFQUFFO0FBQy9ELFdBQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztHQUN2SCxDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJpZi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNFbXB0eSwgaXNGdW5jdGlvbn0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcbn1cbiJdfQ==


/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (instance) {
	  instance.registerHelper('log', function () /* message, options */{
	    var args = [undefined],
	        options = arguments[arguments.length - 1];
	    for (var i = 0; i < arguments.length - 1; i++) {
	      args.push(arguments[i]);
	    }

	    var level = 1;
	    if (options.hash.level != null) {
	      level = options.hash.level;
	    } else if (options.data && options.data.level != null) {
	      level = options.data.level;
	    }
	    args[0] = level;

	    instance.log.apply(instance, args);
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7cUJBQWUsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsa0NBQWlDO0FBQzlELFFBQUksSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQ2xCLE9BQU8sR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM5QyxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0MsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN6Qjs7QUFFRCxRQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxRQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtBQUM5QixXQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDNUIsTUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ3JELFdBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUM1QjtBQUNELFFBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7O0FBRWhCLFlBQVEsQ0FBQyxHQUFHLE1BQUEsQ0FBWixRQUFRLEVBQVMsSUFBSSxDQUFDLENBQUM7R0FDeEIsQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoibG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKC8qIG1lc3NhZ2UsIG9wdGlvbnMgKi8pIHtcbiAgICBsZXQgYXJncyA9IFt1bmRlZmluZWRdLFxuICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH1cblxuICAgIGxldCBsZXZlbCA9IDE7XG4gICAgaWYgKG9wdGlvbnMuaGFzaC5sZXZlbCAhPSBudWxsKSB7XG4gICAgICBsZXZlbCA9IG9wdGlvbnMuaGFzaC5sZXZlbDtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCkge1xuICAgICAgbGV2ZWwgPSBvcHRpb25zLmRhdGEubGV2ZWw7XG4gICAgfVxuICAgIGFyZ3NbMF0gPSBsZXZlbDtcblxuICAgIGluc3RhbmNlLmxvZyguLi4gYXJncyk7XG4gIH0pO1xufVxuIl19


/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (instance) {
	  instance.registerHelper('lookup', function (obj, field) {
	    return obj && obj[field];
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvbG9va3VwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7cUJBQWUsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsVUFBUyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ3JELFdBQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUMxQixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJsb29rdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9va3VwJywgZnVuY3Rpb24ob2JqLCBmaWVsZCkge1xuICAgIHJldHVybiBvYmogJiYgb2JqW2ZpZWxkXTtcbiAgfSk7XG59XG4iXX0=


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(21);

	exports['default'] = function (instance) {
	  instance.registerHelper('with', function (context, options) {
	    if (_utils.isFunction(context)) {
	      context = context.call(this);
	    }

	    var fn = options.fn;

	    if (!_utils.isEmpty(context)) {
	      var data = options.data;
	      if (options.data && options.ids) {
	        data = _utils.createFrame(options.data);
	        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
	      }

	      return fn(context, {
	        data: data,
	        blockParams: _utils.blockParams([context], [data && data.contextPath])
	      });
	    } else {
	      return options.inverse(this);
	    }
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvd2l0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3FCQUErRSxVQUFVOztxQkFFMUUsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3pELFFBQUksa0JBQVcsT0FBTyxDQUFDLEVBQUU7QUFBRSxhQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUFFOztBQUUxRCxRQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDOztBQUVwQixRQUFJLENBQUMsZUFBUSxPQUFPLENBQUMsRUFBRTtBQUNyQixVQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3hCLFVBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQy9CLFlBQUksR0FBRyxtQkFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsWUFBSSxDQUFDLFdBQVcsR0FBRyx5QkFBa0IsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ2hGOztBQUVELGFBQU8sRUFBRSxDQUFDLE9BQU8sRUFBRTtBQUNqQixZQUFJLEVBQUUsSUFBSTtBQUNWLG1CQUFXLEVBQUUsbUJBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDaEUsQ0FBQyxDQUFDO0tBQ0osTUFBTTtBQUNMLGFBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM5QjtHQUNGLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6IndpdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2FwcGVuZENvbnRleHRQYXRoLCBibG9ja1BhcmFtcywgY3JlYXRlRnJhbWUsIGlzRW1wdHksIGlzRnVuY3Rpb259IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgbGV0IGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmICghaXNFbXB0eShjb250ZXh0KSkge1xuICAgICAgbGV0IGRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLmlkc1swXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmbihjb250ZXh0LCB7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhbY29udGV4dF0sIFtkYXRhICYmIGRhdGEuY29udGV4dFBhdGhdKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.registerDefaultDecorators = registerDefaultDecorators;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _decoratorsInline = __webpack_require__(32);

	var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

	function registerDefaultDecorators(instance) {
	  _decoratorsInline2['default'](instance);
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2RlY29yYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Z0NBQTJCLHFCQUFxQjs7OztBQUV6QyxTQUFTLHlCQUF5QixDQUFDLFFBQVEsRUFBRTtBQUNsRCxnQ0FBZSxRQUFRLENBQUMsQ0FBQztDQUMxQiIsImZpbGUiOiJkZWNvcmF0b3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlZ2lzdGVySW5saW5lIGZyb20gJy4vZGVjb3JhdG9ycy9pbmxpbmUnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyhpbnN0YW5jZSkge1xuICByZWdpc3RlcklubGluZShpbnN0YW5jZSk7XG59XG5cbiJdfQ==


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(21);

	exports['default'] = function (instance) {
	  instance.registerDecorator('inline', function (fn, props, container, options) {
	    var ret = fn;
	    if (!props.partials) {
	      props.partials = {};
	      ret = function (context, options) {
	        // Create a new partials stack frame prior to exec.
	        var original = container.partials;
	        container.partials = _utils.extend({}, original, props.partials);
	        var ret = fn(context, options);
	        container.partials = original;
	        return ret;
	      };
	    }

	    props.partials[options.args[0]] = options.fn;

	    return ret;
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2RlY29yYXRvcnMvaW5saW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7cUJBQXFCLFVBQVU7O3FCQUVoQixVQUFTLFFBQVEsRUFBRTtBQUNoQyxVQUFRLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFVBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFO0FBQzNFLFFBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLFFBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQ25CLFdBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFNBQUcsR0FBRyxVQUFTLE9BQU8sRUFBRSxPQUFPLEVBQUU7O0FBRS9CLFlBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7QUFDbEMsaUJBQVMsQ0FBQyxRQUFRLEdBQUcsY0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxRCxZQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLGlCQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUM5QixlQUFPLEdBQUcsQ0FBQztPQUNaLENBQUM7S0FDSDs7QUFFRCxTQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDOztBQUU3QyxXQUFPLEdBQUcsQ0FBQztHQUNaLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6ImlubGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXh0ZW5kfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVyRGVjb3JhdG9yKCdpbmxpbmUnLCBmdW5jdGlvbihmbiwgcHJvcHMsIGNvbnRhaW5lciwgb3B0aW9ucykge1xuICAgIGxldCByZXQgPSBmbjtcbiAgICBpZiAoIXByb3BzLnBhcnRpYWxzKSB7XG4gICAgICBwcm9wcy5wYXJ0aWFscyA9IHt9O1xuICAgICAgcmV0ID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgcGFydGlhbHMgc3RhY2sgZnJhbWUgcHJpb3IgdG8gZXhlYy5cbiAgICAgICAgbGV0IG9yaWdpbmFsID0gY29udGFpbmVyLnBhcnRpYWxzO1xuICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBleHRlbmQoe30sIG9yaWdpbmFsLCBwcm9wcy5wYXJ0aWFscyk7XG4gICAgICAgIGxldCByZXQgPSBmbihjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gb3JpZ2luYWw7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHByb3BzLnBhcnRpYWxzW29wdGlvbnMuYXJnc1swXV0gPSBvcHRpb25zLmZuO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG59XG4iXX0=


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(21);

	var logger = {
	  methodMap: ['debug', 'info', 'warn', 'error'],
	  level: 'info',

	  // Maps a given level value to the `methodMap` indexes above.
	  lookupLevel: function lookupLevel(level) {
	    if (typeof level === 'string') {
	      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
	      if (levelMap >= 0) {
	        level = levelMap;
	      } else {
	        level = parseInt(level, 10);
	      }
	    }

	    return level;
	  },

	  // Can be overridden in the host environment
	  log: function log(level) {
	    level = logger.lookupLevel(level);

	    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
	      var method = logger.methodMap[level];
	      if (!console[method]) {
	        // eslint-disable-line no-console
	        method = 'log';
	      }

	      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        message[_key - 1] = arguments[_key];
	      }

	      console[method].apply(console, message); // eslint-disable-line no-console
	    }
	  }
	};

	exports['default'] = logger;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2xvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3FCQUFzQixTQUFTOztBQUUvQixJQUFJLE1BQU0sR0FBRztBQUNYLFdBQVMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztBQUM3QyxPQUFLLEVBQUUsTUFBTTs7O0FBR2IsYUFBVyxFQUFFLHFCQUFTLEtBQUssRUFBRTtBQUMzQixRQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtBQUM3QixVQUFJLFFBQVEsR0FBRyxlQUFRLE1BQU0sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDOUQsVUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO0FBQ2pCLGFBQUssR0FBRyxRQUFRLENBQUM7T0FDbEIsTUFBTTtBQUNMLGFBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQzdCO0tBQ0Y7O0FBRUQsV0FBTyxLQUFLLENBQUM7R0FDZDs7O0FBR0QsS0FBRyxFQUFFLGFBQVMsS0FBSyxFQUFjO0FBQy9CLFNBQUssR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVsQyxRQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEVBQUU7QUFDL0UsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFOztBQUNwQixjQUFNLEdBQUcsS0FBSyxDQUFDO09BQ2hCOzt3Q0FQbUIsT0FBTztBQUFQLGVBQU87OztBQVEzQixhQUFPLENBQUMsTUFBTSxPQUFDLENBQWYsT0FBTyxFQUFZLE9BQU8sQ0FBQyxDQUFDO0tBQzdCO0dBQ0Y7Q0FDRixDQUFDOztxQkFFYSxNQUFNIiwiZmlsZSI6ImxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aW5kZXhPZn0gZnJvbSAnLi91dGlscyc7XG5cbmxldCBsb2dnZXIgPSB7XG4gIG1ldGhvZE1hcDogWydkZWJ1ZycsICdpbmZvJywgJ3dhcm4nLCAnZXJyb3InXSxcbiAgbGV2ZWw6ICdpbmZvJyxcblxuICAvLyBNYXBzIGEgZ2l2ZW4gbGV2ZWwgdmFsdWUgdG8gdGhlIGBtZXRob2RNYXBgIGluZGV4ZXMgYWJvdmUuXG4gIGxvb2t1cExldmVsOiBmdW5jdGlvbihsZXZlbCkge1xuICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgbGV2ZWxNYXAgPSBpbmRleE9mKGxvZ2dlci5tZXRob2RNYXAsIGxldmVsLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgaWYgKGxldmVsTWFwID49IDApIHtcbiAgICAgICAgbGV2ZWwgPSBsZXZlbE1hcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldmVsID0gcGFyc2VJbnQobGV2ZWwsIDEwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbGV2ZWw7XG4gIH0sXG5cbiAgLy8gQ2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcbiAgbG9nOiBmdW5jdGlvbihsZXZlbCwgLi4ubWVzc2FnZSkge1xuICAgIGxldmVsID0gbG9nZ2VyLmxvb2t1cExldmVsKGxldmVsKTtcblxuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbG9nZ2VyLmxvb2t1cExldmVsKGxvZ2dlci5sZXZlbCkgPD0gbGV2ZWwpIHtcbiAgICAgIGxldCBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICghY29uc29sZVttZXRob2RdKSB7ICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIG1ldGhvZCA9ICdsb2cnO1xuICAgICAgfVxuICAgICAgY29uc29sZVttZXRob2RdKC4uLm1lc3NhZ2UpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlcjtcbiJdfQ==


/***/ },
/* 34 */
/***/ function(module, exports) {

	// Build out our basic SafeString type
	'use strict';

	exports.__esModule = true;
	function SafeString(string) {
	  this.string = string;
	}

	SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
	  return '' + this.string;
	};

	exports['default'] = SafeString;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDMUIsTUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Q0FDdEI7O0FBRUQsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBVztBQUN2RSxTQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0NBQ3pCLENBQUM7O3FCQUVhLFVBQVUiLCJmaWxlIjoic2FmZS1zdHJpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuZnVuY3Rpb24gU2FmZVN0cmluZyhzdHJpbmcpIHtcbiAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG59XG5cblNhZmVTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gU2FmZVN0cmluZy5wcm90b3R5cGUudG9IVE1MID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnJyArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2FmZVN0cmluZztcbiJdfQ==


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.checkRevision = checkRevision;
	exports.template = template;
	exports.wrapProgram = wrapProgram;
	exports.resolvePartial = resolvePartial;
	exports.invokePartial = invokePartial;
	exports.noop = noop;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// istanbul ignore next

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _utils = __webpack_require__(21);

	var Utils = _interopRequireWildcard(_utils);

	var _exception = __webpack_require__(22);

	var _exception2 = _interopRequireDefault(_exception);

	var _base = __webpack_require__(20);

	function checkRevision(compilerInfo) {
	  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
	      currentRevision = _base.COMPILER_REVISION;

	  if (compilerRevision !== currentRevision) {
	    if (compilerRevision < currentRevision) {
	      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
	          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
	      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
	    } else {
	      // Use the embedded version info since the runtime doesn't know about this revision yet
	      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
	    }
	  }
	}

	function template(templateSpec, env) {
	  /* istanbul ignore next */
	  if (!env) {
	    throw new _exception2['default']('No environment passed to template');
	  }
	  if (!templateSpec || !templateSpec.main) {
	    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
	  }

	  templateSpec.main.decorator = templateSpec.main_d;

	  // Note: Using env.VM references rather than local var references throughout this section to allow
	  // for external users to override these as psuedo-supported APIs.
	  env.VM.checkRevision(templateSpec.compiler);

	  function invokePartialWrapper(partial, context, options) {
	    if (options.hash) {
	      context = Utils.extend({}, context, options.hash);
	      if (options.ids) {
	        options.ids[0] = true;
	      }
	    }

	    partial = env.VM.resolvePartial.call(this, partial, context, options);
	    var result = env.VM.invokePartial.call(this, partial, context, options);

	    if (result == null && env.compile) {
	      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
	      result = options.partials[options.name](context, options);
	    }
	    if (result != null) {
	      if (options.indent) {
	        var lines = result.split('\n');
	        for (var i = 0, l = lines.length; i < l; i++) {
	          if (!lines[i] && i + 1 === l) {
	            break;
	          }

	          lines[i] = options.indent + lines[i];
	        }
	        result = lines.join('\n');
	      }
	      return result;
	    } else {
	      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
	    }
	  }

	  // Just add water
	  var container = {
	    strict: function strict(obj, name) {
	      if (!(name in obj)) {
	        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
	      }
	      return obj[name];
	    },
	    lookup: function lookup(depths, name) {
	      var len = depths.length;
	      for (var i = 0; i < len; i++) {
	        if (depths[i] && depths[i][name] != null) {
	          return depths[i][name];
	        }
	      }
	    },
	    lambda: function lambda(current, context) {
	      return typeof current === 'function' ? current.call(context) : current;
	    },

	    escapeExpression: Utils.escapeExpression,
	    invokePartial: invokePartialWrapper,

	    fn: function fn(i) {
	      var ret = templateSpec[i];
	      ret.decorator = templateSpec[i + '_d'];
	      return ret;
	    },

	    programs: [],
	    program: function program(i, data, declaredBlockParams, blockParams, depths) {
	      var programWrapper = this.programs[i],
	          fn = this.fn(i);
	      if (data || depths || blockParams || declaredBlockParams) {
	        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
	      } else if (!programWrapper) {
	        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
	      }
	      return programWrapper;
	    },

	    data: function data(value, depth) {
	      while (value && depth--) {
	        value = value._parent;
	      }
	      return value;
	    },
	    merge: function merge(param, common) {
	      var obj = param || common;

	      if (param && common && param !== common) {
	        obj = Utils.extend({}, common, param);
	      }

	      return obj;
	    },

	    noop: env.VM.noop,
	    compilerInfo: templateSpec.compiler
	  };

	  function ret(context) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var data = options.data;

	    ret._setup(options);
	    if (!options.partial && templateSpec.useData) {
	      data = initData(context, data);
	    }
	    var depths = undefined,
	        blockParams = templateSpec.useBlockParams ? [] : undefined;
	    if (templateSpec.useDepths) {
	      if (options.depths) {
	        depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
	      } else {
	        depths = [context];
	      }
	    }

	    function main(context /*, options*/) {
	      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
	    }
	    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
	    return main(context, options);
	  }
	  ret.isTop = true;

	  ret._setup = function (options) {
	    if (!options.partial) {
	      container.helpers = container.merge(options.helpers, env.helpers);

	      if (templateSpec.usePartial) {
	        container.partials = container.merge(options.partials, env.partials);
	      }
	      if (templateSpec.usePartial || templateSpec.useDecorators) {
	        container.decorators = container.merge(options.decorators, env.decorators);
	      }
	    } else {
	      container.helpers = options.helpers;
	      container.partials = options.partials;
	      container.decorators = options.decorators;
	    }
	  };

	  ret._child = function (i, data, blockParams, depths) {
	    if (templateSpec.useBlockParams && !blockParams) {
	      throw new _exception2['default']('must pass block params');
	    }
	    if (templateSpec.useDepths && !depths) {
	      throw new _exception2['default']('must pass parent depths');
	    }

	    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
	  };
	  return ret;
	}

	function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
	  function prog(context) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var currentDepths = depths;
	    if (depths && context != depths[0]) {
	      currentDepths = [context].concat(depths);
	    }

	    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
	  }

	  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

	  prog.program = i;
	  prog.depth = depths ? depths.length : 0;
	  prog.blockParams = declaredBlockParams || 0;
	  return prog;
	}

	function resolvePartial(partial, context, options) {
	  if (!partial) {
	    if (options.name === '@partial-block') {
	      var data = options.data;
	      while (data['partial-block'] === noop) {
	        data = data._parent;
	      }
	      partial = data['partial-block'];
	      data['partial-block'] = noop;
	    } else {
	      partial = options.partials[options.name];
	    }
	  } else if (!partial.call && !options.name) {
	    // This is a dynamic partial that returned a string
	    options.name = partial;
	    partial = options.partials[partial];
	  }
	  return partial;
	}

	function invokePartial(partial, context, options) {
	  options.partial = true;
	  if (options.ids) {
	    options.data.contextPath = options.ids[0] || options.data.contextPath;
	  }

	  var partialBlock = undefined;
	  if (options.fn && options.fn !== noop) {
	    options.data = _base.createFrame(options.data);
	    partialBlock = options.data['partial-block'] = options.fn;

	    if (partialBlock.partials) {
	      options.partials = Utils.extend({}, options.partials, partialBlock.partials);
	    }
	  }

	  if (partial === undefined && partialBlock) {
	    partial = partialBlock;
	  }

	  if (partial === undefined) {
	    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
	  } else if (partial instanceof Function) {
	    return partial(context, options);
	  }
	}

	function noop() {
	  return '';
	}

	function initData(context, data) {
	  if (!data || !('root' in data)) {
	    data = data ? _base.createFrame(data) : {};
	    data.root = context;
	  }
	  return data;
	}

	function executeDecorators(fn, prog, container, depths, data, blockParams) {
	  if (fn.decorator) {
	    var props = {};
	    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
	    Utils.extend(prog, props);
	  }
	  return prog;
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQXVCLFNBQVM7O0lBQXBCLEtBQUs7O3lCQUNLLGFBQWE7Ozs7b0JBQzhCLFFBQVE7O0FBRWxFLFNBQVMsYUFBYSxDQUFDLFlBQVksRUFBRTtBQUMxQyxNQUFNLGdCQUFnQixHQUFHLFlBQVksSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztNQUN2RCxlQUFlLDBCQUFvQixDQUFDOztBQUUxQyxNQUFJLGdCQUFnQixLQUFLLGVBQWUsRUFBRTtBQUN4QyxRQUFJLGdCQUFnQixHQUFHLGVBQWUsRUFBRTtBQUN0QyxVQUFNLGVBQWUsR0FBRyx1QkFBaUIsZUFBZSxDQUFDO1VBQ25ELGdCQUFnQixHQUFHLHVCQUFpQixnQkFBZ0IsQ0FBQyxDQUFDO0FBQzVELFlBQU0sMkJBQWMseUZBQXlGLEdBQ3ZHLHFEQUFxRCxHQUFHLGVBQWUsR0FBRyxtREFBbUQsR0FBRyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUNoSyxNQUFNOztBQUVMLFlBQU0sMkJBQWMsd0ZBQXdGLEdBQ3RHLGlEQUFpRCxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUNuRjtHQUNGO0NBQ0Y7O0FBRU0sU0FBUyxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTs7QUFFMUMsTUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLFVBQU0sMkJBQWMsbUNBQW1DLENBQUMsQ0FBQztHQUMxRDtBQUNELE1BQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQ3ZDLFVBQU0sMkJBQWMsMkJBQTJCLEdBQUcsT0FBTyxZQUFZLENBQUMsQ0FBQztHQUN4RTs7QUFFRCxjQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDOzs7O0FBSWxELEtBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFNUMsV0FBUyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN2RCxRQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDaEIsYUFBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEQsVUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ2YsZUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7T0FDdkI7S0FDRjs7QUFFRCxXQUFPLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RFLFFBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFeEUsUUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7QUFDakMsYUFBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN6RixZQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzNEO0FBQ0QsUUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ2xCLFVBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNsQixZQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUMsY0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM1QixrQkFBTTtXQUNQOztBQUVELGVBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0QztBQUNELGNBQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQzNCO0FBQ0QsYUFBTyxNQUFNLENBQUM7S0FDZixNQUFNO0FBQ0wsWUFBTSwyQkFBYyxjQUFjLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRywwREFBMEQsQ0FBQyxDQUFDO0tBQ2pIO0dBQ0Y7OztBQUdELE1BQUksU0FBUyxHQUFHO0FBQ2QsVUFBTSxFQUFFLGdCQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDMUIsVUFBSSxFQUFFLElBQUksSUFBSSxHQUFHLENBQUEsQUFBQyxFQUFFO0FBQ2xCLGNBQU0sMkJBQWMsR0FBRyxHQUFHLElBQUksR0FBRyxtQkFBbUIsR0FBRyxHQUFHLENBQUMsQ0FBQztPQUM3RDtBQUNELGFBQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xCO0FBQ0QsVUFBTSxFQUFFLGdCQUFTLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDN0IsVUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMxQixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVCLFlBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDeEMsaUJBQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hCO09BQ0Y7S0FDRjtBQUNELFVBQU0sRUFBRSxnQkFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ2pDLGFBQU8sT0FBTyxPQUFPLEtBQUssVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0tBQ3hFOztBQUVELG9CQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7QUFDeEMsaUJBQWEsRUFBRSxvQkFBb0I7O0FBRW5DLE1BQUUsRUFBRSxZQUFTLENBQUMsRUFBRTtBQUNkLFVBQUksR0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixTQUFHLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDdkMsYUFBTyxHQUFHLENBQUM7S0FDWjs7QUFFRCxZQUFRLEVBQUUsRUFBRTtBQUNaLFdBQU8sRUFBRSxpQkFBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUU7QUFDbkUsVUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7VUFDakMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsVUFBSSxJQUFJLElBQUksTUFBTSxJQUFJLFdBQVcsSUFBSSxtQkFBbUIsRUFBRTtBQUN4RCxzQkFBYyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQzNGLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUMxQixzQkFBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDOUQ7QUFDRCxhQUFPLGNBQWMsQ0FBQztLQUN2Qjs7QUFFRCxRQUFJLEVBQUUsY0FBUyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzNCLGFBQU8sS0FBSyxJQUFJLEtBQUssRUFBRSxFQUFFO0FBQ3ZCLGFBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO09BQ3ZCO0FBQ0QsYUFBTyxLQUFLLENBQUM7S0FDZDtBQUNELFNBQUssRUFBRSxlQUFTLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDN0IsVUFBSSxHQUFHLEdBQUcsS0FBSyxJQUFJLE1BQU0sQ0FBQzs7QUFFMUIsVUFBSSxLQUFLLElBQUksTUFBTSxJQUFLLEtBQUssS0FBSyxNQUFNLEFBQUMsRUFBRTtBQUN6QyxXQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3ZDOztBQUVELGFBQU8sR0FBRyxDQUFDO0tBQ1o7O0FBRUQsUUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNqQixnQkFBWSxFQUFFLFlBQVksQ0FBQyxRQUFRO0dBQ3BDLENBQUM7O0FBRUYsV0FBUyxHQUFHLENBQUMsT0FBTyxFQUFnQjtRQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDaEMsUUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQzs7QUFFeEIsT0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwQixRQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxZQUFZLENBQUMsT0FBTyxFQUFFO0FBQzVDLFVBQUksR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2hDO0FBQ0QsUUFBSSxNQUFNLFlBQUE7UUFDTixXQUFXLEdBQUcsWUFBWSxDQUFDLGNBQWMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDO0FBQy9ELFFBQUksWUFBWSxDQUFDLFNBQVMsRUFBRTtBQUMxQixVQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDbEIsY0FBTSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO09BQzNGLE1BQU07QUFDTCxjQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUNwQjtLQUNGOztBQUVELGFBQVMsSUFBSSxDQUFDLE9BQU8sZ0JBQWU7QUFDbEMsYUFBTyxFQUFFLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3JIO0FBQ0QsUUFBSSxHQUFHLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDdEcsV0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQy9CO0FBQ0QsS0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLEtBQUcsQ0FBQyxNQUFNLEdBQUcsVUFBUyxPQUFPLEVBQUU7QUFDN0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDcEIsZUFBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVsRSxVQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUU7QUFDM0IsaUJBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUN0RTtBQUNELFVBQUksWUFBWSxDQUFDLFVBQVUsSUFBSSxZQUFZLENBQUMsYUFBYSxFQUFFO0FBQ3pELGlCQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDNUU7S0FDRixNQUFNO0FBQ0wsZUFBUyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ3BDLGVBQVMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUN0QyxlQUFTLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7S0FDM0M7R0FDRixDQUFDOztBQUVGLEtBQUcsQ0FBQyxNQUFNLEdBQUcsVUFBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUU7QUFDbEQsUUFBSSxZQUFZLENBQUMsY0FBYyxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQy9DLFlBQU0sMkJBQWMsd0JBQXdCLENBQUMsQ0FBQztLQUMvQztBQUNELFFBQUksWUFBWSxDQUFDLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNyQyxZQUFNLDJCQUFjLHlCQUF5QixDQUFDLENBQUM7S0FDaEQ7O0FBRUQsV0FBTyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7R0FDakYsQ0FBQztBQUNGLFNBQU8sR0FBRyxDQUFDO0NBQ1o7O0FBRU0sU0FBUyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUU7QUFDNUYsV0FBUyxJQUFJLENBQUMsT0FBTyxFQUFnQjtRQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDakMsUUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQzNCLFFBQUksTUFBTSxJQUFJLE9BQU8sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDbEMsbUJBQWEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMxQzs7QUFFRCxXQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQ2YsT0FBTyxFQUNQLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFDckMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQ3BCLFdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQ3hELGFBQWEsQ0FBQyxDQUFDO0dBQ3BCOztBQUVELE1BQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUV6RSxNQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixNQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN4QyxNQUFJLENBQUMsV0FBVyxHQUFHLG1CQUFtQixJQUFJLENBQUMsQ0FBQztBQUM1QyxTQUFPLElBQUksQ0FBQztDQUNiOztBQUVNLFNBQVMsY0FBYyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3hELE1BQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixRQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssZ0JBQWdCLEVBQUU7QUFDckMsVUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztBQUN4QixhQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFDckMsWUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7QUFDRCxhQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDOUIsTUFBTTtBQUNMLGFBQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxQztHQUNGLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFOztBQUV6QyxXQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUN2QixXQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUNyQztBQUNELFNBQU8sT0FBTyxDQUFDO0NBQ2hCOztBQUVNLFNBQVMsYUFBYSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3ZELFNBQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLE1BQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUNmLFdBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7R0FDdkU7O0FBRUQsTUFBSSxZQUFZLFlBQUEsQ0FBQztBQUNqQixNQUFJLE9BQU8sQ0FBQyxFQUFFLElBQUksT0FBTyxDQUFDLEVBQUUsS0FBSyxJQUFJLEVBQUU7QUFDckMsV0FBTyxDQUFDLElBQUksR0FBRyxrQkFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsZ0JBQVksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7O0FBRTFELFFBQUksWUFBWSxDQUFDLFFBQVEsRUFBRTtBQUN6QixhQUFPLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzlFO0dBQ0Y7O0FBRUQsTUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLFlBQVksRUFBRTtBQUN6QyxXQUFPLEdBQUcsWUFBWSxDQUFDO0dBQ3hCOztBQUVELE1BQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtBQUN6QixVQUFNLDJCQUFjLGNBQWMsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDLENBQUM7R0FDNUUsTUFBTSxJQUFJLE9BQU8sWUFBWSxRQUFRLEVBQUU7QUFDdEMsV0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ2xDO0NBQ0Y7O0FBRU0sU0FBUyxJQUFJLEdBQUc7QUFBRSxTQUFPLEVBQUUsQ0FBQztDQUFFOztBQUVyQyxTQUFTLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQy9CLE1BQUksQ0FBQyxJQUFJLElBQUksRUFBRSxNQUFNLElBQUksSUFBSSxDQUFBLEFBQUMsRUFBRTtBQUM5QixRQUFJLEdBQUcsSUFBSSxHQUFHLGtCQUFZLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQyxRQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztHQUNyQjtBQUNELFNBQU8sSUFBSSxDQUFDO0NBQ2I7O0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtBQUN6RSxNQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUU7QUFDaEIsUUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBSSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzVGLFNBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzNCO0FBQ0QsU0FBTyxJQUFJLENBQUM7Q0FDYiIsImZpbGUiOiJydW50aW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vZXhjZXB0aW9uJztcbmltcG9ydCB7IENPTVBJTEVSX1JFVklTSU9OLCBSRVZJU0lPTl9DSEFOR0VTLCBjcmVhdGVGcmFtZSB9IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICBjb25zdCBjb21waWxlclJldmlzaW9uID0gY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSB8fCAxLFxuICAgICAgICBjdXJyZW50UmV2aXNpb24gPSBDT01QSUxFUl9SRVZJU0lPTjtcblxuICBpZiAoY29tcGlsZXJSZXZpc2lvbiAhPT0gY3VycmVudFJldmlzaW9uKSB7XG4gICAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBjdXJyZW50UmV2aXNpb24pIHtcbiAgICAgIGNvbnN0IHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArIHJ1bnRpbWVWZXJzaW9ucyArICcpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoJyArIGNvbXBpbGVyVmVyc2lvbnMgKyAnKS4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSB1cGRhdGUgeW91ciBydW50aW1lIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArIGNvbXBpbGVySW5mb1sxXSArICcpLicpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKCFlbnYpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGUnKTtcbiAgfVxuICBpZiAoIXRlbXBsYXRlU3BlYyB8fCAhdGVtcGxhdGVTcGVjLm1haW4pIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdVbmtub3duIHRlbXBsYXRlIG9iamVjdDogJyArIHR5cGVvZiB0ZW1wbGF0ZVNwZWMpO1xuICB9XG5cbiAgdGVtcGxhdGVTcGVjLm1haW4uZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjLm1haW5fZDtcblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICBlbnYuVk0uY2hlY2tSZXZpc2lvbih0ZW1wbGF0ZVNwZWMuY29tcGlsZXIpO1xuXG4gIGZ1bmN0aW9uIGludm9rZVBhcnRpYWxXcmFwcGVyKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgICBjb250ZXh0ID0gVXRpbHMuZXh0ZW5kKHt9LCBjb250ZXh0LCBvcHRpb25zLmhhc2gpO1xuICAgICAgaWYgKG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIG9wdGlvbnMuaWRzWzBdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJ0aWFsID0gZW52LlZNLnJlc29sdmVQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG4gICAgbGV0IHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG5cbiAgICBpZiAocmVzdWx0ID09IG51bGwgJiYgZW52LmNvbXBpbGUpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXSA9IGVudi5jb21waWxlKHBhcnRpYWwsIHRlbXBsYXRlU3BlYy5jb21waWxlck9wdGlvbnMsIGVudik7XG4gICAgICByZXN1bHQgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgaWYgKG9wdGlvbnMuaW5kZW50KSB7XG4gICAgICAgIGxldCBsaW5lcyA9IHJlc3VsdC5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGluZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCFsaW5lc1tpXSAmJiBpICsgMSA9PT0gbCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGluZXNbaV0gPSBvcHRpb25zLmluZGVudCArIGxpbmVzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVGhlIHBhcnRpYWwgJyArIG9wdGlvbnMubmFtZSArICcgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZScpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIGxldCBjb250YWluZXIgPSB7XG4gICAgc3RyaWN0OiBmdW5jdGlvbihvYmosIG5hbWUpIHtcbiAgICAgIGlmICghKG5hbWUgaW4gb2JqKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdcIicgKyBuYW1lICsgJ1wiIG5vdCBkZWZpbmVkIGluICcgKyBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9ialtuYW1lXTtcbiAgICB9LFxuICAgIGxvb2t1cDogZnVuY3Rpb24oZGVwdGhzLCBuYW1lKSB7XG4gICAgICBjb25zdCBsZW4gPSBkZXB0aHMubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZGVwdGhzW2ldICYmIGRlcHRoc1tpXVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcHRoc1tpXVtuYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbGFtYmRhOiBmdW5jdGlvbihjdXJyZW50LCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGN1cnJlbnQgPT09ICdmdW5jdGlvbicgPyBjdXJyZW50LmNhbGwoY29udGV4dCkgOiBjdXJyZW50O1xuICAgIH0sXG5cbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuXG4gICAgZm46IGZ1bmN0aW9uKGkpIHtcbiAgICAgIGxldCByZXQgPSB0ZW1wbGF0ZVNwZWNbaV07XG4gICAgICByZXQuZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjW2kgKyAnX2QnXTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgICBsZXQgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldLFxuICAgICAgICAgIGZuID0gdGhpcy5mbihpKTtcbiAgICAgIGlmIChkYXRhIHx8IGRlcHRocyB8fCBibG9ja1BhcmFtcyB8fCBkZWNsYXJlZEJsb2NrUGFyYW1zKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gd3JhcFByb2dyYW0odGhpcywgaSwgZm4sIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gd3JhcFByb2dyYW0odGhpcywgaSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuICAgIH0sXG5cbiAgICBkYXRhOiBmdW5jdGlvbih2YWx1ZSwgZGVwdGgpIHtcbiAgICAgIHdoaWxlICh2YWx1ZSAmJiBkZXB0aC0tKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuX3BhcmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICBsZXQgb2JqID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICBvYmogPSBVdGlscy5leHRlbmQoe30sIGNvbW1vbiwgcGFyYW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG5cbiAgICBub29wOiBlbnYuVk0ubm9vcCxcbiAgICBjb21waWxlckluZm86IHRlbXBsYXRlU3BlYy5jb21waWxlclxuICB9O1xuXG4gIGZ1bmN0aW9uIHJldChjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcblxuICAgIHJldC5fc2V0dXAob3B0aW9ucyk7XG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwgJiYgdGVtcGxhdGVTcGVjLnVzZURhdGEpIHtcbiAgICAgIGRhdGEgPSBpbml0RGF0YShjb250ZXh0LCBkYXRhKTtcbiAgICB9XG4gICAgbGV0IGRlcHRocyxcbiAgICAgICAgYmxvY2tQYXJhbXMgPSB0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgPyBbXSA6IHVuZGVmaW5lZDtcbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocykge1xuICAgICAgaWYgKG9wdGlvbnMuZGVwdGhzKSB7XG4gICAgICAgIGRlcHRocyA9IGNvbnRleHQgIT0gb3B0aW9ucy5kZXB0aHNbMF0gPyBbY29udGV4dF0uY29uY2F0KG9wdGlvbnMuZGVwdGhzKSA6IG9wdGlvbnMuZGVwdGhzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVwdGhzID0gW2NvbnRleHRdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1haW4oY29udGV4dC8qLCBvcHRpb25zKi8pIHtcbiAgICAgIHJldHVybiAnJyArIHRlbXBsYXRlU3BlYy5tYWluKGNvbnRhaW5lciwgY29udGV4dCwgY29udGFpbmVyLmhlbHBlcnMsIGNvbnRhaW5lci5wYXJ0aWFscywgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG4gICAgfVxuICAgIG1haW4gPSBleGVjdXRlRGVjb3JhdG9ycyh0ZW1wbGF0ZVNwZWMubWFpbiwgbWFpbiwgY29udGFpbmVyLCBvcHRpb25zLmRlcHRocyB8fCBbXSwgZGF0YSwgYmxvY2tQYXJhbXMpO1xuICAgIHJldHVybiBtYWluKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG4gIHJldC5pc1RvcCA9IHRydWU7XG5cbiAgcmV0Ll9zZXR1cCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgY29udGFpbmVyLmhlbHBlcnMgPSBjb250YWluZXIubWVyZ2Uob3B0aW9ucy5oZWxwZXJzLCBlbnYuaGVscGVycyk7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlUGFydGlhbCkge1xuICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBjb250YWluZXIubWVyZ2Uob3B0aW9ucy5wYXJ0aWFscywgZW52LnBhcnRpYWxzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlUGFydGlhbCB8fCB0ZW1wbGF0ZVNwZWMudXNlRGVjb3JhdG9ycykge1xuICAgICAgICBjb250YWluZXIuZGVjb3JhdG9ycyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLmRlY29yYXRvcnMsIGVudi5kZWNvcmF0b3JzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLmhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBjb250YWluZXIucGFydGlhbHMgPSBvcHRpb25zLnBhcnRpYWxzO1xuICAgICAgY29udGFpbmVyLmRlY29yYXRvcnMgPSBvcHRpb25zLmRlY29yYXRvcnM7XG4gICAgfVxuICB9O1xuXG4gIHJldC5fY2hpbGQgPSBmdW5jdGlvbihpLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VCbG9ja1BhcmFtcyAmJiAhYmxvY2tQYXJhbXMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ211c3QgcGFzcyBibG9jayBwYXJhbXMnKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VEZXB0aHMgJiYgIWRlcHRocykge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignbXVzdCBwYXNzIHBhcmVudCBkZXB0aHMnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gd3JhcFByb2dyYW0oY29udGFpbmVyLCBpLCB0ZW1wbGF0ZVNwZWNbaV0sIGRhdGEsIDAsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICB9O1xuICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcFByb2dyYW0oY29udGFpbmVyLCBpLCBmbiwgZGF0YSwgZGVjbGFyZWRCbG9ja1BhcmFtcywgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuICBmdW5jdGlvbiBwcm9nKGNvbnRleHQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBjdXJyZW50RGVwdGhzID0gZGVwdGhzO1xuICAgIGlmIChkZXB0aHMgJiYgY29udGV4dCAhPSBkZXB0aHNbMF0pIHtcbiAgICAgIGN1cnJlbnREZXB0aHMgPSBbY29udGV4dF0uY29uY2F0KGRlcHRocyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZuKGNvbnRhaW5lcixcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgY29udGFpbmVyLmhlbHBlcnMsIGNvbnRhaW5lci5wYXJ0aWFscyxcbiAgICAgICAgb3B0aW9ucy5kYXRhIHx8IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zICYmIFtvcHRpb25zLmJsb2NrUGFyYW1zXS5jb25jYXQoYmxvY2tQYXJhbXMpLFxuICAgICAgICBjdXJyZW50RGVwdGhzKTtcbiAgfVxuXG4gIHByb2cgPSBleGVjdXRlRGVjb3JhdG9ycyhmbiwgcHJvZywgY29udGFpbmVyLCBkZXB0aHMsIGRhdGEsIGJsb2NrUGFyYW1zKTtcblxuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gZGVwdGhzID8gZGVwdGhzLmxlbmd0aCA6IDA7XG4gIHByb2cuYmxvY2tQYXJhbXMgPSBkZWNsYXJlZEJsb2NrUGFyYW1zIHx8IDA7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVBhcnRpYWwocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuICBpZiAoIXBhcnRpYWwpIHtcbiAgICBpZiAob3B0aW9ucy5uYW1lID09PSAnQHBhcnRpYWwtYmxvY2snKSB7XG4gICAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgIHdoaWxlIChkYXRhWydwYXJ0aWFsLWJsb2NrJ10gPT09IG5vb3ApIHtcbiAgICAgICAgZGF0YSA9IGRhdGEuX3BhcmVudDtcbiAgICAgIH1cbiAgICAgIHBhcnRpYWwgPSBkYXRhWydwYXJ0aWFsLWJsb2NrJ107XG4gICAgICBkYXRhWydwYXJ0aWFsLWJsb2NrJ10gPSBub29wO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdO1xuICAgIH1cbiAgfSBlbHNlIGlmICghcGFydGlhbC5jYWxsICYmICFvcHRpb25zLm5hbWUpIHtcbiAgICAvLyBUaGlzIGlzIGEgZHluYW1pYyBwYXJ0aWFsIHRoYXQgcmV0dXJuZWQgYSBzdHJpbmdcbiAgICBvcHRpb25zLm5hbWUgPSBwYXJ0aWFsO1xuICAgIHBhcnRpYWwgPSBvcHRpb25zLnBhcnRpYWxzW3BhcnRpYWxdO1xuICB9XG4gIHJldHVybiBwYXJ0aWFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMucGFydGlhbCA9IHRydWU7XG4gIGlmIChvcHRpb25zLmlkcykge1xuICAgIG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCA9IG9wdGlvbnMuaWRzWzBdIHx8IG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aDtcbiAgfVxuXG4gIGxldCBwYXJ0aWFsQmxvY2s7XG4gIGlmIChvcHRpb25zLmZuICYmIG9wdGlvbnMuZm4gIT09IG5vb3ApIHtcbiAgICBvcHRpb25zLmRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIHBhcnRpYWxCbG9jayA9IG9wdGlvbnMuZGF0YVsncGFydGlhbC1ibG9jayddID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChwYXJ0aWFsQmxvY2sucGFydGlhbHMpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHMgPSBVdGlscy5leHRlbmQoe30sIG9wdGlvbnMucGFydGlhbHMsIHBhcnRpYWxCbG9jay5wYXJ0aWFscyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCAmJiBwYXJ0aWFsQmxvY2spIHtcbiAgICBwYXJ0aWFsID0gcGFydGlhbEJsb2NrO1xuICB9XG5cbiAgaWYgKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1RoZSBwYXJ0aWFsICcgKyBvcHRpb25zLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICB9IGVsc2UgaWYgKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gJyc7IH1cblxuZnVuY3Rpb24gaW5pdERhdGEoY29udGV4dCwgZGF0YSkge1xuICBpZiAoIWRhdGEgfHwgISgncm9vdCcgaW4gZGF0YSkpIHtcbiAgICBkYXRhID0gZGF0YSA/IGNyZWF0ZUZyYW1lKGRhdGEpIDoge307XG4gICAgZGF0YS5yb290ID0gY29udGV4dDtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gZXhlY3V0ZURlY29yYXRvcnMoZm4sIHByb2csIGNvbnRhaW5lciwgZGVwdGhzLCBkYXRhLCBibG9ja1BhcmFtcykge1xuICBpZiAoZm4uZGVjb3JhdG9yKSB7XG4gICAgbGV0IHByb3BzID0ge307XG4gICAgcHJvZyA9IGZuLmRlY29yYXRvcihwcm9nLCBwcm9wcywgY29udGFpbmVyLCBkZXB0aHMgJiYgZGVwdGhzWzBdLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcbiAgICBVdGlscy5leHRlbmQocHJvZywgcHJvcHMpO1xuICB9XG4gIHJldHVybiBwcm9nO1xufVxuIl19


/***/ },
/* 36 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global window */
	'use strict';

	exports.__esModule = true;

	exports['default'] = function (Handlebars) {
	  /* istanbul ignore next */
	  var root = typeof global !== 'undefined' ? global : window,
	      $Handlebars = root.Handlebars;
	  /* istanbul ignore next */
	  Handlebars.noConflict = function () {
	    if (root.Handlebars === Handlebars) {
	      root.Handlebars = $Handlebars;
	    }
	    return Handlebars;
	  };
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL25vLWNvbmZsaWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUNlLFVBQVMsVUFBVSxFQUFFOztBQUVsQyxNQUFJLElBQUksR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsTUFBTSxHQUFHLE1BQU07TUFDdEQsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7O0FBRWxDLFlBQVUsQ0FBQyxVQUFVLEdBQUcsWUFBVztBQUNqQyxRQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFO0FBQ2xDLFVBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0tBQy9CO0FBQ0QsV0FBTyxVQUFVLENBQUM7R0FDbkIsQ0FBQztDQUNIIiwiZmlsZSI6Im5vLWNvbmZsaWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIHdpbmRvdyAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oSGFuZGxlYmFycykge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBsZXQgcm9vdCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93LFxuICAgICAgJEhhbmRsZWJhcnMgPSByb290LkhhbmRsZWJhcnM7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIEhhbmRsZWJhcnMubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChyb290LkhhbmRsZWJhcnMgPT09IEhhbmRsZWJhcnMpIHtcbiAgICAgIHJvb3QuSGFuZGxlYmFycyA9ICRIYW5kbGViYXJzO1xuICAgIH1cbiAgICByZXR1cm4gSGFuZGxlYmFycztcbiAgfTtcbn1cbiJdfQ==

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var config = __webpack_require__(6);
	var store = __webpack_require__(9);

	// Reminders API

	var getReminders = function getReminders() {
	  return $.ajax({
	    url: config.apiOrigin + '/reminders/',
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var showReminder = function showReminder() {
	  return $.ajax({
	    url: config.apiOrigin + '/reminders/' + store.currentReminderId,
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var createReminder = function createReminder(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/reminders/',
	    method: 'POST',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    },
	    data: data
	  });
	};

	var deleteReminder = function deleteReminder(id) {
	  return $.ajax({
	    url: config.apiOrigin + '/reminders/' + id,
	    method: 'DELETE',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var updateReminder = function updateReminder(data) {
	  return $.ajax({
	    url: config.apiOrigin + '/reminders/' + store.currentReminderId,
	    method: 'PATCH',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    },
	    data: data
	  });
	};

	module.exports = {
	  getReminders: getReminders,
	  createReminder: createReminder,
	  deleteReminder: deleteReminder,
	  showReminder: showReminder,
	  updateReminder: updateReminder
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var addNestedValue = __webpack_require__(5);

	var getFormFields = function getFormFields(form) {
	  var target = {};

	  var elements = form.elements || [];
	  for (var i = 0; i < elements.length; i++) {
	    var e = elements[i];
	    if (!e.hasAttribute('name')) {
	      continue;
	    }

	    var type = 'TEXT';
	    switch (e.nodeName.toUpperCase()) {
	      case 'SELECT':
	        type = e.hasAttribute('multiple') ? 'MULTIPLE' : type;
	        break;
	      case 'INPUT':
	        type = e.getAttribute('type').toUpperCase();
	        break;
	    }

	    var name = e.getAttribute('name');

	    if (type === 'MULTIPLE') {
	      for (var _i = 0; _i < e.length; _i++) {
	        if (e[_i].selected) {
	          addNestedValue(target, name, e[_i].value);
	        }
	      }
	    } else if (type !== 'RADIO' && type !== 'CHECKBOX' || e.checked) {
	      addNestedValue(target, name, e.value);
	    }
	  }

	  return target;
	};

	module.exports = getFormFields;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var jobsApi = __webpack_require__(11);
	var jobsUi = __webpack_require__(40);
	var getFormFields = __webpack_require__(38);
	var store = __webpack_require__(9);
	var logic = __webpack_require__(16);

	// Job EVENTS

	var onGetJobs = function onGetJobs(event) {
	  event.preventDefault();
	  var screenWidth = window.innerWidth;
	  if (screenWidth < 768) {
	    $(".nav-mobile-ul").slideUp();
	  }
	  jobsApi.getJobs().done(jobsUi.getJobSuccess).fail(jobsUi.getJobFailure);
	};

	var onShowJobRecord = function onShowJobRecord(event) {
	  event.preventDefault();
	  store.currentJobId = $(this).attr("data-current-job-id");
	  jobsApi.showJob().done(jobsUi.showJobRecordSuccess).fail(jobsUi.showJobRecordFailure);
	};

	var onEditJob = function onEditJob(event) {
	  event.preventDefault();
	  store.currentJobId = $(this).attr("data-current-job-id");
	  store.currentJobRefId = $(this).attr("data-current-job-ref-id");
	  store.currentJobRefText = $(this).attr("data-current-job-ref-text");

	  // Template
	  var formCategory = "job";
	  var listCategory = "job";
	  jobsUi.generateUpdateForm(listCategory, formCategory);
	};

	var onCreateJob = function onCreateJob(event) {
	  event.preventDefault();

	  var createDefaultReminder = $("#default-reminder-input").prop("checked");

	  if (createDefaultReminder === "true" || createDefaultReminder === true) {
	    store.addDefaultReminder = true;
	  } else {
	    store.addDefaultReminder = false;
	  }

	  logic.convertPercentage();
	  var data = getFormFields(event.target);

	  data.job.notes = $("#job-notes-input").val();
	  data.job.job_description = $("#job-description-input").val();

	  data.job.post_url = logic.convertToUrl(data.job.post_url);

	  var isJobAppliedChecked = $('#job-applied-checkbox').prop("checked");

	  if (isJobAppliedChecked === "true" || isJobAppliedChecked === true) {
	    data.job.applied = true;
	  } else {
	    data.job.applied = false;
	  }

	  store.lastShowJobData = data;
	  // data.job.posting_date = logic.formatDate(data.job.posting_date);
	  // data.job.deadline = logic.formatDate(data.job.deadline);
	  store.createJobData = data;

	  jobsApi.createJob(data).done(jobsUi.createDefaultReminderSuccess).fail(jobsUi.createJobFailure);
	};

	var onDeleteJob = function onDeleteJob(event) {
	  event.preventDefault();
	  store.currentJobId = $("#job-record-delete").attr("data-current-job-id");

	  jobsApi.deleteJob(store.currentJobId).done(jobsUi.deleteJobSuccess).fail(jobsUi.deleteJobFailure);
	};

	var onUpdateJob = function onUpdateJob(event) {
	  event.preventDefault();
	  logic.convertPercentage();
	  var data = getFormFields(event.target);

	  store.createJobData = data;
	  store.lastShowJobData = data;

	  data.job.notes = $("#job-notes-input").val();

	  data.job.job_description = $("#job-description-input").val();

	  data.job.post_url = logic.convertToUrl(data.job.post_url);

	  data.job.company_name = $(".company-name-update-form").text();

	  var isJobAppliedChecked = $('#job-applied-checkbox').prop("checked");

	  var isJobRadioAppliedShown = $("#job-radio-applied-no").prop("checked");
	  var jobAppliedOriginalVal = $("#job-radio-applied-no").attr("data-original-applied-val");
	  // let dataOriginalValAttribute = $("#job-radio-applied-no").attr("data-original-applied-val");
	  var dataOriginalDateAttribute = $("#job-radio-applied-no").attr("data-original-date-val");

	  if (jobAppliedOriginalVal === "true") {
	    jobAppliedOriginalVal = true;
	  } else {
	    jobAppliedOriginalVal = false;
	  }

	  // console.log(jobAppliedOriginalVal);

	  if (!isJobRadioAppliedShown) {
	    if (isJobAppliedChecked) {
	      data.job.applied = true;
	    } else {
	      data.job.applied = false;
	    }
	  }

	  if (isJobRadioAppliedShown) {
	    data.job.applied = jobAppliedOriginalVal;
	    data.job.date_applied = dataOriginalDateAttribute;
	  }

	  store.createJobData = data;
	  store.lastShowJobData = data;

	  jobsApi.updateJob(data).done(jobsUi.updateJobSuccess).fail(jobsUi.updateJobFailure);
	};

	var onShowJobCreateForm = function onShowJobCreateForm(event) {
	  event.preventDefault();
	  jobsUi.showJobCreateForm();
	};

	var onShowDeleteMenu = function onShowDeleteMenu(event) {
	  event.preventDefault();
	  $('.job-record-btn-options').hide();
	  $(".delete-confirmation-contain").show();
	};

	var resizeTextArea = function resizeTextArea() {
	  var divId = $(this).attr("id");
	  logic.onResizeTextarea(divId);
	};

	var onAppliedForJob = function onAppliedForJob(event) {
	  event.preventDefault();

	  var isCurrentlyChecked = $(this).prop("checked");
	  // console.log(isCurrentlyChecked);
	  var defaultDate = logic.defaultDate();

	  if (isCurrentlyChecked) {
	    $(this).prop("checked", true);
	    $(".job-applied-date-container").show();
	    var isUpdateForm = parseInt($("#job-applied-date-field").attr("data-attr-update-form"));
	    var isNewDate = $("#job-applied-date-field").val();
	    if (isUpdateForm === 0) {
	      $("#job-applied-date-field").val(defaultDate);
	    }

	    if (isUpdateForm === 1) {
	      var alreadyApplied = $("#job-applied-checkbox").attr("data-attr-applied");
	      if (isNewDate === "" && alreadyApplied === "false") {
	        $("#job-applied-date-field").val(defaultDate);
	      }
	    }
	  } else {
	    $(this).prop("checked", false);
	    $(".job-applied-date-container").hide();
	    $("#job-applied-date-field").val(null);
	  }
	};

	var onShowAppliedUpdate = function onShowAppliedUpdate(event) {
	  event.preventDefault();

	  var currentVal = parseInt($(this).val());
	  // console.log(currentVal);

	  if (currentVal === 1) {
	    // $("#job-radio-applied-no").prop("checked", false);
	    $("#job-radio-applied-yes").prop("checked", true);
	    $(".update-application-status-container").show();

	    // let applicationStatus = $("#job-applied-checkbox").attr("data-attr-applied");
	    // console.log(applicationStatus);

	    // console.log(applicationStatus === "true");
	    // if (applicationStatus === "true") {
	    //   $("#job-applied-date-update-field").show();
	    //   $("#job-applied-checkbox").click();
	    // }
	    var alreadyApplied = $("#job-applied-checkbox").attr("data-attr-applied");

	    if (alreadyApplied === "true") {
	      $("#job-applied-checkbox").click();
	    }
	  }

	  if (currentVal === 0) {
	    // $("#job-radio-applied-yes").prop("checked", false);
	    $("#job-radio-applied-no").prop("checked", true);
	    $(".update-application-status-container").hide();
	  }
	};

	var addHandlers = function addHandlers() {
	  $('.content').on('submit', '#new-job-form', onCreateJob);
	  $('.content').on('submit', '#update-job-form', onUpdateJob);
	  $('.content').on('click', '#job-record-btn-edit', onEditJob);
	  $('.content').on('click', '#dashboard-new-job-btn', onShowJobCreateForm);
	  $('.content').on('click', '.dashboard-job-record-btn', onShowJobRecord);
	  $('#get-jobs-btn').on('click', onGetJobs);
	  $('.content').on('click', '#job-record-delete', onDeleteJob);
	  $('.content').on('click', '.get-jobs', onGetJobs);
	  $('.content').on('click', '#job-record-delete-menu', onShowDeleteMenu);
	  $('.content').on('click', '#job-delete-cancel', onShowJobRecord);
	  $('.content').on('click', '.get-jobs-back-btn', onGetJobs);
	  $('.content').on('keyup', '#job-description-input', resizeTextArea);
	  $('.content').on('keyup', '#job-responsibilities-input', resizeTextArea);
	  $('.content').on('keyup', '#job-requirement-input', resizeTextArea);
	  $('.content').on('keyup', '#job-notes-input', resizeTextArea);
	  $('.content').on('click', '#dashboard-recent-job-btn', onGetJobs);
	  $('.content').on('change', '#job-applied-checkbox', onAppliedForJob);
	  $('.content').on('change', '.job-radio-applied-btn', onShowAppliedUpdate);
	  $('.content').on('click', '.get-jobs-back-btn', onGetJobs);
	};

	module.exports = {
	  addHandlers: addHandlers
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var store = __webpack_require__(9);
	var displayEditJob = __webpack_require__(41);
	var displayJobDashboard = __webpack_require__(42);
	var displayJobPendingPriority = __webpack_require__(43);
	var displayJobDetails = __webpack_require__(44);
	var displayJobCreateForm = __webpack_require__(45);
	var jobsApi = __webpack_require__(11);
	var summaryLogic = __webpack_require__(46);
	var logic = __webpack_require__(16);
	var remindersApi = __webpack_require__(37);
	var jobLogic = __webpack_require__(53);

	var getJobSuccess = function getJobSuccess(data) {
	  // // console.log(data);

	  $(".notification-container").children().text("");

	  $(".content").children().remove();

	  // let dataArr = data.jobs;
	  //
	  // for (let i = 0; i < dataArr.length; i++ ) {
	  //   let unavailable = "N/A";
	  //   let currArrayOptOne = (dataArr[i].title);
	  //   let currArrayOptTwo = (dataArr[i].posting_date);
	  //
	  //   if (currArrayOptOne === "" || currArrayOptOne === null) {
	  //     dataArr[i].title = unavailable;
	  //   }
	  //   if (currArrayOptTwo === "" || currArrayOptTwo === null) {
	  //     dataArr[i].posting_date = unavailable;
	  //   }
	  //
	  // }

	  var jobDashboard = displayJobDashboard({
	    jobs: data.jobs
	  });

	  store.jobDataForEdit = data;

	  $('.content').append(jobDashboard);

	  var pendingPriorityData = jobLogic.removeAppliedJobs(data);

	  var jobAppliedData = displayJobPendingPriority({
	    jobs: pendingPriorityData.jobs
	  });

	  // let dashboardHome = displayDashboardHome({
	  //   reminders: reminderFinalData.reminders,
	  //   jobs: jobFinalData.jobs,
	  // }

	  $('.job-pending-priority-container').append(jobAppliedData);

	  var allJobsEmptyLength = $(".job-summary-table tbody").children().length;

	  if (allJobsEmptyLength === 0) {
	    $(".all-jobs-empty-remove").remove();
	    $(".all-jobs-empty").text('There are no jobs associated with your account. Click "Create Job" to get started.');
	  }
	};

	var showJobRecordSuccess = function showJobRecordSuccess(data) {

	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  store.lastShowJobData = data;

	  // data.job.posting_date = logic.formatDate(data.job.posting_date);
	  // data.job.deadline = logic.formatDate(data.job.deadline);

	  var jobDetails = displayJobDetails({
	    job: data.job
	  });
	  $('.content').append(jobDetails);

	  $(".delete-confirmation-contain").hide();
	  $("#job-record-delete-menu").show();

	  logic.displayUrl();

	  // Summary Table reminders
	  summaryLogic.initiateJobSummaryTables(data.job.id);

	  logic.dateFormatByClass();

	  // let communicationEmptyLength = $(".communications-summary-table-container").children().length;
	  //
	  // if (communicationEmptyLength === 0) {
	  //   $(".communications-summary-table-container").children().remove();
	  //   $(".communications-empty-message").append("<h3>Linked Communications</h3>");
	  //   $(".communications-empty-message").append("<p>There are no communications linked to this company.</p>");
	  // }
	  //
	  // let contactEmptyLength = $(".contacts-summary-table-container").children().length;
	  //
	  // if (contactEmptyLength === 0) {
	  //   $(".contacts-summary-table-container").children().remove();
	  //   $(".contacts-empty-message").append("<h3>Linked Contacts</h3>");
	  //   $(".contacts-empty-message").append("<p>There are no contacts linked to this company.</p>");
	  // }
	  //
	  // // let remindersEmptyLength = $(".reminders-summary-table-container").children("table").children().length;
	  // // if (remindersEmptyLength > 0) {
	  // //   $(".reminders-summary-table-container").remove();
	  // //   $(".reminders-empty-message").append("<h3>Linked Reminders</h3>");
	  // //   $(".reminders-empty-message").append("<p>There are no reminders linked to this company.</p>");
	  // // }
	  //
	  // let documentsEmptyLength = $(".documents-summary-table-container").children().length;
	  //
	  // if (documentsEmptyLength === 0) {
	  //   $(".documents-summary-table-container").remove();
	  //   $(".documents-empty-message").append("<h3>Linked Documents</h3>");
	  //   $(".documents-empty-message").append("<p>There are no documents linked to this company.</p>");
	  // }
	};

	var showJobRecordFailure = function showJobRecordFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured displaying the job record");
	};

	var showJobCreateForm = function showJobCreateForm() {
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  var showCreateJobForm = displayJobCreateForm();
	  $('.content').append(showCreateJobForm);
	  $(".job-applied-date-container").hide();
	  $("#default-reminder-input").prop("checked", true);
	};

	var generateUpdateForm = function generateUpdateForm() {
	  $(".notification-container").children().text("");
	  $(".content").children().remove();

	  var data = store.lastShowJobData;

	  var editJob = displayEditJob({
	    job: data.job
	  });
	  $('.content').append(editJob);

	  $(".update-application-status-container").hide();
	  $("#job-radio-applied-no").prop("checked", true);

	  var jobDescriptionId = "#job-description-input";
	  var jobResponsibilitiesId = "#job-responsibilities-input";
	  var jobRequirementId = "#job-requirement-input";
	  var jobNotesId = "#job-notes-input";
	  logic.textAreaHeightUpdate(jobDescriptionId);
	  logic.textAreaHeightUpdate(jobResponsibilitiesId);
	  logic.textAreaHeightUpdate(jobRequirementId);
	  logic.textAreaHeightUpdate(jobNotesId);

	  var currentValOfSelect = $("#job-priority-select").attr("data-job-priority");
	  // console.log(currentValOfSelect);
	  $("#job-priority-select").val(currentValOfSelect);
	};

	var getJobFailure = function getJobFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured when retrieving the job record");
	};

	var createJobSuccess = function createJobSuccess(data) {
	  // const createJobSuccess = (data) => {
	  store.currentJobId = data.job.id;
	  $(".form-error").text("");
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  $(".success-alert").text("The record has been successfully created.");

	  var showJobDetails = displayJobDetails({
	    job: store.createJobData.job
	  });
	  $(".content").append(showJobDetails);
	  $(".current").attr("data-current-job-id", store.currentJobId);
	  logic.displayUrl();
	  logic.dateFormatByClass();
	};

	var deleteJobSuccess = function deleteJobSuccess() {
	  $(".notification-container").children().text("");
	  $(".success-alert").text("The record has been successfully deleted");
	  jobsApi.getJobs().done(getJobSuccess).fail(getJobFailure);
	};

	var deleteJobFailure = function deleteJobFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured when deleting the job record");
	};

	var updateJobSuccess = function updateJobSuccess(data) {
	  store.currentJobId = data.job.id;
	  $(".form-error").text("");
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  $(".success-alert").text("The record has been successfully updated");

	  // data.job.posting_date = logic.formatDate(data.job.posting_date);
	  // data.job.deadline = logic.formatDate(data.job.deadline);

	  var showJobDetails = displayJobDetails({
	    job: data.job
	  });
	  $(".content").append(showJobDetails);
	  $(".current").attr("data-current-job-id", store.currentJobId);
	  logic.displayUrl();
	  logic.dateFormatByClass();
	};

	var createJobFailure = function createJobFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured. Please make sure all required fields are complete");
	};

	var updateJobFailure = function updateJobFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record has not been updated. Please make sure all required fields are complete");
	  store.addDefaultReminder = false;
	};

	var createdefaultSuccess = function createdefaultSuccess() {

	  var sendJobData = store.savedJobDataPostCreate;
	  store.addDefaultReminder = false;
	  createJobSuccess(sendJobData);
	};

	var createdefaultFailure = function createdefaultFailure() {
	  store.addDefaultReminder = false;
	  createJobFailure();
	};

	var createDefaultReminderSuccess = function createDefaultReminderSuccess(data) {
	  var returnedJobData = data;
	  store.savedJobDataPostCreate = data;

	  var companyName = data.job.company_name;
	  var jobId = data.job.id;
	  var jobNote = data.job.note;
	  var defaultReminder = store.addDefaultReminder;

	  if (defaultReminder) {

	    data = {
	      reminder: {}
	    };

	    data.reminder.reminder_date = logic.defaultDate();
	    data.reminder.reminder_type = "Action";
	    data.reminder.reminder_subject = companyName + ": Default Notification";
	    data.reminder.job_ref_text = companyName;
	    data.reminder.job_ref_id = jobId;
	    data.reminder.reminder_details = jobNote;

	    remindersApi.createReminder(data).done(createdefaultSuccess).fail(createdefaultFailure);
	  }

	  store.addDefaultReminder = false;

	  createJobSuccess(returnedJobData);
	};

	module.exports = {
	  getJobSuccess: getJobSuccess,
	  showJobRecordSuccess: showJobRecordSuccess,
	  deleteJobSuccess: deleteJobSuccess,
	  deleteJobFailure: deleteJobFailure,
	  showJobCreateForm: showJobCreateForm,
	  getJobFailure: getJobFailure,
	  updateJobSuccess: updateJobSuccess,
	  showJobRecordFailure: showJobRecordFailure,
	  createJobSuccess: createJobSuccess,
	  generateUpdateForm: generateUpdateForm,
	  createJobFailure: createJobFailure,
	  updateJobFailure: updateJobFailure,
	  createDefaultReminderSuccess: createDefaultReminderSuccess
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data) {
	    var stack1;

	  return "            Application Status: Applied on "
	    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.date_applied : stack1), depth0))
	    + "\n";
	},"3":function(container,depth0,helpers,partials,data) {
	    return "            Application Status: You have not applied for this job.\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "<div class=\"update-job-form-container form-container job-page group-category\">\n  <form class=\"form job-form reminder-form\" id=\"update-job-form\" name=\"update-job-form\" data-update-form=\"1\">\n    <fieldset>\n      <legend>Update Job Form</legend>\n      <p id=\"update-job-error\" class=\"warning form-error\"></p>\n      <p>All fields are <u>optional</u> unless otherwise indicated</p>\n\n      <h3 class=\"company-name-update-form\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.company_name : stack1), depth0))
	    + "</h3>\n\n      <div class=\"form-group\">\n        <label>Job Title (required)</label>\n        <input class=\"form-control text-input required-field job-title\" name=\"job[title]\" placeholder=\"Job Title\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.title : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Posting Date</label>\n        <input class=\"form-control text-input required-field posting-date\" name=\"job[posting_date]\" placeholder=\"Date Posted\" type=\"date\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.posting_date : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Post Url</label>\n        <input class=\"form-control post-url\" name=\"job[post_url]\" placeholder=\"Post Website Link\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.post_url : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Salary</label>\n        <input class=\"form-control text-input salary\" name=\"job[salary]\" placeholder=\"Salary\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.salary : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Description</label>\n        <textarea id=\"job-description-input\" class=\"form-control text-input field-input job-description\" name=\"job[job_description]\" placeholder=\"Job Description\" type=\"textarea\" value=\"\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.job_description : stack1), depth0))
	    + "</textarea>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Responsibilities</label>\n        <textarea id=\"job-responsibilities-input\" class=\"form-control text-input field-input responsibility\" name=\"job[responsibility]\" placeholder=\"Job Responsibilities\" type=\"textarea\" value=\"\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.responsibility : stack1), depth0))
	    + "</textarea>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Requirement</label>\n        <textarea id=\"job-requirement-input\" class=\"form-control text-input field-input requirement\" name=\"job[requirement]\" placeholder=\"Job Requirements\" type=\"textarea\" value=\"\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.requirement : stack1), depth0))
	    + "</textarea>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Deadline</label>\n        <input class=\"form-control deadline\" name=\"job[deadline]\" placeholder=\"Deadline Date\" type=\"date\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.deadline : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Notes "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.applied_date : stack1), depth0))
	    + "</label>\n        <textarea id=\"job-notes-input\" class=\"form-control text-input field-input comment\" form=\"update-job-form\" name=\"job[note]\" placeholder=\"Job Notes\" type=\"text\" value=\"\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.note : stack1), depth0))
	    + "</textarea>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Application Priority Scale</label>\n        <label>1 being the highest priority</label>\n        <select class=\"form-control\" name=\"job[priority_num]\" id=\"job-priority-select\" data-job-priority=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.priority_num : stack1), depth0))
	    + "\">\n          <option>1</option>\n          <option>2</option>\n          <option>3</option>\n          <option>4</option>\n          <option>5</option>\n        </select>\n      </div>\n\n      <div class=\"job-create-link-container form-group\">\n        <p>\n"
	    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.applied : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
	    + "        </p>\n\n        <div class=\"form-group job-radio-applied-container update-radio-applied-container-btn\">\n          <label>Would you like to update the application status?</label>\n          <label><input id=\"job-radio-applied-yes\" class=\"job-category job-radio-applied-btn\" type=\"radio\" name=\"job-radio\" value=\"1\">Yes</label>\n          <label><input id=\"job-radio-applied-no\" class=\"job-category job-radio-applied-btn\" type=\"radio\" name=\"job-radio\" value=\"0\" data-original-applied-val=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.applied : stack1), depth0))
	    + "\" data-original-date-val=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.date_applied : stack1), depth0))
	    + "\">No</label>\n        </div>\n\n        <div class=\"update-application-status-container\">\n          <label>Have you applied to the job?</label>\n          <div class=\"form-group\">\n            <span>Check Box for Yes</span>\n            <input id=\"job-applied-checkbox\" class=\"edit-input-aet\" name=\"job[applied]\" placeholder=\"applied\" type=\"checkbox\" value=\"\" data-attr-applied=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.applied : stack1), depth0))
	    + "\">\n          </div>\n          <div class=\"form-group job-applied-date-container\">\n            <input id=\"job-applied-date-field\" name=\"job[date_applied]\" class=\"form-control\" placeholder=\"Application Date\" type=\"date\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.date_applied : stack1), depth0))
	    + "\" data-attr-update-form=\"1\">\n          </div>\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <input class=\"btn btn-success submit-btn current\" name=\"submit\" id=\"submit-job-update-btn\" type=\"submit\" value=\"Submit\" data-current-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-ref-text=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">\n        <input class=\"btn btn-danger submit-btn current get-jobs-back-btn\" name=\"submit\" type=\"button\" value=\"Cancel\">\n      </div>\n    </fieldset>\n  </form>\n</div>\n";
	},"useData":true});

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "            <tr>\n              <td class=\"display-company-name\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_name : stack1), depth0))
	    + "\n              </td>\n              <td class=\"display-job-title hidden-xs hidden-sm\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.title : stack1), depth0))
	    + "\n              </td>\n              <td>\n"
	    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = blockParams[0][0]) != null ? stack1.applied : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams),"inverse":container.program(4, data, 0, blockParams),"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "              </td>\n              <td class=\"hidden-xs hidden-sm\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.priority_num : stack1), depth0))
	    + "\n              </td>\n              <td>\n                <button type=\"button\" class=\"btn btn-default btn-sm dashboard-job-record-btn\" data-current-job-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\">View</button>\n              </td>\n            </tr>\n";
	},"2":function(container,depth0,helpers,partials,data) {
	    return "                  Yes\n";
	},"4":function(container,depth0,helpers,partials,data) {
	    return "                  No\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "\n\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <h1>Job Dashboard</h1>\n    </div>\n  </div>\n  <div class=\"row all-jobs-empty-remove\">\n    <!-- <div class=\"col-lg-10 col-lg-offset-1 col-xs-12 col-xs-offset-0\"> -->\n    <div class=\"col-xs-12 col-sm-6\">\n      <h3>All Applications</h3>\n      <table class=\"table job-summary-table table-hover\">\n        <thead>\n          <tr>\n            <th>Company Name</th>\n            <th class=\"hidden-xs hidden-sm\">Job Title</th>\n            <th>Applied?</th>\n            <th class=\"hidden-xs hidden-sm\">Job Priority</th>\n            <th>View Record</th>\n          </tr>\n        </thead>\n        <tbody>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.jobs : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "        </tbody>\n      </table>\n    </div>\n  <!-- </div> -->\n\n  <!-- <div class=\"row\"> -->\n    <!-- <div class=\"col-lg-10 col-lg-offset-1 col-xs-12 col-xs-offset-0 job-pending-priority-container\"> -->\n      <div class=\"col-xs-12 col-sm-6 job-pending-priority-container\">\n\n    </div>\n  </div>\n\n  <!-- <div class=\"job-pending-priority-container\"></div> -->\n  <div class=\"row\">\n    <div class=\"col-xs-12\"><p class=\"all-jobs-empty\"></p></div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <div class=\"dashboard-container\">\n        <button id=\"dashboard-new-job-btn\" type=\"button\" class=\"btn btn-success\">Create Job</button>\n      </div>\n    </div>\n  </div>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "      <tr>\n        <td class=\"display-company-name\">\n          "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_name : stack1), depth0))
	    + "\n        </td>\n        <td class=\"display-job-title hidden-xs hidden-sm\">\n          "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.title : stack1), depth0))
	    + "\n        </td>\n        <td class=\"hidden-xs hidden-sm\">\n"
	    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = blockParams[0][0]) != null ? stack1.applied : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams),"inverse":container.program(4, data, 0, blockParams),"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "        </td>\n        <td>\n          "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.priority_num : stack1), depth0))
	    + "\n        </td>\n        <td>\n          <button type=\"button\" class=\"btn btn-default btn-sm dashboard-job-record-btn\" data-current-job-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\">View</button>\n        </td>\n      </tr>\n";
	},"2":function(container,depth0,helpers,partials,data) {
	    return "            Yes\n";
	},"4":function(container,depth0,helpers,partials,data) {
	    return "            No\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<h3>Incomplete Applications</h3>\n\n<table class=\"table job-summary-table\">\n  <thead>\n    <tr>\n      <th>Company Name</th>\n      <th class=\"hidden-xs hidden-sm\">Job Title</th>\n      <th class=\"hidden-xs hidden-sm\">Applied?</th>\n      <th>Job Priority</th>\n      <th>View Record</th>\n    </tr>\n  </thead>\n  <tbody>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.jobs : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "  </tbody>\n</table>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data) {
	    return "<span class=\"green\">Applied</span>";
	},"3":function(container,depth0,helpers,partials,data) {
	    return "<span class=\"red\">Incomplete</span>";
	},"5":function(container,depth0,helpers,partials,data) {
	    var stack1;

	  return "          <tr>\n            <td>Application Submission Date</td>\n            <td>"
	    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.date_applied : stack1), depth0))
	    + "</td>\n          </tr>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=container.lambda, alias3=container.escapeExpression;

	  return "<div class=\"row\">\n  <div class=\"col-sm-4 col-sm-offset-1 col-xs-12 col-xs-offset-0\">\n    <h1>Job Details</h1>\n  </div>\n  <div class=\"col-sm-5 col-xs-12 col-xs-offset-0\">\n    <h1>Status: "
	    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.applied : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
	    + "</h1>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-xs-12 col-xs-offset-0 col-sm-9\">\n    <table class=\"table job-record-table\">\n      <tbody>\n        <tr>\n          <td class=\"job-record-company-name\">\n            Company Name:\n          </td>\n          <td>\n            "
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.company_name : stack1), depth0))
	    + "\n          </td>\n        </tr>\n        <tr>\n          <td class=\"job-record-title\">\n            Job Title:\n          </td>\n          <td>\n            "
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.title : stack1), depth0))
	    + "\n          </td>\n        </tr>\n        <tr>\n          <td>Application Priority</td>\n          <td>"
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.priority_num : stack1), depth0))
	    + "</td>\n        </tr>\n"
	    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.applied : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + "\n        <tr>\n          <tr>\n            <td>\n              Deadline:\n            </td>\n            <td class=\"format-date\">\n              "
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.deadline : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td>\n              Salary:\n            </td>\n            <td>\n              "
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.salary : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td>\n              Posting Date\n            </td>\n            <td class=\"format-date\">\n              "
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.posting_date : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td>\n              Job Post Url\n            </td>\n            <td>\n              <p class=\"display-empty-p\"></p>\n              <a class=\"display-url\" href=\""
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.post_url : stack1), depth0))
	    + "\" target=\"_blank\"></a>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"underline\">Job Description</p>\n              <p class=\"maintain-spacing\">"
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.job_description : stack1), depth0))
	    + "</p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"underline\">Responsibilities</p>\n              <p class=\"maintain-spacing\">"
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.responsibility : stack1), depth0))
	    + "</p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"underline\">Requirements</p>\n              <p class=\"maintain-spacing\">"
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.requirement : stack1), depth0))
	    + "</p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"underline\">Notes</p>\n              <p class=\"maintain-spacing\">"
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.note : stack1), depth0))
	    + "</p>\n            </td>\n          </tr>\n      </tbody>\n    </table>\n  </div>\n</div>\n\n<div class=\"row\">\n  <div class=\"col-xs-12 col-xs-offset-0 col-sm-9\">\n    <div class=\"job-record-btn-options center\">\n      <button type=\"button\" class=\"btn btn-default current get-jobs-back-btn\">Back</button>\n      <button id=\"job-record-btn-edit\" type=\"button\" class=\"btn btn-warning current\" data-current-job-id=\""
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-company-id=\""
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.company_ref_id : stack1), depth0))
	    + "\" data-current-job-id=\""
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-document-id=\""
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.document_ref_id : stack1), depth0))
	    + "\">Edit Job Record</button>\n      <button id=\"job-record-delete-menu\" type=\"button\" class=\"btn btn-danger current\" data-current-job-id=\""
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\">Delete Job Record</button>\n      <br><br>\n    </div>\n    <div class=\"delete-confirmation-contain\">\n      <div class=\"form-group delete-confirmation\">\n        <h3><span class=\"red-color\">Warning: </span>Deleting this job record will also remove all linked records (e.g. linked contacts, linked reminders, etc.). Would you like to continue?</h3>\n        <!-- <p>Deleting this job record will also remove all linked records (e.g. linked contacts, linked reminders, etc.)</p> -->\n        <button id=\"job-record-delete\" type=\"button\" class=\"btn btn-danger current\" data-current-job-id=\""
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\">Delete All</button>\n        <button id=\"job-delete-cancel\" type=\"button\" class=\"btn btn-primary current\" data-current-job-id=\""
	    + alias3(alias2(((stack1 = (depth0 != null ? depth0.job : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\">Cancel</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class=\"row\">\n  <div class=\"col-xs-12 col-sm-6\">\n    <div class=\"reminders-summary-table-container\"></div>\n    <div class=\"reminders-empty-message\"></div>\n  </div>\n  <div class=\"col-xs-12 col-sm-6\">\n    <div class=\"communications-summary-table-container\"></div>\n    <div class=\"communications-empty-message\"></div>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-xs-12 col-sm-6\">\n    <div class=\"contacts-summary-table-container\"></div>\n    <div class=\"contacts-empty-message\"></div>\n  </div>\n  <div class=\"col-xs-12 col-sm-6\">\n    <div class=\"documents-summary-table-container\"></div>\n    <div class=\"documents-empty-message\"></div>\n  </div>\n</div>\n";
	},"useData":true});

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    return "<div class=\"create-job-form-container form-container form-group job-page group-category\">\n  <h1>Create a Job</h1>\n\n  <form class=\"form job-form\" id=\"new-job-form\" name=\"new-job-form\">\n    <fieldset>\n\n      <p id=\"create-job-error\" class=\"warning form-error\"></p>\n      <p>All fields are <u>optional</u> unless otherwise indicated</p>\n\n      <div class=\"form-group\">\n        <label>Company Name (required)</label>\n        <input class=\"form-control text-input\" name=\"job[company_name]\" placeholder=\"Company Name\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Title (required)</label>\n        <input id=\"job-date-create-field\" class=\"form-control text-input\" name=\"job[title]\" placeholder=\"Job Title\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Posting Date</label>\n        <input name=\"job[posting_date]\" class=\"form-control format-date\" placeholder=\"Posting Date\" type=\"date\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Post Url</label>\n        <input name=\"job[post_url]\" class=\"form-control\" placeholder=\"Job Post Link\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Salary</label>\n        <input id=\"interval-number-entry\" class=\"form-control text-input\" name=\"job[salary]\" placeholder=\"Job Salary\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Description</label>\n        <textarea id=\"job-description-input\" class=\"create-textarea text-input form-control field-input note-input\" name=\"job[job_description]\" placeholder=\"Job Description\" type=\"textarea\"></textarea>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Responsibilities</label>\n        <textarea id=\"job-responsibilities-input\" class=\"create-textarea text-input form-control field-input note-input\" name=\"job[responsibility]\" placeholder=\"Job Responsibilities\" type=\"textarea\"></textarea>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Requirements</label>\n        <textarea id=\"job-requirement-input\" class=\"create-textarea text-input form-control field-input note-input\" name=\"job[requirement]\" placeholder=\"Job Requirements\" type=\"textarea\"></textarea>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Deadline</label>\n        <input name=\"job[deadline]\" class=\"form-control format-date\" placeholder=\"Deadline\" type=\"date\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Notes</label>\n        <textarea id=\"job-notes-input\" class=\"create-textarea text-input form-control field-input note-input\" name=\"job[note]\" placeholder=\"Job Notes\" type=\"textarea\"></textarea>\n      </div>\n\n      <div class=\"job-create-link-container form-group\">\n        <label>Have you applied to the job?</label>\n        <div class=\"form-group\">\n          <span>Check Box for Yes</span>\n          <input id=\"job-applied-checkbox\" name=\"job[applied]\" placeholder=\"applied\" type=\"checkbox\" value=\"\">\n        </div>\n        <div class=\"form-group job-applied-date-container\">\n          <input id=\"job-applied-date-field\" name=\"job[date_applied]\" class=\"form-control\" placeholder=\"Application Date\" type=\"date\" data-attr-update-form=\"0\">\n        </div>\n      </div>\n\n      <div class=\"job-auto-reminder-container\">\n        <label>Would you like to add a default reminder for this job?</label>\n        <div class=\"form-group\">\n          <span>Check Box for Yes</span>\n          <input id=\"default-reminder-input\" placeholder=\"default-reminder\" type=\"checkbox\" value=\"\">\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Application Priority Scale</label>\n        <label>1 being the highest priority</label>\n        <select class=\"form-control\" name=\"job[priority_num]\" id=\"job-priority-select\">\n          <option>1</option>\n          <option>2</option>\n          <option>3</option>\n          <option>4</option>\n          <option>5</option>\n        </select>\n      </div>\n\n      <div class=\"form-group\">\n        <input class=\"btn btn-success submit-btn current\" name=\"submit\" id=\"create-job-btn\" type=\"submit\" value=\"Submit\">\n        <input class=\"btn btn-danger submit-btn current get-jobs-back-btn\" name=\"submit\" type=\"button\" value=\"Cancel\">\n      </div>\n    </fieldset>\n  </form>\n</div>\n";
	},"useData":true});

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var summaryApi = __webpack_require__(47);
	var summaryUi = __webpack_require__(48);
	var store = __webpack_require__(9);

	var initiateJobSummaryTables = function initiateJobSummaryTables(jobId) {
	  store.masterJobId = jobId;
	  summaryApi.getReminders().done(summaryUi.remindersSummarySuccess).fail(summaryUi.summaryFailure);
	  summaryApi.getDocuments().done(summaryUi.documentsSummarySuccess).fail(summaryUi.summaryFailure);
	  summaryApi.getContacts().done(summaryUi.contactsSummarySuccess).fail(summaryUi.summaryFailure);
	  summaryApi.getCommunications().done(summaryUi.communicationsSummarySuccess).fail(summaryUi.summaryFailure);
	};

	var removeDuplicateRows = function removeDuplicateRows($table) {
	  function getVisibleRowText($row) {
	    return $row.find('td:visible').text().toLowerCase();
	  }

	  $table.find('tr').each(function (index, row) {
	    var $row = $(row);
	    $row.nextAll('tr').each(function (index, next) {
	      var $next = $(next);
	      if (getVisibleRowText($next) === getVisibleRowText($row)) {
	        $next.remove();
	      }
	    });
	  });
	};

	module.exports = {
	  removeDuplicateRows: removeDuplicateRows,
	  initiateJobSummaryTables: initiateJobSummaryTables
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var config = __webpack_require__(6);
	var store = __webpack_require__(9);

	// Jobs API

	var getCommunications = function getCommunications() {
	  return $.ajax({
	    url: config.apiOrigin + '/communications/',
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var getContacts = function getContacts() {
	  return $.ajax({
	    url: config.apiOrigin + '/contacts/',
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var getDocuments = function getDocuments() {
	  return $.ajax({
	    url: config.apiOrigin + '/documents/',
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	var getReminders = function getReminders() {
	  return $.ajax({
	    url: config.apiOrigin + '/reminders/',
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + store.user.token
	    }
	  });
	};

	module.exports = {
	  getReminders: getReminders,
	  getDocuments: getDocuments,
	  getContacts: getContacts,
	  getCommunications: getCommunications
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var store = __webpack_require__(9);
	var logic = __webpack_require__(16);
	var displayRemindersSummary = __webpack_require__(49);
	var displayDocumentsSummary = __webpack_require__(50);
	var displayContactsSummary = __webpack_require__(51);
	var displayCommunicationsSummary = __webpack_require__(52);

	var summaryFailure = function summaryFailure() {
	  $(".failure-alert").text("An error has occured. Please try again");
	};

	var remindersSummarySuccess = function remindersSummarySuccess(data) {
	  var jobId = parseInt(store.masterJobId);

	  var reminderSummaryObject = {
	    reminders: []
	  };

	  var returnedData = data.reminders;
	  for (var i = 0; i < returnedData.length; i++) {
	    var jobIdForArray = returnedData[i].job_ref_id;
	    if (jobIdForArray === jobId) {
	      reminderSummaryObject.reminders.push(returnedData[i]);
	    }
	  }

	  var newObjectLength = reminderSummaryObject.reminders.length;

	  if (newObjectLength > 0) {
	    var remindersSummaryTable = displayRemindersSummary({
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

	var documentsSummarySuccess = function documentsSummarySuccess(data) {
	  var jobId = parseInt(store.masterJobId);

	  var reminderSummaryObject = {
	    documents: []
	  };

	  var returnedData = data.documents;
	  for (var i = 0; i < returnedData.length; i++) {
	    var jobIdForArray = returnedData[i].job_ref_id;
	    if (jobIdForArray === jobId) {
	      reminderSummaryObject.documents.push(returnedData[i]);
	    }
	  }

	  var newObjectLength = reminderSummaryObject.documents.length;

	  if (newObjectLength > 0) {
	    var documentsSummaryTable = displayDocumentsSummary({
	      documents: reminderSummaryObject.documents
	    });
	    $(".documents-summary-table-container").append(documentsSummaryTable);
	  } else {
	    $(".documents-summary-table-container").remove();
	    $(".documents-empty-message").append("<h3>Linked Documents</h3>");
	    $(".documents-empty-message").append("<p>There are no documents linked to this company.</p>");
	  }
	};

	var contactsSummarySuccess = function contactsSummarySuccess(data) {
	  var jobId = parseInt(store.masterJobId);

	  var reminderSummaryObject = {
	    contacts: []
	  };

	  var returnedData = data.contacts;
	  for (var i = 0; i < returnedData.length; i++) {
	    var jobIdForArray = returnedData[i].job_ref_id;
	    if (jobIdForArray === jobId) {
	      reminderSummaryObject.contacts.push(returnedData[i]);
	    }
	  }

	  var newObjectLength = reminderSummaryObject.contacts.length;

	  if (newObjectLength > 0) {
	    var contactsSummaryTable = displayContactsSummary({
	      contacts: reminderSummaryObject.contacts
	    });
	    $(".contacts-summary-table-container").append(contactsSummaryTable);
	  } else {
	    $(".contacts-summary-table-container").remove();
	    $(".contacts-empty-message").append("<h3>Linked Contacts</h3>");
	    $(".contacts-empty-message").append("<p>There are no contacts linked to this company.</p>");
	  }
	};

	var communicationsSummarySuccess = function communicationsSummarySuccess(data) {
	  var jobId = parseInt(store.masterJobId);

	  var reminderSummaryObject = {
	    communications: []
	  };

	  var returnedData = data.communications;
	  for (var i = 0; i < returnedData.length; i++) {
	    var jobIdForArray = returnedData[i].job_ref_id;
	    if (jobIdForArray === jobId) {
	      reminderSummaryObject.communications.push(returnedData[i]);
	    }
	  }

	  var newObjectLength = reminderSummaryObject.communications.length;

	  if (newObjectLength > 0) {
	    var communicationsSummaryTable = displayCommunicationsSummary({
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
	  remindersSummarySuccess: remindersSummarySuccess,
	  documentsSummarySuccess: documentsSummarySuccess,
	  summaryFailure: summaryFailure,
	  contactsSummarySuccess: contactsSummarySuccess,
	  communicationsSummarySuccess: communicationsSummarySuccess
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "      <tr>\n        <td class=\"display-reminder-full-name\">\n          "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.reminder_type : stack1), depth0))
	    + "\n        </td>\n        <td class=\"display-reminder-full-name\">\n          "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.reminder_subject : stack1), depth0))
	    + "\n        </td>\n        <td class=\"display-reminder-submit\">\n          <button type=\"button\" class=\"btn btn-info btn-sm view-secondary-btn view-reminder-record-btn\" data-current-reminder-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-job-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-job-text=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">View</button>\n        </td>\n      </tr>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<h3>Linked Reminders</h3>\n\n<table class=\"table secondary-table table-hover job-exists-show\">\n  <thead>\n    <tr>\n      <th>Reminder Type</th>\n      <th>Reminder Subject</th>\n      <th>View Record</th>\n    </tr>\n  </thead>\n  <tbody>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.reminders : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "  </tbody>\n</table>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "      <tr>\n        <td class=\"display-document-doctype\">\n          "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.doctype : stack1), depth0))
	    + "\n        </td>\n        <td class=\"display-document-full-name\">\n          "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.docsubject : stack1), depth0))
	    + "\n        </td>\n        <td class=\"display-document-submit\">\n          <button type=\"button\" class=\"btn btn-info btn-sm view-secondary-btn dashboard-document-record-btn\" data-current-document-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-job-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-job-text=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">View</button>\n        </td>\n      </tr>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<h3>Linked Documents</h3>\n\n<table class=\"table secondary-table table-hover\">\n  <thead>\n    <tr>\n      <th>Document Type</th>\n      <th>Document Subject</th>\n      <th>View Record</th>\n    </tr>\n  </thead>\n  <tbody>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.documents : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "  </tbody>\n</table>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "      <tr>\n        <td class=\"display-contact-doctype\">\n          "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.full_name : stack1), depth0))
	    + "\n        </td>\n        <td class=\"display-contact-full-name\">\n          "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.email : stack1), depth0))
	    + "\n        </td>\n        <td class=\"display-contact-submit\">\n          <button type=\"button\" class=\"btn btn-info btn-sm view-secondary-btn dashboard-contact-record-btn\" data-current-contact-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-job-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-job-text=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">View</button>\n        </td>\n      </tr>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<h3>Linked Contacts</h3>\n\n<table class=\"table summary-table table-hover job-exists-show\">\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Email</th>\n      <th>View Record</th>\n    </tr>\n  </thead>\n  <tbody>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.contacts : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "  </tbody>\n</table>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "      <tr>\n        <td class=\"display-communication-full-name\">\n          "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.c_method : stack1), depth0))
	    + "\n        </td>\n        <td class=\"display-communication-full-name\">\n          "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.c_subject : stack1), depth0))
	    + "\n        </td>\n        <td class=\"display-communication-submit\">\n          <button type=\"button\" class=\"btn btn-info btn-sm view-secondary-btn dashboard-communication-record-btn\" data-current-communication-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-job-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-job-text=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">View</button>\n        </td>\n      </tr>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<h3>Linked Communications</h3>\n\n<table class=\"table secondary-table table-hover\">\n  <thead>\n    <tr>\n      <th>Communication Method</th>\n      <th>Communication Subject</th>\n      <th>View Record</th>\n    </tr>\n  </thead>\n  <tbody>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.communications : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "  </tbody>\n</table>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict';

	var sortPendingByPriority = function sortPendingByPriority(data) {

	  // console.log(data);

	  var oneArr = [];
	  var twoArr = [];
	  var threeArr = [];
	  var fourArr = [];
	  var fiveArr = [];
	  // let completeArr = [];

	  var currentData = data.jobs;

	  for (var i = 0; i < currentData.length; i++) {
	    if (currentData[i].priority_num === 1) {
	      oneArr.push(currentData[i]);
	    } else if (currentData[i].priority_num === 2) {
	      twoArr.push(currentData[i]);
	    } else if (currentData[i].priority_num === 3) {
	      threeArr.push(currentData[i]);
	    } else if (currentData[i].priority_num === 4) {
	      fourArr.push(currentData[i]);
	    } else if (currentData[i].priority_num === 5) {
	      fiveArr.push(currentData[i]);
	    }
	  }

	  var emptyJobObject = {
	    jobs: []
	  };

	  var objectVar = emptyJobObject.jobs;

	  if (oneArr.length > 0) {
	    objectVar.push(oneArr[0]);
	  }

	  if (twoArr.length > 0) {
	    objectVar.push(twoArr[0]);
	  }

	  if (threeArr.length > 0) {
	    objectVar.push(threeArr[0]);
	  }

	  if (fourArr.length > 0) {
	    objectVar.push(fourArr[0]);
	  }

	  if (fiveArr.length > 0) {
	    objectVar.push(fiveArr[0]);
	  }

	  return emptyJobObject;
	};

	var removeAppliedJobs = function removeAppliedJobs(data) {

	  // console.log(data);

	  var currentJobData = data.jobs;

	  var emptyArr = [];

	  for (var i = 0; i < currentJobData.length; i++) {
	    if (!currentJobData[i].applied) {
	      emptyArr.push(currentJobData[i]);
	    }
	  }

	  var emptyJobObject = {
	    jobs: emptyArr
	  };

	  var oneArr = [];
	  var twoArr = [];
	  var threeArr = [];
	  var fourArr = [];
	  var fiveArr = [];
	  // let completeArr = [];

	  var currentData = emptyJobObject.jobs;

	  for (var _i = 0; _i < currentData.length; _i++) {
	    if (currentData[_i].priority_num === 1) {
	      oneArr.push(currentData[_i]);
	    } else if (currentData[_i].priority_num === 2) {
	      twoArr.push(currentData[_i]);
	    } else if (currentData[_i].priority_num === 3) {
	      threeArr.push(currentData[_i]);
	    } else if (currentData[_i].priority_num === 4) {
	      fourArr.push(currentData[_i]);
	    } else if (currentData[_i].priority_num === 5) {
	      fiveArr.push(currentData[_i]);
	    }
	  }

	  var finalArr = [];
	  finalArr.push(oneArr);
	  finalArr.push(twoArr);
	  finalArr.push(threeArr);
	  finalArr.push(fourArr);
	  finalArr.push(fiveArr);

	  var merged = [].concat.apply([], finalArr);

	  data = {
	    jobs: merged
	  };

	  return data;
	};

	module.exports = {
	  sortPendingByPriority: sortPendingByPriority,
	  removeAppliedJobs: removeAppliedJobs
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var remindersApi = __webpack_require__(37);
	var remindersUi = __webpack_require__(55);
	var getFormFields = __webpack_require__(38);
	var store = __webpack_require__(9);
	var linkLogic = __webpack_require__(62);
	var logic = __webpack_require__(16);

	// Reminder EVENTS

	var onGetReminders = function onGetReminders(event) {
	  event.preventDefault();
	  var screenWidth = window.innerWidth;
	  if (screenWidth < 768) {
	    $(".nav-mobile-ul").slideUp();
	  }
	  remindersApi.getReminders().done(remindersUi.getReminderSuccess).fail(remindersUi.getReminderFailure);
	};

	var onShowReminderRecord = function onShowReminderRecord(event) {
	  event.preventDefault();
	  store.currentReminderId = $(this).attr("data-current-reminder-id");
	  remindersApi.showReminder().done(remindersUi.showReminderRecordSuccess).fail(remindersUi.showReminderRecordFailure);
	};

	var onEditReminder = function onEditReminder(event) {
	  event.preventDefault();
	  store.currentReminderId = $(this).attr("data-current-reminder-id");
	  store.currentJobRefId = $(this).attr("data-current-job-ref-id");
	  store.currentJobRefText = $(this).attr("data-current-job-ref-text");
	  store.currentReminderType = $(this).attr("data-current-reminder-type");

	  var formCategory = "reminder";
	  var listCategory = "job";
	  remindersUi.generateUpdateForm(listCategory, formCategory);
	};

	var onCreateReminder = function onCreateReminder(event) {
	  event.preventDefault();
	  logic.convertPercentage();
	  var data = getFormFields(event.target);

	  var listCategory = "job";

	  var submitValue = linkLogic.obtainOptionVal(listCategory);
	  data.reminder.job_ref_id = parseInt(submitValue);

	  var submitText = linkLogic.obtainOptionText(listCategory);
	  data.reminder.job_ref_text = submitText;

	  if (submitValue === -1) {
	    data.reminder.job_ref_id = 0;
	    data.reminder.job_ref_text = "";
	  }

	  data.reminder.reminder_type = $("#reminder-type-select").val();
	  data.reminder.reminder_details = $("#reminder-details-field").val();

	  store.createReminderData = data;
	  store.lastShowReminderData = data;
	  remindersApi.createReminder(data).done(remindersUi.createReminderSuccess).fail(remindersUi.createReminderFailure);
	};

	var onDeleteReminder = function onDeleteReminder(event) {
	  event.preventDefault();
	  store.currentReminderId = $("#reminder-record-delete").attr("data-current-reminder-id");
	  remindersApi.deleteReminder(store.currentReminderId).done(remindersUi.deleteReminderSuccess).fail(remindersUi.deleteReminderFailure);
	};

	var onUpdateReminder = function onUpdateReminder(event) {
	  event.preventDefault();
	  logic.convertPercentage();
	  var data = getFormFields(event.target);

	  var prevJobRefId = store.currentJobRefId;
	  var prevJobRefText = store.currentJobRefText;
	  var isRefBeingUpdated = $("#job-update-link").prop("checked");
	  var isRadioNoChecked = $("#job-radio-no").prop("checked");
	  var isRadioYesChecked = $("#job-radio-yes").prop("checked");
	  var isEitherRadioChecked = $("#job-radio-no").prop("checked") || $("#job-radio-yes").prop("checked");

	  if (isRefBeingUpdated) {

	    if (isEitherRadioChecked) {
	      if (isRadioNoChecked) {
	        if ($("#alt-input-entry-job").val() === "") {
	          data.reminder.job_ref_text = prevJobRefText;
	          data.reminder.job_ref_id = prevJobRefId;
	        } else {
	          data.reminder.job_ref_text = $("#alt-input-entry-job").val();
	          data.reminder.job_ref_id = 0;
	        }
	      } else if (isRadioYesChecked) {
	        var jobRefIdSelected = parseInt($("#select-element-job").val());
	        if (jobRefIdSelected === -1) {
	          data.reminder.job_ref_id = prevJobRefId;
	          data.reminder.job_ref_text = prevJobRefText;
	        } else {
	          var _jobRefIdSelected = $("#select-element-job").val();
	          var textValueSelectDiv = "#select-element-job option[value=" + _jobRefIdSelected + "]";
	          data.reminder.job_ref_id = _jobRefIdSelected;
	          data.reminder.job_ref_text = $(textValueSelectDiv).text();
	        }
	      }
	    } else {
	      data.reminder.job_ref_text = prevJobRefText;
	      data.reminder.job_ref_id = prevJobRefId;
	    }
	  } else {
	    data.reminder.job_ref_text = prevJobRefText;
	    data.reminder.job_ref_id = prevJobRefId;
	  }

	  if (data.reminder.job_ref_text === "Click to Select") {
	    data.reminder.job_ref_text = prevJobRefText;
	    data.reminder.job_ref_id = prevJobRefId;
	  }

	  data.reminder.reminder_type = $("#reminder-type-select").val();
	  data.reminder.reminder_details = $("#reminder-details-field").val();
	  store.createReminderData = data;
	  store.lastShowReminderData = data;

	  remindersApi.updateReminder(data).done(remindersUi.updateReminderSuccess).fail(remindersUi.updateReminderFailure);
	};

	var onShowReminderCreateForm = function onShowReminderCreateForm(event) {
	  event.preventDefault();
	  remindersUi.showReminderCreateForm();
	};

	var onDisplayJobDropdown = function onDisplayJobDropdown(event) {
	  event.preventDefault();
	  var formCategory = "reminder";
	  var listCategory = "job";

	  var linkContainerSelect = ".display-dropdown-" + listCategory;

	  var altFormContainer = ".display-alt-" + listCategory;
	  var selectVal = parseInt($(this).val());

	  if (selectVal === 1) {
	    $(altFormContainer).children().remove();
	    linkLogic.showDropOptionsCreatePage(formCategory, listCategory);
	  } else {
	    $(linkContainerSelect).children().remove();
	    linkLogic.altOptionAppend(formCategory, listCategory);
	  }
	};

	var onHideShowCreateOptions = function onHideShowCreateOptions() {
	  var isUpdateChecked = $(this).prop("checked");
	  if (isUpdateChecked) {
	    $("#job-radio-btns-container input").prop("checked", false);
	    $("#job-category-radio-container").show();
	  } else {
	    $("#job-radio-btns-container input").prop("checked", false);
	    $("#contact-ref-text-alt-job-container").remove();
	    $(".display-dropdown-job").children().remove();
	    $("#job-category-radio-container").hide();
	  }
	};

	var onHideShowUpdateOptions = function onHideShowUpdateOptions() {
	  var isUpdateChecked = $(this).prop("checked");
	  var radioButtonContainer = $(this).parent().parent().parent().children(".update-radio-container-btn");
	  if (isUpdateChecked) {
	    $(".job-radio-container input").prop("checked", false);
	    $(radioButtonContainer).show();
	  } else {
	    $(".job-radio-container input").prop("checked", false);
	    $("#reminder-ref-text-alt-job-container").remove();
	    $(".display-dropdown-job").children().remove();
	    $(radioButtonContainer).hide();
	  }
	};

	var resizeTextArea = function resizeTextArea() {
	  var divId = $(this).attr("id");
	  logic.onResizeTextarea(divId);
	};

	var addHandlers = function addHandlers() {
	  $('.content').on('submit', '#new-reminder-form', onCreateReminder);
	  $('.content').on('submit', '#update-reminder-form', onUpdateReminder);
	  $('.content').on('click', '#reminder-record-btn-edit', onEditReminder);
	  $('.content').on('click', '#generate-create-reminder-btn', onShowReminderCreateForm);
	  $('.content').on('click', '#generate-create-reminder-overdue-btn', onShowReminderCreateForm);
	  $('.content').on('click', '.view-reminder-record-btn', onShowReminderRecord);
	  $('#get-reminders-btn').on('click', onGetReminders);
	  $('.content').on('click', '#reminder-record-delete', onDeleteReminder);
	  $('.content').on('click', '.get-reminders', onGetReminders);
	  $('.content').on('change', "#job-update-link", onHideShowUpdateOptions);
	  $('.content').on('change', '.update-job', onDisplayJobDropdown);
	  $('.content').on('change', "#job-create-link", onHideShowCreateOptions);
	  $('.content').on('click', '.back-to-reminders', onGetReminders);
	  $('.content').on('keyup', '#reminder-details-field', resizeTextArea);
	};

	module.exports = {
	  addHandlers: addHandlers
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var store = __webpack_require__(9);
	var displayEditReminder = __webpack_require__(56);
	var displayReminderDashboard = __webpack_require__(57);
	var displayReminderDetails = __webpack_require__(58);
	var displayReminderCreateForm = __webpack_require__(59);
	var remindersApi = __webpack_require__(37);
	var displayRadioButtonsTemplate = __webpack_require__(60);
	var displayReminderOptions = __webpack_require__(61);
	var linkLogic = __webpack_require__(62);
	var logic = __webpack_require__(16);

	var getReminderSuccess = function getReminderSuccess(data) {
	  $(".notification-container").children().text("");
	  store.reminderDataForEdit = data;

	  $(".content").children().remove();

	  var remindersArr = data.reminders;

	  for (var i = 0; i < remindersArr.length; i++) {
	    var unavailable = "N/A";
	    var currArrayRefText = remindersArr[i].job_ref_text;
	    var currArrayReminderDate = remindersArr[i].reminder_date;
	    var currArrayReminderDetails = remindersArr[i].reminder_details;

	    if (currArrayRefText === "" || currArrayRefText === null) {
	      remindersArr[i].job_ref_text = unavailable;
	    }
	    if (currArrayReminderDate === "" || currArrayReminderDate === null) {
	      remindersArr[i].reminder_date = unavailable;
	    }
	    if (currArrayReminderDetails === "" || currArrayReminderDetails === null) {
	      remindersArr[i].reminder_details = unavailable;
	    }
	  }

	  var reminderDashboard = displayReminderDashboard({
	    reminders: data.reminders
	  });

	  $('.content').append(reminderDashboard);

	  var allRemindersEmptyLength = $("#reminder-summary-table tbody").children().length;

	  if (allRemindersEmptyLength === 0) {
	    $("#reminder-summary-table").remove();
	    $(".all-reminders-empty").text('There are no reminders associated with your account. Click "Create Reminder" to get started.');
	  }

	  logic.dateFormatByClass();
	};

	var showReminderRecordSuccess = function showReminderRecordSuccess(data) {
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  store.lastShowReminderData = data;
	  // data.reminder.reminder_date = logic.formatDate(data.reminder.reminder_date)

	  var reminderDetails = displayReminderDetails({
	    reminder: data.reminder
	  });
	  $('.content').append(reminderDetails);
	  logic.dateFormatByClass();
	};

	var showReminderRecordFailure = function showReminderRecordFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be retrieved");
	};

	var showReminderCreateForm = function showReminderCreateForm() {
	  var listCategory = "job";
	  var formCategory = "reminder";

	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  var showCreateReminderForm = displayReminderCreateForm();
	  $('.content').append(showCreateReminderForm);

	  var radioTemplate = displayRadioButtonsTemplate();
	  $("#" + listCategory + "-category-radio-container").append(radioTemplate);

	  linkLogic.radioClassIdNameGen(formCategory, listCategory);
	  $("#job-category-radio-container").hide();
	  var defaultDate = logic.defaultDate();
	  $(".default-date").val(defaultDate);
	};

	var generateUpdateForm = function generateUpdateForm(listCategory, formCategory) {
	  $(".notification-container").children().text("");
	  $(".content").children().remove();

	  var data = store.lastShowReminderData;

	  var editReminder = displayEditReminder({
	    reminder: data.reminder
	  });
	  $('.content').append(editReminder);

	  var listLinkStatusSelector = "." + listCategory + "-tag-status";
	  var listRefId = parseInt(store.currentJobRefId);

	  if (listRefId > 0) {
	    $(listLinkStatusSelector).text("Linked");
	  }

	  var updateFormId = "#update-" + formCategory + "-form";
	  var updateFormStatus = parseInt($(updateFormId).attr("data-update-form"));

	  if (updateFormStatus === 1) {
	    var categoryText = "." + listCategory + "-radio-container ";
	    $(categoryText).show();
	    $(".update-radio-container-btn").hide();
	  }

	  var currentRefTextValTxt = "." + listCategory + "-update-radio-text";

	  if (store.currentJobRefText === "") {
	    $(currentRefTextValTxt).text("N/A");
	  }

	  var preselectVal = store.currentReminderType;
	  var preselectDiv = "#reminder-type-select";
	  linkLogic.preselectDefault(preselectDiv, preselectVal);

	  var divId = "#reminder-details-field";
	  logic.textAreaHeightUpdate(divId);
	};

	var getReminderFailure = function getReminderFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the records could not be retrieved");
	};

	var createReminderSuccess = function createReminderSuccess(data) {
	  store.currentReminderId = data.reminder.id;
	  $(".form-error").text("");
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  $(".success-alert").text("Reminder Has Been Successfully Created");

	  var showReminderDetails = displayReminderDetails({
	    reminder: data.reminder
	  });

	  $(".content").append(showReminderDetails);
	  $("#reminder-record-btn-edit").attr("data-current-reminder-type", data.reminder.reminder_type);
	  $(".current").attr("data-current-reminder-id", store.currentReminderId);
	  logic.dateFormatByClass();
	};

	var deleteReminderSuccess = function deleteReminderSuccess() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be deleted.");
	  logic.dateFormatByClass();
	  remindersApi.getReminders().done(getReminderSuccess).fail(getReminderFailure);
	};

	var deleteReminderFailure = function deleteReminderFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the records could not be deleted");
	};

	var updateReminderSuccess = function updateReminderSuccess(data) {

	  store.currentReminderId = data.reminder.id;
	  $(".form-error").text("");
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  $(".success-alert").text("Reminder Has Been Successfully Updated");

	  var showReminderDetails = displayReminderDetails({
	    reminder: data.reminder
	  });
	  $(".content").append(showReminderDetails);
	  $(".current").attr("data-current-reminder-id", store.currentReminderId);
	  logic.dateFormatByClass();
	};

	var displayReminderDropdownSuccess = function displayReminderDropdownSuccess(data) {
	  $(".notification-container").children().text("");

	  var companyOptionDisplay = displayReminderOptions({
	    reminders: data.reminders
	  });

	  var dataUpdateFormVal = parseInt($("#update-reminder-form").attr("data-update-form"));

	  $('.associate-reminder-with-reminder-container').append(companyOptionDisplay);

	  if (dataUpdateFormVal === 1) {
	    var currentReminderId = store.currentReminderId;
	    var valueString = '#select-option-reminder-name option[value=' + currentReminderId + ']';
	    $(valueString).prop('selected', true);
	  }
	};

	var createReminderFailure = function createReminderFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be created.  Please make sure all required fields are complete");
	};

	var updateReminderFailure = function updateReminderFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be updated.  Please make sure all required fields are complete");
	};

	module.exports = {
	  getReminderSuccess: getReminderSuccess,
	  showReminderRecordSuccess: showReminderRecordSuccess,
	  deleteReminderSuccess: deleteReminderSuccess,
	  deleteReminderFailure: deleteReminderFailure,
	  showReminderCreateForm: showReminderCreateForm,
	  getReminderFailure: getReminderFailure,
	  updateReminderSuccess: updateReminderSuccess,
	  showReminderRecordFailure: showReminderRecordFailure,
	  createReminderSuccess: createReminderSuccess,
	  displayReminderDropdownSuccess: displayReminderDropdownSuccess,
	  displayReminderOptions: displayReminderOptions,
	  generateUpdateForm: generateUpdateForm,
	  createReminderFailure: createReminderFailure,
	  updateReminderFailure: updateReminderFailure
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "<div class=\"update-reminder-form-container form-container reminder-page group-category\">\n  <form class=\"form reminder-form reminder-form\" id=\"update-reminder-form\" name=\"update-reminder-form\" data-update-form=\"1\">\n    <fieldset>\n      <legend>Update Reminder Form</legend>\n      <p id=\"update-reminder-error\" class=\"warning form-error\"></p>\n      <p>All fields are <u>optional</u> unless otherwise indicated</p>\n\n      <div class=\"form-group\">\n        <label>Reminder Type (required)</label>\n        <select class=\"form-control\" id=\"reminder-type-select\" data-reminder-type=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.reminder_type : stack1), depth0))
	    + "\" data-default-value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.reminder_type : stack1), depth0))
	    + "\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.reminder_type : stack1), depth0))
	    + "\">\n      <option class=\"form-control required-field option-one\" name=\"reminder[reminder_type]\" placeholder=\"reminder Type\" type=\"text\" value=\"Action\">Action</option>\n      <option class=\"form-control required-field option-two\" name=\"reminder[reminder_type]\" placeholder=\"reminder Type\" type=\"text\" value=\"Pending\">Pending</option>\n  </select>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Reminder Notification Date</label>\n        <input class=\"form-control field-input\" name=\"reminder[reminder_date]\" placeholder=\"Date\" type=\"date\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.reminder_date : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Reminder Subject</label>\n        <input class=\"form-control text-input required-field\" name=\"reminder[reminder_subject]\" placeholder=\"Subject\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.reminder_subject : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Reminder Details</label>\n        <textarea id=\"reminder-details-field\" class=\"form-control text-input field-input reminder-details\" name=\"reminder[reminder_details]\" type=\"text\" placeholder=\"Action Details\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.reminder_details : stack1), depth0))
	    + "</textarea>\n      </div>\n\n      <div class=\"form-group job-radio-container current-value-update-page\">\n        <label>Current Company Association:</label>\n        <div class=\"update-radio-link-value-status-container\">\n          <p>The company currently associated with this reminder is: <span class=\"job-update-radio-text\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "</span></p>\n          <p>Link Status: <span class=\"job-tag-status\" data-current-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\">Not Linked</span></p>\n        </div>\n      </div>\n\n      <div>\n        <div class=\"job-update-link-container form-group\">\n          <label>Would you like to update the reminder's company?</label>\n          <div class=\"form-group\">\n            <span>Check Box for Yes</span>\n            <input id=\"job-update-link\" type=\"checkbox\" value=\"\">\n          </div>\n        </div>\n        <div class=\"form-group job-radio-container update-radio-container-btn\">\n          <label>Will this updated company be tagged to the reminder?</label>\n          <label><input id=\"job-radio-yes\" class=\"job-category\" type=\"radio\" name=\"job-radio\" value=\"1\">Yes</label>\n          <label><input id=\"job-radio-no\" class=\"job-category\" type=\"radio\" name=\"job-radio\" value=\"0\">No</label>\n        </div>\n      </div>\n\n      <div class=\"form-group display-alt-job\"></div>\n      <div class=\"form-group display-dropdown-job\"></div>\n\n      <div class=\"form-group\">\n        <input class=\"btn btn-success submit-btn current\" name=\"submit\" id=\"submit-reminder-update-btn\" type=\"submit\" value=\"Submit\" data-current-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-ref-text=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">\n        <button type=\"button\" class=\"btn btn-danger submit-btn current back-to-reminders\">Cancel</button>\n      </div>\n    </fieldset>\n  </form>\n</div>\n";
	},"useData":true});

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "            <tr>\n              <td class=\"display-reminder-url format-date hidden-xs\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.reminder_date : stack1), depth0))
	    + "\n              </td>\n              <td class=\"display-company-name get-reminders-job-ref-text\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\n              </td>\n              <td class=\"display-reminder-name hidden-xs\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.reminder_type : stack1), depth0))
	    + "\n              </td>\n              <td class=\"display-reminder-location hidden-xs\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.reminder_subject : stack1), depth0))
	    + "\n              </td>\n              <td class=\"display-reminder-submit\">\n                <button type=\"button\" class=\"btn btn-default btn-sm view-reminder-record-btn\" data-current-reminder-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-contact-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.contact_ref_id : stack1), depth0))
	    + "\">View</button>\n              </td>\n            </tr>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <h1>Reminder Dashboard</h1>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <table id=\"reminder-summary-table\" class=\"table reminder-summary-table table-hover\">\n        <thead>\n          <tr>\n            <th class=\"hidden-xs\">\n              <div class=\"notification-date\">Notification Date</div>\n            </th>\n            <th>\n              <div class=\"company-name\">Company Name</div>\n            </th>\n            <th class=\"hidden-xs\">\n              <div class=\"th-inner sortable both desc\">Reminder Type</div>\n            </th>\n            <th class=\"hidden-xs\">\n              <div class=\"reminder-subject\">Reminder Subject</div>\n            </th>\n            <th>View Record</th>\n          </tr>\n        </thead>\n        <tbody>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.reminders : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "        </tbody>\n      </table>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12\"><p class=\"all-reminders-empty\"></p></div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <div class=\"dashboard-container\">\n        <button id=\"generate-create-reminder-btn\" type=\"button\" class=\"btn btn-success\">Create Reminder</button>\n      </div>\n    </div>\n  </div>\n</div>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "<div class=\"row\">\n  <div class=\"col-xs-12 col-xs-offset-0 col-sm-9\">\n\n    <h1>Reminder Details</h1>\n\n    <table class=\"table reminder-record-table\">\n      <tbody>\n        <tr>\n          <td class=\"reminder-record-title reminder-record-note\">\n            Reminder Notification Date:\n          </td>\n          <td class=\"format-date\">\n            "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.reminder_date : stack1), depth0))
	    + "\n          </td>\n        </tr>\n        <tr>\n          <td class=\"reminder-record-title reminder-reminder-type\">\n            Reminder Type:\n          </td>\n          <td class=\"display-reminder-type\">\n            "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.reminder_type : stack1), depth0))
	    + "\n          </td>\n        </tr>\n        <tr>\n          <td class=\"reminder-record-title reminder-archive\">\n            Linked Company:\n          </td>\n          <td class=\"linked-company display-reminder-note\" data-job-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\">\n            "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\n          </td>\n        </tr>\n        <tr>\n          <td class=\"reminder-record-title reminder-record-location\">\n            Reminder Subject:\n          </td>\n          <td class=\"display-reminder-subject\">\n            "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.reminder_subject : stack1), depth0))
	    + "\n          </td>\n        </tr>\n        <tr>\n          <td colspan=\"2\">\n            <p class=\"underline\">Reminder Details:</p>\n            <p>"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.reminder_details : stack1), depth0))
	    + "</p>\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</div>\n\n<div class=\"row\">\n  <div class=\"col-xs-12 col-xs-offset-0 col-sm-9\">\n    <div class=\"reminder-record-btn-options center\">\n      <button type=\"button\" class=\"btn btn-default current back-to-reminders\">Back</button>\n      <button id=\"reminder-record-btn-edit\" type=\"button\" class=\"btn btn-warning current\" data-current-reminder-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-job-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-job-ref-text=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\" data-current-reminder-type=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.reminder_type : stack1), depth0))
	    + "\">Edit Reminder Record</button>\n      <button id=\"reminder-record-delete\" type=\"button\" class=\"btn btn-danger current\" data-current-reminder-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.reminder : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\">Delete Reminder Record</button>\n    </div>\n  </div>\n</div>\n";
	},"useData":true});

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    return "<div class=\"create-reminder-form-container form-container form-group reminder-page group-category\">\n  <h1>Create a Reminder</h1>\n\n  <form class=\"form reminder-form\" id=\"new-reminder-form\" name=\"new-reminder-form\">\n    <fieldset>\n      <p id=\"create-reminder-error\" class=\"warning form-error\"></p>\n      <p>All fields are <u>optional</u> unless otherwise indicated</p>\n\n      <div class=\"form-group\">\n        <!-- <label>Reminder Notification Date <span class=\"clear-default-date\">&#10005;</span></label> -->\n        <label>Reminder Notification Date</label>\n        <input class=\"form-control field-input default-date\" name=\"reminder[reminder_date]\" placeholder=\"Date\" type=\"date\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Reminder Type (required)</label>\n        <select class=\"form-control\" id=\"reminder-type-select\">\n            <option class=\"form-control required-field\" name=\"reminder[reminder_type]\" placeholder=\"reminder Type\" type=\"text\" value=\"Action\">Action</option>\n            <option class=\"form-control required-field\" name=\"reminder[reminder_type]\" placeholder=\"reminder Type\" type=\"text\" value=\"Pending\">Pending</option>\n        </select>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Reminder Subject (required)</label>\n        <input class=\"form-control text-input required-field\" name=\"reminder[reminder_subject]\" placeholder=\"Subject\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Reminder Details</label>\n        <textarea id=\"reminder-details-field\" class=\"create-textarea text-input form-control field-input reminder-details\" name=\"reminder[reminder_details]\" type=\"text\" placeholder=\"Reminder Details\"></textarea>\n      </div>\n\n      <div class=\"job-create-link-container form-group\">\n        <label>Would you like to associate a company with this reminder?</label>\n        <div class=\"form-group\">\n          <span>Check Box for Yes</span>\n          <input id=\"job-create-link\" type=\"checkbox\" value=\"\">\n        </div>\n      </div>\n\n      <div id=\"job-category-radio-container\"></div>\n\n      <div class=\"display-dropdown-job\"></div>\n      <div class=\"display-alt-job\"></div>\n\n      <div class=\"form-group append-nonlink\"></div>\n      <div class=\"form-group display-jobs-dropdown\"></div>\n\n      <div class=\"form-group\">\n        <input class=\"btn btn-success submit-btn current\" name=\"submit\" id=\"create-reminder-btn\" type=\"submit\" value=\"Submit\">\n        <button type=\"button\" class=\"btn btn-danger submit-btn current back-to-reminders\">Cancel</button>\n      </div>\n    </fieldset>\n  </form>\n</div>\n";
	},"useData":true});

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    return "<div class=\"radio-group-container\">\n\n  <div class=\"form-group radio-btn-container\">\n    <label>Link this <span class=\"form-category-name\"></span> to an existing company?</label>\n    <label><input type=\"radio\" name=\"\" value=\"1\">Yes</label>\n    <label><input type=\"radio\" name=\"\" value=\"0\">No</label>\n  </div>\n\n  <div class=\"display-radio-drop\"></div>\n\n</div>\n";
	},"useData":true});

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "        <option class=\"form-control option-company-name\" name=\"reminder[reminder_ref_name]\" placeholder=\"reminder Type\" type=\"text\" data-company-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.company : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\" data-company-name=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.company : depth0)) != null ? stack1.name : stack1), depth0))
	    + "\" value=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\">"
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.full_name : stack1), depth0))
	    + "</option>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<div id=\"tag-reminder-to-communication-select\" class=\"tag-select-container\">\n  <label>Reminder Name Selection:</label>\n  <select id=\"select-option-reminder-category\" class=\"form-control select-option-value\">\n      <option class=\"form-control blank-option\" placeholder=\"Blank\" type=\"text\" value=\"0\"></option>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.reminders : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "  </select>\n</div>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var jobsApi = __webpack_require__(11);
	var store = __webpack_require__(9);
	var displayJobOptions = __webpack_require__(63);
	var displayJobContactAltOption = __webpack_require__(64);
	var displayJobCommunicationAltOption = __webpack_require__(65);

	var altOptionAppend = function altOptionAppend(formCategory, listCategory) {
	  var displayAltInput = void 0;
	  if (formCategory === "contact" && listCategory === "job") {
	    displayAltInput = displayJobContactAltOption();
	  } else if (formCategory === "communication" && listCategory === "job") {
	    displayAltInput = displayJobCommunicationAltOption();
	  }

	  $(".display-alt-job").append(displayAltInput);
	};

	var obtainOptionVal = function obtainOptionVal(listCategory) {
	  var alternativeEntrySelector = "#alt-input-entry-" + listCategory;
	  var alternativeEntryVal = $(alternativeEntrySelector).val();
	  var valueSelector = "#select-element-" + listCategory;
	  var isRadioCheckedTxt = "#" + listCategory + "-radio-btns-container input";
	  var isRadioChecked = $(isRadioCheckedTxt).prop("checked");
	  if (alternativeEntryVal === undefined) {
	    if (!isRadioChecked) {
	      return 0;
	    } else {
	      return parseInt($(valueSelector).val());
	    }
	  } else {

	    return 0;
	  }
	};

	var obtainOptionText = function obtainOptionText(listCategory) {
	  var textInputDiv = "#alt-input-entry-" + listCategory;
	  var alternativeEntrySelector = "#alt-input-entry-" + listCategory;
	  var alternativeEntryVal = $(alternativeEntrySelector).val();
	  var valueSelector = "#select-element-" + listCategory;
	  var linkValue = $(valueSelector).val();

	  if (alternativeEntryVal === undefined) {
	    var textValueSelectDiv = valueSelector + " option[value=" + linkValue + "]";
	    return $(textValueSelectDiv).text();
	  } else {
	    return $(textInputDiv).val();
	  }
	};

	var insertFailure = function insertFailure() {
	  $(".failure-alert").text("An error has occured. Please try again");
	};

	var jobDropdownDataResults = function jobDropdownDataResults(data) {
	  var listCategory = store.currentListCategory;
	  var formCategory = store.currentFormCategory;

	  var containerAppendId = "." + "display-dropdown-" + listCategory;
	  var dataDropdown = void 0;

	  if (listCategory === "job" && formCategory === "contact") {
	    dataDropdown = displayJobOptions({
	      jobs: data.jobs
	    });
	  }

	  $(containerAppendId).append(dataDropdown);
	};

	var showDropOptionsCreatePage = function showDropOptionsCreatePage(formCategory, listCategory) {
	  store.currentListCategory = listCategory;
	  store.currentFormCategory = formCategory;
	  if (listCategory === "job" && formCategory === "contact") {
	    jobsApi.getJobs().done(jobDropdownDataResults).fail(insertFailure);
	  }
	};

	var radioClassIdNameGen = function radioClassIdNameGen(formCategory, listCategory) {
	  var appendingDivIdTxt = listCategory + "-category-radio-container";
	  var appendingDivId = "#" + appendingDivIdTxt;

	  var radioGroupContainerTxt = listCategory + "-radio-group-container";

	  var radioGroupContainerSelector = appendingDivId + " .radio-group-container";

	  var radioBtnContainerTxt = listCategory + "-radio-btns-container";
	  var radioBtnContainerSelector = appendingDivId + " .radio-btn-container";

	  var formCategoryNameTxt = formCategory + "-form-category-name";
	  var formCategoryNameSelector = appendingDivId + " .form-category-name";

	  var listCategoryNameTxt = listCategory + "-list-category-name";
	  var listCategoryNameSelector = appendingDivId + " .list-category-name";

	  var radioContainerTxt = "#" + radioBtnContainerTxt;
	  var radioInputClassSelector = radioContainerTxt + " input";

	  var radioInputClassTxt = listCategory + "-category";

	  var radioNameTxt = listCategory + "-category-radio";
	  var radioNameSelector = "." + radioInputClassTxt;

	  var radioDropContainerTxt = "display-radio-drop-" + listCategory;
	  var radioDropContainerSelector = "#" + radioGroupContainerTxt + " .display-radio-drop";

	  var formCategoryNameId = "#" + formCategoryNameTxt;
	  var listCategoryNameId = "#" + listCategoryNameTxt;

	  $(radioGroupContainerSelector).attr("id", radioGroupContainerTxt);
	  $(radioBtnContainerSelector).attr("id", radioBtnContainerTxt);
	  $(formCategoryNameSelector).attr("id", formCategoryNameTxt);
	  $(formCategoryNameId).text(formCategory);
	  $(listCategoryNameSelector).attr("id", listCategoryNameTxt);
	  $(listCategoryNameId).text(listCategory);
	  $(radioInputClassSelector).addClass(radioInputClassTxt);
	  $(radioNameSelector).attr("name", radioNameTxt);
	  $(radioDropContainerSelector).attr("id", radioDropContainerTxt);
	};

	var preselectDefault = function preselectDefault(divId, defaultVal) {
	  var selectText = $(divId + ' option[value="' + defaultVal + '"]');
	  $(selectText).prop('selected', true);
	};

	module.exports = {
	  radioClassIdNameGen: radioClassIdNameGen,
	  showDropOptionsCreatePage: showDropOptionsCreatePage,
	  altOptionAppend: altOptionAppend,
	  insertFailure: insertFailure,
	  jobDropdownDataResults: jobDropdownDataResults,
	  obtainOptionVal: obtainOptionVal,
	  obtainOptionText: obtainOptionText,
	  preselectDefault: preselectDefault
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "      <option class=\"form-control option-element\" name=\"contact[job_ref_id]\" type=\"text\" data-form-category-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\" data-list-ref-text=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_name : stack1), depth0))
	    + "\" data-list-ref-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" value=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\">"
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_name : stack1), depth0))
	    + "</option>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<div id=\"contact-select-container-job\" class=\"select-container\">\n  <select id=\"select-element-job\" class=\"select-element\">\n    <option class=\"form-control blank-option\" placeholder=\"Blank\" type=\"text\" value=\"-1\">Click to Select</option>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.jobs : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "</select>\n</div>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    return "<div id=\"contact-ref-text-alt-job-container\" class=\"form-group alt-container\">\n  <label>Company Name (note: this record will not be linked)</label>\n  <input id=\"alt-input-entry-job\" class=\"form-control text-input alt-input-entry\" name=\"contact[job_ref_text]\" placeholder=\"Company Name\" type=\"text\" value=\"\">\n</div>\n";
	},"useData":true});

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    return "<div id=\"communication-ref-text-alt-job-container\" class=\"form-group alt-container\">\n  <label>Custom<span id=\"alt-label-job\" class=\"alt-label\"></span> Text</label>\n  <input id=\"alt-input-entry-job\" class=\"form-control text-input alt-input-entry\" name=\"communication[job_ref_text]\" placeholder=\"Company Name\" type=\"text\" value=\"\">\n</div>\n";
	},"useData":true});

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var remindersApi = __webpack_require__(37);
	var dashboardHomeUi = __webpack_require__(12);
	var store = __webpack_require__(9);
	var jobsApi = __webpack_require__(11);
	var jobsUi = __webpack_require__(40);
	var getFormFields = __webpack_require__(38);
	var logic = __webpack_require__(16);

	var onGetDash = function onGetDash() {
	  event.preventDefault();
	  var screenWidth = window.innerWidth;
	  if (screenWidth < 768) {
	    $(".nav-mobile-ul").slideUp();
	  }
	  remindersApi.getReminders().done(dashboardHomeUi.showRemindersApproachDashTable).fail(dashboardHomeUi.homeFailure);
	};

	var showMobileOptions = function showMobileOptions() {
	  dashboardHomeUi.showMobileOptions();
	};

	// const clearDefaultDate = function() {
	//   $(".default-date").val("");
	// };

	var showLinkedCompany = function showLinkedCompany(event) {
	  event.preventDefault();
	  store.currentJobId = parseInt($(this).attr("data-job-ref-id"));
	  jobsApi.showJob().done(jobsUi.showJobRecordSuccess).fail(jobsUi.showJobRecordFailure);
	};

	var alphabatize = function alphabatize(event) {
	  event.preventDefault();
	  var data = getFormFields(event.target);
	  var companyName = data.test.company_name.trim();
	  logic.alphabatize(companyName);
	};

	var addHandlers = function addHandlers() {
	  $('#get-dash-home-btn').on('click', onGetDash);
	  $('#nav-mobile-dropdown').on('click', showMobileOptions);
	  $('.content').on('click', '.linked-company', showLinkedCompany);
	  $('#alphabatize-form').on('submit', alphabatize);
	  // $('.content').on('click', '.clear-default-date', clearDefaultDate);
	};

	module.exports = {
	  addHandlers: addHandlers
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var documentsApi = __webpack_require__(14);
	var documentsUi = __webpack_require__(68);
	var getFormFields = __webpack_require__(38);
	var store = __webpack_require__(9);
	var linkLogic = __webpack_require__(62);
	var logic = __webpack_require__(16);

	// Document EVENTS

	var onGetDocuments = function onGetDocuments(event) {
	  event.preventDefault();
	  var screenWidth = window.innerWidth;
	  if (screenWidth < 768) {
	    $(".nav-mobile-ul").slideUp();
	  }
	  documentsApi.getDocuments().done(documentsUi.getDocumentSuccess).fail(documentsUi.getDocumentFailure);
	};

	var onShowDocumentRecord = function onShowDocumentRecord(event) {
	  event.preventDefault();
	  store.currentDocumentId = $(this).attr("data-current-document-id");
	  documentsApi.showDocument().done(documentsUi.showDocumentRecordSuccess).fail(documentsUi.showDocumentRecordFailure);
	};

	var onEditDocument = function onEditDocument(event) {
	  event.preventDefault();
	  store.currentDocumentId = $(this).attr("data-current-document-id");
	  store.currentJobRefId = $(this).attr("data-current-job-ref-id");
	  store.currentJobRefText = $(this).attr("data-current-job-ref-text");
	  store.currentDocumentType = $(this).attr("data-current-doc-type");

	  // Template
	  var formCategory = "document";
	  var listCategory = "job";
	  documentsUi.generateUpdateForm(listCategory, formCategory);
	};

	var onCreateDocument = function onCreateDocument(event) {
	  event.preventDefault();
	  logic.convertPercentage();
	  // document.querySelectorAll('.form-control').forEach(function() {
	  //   logic.convertPercentage();
	  // });
	  var data = getFormFields(event.target);
	  store.createDocumentData = data;
	  store.lastShowDocumentData = data;

	  var docTypeSelectVal = $("#document-type-select").val();

	  if (docTypeSelectVal === "Other") {
	    data.document.doctype = $("#doc-type-other-text").val();
	  } else {
	    data.document.doctype = $("#document-type-select").val();
	  }

	  var listCategory = "job";

	  var submitValue = linkLogic.obtainOptionVal(listCategory);
	  data.document.job_ref_id = submitValue;

	  var submitText = linkLogic.obtainOptionText(listCategory);
	  data.document.job_ref_text = submitText;

	  if (submitValue === -1) {
	    data.document.job_ref_id = 0;
	    data.document.job_ref_text = "";
	  }

	  data.document.doctype = $("#document-type-select").val();
	  data.document.doctext = $("#doctext-field").val();

	  data.document.docurl = logic.convertToUrl(data.document.docurl);

	  store.createDocumentData = data;
	  store.lastShowDocumentData = data;

	  documentsApi.createDocument(data).done(documentsUi.createDocumentSuccess).fail(documentsUi.createDocumentFailure);
	};

	var onDeleteDocument = function onDeleteDocument(event) {
	  event.preventDefault();
	  store.currentDocumentId = $("#document-record-delete").attr("data-current-document-id");
	  documentsApi.deleteDocument(store.currentDocumentId).done(documentsUi.deleteDocumentSuccess).fail(documentsUi.deleteDocumentFailure);
	};

	var onUpdateDocument = function onUpdateDocument(event) {
	  event.preventDefault();
	  logic.convertPercentage();
	  var data = getFormFields(event.target);

	  var prevJobRefId = store.currentJobRefId;
	  var prevJobRefText = store.currentJobRefText;
	  var isRefBeingUpdated = $("#job-update-link").prop("checked");
	  var isRadioNoChecked = $("#job-radio-no").prop("checked");
	  var isRadioYesChecked = $("#job-radio-yes").prop("checked");
	  var isEitherRadioChecked = $("#job-radio-no").prop("checked") || $("#job-radio-yes").prop("checked");

	  if (isRefBeingUpdated) {

	    if (isEitherRadioChecked) {
	      if (isRadioNoChecked) {
	        if ($("#alt-input-entry-job").val() === "") {
	          data.document.job_ref_text = prevJobRefText;
	          data.document.job_ref_id = prevJobRefId;
	        } else {
	          data.document.job_ref_text = $("#alt-input-entry-job").val();
	          data.document.job_ref_id = 0;
	        }
	      } else if (isRadioYesChecked) {
	        var jobRefIdSelected = parseInt($("#select-element-job").val());
	        if (jobRefIdSelected === -1) {
	          data.document.job_ref_id = prevJobRefId;
	          data.document.job_ref_text = prevJobRefText;
	        } else {
	          var _jobRefIdSelected = $("#select-element-job").val();
	          var textValueSelectDiv = "#select-element-job option[value=" + _jobRefIdSelected + "]";
	          data.document.job_ref_id = _jobRefIdSelected;
	          data.document.job_ref_text = $(textValueSelectDiv).text();
	        }
	      }
	    } else {
	      data.document.job_ref_text = prevJobRefText;
	      data.document.job_ref_id = prevJobRefId;
	    }
	  } else {
	    data.document.job_ref_text = prevJobRefText;
	    data.document.job_ref_id = prevJobRefId;
	  }

	  if (data.document.job_ref_text === "Click to Select") {
	    data.document.job_ref_text = prevJobRefText;
	    data.document.job_ref_id = prevJobRefId;
	  }

	  data.document.doctype = $("#document-type-select").val();
	  data.document.doctext = $("#doctext-field").val();
	  data.document.docurl = logic.convertToUrl(data.document.docurl);

	  store.createDocumentData = data;
	  store.lastShowDocumentData = data;

	  documentsApi.updateDocument(data).done(documentsUi.updateDocumentSuccess).fail(documentsUi.updateDocumentFailure);
	};

	var onShowDocumentCreateForm = function onShowDocumentCreateForm(event) {
	  event.preventDefault();
	  documentsUi.showDocumentCreateForm();
	};

	var onDisplayJobDropdown = function onDisplayJobDropdown(event) {
	  event.preventDefault();
	  var formCategory = "document";
	  var listCategory = "job";

	  var linkContainerSelect = ".display-dropdown-" + listCategory;

	  var altFormContainer = ".display-alt-" + listCategory;
	  var selectVal = parseInt($(this).val());

	  if (selectVal === 1) {
	    $(altFormContainer).children().remove();
	    linkLogic.showDropOptionsCreatePage(formCategory, listCategory);
	  } else {
	    $(linkContainerSelect).children().remove();
	    linkLogic.altOptionAppend(formCategory, listCategory);
	  }
	};

	var onHideShowUpdateOptions = function onHideShowUpdateOptions() {
	  var isUpdateChecked = $(this).prop("checked");
	  var radioButtonContainer = $(this).parent().parent().parent().children(".update-radio-container-btn");
	  if (isUpdateChecked) {
	    $(".job-radio-container input").prop("checked", false);
	    $(radioButtonContainer).show();
	  } else {
	    $(".job-radio-container input").prop("checked", false);
	    $("#document-ref-text-alt-job-container").remove();
	    $(".display-dropdown-job").children().remove();
	    $(radioButtonContainer).hide();
	  }
	};

	var resizeTextArea = function resizeTextArea() {
	  var divId = $(this).attr("id");
	  logic.onResizeTextarea(divId);
	};

	var addHandlers = function addHandlers() {
	  $('.content').on('submit', '#new-document-form', onCreateDocument);
	  $('.content').on('submit', '#update-document-form', onUpdateDocument);
	  $('.content').on('click', '#document-record-btn-edit', onEditDocument);
	  $('.content').on('click', '#dashboard-new-document-btn', onShowDocumentCreateForm);
	  $('.content').on('click', '.dashboard-document-record-btn', onShowDocumentRecord);
	  $('#get-documents-btn').on('click', onGetDocuments);
	  $('.content').on('click', '#document-record-delete', onDeleteDocument);
	  $('.content').on('change', "#job-update-link", onHideShowUpdateOptions);
	  $('.content').on('change', '.update-job', onDisplayJobDropdown);
	  $('.content').on('click', '.get-documents-back-btn', onGetDocuments);
	  $('.content').on('keyup', '#doctext-field', resizeTextArea);
	  $('.content').on('click', '.get-documents', onGetDocuments);
	};

	module.exports = {
	  addHandlers: addHandlers
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var store = __webpack_require__(9);
	var displayEditDocument = __webpack_require__(69);
	var displayDocumentDashboard = __webpack_require__(70);
	var displayDocumentDetails = __webpack_require__(71);
	var displayDocumentCreateForm = __webpack_require__(72);
	var documentsApi = __webpack_require__(14);
	var displayRadioButtonsTemplate = __webpack_require__(60);
	var displayDocumentOptions = __webpack_require__(73);
	var linkLogic = __webpack_require__(62);
	var logic = __webpack_require__(16);

	var getDocumentSuccess = function getDocumentSuccess(data) {
	  store.documentDataForEdit = data;
	  $(".notification-container").children().text("");

	  $(".content").children().remove();

	  var dataArr = data.documents;

	  for (var i = 0; i < dataArr.length; i++) {
	    var unavailable = "N/A";
	    var currArrayOptOne = dataArr[i].docdate;
	    var currArrayOptTwo = dataArr[i].docsubject;
	    var currArrayOptThree = dataArr[i].docurl;

	    if (currArrayOptOne === "" || currArrayOptOne === null) {
	      dataArr[i].docdate = unavailable;
	    }
	    if (currArrayOptTwo === "" || currArrayOptTwo === null) {
	      dataArr[i].docsubject = unavailable;
	    }
	    if (currArrayOptThree === "" || currArrayOptThree === null) {
	      dataArr[i].docurl = unavailable;
	    }
	  }

	  var documentDashboard = displayDocumentDashboard({
	    documents: data.documents
	  });

	  $('.content').append(documentDashboard);

	  var allDocumentsEmptyLength = $(".document-summary-table tbody").children().length;

	  if (allDocumentsEmptyLength === 0) {
	    $(".document-summary-table").remove();
	    $(".all-documents-empty").text('There are no documents associated with your account. Click "Create Document" to get started.');
	  }
	  logic.dateFormatByClass();
	};

	var showDocumentRecordSuccess = function showDocumentRecordSuccess(data) {
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  store.lastShowDocumentData = data;

	  console.log(data.document.doctext);

	  var documentDetails = displayDocumentDetails({
	    document: data.document
	  });
	  $('.content').append(documentDetails);
	  logic.displayUrl();
	  logic.dateFormatByClass();
	  $(".doc-text-insert").text(data.document.doctext);
	};

	var showDocumentRecordFailure = function showDocumentRecordFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be displayed.");
	};

	var showDocumentCreateForm = function showDocumentCreateForm() {
	  var listCategory = "job";
	  var formCategory = "document";

	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  var showCreateDocumentForm = displayDocumentCreateForm();
	  $('.content').append(showCreateDocumentForm);

	  var radioTemplate = displayRadioButtonsTemplate();
	  $("#" + listCategory + "-category-radio-container").append(radioTemplate);

	  linkLogic.radioClassIdNameGen(formCategory, listCategory);
	  $("#job-category-radio-container").hide();
	  var defaultDate = logic.defaultDate();
	  $(".default-date").val(defaultDate);
	};

	var generateUpdateForm = function generateUpdateForm(listCategory, formCategory) {
	  $(".notification-container").children().text("");
	  $(".content").children().remove();

	  var data = store.lastShowDocumentData;

	  var editDocument = displayEditDocument({
	    document: data.document
	  });
	  $('.content').append(editDocument);

	  var listLinkStatusSelector = "." + listCategory + "-tag-status";
	  var listRefId = parseInt(store.currentJobRefId);

	  if (listRefId > 0) {
	    $(listLinkStatusSelector).text("Linked");
	  }

	  var updateFormId = "#update-" + formCategory + "-form";
	  var updateFormStatus = parseInt($(updateFormId).attr("data-update-form"));

	  if (updateFormStatus === 1) {
	    var categoryText = "." + listCategory + "-radio-container ";
	    $(categoryText).show();
	    $(".update-radio-container-btn").hide();
	  }

	  var currentRefTextValTxt = "." + listCategory + "-update-radio-text";

	  if (store.currentJobRefText === "") {
	    $(currentRefTextValTxt).text("N/A");
	  }

	  var preselectVal = store.currentDocumentType;
	  var preselectDiv = "#document-type-select";
	  linkLogic.preselectDefault(preselectDiv, preselectVal);

	  var divId = "#doctext-field";
	  logic.textAreaHeightUpdate(divId);
	};

	var getDocumentFailure = function getDocumentFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the records could not be retrieved.");
	};

	var createDocumentSuccess = function createDocumentSuccess(data) {
	  store.currentDocumentId = data.document.id;
	  $(".form-error").text("");
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  $(".success-alert").text("The record has been successfully created.");

	  var showDocumentDetails = displayDocumentDetails({
	    document: store.createDocumentData.document
	  });
	  $(".content").append(showDocumentDetails);
	  $(".current").attr("data-current-document-id", store.currentDocumentId);
	  logic.displayUrl();
	  logic.dateFormatByClass();
	};

	var deleteDocumentSuccess = function deleteDocumentSuccess() {
	  $(".notification-container").children().text("");
	  $(".success-alert").text("The record has been successfully deleted");
	  logic.dateFormatByClass();
	  documentsApi.getDocuments().done(getDocumentSuccess).fail(getDocumentFailure);
	};

	var deleteDocumentFailure = function deleteDocumentFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be deleted.");
	};

	var updateDocumentSuccess = function updateDocumentSuccess(data) {
	  store.currentDocumentId = data.document.id;
	  $(".form-error").text("");
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  $(".success-alert").text("The record has been successfully updated.");

	  var showDocumentDetails = displayDocumentDetails({
	    document: data.document
	  });
	  $(".content").append(showDocumentDetails);
	  $(".current").attr("data-current-document-id", store.currentDocumentId);
	  logic.displayUrl();
	  logic.dateFormatByClass();
	};

	var displayDocumentDropdownSuccess = function displayDocumentDropdownSuccess(data) {
	  $(".notification-container").children().text("");

	  var companyOptionDisplay = displayDocumentOptions({
	    documents: data.documents
	  });

	  var dataUpdateFormVal = parseInt($("#update-document-form").attr("data-update-form"));

	  $('.associate-reminder-with-document-container').append(companyOptionDisplay);

	  if (dataUpdateFormVal === 1) {
	    var currentDocumentId = store.currentDocumentId;
	    var valueString = '#select-option-document-name option[value=' + currentDocumentId + ']';
	    $(valueString).prop('selected', true);
	  }
	};

	var createDocumentFailure = function createDocumentFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be created. Please make sure all required fields are filled");
	};

	var updateDocumentFailure = function updateDocumentFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be updated. Please make sure all required fields are filled");
	};

	module.exports = {
	  getDocumentSuccess: getDocumentSuccess,
	  showDocumentRecordSuccess: showDocumentRecordSuccess,
	  deleteDocumentSuccess: deleteDocumentSuccess,
	  deleteDocumentFailure: deleteDocumentFailure,
	  showDocumentCreateForm: showDocumentCreateForm,
	  getDocumentFailure: getDocumentFailure,
	  updateDocumentSuccess: updateDocumentSuccess,
	  showDocumentRecordFailure: showDocumentRecordFailure,
	  createDocumentSuccess: createDocumentSuccess,
	  displayDocumentDropdownSuccess: displayDocumentDropdownSuccess,
	  displayDocumentOptions: displayDocumentOptions,
	  generateUpdateForm: generateUpdateForm,
	  createDocumentFailure: createDocumentFailure,
	  updateDocumentFailure: updateDocumentFailure
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "<div class=\"update-document-form-container form-container document-page group-category\">\n  <form class=\"form document-form reminder-form\" id=\"update-document-form\" name=\"update-document-form\" data-update-form=\"1\">\n    <fieldset>\n      <legend>Update Document Form</legend>\n      <p id=\"update-document-error\" class=\"warning form-error\"></p>\n      <p>All fields are <u>optional</u> unless otherwise indicated</p>\n\n      <div class=\"form-group\">\n        <label>Document Date</label>\n        <input class=\"form-control required-field\" name=\"document[docdate]\" placeholder=\"Document Date\" type=\"date\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.docdate : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group doc-type\">\n        <label>Document Type (required)</label>\n        <select class=\"form-control\" id=\"document-type-select\" data-current-doc-type=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.doctype : stack1), depth0))
	    + "\">\n            <option class=\"form-control required-field\" name=\"document[doctype]\" placeholder=\"Document Type\" type=\"text\" value=\"Resume\">Resume</option>\n            <option class=\"form-control required-field\" name=\"document[doctype]\" placeholder=\"Document Type\" type=\"text\" value=\"Cover Letter\">Cover Letter</option>\n            <option class=\"form-control required-field document-doctype\" name=\"document[doctype]\" placeholder=\"Document Type\" type=\"text\" value=\"Application Questions\">Application Questions</option>\n            <option class=\"form-control required-field\" name=\"document[doctype]\" placeholder=\"Document Type\" type=\"text\" value=\"Other\">Other</option>\n        </select>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Document Subject (required)</label>\n        <input class=\"form-control text-input\" name=\"document[docsubject]\" placeholder=\"Subject\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.docsubject : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Document Website (url)</label>\n        <input class=\"form-control\" name=\"document[docurl]\" placeholder=\"www.gmail.com/...\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.docurl : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Document Text</label>\n        <textarea  id=\"doctext-field\" class=\"form-control text-input field-input note-input\" name=\"document[doctext]\" placeholder=\"Document Text\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.doctext : stack1), depth0))
	    + "</textarea>\n      </div>\n\n      <div class=\"form-group job-radio-container current-value-update-page\">\n        <label>Current Company Association:</label>\n        <div class=\"update-radio-link-value-status-container\">\n          <p>The company currently associated with this document is: <span class=\"job-update-radio-text\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "</span></p>\n          <p>Link Status: <span class=\"job-tag-status\" data-current-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\">Not Linked</span></p>\n        </div>\n      </div>\n\n      <div>\n        <div class=\"job-update-link-container form-group\">\n          <label>Would you like to update the document's company?</label>\n          <div class=\"form-group\">\n            <span>Check Box for Yes</span>\n            <input id=\"job-update-link\" type=\"checkbox\" value=\"\">\n          </div>\n        </div>\n        <div class=\"form-group job-radio-container update-radio-container-btn\">\n          <label>Will this updated company be tagged to the document?</label>\n          <label><input id=\"job-radio-yes\" class=\"job-category\" type=\"radio\" name=\"job-radio\" value=\"1\">Yes</label>\n          <label><input id=\"job-radio-no\" class=\"job-category\" type=\"radio\" name=\"job-radio\" value=\"0\">No</label>\n        </div>\n      </div>\n\n      <div class=\"form-group display-alt-job\"></div>\n      <div class=\"form-group display-dropdown-job\"></div>\n\n      <div class=\"form-group\">\n        <input class=\"btn btn-success submit-btn current\" name=\"submit\" id=\"submit-document-update-btn\" type=\"submit\" value=\"Submit\" data-current-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-ref-text=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">\n        <button type=\"button\" class=\"btn btn-danger submit-btn current get-documents-back-btn\">Cancel</button>\n      </div>\n    </fieldset>\n  </form>\n</div>\n";
	},"useData":true});

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "              <tr>\n                <td class=\"display-document-date format-date hidden-xs\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.docdate : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-document-type hidden-xs\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.doctype : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-document-subject\">\n                  "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.docsubject : stack1), depth0))
	    + "\n                </td>\n                <td class=\"display-document-submit\">\n                  <button type=\"button\" class=\"btn btn-default btn-sm dashboard-document-record-btn\" data-current-document-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\">View</button>\n                </td>\n              </tr>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-lg-10 col-lg-offset-1 col-xs-12 col-xs-offset-0\">\n      <div class=\"document-page group-category\">\n        <h1>Document Dashboard</h1>\n\n        <table class=\"table document-summary-table table-hover\">\n          <thead>\n            <tr>\n              <th class=\"hidden-xs\">Date</th>\n              <th class=\"hidden-xs\">Document Type</th>\n              <th>Document Subject</th>\n              <th>View Record</th>\n            </tr>\n          </thead>\n          <tbody>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.documents : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "          </tbody>\n        </table>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-lg-10 col-lg-offset-1 col-xs-11 col-xs-offset-1\"><p class=\"all-documents-empty\"></p></div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-sm-12\">\n        <div class=\"dashboard-container\">\n          <button id=\"dashboard-new-document-btn\" type=\"button\" class=\"btn btn-success\">Create Document</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "<div class=\"document-page group-category\">\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-xs-offset-0 col-sm-9\">\n      <h1>Document Details</h1>\n\n      <h3>"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "</h3>\n      <table class=\"table document-record-table\">\n        <tbody>\n          <tr>\n            <td class=\"document-record-date\">\n              Document Date:\n            </td>\n            <td class=\"display-document-name format-date\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.docdate : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td>\n              Linked Company:\n            </td>\n            <td class=\"linked-company\" data-job-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td class=\"document-record-title document-record-location\">\n              Document Type:\n            </td>\n            <td class=\"display-document-doctype\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.doctype : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td class=\"document-url\">\n              Document Url:\n            </td>\n            <td class=\"display-document-url\">\n              <a class=\"display-url\" href=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.docurl : stack1), depth0))
	    + "\" target=\"_blank\">N/A</a>\n            </td>\n          </tr>\n          <tr>\n            <td class=\"document-record-title document-record-subject\">\n              Document Subject:\n            </td>\n            <td class=\"display-document-subject\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.docsubject : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"underline\">Document Text:</p>\n              <p class=\"maintain-spacing\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.doctext : stack1), depth0))
	    + "</p>\n            </td>\n          </tr>\n          <!-- <tr>\n            <td class=\"document-record-title document-record-note\">\n              Document Text:\n            </td>\n            <td class=\"display-document-note maintain-spacing\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.doctext : stack1), depth0))
	    + "\n            </td>\n          </tr> -->\n        </tbody>\n      </table>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-xs-offset-0 col-sm-9\">\n      <div class=\"document-record-btn-options center\">\n        <button type=\"button\" class=\"btn btn-default current get-documents-back-btn\">Back</button>\n        <button id=\"document-record-btn-edit\" type=\"button\" class=\"btn btn-warning current\" data-current-document-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-doc-type=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.doctype : stack1), depth0))
	    + "\" data-current-job-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-job-ref-text=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">Edit Document Record</button>\n        <button id=\"document-record-delete\" type=\"button\" class=\"btn btn-danger current\" data-current-document-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.document : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\">Delete Document Record</button>\n      </div>\n    </div>\n  </div>\n</div>\n";
	},"useData":true});

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    return "\n<div class=\"create-document-form-container form-container form-group document-page group-category\">\n  <h1>Create a Document</h1>\n\n  <form class=\"form document-form\" id=\"new-document-form\" name=\"new-document-form\">\n    <fieldset>\n      <p id=\"create-document-error\" class=\"warning form-error\"></p>\n      <p>All fields are <u>optional</u> unless otherwise indicated</p>\n\n      <div class=\"form-group\">\n        <!-- <label>Document Date <span class=\"clear-default-date\">&#10005;</span></label> -->\n        <label>Document Date</label>\n        <input class=\"default-date form-control required-field\" name=\"document[docdate]\" placeholder=\"Document Date\" type=\"date\">\n      </div>\n\n      <div class=\"form-group doc-type\">\n        <label>Document Type (required)</label>\n        <select class=\"form-control\" id=\"document-type-select\">\n            <option class=\"form-control required-field document-doctype\" name=\"document[doctype]\" placeholder=\"Document Type\" type=\"text\" value=\"Resume\">Resume</option>\n            <option class=\"form-control required-field document-doctype\" name=\"document[doctype]\" placeholder=\"Document Type\" type=\"text\" value=\"Cover Letter\">Cover Letter</option>\n            <option class=\"form-control required-field document-doctype\" name=\"document[doctype]\" placeholder=\"Document Type\" type=\"text\" value=\"Application Questions\">Application Questions</option>\n            <option class=\"form-control required-field document-doctype\" name=\"document[doctype]\" placeholder=\"Document Type\" type=\"text\" value=\"Other\">Other</option>\n        </select>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Document Subject (required)</label>\n        <input class=\"form-control text-input required-field\" name=\"document[docsubject]\" placeholder=\"Document Subject\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Document Url</label>\n        <input class=\"form-control required-field\" name=\"document[docurl]\" placeholder=\"www.gmail.com/...\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Document Text</label>\n        <textarea id=\"doctext-field\" class=\"create-textarea text-input form-control field-input note-input\" name=\"document[doctext]\" placeholder=\"Document Text\"></textarea>\n      </div>\n\n      <div class=\"job-create-link-container form-group\">\n        <label>Would you like to associate a company with this document?</label>\n        <div class=\"form-group\">\n          <span>Check Box for Yes</span>\n          <input id=\"job-create-link\" type=\"checkbox\" value=\"\">\n        </div>\n      </div>\n\n      <div id=\"job-category-radio-container\"></div>\n\n      <div class=\"display-dropdown-job\"></div>\n      <div class=\"display-alt-job\"></div>\n\n      <div class=\"form-group append-nonlink\"></div>\n      <div class=\"form-group display-jobs-dropdown\"></div>\n\n      <div class=\"form-group\">\n        <input class=\"btn btn-success submit-btn current\" name=\"submit\" id=\"create-document-btn\" type=\"submit\" value=\"Submit\">\n        <button type=\"button\" class=\"btn btn-danger submit-btn current get-documents-back-btn\">Cancel</button>\n      </div>\n    </fieldset>\n  </form>\n</div>\n";
	},"useData":true});

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "        <option class=\"form-control option-company-name\" name=\"document[company_name]\" placeholder=\"reminder Type\" type=\"text\" data-document-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-document-name=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_name : stack1), depth0))
	    + "\" value=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\">"
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_name : stack1), depth0))
	    + "</option>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<div id=\"tag-document-to-communication-select\" class=\"tag-select-container\">\n  <label>Document Name Selection:</label>\n  <select id=\"select-option-document-category\" class=\"form-control select-option-value\">\n      <option class=\"form-control blank-option\" placeholder=\"Blank\" type=\"text\" value=\"0\"></option>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.documents : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "  </select>\n</div>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var contactsApi = __webpack_require__(15);
	var contactsUi = __webpack_require__(75);
	var getFormFields = __webpack_require__(38);
	var store = __webpack_require__(9);
	var linkLogic = __webpack_require__(62);
	var logic = __webpack_require__(16);
	// Contact EVENTS

	var onGetContacts = function onGetContacts(event) {
	  event.preventDefault();
	  var screenWidth = window.innerWidth;
	  if (screenWidth < 768) {
	    $(".nav-mobile-ul").slideUp();
	  }
	  contactsApi.getContacts().done(contactsUi.getContactSuccess).fail(contactsUi.getContactFailure);
	};

	var onShowContactRecord = function onShowContactRecord(event) {
	  event.preventDefault();
	  store.currentContactId = $(this).attr("data-current-contact-id");
	  contactsApi.showContact().done(contactsUi.showContactRecordSuccess).fail(contactsUi.showContactRecordFailure);
	};

	var onEditContact = function onEditContact(event) {
	  event.preventDefault();
	  store.currentContactId = $(this).attr("data-current-contact-id");
	  store.currentJobRefId = $(this).attr("data-current-job-ref-id");
	  store.currentJobRefText = $(this).attr("data-current-job-ref-text");

	  // Template
	  var formCategory = "contact";
	  var listCategory = "job";
	  contactsUi.generateUpdateForm(listCategory, formCategory);
	};

	var onCreateContact = function onCreateContact(event) {
	  event.preventDefault();
	  logic.convertPercentage();
	  var data = getFormFields(event.target);

	  var firstName = $(".contact-first-name").val().trim();
	  var lastName = $(".contact-last-name").val().trim();
	  var fullName = firstName + " " + lastName;

	  data.contact.full_name = fullName;

	  data.contact.notes = $("#contact-notes-input").val();

	  var listCategory = "job";

	  var submitValue = linkLogic.obtainOptionVal(listCategory);

	  data.contact.job_ref_id = submitValue;

	  var submitText = linkLogic.obtainOptionText(listCategory);
	  data.contact.job_ref_text = submitText;

	  if (submitValue === -1) {
	    data.contact.job_ref_id = 0;
	    data.contact.job_ref_text = "";
	  }

	  data.contact.notes = $("#contact-notes-input").val();

	  data.contact.website = logic.convertToUrl(data.contact.website);

	  store.createContactData = data;
	  store.lastShowContactData = data;
	  contactsApi.createContact(data).done(contactsUi.createContactSuccess).fail(contactsUi.createContactFailure);
	};

	var onDeleteContact = function onDeleteContact(event) {
	  event.preventDefault();
	  store.currentContactId = $("#contact-record-delete").attr("data-current-contact-id");
	  contactsApi.deleteContact(store.currentContactId).done(contactsUi.deleteContactSuccess).fail(contactsUi.deleteContactFailure);
	};

	var onUpdateContact = function onUpdateContact(event) {
	  event.preventDefault();
	  logic.convertPercentage();
	  var data = getFormFields(event.target);

	  var firstName = $(".contact-first-name").val().trim();
	  var lastName = $(".contact-last-name").val().trim();
	  var fullName = firstName + " " + lastName;

	  data.contact.full_name = fullName;

	  var prevJobRefId = store.currentJobRefId;
	  var prevJobRefText = store.currentJobRefText;
	  var isRefBeingUpdated = $("#job-update-link").prop("checked");
	  var isRadioNoChecked = $("#job-radio-no").prop("checked");
	  var isRadioYesChecked = $("#job-radio-yes").prop("checked");
	  var isEitherRadioChecked = $("#job-radio-no").prop("checked") || $("#job-radio-yes").prop("checked");

	  if (isRefBeingUpdated) {

	    if (isEitherRadioChecked) {
	      if (isRadioNoChecked) {
	        if ($("#alt-input-entry-job").val() === "") {
	          data.contact.job_ref_text = prevJobRefText;
	          data.contact.job_ref_id = prevJobRefId;
	        } else {
	          data.contact.job_ref_text = $("#alt-input-entry-job").val();
	          data.contact.job_ref_id = 0;
	        }
	      } else if (isRadioYesChecked) {
	        var jobRefIdSelected = parseInt($("#select-element-job").val());
	        if (jobRefIdSelected === -1) {
	          data.contact.job_ref_id = prevJobRefId;
	          data.contact.job_ref_text = prevJobRefText;
	        } else {
	          var _jobRefIdSelected = $("#select-element-job").val();
	          var textValueSelectDiv = "#select-element-job option[value=" + _jobRefIdSelected + "]";
	          data.contact.job_ref_id = _jobRefIdSelected;
	          data.contact.job_ref_text = $(textValueSelectDiv).text();
	        }
	      }
	    } else {
	      data.contact.job_ref_text = prevJobRefText;
	      data.contact.job_ref_id = prevJobRefId;
	    }
	  } else {
	    data.contact.job_ref_text = prevJobRefText;
	    data.contact.job_ref_id = prevJobRefId;
	  }

	  if (data.contact.job_ref_text === "Click to Select") {
	    data.contact.job_ref_text = prevJobRefText;
	    data.contact.job_ref_id = prevJobRefId;
	  }

	  data.contact.notes = $("#contact-notes-input").val();

	  data.contact.website = logic.convertToUrl(data.contact.website);

	  store.createContactData = data;
	  store.lastShowContactData = data;

	  contactsApi.updateContact(data).done(contactsUi.updateContactSuccess).fail(contactsUi.updateContactFailure);
	};

	var onShowContactCreateForm = function onShowContactCreateForm(event) {
	  event.preventDefault();
	  contactsUi.showContactCreateForm();
	};

	var onDisplayJobDropdown = function onDisplayJobDropdown(event) {
	  event.preventDefault();
	  var formCategory = "contact";
	  var listCategory = "job";

	  var linkContainerSelect = ".display-dropdown-" + listCategory;

	  var altFormContainer = ".display-alt-" + listCategory;
	  var selectVal = parseInt($(this).val());

	  if (selectVal === 1) {
	    $(altFormContainer).children().remove();
	    linkLogic.showDropOptionsCreatePage(formCategory, listCategory);
	  } else {
	    $(linkContainerSelect).children().remove();
	    linkLogic.altOptionAppend(formCategory, listCategory);
	  }
	};

	var onHideShowUpdateOptions = function onHideShowUpdateOptions() {
	  var isUpdateChecked = $(this).prop("checked");
	  var radioButtonContainer = $(this).parent().parent().parent().children(".update-radio-container-btn");
	  if (isUpdateChecked) {
	    $(".job-radio-container input").prop("checked", false);
	    $(radioButtonContainer).show();
	  } else {
	    $(".job-radio-container input").prop("checked", false);
	    $("#contact-ref-text-alt-job-container").remove();
	    $(".display-dropdown-job").children().remove();
	    $(radioButtonContainer).hide();
	  }
	};

	var resizeTextArea = function resizeTextArea() {
	  var divId = $(this).attr("id");
	  logic.onResizeTextarea(divId);
	};

	var addHandlers = function addHandlers() {
	  $('.content').on('submit', '#new-contact-form', onCreateContact);
	  $('.content').on('submit', '#update-contact-form', onUpdateContact);
	  $('.content').on('click', '#contact-record-btn-edit', onEditContact);
	  $('.content').on('click', '#dashboard-new-contact-btn', onShowContactCreateForm);
	  $('.content').on('click', '.dashboard-contact-record-btn', onShowContactRecord);
	  $('#get-contacts-btn').on('click', onGetContacts);
	  $('.content').on('click', '#contact-record-delete', onDeleteContact);
	  $('.content').on('change', '.job-category', onDisplayJobDropdown);
	  $('.content').on('change', "#job-update-link", onHideShowUpdateOptions);
	  $('.content').on('change', '.update-job', onDisplayJobDropdown);
	  $('.content').on('click', '.get-contacts', onGetContacts);
	  $('.content').on('click', '.get-contacts-back-btn', onGetContacts);
	  $('.content').on('keyup', '#contact-notes-input', resizeTextArea);
	};

	module.exports = {
	  addHandlers: addHandlers
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var store = __webpack_require__(9);
	var displayEditContact = __webpack_require__(76);
	var displayContactDashboard = __webpack_require__(77);
	var displayContactDetails = __webpack_require__(78);
	var displayContactCreateForm = __webpack_require__(79);
	var contactsApi = __webpack_require__(15);
	var displayRadioButtonsTemplate = __webpack_require__(60);
	var displayContactOptions = __webpack_require__(80);
	var linkLogic = __webpack_require__(62);
	var logic = __webpack_require__(16);

	var getContactSuccess = function getContactSuccess(data) {
	  store.contactDataForEdit = data;

	  $(".content").children().remove();

	  var dataArr = data.contacts;

	  for (var i = 0; i < dataArr.length; i++) {
	    var unavailable = "N/A";
	    var currArrayOptOne = dataArr[i].job_ref_text;
	    var currArrayOptTwo = dataArr[i].email;
	    var currArrayOptThree = dataArr[i].phone;

	    if (currArrayOptOne === "" || currArrayOptOne === null) {
	      dataArr[i].job_ref_text = unavailable;
	    }
	    if (currArrayOptTwo === "" || currArrayOptTwo === null) {
	      dataArr[i].email = unavailable;
	    }
	    if (currArrayOptThree === "" || currArrayOptThree === null) {
	      dataArr[i].phone = unavailable;
	    }
	  }

	  var contactDashboard = displayContactDashboard({
	    contacts: data.contacts
	  });

	  $('.content').append(contactDashboard);

	  var allContactsEmptyLength = $(".contact-summary-table tbody").children().length;

	  if (allContactsEmptyLength === 0) {
	    $(".contact-summary-table").remove();
	    $(".all-contacts-empty").text('There are no contacts associated with your account. Click "Create Contact" to get started.');
	  }
	};

	var showContactRecordSuccess = function showContactRecordSuccess(data) {
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  store.lastShowContactData = data;

	  var contactDetails = displayContactDetails({
	    contact: data.contact
	  });
	  $('.content').append(contactDetails);
	  logic.displayUrl();
	};

	var showContactRecordFailure = function showContactRecordFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be retrieved.");
	};

	var showContactCreateForm = function showContactCreateForm() {
	  var listCategory = "job";
	  var formCategory = "contact";

	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  var showCreateContactForm = displayContactCreateForm();
	  $('.content').append(showCreateContactForm);

	  var radioTemplate = displayRadioButtonsTemplate();
	  $("#" + listCategory + "-category-radio-container").append(radioTemplate);

	  linkLogic.radioClassIdNameGen(formCategory, listCategory);
	  $("#job-category-radio-container").hide();
	};

	var generateUpdateForm = function generateUpdateForm(listCategory, formCategory) {
	  $(".notification-container").children().text("");
	  $(".content").children().remove();

	  var data = store.lastShowContactData;

	  var editContact = displayEditContact({
	    contact: data.contact
	  });
	  $('.content').append(editContact);

	  var listLinkStatusSelector = "." + listCategory + "-tag-status";
	  var listRefId = parseInt(store.currentJobRefId);

	  if (listRefId > 0) {
	    $(listLinkStatusSelector).text("Linked");
	  }

	  var updateFormId = "#update-" + formCategory + "-form";
	  var updateFormStatus = parseInt($(updateFormId).attr("data-update-form"));

	  if (updateFormStatus === 1) {
	    var categoryText = "." + listCategory + "-radio-container ";
	    $(categoryText).show();
	    $(".update-radio-container-btn").hide();
	  }

	  var currentRefTextValTxt = "." + listCategory + "-update-radio-text";

	  if (store.currentJobRefText === "") {
	    $(currentRefTextValTxt).text("N/A");
	  }

	  var divId = "#contact-notes-input";
	  logic.textAreaHeightUpdate(divId);
	};

	var getContactFailure = function getContactFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the records could not be retrieved.");
	};

	var createContactSuccess = function createContactSuccess(data) {
	  store.currentContactId = data.contact.id;
	  $(".form-error").text("");
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  $(".success-alert").text("The record has been successfully created.");

	  var showContactDetails = displayContactDetails({
	    contact: store.createContactData.contact
	  });
	  $(".content").append(showContactDetails);
	  $(".current").attr("data-current-contact-id", store.currentContactId);
	  logic.displayUrl();
	};

	var deleteContactSuccess = function deleteContactSuccess() {
	  $(".notification-container").children().text("");
	  $(".success-alert").text("The record has been successfully deleted");
	  contactsApi.getContacts().done(getContactSuccess).fail(getContactFailure);
	};

	var deleteContactFailure = function deleteContactFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be deleted.");
	};

	var updateContactSuccess = function updateContactSuccess(data) {

	  store.currentContactId = data.contact.id;
	  $(".form-error").text("");
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  $(".success-alert").text("The record has been successfully updated.");

	  var showContactDetails = displayContactDetails({
	    contact: data.contact
	  });
	  $(".content").append(showContactDetails);
	  $(".current").attr("data-current-contact-id", store.currentContactId);
	  logic.displayUrl();
	};

	var displayContactDropdownSuccess = function displayContactDropdownSuccess(data) {
	  $(".notification-container").children().text("");

	  var companyOptionDisplay = displayContactOptions({
	    contacts: data.contacts
	  });

	  var dataUpdateFormVal = parseInt($("#update-contact-form").attr("data-update-form"));

	  $('.associate-reminder-with-contact-container').append(companyOptionDisplay);

	  if (dataUpdateFormVal === 1) {
	    var currentContactId = store.currentContactId;
	    var valueString = '#select-option-contact-name option[value=' + currentContactId + ']';
	    $(valueString).prop('selected', true);
	  }
	};

	var createContactFailure = function createContactFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be created. Please make sure all required fields are filled");
	};

	var updateContactFailure = function updateContactFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be updated. Please make sure all required fields are filled");
	};

	module.exports = {
	  getContactSuccess: getContactSuccess,
	  showContactRecordSuccess: showContactRecordSuccess,
	  deleteContactSuccess: deleteContactSuccess,
	  deleteContactFailure: deleteContactFailure,
	  showContactCreateForm: showContactCreateForm,
	  getContactFailure: getContactFailure,
	  updateContactSuccess: updateContactSuccess,
	  showContactRecordFailure: showContactRecordFailure,
	  createContactSuccess: createContactSuccess,
	  displayContactDropdownSuccess: displayContactDropdownSuccess,
	  displayContactOptions: displayContactOptions,
	  generateUpdateForm: generateUpdateForm,
	  createContactFailure: createContactFailure,
	  updateContactFailure: updateContactFailure
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "<div class=\"update-contact-form-container form-container contact-page group-category\">\n  <form class=\"form contact-form reminder-form\" id=\"update-contact-form\" name=\"update-contact-form\" data-update-form=\"1\">\n    <fieldset>\n      <legend>Update Contact Form</legend>\n      <p id=\"update-contact-error\" class=\"warning form-error\"></p>\n      <p>All fields are <u>optional</u> unless otherwise indicated</p>\n\n      <div class=\"form-group\">\n        <label>First Name (required)</label>\n        <input class=\"form-control text-input contact-first-name required-field\" name=\"contact[first_name]\" placeholder=\"Contact First Name\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.first_name : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Last Name (required)</label>\n        <input class=\"form-control text-input contact-last-name required-field\" name=\"contact[last_name]\" placeholder=\"Contact Last Name\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.last_name : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Nickname</label>\n        <input class=\"form-control text-input required-field\" name=\"contact[nickname]\" placeholder=\"Contact Nickname\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.nickname : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Title</label>\n        <input class=\"form-control text-input required-field\" name=\"contact[job_title]\" placeholder=\"Contact Job Title\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.job_title : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Email</label>\n        <input class=\"form-control text-input required-field\" name=\"contact[email]\" placeholder=\"Contact Email\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.email : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Phone</label>\n        <input class=\"form-control text-input required-field\" name=\"contact[phone]\" placeholder=\"Contact Phone\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.phone : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Website</label>\n        <input class=\"form-control required-field\" name=\"contact[website]\" placeholder=\"Contact Website\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.website : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Contact Notes</label>\n        <textarea id=\"contact-notes-input\" class=\"form-control text-input field-input note-input\" name=\"contact[notes]\" placeholder=\"Contact Notes\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.notes : stack1), depth0))
	    + "</textarea>\n      </div>\n\n      <div class=\"form-group job-radio-container current-value-update-page\">\n        <label>Current Company Association:</label>\n        <div class=\"update-radio-link-value-status-container\">\n          <p>The company currently associated with this contact is: <span class=\"job-update-radio-text\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "</span></p>\n          <p>Link Status: <span class=\"job-tag-status\" data-current-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\">Not Linked</span></p>\n        </div>\n      </div>\n\n      <div>\n        <div class=\"job-update-link-container form-group\">\n          <label>Would you like to update the contact's company?</label>\n          <div class=\"form-group\">\n            <span>Check Box for Yes</span>\n            <input id=\"job-update-link\" type=\"checkbox\" value=\"\">\n          </div>\n        </div>\n        <div class=\"form-group job-radio-container update-radio-container-btn\">\n          <label>Will this updated company be tagged to the contact?</label>\n          <label><input id=\"job-radio-yes\" class=\"job-category\" type=\"radio\" name=\"job-radio\" value=\"1\">Yes</label>\n          <label><input id=\"job-radio-no\" class=\"job-category\" type=\"radio\" name=\"job-radio\" value=\"0\">No</label>\n        </div>\n      </div>\n\n      <div class=\"form-group display-alt-job\"></div>\n      <div class=\"form-group display-dropdown-job\"></div>\n\n\n      <div class=\"form-group\">\n        <input class=\"btn btn-success submit-btn current\" name=\"submit\" id=\"submit-contact-update-btn\" type=\"submit\" value=\"Submit\" data-current-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-ref-text=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">\n        <button type=\"button\" class=\"btn btn-danger submit-btn current get-communications-back-btn\">Cancel</button>\n      </div>\n    </fieldset>\n  </form>\n</div>\n";
	},"useData":true});

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "            <tr>\n              <td class=\"display-contact-full-name\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.full_name : stack1), depth0))
	    + "\n              </td>\n              <td class=\"display-contact-company-name\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\n              </td>\n              <td class=\"hidden-xs\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_title : stack1), depth0))
	    + "\n              </td>\n              <td class=\"display-contact-email hidden-xs\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.email : stack1), depth0))
	    + "\n              </td>\n              <td class=\"display-contact-submit\">\n                <button type=\"button\" class=\"btn btn-default btn-sm dashboard-contact-record-btn\" data-current-contact-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-job-ref-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-job-ref-text=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">View</button>\n              </td>\n            </tr>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<div class=\"contact-page group-category\">\n  <div class=\"row\">\n    <div class=\"col-md-10 col-md-offset-1 col-xs-12 col-xs-offset-0\">\n      <h1>Contact Dashboard</h1>\n\n      <table class=\"table contact-summary-table table-hover\">\n        <thead>\n          <tr>\n            <th>Full Name</th>\n            <th>Company Name</th>\n            <th class=\"hidden-xs\">Job Title</th>\n            <th class=\"hidden-xs\">Contact Email</th>\n            <th>View Record</th>\n          </tr>\n        </thead>\n        <tbody>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.contacts : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "        </tbody>\n      </table>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12\"><p class=\"all-contacts-empty\"></p></div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <div class=\"dashboard-container\">\n        <button id=\"dashboard-new-contact-btn\" type=\"button\" class=\"btn btn-success\">Create Contact</button>\n      </div>\n    </div>\n  </div>\n\n</div>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "<div class=\"contact-page group-category\">\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-xs-offset-0 col-sm-9\">\n\n      <h1>Contact Details</h1>\n\n      <h2 class=\"contact-name-header\" data-current-contact-name=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.full_name : stack1), depth0))
	    + "</h2>\n\n      <table class=\"table contact-record-table\">\n        <tbody>\n          <tr>\n            <td>\n              Name:\n            </td>\n            <td>\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.first_name : stack1), depth0))
	    + " "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.last_name : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td class=\"contact-record-company-name-header\">\n              Company Name:\n            </td>\n            <td class=\"linked-company\" data-job-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td class=\"contact-job-title\">\n              Job Title:\n            </td>\n            <td class=\"display-contact-job-title\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.job_title : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td class=\"contact-record-email\">\n              Contact Email:\n            </td>\n            <td class=\"display-contact-email\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.email : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td class=\"contact-record-phone\">\n              Contact Phone:\n            </td>\n            <td class=\"display-contact-phone\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.phone : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td class=\"contact-record-website\">\n              Contact Website:\n            </td>\n            <td class=\"display-contact-note\">\n              <p class=\"display-empty-p\"></p>\n              <a class=\"display-url\" href=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.website : stack1), depth0))
	    + "\" target=\"_blank\"></a>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"underline\">Contact Notes:</p>\n              <p class=\"maintain-spacing\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.notes : stack1), depth0))
	    + "</p>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-xs-offset-0 col-sm-9\">\n      <div class=\"contact-record-btn-options center\">\n        <button type=\"button\" class=\"btn btn-default current get-contacts-back-btn\">Back</button>\n        <button id=\"contact-record-btn-edit\" type=\"button\" class=\"btn btn-warning current\" data-current-contact-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-job-ref-text=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\" data-current-job-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\">Edit Contact Record</button>\n        <button id=\"contact-record-delete\" type=\"button\" class=\"btn btn-danger current\" data-current-contact-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\">Delete Contact Record</button>\n      </div>\n    </div>\n  </div>\n";
	},"useData":true});

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    return "<div class=\"create-contact-form-container form-container form-group contact-page group-category\">\n  <h1>Create a Contact</h1>\n\n  <form class=\"form contact-form\" id=\"new-contact-form\" name=\"new-contact-form\">\n    <fieldset>\n\n      <p id=\"create-contact-error\" class=\"warning form-error\"></p>\n      <p>All fields are <u>optional</u> unless otherwise indicated</p>\n\n      <div class=\"form-group required-field\">\n        <label>First Name (required)</label>\n        <input class=\"form-control text-input required-field contact-first-name\" name=\"contact[first_name]\" placeholder=\"First Name\" type=\"text\">\n      </div>\n\n      <div class=\"form-group required-field\">\n        <label>Last Name (required)</label>\n        <input class=\"form-control text-input required-field contact-last-name\" name=\"contact[last_name]\" placeholder=\"Last Name\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Nickname</label>\n        <input class=\"form-control text-input required-field contact-nickname\" name=\"contact[nickname]\" placeholder=\"Nickname\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Job Title</label>\n        <input class=\"form-control text-input required-field contact-job-title\" name=\"contact[job_title]\" placeholder=\"Job Title\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Email</label>\n        <input class=\"form-control text-input contact-email\" name=\"contact[email]\" placeholder=\"Email\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Contact Web Link (http://www.linkedin.com)</label>\n        <input class=\"form-control contact-website\" name=\"contact[website]\" placeholder=\"Website\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Phone</label>\n        <input class=\"form-control text-input contact-phone\" name=\"contact[phone]\" placeholder=\"Phone\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Contact Notes</label>\n        <textarea id=\"contact-notes-input\" class=\"form-control text-input field-input note-input\" name=\"contact[notes]\" placeholder=\"Contact Notes\"></textarea>\n      </div>\n\n\n      <div class=\"job-create-link-container form-group\">\n        <label>Would you like to associate a company with this contact?</label>\n        <div class=\"form-group\">\n          <span>Check Box for Yes</span>\n          <input id=\"job-create-link\" type=\"checkbox\" value=\"\">\n        </div>\n      </div>\n\n      <div id=\"job-category-radio-container\"></div>\n\n      <div class=\"display-dropdown-job\"></div>\n      <div class=\"display-alt-job\"></div>\n\n      <div class=\"form-group append-nonlink\"></div>\n      <div class=\"form-group display-jobs-dropdown\"></div>\n\n\n      <div class=\"form-group\">\n        <input class=\"btn btn-success submit-btn current\" name=\"submit\" type=\"submit\" value=\"Submit\">\n        <button type=\"button\" class=\"btn btn-danger submit-btn current get-communications-back-btn\">Cancel</button>\n      </div>\n    </fieldset>\n  </form>\n</div>\n";
	},"useData":true});

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "        <option class=\"form-control option-company-name\" name=\"contact[contact_ref_name]\" placeholder=\"reminder Type\" type=\"text\" data-company-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.company : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\" data-company-name=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.company : depth0)) != null ? stack1.name : stack1), depth0))
	    + "\" value=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\">"
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.full_name : stack1), depth0))
	    + "</option>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<div id=\"tag-contact-to-communication-select\" class=\"tag-select-container\">\n  <label>Contact Name Selection:</label>\n  <select id=\"select-option-contact-category\" class=\"form-control select-option-value\">\n      <option class=\"form-control blank-option\" placeholder=\"Blank\" type=\"text\" value=\"0\"></option>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.contacts : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "  </select>\n</div>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var communicationsApi = __webpack_require__(13);
	var communicationsUi = __webpack_require__(82);
	var getFormFields = __webpack_require__(38);
	var store = __webpack_require__(9);
	var linkLogic = __webpack_require__(62);
	var logic = __webpack_require__(16);
	// Communication EVENTS

	var onGetCommunications = function onGetCommunications(event) {
	  event.preventDefault();
	  var screenWidth = window.innerWidth;
	  if (screenWidth < 768) {
	    $(".nav-mobile-ul").slideUp();
	  }
	  communicationsApi.getCommunications().done(communicationsUi.getCommunicationSuccess).fail(communicationsUi.getCommunicationFailure);
	};

	var onShowCommunicationRecord = function onShowCommunicationRecord(event) {
	  event.preventDefault();
	  store.currentCommunicationId = $(this).attr("data-current-communication-id");
	  communicationsApi.showCommunication().done(communicationsUi.showCommunicationRecordSuccess).fail(communicationsUi.showCommunicationRecordFailure);
	};

	var onEditCommunication = function onEditCommunication(event) {
	  event.preventDefault();
	  store.currentCommunicationId = $(this).attr("data-current-communication-id");
	  store.currentJobRefId = $(this).attr("data-current-job-ref-id");
	  store.currentJobRefText = $(this).attr("data-current-job-ref-text");

	  // Template
	  var formCategory = "communication";
	  var listCategory = "job";
	  communicationsUi.generateUpdateForm(listCategory, formCategory);
	};

	var onCreateCommunication = function onCreateCommunication(event) {
	  event.preventDefault();
	  logic.convertPercentage();
	  var data = getFormFields(event.target);

	  var listCategory = "job";

	  var submitValue = linkLogic.obtainOptionVal(listCategory);

	  data.communication.job_ref_id = submitValue;

	  var submitText = linkLogic.obtainOptionText(listCategory);
	  data.communication.job_ref_text = submitText;

	  if (submitValue === -1) {
	    data.communication.job_ref_id = 0;
	    data.communication.job_ref_text = "";
	  }

	  data.communication.c_method = $("#communication-method-select").val();
	  data.communication.c_notes = $("#communication-notes-input").val();

	  data.communication.c_link = logic.convertToUrl(data.communication.c_link);

	  store.createCommunicationData = data;
	  store.lastShowCommunicationData = data;

	  communicationsApi.createCommunication(data).done(communicationsUi.createCommunicationSuccess).fail(communicationsUi.createCommunicationFailure);
	};

	var onDeleteCommunication = function onDeleteCommunication(event) {
	  event.preventDefault();
	  store.currentCommunicationId = $("#communication-record-delete").attr("data-current-communication-id");
	  communicationsApi.deleteCommunication(store.currentCommunicationId).done(communicationsUi.deleteCommunicationSuccess).fail(communicationsUi.deleteCommunicationFailure);
	};

	var onUpdateCommunication = function onUpdateCommunication(event) {
	  event.preventDefault();
	  logic.convertPercentage();
	  var data = getFormFields(event.target);

	  var prevJobRefId = store.currentJobRefId;
	  var prevJobRefText = store.currentJobRefText;
	  var isRefBeingUpdated = $("#job-update-link").prop("checked");
	  var isRadioNoChecked = $("#job-radio-no").prop("checked");
	  var isRadioYesChecked = $("#job-radio-yes").prop("checked");
	  var isEitherRadioChecked = $("#job-radio-no").prop("checked") || $("#job-radio-yes").prop("checked");

	  if (isRefBeingUpdated) {

	    if (isEitherRadioChecked) {
	      if (isRadioNoChecked) {
	        if ($("#alt-input-entry-job").val() === "") {
	          data.communication.job_ref_text = prevJobRefText;
	          data.communication.job_ref_id = prevJobRefId;
	        } else {
	          data.communication.job_ref_text = $("#alt-input-entry-job").val();
	          data.communication.job_ref_id = 0;
	        }
	      } else if (isRadioYesChecked) {
	        var jobRefIdSelected = parseInt($("#select-element-job").val());
	        if (jobRefIdSelected === -1) {
	          data.communication.job_ref_id = prevJobRefId;
	          data.communication.job_ref_text = prevJobRefText;
	        } else {
	          var _jobRefIdSelected = $("#select-element-job").val();
	          var textValueSelectDiv = "#select-element-job option[value=" + _jobRefIdSelected + "]";
	          data.communication.job_ref_id = _jobRefIdSelected;
	          data.communication.job_ref_text = $(textValueSelectDiv).text();
	        }
	      }
	    } else {
	      data.communication.job_ref_text = prevJobRefText;
	      data.communication.job_ref_id = prevJobRefId;
	    }
	  } else {
	    data.communication.job_ref_text = prevJobRefText;
	    data.communication.job_ref_id = prevJobRefId;
	  }

	  if (data.communication.job_ref_text === "Click to Select") {
	    data.communication.job_ref_text = prevJobRefText;
	    data.communication.job_ref_id = prevJobRefId;
	  }
	  data.communication.c_notes = $("#communication-notes-input").val();
	  data.communication.c_method = $("#communication-method-select").val();

	  data.communication.c_link = logic.convertToUrl(data.communication.c_link);

	  store.createCommunicationData = data;
	  store.lastShowCommunicationData = data;
	  communicationsApi.updateCommunication(data).done(communicationsUi.updateCommunicationSuccess).fail(communicationsUi.updateCommunicationFailure);
	};

	var onShowCommunicationCreateForm = function onShowCommunicationCreateForm(event) {
	  event.preventDefault();
	  communicationsUi.showCommunicationCreateForm();
	};

	var onDisplayJobDropdown = function onDisplayJobDropdown(event) {
	  event.preventDefault();
	  var formCategory = "communication";
	  var listCategory = "job";

	  var linkContainerSelect = ".display-dropdown-" + listCategory;

	  var altFormContainer = ".display-alt-" + listCategory;
	  var selectVal = parseInt($(this).val());

	  if (selectVal === 1) {
	    $(altFormContainer).children().remove();
	    linkLogic.showDropOptionsCreatePage(formCategory, listCategory);
	  } else {
	    $(linkContainerSelect).children().remove();
	    linkLogic.altOptionAppend(formCategory, listCategory);
	  }
	};

	var onHideShowUpdateOptions = function onHideShowUpdateOptions() {
	  var isUpdateChecked = $(this).prop("checked");
	  var radioButtonContainer = $(this).parent().parent().parent().children(".update-radio-container-btn");
	  if (isUpdateChecked) {
	    $(".job-radio-container input").prop("checked", false);
	    $(radioButtonContainer).show();
	  } else {
	    $(".job-radio-container input").prop("checked", false);
	    $("#communication-ref-text-alt-job-container").remove();
	    $(".display-dropdown-job").children().remove();
	    $(radioButtonContainer).hide();
	  }
	};

	var resizeTextArea = function resizeTextArea() {
	  var divId = $(this).attr("id");
	  logic.onResizeTextarea(divId);
	};

	var addHandlers = function addHandlers() {
	  $('.content').on('submit', '#new-communication-form', onCreateCommunication);
	  $('.content').on('submit', '#update-communication-form', onUpdateCommunication);
	  $('.content').on('click', '#communication-record-btn-edit', onEditCommunication);
	  $('.content').on('click', '#generate-create-communication-btn', onShowCommunicationCreateForm);
	  $('.content').on('click', '.dashboard-communication-record-btn', onShowCommunicationRecord);
	  $('#get-communications-btn').on('click', onGetCommunications);
	  $('.content').on('click', '.get-communications', onGetCommunications);
	  $('.content').on('click', '#communication-record-delete', onDeleteCommunication);
	  $('.content').on('change', "#job-update-link", onHideShowUpdateOptions);
	  $('.content').on('change', '.update-job', onDisplayJobDropdown);
	  $('.content').on('click', '.get-communications-back-btn', onGetCommunications);
	  $('.content').on('keyup', '#communication-details-input', resizeTextArea);
	  $('.content').on('keyup', '#communication-notes-input', resizeTextArea);
	};

	module.exports = {
	  addHandlers: addHandlers
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var store = __webpack_require__(9);
	var displayEditCommunication = __webpack_require__(83);
	var displayCommunicationDashboard = __webpack_require__(84);
	var displayCommunicationDetails = __webpack_require__(85);
	var displayCommunicationCreateForm = __webpack_require__(86);
	var communicationsApi = __webpack_require__(13);
	var displayRadioButtonsTemplate = __webpack_require__(60);
	var displayCommunicationOptions = __webpack_require__(87);
	var linkLogic = __webpack_require__(62);
	var logic = __webpack_require__(16);

	var getCommunicationSuccess = function getCommunicationSuccess(data) {
	  $(".notification-container").children().text("");
	  store.communicationDataForEdit = data;

	  $(".content").children().remove();

	  var communicationsArr = data.communications;

	  for (var i = 0; i < communicationsArr.length; i++) {
	    var unavailable = "N/A";
	    var currArrayRefText = communicationsArr[i].job_ref_text;
	    var currArrayDate = communicationsArr[i].c_date;
	    var currArraySubject = communicationsArr[i].c_subject;

	    if (currArrayRefText === "" || currArrayRefText === null) {
	      communicationsArr[i].job_ref_text = unavailable;
	    }
	    if (currArrayDate === "" || currArrayDate === null) {
	      communicationsArr[i].c_date = unavailable;
	    }
	    if (currArraySubject === "" || currArraySubject === null) {
	      communicationsArr[i].c_subject = unavailable;
	    }
	  }

	  var communicationDashboard = displayCommunicationDashboard({
	    communications: data.communications
	  });

	  $('.content').append(communicationDashboard);

	  var allCommunicationsEmptyLength = $(".communication-summary-table tbody").children().length;

	  if (allCommunicationsEmptyLength === 0) {
	    $(".communication-summary-table").remove();
	    $(".all-communications-empty").text('There are no communications associated with your account. Click "Create Communication" to get started.');
	  }
	  logic.dateFormatByClass();
	};

	var showCommunicationRecordSuccess = function showCommunicationRecordSuccess(data) {
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  store.lastShowCommunicationData = data;
	  store.lastShowCommunicationMethod = data.communication.c_method;

	  var communicationDetails = displayCommunicationDetails({
	    communication: data.communication
	  });
	  $('.content').append(communicationDetails);

	  logic.displayUrl();
	  logic.dateFormatByClass();
	};

	var showCommunicationRecordFailure = function showCommunicationRecordFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be displayed.");
	};

	var showCommunicationCreateForm = function showCommunicationCreateForm() {
	  var listCategory = "job";
	  var formCategory = "communication";

	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  var showCreateCommunicationForm = displayCommunicationCreateForm();
	  $('.content').append(showCreateCommunicationForm);

	  var radioTemplate = displayRadioButtonsTemplate();
	  $("#" + listCategory + "-category-radio-container").append(radioTemplate);

	  linkLogic.radioClassIdNameGen(formCategory, listCategory);
	  $("#job-category-radio-container").hide();

	  var defaultDate = logic.defaultDate();
	  $(".default-date").val(defaultDate);
	};

	var generateUpdateForm = function generateUpdateForm(listCategory, formCategory) {
	  $(".notification-container").children().text("");
	  $(".content").children().remove();

	  // data-current-c-method
	  var data = store.lastShowCommunicationData;

	  var editCommunication = displayEditCommunication({
	    communication: data.communication
	  });
	  $('.content').append(editCommunication);

	  var listLinkStatusSelector = "." + listCategory + "-tag-status";
	  var listRefId = store.currentJobRefId;

	  if (listRefId > 0) {
	    $(listLinkStatusSelector).text("Linked");
	  }

	  var updateFormId = "#update-" + formCategory + "-form";
	  var updateFormStatus = parseInt($(updateFormId).attr("data-update-form"));

	  if (updateFormStatus === 1) {
	    var categoryText = "." + listCategory + "-radio-container ";
	    $(categoryText).show();
	    $(".update-radio-container-btn").hide();
	  }

	  var currentRefTextValTxt = "." + listCategory + "-update-radio-text";

	  if (store.currentJobRefText === "") {
	    $(currentRefTextValTxt).text("N/A");
	  }

	  var defaultval = data.communication.c_method;

	  var selectText = $('#communication-method-select option[value="' + defaultval + '"]');

	  $(selectText).prop('selected', true);

	  var divId = "#communication-notes-input";
	  logic.textAreaHeightUpdate(divId);
	  var divIdTwo = "#communication-details-input";
	  logic.textAreaHeightUpdate(divIdTwo);
	};

	var getCommunicationFailure = function getCommunicationFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the records could not be retrieved.");
	};

	var createCommunicationSuccess = function createCommunicationSuccess(data) {
	  store.currentCommunicationId = data.communication.id;
	  $(".form-error").text("");
	  $(".notification-container").children().text("");
	  $(".success-alert").text("The record has been successfully created");
	  $(".content").children().remove();

	  var showCommunicationDetails = displayCommunicationDetails({
	    communication: store.createCommunicationData.communication
	  });
	  $(".content").append(showCommunicationDetails);
	  $(".current").attr("data-current-communication-id", store.currentCommunicationId);
	  logic.displayUrl();
	  logic.dateFormatByClass();
	};

	var deleteCommunicationSuccess = function deleteCommunicationSuccess() {
	  $(".notification-container").children().text("");
	  $(".success-alert").text("The record has been successfully deleted");
	  logic.dateFormatByClass();
	  communicationsApi.getCommunications().done(getCommunicationSuccess).fail(getCommunicationFailure);
	};

	var deleteCommunicationFailure = function deleteCommunicationFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be deleted.");
	};

	var updateCommunicationSuccess = function updateCommunicationSuccess(data) {

	  store.currentCommunicationId = data.communication.id;
	  $(".form-error").text("");
	  $(".notification-container").children().text("");
	  $(".content").children().remove();
	  $(".success-alert").text("The record has been successfully updated");

	  var showCommunicationDetails = displayCommunicationDetails({
	    communication: data.communication
	  });
	  $(".content").append(showCommunicationDetails);
	  $(".current").attr("data-current-communication-id", store.currentCommunicationId);
	  logic.displayUrl();
	  logic.dateFormatByClass();
	};

	var displayCommunicationDropdownSuccess = function displayCommunicationDropdownSuccess(data) {
	  $(".notification-container").children().text("");

	  var companyOptionDisplay = displayCommunicationOptions({
	    communications: data.communications
	  });

	  var dataUpdateFormVal = parseInt($("#update-communication-form").attr("data-update-form"));

	  $('.associate-reminder-with-communication-container').append(companyOptionDisplay);

	  if (dataUpdateFormVal === 1) {
	    var currentCommunicationId = store.currentCommunicationId;
	    var valueString = '#select-option-communication-name option[value=' + currentCommunicationId + ']';
	    $(valueString).prop('selected', true);
	  }
	};

	var createCommunicationFailure = function createCommunicationFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be created. Please make sure all required fields are filled");
	};

	var updateCommunicationFailure = function updateCommunicationFailure() {
	  $(".notification-container").children().text("");
	  $(".failure-alert").text("An error has occured and the record could not be updated. Please make sure all required fields are filled");
	};

	module.exports = {
	  getCommunicationSuccess: getCommunicationSuccess,
	  showCommunicationRecordSuccess: showCommunicationRecordSuccess,
	  deleteCommunicationSuccess: deleteCommunicationSuccess,
	  deleteCommunicationFailure: deleteCommunicationFailure,
	  showCommunicationCreateForm: showCommunicationCreateForm,
	  getCommunicationFailure: getCommunicationFailure,
	  updateCommunicationSuccess: updateCommunicationSuccess,
	  showCommunicationRecordFailure: showCommunicationRecordFailure,
	  createCommunicationSuccess: createCommunicationSuccess,
	  displayCommunicationDropdownSuccess: displayCommunicationDropdownSuccess,
	  displayCommunicationOptions: displayCommunicationOptions,
	  generateUpdateForm: generateUpdateForm,
	  createCommunicationFailure: createCommunicationFailure,
	  updateCommunicationFailure: updateCommunicationFailure
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "<div class=\"update-communication-form-container form-container communication-page group-category\">\n  <form class=\"form communication-form reminder-form\" id=\"update-communication-form\" name=\"update-communication-form\" data-update-form=\"1\">\n    <fieldset>\n      <legend>Update Communication Form</legend>\n      <p id=\"update-communication-error\" class=\"warning form-error\"></p>\n      <p>All fields are <u>optional</u> unless otherwise indicated</p>\n\n      <div class=\"form-group\">\n        <label>Communication Date</label>\n        <input class=\"form-control required-field communication-date\" name=\"communication[c_date]\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_date : stack1), depth0))
	    + "\" placeholder=\"Communication Date\" type=\"date\">\n      </div>\n\n      <div class=\"form-group c-method\">\n        <label>Communication Method (required)</label>\n        <select class=\"form-control\" id=\"communication-method-select\" data-current-c-method=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_method : stack1), depth0))
	    + "\">\n            <option class=\"form-control required-field\" name=\"communication[c_method]\" placeholder=\"Communication Method\" type=\"text\" value=\"Email\">Email</option>\n            <option class=\"form-control required-field\" name=\"communication[c_method]\" placeholder=\"Communication Method\" type=\"text\" value=\"Phone\">Phone</option>\n            <option class=\"form-control required-field\" name=\"communication[c_method]\" placeholder=\"Communication Method\" type=\"text\" value=\"Linkedin\">LinkedIn</option>\n            <option class=\"form-control required-field\" name=\"communication[c_method]\" placeholder=\"Communication Method\" type=\"text\" value=\"Meeting\">Meeting</option>\n            <option class=\"form-control required-field\" name=\"communication[c_method]\" placeholder=\"Communication Method\" type=\"text\" value=\"Other\">Other</option>\n        </select>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Communication Subject (required)</label>\n        <input class=\"form-control text-input required-field communication-subject\" name=\"communication[c_subject]\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_subject : stack1), depth0))
	    + "\" placeholder=\"Communication Subject\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Communication Details</label>\n        <textarea id=\"communication-details-input\" class=\"form-control text-input field-input communication-details\" name=\"communication[c_details]\" placeholder=\"Communication Details\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_details : stack1), depth0))
	    + "</textarea>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Communication Link</label>\n        <input class=\"form-control text-input required-field\" name=\"communication[c_link]\" placeholder=\"Communication Link\" type=\"text\" value=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_link : stack1), depth0))
	    + "\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Communication Notes</label>\n        <textarea id=\"communication-notes-input\" class=\"form-control text-input field-input communication-notes\" name=\"communication[c_notes]\" placeholder=\"Communication Notes\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_notes : stack1), depth0))
	    + "</textarea>\n      </div>\n\n      <div class=\"form-group job-radio-container current-value-update-page\">\n        <label>Current Company Association:</label>\n        <div class=\"update-radio-link-value-status-container\">\n          <p>The company currently associated with this communication is: <span class=\"job-update-radio-text\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "</span></p>\n          <p>Link Status: <span class=\"job-tag-status\" data-current-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\">Not Linked</span></p>\n        </div>\n      </div>\n\n      <div>\n        <div class=\"job-update-link-container form-group\">\n          <label>Would you like to update the communication's company?</label>\n          <div class=\"form-group\">\n            <span>Check Box for Yes</span>\n            <input id=\"job-update-link\" type=\"checkbox\" value=\"\">\n          </div>\n        </div>\n        <div class=\"form-group job-radio-container update-radio-container-btn\">\n          <label>Will this updated company be tagged to the communication?</label>\n          <label><input id=\"job-radio-yes\" class=\"job-category\" type=\"radio\" name=\"job-radio\" value=\"1\">Yes</label>\n          <label><input id=\"job-radio-no\" class=\"job-category\" type=\"radio\" name=\"job-radio\" value=\"0\">No</label>\n        </div>\n      </div>\n\n      <div class=\"form-group display-alt-job\"></div>\n      <div class=\"form-group display-dropdown-job\"></div>\n\n      <div class=\"form-group\">\n        <input class=\"btn btn-success submit-btn current\" name=\"submit\" id=\"submit-communication-update-btn\" type=\"submit\" value=\"Submit\" data-current-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-ref-text=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\">\n        <button type=\"button\" class=\"btn btn-danger submit-btn current get-communications-back-btn\">Cancel</button>\n      </div>\n    </fieldset>\n  </form>\n</div>\n";
	},"useData":true});

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "            <tr>\n              <td class=\"format-date hidden-xs\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.c_date : stack1), depth0))
	    + "\n              </td>\n              <td class=\"hidden-xs\">\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.c_method : stack1), depth0))
	    + "\n              </td>\n              <td>\n                "
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.c_subject : stack1), depth0))
	    + "\n              </td>\n              <td class=\"display-communication-submit\">\n                <button type=\"button\" class=\"btn btn-default btn-sm dashboard-communication-record-btn\" data-current-communication-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-company-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_ref_id : stack1), depth0))
	    + "\" data-current-job-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\" data-current-document-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.document_ref_id : stack1), depth0))
	    + "\">View</button>\n              </td>\n            </tr>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<div class=\"communication-page group-category\">\n\n  <div class=\"row\">\n    <div class=\"col-md-10 col-md-offset-1 col-xs-12 col-xs-offset-0\">\n      <h1>Communication Dashboard</h1>\n\n      <table class=\"table communication-summary-table table-hover\">\n        <thead>\n          <tr>\n            <th class=\"hidden-xs\">Date</th>\n            <th class=\"hidden-xs\">Communication Method</th>\n            <th>Communication Subject</th>\n            <th>View Record</th>\n          </tr>\n        </thead>\n        <tbody>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.communications : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "        </tbody>\n      </table>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-10 col-md-offset-1 col-xs-12 col-xs-offset-0\"><p class=\"all-communications-empty\"></p></div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <div class=\"dashboard-container\">\n        <button id=\"generate-create-communication-btn\" type=\"button\" class=\"btn btn-success\">Create Communication</button>\n      </div>\n    </div>\n  </div>\n</div>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "<div class=\"communication-page group-category\">\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-xs-offset-0 col-sm-9\">\n\n      <h1>Communication Details</h1>\n      <table class=\"table communication-record-table\">\n        <tbody>\n          <tr>\n            <td>\n              Communication Date:\n            </td>\n            <td class=\"format-date\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_date : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td class=\"communication-record-last-name\">\n              Company Name:\n            </td>\n            <td class=\"linked-company\" data-job-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td class=\"communication-job-title\">\n              Job Title:\n            </td>\n            <td class=\"display-communication-job-title\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_subject : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td class=\"company-name\">\n              Communication Method\n            </td>\n            <td class=\"display-communication-company-name\">\n              "
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_method : stack1), depth0))
	    + "\n            </td>\n          </tr>\n          <tr>\n            <td class=\"c-url-link\">\n              Communication Url Link\n            </td>\n            <td class=\"display-communication-phone\">\n              <a class=\"display-url\" href=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_link : stack1), depth0))
	    + "\" target=\"_blank\">N/A</a>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"underline\">Communication Details:</p>\n              <p class=\"maintain-spacing\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_details : stack1), depth0))
	    + "</p>\n            </td>\n          </tr>\n          <tr>\n            <td colspan=\"2\">\n              <p class=\"underline\">Communication Notes:</p>\n              <p class=\"maintain-spacing\">"
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_notes : stack1), depth0))
	    + "</p>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-xs-offset-0 col-sm-9\">\n      <div class=\"communication-record-btn-options center\">\n        <button type=\"button\" class=\"btn btn-default current get-communications-back-btn\">Back</button>\n        <button id=\"communication-record-btn-edit\" type=\"button\" class=\"btn btn-warning current\" data-current-c-method=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.c_method : stack1), depth0))
	    + "\" data-current-communication-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\" data-current-job-ref-text=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.job_ref_text : stack1), depth0))
	    + "\"\n            data-current-job-ref-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.job_ref_id : stack1), depth0))
	    + "\">Edit Communication Record</button>\n        <button id=\"communication-record-delete\" type=\"button\" class=\"btn btn-danger current\" data-current-communication-id=\""
	    + alias2(alias1(((stack1 = (depth0 != null ? depth0.communication : depth0)) != null ? stack1.id : stack1), depth0))
	    + "\">Delete Communication Record</button>\n      </div>\n    </div>\n  </div>\n\n</div>\n";
	},"useData":true});

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    return "<div class=\"create-communication-form-container form-container form-group communication-page group-category\">\n  <h1>Create a Communication</h1>\n\n  <form class=\"form communication-form\" id=\"new-communication-form\" name=\"new-communication-form\">\n    <fieldset>\n      <p id=\"create-communication-error\" class=\"warning form-error\"></p>\n      <p>All fields are <u>optional</u> unless otherwise indicated</p>\n\n      <div class=\"form-group\">\n        <!-- <label>Communication Date <span class=\"clear-default-date\">&#10005;</span></label> -->\n        <label>Communication Date</label>\n        <input class=\"default-date form-control required-field communication-date\" name=\"communication[c_date]\" placeholder=\"Communication Date\" type=\"date\">\n      </div>\n\n      <div class=\"form-group c-method\">\n        <label>Communication Method (required)</label>\n        <select class=\"form-control\" id=\"communication-method-select\">\n            <option class=\"form-control required-field\" name=\"communication[c_method]\" placeholder=\"Communication Method\" type=\"text\" value=\"Email\">Email</option>\n            <option class=\"form-control required-field\" name=\"communication[c_method]\" placeholder=\"Communication Method\" type=\"text\" value=\"Phone\">Phone</option>\n            <option class=\"form-control required-field\" name=\"communication[c_method]\" placeholder=\"Communication Method\" type=\"text\" value=\"Linkedin\">LinkedIn</option>\n            <option class=\"form-control required-field\" name=\"communication[c_method]\" placeholder=\"Communication Method\" type=\"text\" value=\"Meeting\">Meeting</option>\n            <option class=\"form-control required-field\" name=\"communication[c_method]\" placeholder=\"Communication Method\" type=\"text\" value=\"Other\">Other</option>\n        </select>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Communication Subject (required)</label>\n        <input class=\"form-control text-input required-field communication-subject\" name=\"communication[c_subject]\" placeholder=\"Communication Subject\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Communication Url</label>\n        <input class=\"form-control text-input required-field\" name=\"communication[c_link]\" placeholder=\"Communication Link\" type=\"text\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>Communication Details</label>\n        <textarea id=\"communication-details-input\" class=\"create-textarea text-input form-control field-input communication-details\" name=\"communication[c_details]\" placeholder=\"Communication Details\"></textarea>\n      </div>\n\n      <div class=\"form-group\">\n        <label>Communication Notes</label>\n        <textarea id=\"communication-notes-input\" class=\"create-textarea text-input form-control field-input communication-notes\" name=\"communication[c_notes]\" placeholder=\"Communication Notes\"></textarea>\n      </div>\n\n      <div class=\"job-create-link-container form-group\">\n        <label>Would you like to associate a company with this communication?</label>\n        <div class=\"form-group\">\n          <span>Check Box for Yes</span>\n          <input id=\"job-create-link\" type=\"checkbox\" value=\"\">\n        </div>\n      </div>\n\n      <div id=\"job-category-radio-container\"></div>\n\n      <div class=\"display-dropdown-job\"></div>\n      <div class=\"display-alt-job\"></div>\n\n      <div class=\"form-group append-nonlink\"></div>\n      <div class=\"form-group display-jobs-dropdown\"></div>\n\n      <div class=\"form-group\">\n        <input class=\"btn btn-success submit-btn current\" name=\"submit\" id=\"create-communication-btn\" type=\"submit\" value=\"Submit\">\n        <button type=\"button\" class=\"btn btn-danger submit-btn current get-communications-back-btn\">Cancel</button>\n      </div>\n    </fieldset>\n  </form>\n</div>\n";
	},"useData":true});

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(18);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

	  return "        <option class=\"form-control option-company-name\" name=\"job[company_name]\" placeholder=\"reminder Type\" type=\"text\" data-job-id=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\" data-job-name=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_name : stack1), depth0))
	    + "\" value=\""
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
	    + "\">"
	    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.company_name : stack1), depth0))
	    + "</option>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
	    var stack1;

	  return "<div id=\"tag-job-to-communication-select\" class=\"tag-select-container job-category-select-container\">\n  <select id=\"select-option-job-category\" class=\"form-control select-option-value\">\n      <option class=\"form-control blank-option\" placeholder=\"Blank\" type=\"text\" value=\"0\">Click to Select</option>\n"
	    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.jobs : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
	    + "  </select>\n</div>\n";
	},"useData":true,"useBlockParams":true});

/***/ },
/* 88 */
/***/ function(module, exports) {

	'use strict';

	module.exports = true;

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(90);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(97)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/index.js!./index.scss", function() {
				var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/index.js!./index.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(91)();
	// imports


	// module
	exports.push([module.id, "@charset \"UTF-8\";\n/*!\n * Bootstrap v3.3.7 (http://getbootstrap.com)\n * Copyright 2011-2016 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\nhtml {\n  font-family: sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%; }\n\nbody {\n  margin: 0; }\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  vertical-align: baseline; }\n\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n[hidden],\ntemplate {\n  display: none; }\n\na {\n  background-color: transparent; }\n\na:active,\na:hover {\n  outline: 0; }\n\nabbr[title] {\n  border-bottom: 1px dotted; }\n\nb,\nstrong {\n  font-weight: bold; }\n\ndfn {\n  font-style: italic; }\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\nmark {\n  background: #ff0;\n  color: #000; }\n\nsmall {\n  font-size: 80%; }\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\nimg {\n  border: 0; }\n\nsvg:not(:root) {\n  overflow: hidden; }\n\nfigure {\n  margin: 1em 40px; }\n\nhr {\n  box-sizing: content-box;\n  height: 0; }\n\npre {\n  overflow: auto; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  font: inherit;\n  margin: 0; }\n\nbutton {\n  overflow: visible; }\n\nbutton,\nselect {\n  text-transform: none; }\n\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer; }\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default; }\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\ninput {\n  line-height: normal; }\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  box-sizing: content-box; }\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\nlegend {\n  border: 0;\n  padding: 0; }\n\ntextarea {\n  overflow: auto; }\n\noptgroup {\n  font-weight: bold; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n\n/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */\n@media print {\n  *,\n  *:before,\n  *:after {\n    background: transparent !important;\n    color: #000 !important;\n    box-shadow: none !important;\n    text-shadow: none !important; }\n  a,\n  a:visited {\n    text-decoration: underline; }\n  a[href]:after {\n    content: \" (\" attr(href) \")\"; }\n  abbr[title]:after {\n    content: \" (\" attr(title) \")\"; }\n  a[href^=\"#\"]:after,\n  a[href^=\"javascript:\"]:after {\n    content: \"\"; }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid; }\n  thead {\n    display: table-header-group; }\n  tr,\n  img {\n    page-break-inside: avoid; }\n  img {\n    max-width: 100% !important; }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3; }\n  h2,\n  h3 {\n    page-break-after: avoid; }\n  .navbar {\n    display: none; }\n  .btn > .caret,\n  .dropup > .btn > .caret {\n    border-top-color: #000 !important; }\n  .label {\n    border: 1px solid #000; }\n  .table {\n    border-collapse: collapse !important; }\n    .table td,\n    .table th {\n      background-color: #fff !important; }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #ddd !important; } }\n\n@font-face {\n  font-family: 'Glyphicons Halflings';\n  src: url(" + __webpack_require__(92) + ");\n  src: url(" + __webpack_require__(92) + "?#iefix) format(\"embedded-opentype\"), url(" + __webpack_require__(93) + ") format(\"woff2\"), url(" + __webpack_require__(94) + ") format(\"woff\"), url(" + __webpack_require__(95) + ") format(\"truetype\"), url(" + __webpack_require__(96) + "#glyphicons_halflingsregular) format(\"svg\"); }\n\n.glyphicon {\n  position: relative;\n  top: 1px;\n  display: inline-block;\n  font-family: 'Glyphicons Halflings';\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.glyphicon-asterisk:before {\n  content: \"*\"; }\n\n.glyphicon-plus:before {\n  content: \"+\"; }\n\n.glyphicon-euro:before,\n.glyphicon-eur:before {\n  content: \"\\20AC\"; }\n\n.glyphicon-minus:before {\n  content: \"\\2212\"; }\n\n.glyphicon-cloud:before {\n  content: \"\\2601\"; }\n\n.glyphicon-envelope:before {\n  content: \"\\2709\"; }\n\n.glyphicon-pencil:before {\n  content: \"\\270F\"; }\n\n.glyphicon-glass:before {\n  content: \"\\E001\"; }\n\n.glyphicon-music:before {\n  content: \"\\E002\"; }\n\n.glyphicon-search:before {\n  content: \"\\E003\"; }\n\n.glyphicon-heart:before {\n  content: \"\\E005\"; }\n\n.glyphicon-star:before {\n  content: \"\\E006\"; }\n\n.glyphicon-star-empty:before {\n  content: \"\\E007\"; }\n\n.glyphicon-user:before {\n  content: \"\\E008\"; }\n\n.glyphicon-film:before {\n  content: \"\\E009\"; }\n\n.glyphicon-th-large:before {\n  content: \"\\E010\"; }\n\n.glyphicon-th:before {\n  content: \"\\E011\"; }\n\n.glyphicon-th-list:before {\n  content: \"\\E012\"; }\n\n.glyphicon-ok:before {\n  content: \"\\E013\"; }\n\n.glyphicon-remove:before {\n  content: \"\\E014\"; }\n\n.glyphicon-zoom-in:before {\n  content: \"\\E015\"; }\n\n.glyphicon-zoom-out:before {\n  content: \"\\E016\"; }\n\n.glyphicon-off:before {\n  content: \"\\E017\"; }\n\n.glyphicon-signal:before {\n  content: \"\\E018\"; }\n\n.glyphicon-cog:before {\n  content: \"\\E019\"; }\n\n.glyphicon-trash:before {\n  content: \"\\E020\"; }\n\n.glyphicon-home:before {\n  content: \"\\E021\"; }\n\n.glyphicon-file:before {\n  content: \"\\E022\"; }\n\n.glyphicon-time:before {\n  content: \"\\E023\"; }\n\n.glyphicon-road:before {\n  content: \"\\E024\"; }\n\n.glyphicon-download-alt:before {\n  content: \"\\E025\"; }\n\n.glyphicon-download:before {\n  content: \"\\E026\"; }\n\n.glyphicon-upload:before {\n  content: \"\\E027\"; }\n\n.glyphicon-inbox:before {\n  content: \"\\E028\"; }\n\n.glyphicon-play-circle:before {\n  content: \"\\E029\"; }\n\n.glyphicon-repeat:before {\n  content: \"\\E030\"; }\n\n.glyphicon-refresh:before {\n  content: \"\\E031\"; }\n\n.glyphicon-list-alt:before {\n  content: \"\\E032\"; }\n\n.glyphicon-lock:before {\n  content: \"\\E033\"; }\n\n.glyphicon-flag:before {\n  content: \"\\E034\"; }\n\n.glyphicon-headphones:before {\n  content: \"\\E035\"; }\n\n.glyphicon-volume-off:before {\n  content: \"\\E036\"; }\n\n.glyphicon-volume-down:before {\n  content: \"\\E037\"; }\n\n.glyphicon-volume-up:before {\n  content: \"\\E038\"; }\n\n.glyphicon-qrcode:before {\n  content: \"\\E039\"; }\n\n.glyphicon-barcode:before {\n  content: \"\\E040\"; }\n\n.glyphicon-tag:before {\n  content: \"\\E041\"; }\n\n.glyphicon-tags:before {\n  content: \"\\E042\"; }\n\n.glyphicon-book:before {\n  content: \"\\E043\"; }\n\n.glyphicon-bookmark:before {\n  content: \"\\E044\"; }\n\n.glyphicon-print:before {\n  content: \"\\E045\"; }\n\n.glyphicon-camera:before {\n  content: \"\\E046\"; }\n\n.glyphicon-font:before {\n  content: \"\\E047\"; }\n\n.glyphicon-bold:before {\n  content: \"\\E048\"; }\n\n.glyphicon-italic:before {\n  content: \"\\E049\"; }\n\n.glyphicon-text-height:before {\n  content: \"\\E050\"; }\n\n.glyphicon-text-width:before {\n  content: \"\\E051\"; }\n\n.glyphicon-align-left:before {\n  content: \"\\E052\"; }\n\n.glyphicon-align-center:before {\n  content: \"\\E053\"; }\n\n.glyphicon-align-right:before {\n  content: \"\\E054\"; }\n\n.glyphicon-align-justify:before {\n  content: \"\\E055\"; }\n\n.glyphicon-list:before {\n  content: \"\\E056\"; }\n\n.glyphicon-indent-left:before {\n  content: \"\\E057\"; }\n\n.glyphicon-indent-right:before {\n  content: \"\\E058\"; }\n\n.glyphicon-facetime-video:before {\n  content: \"\\E059\"; }\n\n.glyphicon-picture:before {\n  content: \"\\E060\"; }\n\n.glyphicon-map-marker:before {\n  content: \"\\E062\"; }\n\n.glyphicon-adjust:before {\n  content: \"\\E063\"; }\n\n.glyphicon-tint:before {\n  content: \"\\E064\"; }\n\n.glyphicon-edit:before {\n  content: \"\\E065\"; }\n\n.glyphicon-share:before {\n  content: \"\\E066\"; }\n\n.glyphicon-check:before {\n  content: \"\\E067\"; }\n\n.glyphicon-move:before {\n  content: \"\\E068\"; }\n\n.glyphicon-step-backward:before {\n  content: \"\\E069\"; }\n\n.glyphicon-fast-backward:before {\n  content: \"\\E070\"; }\n\n.glyphicon-backward:before {\n  content: \"\\E071\"; }\n\n.glyphicon-play:before {\n  content: \"\\E072\"; }\n\n.glyphicon-pause:before {\n  content: \"\\E073\"; }\n\n.glyphicon-stop:before {\n  content: \"\\E074\"; }\n\n.glyphicon-forward:before {\n  content: \"\\E075\"; }\n\n.glyphicon-fast-forward:before {\n  content: \"\\E076\"; }\n\n.glyphicon-step-forward:before {\n  content: \"\\E077\"; }\n\n.glyphicon-eject:before {\n  content: \"\\E078\"; }\n\n.glyphicon-chevron-left:before {\n  content: \"\\E079\"; }\n\n.glyphicon-chevron-right:before {\n  content: \"\\E080\"; }\n\n.glyphicon-plus-sign:before {\n  content: \"\\E081\"; }\n\n.glyphicon-minus-sign:before {\n  content: \"\\E082\"; }\n\n.glyphicon-remove-sign:before {\n  content: \"\\E083\"; }\n\n.glyphicon-ok-sign:before {\n  content: \"\\E084\"; }\n\n.glyphicon-question-sign:before {\n  content: \"\\E085\"; }\n\n.glyphicon-info-sign:before {\n  content: \"\\E086\"; }\n\n.glyphicon-screenshot:before {\n  content: \"\\E087\"; }\n\n.glyphicon-remove-circle:before {\n  content: \"\\E088\"; }\n\n.glyphicon-ok-circle:before {\n  content: \"\\E089\"; }\n\n.glyphicon-ban-circle:before {\n  content: \"\\E090\"; }\n\n.glyphicon-arrow-left:before {\n  content: \"\\E091\"; }\n\n.glyphicon-arrow-right:before {\n  content: \"\\E092\"; }\n\n.glyphicon-arrow-up:before {\n  content: \"\\E093\"; }\n\n.glyphicon-arrow-down:before {\n  content: \"\\E094\"; }\n\n.glyphicon-share-alt:before {\n  content: \"\\E095\"; }\n\n.glyphicon-resize-full:before {\n  content: \"\\E096\"; }\n\n.glyphicon-resize-small:before {\n  content: \"\\E097\"; }\n\n.glyphicon-exclamation-sign:before {\n  content: \"\\E101\"; }\n\n.glyphicon-gift:before {\n  content: \"\\E102\"; }\n\n.glyphicon-leaf:before {\n  content: \"\\E103\"; }\n\n.glyphicon-fire:before {\n  content: \"\\E104\"; }\n\n.glyphicon-eye-open:before {\n  content: \"\\E105\"; }\n\n.glyphicon-eye-close:before {\n  content: \"\\E106\"; }\n\n.glyphicon-warning-sign:before {\n  content: \"\\E107\"; }\n\n.glyphicon-plane:before {\n  content: \"\\E108\"; }\n\n.glyphicon-calendar:before {\n  content: \"\\E109\"; }\n\n.glyphicon-random:before {\n  content: \"\\E110\"; }\n\n.glyphicon-comment:before {\n  content: \"\\E111\"; }\n\n.glyphicon-magnet:before {\n  content: \"\\E112\"; }\n\n.glyphicon-chevron-up:before {\n  content: \"\\E113\"; }\n\n.glyphicon-chevron-down:before {\n  content: \"\\E114\"; }\n\n.glyphicon-retweet:before {\n  content: \"\\E115\"; }\n\n.glyphicon-shopping-cart:before {\n  content: \"\\E116\"; }\n\n.glyphicon-folder-close:before {\n  content: \"\\E117\"; }\n\n.glyphicon-folder-open:before {\n  content: \"\\E118\"; }\n\n.glyphicon-resize-vertical:before {\n  content: \"\\E119\"; }\n\n.glyphicon-resize-horizontal:before {\n  content: \"\\E120\"; }\n\n.glyphicon-hdd:before {\n  content: \"\\E121\"; }\n\n.glyphicon-bullhorn:before {\n  content: \"\\E122\"; }\n\n.glyphicon-bell:before {\n  content: \"\\E123\"; }\n\n.glyphicon-certificate:before {\n  content: \"\\E124\"; }\n\n.glyphicon-thumbs-up:before {\n  content: \"\\E125\"; }\n\n.glyphicon-thumbs-down:before {\n  content: \"\\E126\"; }\n\n.glyphicon-hand-right:before {\n  content: \"\\E127\"; }\n\n.glyphicon-hand-left:before {\n  content: \"\\E128\"; }\n\n.glyphicon-hand-up:before {\n  content: \"\\E129\"; }\n\n.glyphicon-hand-down:before {\n  content: \"\\E130\"; }\n\n.glyphicon-circle-arrow-right:before {\n  content: \"\\E131\"; }\n\n.glyphicon-circle-arrow-left:before {\n  content: \"\\E132\"; }\n\n.glyphicon-circle-arrow-up:before {\n  content: \"\\E133\"; }\n\n.glyphicon-circle-arrow-down:before {\n  content: \"\\E134\"; }\n\n.glyphicon-globe:before {\n  content: \"\\E135\"; }\n\n.glyphicon-wrench:before {\n  content: \"\\E136\"; }\n\n.glyphicon-tasks:before {\n  content: \"\\E137\"; }\n\n.glyphicon-filter:before {\n  content: \"\\E138\"; }\n\n.glyphicon-briefcase:before {\n  content: \"\\E139\"; }\n\n.glyphicon-fullscreen:before {\n  content: \"\\E140\"; }\n\n.glyphicon-dashboard:before {\n  content: \"\\E141\"; }\n\n.glyphicon-paperclip:before {\n  content: \"\\E142\"; }\n\n.glyphicon-heart-empty:before {\n  content: \"\\E143\"; }\n\n.glyphicon-link:before {\n  content: \"\\E144\"; }\n\n.glyphicon-phone:before {\n  content: \"\\E145\"; }\n\n.glyphicon-pushpin:before {\n  content: \"\\E146\"; }\n\n.glyphicon-usd:before {\n  content: \"\\E148\"; }\n\n.glyphicon-gbp:before {\n  content: \"\\E149\"; }\n\n.glyphicon-sort:before {\n  content: \"\\E150\"; }\n\n.glyphicon-sort-by-alphabet:before {\n  content: \"\\E151\"; }\n\n.glyphicon-sort-by-alphabet-alt:before {\n  content: \"\\E152\"; }\n\n.glyphicon-sort-by-order:before {\n  content: \"\\E153\"; }\n\n.glyphicon-sort-by-order-alt:before {\n  content: \"\\E154\"; }\n\n.glyphicon-sort-by-attributes:before {\n  content: \"\\E155\"; }\n\n.glyphicon-sort-by-attributes-alt:before {\n  content: \"\\E156\"; }\n\n.glyphicon-unchecked:before {\n  content: \"\\E157\"; }\n\n.glyphicon-expand:before {\n  content: \"\\E158\"; }\n\n.glyphicon-collapse-down:before {\n  content: \"\\E159\"; }\n\n.glyphicon-collapse-up:before {\n  content: \"\\E160\"; }\n\n.glyphicon-log-in:before {\n  content: \"\\E161\"; }\n\n.glyphicon-flash:before {\n  content: \"\\E162\"; }\n\n.glyphicon-log-out:before {\n  content: \"\\E163\"; }\n\n.glyphicon-new-window:before {\n  content: \"\\E164\"; }\n\n.glyphicon-record:before {\n  content: \"\\E165\"; }\n\n.glyphicon-save:before {\n  content: \"\\E166\"; }\n\n.glyphicon-open:before {\n  content: \"\\E167\"; }\n\n.glyphicon-saved:before {\n  content: \"\\E168\"; }\n\n.glyphicon-import:before {\n  content: \"\\E169\"; }\n\n.glyphicon-export:before {\n  content: \"\\E170\"; }\n\n.glyphicon-send:before {\n  content: \"\\E171\"; }\n\n.glyphicon-floppy-disk:before {\n  content: \"\\E172\"; }\n\n.glyphicon-floppy-saved:before {\n  content: \"\\E173\"; }\n\n.glyphicon-floppy-remove:before {\n  content: \"\\E174\"; }\n\n.glyphicon-floppy-save:before {\n  content: \"\\E175\"; }\n\n.glyphicon-floppy-open:before {\n  content: \"\\E176\"; }\n\n.glyphicon-credit-card:before {\n  content: \"\\E177\"; }\n\n.glyphicon-transfer:before {\n  content: \"\\E178\"; }\n\n.glyphicon-cutlery:before {\n  content: \"\\E179\"; }\n\n.glyphicon-header:before {\n  content: \"\\E180\"; }\n\n.glyphicon-compressed:before {\n  content: \"\\E181\"; }\n\n.glyphicon-earphone:before {\n  content: \"\\E182\"; }\n\n.glyphicon-phone-alt:before {\n  content: \"\\E183\"; }\n\n.glyphicon-tower:before {\n  content: \"\\E184\"; }\n\n.glyphicon-stats:before {\n  content: \"\\E185\"; }\n\n.glyphicon-sd-video:before {\n  content: \"\\E186\"; }\n\n.glyphicon-hd-video:before {\n  content: \"\\E187\"; }\n\n.glyphicon-subtitles:before {\n  content: \"\\E188\"; }\n\n.glyphicon-sound-stereo:before {\n  content: \"\\E189\"; }\n\n.glyphicon-sound-dolby:before {\n  content: \"\\E190\"; }\n\n.glyphicon-sound-5-1:before {\n  content: \"\\E191\"; }\n\n.glyphicon-sound-6-1:before {\n  content: \"\\E192\"; }\n\n.glyphicon-sound-7-1:before {\n  content: \"\\E193\"; }\n\n.glyphicon-copyright-mark:before {\n  content: \"\\E194\"; }\n\n.glyphicon-registration-mark:before {\n  content: \"\\E195\"; }\n\n.glyphicon-cloud-download:before {\n  content: \"\\E197\"; }\n\n.glyphicon-cloud-upload:before {\n  content: \"\\E198\"; }\n\n.glyphicon-tree-conifer:before {\n  content: \"\\E199\"; }\n\n.glyphicon-tree-deciduous:before {\n  content: \"\\E200\"; }\n\n.glyphicon-cd:before {\n  content: \"\\E201\"; }\n\n.glyphicon-save-file:before {\n  content: \"\\E202\"; }\n\n.glyphicon-open-file:before {\n  content: \"\\E203\"; }\n\n.glyphicon-level-up:before {\n  content: \"\\E204\"; }\n\n.glyphicon-copy:before {\n  content: \"\\E205\"; }\n\n.glyphicon-paste:before {\n  content: \"\\E206\"; }\n\n.glyphicon-alert:before {\n  content: \"\\E209\"; }\n\n.glyphicon-equalizer:before {\n  content: \"\\E210\"; }\n\n.glyphicon-king:before {\n  content: \"\\E211\"; }\n\n.glyphicon-queen:before {\n  content: \"\\E212\"; }\n\n.glyphicon-pawn:before {\n  content: \"\\E213\"; }\n\n.glyphicon-bishop:before {\n  content: \"\\E214\"; }\n\n.glyphicon-knight:before {\n  content: \"\\E215\"; }\n\n.glyphicon-baby-formula:before {\n  content: \"\\E216\"; }\n\n.glyphicon-tent:before {\n  content: \"\\26FA\"; }\n\n.glyphicon-blackboard:before {\n  content: \"\\E218\"; }\n\n.glyphicon-bed:before {\n  content: \"\\E219\"; }\n\n.glyphicon-apple:before {\n  content: \"\\F8FF\"; }\n\n.glyphicon-erase:before {\n  content: \"\\E221\"; }\n\n.glyphicon-hourglass:before {\n  content: \"\\231B\"; }\n\n.glyphicon-lamp:before {\n  content: \"\\E223\"; }\n\n.glyphicon-duplicate:before {\n  content: \"\\E224\"; }\n\n.glyphicon-piggy-bank:before {\n  content: \"\\E225\"; }\n\n.glyphicon-scissors:before {\n  content: \"\\E226\"; }\n\n.glyphicon-bitcoin:before {\n  content: \"\\E227\"; }\n\n.glyphicon-btc:before {\n  content: \"\\E227\"; }\n\n.glyphicon-xbt:before {\n  content: \"\\E227\"; }\n\n.glyphicon-yen:before {\n  content: \"\\A5\"; }\n\n.glyphicon-jpy:before {\n  content: \"\\A5\"; }\n\n.glyphicon-ruble:before {\n  content: \"\\20BD\"; }\n\n.glyphicon-rub:before {\n  content: \"\\20BD\"; }\n\n.glyphicon-scale:before {\n  content: \"\\E230\"; }\n\n.glyphicon-ice-lolly:before {\n  content: \"\\E231\"; }\n\n.glyphicon-ice-lolly-tasted:before {\n  content: \"\\E232\"; }\n\n.glyphicon-education:before {\n  content: \"\\E233\"; }\n\n.glyphicon-option-horizontal:before {\n  content: \"\\E234\"; }\n\n.glyphicon-option-vertical:before {\n  content: \"\\E235\"; }\n\n.glyphicon-menu-hamburger:before {\n  content: \"\\E236\"; }\n\n.glyphicon-modal-window:before {\n  content: \"\\E237\"; }\n\n.glyphicon-oil:before {\n  content: \"\\E238\"; }\n\n.glyphicon-grain:before {\n  content: \"\\E239\"; }\n\n.glyphicon-sunglasses:before {\n  content: \"\\E240\"; }\n\n.glyphicon-text-size:before {\n  content: \"\\E241\"; }\n\n.glyphicon-text-color:before {\n  content: \"\\E242\"; }\n\n.glyphicon-text-background:before {\n  content: \"\\E243\"; }\n\n.glyphicon-object-align-top:before {\n  content: \"\\E244\"; }\n\n.glyphicon-object-align-bottom:before {\n  content: \"\\E245\"; }\n\n.glyphicon-object-align-horizontal:before {\n  content: \"\\E246\"; }\n\n.glyphicon-object-align-left:before {\n  content: \"\\E247\"; }\n\n.glyphicon-object-align-vertical:before {\n  content: \"\\E248\"; }\n\n.glyphicon-object-align-right:before {\n  content: \"\\E249\"; }\n\n.glyphicon-triangle-right:before {\n  content: \"\\E250\"; }\n\n.glyphicon-triangle-left:before {\n  content: \"\\E251\"; }\n\n.glyphicon-triangle-bottom:before {\n  content: \"\\E252\"; }\n\n.glyphicon-triangle-top:before {\n  content: \"\\E253\"; }\n\n.glyphicon-console:before {\n  content: \"\\E254\"; }\n\n.glyphicon-superscript:before {\n  content: \"\\E255\"; }\n\n.glyphicon-subscript:before {\n  content: \"\\E256\"; }\n\n.glyphicon-menu-left:before {\n  content: \"\\E257\"; }\n\n.glyphicon-menu-right:before {\n  content: \"\\E258\"; }\n\n.glyphicon-menu-down:before {\n  content: \"\\E259\"; }\n\n.glyphicon-menu-up:before {\n  content: \"\\E260\"; }\n\n* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\n*:before,\n*:after {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\nhtml {\n  font-size: 10px;\n  -webkit-tap-highlight-color: transparent; }\n\nbody {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #333333;\n  background-color: #fff; }\n\ninput,\nbutton,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit; }\n\na {\n  color: #337ab7;\n  text-decoration: none; }\n  a:hover, a:focus {\n    color: #23527c;\n    text-decoration: underline; }\n  a:focus {\n    outline: 5px auto -webkit-focus-ring-color;\n    outline-offset: -2px; }\n\nfigure {\n  margin: 0; }\n\nimg {\n  vertical-align: middle; }\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto; }\n\n.img-rounded {\n  border-radius: 6px; }\n\n.img-thumbnail {\n  padding: 4px;\n  line-height: 1.42857;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -webkit-transition: all 0.2s ease-in-out;\n  -o-transition: all 0.2s ease-in-out;\n  transition: all 0.2s ease-in-out;\n  display: inline-block;\n  max-width: 100%;\n  height: auto; }\n\n.img-circle {\n  border-radius: 50%; }\n\nhr {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  border: 0;\n  border-top: 1px solid #eeeeee; }\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0; }\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto; }\n\n[role=\"button\"] {\n  cursor: pointer; }\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit; }\n  h1 small,\n  h1 .small, h2 small,\n  h2 .small, h3 small,\n  h3 .small, h4 small,\n  h4 .small, h5 small,\n  h5 .small, h6 small,\n  h6 .small,\n  .h1 small,\n  .h1 .small, .h2 small,\n  .h2 .small, .h3 small,\n  .h3 .small, .h4 small,\n  .h4 .small, .h5 small,\n  .h5 .small, .h6 small,\n  .h6 .small {\n    font-weight: normal;\n    line-height: 1;\n    color: #777777; }\n\nh1, .h1,\nh2, .h2,\nh3, .h3 {\n  margin-top: 20px;\n  margin-bottom: 10px; }\n  h1 small,\n  h1 .small, .h1 small,\n  .h1 .small,\n  h2 small,\n  h2 .small, .h2 small,\n  .h2 .small,\n  h3 small,\n  h3 .small, .h3 small,\n  .h3 .small {\n    font-size: 65%; }\n\nh4, .h4,\nh5, .h5,\nh6, .h6 {\n  margin-top: 10px;\n  margin-bottom: 10px; }\n  h4 small,\n  h4 .small, .h4 small,\n  .h4 .small,\n  h5 small,\n  h5 .small, .h5 small,\n  .h5 .small,\n  h6 small,\n  h6 .small, .h6 small,\n  .h6 .small {\n    font-size: 75%; }\n\nh1, .h1 {\n  font-size: 36px; }\n\nh2, .h2 {\n  font-size: 30px; }\n\nh3, .h3 {\n  font-size: 24px; }\n\nh4, .h4 {\n  font-size: 18px; }\n\nh5, .h5 {\n  font-size: 14px; }\n\nh6, .h6 {\n  font-size: 12px; }\n\np {\n  margin: 0 0 10px; }\n\n.lead {\n  margin-bottom: 20px;\n  font-size: 16px;\n  font-weight: 300;\n  line-height: 1.4; }\n  @media (min-width: 768px) {\n    .lead {\n      font-size: 21px; } }\n\nsmall,\n.small {\n  font-size: 85%; }\n\nmark,\n.mark {\n  background-color: #fcf8e3;\n  padding: .2em; }\n\n.text-left {\n  text-align: left; }\n\n.text-right {\n  text-align: right; }\n\n.text-center {\n  text-align: center; }\n\n.text-justify {\n  text-align: justify; }\n\n.text-nowrap {\n  white-space: nowrap; }\n\n.text-lowercase {\n  text-transform: lowercase; }\n\n.text-uppercase, .initialism {\n  text-transform: uppercase; }\n\n.text-capitalize {\n  text-transform: capitalize; }\n\n.text-muted {\n  color: #777777; }\n\n.text-primary {\n  color: #337ab7; }\n\na.text-primary:hover,\na.text-primary:focus {\n  color: #286090; }\n\n.text-success {\n  color: #3c763d; }\n\na.text-success:hover,\na.text-success:focus {\n  color: #2b542c; }\n\n.text-info {\n  color: #31708f; }\n\na.text-info:hover,\na.text-info:focus {\n  color: #245269; }\n\n.text-warning {\n  color: #8a6d3b; }\n\na.text-warning:hover,\na.text-warning:focus {\n  color: #66512c; }\n\n.text-danger {\n  color: #a94442; }\n\na.text-danger:hover,\na.text-danger:focus {\n  color: #843534; }\n\n.bg-primary {\n  color: #fff; }\n\n.bg-primary {\n  background-color: #337ab7; }\n\na.bg-primary:hover,\na.bg-primary:focus {\n  background-color: #286090; }\n\n.bg-success {\n  background-color: #dff0d8; }\n\na.bg-success:hover,\na.bg-success:focus {\n  background-color: #c1e2b3; }\n\n.bg-info {\n  background-color: #d9edf7; }\n\na.bg-info:hover,\na.bg-info:focus {\n  background-color: #afd9ee; }\n\n.bg-warning {\n  background-color: #fcf8e3; }\n\na.bg-warning:hover,\na.bg-warning:focus {\n  background-color: #f7ecb5; }\n\n.bg-danger {\n  background-color: #f2dede; }\n\na.bg-danger:hover,\na.bg-danger:focus {\n  background-color: #e4b9b9; }\n\n.page-header {\n  padding-bottom: 9px;\n  margin: 40px 0 20px;\n  border-bottom: 1px solid #eeeeee; }\n\nul,\nol {\n  margin-top: 0;\n  margin-bottom: 10px; }\n  ul ul,\n  ul ol,\n  ol ul,\n  ol ol {\n    margin-bottom: 0; }\n\n.list-unstyled {\n  padding-left: 0;\n  list-style: none; }\n\n.list-inline {\n  padding-left: 0;\n  list-style: none;\n  margin-left: -5px; }\n  .list-inline > li {\n    display: inline-block;\n    padding-left: 5px;\n    padding-right: 5px; }\n\ndl {\n  margin-top: 0;\n  margin-bottom: 20px; }\n\ndt,\ndd {\n  line-height: 1.42857; }\n\ndt {\n  font-weight: bold; }\n\ndd {\n  margin-left: 0; }\n\n.dl-horizontal dd:before, .dl-horizontal dd:after {\n  content: \" \";\n  display: table; }\n\n.dl-horizontal dd:after {\n  clear: both; }\n\n@media (min-width: 768px) {\n  .dl-horizontal dt {\n    float: left;\n    width: 160px;\n    clear: left;\n    text-align: right;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n  .dl-horizontal dd {\n    margin-left: 180px; } }\n\nabbr[title],\nabbr[data-original-title] {\n  cursor: help;\n  border-bottom: 1px dotted #777777; }\n\n.initialism {\n  font-size: 90%; }\n\nblockquote {\n  padding: 10px 20px;\n  margin: 0 0 20px;\n  font-size: 17.5px;\n  border-left: 5px solid #eeeeee; }\n  blockquote p:last-child,\n  blockquote ul:last-child,\n  blockquote ol:last-child {\n    margin-bottom: 0; }\n  blockquote footer,\n  blockquote small,\n  blockquote .small {\n    display: block;\n    font-size: 80%;\n    line-height: 1.42857;\n    color: #777777; }\n    blockquote footer:before,\n    blockquote small:before,\n    blockquote .small:before {\n      content: '\\2014   \\A0'; }\n\n.blockquote-reverse,\nblockquote.pull-right {\n  padding-right: 15px;\n  padding-left: 0;\n  border-right: 5px solid #eeeeee;\n  border-left: 0;\n  text-align: right; }\n  .blockquote-reverse footer:before,\n  .blockquote-reverse small:before,\n  .blockquote-reverse .small:before,\n  blockquote.pull-right footer:before,\n  blockquote.pull-right small:before,\n  blockquote.pull-right .small:before {\n    content: ''; }\n  .blockquote-reverse footer:after,\n  .blockquote-reverse small:after,\n  .blockquote-reverse .small:after,\n  blockquote.pull-right footer:after,\n  blockquote.pull-right small:after,\n  blockquote.pull-right .small:after {\n    content: '\\A0   \\2014'; }\n\naddress {\n  margin-bottom: 20px;\n  font-style: normal;\n  line-height: 1.42857; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace; }\n\ncode {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #c7254e;\n  background-color: #f9f2f4;\n  border-radius: 4px; }\n\nkbd {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #fff;\n  background-color: #333;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25); }\n  kbd kbd {\n    padding: 0;\n    font-size: 100%;\n    font-weight: bold;\n    box-shadow: none; }\n\npre {\n  display: block;\n  padding: 9.5px;\n  margin: 0 0 10px;\n  font-size: 13px;\n  line-height: 1.42857;\n  word-break: break-all;\n  word-wrap: break-word;\n  color: #333333;\n  background-color: #f5f5f5;\n  border: 1px solid #ccc;\n  border-radius: 4px; }\n  pre code {\n    padding: 0;\n    font-size: inherit;\n    color: inherit;\n    white-space: pre-wrap;\n    background-color: transparent;\n    border-radius: 0; }\n\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll; }\n\n.container {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px; }\n  .container:before, .container:after {\n    content: \" \";\n    display: table; }\n  .container:after {\n    clear: both; }\n  @media (min-width: 768px) {\n    .container {\n      width: 750px; } }\n  @media (min-width: 992px) {\n    .container {\n      width: 970px; } }\n  @media (min-width: 1200px) {\n    .container {\n      width: 1170px; } }\n\n.container-fluid {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px; }\n  .container-fluid:before, .container-fluid:after {\n    content: \" \";\n    display: table; }\n  .container-fluid:after {\n    clear: both; }\n\n.row {\n  margin-left: -15px;\n  margin-right: -15px; }\n  .row:before, .row:after {\n    content: \" \";\n    display: table; }\n  .row:after {\n    clear: both; }\n\n.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {\n  position: relative;\n  min-height: 1px;\n  padding-left: 15px;\n  padding-right: 15px; }\n\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {\n  float: left; }\n\n.col-xs-1 {\n  width: 8.33333%; }\n\n.col-xs-2 {\n  width: 16.66667%; }\n\n.col-xs-3 {\n  width: 25%; }\n\n.col-xs-4 {\n  width: 33.33333%; }\n\n.col-xs-5 {\n  width: 41.66667%; }\n\n.col-xs-6 {\n  width: 50%; }\n\n.col-xs-7 {\n  width: 58.33333%; }\n\n.col-xs-8 {\n  width: 66.66667%; }\n\n.col-xs-9 {\n  width: 75%; }\n\n.col-xs-10 {\n  width: 83.33333%; }\n\n.col-xs-11 {\n  width: 91.66667%; }\n\n.col-xs-12 {\n  width: 100%; }\n\n.col-xs-pull-0 {\n  right: auto; }\n\n.col-xs-pull-1 {\n  right: 8.33333%; }\n\n.col-xs-pull-2 {\n  right: 16.66667%; }\n\n.col-xs-pull-3 {\n  right: 25%; }\n\n.col-xs-pull-4 {\n  right: 33.33333%; }\n\n.col-xs-pull-5 {\n  right: 41.66667%; }\n\n.col-xs-pull-6 {\n  right: 50%; }\n\n.col-xs-pull-7 {\n  right: 58.33333%; }\n\n.col-xs-pull-8 {\n  right: 66.66667%; }\n\n.col-xs-pull-9 {\n  right: 75%; }\n\n.col-xs-pull-10 {\n  right: 83.33333%; }\n\n.col-xs-pull-11 {\n  right: 91.66667%; }\n\n.col-xs-pull-12 {\n  right: 100%; }\n\n.col-xs-push-0 {\n  left: auto; }\n\n.col-xs-push-1 {\n  left: 8.33333%; }\n\n.col-xs-push-2 {\n  left: 16.66667%; }\n\n.col-xs-push-3 {\n  left: 25%; }\n\n.col-xs-push-4 {\n  left: 33.33333%; }\n\n.col-xs-push-5 {\n  left: 41.66667%; }\n\n.col-xs-push-6 {\n  left: 50%; }\n\n.col-xs-push-7 {\n  left: 58.33333%; }\n\n.col-xs-push-8 {\n  left: 66.66667%; }\n\n.col-xs-push-9 {\n  left: 75%; }\n\n.col-xs-push-10 {\n  left: 83.33333%; }\n\n.col-xs-push-11 {\n  left: 91.66667%; }\n\n.col-xs-push-12 {\n  left: 100%; }\n\n.col-xs-offset-0 {\n  margin-left: 0%; }\n\n.col-xs-offset-1 {\n  margin-left: 8.33333%; }\n\n.col-xs-offset-2 {\n  margin-left: 16.66667%; }\n\n.col-xs-offset-3 {\n  margin-left: 25%; }\n\n.col-xs-offset-4 {\n  margin-left: 33.33333%; }\n\n.col-xs-offset-5 {\n  margin-left: 41.66667%; }\n\n.col-xs-offset-6 {\n  margin-left: 50%; }\n\n.col-xs-offset-7 {\n  margin-left: 58.33333%; }\n\n.col-xs-offset-8 {\n  margin-left: 66.66667%; }\n\n.col-xs-offset-9 {\n  margin-left: 75%; }\n\n.col-xs-offset-10 {\n  margin-left: 83.33333%; }\n\n.col-xs-offset-11 {\n  margin-left: 91.66667%; }\n\n.col-xs-offset-12 {\n  margin-left: 100%; }\n\n@media (min-width: 768px) {\n  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\n    float: left; }\n  .col-sm-1 {\n    width: 8.33333%; }\n  .col-sm-2 {\n    width: 16.66667%; }\n  .col-sm-3 {\n    width: 25%; }\n  .col-sm-4 {\n    width: 33.33333%; }\n  .col-sm-5 {\n    width: 41.66667%; }\n  .col-sm-6 {\n    width: 50%; }\n  .col-sm-7 {\n    width: 58.33333%; }\n  .col-sm-8 {\n    width: 66.66667%; }\n  .col-sm-9 {\n    width: 75%; }\n  .col-sm-10 {\n    width: 83.33333%; }\n  .col-sm-11 {\n    width: 91.66667%; }\n  .col-sm-12 {\n    width: 100%; }\n  .col-sm-pull-0 {\n    right: auto; }\n  .col-sm-pull-1 {\n    right: 8.33333%; }\n  .col-sm-pull-2 {\n    right: 16.66667%; }\n  .col-sm-pull-3 {\n    right: 25%; }\n  .col-sm-pull-4 {\n    right: 33.33333%; }\n  .col-sm-pull-5 {\n    right: 41.66667%; }\n  .col-sm-pull-6 {\n    right: 50%; }\n  .col-sm-pull-7 {\n    right: 58.33333%; }\n  .col-sm-pull-8 {\n    right: 66.66667%; }\n  .col-sm-pull-9 {\n    right: 75%; }\n  .col-sm-pull-10 {\n    right: 83.33333%; }\n  .col-sm-pull-11 {\n    right: 91.66667%; }\n  .col-sm-pull-12 {\n    right: 100%; }\n  .col-sm-push-0 {\n    left: auto; }\n  .col-sm-push-1 {\n    left: 8.33333%; }\n  .col-sm-push-2 {\n    left: 16.66667%; }\n  .col-sm-push-3 {\n    left: 25%; }\n  .col-sm-push-4 {\n    left: 33.33333%; }\n  .col-sm-push-5 {\n    left: 41.66667%; }\n  .col-sm-push-6 {\n    left: 50%; }\n  .col-sm-push-7 {\n    left: 58.33333%; }\n  .col-sm-push-8 {\n    left: 66.66667%; }\n  .col-sm-push-9 {\n    left: 75%; }\n  .col-sm-push-10 {\n    left: 83.33333%; }\n  .col-sm-push-11 {\n    left: 91.66667%; }\n  .col-sm-push-12 {\n    left: 100%; }\n  .col-sm-offset-0 {\n    margin-left: 0%; }\n  .col-sm-offset-1 {\n    margin-left: 8.33333%; }\n  .col-sm-offset-2 {\n    margin-left: 16.66667%; }\n  .col-sm-offset-3 {\n    margin-left: 25%; }\n  .col-sm-offset-4 {\n    margin-left: 33.33333%; }\n  .col-sm-offset-5 {\n    margin-left: 41.66667%; }\n  .col-sm-offset-6 {\n    margin-left: 50%; }\n  .col-sm-offset-7 {\n    margin-left: 58.33333%; }\n  .col-sm-offset-8 {\n    margin-left: 66.66667%; }\n  .col-sm-offset-9 {\n    margin-left: 75%; }\n  .col-sm-offset-10 {\n    margin-left: 83.33333%; }\n  .col-sm-offset-11 {\n    margin-left: 91.66667%; }\n  .col-sm-offset-12 {\n    margin-left: 100%; } }\n\n@media (min-width: 992px) {\n  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {\n    float: left; }\n  .col-md-1 {\n    width: 8.33333%; }\n  .col-md-2 {\n    width: 16.66667%; }\n  .col-md-3 {\n    width: 25%; }\n  .col-md-4 {\n    width: 33.33333%; }\n  .col-md-5 {\n    width: 41.66667%; }\n  .col-md-6 {\n    width: 50%; }\n  .col-md-7 {\n    width: 58.33333%; }\n  .col-md-8 {\n    width: 66.66667%; }\n  .col-md-9 {\n    width: 75%; }\n  .col-md-10 {\n    width: 83.33333%; }\n  .col-md-11 {\n    width: 91.66667%; }\n  .col-md-12 {\n    width: 100%; }\n  .col-md-pull-0 {\n    right: auto; }\n  .col-md-pull-1 {\n    right: 8.33333%; }\n  .col-md-pull-2 {\n    right: 16.66667%; }\n  .col-md-pull-3 {\n    right: 25%; }\n  .col-md-pull-4 {\n    right: 33.33333%; }\n  .col-md-pull-5 {\n    right: 41.66667%; }\n  .col-md-pull-6 {\n    right: 50%; }\n  .col-md-pull-7 {\n    right: 58.33333%; }\n  .col-md-pull-8 {\n    right: 66.66667%; }\n  .col-md-pull-9 {\n    right: 75%; }\n  .col-md-pull-10 {\n    right: 83.33333%; }\n  .col-md-pull-11 {\n    right: 91.66667%; }\n  .col-md-pull-12 {\n    right: 100%; }\n  .col-md-push-0 {\n    left: auto; }\n  .col-md-push-1 {\n    left: 8.33333%; }\n  .col-md-push-2 {\n    left: 16.66667%; }\n  .col-md-push-3 {\n    left: 25%; }\n  .col-md-push-4 {\n    left: 33.33333%; }\n  .col-md-push-5 {\n    left: 41.66667%; }\n  .col-md-push-6 {\n    left: 50%; }\n  .col-md-push-7 {\n    left: 58.33333%; }\n  .col-md-push-8 {\n    left: 66.66667%; }\n  .col-md-push-9 {\n    left: 75%; }\n  .col-md-push-10 {\n    left: 83.33333%; }\n  .col-md-push-11 {\n    left: 91.66667%; }\n  .col-md-push-12 {\n    left: 100%; }\n  .col-md-offset-0 {\n    margin-left: 0%; }\n  .col-md-offset-1 {\n    margin-left: 8.33333%; }\n  .col-md-offset-2 {\n    margin-left: 16.66667%; }\n  .col-md-offset-3 {\n    margin-left: 25%; }\n  .col-md-offset-4 {\n    margin-left: 33.33333%; }\n  .col-md-offset-5 {\n    margin-left: 41.66667%; }\n  .col-md-offset-6 {\n    margin-left: 50%; }\n  .col-md-offset-7 {\n    margin-left: 58.33333%; }\n  .col-md-offset-8 {\n    margin-left: 66.66667%; }\n  .col-md-offset-9 {\n    margin-left: 75%; }\n  .col-md-offset-10 {\n    margin-left: 83.33333%; }\n  .col-md-offset-11 {\n    margin-left: 91.66667%; }\n  .col-md-offset-12 {\n    margin-left: 100%; } }\n\n@media (min-width: 1200px) {\n  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\n    float: left; }\n  .col-lg-1 {\n    width: 8.33333%; }\n  .col-lg-2 {\n    width: 16.66667%; }\n  .col-lg-3 {\n    width: 25%; }\n  .col-lg-4 {\n    width: 33.33333%; }\n  .col-lg-5 {\n    width: 41.66667%; }\n  .col-lg-6 {\n    width: 50%; }\n  .col-lg-7 {\n    width: 58.33333%; }\n  .col-lg-8 {\n    width: 66.66667%; }\n  .col-lg-9 {\n    width: 75%; }\n  .col-lg-10 {\n    width: 83.33333%; }\n  .col-lg-11 {\n    width: 91.66667%; }\n  .col-lg-12 {\n    width: 100%; }\n  .col-lg-pull-0 {\n    right: auto; }\n  .col-lg-pull-1 {\n    right: 8.33333%; }\n  .col-lg-pull-2 {\n    right: 16.66667%; }\n  .col-lg-pull-3 {\n    right: 25%; }\n  .col-lg-pull-4 {\n    right: 33.33333%; }\n  .col-lg-pull-5 {\n    right: 41.66667%; }\n  .col-lg-pull-6 {\n    right: 50%; }\n  .col-lg-pull-7 {\n    right: 58.33333%; }\n  .col-lg-pull-8 {\n    right: 66.66667%; }\n  .col-lg-pull-9 {\n    right: 75%; }\n  .col-lg-pull-10 {\n    right: 83.33333%; }\n  .col-lg-pull-11 {\n    right: 91.66667%; }\n  .col-lg-pull-12 {\n    right: 100%; }\n  .col-lg-push-0 {\n    left: auto; }\n  .col-lg-push-1 {\n    left: 8.33333%; }\n  .col-lg-push-2 {\n    left: 16.66667%; }\n  .col-lg-push-3 {\n    left: 25%; }\n  .col-lg-push-4 {\n    left: 33.33333%; }\n  .col-lg-push-5 {\n    left: 41.66667%; }\n  .col-lg-push-6 {\n    left: 50%; }\n  .col-lg-push-7 {\n    left: 58.33333%; }\n  .col-lg-push-8 {\n    left: 66.66667%; }\n  .col-lg-push-9 {\n    left: 75%; }\n  .col-lg-push-10 {\n    left: 83.33333%; }\n  .col-lg-push-11 {\n    left: 91.66667%; }\n  .col-lg-push-12 {\n    left: 100%; }\n  .col-lg-offset-0 {\n    margin-left: 0%; }\n  .col-lg-offset-1 {\n    margin-left: 8.33333%; }\n  .col-lg-offset-2 {\n    margin-left: 16.66667%; }\n  .col-lg-offset-3 {\n    margin-left: 25%; }\n  .col-lg-offset-4 {\n    margin-left: 33.33333%; }\n  .col-lg-offset-5 {\n    margin-left: 41.66667%; }\n  .col-lg-offset-6 {\n    margin-left: 50%; }\n  .col-lg-offset-7 {\n    margin-left: 58.33333%; }\n  .col-lg-offset-8 {\n    margin-left: 66.66667%; }\n  .col-lg-offset-9 {\n    margin-left: 75%; }\n  .col-lg-offset-10 {\n    margin-left: 83.33333%; }\n  .col-lg-offset-11 {\n    margin-left: 91.66667%; }\n  .col-lg-offset-12 {\n    margin-left: 100%; } }\n\ntable {\n  background-color: transparent; }\n\ncaption {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  color: #777777;\n  text-align: left; }\n\nth {\n  text-align: left; }\n\n.table {\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 20px; }\n  .table > thead > tr > th,\n  .table > thead > tr > td,\n  .table > tbody > tr > th,\n  .table > tbody > tr > td,\n  .table > tfoot > tr > th,\n  .table > tfoot > tr > td {\n    padding: 8px;\n    line-height: 1.42857;\n    vertical-align: top;\n    border-top: 1px solid #ddd; }\n  .table > thead > tr > th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #ddd; }\n  .table > caption + thead > tr:first-child > th,\n  .table > caption + thead > tr:first-child > td,\n  .table > colgroup + thead > tr:first-child > th,\n  .table > colgroup + thead > tr:first-child > td,\n  .table > thead:first-child > tr:first-child > th,\n  .table > thead:first-child > tr:first-child > td {\n    border-top: 0; }\n  .table > tbody + tbody {\n    border-top: 2px solid #ddd; }\n  .table .table {\n    background-color: #fff; }\n\n.table-condensed > thead > tr > th,\n.table-condensed > thead > tr > td,\n.table-condensed > tbody > tr > th,\n.table-condensed > tbody > tr > td,\n.table-condensed > tfoot > tr > th,\n.table-condensed > tfoot > tr > td {\n  padding: 5px; }\n\n.table-bordered {\n  border: 1px solid #ddd; }\n  .table-bordered > thead > tr > th,\n  .table-bordered > thead > tr > td,\n  .table-bordered > tbody > tr > th,\n  .table-bordered > tbody > tr > td,\n  .table-bordered > tfoot > tr > th,\n  .table-bordered > tfoot > tr > td {\n    border: 1px solid #ddd; }\n  .table-bordered > thead > tr > th,\n  .table-bordered > thead > tr > td {\n    border-bottom-width: 2px; }\n\n.table-striped > tbody > tr:nth-of-type(odd) {\n  background-color: #f9f9f9; }\n\n.table-hover > tbody > tr:hover {\n  background-color: #f5f5f5; }\n\ntable col[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-column; }\n\ntable td[class*=\"col-\"],\ntable th[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-cell; }\n\n.table > thead > tr > td.active,\n.table > thead > tr > th.active,\n.table > thead > tr.active > td,\n.table > thead > tr.active > th,\n.table > tbody > tr > td.active,\n.table > tbody > tr > th.active,\n.table > tbody > tr.active > td,\n.table > tbody > tr.active > th,\n.table > tfoot > tr > td.active,\n.table > tfoot > tr > th.active,\n.table > tfoot > tr.active > td,\n.table > tfoot > tr.active > th {\n  background-color: #f5f5f5; }\n\n.table-hover > tbody > tr > td.active:hover,\n.table-hover > tbody > tr > th.active:hover,\n.table-hover > tbody > tr.active:hover > td,\n.table-hover > tbody > tr:hover > .active,\n.table-hover > tbody > tr.active:hover > th {\n  background-color: #e8e8e8; }\n\n.table > thead > tr > td.success,\n.table > thead > tr > th.success,\n.table > thead > tr.success > td,\n.table > thead > tr.success > th,\n.table > tbody > tr > td.success,\n.table > tbody > tr > th.success,\n.table > tbody > tr.success > td,\n.table > tbody > tr.success > th,\n.table > tfoot > tr > td.success,\n.table > tfoot > tr > th.success,\n.table > tfoot > tr.success > td,\n.table > tfoot > tr.success > th {\n  background-color: #dff0d8; }\n\n.table-hover > tbody > tr > td.success:hover,\n.table-hover > tbody > tr > th.success:hover,\n.table-hover > tbody > tr.success:hover > td,\n.table-hover > tbody > tr:hover > .success,\n.table-hover > tbody > tr.success:hover > th {\n  background-color: #d0e9c6; }\n\n.table > thead > tr > td.info,\n.table > thead > tr > th.info,\n.table > thead > tr.info > td,\n.table > thead > tr.info > th,\n.table > tbody > tr > td.info,\n.table > tbody > tr > th.info,\n.table > tbody > tr.info > td,\n.table > tbody > tr.info > th,\n.table > tfoot > tr > td.info,\n.table > tfoot > tr > th.info,\n.table > tfoot > tr.info > td,\n.table > tfoot > tr.info > th {\n  background-color: #d9edf7; }\n\n.table-hover > tbody > tr > td.info:hover,\n.table-hover > tbody > tr > th.info:hover,\n.table-hover > tbody > tr.info:hover > td,\n.table-hover > tbody > tr:hover > .info,\n.table-hover > tbody > tr.info:hover > th {\n  background-color: #c4e3f3; }\n\n.table > thead > tr > td.warning,\n.table > thead > tr > th.warning,\n.table > thead > tr.warning > td,\n.table > thead > tr.warning > th,\n.table > tbody > tr > td.warning,\n.table > tbody > tr > th.warning,\n.table > tbody > tr.warning > td,\n.table > tbody > tr.warning > th,\n.table > tfoot > tr > td.warning,\n.table > tfoot > tr > th.warning,\n.table > tfoot > tr.warning > td,\n.table > tfoot > tr.warning > th {\n  background-color: #fcf8e3; }\n\n.table-hover > tbody > tr > td.warning:hover,\n.table-hover > tbody > tr > th.warning:hover,\n.table-hover > tbody > tr.warning:hover > td,\n.table-hover > tbody > tr:hover > .warning,\n.table-hover > tbody > tr.warning:hover > th {\n  background-color: #faf2cc; }\n\n.table > thead > tr > td.danger,\n.table > thead > tr > th.danger,\n.table > thead > tr.danger > td,\n.table > thead > tr.danger > th,\n.table > tbody > tr > td.danger,\n.table > tbody > tr > th.danger,\n.table > tbody > tr.danger > td,\n.table > tbody > tr.danger > th,\n.table > tfoot > tr > td.danger,\n.table > tfoot > tr > th.danger,\n.table > tfoot > tr.danger > td,\n.table > tfoot > tr.danger > th {\n  background-color: #f2dede; }\n\n.table-hover > tbody > tr > td.danger:hover,\n.table-hover > tbody > tr > th.danger:hover,\n.table-hover > tbody > tr.danger:hover > td,\n.table-hover > tbody > tr:hover > .danger,\n.table-hover > tbody > tr.danger:hover > th {\n  background-color: #ebcccc; }\n\n.table-responsive {\n  overflow-x: auto;\n  min-height: 0.01%; }\n  @media screen and (max-width: 767px) {\n    .table-responsive {\n      width: 100%;\n      margin-bottom: 15px;\n      overflow-y: hidden;\n      -ms-overflow-style: -ms-autohiding-scrollbar;\n      border: 1px solid #ddd; }\n      .table-responsive > .table {\n        margin-bottom: 0; }\n        .table-responsive > .table > thead > tr > th,\n        .table-responsive > .table > thead > tr > td,\n        .table-responsive > .table > tbody > tr > th,\n        .table-responsive > .table > tbody > tr > td,\n        .table-responsive > .table > tfoot > tr > th,\n        .table-responsive > .table > tfoot > tr > td {\n          white-space: nowrap; }\n      .table-responsive > .table-bordered {\n        border: 0; }\n        .table-responsive > .table-bordered > thead > tr > th:first-child,\n        .table-responsive > .table-bordered > thead > tr > td:first-child,\n        .table-responsive > .table-bordered > tbody > tr > th:first-child,\n        .table-responsive > .table-bordered > tbody > tr > td:first-child,\n        .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n        .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n          border-left: 0; }\n        .table-responsive > .table-bordered > thead > tr > th:last-child,\n        .table-responsive > .table-bordered > thead > tr > td:last-child,\n        .table-responsive > .table-bordered > tbody > tr > th:last-child,\n        .table-responsive > .table-bordered > tbody > tr > td:last-child,\n        .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n        .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n          border-right: 0; }\n        .table-responsive > .table-bordered > tbody > tr:last-child > th,\n        .table-responsive > .table-bordered > tbody > tr:last-child > td,\n        .table-responsive > .table-bordered > tfoot > tr:last-child > th,\n        .table-responsive > .table-bordered > tfoot > tr:last-child > td {\n          border-bottom: 0; } }\n\nfieldset {\n  padding: 0;\n  margin: 0;\n  border: 0;\n  min-width: 0; }\n\nlegend {\n  display: block;\n  width: 100%;\n  padding: 0;\n  margin-bottom: 20px;\n  font-size: 21px;\n  line-height: inherit;\n  color: #333333;\n  border: 0;\n  border-bottom: 1px solid #e5e5e5; }\n\nlabel {\n  display: inline-block;\n  max-width: 100%;\n  margin-bottom: 5px;\n  font-weight: bold; }\n\ninput[type=\"search\"] {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  margin: 4px 0 0;\n  margin-top: 1px \\9;\n  line-height: normal; }\n\ninput[type=\"file\"] {\n  display: block; }\n\ninput[type=\"range\"] {\n  display: block;\n  width: 100%; }\n\nselect[multiple],\nselect[size] {\n  height: auto; }\n\ninput[type=\"file\"]:focus,\ninput[type=\"radio\"]:focus,\ninput[type=\"checkbox\"]:focus {\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px; }\n\noutput {\n  display: block;\n  padding-top: 7px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555555; }\n\n.form-control {\n  display: block;\n  width: 100%;\n  height: 34px;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; }\n  .form-control:focus {\n    border-color: #66afe9;\n    outline: 0;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\n  .form-control::-moz-placeholder {\n    color: #999;\n    opacity: 1; }\n  .form-control:-ms-input-placeholder {\n    color: #999; }\n  .form-control::-webkit-input-placeholder {\n    color: #999; }\n  .form-control::-ms-expand {\n    border: 0;\n    background-color: transparent; }\n  .form-control[disabled], .form-control[readonly],\n  fieldset[disabled] .form-control {\n    background-color: #eeeeee;\n    opacity: 1; }\n  .form-control[disabled],\n  fieldset[disabled] .form-control {\n    cursor: not-allowed; }\n\ntextarea.form-control {\n  height: auto; }\n\ninput[type=\"search\"] {\n  -webkit-appearance: none; }\n\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  input[type=\"date\"].form-control,\n  input[type=\"time\"].form-control,\n  input[type=\"datetime-local\"].form-control,\n  input[type=\"month\"].form-control {\n    line-height: 34px; }\n  input[type=\"date\"].input-sm, .input-group-sm > input[type=\"date\"].form-control,\n  .input-group-sm > input[type=\"date\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"date\"].btn,\n  .input-group-sm input[type=\"date\"],\n  input[type=\"time\"].input-sm,\n  .input-group-sm > input[type=\"time\"].form-control,\n  .input-group-sm > input[type=\"time\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"time\"].btn,\n  .input-group-sm\n  input[type=\"time\"],\n  input[type=\"datetime-local\"].input-sm,\n  .input-group-sm > input[type=\"datetime-local\"].form-control,\n  .input-group-sm > input[type=\"datetime-local\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"datetime-local\"].btn,\n  .input-group-sm\n  input[type=\"datetime-local\"],\n  input[type=\"month\"].input-sm,\n  .input-group-sm > input[type=\"month\"].form-control,\n  .input-group-sm > input[type=\"month\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"month\"].btn,\n  .input-group-sm\n  input[type=\"month\"] {\n    line-height: 30px; }\n  input[type=\"date\"].input-lg, .input-group-lg > input[type=\"date\"].form-control,\n  .input-group-lg > input[type=\"date\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"date\"].btn,\n  .input-group-lg input[type=\"date\"],\n  input[type=\"time\"].input-lg,\n  .input-group-lg > input[type=\"time\"].form-control,\n  .input-group-lg > input[type=\"time\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"time\"].btn,\n  .input-group-lg\n  input[type=\"time\"],\n  input[type=\"datetime-local\"].input-lg,\n  .input-group-lg > input[type=\"datetime-local\"].form-control,\n  .input-group-lg > input[type=\"datetime-local\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"datetime-local\"].btn,\n  .input-group-lg\n  input[type=\"datetime-local\"],\n  input[type=\"month\"].input-lg,\n  .input-group-lg > input[type=\"month\"].form-control,\n  .input-group-lg > input[type=\"month\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"month\"].btn,\n  .input-group-lg\n  input[type=\"month\"] {\n    line-height: 46px; } }\n\n.form-group {\n  margin-bottom: 15px; }\n\n.radio,\n.checkbox {\n  position: relative;\n  display: block;\n  margin-top: 10px;\n  margin-bottom: 10px; }\n  .radio label,\n  .checkbox label {\n    min-height: 20px;\n    padding-left: 20px;\n    margin-bottom: 0;\n    font-weight: normal;\n    cursor: pointer; }\n\n.radio input[type=\"radio\"],\n.radio-inline input[type=\"radio\"],\n.checkbox input[type=\"checkbox\"],\n.checkbox-inline input[type=\"checkbox\"] {\n  position: absolute;\n  margin-left: -20px;\n  margin-top: 4px \\9; }\n\n.radio + .radio,\n.checkbox + .checkbox {\n  margin-top: -5px; }\n\n.radio-inline,\n.checkbox-inline {\n  position: relative;\n  display: inline-block;\n  padding-left: 20px;\n  margin-bottom: 0;\n  vertical-align: middle;\n  font-weight: normal;\n  cursor: pointer; }\n\n.radio-inline + .radio-inline,\n.checkbox-inline + .checkbox-inline {\n  margin-top: 0;\n  margin-left: 10px; }\n\ninput[type=\"radio\"][disabled], input[type=\"radio\"].disabled,\nfieldset[disabled] input[type=\"radio\"],\ninput[type=\"checkbox\"][disabled],\ninput[type=\"checkbox\"].disabled,\nfieldset[disabled]\ninput[type=\"checkbox\"] {\n  cursor: not-allowed; }\n\n.radio-inline.disabled,\nfieldset[disabled] .radio-inline,\n.checkbox-inline.disabled,\nfieldset[disabled]\n.checkbox-inline {\n  cursor: not-allowed; }\n\n.radio.disabled label,\nfieldset[disabled] .radio label,\n.checkbox.disabled label,\nfieldset[disabled]\n.checkbox label {\n  cursor: not-allowed; }\n\n.form-control-static {\n  padding-top: 7px;\n  padding-bottom: 7px;\n  margin-bottom: 0;\n  min-height: 34px; }\n  .form-control-static.input-lg, .input-group-lg > .form-control-static.form-control,\n  .input-group-lg > .form-control-static.input-group-addon,\n  .input-group-lg > .input-group-btn > .form-control-static.btn, .form-control-static.input-sm, .input-group-sm > .form-control-static.form-control,\n  .input-group-sm > .form-control-static.input-group-addon,\n  .input-group-sm > .input-group-btn > .form-control-static.btn {\n    padding-left: 0;\n    padding-right: 0; }\n\n.input-sm, .input-group-sm > .form-control,\n.input-group-sm > .input-group-addon,\n.input-group-sm > .input-group-btn > .btn {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\nselect.input-sm, .input-group-sm > select.form-control,\n.input-group-sm > select.input-group-addon,\n.input-group-sm > .input-group-btn > select.btn {\n  height: 30px;\n  line-height: 30px; }\n\ntextarea.input-sm, .input-group-sm > textarea.form-control,\n.input-group-sm > textarea.input-group-addon,\n.input-group-sm > .input-group-btn > textarea.btn,\nselect[multiple].input-sm,\n.input-group-sm > select[multiple].form-control,\n.input-group-sm > select[multiple].input-group-addon,\n.input-group-sm > .input-group-btn > select[multiple].btn {\n  height: auto; }\n\n.form-group-sm .form-control {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\n.form-group-sm select.form-control {\n  height: 30px;\n  line-height: 30px; }\n\n.form-group-sm textarea.form-control,\n.form-group-sm select[multiple].form-control {\n  height: auto; }\n\n.form-group-sm .form-control-static {\n  height: 30px;\n  min-height: 32px;\n  padding: 6px 10px;\n  font-size: 12px;\n  line-height: 1.5; }\n\n.input-lg, .input-group-lg > .form-control,\n.input-group-lg > .input-group-addon,\n.input-group-lg > .input-group-btn > .btn {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.33333;\n  border-radius: 6px; }\n\nselect.input-lg, .input-group-lg > select.form-control,\n.input-group-lg > select.input-group-addon,\n.input-group-lg > .input-group-btn > select.btn {\n  height: 46px;\n  line-height: 46px; }\n\ntextarea.input-lg, .input-group-lg > textarea.form-control,\n.input-group-lg > textarea.input-group-addon,\n.input-group-lg > .input-group-btn > textarea.btn,\nselect[multiple].input-lg,\n.input-group-lg > select[multiple].form-control,\n.input-group-lg > select[multiple].input-group-addon,\n.input-group-lg > .input-group-btn > select[multiple].btn {\n  height: auto; }\n\n.form-group-lg .form-control {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.33333;\n  border-radius: 6px; }\n\n.form-group-lg select.form-control {\n  height: 46px;\n  line-height: 46px; }\n\n.form-group-lg textarea.form-control,\n.form-group-lg select[multiple].form-control {\n  height: auto; }\n\n.form-group-lg .form-control-static {\n  height: 46px;\n  min-height: 38px;\n  padding: 11px 16px;\n  font-size: 18px;\n  line-height: 1.33333; }\n\n.has-feedback {\n  position: relative; }\n  .has-feedback .form-control {\n    padding-right: 42.5px; }\n\n.form-control-feedback {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 2;\n  display: block;\n  width: 34px;\n  height: 34px;\n  line-height: 34px;\n  text-align: center;\n  pointer-events: none; }\n\n.input-lg + .form-control-feedback, .input-group-lg > .form-control + .form-control-feedback,\n.input-group-lg > .input-group-addon + .form-control-feedback,\n.input-group-lg > .input-group-btn > .btn + .form-control-feedback,\n.input-group-lg + .form-control-feedback,\n.form-group-lg .form-control + .form-control-feedback {\n  width: 46px;\n  height: 46px;\n  line-height: 46px; }\n\n.input-sm + .form-control-feedback, .input-group-sm > .form-control + .form-control-feedback,\n.input-group-sm > .input-group-addon + .form-control-feedback,\n.input-group-sm > .input-group-btn > .btn + .form-control-feedback,\n.input-group-sm + .form-control-feedback,\n.form-group-sm .form-control + .form-control-feedback {\n  width: 30px;\n  height: 30px;\n  line-height: 30px; }\n\n.has-success .help-block,\n.has-success .control-label,\n.has-success .radio,\n.has-success .checkbox,\n.has-success .radio-inline,\n.has-success .checkbox-inline,\n.has-success.radio label,\n.has-success.checkbox label,\n.has-success.radio-inline label,\n.has-success.checkbox-inline label {\n  color: #3c763d; }\n\n.has-success .form-control {\n  border-color: #3c763d;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n  .has-success .form-control:focus {\n    border-color: #2b542c;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168; }\n\n.has-success .input-group-addon {\n  color: #3c763d;\n  border-color: #3c763d;\n  background-color: #dff0d8; }\n\n.has-success .form-control-feedback {\n  color: #3c763d; }\n\n.has-warning .help-block,\n.has-warning .control-label,\n.has-warning .radio,\n.has-warning .checkbox,\n.has-warning .radio-inline,\n.has-warning .checkbox-inline,\n.has-warning.radio label,\n.has-warning.checkbox label,\n.has-warning.radio-inline label,\n.has-warning.checkbox-inline label {\n  color: #8a6d3b; }\n\n.has-warning .form-control {\n  border-color: #8a6d3b;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n  .has-warning .form-control:focus {\n    border-color: #66512c;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b; }\n\n.has-warning .input-group-addon {\n  color: #8a6d3b;\n  border-color: #8a6d3b;\n  background-color: #fcf8e3; }\n\n.has-warning .form-control-feedback {\n  color: #8a6d3b; }\n\n.has-error .help-block,\n.has-error .control-label,\n.has-error .radio,\n.has-error .checkbox,\n.has-error .radio-inline,\n.has-error .checkbox-inline,\n.has-error.radio label,\n.has-error.checkbox label,\n.has-error.radio-inline label,\n.has-error.checkbox-inline label {\n  color: #a94442; }\n\n.has-error .form-control {\n  border-color: #a94442;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n  .has-error .form-control:focus {\n    border-color: #843534;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483; }\n\n.has-error .input-group-addon {\n  color: #a94442;\n  border-color: #a94442;\n  background-color: #f2dede; }\n\n.has-error .form-control-feedback {\n  color: #a94442; }\n\n.has-feedback label ~ .form-control-feedback {\n  top: 25px; }\n\n.has-feedback label.sr-only ~ .form-control-feedback {\n  top: 0; }\n\n.help-block {\n  display: block;\n  margin-top: 5px;\n  margin-bottom: 10px;\n  color: #737373; }\n\n@media (min-width: 768px) {\n  .form-inline .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle; }\n  .form-inline .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle; }\n  .form-inline .form-control-static {\n    display: inline-block; }\n  .form-inline .input-group {\n    display: inline-table;\n    vertical-align: middle; }\n    .form-inline .input-group .input-group-addon,\n    .form-inline .input-group .input-group-btn,\n    .form-inline .input-group .form-control {\n      width: auto; }\n  .form-inline .input-group > .form-control {\n    width: 100%; }\n  .form-inline .control-label {\n    margin-bottom: 0;\n    vertical-align: middle; }\n  .form-inline .radio,\n  .form-inline .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle; }\n    .form-inline .radio label,\n    .form-inline .checkbox label {\n      padding-left: 0; }\n  .form-inline .radio input[type=\"radio\"],\n  .form-inline .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0; }\n  .form-inline .has-feedback .form-control-feedback {\n    top: 0; } }\n\n.form-horizontal .radio,\n.form-horizontal .checkbox,\n.form-horizontal .radio-inline,\n.form-horizontal .checkbox-inline {\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-top: 7px; }\n\n.form-horizontal .radio,\n.form-horizontal .checkbox {\n  min-height: 27px; }\n\n.form-horizontal .form-group {\n  margin-left: -15px;\n  margin-right: -15px; }\n  .form-horizontal .form-group:before, .form-horizontal .form-group:after {\n    content: \" \";\n    display: table; }\n  .form-horizontal .form-group:after {\n    clear: both; }\n\n@media (min-width: 768px) {\n  .form-horizontal .control-label {\n    text-align: right;\n    margin-bottom: 0;\n    padding-top: 7px; } }\n\n.form-horizontal .has-feedback .form-control-feedback {\n  right: 15px; }\n\n@media (min-width: 768px) {\n  .form-horizontal .form-group-lg .control-label {\n    padding-top: 11px;\n    font-size: 18px; } }\n\n@media (min-width: 768px) {\n  .form-horizontal .form-group-sm .control-label {\n    padding-top: 6px;\n    font-size: 12px; } }\n\n.btn {\n  display: inline-block;\n  margin-bottom: 0;\n  font-weight: normal;\n  text-align: center;\n  vertical-align: middle;\n  touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  border-radius: 4px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n  .btn:focus, .btn.focus, .btn:active:focus, .btn:active.focus, .btn.active:focus, .btn.active.focus {\n    outline: 5px auto -webkit-focus-ring-color;\n    outline-offset: -2px; }\n  .btn:hover, .btn:focus, .btn.focus {\n    color: #333;\n    text-decoration: none; }\n  .btn:active, .btn.active {\n    outline: 0;\n    background-image: none;\n    -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); }\n  .btn.disabled, .btn[disabled],\n  fieldset[disabled] .btn {\n    cursor: not-allowed;\n    opacity: 0.65;\n    filter: alpha(opacity=65);\n    -webkit-box-shadow: none;\n    box-shadow: none; }\n\na.btn.disabled,\nfieldset[disabled] a.btn {\n  pointer-events: none; }\n\n.btn-default {\n  color: #333;\n  background-color: #fff;\n  border-color: #ccc; }\n  .btn-default:focus, .btn-default.focus {\n    color: #333;\n    background-color: #e6e6e6;\n    border-color: #8c8c8c; }\n  .btn-default:hover {\n    color: #333;\n    background-color: #e6e6e6;\n    border-color: #adadad; }\n  .btn-default:active, .btn-default.active,\n  .open > .btn-default.dropdown-toggle {\n    color: #333;\n    background-color: #e6e6e6;\n    border-color: #adadad; }\n    .btn-default:active:hover, .btn-default:active:focus, .btn-default:active.focus, .btn-default.active:hover, .btn-default.active:focus, .btn-default.active.focus,\n    .open > .btn-default.dropdown-toggle:hover,\n    .open > .btn-default.dropdown-toggle:focus,\n    .open > .btn-default.dropdown-toggle.focus {\n      color: #333;\n      background-color: #d4d4d4;\n      border-color: #8c8c8c; }\n  .btn-default:active, .btn-default.active,\n  .open > .btn-default.dropdown-toggle {\n    background-image: none; }\n  .btn-default.disabled:hover, .btn-default.disabled:focus, .btn-default.disabled.focus, .btn-default[disabled]:hover, .btn-default[disabled]:focus, .btn-default[disabled].focus,\n  fieldset[disabled] .btn-default:hover,\n  fieldset[disabled] .btn-default:focus,\n  fieldset[disabled] .btn-default.focus {\n    background-color: #fff;\n    border-color: #ccc; }\n  .btn-default .badge {\n    color: #fff;\n    background-color: #333; }\n\n.btn-primary {\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #2e6da4; }\n  .btn-primary:focus, .btn-primary.focus {\n    color: #fff;\n    background-color: #286090;\n    border-color: #122b40; }\n  .btn-primary:hover {\n    color: #fff;\n    background-color: #286090;\n    border-color: #204d74; }\n  .btn-primary:active, .btn-primary.active,\n  .open > .btn-primary.dropdown-toggle {\n    color: #fff;\n    background-color: #286090;\n    border-color: #204d74; }\n    .btn-primary:active:hover, .btn-primary:active:focus, .btn-primary:active.focus, .btn-primary.active:hover, .btn-primary.active:focus, .btn-primary.active.focus,\n    .open > .btn-primary.dropdown-toggle:hover,\n    .open > .btn-primary.dropdown-toggle:focus,\n    .open > .btn-primary.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #204d74;\n      border-color: #122b40; }\n  .btn-primary:active, .btn-primary.active,\n  .open > .btn-primary.dropdown-toggle {\n    background-image: none; }\n  .btn-primary.disabled:hover, .btn-primary.disabled:focus, .btn-primary.disabled.focus, .btn-primary[disabled]:hover, .btn-primary[disabled]:focus, .btn-primary[disabled].focus,\n  fieldset[disabled] .btn-primary:hover,\n  fieldset[disabled] .btn-primary:focus,\n  fieldset[disabled] .btn-primary.focus {\n    background-color: #337ab7;\n    border-color: #2e6da4; }\n  .btn-primary .badge {\n    color: #337ab7;\n    background-color: #fff; }\n\n.btn-success {\n  color: #fff;\n  background-color: #5cb85c;\n  border-color: #4cae4c; }\n  .btn-success:focus, .btn-success.focus {\n    color: #fff;\n    background-color: #449d44;\n    border-color: #255625; }\n  .btn-success:hover {\n    color: #fff;\n    background-color: #449d44;\n    border-color: #398439; }\n  .btn-success:active, .btn-success.active,\n  .open > .btn-success.dropdown-toggle {\n    color: #fff;\n    background-color: #449d44;\n    border-color: #398439; }\n    .btn-success:active:hover, .btn-success:active:focus, .btn-success:active.focus, .btn-success.active:hover, .btn-success.active:focus, .btn-success.active.focus,\n    .open > .btn-success.dropdown-toggle:hover,\n    .open > .btn-success.dropdown-toggle:focus,\n    .open > .btn-success.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #398439;\n      border-color: #255625; }\n  .btn-success:active, .btn-success.active,\n  .open > .btn-success.dropdown-toggle {\n    background-image: none; }\n  .btn-success.disabled:hover, .btn-success.disabled:focus, .btn-success.disabled.focus, .btn-success[disabled]:hover, .btn-success[disabled]:focus, .btn-success[disabled].focus,\n  fieldset[disabled] .btn-success:hover,\n  fieldset[disabled] .btn-success:focus,\n  fieldset[disabled] .btn-success.focus {\n    background-color: #5cb85c;\n    border-color: #4cae4c; }\n  .btn-success .badge {\n    color: #5cb85c;\n    background-color: #fff; }\n\n.btn-info {\n  color: #fff;\n  background-color: #5bc0de;\n  border-color: #46b8da; }\n  .btn-info:focus, .btn-info.focus {\n    color: #fff;\n    background-color: #31b0d5;\n    border-color: #1b6d85; }\n  .btn-info:hover {\n    color: #fff;\n    background-color: #31b0d5;\n    border-color: #269abc; }\n  .btn-info:active, .btn-info.active,\n  .open > .btn-info.dropdown-toggle {\n    color: #fff;\n    background-color: #31b0d5;\n    border-color: #269abc; }\n    .btn-info:active:hover, .btn-info:active:focus, .btn-info:active.focus, .btn-info.active:hover, .btn-info.active:focus, .btn-info.active.focus,\n    .open > .btn-info.dropdown-toggle:hover,\n    .open > .btn-info.dropdown-toggle:focus,\n    .open > .btn-info.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #269abc;\n      border-color: #1b6d85; }\n  .btn-info:active, .btn-info.active,\n  .open > .btn-info.dropdown-toggle {\n    background-image: none; }\n  .btn-info.disabled:hover, .btn-info.disabled:focus, .btn-info.disabled.focus, .btn-info[disabled]:hover, .btn-info[disabled]:focus, .btn-info[disabled].focus,\n  fieldset[disabled] .btn-info:hover,\n  fieldset[disabled] .btn-info:focus,\n  fieldset[disabled] .btn-info.focus {\n    background-color: #5bc0de;\n    border-color: #46b8da; }\n  .btn-info .badge {\n    color: #5bc0de;\n    background-color: #fff; }\n\n.btn-warning {\n  color: #fff;\n  background-color: #f0ad4e;\n  border-color: #eea236; }\n  .btn-warning:focus, .btn-warning.focus {\n    color: #fff;\n    background-color: #ec971f;\n    border-color: #985f0d; }\n  .btn-warning:hover {\n    color: #fff;\n    background-color: #ec971f;\n    border-color: #d58512; }\n  .btn-warning:active, .btn-warning.active,\n  .open > .btn-warning.dropdown-toggle {\n    color: #fff;\n    background-color: #ec971f;\n    border-color: #d58512; }\n    .btn-warning:active:hover, .btn-warning:active:focus, .btn-warning:active.focus, .btn-warning.active:hover, .btn-warning.active:focus, .btn-warning.active.focus,\n    .open > .btn-warning.dropdown-toggle:hover,\n    .open > .btn-warning.dropdown-toggle:focus,\n    .open > .btn-warning.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #d58512;\n      border-color: #985f0d; }\n  .btn-warning:active, .btn-warning.active,\n  .open > .btn-warning.dropdown-toggle {\n    background-image: none; }\n  .btn-warning.disabled:hover, .btn-warning.disabled:focus, .btn-warning.disabled.focus, .btn-warning[disabled]:hover, .btn-warning[disabled]:focus, .btn-warning[disabled].focus,\n  fieldset[disabled] .btn-warning:hover,\n  fieldset[disabled] .btn-warning:focus,\n  fieldset[disabled] .btn-warning.focus {\n    background-color: #f0ad4e;\n    border-color: #eea236; }\n  .btn-warning .badge {\n    color: #f0ad4e;\n    background-color: #fff; }\n\n.btn-danger {\n  color: #fff;\n  background-color: #d9534f;\n  border-color: #d43f3a; }\n  .btn-danger:focus, .btn-danger.focus {\n    color: #fff;\n    background-color: #c9302c;\n    border-color: #761c19; }\n  .btn-danger:hover {\n    color: #fff;\n    background-color: #c9302c;\n    border-color: #ac2925; }\n  .btn-danger:active, .btn-danger.active,\n  .open > .btn-danger.dropdown-toggle {\n    color: #fff;\n    background-color: #c9302c;\n    border-color: #ac2925; }\n    .btn-danger:active:hover, .btn-danger:active:focus, .btn-danger:active.focus, .btn-danger.active:hover, .btn-danger.active:focus, .btn-danger.active.focus,\n    .open > .btn-danger.dropdown-toggle:hover,\n    .open > .btn-danger.dropdown-toggle:focus,\n    .open > .btn-danger.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #ac2925;\n      border-color: #761c19; }\n  .btn-danger:active, .btn-danger.active,\n  .open > .btn-danger.dropdown-toggle {\n    background-image: none; }\n  .btn-danger.disabled:hover, .btn-danger.disabled:focus, .btn-danger.disabled.focus, .btn-danger[disabled]:hover, .btn-danger[disabled]:focus, .btn-danger[disabled].focus,\n  fieldset[disabled] .btn-danger:hover,\n  fieldset[disabled] .btn-danger:focus,\n  fieldset[disabled] .btn-danger.focus {\n    background-color: #d9534f;\n    border-color: #d43f3a; }\n  .btn-danger .badge {\n    color: #d9534f;\n    background-color: #fff; }\n\n.btn-link {\n  color: #337ab7;\n  font-weight: normal;\n  border-radius: 0; }\n  .btn-link, .btn-link:active, .btn-link.active, .btn-link[disabled],\n  fieldset[disabled] .btn-link {\n    background-color: transparent;\n    -webkit-box-shadow: none;\n    box-shadow: none; }\n  .btn-link, .btn-link:hover, .btn-link:focus, .btn-link:active {\n    border-color: transparent; }\n  .btn-link:hover, .btn-link:focus {\n    color: #23527c;\n    text-decoration: underline;\n    background-color: transparent; }\n  .btn-link[disabled]:hover, .btn-link[disabled]:focus,\n  fieldset[disabled] .btn-link:hover,\n  fieldset[disabled] .btn-link:focus {\n    color: #777777;\n    text-decoration: none; }\n\n.btn-lg, .btn-group-lg > .btn {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.33333;\n  border-radius: 6px; }\n\n.btn-sm, .btn-group-sm > .btn {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\n.btn-xs, .btn-group-xs > .btn {\n  padding: 1px 5px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\n.btn-block {\n  display: block;\n  width: 100%; }\n\n.btn-block + .btn-block {\n  margin-top: 5px; }\n\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%; }\n\n.fade {\n  opacity: 0;\n  -webkit-transition: opacity 0.15s linear;\n  -o-transition: opacity 0.15s linear;\n  transition: opacity 0.15s linear; }\n  .fade.in {\n    opacity: 1; }\n\n.collapse {\n  display: none; }\n  .collapse.in {\n    display: block; }\n\ntr.collapse.in {\n  display: table-row; }\n\ntbody.collapse.in {\n  display: table-row-group; }\n\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  -webkit-transition-property: height, visibility;\n  transition-property: height, visibility;\n  -webkit-transition-duration: 0.35s;\n  transition-duration: 0.35s;\n  -webkit-transition-timing-function: ease;\n  transition-timing-function: ease; }\n\n.caret {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 2px;\n  vertical-align: middle;\n  border-top: 4px dashed;\n  border-top: 4px solid \\9;\n  border-right: 4px solid transparent;\n  border-left: 4px solid transparent; }\n\n.dropup,\n.dropdown {\n  position: relative; }\n\n.dropdown-toggle:focus {\n  outline: 0; }\n\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 160px;\n  padding: 5px 0;\n  margin: 2px 0 0;\n  list-style: none;\n  font-size: 14px;\n  text-align: left;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  background-clip: padding-box; }\n  .dropdown-menu.pull-right {\n    right: 0;\n    left: auto; }\n  .dropdown-menu .divider {\n    height: 1px;\n    margin: 9px 0;\n    overflow: hidden;\n    background-color: #e5e5e5; }\n  .dropdown-menu > li > a {\n    display: block;\n    padding: 3px 20px;\n    clear: both;\n    font-weight: normal;\n    line-height: 1.42857;\n    color: #333333;\n    white-space: nowrap; }\n\n.dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus {\n  text-decoration: none;\n  color: #262626;\n  background-color: #f5f5f5; }\n\n.dropdown-menu > .active > a, .dropdown-menu > .active > a:hover, .dropdown-menu > .active > a:focus {\n  color: #fff;\n  text-decoration: none;\n  outline: 0;\n  background-color: #337ab7; }\n\n.dropdown-menu > .disabled > a, .dropdown-menu > .disabled > a:hover, .dropdown-menu > .disabled > a:focus {\n  color: #777777; }\n\n.dropdown-menu > .disabled > a:hover, .dropdown-menu > .disabled > a:focus {\n  text-decoration: none;\n  background-color: transparent;\n  background-image: none;\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\n  cursor: not-allowed; }\n\n.open > .dropdown-menu {\n  display: block; }\n\n.open > a {\n  outline: 0; }\n\n.dropdown-menu-right {\n  left: auto;\n  right: 0; }\n\n.dropdown-menu-left {\n  left: 0;\n  right: auto; }\n\n.dropdown-header {\n  display: block;\n  padding: 3px 20px;\n  font-size: 12px;\n  line-height: 1.42857;\n  color: #777777;\n  white-space: nowrap; }\n\n.dropdown-backdrop {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  z-index: 990; }\n\n.pull-right > .dropdown-menu {\n  right: 0;\n  left: auto; }\n\n.dropup .caret,\n.navbar-fixed-bottom .dropdown .caret {\n  border-top: 0;\n  border-bottom: 4px dashed;\n  border-bottom: 4px solid \\9;\n  content: \"\"; }\n\n.dropup .dropdown-menu,\n.navbar-fixed-bottom .dropdown .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-bottom: 2px; }\n\n@media (min-width: 768px) {\n  .navbar-right .dropdown-menu {\n    right: 0;\n    left: auto; }\n  .navbar-right .dropdown-menu-left {\n    left: 0;\n    right: auto; } }\n\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle; }\n  .btn-group > .btn,\n  .btn-group-vertical > .btn {\n    position: relative;\n    float: left; }\n    .btn-group > .btn:hover, .btn-group > .btn:focus, .btn-group > .btn:active, .btn-group > .btn.active,\n    .btn-group-vertical > .btn:hover,\n    .btn-group-vertical > .btn:focus,\n    .btn-group-vertical > .btn:active,\n    .btn-group-vertical > .btn.active {\n      z-index: 2; }\n\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group {\n  margin-left: -1px; }\n\n.btn-toolbar {\n  margin-left: -5px; }\n  .btn-toolbar:before, .btn-toolbar:after {\n    content: \" \";\n    display: table; }\n  .btn-toolbar:after {\n    clear: both; }\n  .btn-toolbar .btn,\n  .btn-toolbar .btn-group,\n  .btn-toolbar .input-group {\n    float: left; }\n  .btn-toolbar > .btn,\n  .btn-toolbar > .btn-group,\n  .btn-toolbar > .input-group {\n    margin-left: 5px; }\n\n.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\n  border-radius: 0; }\n\n.btn-group > .btn:first-child {\n  margin-left: 0; }\n  .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n    border-bottom-right-radius: 0;\n    border-top-right-radius: 0; }\n\n.btn-group > .btn:last-child:not(:first-child),\n.btn-group > .dropdown-toggle:not(:first-child) {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n.btn-group > .btn-group {\n  float: left; }\n\n.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0; }\n\n.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0; }\n\n.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n.btn-group .dropdown-toggle:active,\n.btn-group.open .dropdown-toggle {\n  outline: 0; }\n\n.btn-group > .btn + .dropdown-toggle {\n  padding-left: 8px;\n  padding-right: 8px; }\n\n.btn-group > .btn-lg + .dropdown-toggle, .btn-group-lg.btn-group > .btn + .dropdown-toggle {\n  padding-left: 12px;\n  padding-right: 12px; }\n\n.btn-group.open .dropdown-toggle {\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); }\n  .btn-group.open .dropdown-toggle.btn-link {\n    -webkit-box-shadow: none;\n    box-shadow: none; }\n\n.btn .caret {\n  margin-left: 0; }\n\n.btn-lg .caret, .btn-group-lg > .btn .caret {\n  border-width: 5px 5px 0;\n  border-bottom-width: 0; }\n\n.dropup .btn-lg .caret, .dropup .btn-group-lg > .btn .caret {\n  border-width: 0 5px 5px; }\n\n.btn-group-vertical > .btn,\n.btn-group-vertical > .btn-group,\n.btn-group-vertical > .btn-group > .btn {\n  display: block;\n  float: none;\n  width: 100%;\n  max-width: 100%; }\n\n.btn-group-vertical > .btn-group:before, .btn-group-vertical > .btn-group:after {\n  content: \" \";\n  display: table; }\n\n.btn-group-vertical > .btn-group:after {\n  clear: both; }\n\n.btn-group-vertical > .btn-group > .btn {\n  float: none; }\n\n.btn-group-vertical > .btn + .btn,\n.btn-group-vertical > .btn + .btn-group,\n.btn-group-vertical > .btn-group + .btn,\n.btn-group-vertical > .btn-group + .btn-group {\n  margin-top: -1px;\n  margin-left: 0; }\n\n.btn-group-vertical > .btn:not(:first-child):not(:last-child) {\n  border-radius: 0; }\n\n.btn-group-vertical > .btn:first-child:not(:last-child) {\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.btn-group-vertical > .btn:last-child:not(:first-child) {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px; }\n\n.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0; }\n\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.btn-group-justified {\n  display: table;\n  width: 100%;\n  table-layout: fixed;\n  border-collapse: separate; }\n  .btn-group-justified > .btn,\n  .btn-group-justified > .btn-group {\n    float: none;\n    display: table-cell;\n    width: 1%; }\n  .btn-group-justified > .btn-group .btn {\n    width: 100%; }\n  .btn-group-justified > .btn-group .dropdown-menu {\n    left: auto; }\n\n[data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\n  position: absolute;\n  clip: rect(0, 0, 0, 0);\n  pointer-events: none; }\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate; }\n  .input-group[class*=\"col-\"] {\n    float: none;\n    padding-left: 0;\n    padding-right: 0; }\n  .input-group .form-control {\n    position: relative;\n    z-index: 2;\n    float: left;\n    width: 100%;\n    margin-bottom: 0; }\n    .input-group .form-control:focus {\n      z-index: 3; }\n\n.input-group-addon,\n.input-group-btn,\n.input-group .form-control {\n  display: table-cell; }\n  .input-group-addon:not(:first-child):not(:last-child),\n  .input-group-btn:not(:first-child):not(:last-child),\n  .input-group .form-control:not(:first-child):not(:last-child) {\n    border-radius: 0; }\n\n.input-group-addon,\n.input-group-btn {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle; }\n\n.input-group-addon {\n  padding: 6px 12px;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: 1;\n  color: #555555;\n  text-align: center;\n  background-color: #eeeeee;\n  border: 1px solid #ccc;\n  border-radius: 4px; }\n  .input-group-addon.input-sm,\n  .input-group-sm > .input-group-addon,\n  .input-group-sm > .input-group-btn > .input-group-addon.btn {\n    padding: 5px 10px;\n    font-size: 12px;\n    border-radius: 3px; }\n  .input-group-addon.input-lg,\n  .input-group-lg > .input-group-addon,\n  .input-group-lg > .input-group-btn > .input-group-addon.btn {\n    padding: 10px 16px;\n    font-size: 18px;\n    border-radius: 6px; }\n  .input-group-addon input[type=\"radio\"],\n  .input-group-addon input[type=\"checkbox\"] {\n    margin-top: 0; }\n\n.input-group .form-control:first-child,\n.input-group-addon:first-child,\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group > .btn,\n.input-group-btn:first-child > .dropdown-toggle,\n.input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group-btn:last-child > .btn-group:not(:last-child) > .btn {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0; }\n\n.input-group-addon:first-child {\n  border-right: 0; }\n\n.input-group .form-control:last-child,\n.input-group-addon:last-child,\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group > .btn,\n.input-group-btn:last-child > .dropdown-toggle,\n.input-group-btn:first-child > .btn:not(:first-child),\n.input-group-btn:first-child > .btn-group:not(:first-child) > .btn {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n.input-group-addon:last-child {\n  border-left: 0; }\n\n.input-group-btn {\n  position: relative;\n  font-size: 0;\n  white-space: nowrap; }\n  .input-group-btn > .btn {\n    position: relative; }\n    .input-group-btn > .btn + .btn {\n      margin-left: -1px; }\n    .input-group-btn > .btn:hover, .input-group-btn > .btn:focus, .input-group-btn > .btn:active {\n      z-index: 2; }\n  .input-group-btn:first-child > .btn,\n  .input-group-btn:first-child > .btn-group {\n    margin-right: -1px; }\n  .input-group-btn:last-child > .btn,\n  .input-group-btn:last-child > .btn-group {\n    z-index: 2;\n    margin-left: -1px; }\n\n.nav {\n  margin-bottom: 0;\n  padding-left: 0;\n  list-style: none; }\n  .nav:before, .nav:after {\n    content: \" \";\n    display: table; }\n  .nav:after {\n    clear: both; }\n  .nav > li {\n    position: relative;\n    display: block; }\n    .nav > li > a {\n      position: relative;\n      display: block;\n      padding: 10px 15px; }\n      .nav > li > a:hover, .nav > li > a:focus {\n        text-decoration: none;\n        background-color: #eeeeee; }\n    .nav > li.disabled > a {\n      color: #777777; }\n      .nav > li.disabled > a:hover, .nav > li.disabled > a:focus {\n        color: #777777;\n        text-decoration: none;\n        background-color: transparent;\n        cursor: not-allowed; }\n  .nav .open > a, .nav .open > a:hover, .nav .open > a:focus {\n    background-color: #eeeeee;\n    border-color: #337ab7; }\n  .nav .nav-divider {\n    height: 1px;\n    margin: 9px 0;\n    overflow: hidden;\n    background-color: #e5e5e5; }\n  .nav > li > a > img {\n    max-width: none; }\n\n.nav-tabs {\n  border-bottom: 1px solid #ddd; }\n  .nav-tabs > li {\n    float: left;\n    margin-bottom: -1px; }\n    .nav-tabs > li > a {\n      margin-right: 2px;\n      line-height: 1.42857;\n      border: 1px solid transparent;\n      border-radius: 4px 4px 0 0; }\n      .nav-tabs > li > a:hover {\n        border-color: #eeeeee #eeeeee #ddd; }\n    .nav-tabs > li.active > a, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus {\n      color: #555555;\n      background-color: #fff;\n      border: 1px solid #ddd;\n      border-bottom-color: transparent;\n      cursor: default; }\n\n.nav-pills > li {\n  float: left; }\n  .nav-pills > li > a {\n    border-radius: 4px; }\n  .nav-pills > li + li {\n    margin-left: 2px; }\n  .nav-pills > li.active > a, .nav-pills > li.active > a:hover, .nav-pills > li.active > a:focus {\n    color: #fff;\n    background-color: #337ab7; }\n\n.nav-stacked > li {\n  float: none; }\n  .nav-stacked > li + li {\n    margin-top: 2px;\n    margin-left: 0; }\n\n.nav-justified, .nav-tabs.nav-justified {\n  width: 100%; }\n  .nav-justified > li, .nav-tabs.nav-justified > li {\n    float: none; }\n    .nav-justified > li > a, .nav-tabs.nav-justified > li > a {\n      text-align: center;\n      margin-bottom: 5px; }\n  .nav-justified > .dropdown .dropdown-menu {\n    top: auto;\n    left: auto; }\n  @media (min-width: 768px) {\n    .nav-justified > li, .nav-tabs.nav-justified > li {\n      display: table-cell;\n      width: 1%; }\n      .nav-justified > li > a, .nav-tabs.nav-justified > li > a {\n        margin-bottom: 0; } }\n\n.nav-tabs-justified, .nav-tabs.nav-justified {\n  border-bottom: 0; }\n  .nav-tabs-justified > li > a, .nav-tabs.nav-justified > li > a {\n    margin-right: 0;\n    border-radius: 4px; }\n  .nav-tabs-justified > .active > a, .nav-tabs.nav-justified > .active > a,\n  .nav-tabs-justified > .active > a:hover, .nav-tabs.nav-justified > .active > a:hover,\n  .nav-tabs-justified > .active > a:focus, .nav-tabs.nav-justified > .active > a:focus {\n    border: 1px solid #ddd; }\n  @media (min-width: 768px) {\n    .nav-tabs-justified > li > a, .nav-tabs.nav-justified > li > a {\n      border-bottom: 1px solid #ddd;\n      border-radius: 4px 4px 0 0; }\n    .nav-tabs-justified > .active > a, .nav-tabs.nav-justified > .active > a,\n    .nav-tabs-justified > .active > a:hover, .nav-tabs.nav-justified > .active > a:hover,\n    .nav-tabs-justified > .active > a:focus, .nav-tabs.nav-justified > .active > a:focus {\n      border-bottom-color: #fff; } }\n\n.tab-content > .tab-pane {\n  display: none; }\n\n.tab-content > .active {\n  display: block; }\n\n.nav-tabs .dropdown-menu {\n  margin-top: -1px;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.navbar {\n  position: relative;\n  min-height: 50px;\n  margin-bottom: 20px;\n  border: 1px solid transparent; }\n  .navbar:before, .navbar:after {\n    content: \" \";\n    display: table; }\n  .navbar:after {\n    clear: both; }\n  @media (min-width: 768px) {\n    .navbar {\n      border-radius: 4px; } }\n\n.navbar-header:before, .navbar-header:after {\n  content: \" \";\n  display: table; }\n\n.navbar-header:after {\n  clear: both; }\n\n@media (min-width: 768px) {\n  .navbar-header {\n    float: left; } }\n\n.navbar-collapse {\n  overflow-x: visible;\n  padding-right: 15px;\n  padding-left: 15px;\n  border-top: 1px solid transparent;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);\n  -webkit-overflow-scrolling: touch; }\n  .navbar-collapse:before, .navbar-collapse:after {\n    content: \" \";\n    display: table; }\n  .navbar-collapse:after {\n    clear: both; }\n  .navbar-collapse.in {\n    overflow-y: auto; }\n  @media (min-width: 768px) {\n    .navbar-collapse {\n      width: auto;\n      border-top: 0;\n      box-shadow: none; }\n      .navbar-collapse.collapse {\n        display: block !important;\n        height: auto !important;\n        padding-bottom: 0;\n        overflow: visible !important; }\n      .navbar-collapse.in {\n        overflow-y: visible; }\n      .navbar-fixed-top .navbar-collapse,\n      .navbar-static-top .navbar-collapse,\n      .navbar-fixed-bottom .navbar-collapse {\n        padding-left: 0;\n        padding-right: 0; } }\n\n.navbar-fixed-top .navbar-collapse,\n.navbar-fixed-bottom .navbar-collapse {\n  max-height: 340px; }\n  @media (max-device-width: 480px) and (orientation: landscape) {\n    .navbar-fixed-top .navbar-collapse,\n    .navbar-fixed-bottom .navbar-collapse {\n      max-height: 200px; } }\n\n.container > .navbar-header,\n.container > .navbar-collapse,\n.container-fluid > .navbar-header,\n.container-fluid > .navbar-collapse {\n  margin-right: -15px;\n  margin-left: -15px; }\n  @media (min-width: 768px) {\n    .container > .navbar-header,\n    .container > .navbar-collapse,\n    .container-fluid > .navbar-header,\n    .container-fluid > .navbar-collapse {\n      margin-right: 0;\n      margin-left: 0; } }\n\n.navbar-static-top {\n  z-index: 1000;\n  border-width: 0 0 1px; }\n  @media (min-width: 768px) {\n    .navbar-static-top {\n      border-radius: 0; } }\n\n.navbar-fixed-top,\n.navbar-fixed-bottom {\n  position: fixed;\n  right: 0;\n  left: 0;\n  z-index: 1030; }\n  @media (min-width: 768px) {\n    .navbar-fixed-top,\n    .navbar-fixed-bottom {\n      border-radius: 0; } }\n\n.navbar-fixed-top {\n  top: 0;\n  border-width: 0 0 1px; }\n\n.navbar-fixed-bottom {\n  bottom: 0;\n  margin-bottom: 0;\n  border-width: 1px 0 0; }\n\n.navbar-brand {\n  float: left;\n  padding: 15px 15px;\n  font-size: 18px;\n  line-height: 20px;\n  height: 50px; }\n  .navbar-brand:hover, .navbar-brand:focus {\n    text-decoration: none; }\n  .navbar-brand > img {\n    display: block; }\n  @media (min-width: 768px) {\n    .navbar > .container .navbar-brand,\n    .navbar > .container-fluid .navbar-brand {\n      margin-left: -15px; } }\n\n.navbar-toggle {\n  position: relative;\n  float: right;\n  margin-right: 15px;\n  padding: 9px 10px;\n  margin-top: 8px;\n  margin-bottom: 8px;\n  background-color: transparent;\n  background-image: none;\n  border: 1px solid transparent;\n  border-radius: 4px; }\n  .navbar-toggle:focus {\n    outline: 0; }\n  .navbar-toggle .icon-bar {\n    display: block;\n    width: 22px;\n    height: 2px;\n    border-radius: 1px; }\n  .navbar-toggle .icon-bar + .icon-bar {\n    margin-top: 4px; }\n  @media (min-width: 768px) {\n    .navbar-toggle {\n      display: none; } }\n\n.navbar-nav {\n  margin: 7.5px -15px; }\n  .navbar-nav > li > a {\n    padding-top: 10px;\n    padding-bottom: 10px;\n    line-height: 20px; }\n  @media (max-width: 767px) {\n    .navbar-nav .open .dropdown-menu {\n      position: static;\n      float: none;\n      width: auto;\n      margin-top: 0;\n      background-color: transparent;\n      border: 0;\n      box-shadow: none; }\n      .navbar-nav .open .dropdown-menu > li > a,\n      .navbar-nav .open .dropdown-menu .dropdown-header {\n        padding: 5px 15px 5px 25px; }\n      .navbar-nav .open .dropdown-menu > li > a {\n        line-height: 20px; }\n        .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-nav .open .dropdown-menu > li > a:focus {\n          background-image: none; } }\n  @media (min-width: 768px) {\n    .navbar-nav {\n      float: left;\n      margin: 0; }\n      .navbar-nav > li {\n        float: left; }\n        .navbar-nav > li > a {\n          padding-top: 15px;\n          padding-bottom: 15px; } }\n\n.navbar-form {\n  margin-left: -15px;\n  margin-right: -15px;\n  padding: 10px 15px;\n  border-top: 1px solid transparent;\n  border-bottom: 1px solid transparent;\n  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  margin-top: 8px;\n  margin-bottom: 8px; }\n  @media (min-width: 768px) {\n    .navbar-form .form-group {\n      display: inline-block;\n      margin-bottom: 0;\n      vertical-align: middle; }\n    .navbar-form .form-control {\n      display: inline-block;\n      width: auto;\n      vertical-align: middle; }\n    .navbar-form .form-control-static {\n      display: inline-block; }\n    .navbar-form .input-group {\n      display: inline-table;\n      vertical-align: middle; }\n      .navbar-form .input-group .input-group-addon,\n      .navbar-form .input-group .input-group-btn,\n      .navbar-form .input-group .form-control {\n        width: auto; }\n    .navbar-form .input-group > .form-control {\n      width: 100%; }\n    .navbar-form .control-label {\n      margin-bottom: 0;\n      vertical-align: middle; }\n    .navbar-form .radio,\n    .navbar-form .checkbox {\n      display: inline-block;\n      margin-top: 0;\n      margin-bottom: 0;\n      vertical-align: middle; }\n      .navbar-form .radio label,\n      .navbar-form .checkbox label {\n        padding-left: 0; }\n    .navbar-form .radio input[type=\"radio\"],\n    .navbar-form .checkbox input[type=\"checkbox\"] {\n      position: relative;\n      margin-left: 0; }\n    .navbar-form .has-feedback .form-control-feedback {\n      top: 0; } }\n  @media (max-width: 767px) {\n    .navbar-form .form-group {\n      margin-bottom: 5px; }\n      .navbar-form .form-group:last-child {\n        margin-bottom: 0; } }\n  @media (min-width: 768px) {\n    .navbar-form {\n      width: auto;\n      border: 0;\n      margin-left: 0;\n      margin-right: 0;\n      padding-top: 0;\n      padding-bottom: 0;\n      -webkit-box-shadow: none;\n      box-shadow: none; } }\n\n.navbar-nav > li > .dropdown-menu {\n  margin-top: 0;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.navbar-fixed-bottom .navbar-nav > li > .dropdown-menu {\n  margin-bottom: 0;\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.navbar-btn {\n  margin-top: 8px;\n  margin-bottom: 8px; }\n  .navbar-btn.btn-sm, .btn-group-sm > .navbar-btn.btn {\n    margin-top: 10px;\n    margin-bottom: 10px; }\n  .navbar-btn.btn-xs, .btn-group-xs > .navbar-btn.btn {\n    margin-top: 14px;\n    margin-bottom: 14px; }\n\n.navbar-text {\n  margin-top: 15px;\n  margin-bottom: 15px; }\n  @media (min-width: 768px) {\n    .navbar-text {\n      float: left;\n      margin-left: 15px;\n      margin-right: 15px; } }\n\n@media (min-width: 768px) {\n  .navbar-left {\n    float: left !important; }\n  .navbar-right {\n    float: right !important;\n    margin-right: -15px; }\n    .navbar-right ~ .navbar-right {\n      margin-right: 0; } }\n\n.navbar-default {\n  background-color: #f8f8f8;\n  border-color: #e7e7e7; }\n  .navbar-default .navbar-brand {\n    color: #777; }\n    .navbar-default .navbar-brand:hover, .navbar-default .navbar-brand:focus {\n      color: #5e5e5e;\n      background-color: transparent; }\n  .navbar-default .navbar-text {\n    color: #777; }\n  .navbar-default .navbar-nav > li > a {\n    color: #777; }\n    .navbar-default .navbar-nav > li > a:hover, .navbar-default .navbar-nav > li > a:focus {\n      color: #333;\n      background-color: transparent; }\n  .navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:hover, .navbar-default .navbar-nav > .active > a:focus {\n    color: #555;\n    background-color: #e7e7e7; }\n  .navbar-default .navbar-nav > .disabled > a, .navbar-default .navbar-nav > .disabled > a:hover, .navbar-default .navbar-nav > .disabled > a:focus {\n    color: #ccc;\n    background-color: transparent; }\n  .navbar-default .navbar-toggle {\n    border-color: #ddd; }\n    .navbar-default .navbar-toggle:hover, .navbar-default .navbar-toggle:focus {\n      background-color: #ddd; }\n    .navbar-default .navbar-toggle .icon-bar {\n      background-color: #888; }\n  .navbar-default .navbar-collapse,\n  .navbar-default .navbar-form {\n    border-color: #e7e7e7; }\n  .navbar-default .navbar-nav > .open > a, .navbar-default .navbar-nav > .open > a:hover, .navbar-default .navbar-nav > .open > a:focus {\n    background-color: #e7e7e7;\n    color: #555; }\n  @media (max-width: 767px) {\n    .navbar-default .navbar-nav .open .dropdown-menu > li > a {\n      color: #777; }\n      .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {\n        color: #333;\n        background-color: transparent; }\n    .navbar-default .navbar-nav .open .dropdown-menu > .active > a, .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {\n      color: #555;\n      background-color: #e7e7e7; }\n    .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a, .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n      color: #ccc;\n      background-color: transparent; } }\n  .navbar-default .navbar-link {\n    color: #777; }\n    .navbar-default .navbar-link:hover {\n      color: #333; }\n  .navbar-default .btn-link {\n    color: #777; }\n    .navbar-default .btn-link:hover, .navbar-default .btn-link:focus {\n      color: #333; }\n    .navbar-default .btn-link[disabled]:hover, .navbar-default .btn-link[disabled]:focus,\n    fieldset[disabled] .navbar-default .btn-link:hover,\n    fieldset[disabled] .navbar-default .btn-link:focus {\n      color: #ccc; }\n\n.navbar-inverse {\n  background-color: #222;\n  border-color: #090909; }\n  .navbar-inverse .navbar-brand {\n    color: #9d9d9d; }\n    .navbar-inverse .navbar-brand:hover, .navbar-inverse .navbar-brand:focus {\n      color: #fff;\n      background-color: transparent; }\n  .navbar-inverse .navbar-text {\n    color: #9d9d9d; }\n  .navbar-inverse .navbar-nav > li > a {\n    color: #9d9d9d; }\n    .navbar-inverse .navbar-nav > li > a:hover, .navbar-inverse .navbar-nav > li > a:focus {\n      color: #fff;\n      background-color: transparent; }\n  .navbar-inverse .navbar-nav > .active > a, .navbar-inverse .navbar-nav > .active > a:hover, .navbar-inverse .navbar-nav > .active > a:focus {\n    color: #fff;\n    background-color: #090909; }\n  .navbar-inverse .navbar-nav > .disabled > a, .navbar-inverse .navbar-nav > .disabled > a:hover, .navbar-inverse .navbar-nav > .disabled > a:focus {\n    color: #444;\n    background-color: transparent; }\n  .navbar-inverse .navbar-toggle {\n    border-color: #333; }\n    .navbar-inverse .navbar-toggle:hover, .navbar-inverse .navbar-toggle:focus {\n      background-color: #333; }\n    .navbar-inverse .navbar-toggle .icon-bar {\n      background-color: #fff; }\n  .navbar-inverse .navbar-collapse,\n  .navbar-inverse .navbar-form {\n    border-color: #101010; }\n  .navbar-inverse .navbar-nav > .open > a, .navbar-inverse .navbar-nav > .open > a:hover, .navbar-inverse .navbar-nav > .open > a:focus {\n    background-color: #090909;\n    color: #fff; }\n  @media (max-width: 767px) {\n    .navbar-inverse .navbar-nav .open .dropdown-menu > .dropdown-header {\n      border-color: #090909; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu .divider {\n      background-color: #090909; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {\n      color: #9d9d9d; }\n      .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {\n        color: #fff;\n        background-color: transparent; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a, .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:focus {\n      color: #fff;\n      background-color: #090909; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a, .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n      color: #444;\n      background-color: transparent; } }\n  .navbar-inverse .navbar-link {\n    color: #9d9d9d; }\n    .navbar-inverse .navbar-link:hover {\n      color: #fff; }\n  .navbar-inverse .btn-link {\n    color: #9d9d9d; }\n    .navbar-inverse .btn-link:hover, .navbar-inverse .btn-link:focus {\n      color: #fff; }\n    .navbar-inverse .btn-link[disabled]:hover, .navbar-inverse .btn-link[disabled]:focus,\n    fieldset[disabled] .navbar-inverse .btn-link:hover,\n    fieldset[disabled] .navbar-inverse .btn-link:focus {\n      color: #444; }\n\n.breadcrumb {\n  padding: 8px 15px;\n  margin-bottom: 20px;\n  list-style: none;\n  background-color: #f5f5f5;\n  border-radius: 4px; }\n  .breadcrumb > li {\n    display: inline-block; }\n    .breadcrumb > li + li:before {\n      content: \"/\\A0\";\n      padding: 0 5px;\n      color: #ccc; }\n  .breadcrumb > .active {\n    color: #777777; }\n\n.pagination {\n  display: inline-block;\n  padding-left: 0;\n  margin: 20px 0;\n  border-radius: 4px; }\n  .pagination > li {\n    display: inline; }\n    .pagination > li > a,\n    .pagination > li > span {\n      position: relative;\n      float: left;\n      padding: 6px 12px;\n      line-height: 1.42857;\n      text-decoration: none;\n      color: #337ab7;\n      background-color: #fff;\n      border: 1px solid #ddd;\n      margin-left: -1px; }\n    .pagination > li:first-child > a,\n    .pagination > li:first-child > span {\n      margin-left: 0;\n      border-bottom-left-radius: 4px;\n      border-top-left-radius: 4px; }\n    .pagination > li:last-child > a,\n    .pagination > li:last-child > span {\n      border-bottom-right-radius: 4px;\n      border-top-right-radius: 4px; }\n  .pagination > li > a:hover, .pagination > li > a:focus,\n  .pagination > li > span:hover,\n  .pagination > li > span:focus {\n    z-index: 2;\n    color: #23527c;\n    background-color: #eeeeee;\n    border-color: #ddd; }\n  .pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > a:focus,\n  .pagination > .active > span,\n  .pagination > .active > span:hover,\n  .pagination > .active > span:focus {\n    z-index: 3;\n    color: #fff;\n    background-color: #337ab7;\n    border-color: #337ab7;\n    cursor: default; }\n  .pagination > .disabled > span,\n  .pagination > .disabled > span:hover,\n  .pagination > .disabled > span:focus,\n  .pagination > .disabled > a,\n  .pagination > .disabled > a:hover,\n  .pagination > .disabled > a:focus {\n    color: #777777;\n    background-color: #fff;\n    border-color: #ddd;\n    cursor: not-allowed; }\n\n.pagination-lg > li > a,\n.pagination-lg > li > span {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.33333; }\n\n.pagination-lg > li:first-child > a,\n.pagination-lg > li:first-child > span {\n  border-bottom-left-radius: 6px;\n  border-top-left-radius: 6px; }\n\n.pagination-lg > li:last-child > a,\n.pagination-lg > li:last-child > span {\n  border-bottom-right-radius: 6px;\n  border-top-right-radius: 6px; }\n\n.pagination-sm > li > a,\n.pagination-sm > li > span {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5; }\n\n.pagination-sm > li:first-child > a,\n.pagination-sm > li:first-child > span {\n  border-bottom-left-radius: 3px;\n  border-top-left-radius: 3px; }\n\n.pagination-sm > li:last-child > a,\n.pagination-sm > li:last-child > span {\n  border-bottom-right-radius: 3px;\n  border-top-right-radius: 3px; }\n\n.pager {\n  padding-left: 0;\n  margin: 20px 0;\n  list-style: none;\n  text-align: center; }\n  .pager:before, .pager:after {\n    content: \" \";\n    display: table; }\n  .pager:after {\n    clear: both; }\n  .pager li {\n    display: inline; }\n    .pager li > a,\n    .pager li > span {\n      display: inline-block;\n      padding: 5px 14px;\n      background-color: #fff;\n      border: 1px solid #ddd;\n      border-radius: 15px; }\n    .pager li > a:hover,\n    .pager li > a:focus {\n      text-decoration: none;\n      background-color: #eeeeee; }\n  .pager .next > a,\n  .pager .next > span {\n    float: right; }\n  .pager .previous > a,\n  .pager .previous > span {\n    float: left; }\n  .pager .disabled > a,\n  .pager .disabled > a:hover,\n  .pager .disabled > a:focus,\n  .pager .disabled > span {\n    color: #777777;\n    background-color: #fff;\n    cursor: not-allowed; }\n\n.label {\n  display: inline;\n  padding: .2em .6em .3em;\n  font-size: 75%;\n  font-weight: bold;\n  line-height: 1;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: .25em; }\n  .label:empty {\n    display: none; }\n  .btn .label {\n    position: relative;\n    top: -1px; }\n\na.label:hover, a.label:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer; }\n\n.label-default {\n  background-color: #777777; }\n  .label-default[href]:hover, .label-default[href]:focus {\n    background-color: #5e5e5e; }\n\n.label-primary {\n  background-color: #337ab7; }\n  .label-primary[href]:hover, .label-primary[href]:focus {\n    background-color: #286090; }\n\n.label-success {\n  background-color: #5cb85c; }\n  .label-success[href]:hover, .label-success[href]:focus {\n    background-color: #449d44; }\n\n.label-info {\n  background-color: #5bc0de; }\n  .label-info[href]:hover, .label-info[href]:focus {\n    background-color: #31b0d5; }\n\n.label-warning {\n  background-color: #f0ad4e; }\n  .label-warning[href]:hover, .label-warning[href]:focus {\n    background-color: #ec971f; }\n\n.label-danger {\n  background-color: #d9534f; }\n  .label-danger[href]:hover, .label-danger[href]:focus {\n    background-color: #c9302c; }\n\n.badge {\n  display: inline-block;\n  min-width: 10px;\n  padding: 3px 7px;\n  font-size: 12px;\n  font-weight: bold;\n  color: #fff;\n  line-height: 1;\n  vertical-align: middle;\n  white-space: nowrap;\n  text-align: center;\n  background-color: #777777;\n  border-radius: 10px; }\n  .badge:empty {\n    display: none; }\n  .btn .badge {\n    position: relative;\n    top: -1px; }\n  .btn-xs .badge, .btn-group-xs > .btn .badge,\n  .btn-group-xs > .btn .badge {\n    top: 0;\n    padding: 1px 5px; }\n  .list-group-item.active > .badge,\n  .nav-pills > .active > a > .badge {\n    color: #337ab7;\n    background-color: #fff; }\n  .list-group-item > .badge {\n    float: right; }\n  .list-group-item > .badge + .badge {\n    margin-right: 5px; }\n  .nav-pills > li > a > .badge {\n    margin-left: 3px; }\n\na.badge:hover, a.badge:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer; }\n\n.jumbotron {\n  padding-top: 30px;\n  padding-bottom: 30px;\n  margin-bottom: 30px;\n  color: inherit;\n  background-color: #eeeeee; }\n  .jumbotron h1,\n  .jumbotron .h1 {\n    color: inherit; }\n  .jumbotron p {\n    margin-bottom: 15px;\n    font-size: 21px;\n    font-weight: 200; }\n  .jumbotron > hr {\n    border-top-color: #d5d5d5; }\n  .container .jumbotron,\n  .container-fluid .jumbotron {\n    border-radius: 6px;\n    padding-left: 15px;\n    padding-right: 15px; }\n  .jumbotron .container {\n    max-width: 100%; }\n  @media screen and (min-width: 768px) {\n    .jumbotron {\n      padding-top: 48px;\n      padding-bottom: 48px; }\n      .container .jumbotron,\n      .container-fluid .jumbotron {\n        padding-left: 60px;\n        padding-right: 60px; }\n      .jumbotron h1,\n      .jumbotron .h1 {\n        font-size: 63px; } }\n\n.thumbnail {\n  display: block;\n  padding: 4px;\n  margin-bottom: 20px;\n  line-height: 1.42857;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -webkit-transition: border 0.2s ease-in-out;\n  -o-transition: border 0.2s ease-in-out;\n  transition: border 0.2s ease-in-out; }\n  .thumbnail > img,\n  .thumbnail a > img {\n    display: block;\n    max-width: 100%;\n    height: auto;\n    margin-left: auto;\n    margin-right: auto; }\n  .thumbnail .caption {\n    padding: 9px;\n    color: #333333; }\n\na.thumbnail:hover,\na.thumbnail:focus,\na.thumbnail.active {\n  border-color: #337ab7; }\n\n.alert {\n  padding: 15px;\n  margin-bottom: 20px;\n  border: 1px solid transparent;\n  border-radius: 4px; }\n  .alert h4 {\n    margin-top: 0;\n    color: inherit; }\n  .alert .alert-link {\n    font-weight: bold; }\n  .alert > p,\n  .alert > ul {\n    margin-bottom: 0; }\n  .alert > p + p {\n    margin-top: 5px; }\n\n.alert-dismissable,\n.alert-dismissible {\n  padding-right: 35px; }\n  .alert-dismissable .close,\n  .alert-dismissible .close {\n    position: relative;\n    top: -2px;\n    right: -21px;\n    color: inherit; }\n\n.alert-success {\n  background-color: #dff0d8;\n  border-color: #d6e9c6;\n  color: #3c763d; }\n  .alert-success hr {\n    border-top-color: #c9e2b3; }\n  .alert-success .alert-link {\n    color: #2b542c; }\n\n.alert-info {\n  background-color: #d9edf7;\n  border-color: #bce8f1;\n  color: #31708f; }\n  .alert-info hr {\n    border-top-color: #a6e1ec; }\n  .alert-info .alert-link {\n    color: #245269; }\n\n.alert-warning {\n  background-color: #fcf8e3;\n  border-color: #faebcc;\n  color: #8a6d3b; }\n  .alert-warning hr {\n    border-top-color: #f7e1b5; }\n  .alert-warning .alert-link {\n    color: #66512c; }\n\n.alert-danger {\n  background-color: #f2dede;\n  border-color: #ebccd1;\n  color: #a94442; }\n  .alert-danger hr {\n    border-top-color: #e4b9c0; }\n  .alert-danger .alert-link {\n    color: #843534; }\n\n@-webkit-keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0; }\n  to {\n    background-position: 0 0; } }\n\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0; }\n  to {\n    background-position: 0 0; } }\n\n.progress {\n  overflow: hidden;\n  height: 20px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1); }\n\n.progress-bar {\n  float: left;\n  width: 0%;\n  height: 100%;\n  font-size: 12px;\n  line-height: 20px;\n  color: #fff;\n  text-align: center;\n  background-color: #337ab7;\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  -webkit-transition: width 0.6s ease;\n  -o-transition: width 0.6s ease;\n  transition: width 0.6s ease; }\n\n.progress-striped .progress-bar,\n.progress-bar-striped {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 40px 40px; }\n\n.progress.active .progress-bar,\n.progress-bar.active {\n  -webkit-animation: progress-bar-stripes 2s linear infinite;\n  -o-animation: progress-bar-stripes 2s linear infinite;\n  animation: progress-bar-stripes 2s linear infinite; }\n\n.progress-bar-success {\n  background-color: #5cb85c; }\n  .progress-striped .progress-bar-success {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.progress-bar-info {\n  background-color: #5bc0de; }\n  .progress-striped .progress-bar-info {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.progress-bar-warning {\n  background-color: #f0ad4e; }\n  .progress-striped .progress-bar-warning {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.progress-bar-danger {\n  background-color: #d9534f; }\n  .progress-striped .progress-bar-danger {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.media {\n  margin-top: 15px; }\n  .media:first-child {\n    margin-top: 0; }\n\n.media,\n.media-body {\n  zoom: 1;\n  overflow: hidden; }\n\n.media-body {\n  width: 10000px; }\n\n.media-object {\n  display: block; }\n  .media-object.img-thumbnail {\n    max-width: none; }\n\n.media-right,\n.media > .pull-right {\n  padding-left: 10px; }\n\n.media-left,\n.media > .pull-left {\n  padding-right: 10px; }\n\n.media-left,\n.media-right,\n.media-body {\n  display: table-cell;\n  vertical-align: top; }\n\n.media-middle {\n  vertical-align: middle; }\n\n.media-bottom {\n  vertical-align: bottom; }\n\n.media-heading {\n  margin-top: 0;\n  margin-bottom: 5px; }\n\n.media-list {\n  padding-left: 0;\n  list-style: none; }\n\n.list-group {\n  margin-bottom: 20px;\n  padding-left: 0; }\n\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: 10px 15px;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid #ddd; }\n  .list-group-item:first-child {\n    border-top-right-radius: 4px;\n    border-top-left-radius: 4px; }\n  .list-group-item:last-child {\n    margin-bottom: 0;\n    border-bottom-right-radius: 4px;\n    border-bottom-left-radius: 4px; }\n\na.list-group-item,\nbutton.list-group-item {\n  color: #555; }\n  a.list-group-item .list-group-item-heading,\n  button.list-group-item .list-group-item-heading {\n    color: #333; }\n  a.list-group-item:hover, a.list-group-item:focus,\n  button.list-group-item:hover,\n  button.list-group-item:focus {\n    text-decoration: none;\n    color: #555;\n    background-color: #f5f5f5; }\n\nbutton.list-group-item {\n  width: 100%;\n  text-align: left; }\n\n.list-group-item.disabled, .list-group-item.disabled:hover, .list-group-item.disabled:focus {\n  background-color: #eeeeee;\n  color: #777777;\n  cursor: not-allowed; }\n  .list-group-item.disabled .list-group-item-heading, .list-group-item.disabled:hover .list-group-item-heading, .list-group-item.disabled:focus .list-group-item-heading {\n    color: inherit; }\n  .list-group-item.disabled .list-group-item-text, .list-group-item.disabled:hover .list-group-item-text, .list-group-item.disabled:focus .list-group-item-text {\n    color: #777777; }\n\n.list-group-item.active, .list-group-item.active:hover, .list-group-item.active:focus {\n  z-index: 2;\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7; }\n  .list-group-item.active .list-group-item-heading,\n  .list-group-item.active .list-group-item-heading > small,\n  .list-group-item.active .list-group-item-heading > .small, .list-group-item.active:hover .list-group-item-heading,\n  .list-group-item.active:hover .list-group-item-heading > small,\n  .list-group-item.active:hover .list-group-item-heading > .small, .list-group-item.active:focus .list-group-item-heading,\n  .list-group-item.active:focus .list-group-item-heading > small,\n  .list-group-item.active:focus .list-group-item-heading > .small {\n    color: inherit; }\n  .list-group-item.active .list-group-item-text, .list-group-item.active:hover .list-group-item-text, .list-group-item.active:focus .list-group-item-text {\n    color: #c7ddef; }\n\n.list-group-item-success {\n  color: #3c763d;\n  background-color: #dff0d8; }\n\na.list-group-item-success,\nbutton.list-group-item-success {\n  color: #3c763d; }\n  a.list-group-item-success .list-group-item-heading,\n  button.list-group-item-success .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-success:hover, a.list-group-item-success:focus,\n  button.list-group-item-success:hover,\n  button.list-group-item-success:focus {\n    color: #3c763d;\n    background-color: #d0e9c6; }\n  a.list-group-item-success.active, a.list-group-item-success.active:hover, a.list-group-item-success.active:focus,\n  button.list-group-item-success.active,\n  button.list-group-item-success.active:hover,\n  button.list-group-item-success.active:focus {\n    color: #fff;\n    background-color: #3c763d;\n    border-color: #3c763d; }\n\n.list-group-item-info {\n  color: #31708f;\n  background-color: #d9edf7; }\n\na.list-group-item-info,\nbutton.list-group-item-info {\n  color: #31708f; }\n  a.list-group-item-info .list-group-item-heading,\n  button.list-group-item-info .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-info:hover, a.list-group-item-info:focus,\n  button.list-group-item-info:hover,\n  button.list-group-item-info:focus {\n    color: #31708f;\n    background-color: #c4e3f3; }\n  a.list-group-item-info.active, a.list-group-item-info.active:hover, a.list-group-item-info.active:focus,\n  button.list-group-item-info.active,\n  button.list-group-item-info.active:hover,\n  button.list-group-item-info.active:focus {\n    color: #fff;\n    background-color: #31708f;\n    border-color: #31708f; }\n\n.list-group-item-warning {\n  color: #8a6d3b;\n  background-color: #fcf8e3; }\n\na.list-group-item-warning,\nbutton.list-group-item-warning {\n  color: #8a6d3b; }\n  a.list-group-item-warning .list-group-item-heading,\n  button.list-group-item-warning .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-warning:hover, a.list-group-item-warning:focus,\n  button.list-group-item-warning:hover,\n  button.list-group-item-warning:focus {\n    color: #8a6d3b;\n    background-color: #faf2cc; }\n  a.list-group-item-warning.active, a.list-group-item-warning.active:hover, a.list-group-item-warning.active:focus,\n  button.list-group-item-warning.active,\n  button.list-group-item-warning.active:hover,\n  button.list-group-item-warning.active:focus {\n    color: #fff;\n    background-color: #8a6d3b;\n    border-color: #8a6d3b; }\n\n.list-group-item-danger {\n  color: #a94442;\n  background-color: #f2dede; }\n\na.list-group-item-danger,\nbutton.list-group-item-danger {\n  color: #a94442; }\n  a.list-group-item-danger .list-group-item-heading,\n  button.list-group-item-danger .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-danger:hover, a.list-group-item-danger:focus,\n  button.list-group-item-danger:hover,\n  button.list-group-item-danger:focus {\n    color: #a94442;\n    background-color: #ebcccc; }\n  a.list-group-item-danger.active, a.list-group-item-danger.active:hover, a.list-group-item-danger.active:focus,\n  button.list-group-item-danger.active,\n  button.list-group-item-danger.active:hover,\n  button.list-group-item-danger.active:focus {\n    color: #fff;\n    background-color: #a94442;\n    border-color: #a94442; }\n\n.list-group-item-heading {\n  margin-top: 0;\n  margin-bottom: 5px; }\n\n.list-group-item-text {\n  margin-bottom: 0;\n  line-height: 1.3; }\n\n.panel {\n  margin-bottom: 20px;\n  background-color: #fff;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); }\n\n.panel-body {\n  padding: 15px; }\n  .panel-body:before, .panel-body:after {\n    content: \" \";\n    display: table; }\n  .panel-body:after {\n    clear: both; }\n\n.panel-heading {\n  padding: 10px 15px;\n  border-bottom: 1px solid transparent;\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px; }\n  .panel-heading > .dropdown .dropdown-toggle {\n    color: inherit; }\n\n.panel-title {\n  margin-top: 0;\n  margin-bottom: 0;\n  font-size: 16px;\n  color: inherit; }\n  .panel-title > a,\n  .panel-title > small,\n  .panel-title > .small,\n  .panel-title > small > a,\n  .panel-title > .small > a {\n    color: inherit; }\n\n.panel-footer {\n  padding: 10px 15px;\n  background-color: #f5f5f5;\n  border-top: 1px solid #ddd;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px; }\n\n.panel > .list-group,\n.panel > .panel-collapse > .list-group {\n  margin-bottom: 0; }\n  .panel > .list-group .list-group-item,\n  .panel > .panel-collapse > .list-group .list-group-item {\n    border-width: 1px 0;\n    border-radius: 0; }\n  .panel > .list-group:first-child .list-group-item:first-child,\n  .panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {\n    border-top: 0;\n    border-top-right-radius: 3px;\n    border-top-left-radius: 3px; }\n  .panel > .list-group:last-child .list-group-item:last-child,\n  .panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {\n    border-bottom: 0;\n    border-bottom-right-radius: 3px;\n    border-bottom-left-radius: 3px; }\n\n.panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.panel-heading + .list-group .list-group-item:first-child {\n  border-top-width: 0; }\n\n.list-group + .panel-footer {\n  border-top-width: 0; }\n\n.panel > .table,\n.panel > .table-responsive > .table,\n.panel > .panel-collapse > .table {\n  margin-bottom: 0; }\n  .panel > .table caption,\n  .panel > .table-responsive > .table caption,\n  .panel > .panel-collapse > .table caption {\n    padding-left: 15px;\n    padding-right: 15px; }\n\n.panel > .table:first-child,\n.panel > .table-responsive:first-child > .table:first-child {\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px; }\n  .panel > .table:first-child > thead:first-child > tr:first-child,\n  .panel > .table:first-child > tbody:first-child > tr:first-child,\n  .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,\n  .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {\n    border-top-left-radius: 3px;\n    border-top-right-radius: 3px; }\n    .panel > .table:first-child > thead:first-child > tr:first-child td:first-child,\n    .panel > .table:first-child > thead:first-child > tr:first-child th:first-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {\n      border-top-left-radius: 3px; }\n    .panel > .table:first-child > thead:first-child > tr:first-child td:last-child,\n    .panel > .table:first-child > thead:first-child > tr:first-child th:last-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {\n      border-top-right-radius: 3px; }\n\n.panel > .table:last-child,\n.panel > .table-responsive:last-child > .table:last-child {\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px; }\n  .panel > .table:last-child > tbody:last-child > tr:last-child,\n  .panel > .table:last-child > tfoot:last-child > tr:last-child,\n  .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,\n  .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {\n    border-bottom-left-radius: 3px;\n    border-bottom-right-radius: 3px; }\n    .panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n    .panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {\n      border-bottom-left-radius: 3px; }\n    .panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n    .panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {\n      border-bottom-right-radius: 3px; }\n\n.panel > .panel-body + .table,\n.panel > .panel-body + .table-responsive,\n.panel > .table + .panel-body,\n.panel > .table-responsive + .panel-body {\n  border-top: 1px solid #ddd; }\n\n.panel > .table > tbody:first-child > tr:first-child th,\n.panel > .table > tbody:first-child > tr:first-child td {\n  border-top: 0; }\n\n.panel > .table-bordered,\n.panel > .table-responsive > .table-bordered {\n  border: 0; }\n  .panel > .table-bordered > thead > tr > th:first-child,\n  .panel > .table-bordered > thead > tr > td:first-child,\n  .panel > .table-bordered > tbody > tr > th:first-child,\n  .panel > .table-bordered > tbody > tr > td:first-child,\n  .panel > .table-bordered > tfoot > tr > th:first-child,\n  .panel > .table-bordered > tfoot > tr > td:first-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > th:first-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > td:first-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n    border-left: 0; }\n  .panel > .table-bordered > thead > tr > th:last-child,\n  .panel > .table-bordered > thead > tr > td:last-child,\n  .panel > .table-bordered > tbody > tr > th:last-child,\n  .panel > .table-bordered > tbody > tr > td:last-child,\n  .panel > .table-bordered > tfoot > tr > th:last-child,\n  .panel > .table-bordered > tfoot > tr > td:last-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > th:last-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > td:last-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n    border-right: 0; }\n  .panel > .table-bordered > thead > tr:first-child > td,\n  .panel > .table-bordered > thead > tr:first-child > th,\n  .panel > .table-bordered > tbody > tr:first-child > td,\n  .panel > .table-bordered > tbody > tr:first-child > th,\n  .panel > .table-responsive > .table-bordered > thead > tr:first-child > td,\n  .panel > .table-responsive > .table-bordered > thead > tr:first-child > th,\n  .panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,\n  .panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {\n    border-bottom: 0; }\n  .panel > .table-bordered > tbody > tr:last-child > td,\n  .panel > .table-bordered > tbody > tr:last-child > th,\n  .panel > .table-bordered > tfoot > tr:last-child > td,\n  .panel > .table-bordered > tfoot > tr:last-child > th,\n  .panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,\n  .panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,\n  .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,\n  .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {\n    border-bottom: 0; }\n\n.panel > .table-responsive {\n  border: 0;\n  margin-bottom: 0; }\n\n.panel-group {\n  margin-bottom: 20px; }\n  .panel-group .panel {\n    margin-bottom: 0;\n    border-radius: 4px; }\n    .panel-group .panel + .panel {\n      margin-top: 5px; }\n  .panel-group .panel-heading {\n    border-bottom: 0; }\n    .panel-group .panel-heading + .panel-collapse > .panel-body,\n    .panel-group .panel-heading + .panel-collapse > .list-group {\n      border-top: 1px solid #ddd; }\n  .panel-group .panel-footer {\n    border-top: 0; }\n    .panel-group .panel-footer + .panel-collapse .panel-body {\n      border-bottom: 1px solid #ddd; }\n\n.panel-default {\n  border-color: #ddd; }\n  .panel-default > .panel-heading {\n    color: #333333;\n    background-color: #f5f5f5;\n    border-color: #ddd; }\n    .panel-default > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #ddd; }\n    .panel-default > .panel-heading .badge {\n      color: #f5f5f5;\n      background-color: #333333; }\n  .panel-default > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #ddd; }\n\n.panel-primary {\n  border-color: #337ab7; }\n  .panel-primary > .panel-heading {\n    color: #fff;\n    background-color: #337ab7;\n    border-color: #337ab7; }\n    .panel-primary > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #337ab7; }\n    .panel-primary > .panel-heading .badge {\n      color: #337ab7;\n      background-color: #fff; }\n  .panel-primary > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #337ab7; }\n\n.panel-success {\n  border-color: #d6e9c6; }\n  .panel-success > .panel-heading {\n    color: #3c763d;\n    background-color: #dff0d8;\n    border-color: #d6e9c6; }\n    .panel-success > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #d6e9c6; }\n    .panel-success > .panel-heading .badge {\n      color: #dff0d8;\n      background-color: #3c763d; }\n  .panel-success > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #d6e9c6; }\n\n.panel-info {\n  border-color: #bce8f1; }\n  .panel-info > .panel-heading {\n    color: #31708f;\n    background-color: #d9edf7;\n    border-color: #bce8f1; }\n    .panel-info > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #bce8f1; }\n    .panel-info > .panel-heading .badge {\n      color: #d9edf7;\n      background-color: #31708f; }\n  .panel-info > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #bce8f1; }\n\n.panel-warning {\n  border-color: #faebcc; }\n  .panel-warning > .panel-heading {\n    color: #8a6d3b;\n    background-color: #fcf8e3;\n    border-color: #faebcc; }\n    .panel-warning > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #faebcc; }\n    .panel-warning > .panel-heading .badge {\n      color: #fcf8e3;\n      background-color: #8a6d3b; }\n  .panel-warning > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #faebcc; }\n\n.panel-danger {\n  border-color: #ebccd1; }\n  .panel-danger > .panel-heading {\n    color: #a94442;\n    background-color: #f2dede;\n    border-color: #ebccd1; }\n    .panel-danger > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #ebccd1; }\n    .panel-danger > .panel-heading .badge {\n      color: #f2dede;\n      background-color: #a94442; }\n  .panel-danger > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #ebccd1; }\n\n.embed-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden; }\n  .embed-responsive .embed-responsive-item,\n  .embed-responsive iframe,\n  .embed-responsive embed,\n  .embed-responsive object,\n  .embed-responsive video {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    height: 100%;\n    width: 100%;\n    border: 0; }\n\n.embed-responsive-16by9 {\n  padding-bottom: 56.25%; }\n\n.embed-responsive-4by3 {\n  padding-bottom: 75%; }\n\n.well {\n  min-height: 20px;\n  padding: 19px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border: 1px solid #e3e3e3;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05); }\n  .well blockquote {\n    border-color: #ddd;\n    border-color: rgba(0, 0, 0, 0.15); }\n\n.well-lg {\n  padding: 24px;\n  border-radius: 6px; }\n\n.well-sm {\n  padding: 9px;\n  border-radius: 3px; }\n\n.close {\n  float: right;\n  font-size: 21px;\n  font-weight: bold;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  opacity: 0.2;\n  filter: alpha(opacity=20); }\n  .close:hover, .close:focus {\n    color: #000;\n    text-decoration: none;\n    cursor: pointer;\n    opacity: 0.5;\n    filter: alpha(opacity=50); }\n\nbutton.close {\n  padding: 0;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n  -webkit-appearance: none; }\n\n.modal-open {\n  overflow: hidden; }\n\n.modal {\n  display: none;\n  overflow: hidden;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1050;\n  -webkit-overflow-scrolling: touch;\n  outline: 0; }\n  .modal.fade .modal-dialog {\n    -webkit-transform: translate(0, -25%);\n    -ms-transform: translate(0, -25%);\n    -o-transform: translate(0, -25%);\n    transform: translate(0, -25%);\n    -webkit-transition: -webkit-transform 0.3s ease-out;\n    -moz-transition: -moz-transform 0.3s ease-out;\n    -o-transition: -o-transform 0.3s ease-out;\n    transition: transform 0.3s ease-out; }\n  .modal.in .modal-dialog {\n    -webkit-transform: translate(0, 0);\n    -ms-transform: translate(0, 0);\n    -o-transform: translate(0, 0);\n    transform: translate(0, 0); }\n\n.modal-open .modal {\n  overflow-x: hidden;\n  overflow-y: auto; }\n\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: 10px; }\n\n.modal-content {\n  position: relative;\n  background-color: #fff;\n  border: 1px solid #999;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 6px;\n  -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n  background-clip: padding-box;\n  outline: 0; }\n\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1040;\n  background-color: #000; }\n  .modal-backdrop.fade {\n    opacity: 0;\n    filter: alpha(opacity=0); }\n  .modal-backdrop.in {\n    opacity: 0.5;\n    filter: alpha(opacity=50); }\n\n.modal-header {\n  padding: 15px;\n  border-bottom: 1px solid #e5e5e5; }\n  .modal-header:before, .modal-header:after {\n    content: \" \";\n    display: table; }\n  .modal-header:after {\n    clear: both; }\n\n.modal-header .close {\n  margin-top: -2px; }\n\n.modal-title {\n  margin: 0;\n  line-height: 1.42857; }\n\n.modal-body {\n  position: relative;\n  padding: 15px; }\n\n.modal-footer {\n  padding: 15px;\n  text-align: right;\n  border-top: 1px solid #e5e5e5; }\n  .modal-footer:before, .modal-footer:after {\n    content: \" \";\n    display: table; }\n  .modal-footer:after {\n    clear: both; }\n  .modal-footer .btn + .btn {\n    margin-left: 5px;\n    margin-bottom: 0; }\n  .modal-footer .btn-group .btn + .btn {\n    margin-left: -1px; }\n  .modal-footer .btn-block + .btn-block {\n    margin-left: 0; }\n\n.modal-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll; }\n\n@media (min-width: 768px) {\n  .modal-dialog {\n    width: 600px;\n    margin: 30px auto; }\n  .modal-content {\n    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); }\n  .modal-sm {\n    width: 300px; } }\n\n@media (min-width: 992px) {\n  .modal-lg {\n    width: 900px; } }\n\n.tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.42857;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  font-size: 12px;\n  opacity: 0;\n  filter: alpha(opacity=0); }\n  .tooltip.in {\n    opacity: 0.9;\n    filter: alpha(opacity=90); }\n  .tooltip.top {\n    margin-top: -3px;\n    padding: 5px 0; }\n  .tooltip.right {\n    margin-left: 3px;\n    padding: 0 5px; }\n  .tooltip.bottom {\n    margin-top: 3px;\n    padding: 5px 0; }\n  .tooltip.left {\n    margin-left: -3px;\n    padding: 0 5px; }\n\n.tooltip-inner {\n  max-width: 200px;\n  padding: 3px 8px;\n  color: #fff;\n  text-align: center;\n  background-color: #000;\n  border-radius: 4px; }\n\n.tooltip-arrow {\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid; }\n\n.tooltip.top .tooltip-arrow {\n  bottom: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000; }\n\n.tooltip.top-left .tooltip-arrow {\n  bottom: 0;\n  right: 5px;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000; }\n\n.tooltip.top-right .tooltip-arrow {\n  bottom: 0;\n  left: 5px;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000; }\n\n.tooltip.right .tooltip-arrow {\n  top: 50%;\n  left: 0;\n  margin-top: -5px;\n  border-width: 5px 5px 5px 0;\n  border-right-color: #000; }\n\n.tooltip.left .tooltip-arrow {\n  top: 50%;\n  right: 0;\n  margin-top: -5px;\n  border-width: 5px 0 5px 5px;\n  border-left-color: #000; }\n\n.tooltip.bottom .tooltip-arrow {\n  top: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000; }\n\n.tooltip.bottom-left .tooltip-arrow {\n  top: 0;\n  right: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000; }\n\n.tooltip.bottom-right .tooltip-arrow {\n  top: 0;\n  left: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000; }\n\n.popover {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1060;\n  display: none;\n  max-width: 276px;\n  padding: 1px;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.42857;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  font-size: 14px;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 6px;\n  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);\n  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); }\n  .popover.top {\n    margin-top: -10px; }\n  .popover.right {\n    margin-left: 10px; }\n  .popover.bottom {\n    margin-top: 10px; }\n  .popover.left {\n    margin-left: -10px; }\n\n.popover-title {\n  margin: 0;\n  padding: 8px 14px;\n  font-size: 14px;\n  background-color: #f7f7f7;\n  border-bottom: 1px solid #ebebeb;\n  border-radius: 5px 5px 0 0; }\n\n.popover-content {\n  padding: 9px 14px; }\n\n.popover > .arrow, .popover > .arrow:after {\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid; }\n\n.popover > .arrow {\n  border-width: 11px; }\n\n.popover > .arrow:after {\n  border-width: 10px;\n  content: \"\"; }\n\n.popover.top > .arrow {\n  left: 50%;\n  margin-left: -11px;\n  border-bottom-width: 0;\n  border-top-color: #999999;\n  border-top-color: rgba(0, 0, 0, 0.25);\n  bottom: -11px; }\n  .popover.top > .arrow:after {\n    content: \" \";\n    bottom: 1px;\n    margin-left: -10px;\n    border-bottom-width: 0;\n    border-top-color: #fff; }\n\n.popover.right > .arrow {\n  top: 50%;\n  left: -11px;\n  margin-top: -11px;\n  border-left-width: 0;\n  border-right-color: #999999;\n  border-right-color: rgba(0, 0, 0, 0.25); }\n  .popover.right > .arrow:after {\n    content: \" \";\n    left: 1px;\n    bottom: -10px;\n    border-left-width: 0;\n    border-right-color: #fff; }\n\n.popover.bottom > .arrow {\n  left: 50%;\n  margin-left: -11px;\n  border-top-width: 0;\n  border-bottom-color: #999999;\n  border-bottom-color: rgba(0, 0, 0, 0.25);\n  top: -11px; }\n  .popover.bottom > .arrow:after {\n    content: \" \";\n    top: 1px;\n    margin-left: -10px;\n    border-top-width: 0;\n    border-bottom-color: #fff; }\n\n.popover.left > .arrow {\n  top: 50%;\n  right: -11px;\n  margin-top: -11px;\n  border-right-width: 0;\n  border-left-color: #999999;\n  border-left-color: rgba(0, 0, 0, 0.25); }\n  .popover.left > .arrow:after {\n    content: \" \";\n    right: 1px;\n    border-right-width: 0;\n    border-left-color: #fff;\n    bottom: -10px; }\n\n.carousel {\n  position: relative; }\n\n.carousel-inner {\n  position: relative;\n  overflow: hidden;\n  width: 100%; }\n  .carousel-inner > .item {\n    display: none;\n    position: relative;\n    -webkit-transition: 0.6s ease-in-out left;\n    -o-transition: 0.6s ease-in-out left;\n    transition: 0.6s ease-in-out left; }\n    .carousel-inner > .item > img,\n    .carousel-inner > .item > a > img {\n      display: block;\n      max-width: 100%;\n      height: auto;\n      line-height: 1; }\n    @media all and (transform-3d), (-webkit-transform-3d) {\n      .carousel-inner > .item {\n        -webkit-transition: -webkit-transform 0.6s ease-in-out;\n        -moz-transition: -moz-transform 0.6s ease-in-out;\n        -o-transition: -o-transform 0.6s ease-in-out;\n        transition: transform 0.6s ease-in-out;\n        -webkit-backface-visibility: hidden;\n        -moz-backface-visibility: hidden;\n        backface-visibility: hidden;\n        -webkit-perspective: 1000px;\n        -moz-perspective: 1000px;\n        perspective: 1000px; }\n        .carousel-inner > .item.next, .carousel-inner > .item.active.right {\n          -webkit-transform: translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0);\n          left: 0; }\n        .carousel-inner > .item.prev, .carousel-inner > .item.active.left {\n          -webkit-transform: translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0);\n          left: 0; }\n        .carousel-inner > .item.next.left, .carousel-inner > .item.prev.right, .carousel-inner > .item.active {\n          -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n          left: 0; } }\n  .carousel-inner > .active,\n  .carousel-inner > .next,\n  .carousel-inner > .prev {\n    display: block; }\n  .carousel-inner > .active {\n    left: 0; }\n  .carousel-inner > .next,\n  .carousel-inner > .prev {\n    position: absolute;\n    top: 0;\n    width: 100%; }\n  .carousel-inner > .next {\n    left: 100%; }\n  .carousel-inner > .prev {\n    left: -100%; }\n  .carousel-inner > .next.left,\n  .carousel-inner > .prev.right {\n    left: 0; }\n  .carousel-inner > .active.left {\n    left: -100%; }\n  .carousel-inner > .active.right {\n    left: 100%; }\n\n.carousel-control {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: 15%;\n  opacity: 0.5;\n  filter: alpha(opacity=50);\n  font-size: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);\n  background-color: transparent; }\n  .carousel-control.left {\n    background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n    background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1); }\n  .carousel-control.right {\n    left: auto;\n    right: 0;\n    background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n    background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1); }\n  .carousel-control:hover, .carousel-control:focus {\n    outline: 0;\n    color: #fff;\n    text-decoration: none;\n    opacity: 0.9;\n    filter: alpha(opacity=90); }\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next,\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .glyphicon-chevron-right {\n    position: absolute;\n    top: 50%;\n    margin-top: -10px;\n    z-index: 5;\n    display: inline-block; }\n  .carousel-control .icon-prev,\n  .carousel-control .glyphicon-chevron-left {\n    left: 50%;\n    margin-left: -10px; }\n  .carousel-control .icon-next,\n  .carousel-control .glyphicon-chevron-right {\n    right: 50%;\n    margin-right: -10px; }\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    width: 20px;\n    height: 20px;\n    line-height: 1;\n    font-family: serif; }\n  .carousel-control .icon-prev:before {\n    content: '\\2039'; }\n  .carousel-control .icon-next:before {\n    content: '\\203A'; }\n\n.carousel-indicators {\n  position: absolute;\n  bottom: 10px;\n  left: 50%;\n  z-index: 15;\n  width: 60%;\n  margin-left: -30%;\n  padding-left: 0;\n  list-style: none;\n  text-align: center; }\n  .carousel-indicators li {\n    display: inline-block;\n    width: 10px;\n    height: 10px;\n    margin: 1px;\n    text-indent: -999px;\n    border: 1px solid #fff;\n    border-radius: 10px;\n    cursor: pointer;\n    background-color: #000 \\9;\n    background-color: transparent; }\n  .carousel-indicators .active {\n    margin: 0;\n    width: 12px;\n    height: 12px;\n    background-color: #fff; }\n\n.carousel-caption {\n  position: absolute;\n  left: 15%;\n  right: 15%;\n  bottom: 20px;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6); }\n  .carousel-caption .btn {\n    text-shadow: none; }\n\n@media screen and (min-width: 768px) {\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    width: 30px;\n    height: 30px;\n    margin-top: -10px;\n    font-size: 30px; }\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .icon-prev {\n    margin-left: -10px; }\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-next {\n    margin-right: -10px; }\n  .carousel-caption {\n    left: 20%;\n    right: 20%;\n    padding-bottom: 30px; }\n  .carousel-indicators {\n    bottom: 20px; } }\n\n.clearfix:before, .clearfix:after {\n  content: \" \";\n  display: table; }\n\n.clearfix:after {\n  clear: both; }\n\n.center-block {\n  display: block;\n  margin-left: auto;\n  margin-right: auto; }\n\n.pull-right {\n  float: right !important; }\n\n.pull-left {\n  float: left !important; }\n\n.hide {\n  display: none !important; }\n\n.show {\n  display: block !important; }\n\n.invisible {\n  visibility: hidden; }\n\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0; }\n\n.hidden {\n  display: none !important; }\n\n.affix {\n  position: fixed; }\n\n@-ms-viewport {\n  width: device-width; }\n\n.visible-xs {\n  display: none !important; }\n\n.visible-sm {\n  display: none !important; }\n\n.visible-md {\n  display: none !important; }\n\n.visible-lg {\n  display: none !important; }\n\n.visible-xs-block,\n.visible-xs-inline,\n.visible-xs-inline-block,\n.visible-sm-block,\n.visible-sm-inline,\n.visible-sm-inline-block,\n.visible-md-block,\n.visible-md-inline,\n.visible-md-inline-block,\n.visible-lg-block,\n.visible-lg-inline,\n.visible-lg-inline-block {\n  display: none !important; }\n\n@media (max-width: 767px) {\n  .visible-xs {\n    display: block !important; }\n  table.visible-xs {\n    display: table !important; }\n  tr.visible-xs {\n    display: table-row !important; }\n  th.visible-xs,\n  td.visible-xs {\n    display: table-cell !important; } }\n\n@media (max-width: 767px) {\n  .visible-xs-block {\n    display: block !important; } }\n\n@media (max-width: 767px) {\n  .visible-xs-inline {\n    display: inline !important; } }\n\n@media (max-width: 767px) {\n  .visible-xs-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm {\n    display: block !important; }\n  table.visible-sm {\n    display: table !important; }\n  tr.visible-sm {\n    display: table-row !important; }\n  th.visible-sm,\n  td.visible-sm {\n    display: table-cell !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-block {\n    display: block !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline {\n    display: inline !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md {\n    display: block !important; }\n  table.visible-md {\n    display: table !important; }\n  tr.visible-md {\n    display: table-row !important; }\n  th.visible-md,\n  td.visible-md {\n    display: table-cell !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-block {\n    display: block !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline {\n    display: inline !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg {\n    display: block !important; }\n  table.visible-lg {\n    display: table !important; }\n  tr.visible-lg {\n    display: table-row !important; }\n  th.visible-lg,\n  td.visible-lg {\n    display: table-cell !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg-block {\n    display: block !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg-inline {\n    display: inline !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg-inline-block {\n    display: inline-block !important; } }\n\n@media (max-width: 767px) {\n  .hidden-xs {\n    display: none !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .hidden-sm {\n    display: none !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .hidden-md {\n    display: none !important; } }\n\n@media (min-width: 1200px) {\n  .hidden-lg {\n    display: none !important; } }\n\n.visible-print {\n  display: none !important; }\n\n@media print {\n  .visible-print {\n    display: block !important; }\n  table.visible-print {\n    display: table !important; }\n  tr.visible-print {\n    display: table-row !important; }\n  th.visible-print,\n  td.visible-print {\n    display: table-cell !important; } }\n\n.visible-print-block {\n  display: none !important; }\n  @media print {\n    .visible-print-block {\n      display: block !important; } }\n\n.visible-print-inline {\n  display: none !important; }\n  @media print {\n    .visible-print-inline {\n      display: inline !important; } }\n\n.visible-print-inline-block {\n  display: none !important; }\n  @media print {\n    .visible-print-inline-block {\n      display: inline-block !important; } }\n\n@media print {\n  .hidden-print {\n    display: none !important; } }\n\nbody {\n  background-color: #ebe3d3;\n  margin: 10px;\n  padding: 5px;\n  font-size: 15px;\n  font-family: 'Open Sans', sans-serif; }\n\n.red-color {\n  color: red; }\n\n.linked-company {\n  color: blue;\n  text-decoration: underline;\n  cursor: pointer; }\n\n#processing {\n  color: green; }\n\n.dropdown-menu {\n  padding: 5px; }\n\n.job-applied-date-container {\n  display: none; }\n\n.signin-failure {\n  color: red; }\n\n.navbar-fixed-left {\n  width: 140px;\n  position: fixed;\n  border-radius: 0;\n  height: 100%; }\n\n.navbar-fixed-left .navbar-nav > li {\n  float: none;\n  /* Cancel default li float: left */\n  width: 139px; }\n\n.navbar-fixed-left + .container {\n  padding-left: 160px; }\n\n/* On using dropdown menu (To right shift popuped) */\n.navbar-fixed-left .navbar-nav > li > .dropdown-menu {\n  margin-top: -50px;\n  margin-left: 140px; }\n\ndiv.navbar.navbar-inverse.navbar-fixed-left > ul > li.dropdown.open > ul {\n  z-index: 9999; }\n\ntextarea {\n  min-height: 90px; }\n\n.clear-default-date {\n  margin-left: 5px;\n  padding: 2px 5px;\n  background-color: black;\n  color: white;\n  cursor: pointer; }\n\n.clear-default-date:hover {\n  background-color: lightgray;\n  color: black; }\n\n.create-textarea {\n  height: auto;\n  resize: none; }\n\n.form-container {\n  max-width: 700px; }\n\n.back-btn-container button {\n  margin-top: 10px; }\n\n.maintain-spacing {\n  white-space: pre-line; }\n\n.job-app-image-p {\n  float: right; }\n\n#jobs-screenshot, #reminders-screenshot {\n  max-width: 100%;\n  width: 400px;\n  height: auto;\n  margin: 10px; }\n\n#homepage-job-app-img {\n  max-width: 100%;\n  width: 250px;\n  height: auto;\n  margin: 10px; }\n\n.notification-container {\n  text-align: center; }\n\n.green {\n  color: green; }\n\n.red {\n  color: red; }\n\n.success-alert {\n  color: green;\n  text-decoration: underline;\n  margin-top: 5px;\n  padding: 5px;\n  font-size: 16px; }\n\n.failure-alert {\n  color: red;\n  text-decoration: underline;\n  margin-top: 5px;\n  padding: 5px;\n  font-size: 18px; }\n\n#web-logo {\n  float: right;\n  margin-top: 0; }\n\n#web-logo h3 {\n  margin-top: 0; }\n\n#nav-mobile-dropdown {\n  font-size: 20px;\n  float: right;\n  margin-left: 2px;\n  margin-right: 2px; }\n\n.credentials-container input {\n  border: 1px solid gray;\n  margin: 2px; }\n\n.dashboard-container {\n  text-align: center; }\n\n.underline {\n  text-decoration: underline; }\n\n.center {\n  text-align: center; }\n\nh1 {\n  color: #33312c;\n  font-size: 30px; }\n\nh2 {\n  color: #800000;\n  font-size: 25px; }\n\nh3 {\n  color: #585551;\n  font-size: 20px; }\n\n.nav-main-container {\n  display: none; }\n\n.table > tbody > tr > td {\n  border-top: 1px solid #585551;\n  border-bottom: 1px solid #585551; }\n\n.table > thead > tr > th {\n  border-bottom: 1px solid #585551; }\n\n.table-hover > tbody > tr:hover {\n  background-color: #cbc1ad; }\n\n.home-dashboard-container {\n  text-align: center; }\n\n.delete-confirmation-contain {\n  display: none; }\n\n#sign-out {\n  float: left;\n  margin-left: 5px;\n  display: none; }\n\n#change-password {\n  float: left;\n  display: none; }\n\n.option-company-id {\n  display: none; }\n\n.top-nav {\n  margin-top: 20px; }\n\n.btn-group-vertical > .btn,\n.credentials .btn-group > .btn {\n  position: relative;\n  float: left; }\n\n#nav-mobile-dropdown {\n  display: none;\n  background-color: transparent;\n  border: 1px solid #800000;\n  color: #800000;\n  padding: 3px; }\n\n@media screen and (max-width: 767px) {\n  #nav-mobile-dropdown {\n    margin-right: 15px; } }\n\n@media screen and (min-width: 768px) {\n  #nav-mobile-dropdown {\n    display: none; } }\n", ""]);

	// exports


/***/ },
/* 91 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f4769f9bdb7466be65088239c12046d1.eot";

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "448c34a56d699c29117adc64c43affeb.woff2";

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "fa2772327f55d8198301fdb8bcfc8158.woff";

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "e18bbf611f2a2e43afc071aa2f4e1512.ttf";

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "89889688147bd7575d6327160d64e760.svg";

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
]);