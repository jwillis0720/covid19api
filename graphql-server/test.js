const datestring = process.argv[2];
const parsedDate = new Date(datestring);
const currentDate = new Date();

// console.log(parsedDate.toString(), currentDate, parsedDate.getTime());
console.log(currentDate > parsedDate);
