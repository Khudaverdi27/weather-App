const inputUser = document.querySelector(".inputUser");
const country = document.querySelector(".country");
const city = document.querySelector(".city");
const skyCoundation = document.querySelector(".skyCoundation");
const changeContent = document.querySelectorAll(".changeContent");
const currentTime = document.querySelector(".currentTime");
const url = "https://api.openweathermap.org/data/2.5/";
const key = "1882ca3053a86bff2e348a30b9d66d62";

const setQuery = (e) => {
    if (e.keyCode === 13) {
        getResult(inputUser.value);
        fetchWorldTime(inputUser.value);
        e.preventDefault()
    }
};

inputUser.addEventListener("keypress", setQuery);

const getResult = async (cityName) => {
    const query = `${url}weather?q=${cityName}&appid=${key}&lang=en`;



    try {
        const response = await fetch(query);
        if (response.ok) {
            const result = await response.json();
            displayResult(result);
        } else {
            console.error("API'den data alınmadı.");
        }
    } catch (error) {
        console.error("error: ", error);
    }
};
//show UI
let sunriseSetArr = []
const displayResult = (result) => {
    console.log(sunriseSetArr);
    country.textContent = result.sys.country
    city.textContent = result.name + ","
    console.log(result);
    sunRiseSunSet(result.coord.lat, result.coord.lon)
    for (let i = 0; i < changeContent.length; i++) {
        changeContent[0].textContent = Math.round(result.wind.speed) + "m/s"
        changeContent[1].textContent = result.main.humidity + "%"
        changeContent[3].textContent = Math.round(result.main.temp - 272.15) + "°C"
        changeContent[4].textContent = Math.round(result.main.feels_like - 272.15)
        changeContent[6].textContent = Math.round((result.visibility) / 1000) + "km"
        changeContent[7].textContent = result.clouds.all + "%"
        changeContent[9].textContent = sunriseSetArr[sunriseSetArr.length - 2]
        changeContent[10].textContent = sunriseSetArr[sunriseSetArr.length - 1]
        if (result.clouds.all >= 50 && result.clouds.all <= 75) {
            changeContent[8].textContent = 55 + "%"
        } else if (result.clouds.all >= 75) {
            changeContent[8].textContent = 100 + "%"
        } else {
            changeContent[8].textContent = 0 + "%"

        }
    }

    skyCoundation.textContent = result.weather[0].description
}

//change to UNIX timestamp to normal timestamp
async function sunRiseSunSet(long, lat) {
    let sunTimeUrl = await fetch(`https://api.sunrisesunset.io/json?lat=${long}&lng=${lat}`)
    try {
        if (sunTimeUrl.ok) {
            let sunTime = await sunTimeUrl.json()
            sunriseSetArr.push((sunTime.results.sunrise).slice(0, 4));
            sunriseSetArr.push((sunTime.results.sunset).slice(0, 4));
        } else {
            console.error("Could not sun timestamp")
        }
    } catch (error) {
        console.error("timestamp error:", error)
    }

}


//get local time
async function fetchWorldTime(valu) {
    const apiKey = 'ukr3HjcLVzkSaVIshIPQ/A==8ZXgpQjvJlXjNeiY';
    const url = `https://api.api-ninjas.com/v1/worldtime?city=${valu}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            localeTime(result)
            console.log(result);
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function localeTime(time) {
    let originalDate = new Date(`${time.date}`)
    let day = originalDate.getDate()
    let month = originalDate.getMonth() + 1
    let year = originalDate.getFullYear()

    day = day < 10 ? "0" + day : day
    month = month < 10 ? "0" + month : month

    let formattedDte =
        `${time.day_of_week} ${day} ${nameMonth(month)} ${year} | ${(time.datetime).slice(11, 16)}`
    currentTime.textContent = formattedDte

}

function nameMonth(month) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return monthNames[month - 1]
}





