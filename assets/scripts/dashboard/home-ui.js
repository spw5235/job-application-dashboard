'use strict';

const store = require('../store');
const communicationsApi = require('../communications/api');
const contactsApi = require('../contacts/api');
const jobsApi = require('../jobs/api');
const displayDashboardHome = require('../templates/dashboard/dashboard-home.handlebars');

const homeFailure = function() {
  $(".failure-alert").text("An error has occured. Please try again");
};

const todaysDate = function() {
  let d = new Date();
  let month = d.getMonth()+1;
  let day = d.getDate();
  let output = d.getFullYear() + '/' +
    (month<10 ? '0' : '') + month + '/' +
    (day<10 ? '0' : '') + day;


  let dateArray = output.split("/");
  let dateNum = parseInt(dateArray[0] + dateArray[1] + dateArray[2]);
  console.log(dateNum);
  return dateNum;
};

const convertDateToNum = function(date) {
  let dateArray = date.split("-");
  let dateNum = parseInt(dateArray[0] + dateArray[1] + dateArray[2]);
  return dateNum;
};

const isItUpcoming = function(today, deadline) {
  let differenceVal = deadline - today;
  let isWithinRange = (differenceVal <= 5 && differenceVal > 0);
  if (isWithinRange) {
    return true;
  } else {
    return false;
  }
};

