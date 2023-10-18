const inputUser = document.querySelector(".inputUser");
const country = document.querySelector(".country");
const city = document.querySelector(".city");
const skyCoundation = document.querySelector(".skyCoundation");
const changeContent = document.querySelectorAll(".changeContent");
const url = "https://api.openweathermap.org/data/2.5/";
const key = "1882ca3053a86bff2e348a30b9d66d62";

const setQuery = (e) => {
    if (e.keyCode === 13) {
        getResult(inputUser.value);
        // test(inputUser.value)
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
let sunriseSetArr = []
const displayResult = (result) => {
    country.textContent = result.sys.country
    city.textContent = result.name + ","
    console.log(result);
    changetUNIX(result.sys.sunrise, result.sys.sunset)
    for (let i = 0; i < changeContent.length; i++) {
        changeContent[0].textContent = result.wind.speed + "m/s"
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
console.log(changeContent);

//change to UNIX timestamp to normal timestamp
function changetUNIX(unixSunrise, unixSunset) {
    let date = new Date(unixSunrise * 1000)
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let dateSunset = new Date(unixSunset * 1000)
    let hoursSunset = dateSunset.getHours();
    let minutesSunset = dateSunset.getMinutes();

    sunriseSetArr.push(hours + ":" + minutes, hoursSunset + ":" + minutesSunset);
}

// async function test(valu) {
//     let a = await (await fetch(`http://worldtimeapi.org/api/timezone${valu}`)).json()
//     console.log(a);
// }


