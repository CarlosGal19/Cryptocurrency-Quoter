const form = document.querySelector("#formulario");
const cryptoCurrenceSelector = document.querySelector("#cryptocurrences");
const currenceSelector = document.querySelector("#currence");
const result = document.querySelector("#resultado");

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

function callAPI() {
  fetch(
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=MXN"
  )
    .then((response) => response.json())
    .then((data) => getCryptoCurrencies(data.Data))
    .then((cryptoCurrencies) => fillForm(cryptoCurrencies));
}

const getCryptoCurrencies = (cryptoCurrencies) =>
  new Promise((resolve) => {
    resolve(cryptoCurrencies);
  });

function fillForm(dataCryptos) {
  dataCryptos.forEach((Coin) => {
    const { FullName, Name } = Coin.CoinInfo;
    const option = document.createElement("option");
    option.textContent = FullName;
    option.value = Name;
    cryptoCurrenceSelector.appendChild(option);
  });
}

function readValue(e) {
  objSearch[e.target.name] = e.target.value;
}

function validateForm(e) {
  e.preventDefault();

  const { currence, cryptocurrence } = objSearch;

  if (!currence || !cryptocurrence) {
    showAlert("Both field are required");
    return;
  }

  consultAPI();
}

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

function consultAPI() {
  const { currence, cryptocurrence } = objSearch;

  showSpinner();

  fetch(
    `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrence}&tsyms=${currence}`
  )
    .then((response) => response.json())
    .then((data) => {
      showQuote(data.DISPLAY[cryptocurrence][currence]);
    });
}

function showQuote(objData) {
  cleanHTML(result);

  const { LASTUPDATE, LOWDAY, HIGHDAY, PRICE, CHANGEPCT24HOUR } = objData;

  const price = document.createElement("p");
  price.classList.add("precio");
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
