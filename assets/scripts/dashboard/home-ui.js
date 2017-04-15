'use strict';

const displayJobsHome = require('../templates/dashboard/jobs-home.handlebars');

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
};

const homeFailure = function() {
  console.log('falure');
};

const determineRemindersLength = function(data) {
  let reminderDataArr = data.reminders;
  let count = 0;

  for (let i = 0; i < reminderDataArr.length; i++) {

    if (reminderDataArr[i].reminder_date === null || reminderDataArr[i].reminder_date === undefined) {
      console.log('wont count');
    } else {
      let currentLength = reminderDataArr[i].reminder_date.length;

      if (currentLength === 10) {
        count += 1;
      }
    }
  }

  return count;
};

const addDateToNum = function(data) {
  let newReminderDataObject = {
    reminders: []
  };

  let remindersData = data.reminders;
  const remindersDataLength = data.reminders.length;

  for ( let i = 0; i < remindersDataLength; i++ ) {
    let currentRemindersDate = data.reminders[i].reminder_date;
    let isNull = (data.reminders[i].reminder_date === null);

    if (!isNull) {
      let currentDateToNum = convertDateToNum(currentRemindersDate);
      remindersData[i].date_to_num = currentDateToNum;
      newReminderDataObject.reminders.push(remindersData[i]);
    }
  }
  return newReminderDataObject;
};

const idArray = function(data) {


}

const showRemindersDashTable = (data) => {
  // const maxCount = determineRemindersLength(data);
  data = addDateToNum(data);
  console.log(data);

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






module.exports = {
  showJobDashTable,
  homeFailure,
  showRemindersDashTable,
};
