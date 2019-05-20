'use strict';

let arr = [];

const neededLength = 1000000;

const url = 'https://api.random.org/json-rpc/2/invoke';

const keys = [
    "f29d73fc-fb48-4aae-a601-79ad280e0d86",
    "f230a79a-61db-45a7-9c72-00ef7b614b3f",
    "ebbc1d5f-dec6-4a0d-a02b-445a1915e725",
    "c5e72a7d-830a-4804-90f2-856e31c9aa90",
    "81f39aa3-ba4f-4698-9b0c-b23deb2ca357",
    "811c3f42-0048-432c-9133-849ada7ede42",
    "6e593e96-7957-4dc0-93c5-bd347622fe95",
    "4dc49adc-5120-4170-bbc1-80a5fb90298f",
    "2bf64479-4705-4bbb-bfbb-f8a3efa7e72a",
    "23417cdf-8e93-40e8-99ff-adc037db56f7"
];

let dataActualKay = 0;


const dataValue = [
    [[0],[1]],
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0,0],[0,0,1],[0,1,0],[1,0,0],[0,1,1],[1,1,0],[1,0,1],[1,1,1]]
];

function request() {

    let data = {
        "jsonrpc": "2.0",
        "method": "generateIntegers",
        "params": {
            "apiKey": keys[dataActualKay],
            "n": 10000,
            "min": 0,
            "max": 1,
            "replacement": true,
            "base": 10
        },
        "id": 6306
    };

    fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json; charset=utf-8'},
        body: JSON.stringify(data)
    })
        .then((response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                return response.json();
            }
        )
        .then((res) => {

            if (res.error) {
                console.log(`${dataActualKay} is will bee changed`);
                dataActualKay++;
                console.log(`${dataActualKay} is changed`);
                return request();
            }

            dataCreator(res);

            if (arr.length < neededLength) {
                request();
            }
            else {
                console.log(statisticsCalculator(arr, dataValue[0]));
                console.log(statisticsCalculator(arr, dataValue[1]));
                console.log(statisticsCalculator(arr, dataValue[2]));
            }
        })
        .catch(error => console.log(error));
}

function dataCreator({result: {random: {data}}}) {
    data.forEach(function (item) {
        arr.push(item);
    });
}

let combinations = function (firstIndex) {

    let combinationsArr = [];

    arr.forEach(function (item, i, array) {
        let combination = [];

        if(i >= firstIndex) {
            for(let j = firstIndex; j >= 0; j--){
                combination.push(array[i -j]);
            }
        }

        combinationsArr.push(combination);
    });

    return combinationsArr;
};

let statisticsCalculator = function (arr, value) {

    let valuesData = {};

    let arrayEquality = function(a, b) {
        for(let i = 0; i < a.length; i++) {
            if(a[i] !== b[i]) {
                return false
            }
        }
        return true;
    };

    let firstIndex = value[0].length - 1;


    let ratioCalc = function(count) {
        let combLength = arr.length - firstIndex;

        return count / (combLength / 100 );
    };

    value.forEach( function (item) {
        let count = 0;

        let arrA = combinations(firstIndex);

        arrA.forEach(function (combItem) {
            if(arrayEquality(item, combItem)) {
                count++
            }
        });

        let statisticsName = item.join('');

        valuesData[statisticsName] = {
            count: count,
            ratio: ratioCalc(count) + '%'
        };
    });

    return valuesData;
};

request();

