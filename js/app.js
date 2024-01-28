const form=document.querySelector('#formulario')
const cryptoCurrence=document.querySelector('#criptomonedas');
const currence=document.querySelector('#moneda');

document.addEventListener('DOMContentLoaded', callAPI);

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
        cryptoCurrence.appendChild(option);
    });
}
