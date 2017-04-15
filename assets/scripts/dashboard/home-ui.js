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
  console.log(date);
  let dateArray = date.split("-");
  console.log(dateArray);
  let dateNum = parseInt(dateArray[0] + dateArray[1] + dateArray[2]);
  console.log(dateNum);
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
  console.log(today);

  let allJobsData = data.jobs;

  for (let i = 0; i < allJobsData.length; i++) {
    let currentDeadline = allJobsData[i].deadline;
    console.log(currentDeadline);

    if (currentDeadline !== null && currentDeadline !== undefined) {

      let convertedNum = convertDateToNum(currentDeadline);
      console.log(convertedNum);

      let isUpcoming = isItUpcoming(today, convertedNum);
      console.log(isUpcoming);

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

module.exports = {
  showJobDashTable,
  homeFailure,
};
