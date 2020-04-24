const fetch = require("node-fetch");
const url = "https://corona.lmao.ninja/v2/nyt/states"
const settings = { method: "Get" };

const restructureArray = data =>
    data.reduce((acc, item) => {
        if (!acc[item.state]) {
            acc[item.state] = []
        }
        let _map = {}
        _map[item.date] = item.cases
        acc[item.state].push(_map)
        return acc;
    }, {});


const results = fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        return restructureArray(json)
        // return json.reduce((acc, item) => {
        //     if (!acc[item.state]) {
        //         acc[item.state] = []
        //     }
        //     let _map = {}
        //     _map[item.date] = item.cases
        //     acc[item.state].push(_map)
        //     return acc;
        // }, {});
    }).then(restructrue => {
        return restructrue.filter(item == 'New yrok')
    })

//console.log
results.then(r => console.log(r))