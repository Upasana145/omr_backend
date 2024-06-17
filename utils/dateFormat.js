const dateSqlType = (dateStr) => {
  //   const dateStr = "2020-06-21T10:15:06Z";
  let [yyyy, mm, dd, hh, mi] = dateStr.split(/[/:\-T]/);
  //   let [ss] = s.split(/[/:\-Z]/);
  //   console.log(`${dd}-${mm}-${yyyy} ${hh}:${mi}:${ss}`);
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:00`;
};

module.exports = { dateSqlType };
