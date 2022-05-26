// import { allCombinations } from "./combinations.js";
const countSlider = document.getElementById("count-slider"),
  startDate = document.getElementById("start-date"),
  endDate = document.getElementById("end-date");
endDate.value = new Date().toISOString().slice(0, 10);

/***************************************FUNCTIONS***************************************/
// Fetch draws within the specified range from the database.
async function filterDatabase(fromDate, toDate) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fromDate, toDate }),
  };
  const response = await fetch("/api", options);
  const data = await response.json();
  dateRange(data);
}

// Extract draw numbers and add to a new array for counting.
function dateRange(db) {
  const dateRangeArr = [];
  for (let i = 0; i < db.length; i++) {
    const data = db[i];
    data.draw.forEach((num) => {
      dateRangeArr.push(num);
    });
  }
  countNum(dateRangeArr);
}

// Count the amount of times a number was drawn & store in a list.
function countNum(numberArr) {
  const countThreshold = countSlider.value;
  const occurrences = numberArr.reduce(
      (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
      new Map()
    ),
    [num, numCount] = [[...occurrences.keys()], [...occurrences.values()]];
  // Display the result in appropriate element.
  for (
    let i = 0;
    i < document.getElementById("count").querySelectorAll("p").length;
    i++
  ) {
    const el = document.getElementById("count").querySelectorAll("p")[i],
      sliceB = num.findIndex((element) => element == el.innerText.slice(0, 2));
    el.firstElementChild.innerText = `${numCount[sliceB] || 0} times`;
    // Apply CSS class based on count.
    parseInt(el.firstElementChild.innerText) >= countThreshold
      ? (el.classList.remove("low-count"), el.classList.add("high-count"))
      : (el.classList.remove("high-count"), el.classList.add("low-count"));
  }
  filterByFreq(num, numCount, countThreshold);
}

// Filter numbers to filteredList if number count is above threshold.
function filterByFreq(unfilteredArr, unfilteredCount, threshold) {
  const filteredList = [];
  for (let i = 0; i < unfilteredCount.length; i++) {
    const el = unfilteredCount[i];
    if (el >= threshold) {
      filteredList.push(unfilteredArr[i]);
    }
  }
  recomGen(filteredList);
}

// Display suggested draws based on filteredArray.
function recomGen(filteredArray) {
  for (
    let i = 0;
    i < document.getElementById("recom").querySelectorAll("p").length;
    i++
  ) {
    const el = document.getElementById("recom").querySelectorAll("p")[i];
    el.innerText = "";
    el.append(
      filteredArray
        .sort(() => Math.random() - Math.random())
        .slice(0, 6)
        .sort()
    );
  }
}

/***************************************Event Listeners***************************************/
// Count Threshold, Date Range Event Listeners in a for loop
[countSlider, startDate, endDate].forEach((item) => {
  item.addEventListener("change", () => {
    filterDatabase(
      startDate.value.replace(/-/g, ""),
      endDate.value.replace(/-/g, "")
    );
  });
});

// Refresh Button Event Listener
// document.getElementById("refresh-db-btn").addEventListener("click", () => {
//   document.getElementById("title").textContent = "Updating Database.";
fetch("/scrape").then((response) => response.json()).then((data) => {
  document.getElementById("title").textContent = data;
});
// });

/***************************************Test Code***************************************/
// Get draws from 02/08/2022 to current date on page load.
filterDatabase(
  startDate.value.replace(/-/g, ""),
  endDate.value.replace(/-/g, "")
);