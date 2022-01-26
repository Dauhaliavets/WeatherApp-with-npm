import UI from './view';
import Storage from './storage';
import initTabs from './tabs';

// // import { format } from 'date-fns';
// import { format, formatDistance, formatRelative, subDays } from 'date-fns'

// console.log(format(new Date(), "'Today is a' eeee"));
// //=> "Today is a Tuesday"

// console.log(formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true }));
// //=> "3 days ago"

// console.log(formatRelative(subDays(new Date(), 3), new Date()));
// //=> "last Friday at 7:26 p.m."

const URLS = {
	SERVER: 'https://api.openweathermap.org/data/2.5/weather',
	SERVER_ICON: 'http://openweathermap.org/img/wn/',
	SERVER_FORECAST: 'https://api.openweathermap.org/data/2.5/forecast',
};
const API_KEY = '6891e761757365649c5949515c45d9c2';
const UTIL_TO_API = 'metric';
const SYMBOL_DEGREE = '\u00B0';
const SYMBOL_CROSS = '&#128473;';
const ICON_SIZE_SMALL = '2x';
const ICON_SIZE_LARGE = '4x';

const favoriteCities = Storage.getFavoriteCities();
const favorites = Object.keys(favoriteCities).length === 0 ? [] : favoriteCities;
const currentCity = Storage.getCurrentCity() || 'Minsk';

const favoritesSet = new Set(favorites);

renderFavoriteItems(favoritesSet);
showAllWeather(currentCity);
initTabs();

UI.likeIcon.addEventListener('click', clickLikeIcon);

UI.FORM.form.addEventListener('submit', submitForm);

function clickLikeIcon(event) {
	const target = event.currentTarget;
	const cityName = target.previousElementSibling.textContent;

	if (favoritesSet.has(cityName)) {
		target.classList.remove('active');
		removeFavoriteCity(cityName);
	} else {
		target.classList.add('active');
		addToFavoritesCity(cityName);
	}
}

function removeFavoriteCity(cityName) {
	favoritesSet.delete(cityName);

	Storage.setFavoriteCities(favoritesSet);
	renderFavoriteItems(favoritesSet);
}

function addToFavoritesCity(cityName) {
	favoritesSet.add(cityName);

	Storage.setFavoriteCities(favoritesSet);
	renderFavoriteItems(favoritesSet);
}

function renderFavoriteItems(favorites) {
	UI.locationsList.innerHTML = '';

	favorites.forEach((city) => {
		UI.locationsList.append(createFavoriteItem(city));
	});
}

function createFavoriteItem(cityName) {
	const li = document.createElement('li');

	li.classList.add('location__item');
	li.innerHTML = `
		<a class="location__link" href="#">${cityName}</a>
		<button class="location__close">${SYMBOL_CROSS}</button>
	`;

	const locationLink = li.querySelector('.location__link');
	const locationCloseBtn = li.querySelector('.location__close');

	locationLink.addEventListener('click', () => {
		showAllWeather(cityName);
		Storage.setCurrentCity(cityName);
	});
	locationCloseBtn.addEventListener('click', () => {
		removeFavoriteCity(cityName);
		if (cityName === Storage.getCurrentCity()) {
			UI.likeIcon.classList.remove('active');
		}
	});

	return li;
}

function createForecastCard(forecast) {
	const urlIcon = `${URLS.SERVER_ICON}${forecast.iconCode}@${ICON_SIZE_SMALL}.png`;
	const div = document.createElement('div');

	div.className = 'forecast__card';
	div.innerHTML = `
		<div class="forecast__dateTime-wrapper">
			<div class="forecast__date">${forecast.date.day} ${forecast.date.month}</div>
			<div class="forecast__time">${forecast.time.hours}:${forecast.time.minutes}</div>
		</div>
		<div class="forecast__info-wrapper">
			<div class="forecast__info__temperature">
				<div class="forecast__temperature">Temperature: <span>${forecast.temperature}${SYMBOL_DEGREE}</span></div>
				<div class="forecast__feels_like">Feels like: <span>${forecast.feelsLike}${SYMBOL_DEGREE}</span></div>
			</div>
			<div class="forecast__info__weather">
				<div class="forecast__main">${forecast.weather}</div>
				<div class="forecast__icon">
					<img src=${urlIcon} width="50px" height="50px" alt="icon-weather">
				</div>
			</div>
		</div>
	`;

	return div;
}

