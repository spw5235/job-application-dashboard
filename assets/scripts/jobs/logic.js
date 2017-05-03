'use strict';

const sortPendingByPriority = function(data) {

  // console.log(data);

  let oneArr = [];
  let twoArr = [];
  let threeArr = [];
  let fourArr = [];
  let fiveArr = [];
  // let completeArr = [];

  let currentData = data.jobs;

  for (let i = 0; i < currentData.length; i++) {
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

  let emptyJobObject = {
    jobs: []
  };

  let objectVar = emptyJobObject.jobs;

  if ( oneArr.length > 0 ) {
    objectVar.push(oneArr[0]);
  }

  if ( twoArr.length > 0 ) {
    objectVar.push(twoArr[0]);
  }

  if ( threeArr.length > 0 ) {
    objectVar.push(threeArr[0]);
  }

  if ( fourArr.length > 0 ) {
    objectVar.push(fourArr[0]);
  }

  if ( fiveArr.length > 0 ) {
    objectVar.push(fiveArr[0]);
  }

  return emptyJobObject;

};

const removeAppliedJobs = function(data) {

  // console.log(data);

  let currentJobData = data.jobs;

  let emptyArr = [];

  for (let i = 0; i < currentJobData.length; i++) {
    if (!currentJobData[i].applied) {
      emptyArr.push(currentJobData[i]);
    }
  }

  let emptyJobObject = {
    jobs: emptyArr
  };

  let oneArr = [];
  let twoArr = [];
  let threeArr = [];
  let fourArr = [];
  let fiveArr = [];
  // let completeArr = [];

  let currentData = emptyJobObject.jobs;

  for (let i = 0; i < currentData.length; i++) {
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

  let finalArr = [];
  finalArr.push(oneArr);
  finalArr.push(twoArr);
  finalArr.push(threeArr);
  finalArr.push(fourArr);
  finalArr.push(fiveArr);

  let merged = [].concat.apply([], finalArr);

  data = {
    jobs: merged
  };

  return data;

};


module.exports = {
  sortPendingByPriority,
  removeAppliedJobs,
};
