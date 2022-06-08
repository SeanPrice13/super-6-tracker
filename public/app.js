const countSlider = document.getElementById("count-slider"),
  aDate = document.getElementById("start-date"),
  bDate = document.getElementById("end-date"),
  recomArr = document.getElementById("recom").querySelectorAll("p");

// Get draws from 02/08/2022 to current date on page load.
bDate.value = new Date().toISOString().slice(0, 10);
filterDatabase(aDate.value.replace(/-/g, ""), bDate.value.replace(/-/g, ""));

/***************************************FUNCTIONS***************************************/
// Extract draw numbers and add to a new array for counting.
function dateRange(db) {
  const dateRangeArr = [];
  db.map((drawRow) => drawRow.draw.map((num) => dateRangeArr.push(num)));
  countNum(dateRangeArr);
}

// Count the amount of times a number was drawn & store in a list.
function countNum(numArr) {
  const drawPicks = document.getElementById("count").querySelectorAll("p");
  const countThreshold = countSlider.value;
  const occurrences = numArr.reduce(
    (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
    new Map()
  );
  const [num, numCount] = [[...occurrences.keys()], [...occurrences.values()]];
  // Display the result in appropriate element.
  [...drawPicks].map((ball) => {
    const sliceB = num.findIndex((el) => el == ball.innerText.slice(0, 2));
    ball.firstElementChild.innerText = `${numCount[sliceB] || 0} times`;
    // Apply CSS class based on count.
    parseInt(ball.firstElementChild.innerText) >= countThreshold
      ? (ball.classList.remove("low-count"), ball.classList.add("high-count"))
      : (ball.classList.remove("high-count"), ball.classList.add("low-count"));
  });
  filterByFreq(num, numCount, countThreshold);
}

// Filter numbers based on count threshold.
function filterByFreq(unfilteredArr, unfilteredCount, threshold) {
  const aboveThreshold = [],
    belowThreshold = [];
  unfilteredCount.map((el, i) =>
    el >= threshold
      ? aboveThreshold.push(unfilteredArr[i])
      : belowThreshold.push(unfilteredArr[i])
  );
  recomGen(aboveThreshold, belowThreshold);
}

// Display suggested draws based on threshold.
function recomGen(aboveArray, belowArray) {
  aboveArray.length == 0 ? [...recomArr].map((el) => {
      el.innerText = "", el.innerText = "00,00,00,00,00,00";
    }) 
  : aboveArray.length > 5 ? ([...recomArr].map((el) => {
    el.innerText = '';
    el.append(aboveArray.sort(() => Math.random() - Math.random()).slice(0, 6).sort())})) 
  : findCombinations(aboveArray, belowArray)
}

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
}(aDate.value.replace(/-/g, ""), bDate.value.replace(/-/g, ""));

async function findCombinations(aThreshold, bThreshold) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ aThreshold }),
  };
  const response = await fetch("/api/combos", options);
  const data = await response.json();
  [...recomArr].map((el, i) => {
    (el.innerText = ""), el.append(data[i]);
  });
}

/***************************************Event Listeners***************************************/
// Count Threshold Slider & Date Range Event Listeners
[countSlider, aDate, bDate].forEach((item) => {
  item.addEventListener("change", () => {
    filterDatabase(aDate.value.replace(/-/g, ""), bDate.value.replace(/-/g, ""));
  });
});

// Refresh Button Event Listener
document.getElementById("refresh-db-btn").addEventListener("click", () => {
  const title = document.getElementById("title");
  title.textContent = "Scraping...";
  fetch("/scrape").then((res) => res.json()).then((data) => {
    title.textContent = data;
  });
  setTimeout(() => {title.textContent = "Super 6 Tracker"}, 7000)
});

/***************************************Test Code***************************************/