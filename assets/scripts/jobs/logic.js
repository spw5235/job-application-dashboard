'use strict';

const sortPendingByPriority = function(data) {

  console.log(data);

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

  console.log(data);

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

  console.log(emptyJobObject);

  // let returnedData = sortPendingByPriority(emptyJobObject);

  // console.log(returnedData);
  // return returnedData;

  let oneArr = [];
  let twoArr = [];
  let threeArr = [];
  let fourArr = [];
  let fiveArr = [];
  // let completeArr = [];

  let currentData = emptyJobObject.jobs;

  console.log(currentData);
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

  console.log("oneArr");
  console.log(oneArr);
  // console.log("twoArr");
  // console.log(twoArr);
  // console.log("threeArr");
  // console.log(threeArr);
  // console.log("fourArr");
  // console.log(fourArr);
  // console.log("fiveArr");
  // console.log(fiveArr);

  let finalArr = [];
  finalArr.push(oneArr);
  finalArr.push(twoArr);
  finalArr.push(threeArr);
  finalArr.push(fourArr);
  finalArr.push(fiveArr);

  // console.log(finalArr);

  let merged = [].concat.apply([], finalArr);

  // console.log(merged);

  data = {
    jobs: merged
  }

  console.log(data);

  return data;

  // data = {
  //   jobs: fourArr, fiveArr
  // };

  //good at 20




  //
  // let pendingJobObject = {
  //   jobs: []
  // };
  //
  // let blankArr = [];
  //
  // if ( oneArr.length > 0 ) {
  //   blankArr.push(oneArr[0]);
  // }
  //
  // console.log("post 1 pendingJobObject");
  // console.log(pendingJobObject);
  //
  // if ( twoArr.length > 0 ) {
  //   blankArr.push(twoArr[0]);
  // }
  //
  // console.log("post 2 pendingJobObject");
  // console.log(pendingJobObject);
  //
  // if ( threeArr.length > 0 ) {
  //   blankArr.push(threeArr[0]);
  // }
  //
  // console.log("post 3 pendingJobObject");
  // console.log(pendingJobObject);
  //
  // if ( fourArr.length > 0 ) {
  //   blankArr.push(fourArr[0]);
  // }
  //
  // console.log("post 4 pendingJobObject");
  // console.log(pendingJobObject);
  //
  // if ( fiveArr.length > 0 ) {
  //   blankArr.push(fiveArr[0]);
  // }
  //
  // console.log("post 5 pendingJobObject");
  // console.log(blankArr);
  //
  // console.log("final pendingJobObject");
  // console.log(blankArr);
  //
  // return blankArr;




};


module.exports = {
  removeAppliedJobs,
};