function submitForm(event) {
	const searchCity = UI.FORM.formInput.value;

	event.preventDefault();
	showAllWeather(searchCity);
}

function showAllWeather(city) {
	const url = `${URLS.SERVER}?q=${city}&units=${UTIL_TO_API}&appid=${API_KEY}`;
	const urlForecast = `${URLS.SERVER_FORECAST}?q=${city}&units=${UTIL_TO_API}&appid=${API_KEY}`;

	fetch(url)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(
				`${response.status === 404 ? 'Not found' : response.status}`,
			);
		})
		.then((data) => {
			setDataWeatherNow(data);
			setDataWeatherDetails(data);
			Storage.setCurrentCity(data.name);
		})
		.catch(alert);

	async function getForecast(url) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				const data = await response.json();
				setDataWeatherForecast(data);
				return;
			}
			throw new Error(
				`${response.status === 404 ? 'City is not found' : response.status}`,
			);
		} catch (error) {
			alert(error);
		}
	}
	getForecast(urlForecast);
}

function setDataWeatherNow(data) {
	const dataNow = {
		temp: Math.round(data.main.temp),
		city: data.name,
		iconCode: data.weather[0].icon,
	};
	const urlIcon = `${URLS.SERVER_ICON}${dataNow.iconCode}@${ICON_SIZE_LARGE}.png`;

	UI.temperature.forEach(
		(item) => (item.textContent = `${dataNow.temp}${SYMBOL_DEGREE}`),
	);
	UI.location.forEach((item) => (item.textContent = `${dataNow.city}`));
	UI.weatherIcon.src = urlIcon;

	if (favorites.includes(dataNow.city)) {
		UI.likeIcon.classList.add('active');
	} else {
		UI.likeIcon.classList.remove('active');
	}
}

function setDataWeatherDetails(data) {
	const dataDetails = {
		feelsLike: Math.round(data.main.feels_like),
		weather: data.weather[0].main,
		sunrise: {
			hours: minTwoDigits(new Date(data.sys.sunrise * 1000).getHours()),
			minutes: minTwoDigits(new Date(data.sys.sunrise * 1000).getMinutes()),
		},
		sunset: {
			hours: minTwoDigits(new Date(data.sys.sunset * 1000).getHours()),
			minutes: minTwoDigits(new Date(data.sys.sunset * 1000).getMinutes()),
		},
	};

	UI.DETAILS.feelsLike.textContent = `${dataDetails.feelsLike}${SYMBOL_DEGREE}`;
	UI.DETAILS.weather.textContent = dataDetails.weather;
	UI.DETAILS.sunrise.textContent = `${dataDetails.sunrise.hours}:${dataDetails.sunrise.minutes}`;
	UI.DETAILS.sunset.textContent = `${dataDetails.sunset.hours}:${dataDetails.sunset.minutes}`;
}

function setDataWeatherForecast(data) {
	const forecastList = data.list.splice(0, 7);

	UI.FORECAST_CARDS.innerHTML = '';

	forecastList.forEach((forecastItem) => {
		const dataForecast = {
			date: {
				day: new Date(forecastItem.dt * 1000).getDate(),
				month: new Date(forecastItem.dt * 1000).toLocaleString('en-US', {
					month: 'long',
				}),
			},
			time: {
				hours: minTwoDigits(new Date(forecastItem.dt * 1000).getHours()),
				minutes: minTwoDigits(new Date(forecastItem.dt * 1000).getMinutes()),
			},
			temperature: Math.round(forecastItem.main.temp),
			feelsLike: Math.round(forecastItem.main.feels_like),
			weather: forecastItem.weather[0].main,
			iconCode: forecastItem.weather[0].icon,
		};

		const forecastCard = createForecastCard(dataForecast);
		UI.FORECAST_CARDS.append(forecastCard);
	});
}

function minTwoDigits(num) {
	return (num < 10 ? '0' : '') + num;
}
