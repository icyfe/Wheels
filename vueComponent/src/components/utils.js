export function getYearMonthDay(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return {
    year,
    month,
    day
  };
}


// export function getFirstDate(value){
//     const date = new Date(value)
    
// }