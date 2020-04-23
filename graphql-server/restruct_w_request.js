const test_dat = [
    {
        date: '2020-01-21',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-22',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-23',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-24',
        state: 'Illinois',
        fips: '17',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-24',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-25',
        state: 'California',
        fips: '06',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-25',
        state: 'Illinois',
        fips: '17',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-25',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-26',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-26',
        state: 'California',
        fips: '06',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-01-26',
        state: 'Illinois',
        fips: '17',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-26',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-27',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-27',
        state: 'California',
        fips: '06',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-01-27',
        state: 'Illinois',
        fips: '17',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-27',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-28',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-28',
        state: 'California',
        fips: '06',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-01-28',
        state: 'Illinois',
        fips: '17',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-28',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-29',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-29',
        state: 'California',
        fips: '06',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-01-29',
        state: 'Illinois',
        fips: '17',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-29',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-30',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-30',
        state: 'California',
        fips: '06',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-01-30',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-01-30',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-31',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-01-31',
        state: 'California',
        fips: '06',
        cases: 3,
        deaths: 0
    },
    {
        date: '2020-01-31',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-01-31',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-01',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-01',
        state: 'California',
        fips: '06',
        cases: 3,
        deaths: 0
    },
    {
        date: '2020-02-01',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-01',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-01',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-02',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-02',
        state: 'California',
        fips: '06',
        cases: 6,
        deaths: 0
    },
    {
        date: '2020-02-02',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-02',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-02',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-03',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-03',
        state: 'California',
        fips: '06',
        cases: 6,
        deaths: 0
    },
    {
        date: '2020-02-03',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-03',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-03',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-04',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-04',
        state: 'California',
        fips: '06',
        cases: 6,
        deaths: 0
    },
    {
        date: '2020-02-04',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-04',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-04',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-05',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-05',
        state: 'California',
        fips: '06',
        cases: 6,
        deaths: 0
    },
    {
        date: '2020-02-05',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-05',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-05',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-05',
        state: 'Wisconsin',
        fips: '55',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-06',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-06',
        state: 'California',
        fips: '06',
        cases: 6,
        deaths: 0
    },
    {
        date: '2020-02-06',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-06',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-06',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-06',
        state: 'Wisconsin',
        fips: '55',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-07',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-07',
        state: 'California',
        fips: '06',
        cases: 6,
        deaths: 0
    },
    {
        date: '2020-02-07',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-07',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-07',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-07',
        state: 'Wisconsin',
        fips: '55',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-08',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-08',
        state: 'California',
        fips: '06',
        cases: 6,
        deaths: 0
    },
    {
        date: '2020-02-08',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-08',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-08',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-08',
        state: 'Wisconsin',
        fips: '55',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-09',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-09',
        state: 'California',
        fips: '06',
        cases: 6,
        deaths: 0
    },
    {
        date: '2020-02-09',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-09',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-09',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-09',
        state: 'Wisconsin',
        fips: '55',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-10',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-10',
        state: 'California',
        fips: '06',
        cases: 7,
        deaths: 0
    },
    {
        date: '2020-02-10',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-10',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-10',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-10',
        state: 'Wisconsin',
        fips: '55',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-11',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-11',
        state: 'California',
        fips: '06',
        cases: 7,
        deaths: 0
    },
    {
        date: '2020-02-11',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-11',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-11',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-11',
        state: 'Wisconsin',
        fips: '55',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-12',
        state: 'Arizona',
        fips: '04',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-12',
        state: 'California',
        fips: '06',
        cases: 7,
        deaths: 0
    },
    {
        date: '2020-02-12',
        state: 'Illinois',
        fips: '17',
        cases: 2,
        deaths: 0
    },
    {
        date: '2020-02-12',
        state: 'Massachusetts',
        fips: '25',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-12',
        state: 'Texas',
        fips: '48',
        cases: 1,
        deaths: 0
    },
    {
        date: '2020-02-12',
        state: 'Washington',
        fips: '53',
        cases: 1,
        deaths: 0
    }]
console.log(test_dat)


const getMapFromArray = data =>
    data.reduce((acc, item) => {
        if (!acc[item.state]) {
            acc[item.state] = []
        }
        let _map = {}
        _map[item.date] = item.cases
        acc[item.state].push(_map)
        return acc;
    }, {});

console.log(getMapFromArray(test_dat))