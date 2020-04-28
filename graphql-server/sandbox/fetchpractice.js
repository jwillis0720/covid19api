const fetch = require("node-fetch");

async function getData() {
    const results = [];
    let url = 'https://swapi.py4e.com/api/people/';
    do {
        const res = await fetch(url);
        const data = await res.json();
        url = data.next;
        results.push(...data.results);
    } while (url)
    return results;
};

getData().then(res => console.log(res))