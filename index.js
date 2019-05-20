'use strict';

let arr = '';

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

const val = [
    ["0","1"],
    ["00","01","10","11"],
    ["000","001","010","100","011","110","101","111"]
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

            arr += res.result.random.data.join('');

            if (arr.length < neededLength) {
                request();
            }
            else {
                dataConstructor(val);
            }
        })
        .catch(error => console.log(error));
}



function dataConstructor([val_1, val_2, val_3]) {
    val_1.forEach(function (item) {
        console.log(statisticsCalculator(item));
    });
    val_2.forEach(function (item) {
        console.log(statisticsCalculator(item));
    });
    val_3.forEach(function (item) {
        console.log(statisticsCalculator(item));
    })
}

function statisticsCalculator(target) {

    let pos = 0;
    let count = 0;

    while (true) {
        let foundPos = arr.indexOf(target, pos);
        if (foundPos === -1) break;

        count++;

        pos = foundPos + 1;
    }

    const ratio = count / (arr.length /100);

    return {
        target: target,
        quantity : count,
        ratio: ratio
    }
}

request();

