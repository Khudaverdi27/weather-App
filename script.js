async function api() {
    let test = await (await fetch("https://api.openweathermap.org/data/2.5/weather?q=Baku,aze&APPID=1882ca3053a86bff2e348a30b9d66d62")).json()
    console.log(test);
}
api()