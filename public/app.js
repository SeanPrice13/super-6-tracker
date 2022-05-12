/***************************************FUNCTIONS***************************************/
// Fetch all draws from the database.
fetch("/api").then((response) => response.json()).then((data) => {
  window.dbNumbers = data;
  countNum(data);
  checkFreq(data);
});

function countNum(numbers) {
  //Count the amount of times a number was drawn, regardless of position then display the result.
  const countThreshold = document.getElementById("count-slider").value;
  numbers.forEach((number) => {
    document.getElementById("count").querySelectorAll("p").forEach((item) => {
      const sliceA = item.innerText.slice(0, 2);
      let sliceB = parseInt(item.firstElementChild.innerText);
      if (number == sliceA) {
        sliceB++;
        item.firstElementChild.innerText = `${sliceB} times`;
      }
      if (sliceB !== 0) {
        if (sliceB < countThreshold) {
          item.classList.remove("high-count");
          item.classList.add("low-count");
        }
        if (sliceB >= countThreshold) {
          item.classList.remove("low-count");
          item.classList.add("high-count");
        }
      }
    })
  })
};

function checkFreq(numbers) {
  // Temporary variables to use in For Loops below.
  const freqThreshold = document.getElementById("freq-slider").value;
  // Number Position Arrays. (NPAs)
  const arrList = [[], [], [], [], [], []];
  // Position Frequency Arrays. (PFAs)
  const highList = [[], [], [], [], [], []],
    lowList = [[], [], [], [], [], []];
  let n1 = 0,
    n2 = 6;
  // Push each number to the appropriate NPA.
  for (let index = 0; index < numbers.length / 6; index++) {
    draw = numbers.slice(n1, n2);
    draw.forEach((element) => {
      arrList[draw.indexOf(element)].push(element);
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
      if (count !== 0) {
        count < freqThreshold
          ? lowList[i].push(index)
          : highList[i].push(index);
      }
    }
  }
  // Append the High Frequency results to the document.
  for (let k = 0; k < document.getElementById("high-freq").querySelectorAll("p").length; k++) {
    const row = document.getElementById("high-freq").querySelectorAll("p")[k].firstElementChild;
    row.append(highList[k]);
  }
  // Append the Low Frequency results to the document.
  for (let l = 0; l < document.getElementById("low-freq").querySelectorAll("p").length; l++) {
    const row = document.getElementById("low-freq").querySelectorAll("p")[l].firstElementChild;
    row.append(lowList[l]);
  }
};

/***************************************Event Listeners***************************************/
// Count Threshold Slider Event Listener
document.getElementById("count-slider").addEventListener("change", () => {
  document.getElementById("count").querySelectorAll("p").forEach((p) => {
    p.firstElementChild.innerText = "0 times";
  });
  countNum(dbNumbers);
});
// Frequency Threshold Slider Event Listener
document.getElementById("freq-slider").addEventListener("change", () => {
  document.getElementById("high-freq").querySelectorAll("p").forEach((p) => {
    p.firstElementChild.innerText = "";
  });
  document.getElementById("low-freq").querySelectorAll("p").forEach((p) => {
    p.firstElementChild.innerText = "";
  });
  checkFreq(dbNumbers);
});
// Refresh Button Event Listener
document.getElementById("refresh-btn").addEventListener("click", () => {
  location.reload();
});

/***************************************Test Code***************************************/

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