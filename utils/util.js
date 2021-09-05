function parsekbRes(rowkb){
  let kbres = rowkb[0];
  let kb = new Array(22);
  kbres.forEach(function (kc) {
    kc.jcdm = kc.jcdm.split(/(\d{2})/).filter((item) => item != "");
    if (!kb[kc.zc - 1]) {
      kb[kc.zc - 1] = [];
    }
    kb[kc.zc - 1].push(kc);
  });
  //console.log(kb)
  return kb;
}

function getDate(datestr) {
  let temp = datestr.split("-");
  let date = new Date(temp[0], temp[1] - 1, temp[2]);
  return date;
}

function generateCalendar(firstclass) {
  let dates = [];
  let startTime = getDate(firstclass.rows[0].pkrq);
  for (let i = 0; i < 22; ++i) {
    let week = []
    for (let j = 0; j < 7; ++j) {
      let y = startTime.getFullYear().toString();
      let m = startTime.getMonth() + 1;
      m = m < 10 ? "0" + m : m + "";
      let d = startTime.getDate();
      d = d < 10 ? "0" + d : d + "";
      week.push({ y, m, d, w: startTime.getDay() });
      startTime.setDate(startTime.getDate() + 1);
    }
    dates.push(week);
  }
  return dates;
}
function colorHex (rgb) {
  // RGB颜色值的正则
  var reg = /^(rgb|RGB)/;
  var color = rgb;
  if (reg.test(color)) {
    var strHex = "#";
    // 把RGB的3个数值变成数组
    var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    // 转成16进制
    for (var i = 0; i < colorArr.length; i++) {
      var hex = Number(colorArr[i]).toString(16);
      if (hex.length < 2) {
        hex = "0"+hex
      }
      strHex += hex;
    }
    //console.log(strHex)
    return strHex;
  } else {
    return String(color);
  }
}

function colorRgb(hex=String())  {
  // 16进制颜色值的正则
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  var color = hex.toLowerCase();
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      var colorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    var colorChange = [];
    for (var i = 1; i < 7; i += 2) {
      colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
    }
    return "RGB(" + colorChange.join(",") + ")";
  } else {
    return color;
  }
};

module.exports = {
  parsekbRes,
  generateCalendar,
  colorHex,
  colorRgb,
};
