/***************************************FUNCTIONS***************************************/
// Fetch all draws from the database.
fetch("/api").then((response) => response.json()).then((data) => {
  window.dbNumbers = data;
  countNum(dbNumbers);
});

const countNum = (numbers) => {
  const countThreshold = document.getElementById("count-slider").value;
  // Count the amount of times a number was drawn & store in a variable.
  const occurrences = numbers.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map()),
    [num, numCount] = [[...occurrences.keys()], [...occurrences.values()]];
  // Display the result in appropriate element.
  for (let i = 0; i < document.getElementById("count").querySelectorAll("p").length; i++) {
    const el = document.getElementById("count").querySelectorAll("p")[i],
      sliceB = num.findIndex((element) => element == el.innerText.slice(0, 2));
    el.firstElementChild.innerText = `${numCount[sliceB]} times`;
  // Apply CSS class based on count.
    parseInt(el.firstElementChild.innerText) >= countThreshold ? (el.classList.remove("low-count"), el.classList.add("high-count")) : (el.classList.remove("high-count"), el.classList.add("low-count"));
  }
  filterByFreq(num, numCount, countThreshold);
};

const filterByFreq = (unfilteredArr, unfilteredCount, threshold) => {
  const filteredList = [];
  // Filter numbers to filteredList if number count is above threshold.
  for (let i = 0; i < unfilteredCount.length; i++) {
    const el = unfilteredCount[i];
    if (el >= threshold) {
      filteredList.push(unfilteredArr[i]);
    }
  }
  recomGen(filteredList);
};

const recomGen = (filteredArray) => {
  // Display suggested draws based on filteredArray.
  for (let i = 0; i < document.getElementById('recom').querySelectorAll('p').length; i++) {
    const el = document.getElementById('recom').querySelectorAll('p')[i];
    el.innerText = '';
    el.append((filteredArray.sort(() => Math.random() - Math.random()).slice(0, 6)).sort()); 
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