const addDateToNumApproach = function(data, type) {

  const sortNumber = function(a, b) {
    return a - b;
  };

  const sortNumberOverdue = function(a, b) {
    return b - a;
  }

  let newReminderDataObject = {
    reminders: []
  };

  let overdueReminderDataObject = {
    reminders: []
  };

  let numIdArr = [];

  let numIdArrOverdue = [];

  let remindersData = data.reminders;

  let remindersDataOverdue = data.reminders;

  const remindersDataLength = data.reminders.length;

  for ( let i = 0; i < remindersDataLength; i++ ) {
    let currentRemindersDate = data.reminders[i].reminder_date;
    let isNull = (data.reminders[i].reminder_date === null);

    if (!isNull) {
      let currentDateToNum = convertDateToNum(currentRemindersDate).toString();
      let currentId = data.reminders[i].id.toString();

      let currentDateToNumDecimal = parseFloat(currentDateToNum + "." + currentId);

      let todayDate = todaysDate();

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

const generateEmptyReminders = function(length) {
  let newReminderDataObject = {
    reminders: []
  };

  for (let i = 0; i < length; i++) {
    let emptyObject = {};
    emptyObject.order_num = i;
    newReminderDataObject.reminders[i] = emptyObject;
  }

  return newReminderDataObject;
};

const showContactDashTable = (data) => {
  let newContactDataObject = {
    contacts: []
  };

  let contactOne;
  let contactTwo;
  let contactThree;
  let contactFour;
  let contactFive;

  let contactArrLength = data.contacts.length;

  if (contactArrLength === 0) {
    store.isContactDashEmpty = true;
  } else if ( contactArrLength === 1 ) {
    contactOne = data.contacts[contactArrLength - 1];
    newContactDataObject.contacts.push(contactOne);
  } else if ( contactArrLength === 2 ) {
    contactOne = data.contacts[contactArrLength - 1];
    newContactDataObject.contacts.push(contactOne);
    contactTwo = data.contacts[contactArrLength - 2];
    newContactDataObject.contacts.push(contactTwo);
  } else if ( contactArrLength === 3 ) {
    contactOne = data.contacts[contactArrLength - 1];
    newContactDataObject.contacts.push(contactOne);
    contactTwo = data.contacts[contactArrLength - 2];
    newContactDataObject.contacts.push(contactTwo);
    contactThree = data.contacts[contactArrLength - 3];
    newContactDataObject.contacts.push(contactThree);
  } else if ( contactArrLength === 4 ) {
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

  let contactFinalData = data;
  let communicationFinalData = store.finalCommunicationData;
  let jobFinalData = store.finalJobData;
  let reminderFinalData = store.finalReminderData;
  let reminderFinalDataOverdue = store.finalReminderDataOverdue;
  store.finalContactData = data;

  console.log(reminderFinalDataOverdue);

  // Converting to overdues

  data = reminderFinalDataOverdue;

  let remindersDataOverdue = data.reminders;

  const remindersDataLength = data.reminders.length;

  let revisedFinalOverdue = {
      overdues: []
  };

  for ( let i = 0; i < remindersDataLength; i++ ) {
    let currentRemindersData = data.reminders[i];
    revisedFinalOverdue.overdues.push(currentRemindersData);
  }

  reminderFinalDataOverdue = revisedFinalOverdue;
  //

  $('.content').children().remove();

  let dashboardHome = displayDashboardHome({
    reminders: reminderFinalData.reminders,
    jobs: jobFinalData.jobs,
    communications: communicationFinalData.communications,
    contacts: contactFinalData.contacts,
    overdues: reminderFinalDataOverdue.overdues
  });


  $('.content').append(dashboardHome);

  if (store.isContactDashEmpty === true) {
    $(".contact-dash-table-empty").text("No contacts have been recently added");
    store.isContactDashEmpty = false;
  } else {
    store.isContactDashEmpty = false;
  }

  if (store.isCommunicationDashEmpty === true) {
    $(".communication-dash-table-empty").text("No communications have been recently added");
    store.isCommunicationDashEmpty = false;
  } else {
    store.isCommunicationDashEmpty = false;
  }

  if (store.isJobDashEmpty === true) {
    $(".job-dash-table-empty").text("No deadlines occur in the next five days");
    store.isJobDashEmpty = false;
  } else {
    store.isJobDashEmpty = false;
  }

  if (store.isReminderDashEmpty === true) {
    $(".reminder-dash-table-empty").text("You have no reminders due in the next five days");
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

};

const showCommunicationDashTable = (data) => {
  let newCommunicationDataObject = {
    communications: []
  };

  let communicationOne;
  let communicationTwo;
  let communicationThree;
  let communicationFour;
  let communicationFive;

  let communicationArrLength = data.communications.length;

  if (communicationArrLength === 0) {
    store.isCommunicationDashEmpty = true;
  } else if ( communicationArrLength === 1 ) {
    communicationOne = data.communications[communicationArrLength - 1];
    newCommunicationDataObject.communications.push(communicationOne);
  } else if ( communicationArrLength === 2 ) {
    communicationOne = data.communications[communicationArrLength - 1];
    newCommunicationDataObject.communications.push(communicationOne);
    communicationTwo = data.communications[communicationArrLength - 2];
    newCommunicationDataObject.communications.push(communicationTwo);
  } else if ( communicationArrLength === 3 ) {
    communicationOne = data.communications[communicationArrLength - 1];
    newCommunicationDataObject.communications.push(communicationOne);
    communicationTwo = data.communications[communicationArrLength - 2];
    newCommunicationDataObject.communications.push(communicationTwo);
    communicationThree = data.communications[communicationArrLength - 3];
    newCommunicationDataObject.communications.push(communicationThree);
  } else if ( communicationArrLength === 4 ) {
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

  contactsApi.getContacts()
    .done(showContactDashTable)
    .fail(homeFailure);
};

const showJobDashTable = (data) => {
  let newDataObject = {
    jobs: []
  };

  let today = todaysDate();
  let allJobsData = data.jobs;

  for (let i = 0; i < allJobsData.length; i++) {
    let currentDeadline = allJobsData[i].deadline;

    if (currentDeadline !== null && currentDeadline !== undefined) {

      let convertedNum = convertDateToNum(currentDeadline);

      let isUpcoming = isItUpcoming(today, convertedNum);

      if (isUpcoming) {
        newDataObject.jobs.push(allJobsData[i]);
      }

    }
  }

  if ( newDataObject.jobs.length === 0) {
    store.isJobDashEmpty = true;
  }

  store.finalJobData = newDataObject;
  communicationsApi.getCommunications()
    .done(showCommunicationDashTable)
    .fail(homeFailure);
};


const showRemindersApproachDashTable = (data) => {
  $(".notification-container").children().text("");

  ///////////////////////////////////
  /////////////Overdue///////////////
  ///////////////////////////////////

  let dataOverdue = addDateToNumApproach(data, 2);

  let dataLengthOverdue = dataOverdue.reminders.length;

  let emptyRemindersObjectOverdue = generateEmptyReminders(dataLengthOverdue);

  let numIdArrOverdue = store.numIdReminderArrOverdue;

  for (let i = 0; i < numIdArrOverdue.length; i++) {
    let numIdToStringOverdue = numIdArrOverdue[i].toString();
    let splitIdOverdue = numIdToStringOverdue.split(".");
    let splitIdToNumOverdue = parseInt(splitIdOverdue[1]);
    emptyRemindersObjectOverdue.reminders[i].id = splitIdToNumOverdue;
  }

  for (let i = 0; i < emptyRemindersObjectOverdue.reminders.length; i++) {
    let currentEmptyDataOverdue = emptyRemindersObjectOverdue.reminders[i];
    let emptyDataIdOverdue = emptyRemindersObjectOverdue.reminders[i].id;

    for (let j = 0; j < dataOverdue.reminders.length; j++) {
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
  let dataLength = data.reminders.length;

  let emptyRemindersObject = generateEmptyReminders(dataLength);

  let numIdArr = store.numIdReminderArr;

  for (let i = 0; i < numIdArr.length; i++) {
    let numIdToString = numIdArr[i].toString();
    let splitId = numIdToString.split(".");
    let splitIdToNum = parseInt(splitId[1]);
    emptyRemindersObject.reminders[i].id = splitIdToNum;
  }

  for (let i = 0; i < emptyRemindersObject.reminders.length; i++) {
    let currentEmptyData = emptyRemindersObject.reminders[i];
    let emptyDataId = emptyRemindersObject.reminders[i].id;

    for (let j = 0; j < data.reminders.length; j++) {
      if (data.reminders[j].id === emptyDataId) {
        currentEmptyData.reminder_date = data.reminders[j].reminder_date;
        currentEmptyData.job_ref_text = data.reminders[j].job_ref_text;
        currentEmptyData.reminder_type = data.reminders[j].reminder_type;
        currentEmptyData.reminder_subject = data.reminders[j].reminder_subject;
      }
    }
  }

  data = emptyRemindersObject;

  if (emptyRemindersObject.reminders.length === 0) {
    store.isReminderDashEmpty = true;
  }
  store.finalReminderData = data;

  jobsApi.getJobs()
    .done(showJobDashTable)
    .fail(homeFailure);
  };

const showMobileOptions = function() {
  let areOptionsVisible = $(".nav-mobile-ul").css("display");
  if (areOptionsVisible === "none") {
    $(".nav-mobile-ul").slideDown();
  } else {
    $(".nav-mobile-ul").slideUp();
  }
};


module.exports = {
  showJobDashTable,
  homeFailure,
  showRemindersApproachDashTable,
  showCommunicationDashTable,
  showMobileOptions,
};
