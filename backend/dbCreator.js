let map = new Map();


// generating random emails, names and test id's
let emails = ["nishulpatni2@gmail.com", "nishulpatni5@gmail.com", "sunnyssbisht@gmail.com", "pandeyyateesh807@gmail.com", "yoyopandey01@gmail.com", "tusharkholia10@gmail.com", "tejashpatni19@gmail.com"];
for(let i=0; i<emails.length; i++){
    map.set(1000+i, emails[i]);
}

// console.log(map);
module.exports = map;