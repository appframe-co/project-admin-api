export const getDate = (date: string):string => {
    const d = new Date(date);

    let _day = null;
    let day = _day = d.getDate();
    if (day < 10) _day = '0' + day;

    let _month = null;
    let month = _month = d.getMonth() + 1;
    if (month < 10) _month = '0' + month;

    let _year = null;
    let year = _year = d.getFullYear() % 100;
    if (year < 10) _year = '0' + year;

    let _hours = null;
    let hours = _hours = d.getHours();
    if (hours < 10) _hours = '0' + hours;

    let _minuts = null;
    let minuts = _minuts = d.getMinutes();
    if (minuts < 10) _minuts = '0' + minuts;

    return _day + '.' + _month + '.' + _year + ' ' + _hours + ':' + _minuts;
};

export const getDateWoTime = (date: string):string => {
    const d = new Date(date);
    const month = getMonthName(d.getMonth());

    let _day = null;
    let day = _day = d.getDate();
    if (day < 10) _day = '0' + day;

    return _day + ' ' + month + ' ' + d.getFullYear();
};

export const getDateWoYearAndTime = (date: string):string => {
    const d = new Date(date);
    const month = getMonthName(d.getMonth());

    let _day = null;
    let day = _day = d.getDate();
    if (day < 10) _day = '0' + day;

    return _day + ' ' + month;
};

export const getDateV2 = (date: string):string => {
    const d = new Date(date);
    const month = getMonthName(d.getMonth());

    let _day = null;
    let day = _day = d.getDate();
    if (day < 10) _day = '0' + day;

    let _hours = null;
    let hours = _hours = d.getHours();
    if (hours < 10) _hours = '0' + hours;

    let _minuts = null;
    let minuts = _minuts = d.getMinutes();
    if (minuts < 10) _minuts = '0' + minuts;

    return _day + ' ' + month + ', ' + _hours + ':' + _minuts;
};

function getMonthName(monthInt:number):string {
    const arMonths = [
        'January', 'February',
        'March', 'April', 'May',
        'June', 'July', 'August',
        'September', 'October', 'November',
        'December',
    ];

    return arMonths[monthInt];
};