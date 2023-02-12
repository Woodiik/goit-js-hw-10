import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onInputEvent, DEBOUNCE_DELAY)
);

function onInputEvent(e) {
  if (e.target.value.trim() === '') {
    return;
  }
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  fetchCountries(e.target.value.trim())
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length >= 2 && data.length <= 10) {
        renderCountriesList(data);
      }
      if (data.length === 1) {
        console.log(data);
        renderCountryCard(data);
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountriesList(data) {
  data.map(({ flags, name }) => {
    const markup = `<li class="country-list-item">
          <img class="country-svg" src="${flags.svg}">
        <span>${name.common}</span>
      </li>`;
    refs.countryList.insertAdjacentHTML('beforeend', markup);
  });
}

function renderCountryCard(data) {
  data.map(({ flags, name, population, languages, capital }) => {
    const markup = `<div class="country">
          <img class="country-svg" src="${flags.svg}">
      <span class="country-name">${name.common}</span>
    </div>
    <div class="country-disc"><span class="country-disc-bold">Capital:</span> ${capital}</div>
    <div class="country-disc"><span class="country-disc-bold">Population:</span> ${population}</div>
    <div class="country-disc"><span class="country-disc-bold">Languages:</span> ${Object.values(
      languages
    )}</div>`;
    refs.countryInfo.insertAdjacentHTML('beforeend', markup);
  });
}
