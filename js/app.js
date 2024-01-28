const form=document.querySelector('#formulario')
const cryptoCurrenceSelector=document.querySelector('#cryptocurrences');
const currenceSelector=document.querySelector('#currence');

const objSearch={
    currence: '',
    cryptocurrence: ''
}

document.addEventListener('DOMContentLoaded', ()=>{
    callAPI();

    form.addEventListener('submit', validateForm);

    cryptoCurrenceSelector.addEventListener('change', readValue);
    currenceSelector.addEventListener('change', readValue);
});

function callAPI(){
    fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=MXN')
        .then(response=>response.json())
        .then(data => getCryptoCurrencies(data.Data))
        .then(cryptoCurrencies => fillForm(cryptoCurrencies))
}

const getCryptoCurrencies = ( cryptoCurrencies ) => new Promise( resolve =>{
    resolve(cryptoCurrencies);
})

function fillForm(dataCryptos){
    dataCryptos.forEach(Coin => {
        const {FullName, Name} = Coin.CoinInfo;
        const option=document.createElement('option');
        option.textContent=FullName;
        option.value=Name;
        cryptoCurrenceSelector.appendChild(option);
    });
}

function readValue(e) {
    objSearch[e.target.name]=e.target.value;
}

function validateForm(e) {
    e.preventDefault();

    const {currence, cryptocurrence} = objSearch;

    if (!currence || !cryptocurrence) {
        showAlert('Both field are required');
        return
    }
}

function showAlert(message){
    const alertExist=document.querySelector('.error');
    if (!alertExist) {
        const alert = document.createElement('div');
        alert.classList.add('error');
        alert.textContent=message;
        form.appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}
