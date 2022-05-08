//***************************************GLOBAL VARIABLES***************************************//
// HTML Elements into variables
const countList = document.getElementById("count").querySelectorAll("p"),
  highFreqList = document.getElementById("high-freq").querySelectorAll("p"),
  lowFreqList = document.getElementById("low-freq").querySelectorAll("p");
// Number Position Arrays. (NPAs)
const firstNum = [],
  secondNum = [],
  thirdNum = [],
  fourthNum = [],
  fifthNum = [],
  sixthNum = [];
// Position Frequency Arrays. (PFAs)
const firstHigh = [],
  firstLow = [],
  secondHigh = [],
  secondLow = [],
  thirdHigh = [],
  thirdLow = [],
  fourthHigh = [],
  fourthLow = [],
  fifthHigh = [],
  fifthLow = [],
  sixthHigh = [],
  sixthLow = [];
// NPAs & PFAs compiled into arrays to use in for loops to shorten code.
const arrList = [firstNum, secondNum, thirdNum, fourthNum, fifthNum, sixthNum],
  highList = [
    firstHigh,
    secondHigh,
    thirdHigh,
    fourthHigh,
    fifthHigh,
    sixthHigh,
  ],
  lowList = [firstLow, secondLow, thirdLow, fourthLow, fifthLow, sixthLow];

//***************************************FUNCTIONS***************************************//
// fetch('https://supersixscraper.herokuapp.com/').then(response => response.json()).then(data => {
fetch("/api")
  .then((response) => response.json())
  .then((data) => {
    // Fetch All Super 6 draw data from the NLA
    window.dbNumbers = data;
    countNum(data);
    checkFreq(data);
  });

// async function postDatabase(drawData) {
// const options = {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(drawData)
// };
// const response = await fetch('/api', options);
// const data = await response.json();
//     console.log(data);
// }

function countNum(numbers) {
  //Count the amount of times a number was drawn, regardless of position then display the result.
  const countThreshold = document.getElementById("count-slider").value;
  numbers.forEach((number) => {
    countList.forEach((item) => {
      const sliceA = item.innerText.slice(0, 2);
      let sliceB = parseInt(item.firstElementChild.innerText);
      if (number == sliceA) {
        sliceB++;
        item.firstElementChild.innerText = `${sliceB} times`;
      }
      if (sliceB !== 0 && sliceB < countThreshold) {
        item.classList.remove("high-count");
        item.classList.add("low-count");
      }
      if (sliceB >= countThreshold) {
        item.classList.remove("low-count");
        item.classList.add("high-count");
      }
    });
  });
}

function checkFreq(numbers) {
  // Temporary variables to use in For Loops below.
  const freqThreshold = document.getElementById("freq-slider").value;
  let n1 = 0,
    n2 = 6;
  // Push each number to the appropriate NPA.
  for (let index = 0; index < numbers.length / 6; index++) {
    draw = numbers.slice(n1, n2);
    draw.forEach((element) => {
      switch (draw.indexOf(element)) {
        case 0:
          firstNum.push(element);
          break;
        case 1:
          secondNum.push(element);
          break;
        case 2:
          thirdNum.push(element);
          break;
        case 3:
          fourthNum.push(element);
          break;
        case 4:
          fifthNum.push(element);
          break;
        case 5:
          sixthNum.push(element);
          break;
        default:
          break;
      }
    });
    n1 += 6;
    n2 += 6;
  }
  // For each NPA, execute the following For Loop & Switch.
  for (let i = 0; i < arrList.length; i++) {
    const arr = arrList[i];
    // From the number 1 to 28, count the amount of times each number appears in each NPA.
    for (let index = 1; index < 29; index++) {
      let count = 0;
      arr.forEach((element) => {
        if (index == element) {
          count++;
        }
      });
      // Check if each NPA item's count is above or below the frequency threshold and push the item to the appropriate PFA.
      switch (i) {
        case 0:
          if (count >= freqThreshold) {
            firstHigh.push(index);
          }
          if (count !== 0 && count < freqThreshold) {
            firstLow.push(index);
          }
          break;
        case 1:
          if (count >= freqThreshold) {
            secondHigh.push(index);
          }
          if (count !== 0 && count < freqThreshold) {
            secondLow.push(index);
          }
          break;
        case 2:
          if (count >= freqThreshold) {
            thirdHigh.push(index);
          }
          if (count !== 0 && count < freqThreshold) {
            thirdLow.push(index);
          }
          break;
        case 3:
          if (count >= freqThreshold) {
            fourthHigh.push(index);
          }
          if (count !== 0 && count < freqThreshold) {
            fourthLow.push(index);
          }
          break;
        case 4:
          if (count >= freqThreshold) {
            fifthHigh.push(index);
          }
          if (count !== 0 && count < freqThreshold) {
            fifthLow.push(index);
          }
          break;
        case 5:
          if (count >= freqThreshold) {
            sixthHigh.push(index);
          }
          if (count !== 0 && count < freqThreshold) {
            sixthLow.push(index);
          }
          break;
        default:
          break;
      }
    }
  }
  // Append the High Frequency results to the document.
  for (let k = 0; k < highFreqList.length; k++) {
    const row = highFreqList[k].firstElementChild;
    row.append(highList[k]);
  }
  // Append the Low Frequency results to the document.
  for (let l = 0; l < lowFreqList.length; l++) {
    const row = lowFreqList[l].firstElementChild;
    row.append(lowList[l]);
  }
}

//***************************************Event Listeners***************************************//
// Count Threshold Slider Event Listener
document.getElementById("count-slider").addEventListener("change", () => {
  countList.forEach((p) => {
    p.firstElementChild.innerText = 00;
  });
  countNum(dbNumbers);
});
// // Frequency Threshold Slider Event Listener
document.getElementById("freq-slider").addEventListener("change", () => {
  arrList.forEach((array) => {
    array.length = 0;
  });
  highList.forEach((array) => {
    array.length = 0;
  });
  lowList.forEach((array) => {
    array.length = 0;
  });
  highFreqList.forEach((p) => {
    p.firstElementChild.innerText = "";
  });
  lowFreqList.forEach((p) => {
    p.firstElementChild.innerText = "";
  });
  checkFreq(dbNumbers);
});
// Refresh Button Event Listener
document.getElementById("refresh-btn").addEventListener("click", () => {
  location.reload();
});
