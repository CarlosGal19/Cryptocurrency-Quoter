const form = document.querySelector("#form");
const cryptoCurrenceSelector = document.querySelector("#cryptocurrences");
const currenceSelector = document.querySelector("#currence");
const result = document.querySelector("#result");

// Object which is going to save the values selected by the user
const objSearch = {
  currence: "",
  cryptocurrence: "",
};

document.addEventListener("DOMContentLoaded", () => {
  callAPI();

  form.addEventListener("submit", validateForm);

  cryptoCurrenceSelector.addEventListener("change", readValue);
  currenceSelector.addEventListener("change", readValue);
});

// Function that is going to fill the options of the form in criptocurrencies selector
async function callAPI() {
  // fetch(
  //   "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=MXN"
  // )
  //   .then((response) => response.json())
  //   .then((data) => getCryptoCurrencies(data.Data))
  //   .then((cryptoCurrencies) => fillForm(cryptoCurrencies));
    try {
      const response = await fetch("https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=MXN");
      const data = await response.json();
      const cryptoCurrencies = await getCryptoCurrencies(data.Data);
      fillForm(cryptoCurrencies);
    } catch (error) {
      console.log(error);
    }
}

// Promise that gets the cryptocurrencies for the options
const getCryptoCurrencies = (cryptoCurrencies) =>
  new Promise((resolve) => {
    resolve(cryptoCurrencies);
  });

// Function that fill insert the options of cryptocurrencies in DOM
function fillForm(dataCryptos) {
  dataCryptos.forEach((Coin) => {
    const { FullName, Name } = Coin.CoinInfo;
    const option = document.createElement("option");
    option.textContent = FullName;
    option.value = Name;
    cryptoCurrenceSelector.appendChild(option);
  });
}

// Function that read the values of the user and append them in 'objSearch'
function readValue(e) {
  objSearch[e.target.name] = e.target.value;
}

// Function that validate the form
function validateForm(e) {
  e.preventDefault();

  const { currence, cryptocurrence } = objSearch;

  if (!currence || !cryptocurrence) {
    showAlert("Both field are required");
    return;
  }

  consultAPI();
}

// Function that shows alerts is one of the fiels is not selected by the user
function showAlert(message) {
  const alertExist = document.querySelector(".error");
  if (!alertExist) {
    const alert = document.createElement("div");
    alert.classList.add("error");
    alert.textContent = message;
    form.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

// Function that calls the API and get its values to show them
async function consultAPI() {
  const { currence, cryptocurrence } = objSearch;

  showSpinner();

  // fetch(
  //   `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrence}&tsyms=${currence}`
  // )
  //   .then((response) => response.json())
  //   .then((data) => {
  //     showQuote(data.DISPLAY[cryptocurrence][currence]);
  //   });

  try {
    const response = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrence}&tsyms=${currence}`);
    const data = await response.json();
    showQuote(data.DISPLAY[cryptocurrence][currence]);
  } catch (error) {
    console.log(error);
  }
}

// Function that append the cryptocurrency in DOM
function showQuote(objData) {
  cleanHTML(result);

  const { LASTUPDATE, LOWDAY, HIGHDAY, PRICE, CHANGEPCT24HOUR } = objData;

  const price = document.createElement("p");
  price.classList.add("price");
  price.innerHTML = `
        The price is: <span> ${PRICE} </span>
    `;

  const priceHigh = document.createElement("p");
  priceHigh.innerHTML = `
        The higher price today is: <span> ${HIGHDAY} </span>
    `;

  const priceLow = document.createElement("p");
  priceLow.innerHTML = `
        The lower price today is: <span> ${LOWDAY} </span>
    `;

  const lastHours = document.createElement("p");
  lastHours.innerHTML = `
        The variation in last 24 hours is: <span> %${CHANGEPCT24HOUR} </span>
    `;

  const lastUpdate = document.createElement("p");
  lastUpdate.innerHTML = `
        The last update was: <span> ${LASTUPDATE} </span>
    `;

  result.appendChild(price);
  result.appendChild(priceHigh);
  result.appendChild(priceLow);
  result.appendChild(lastHours);
  result.appendChild(lastUpdate);
}

function cleanHTML(spaceToClean) {
  while (spaceToClean.firstChild) {
    spaceToClean.removeChild(spaceToClean.firstChild);
  }
}

// Spinner
function showSpinner() {
  cleanHTML(result);

  const spinner = document.createElement("div");
  spinner.classList.add("sk-chase");
  spinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `;
  result.appendChild(spinner);
}
