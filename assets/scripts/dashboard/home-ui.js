'use strict';

const displayJobsHome = require('../templates/dashboard/jobs-home.handlebars');
const displayRemindersHome = require('../templates/dashboard/reminders-home.handlebars');
const store = require('../store');
const remindersApi = require('../reminders/api');


const todaysDate = function() {
  let d = new Date();
  let month = d.getMonth()+1;
  let day = d.getDate();
  let output = d.getFullYear() + '/' +
    (month<10 ? '0' : '') + month + '/' +
    (day<10 ? '0' : '') + day;


  let dateArray = output.split("/");
  let dateNum = parseInt(dateArray[0] + dateArray[1] + dateArray[2]);
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

const homeFailure = function() {
  console.log('falure');
};

const addDateToNum = function(data) {

  const sortNumber = function(a, b) {
    return a - b;
  };

  let newReminderDataObject = {
    reminders: []
  };

  let numIdArr = [];

  let remindersData = data.reminders;
  const remindersDataLength = data.reminders.length;

  for ( let i = 0; i < remindersDataLength; i++ ) {
    let currentRemindersDate = data.reminders[i].reminder_date;
    let isNull = (data.reminders[i].reminder_date === null);

    if (!isNull) {
      let currentDateToNum = convertDateToNum(currentRemindersDate).toString();
      let currentId = data.reminders[i].id.toString();

      let currentDateToNumDecimal = parseFloat(currentDateToNum + "." + currentId);

      numIdArr.push(currentDateToNumDecimal);
      remindersData[i].date_to_num = currentDateToNumDecimal;
      newReminderDataObject.reminders.push(remindersData[i]);
    }
  }

  store.numIdReminderArr = numIdArr.sort(sortNumber);

  return newReminderDataObject;
};

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


const showRemindersDashTable = (data) => {
  // const maxCount = determineRemindersLength(data);

  data = addDateToNum(data);
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

  console.log(emptyRemindersObject);

  data = emptyRemindersObject;

  let reminderDashboard = displayRemindersHome({
    reminders: data.reminders
  });

  $('.content').append(reminderDashboard);

  // let sortedNumId = store.numIdReminderArr;
  // console.log(sortedNumId);

  // let remindersData = data.reminders;
  // const remindersDataLength = data.reminders.length;
  //
  // let newReminderDataObject = {
  //   reminders: []
  // };

  // for (let i = 0; i < remindersDataLength; i++) {
  //
  //   let currentDateToNum = remindersData[i].date_to_num;
  //
  //   if (newReminderDataObject.reminders.length === 0) {
  //       remindersData[i].date_to_num = currentDateToNum;
  //       newReminderDataObject.reminders.push(remindersData[i]);
  //     } else {
  //       for ( let j = 0; j < remindersDataLength; j++ ) {
  //         let currentNewDataObject= newReminderDataObject.reminders[j];
  //         console.log(currentNewDataObject);
  //       }
  //     }
  //   }
  };


  const showJobDashTable = (data) => {
    $('.content').children().remove();

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

      if (newDataObject.jobs.length > 0) {
        let jobDashTable = displayJobsHome({
          jobs: newDataObject.jobs
        });
        $(".content").append(jobDashTable);
      }

      remindersApi.getReminders()
        .done(showRemindersDashTable)
        .fail(homeFailure);
  };



module.exports = {
  showJobDashTable,
  homeFailure,
  showRemindersDashTable,
};
