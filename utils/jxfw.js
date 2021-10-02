import CryptoJS from "crypto-js";
import { request, downloadFile } from "./request";
import { colorArrays, jcStart, jcEnd } from "./util";

function changeVerifyCode() {
  return downloadFile({
    url: `https://jxfw.gdut.edu.cn/yzm`,
    data: {
      d: Date.now(),
    },
    header: {
      "content-type": "application/x-www-form-urlencoded",
    },
  }).then((res) => {
    return res.tempFilePath;
  });
}

function generatenewclasslist(newclass, alldata) {
  let idx = alldata.findIndex((i) => i.kcmc == newclass.kcmc);
  if (idx==-1) {
    newclass.sjd.forEach((sj) => {
      sj.zc.forEach((zc) => {
        sj.detail.push({
          zc,
        });
      });
    });
    alldata.push(newclass)
    return alldata
  }else{
    newclass.sjd.forEach(sj=>{
      let newclassdetail=[]
      sj.zc.forEach(zc=>{
        let res=sj.detail.find(each=>{
          return each.zc==zc
        })
        if(!res){
          res={
            zc
          }
        }
        newclassdetail.push(res)
      })
      sj.detail=newclassdetail
    })
    alldata[idx]=newclass
    return alldata
  }
}

function getnowxnxqdm() {
  let date = new Date();
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  let s = m > 8 && m < 2 ? "02" : "01";
  let xn = s == "02" && m < 2 ? y - 1 : y;
  return `${xn}${s}`;
}
function encrypt(verifycode, password) {
  var key = CryptoJS.enc.Utf8.parse(
    verifycode + verifycode + verifycode + verifycode
  );
  var srcs = CryptoJS.enc.Utf8.parse(password);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  password = encrypted.ciphertext.toString();
  return password;
}

function login(account, pwd, verifycode) {
  return request({
    url: "https://jxfw.gdut.edu.cn/new/login",
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: {
      account,
      pwd: encrypt(verifycode, pwd),
      verifycode,
    },
  }).then(({ data }) => {
    return new Promise((resolve, reject) => {
      if (data.code < 0) {
        return reject(data.message);
      } else {
        return resolve(data.message);
      }
    });
  });
}

function getreport() {
  return request({
    url: "https://jxfw.gdut.edu.cn/xskccjxx!getDataList.action",
    header: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: {
      xnxqdm: "",
      jhlxdm: "",
      page: "1",
      rows: "10000",
      sort: "xnxqdm",
      order: "asc",
    },
  }).then((res) => {
    return res.data.rows;
  });
}

function kbdistinguishtimeperiods(data) {
  let classarr = new Array();
  data.forEach((eachclass) => {
    let itemi = classarr.find((item) => {
      item.kcmc == eachclass.kcmc;
    });
    if (!itemi) {
      itemi =
        classarr[
          classarr.push({
            ...eachclass,
            sjd: [],
          }) - 1
        ];
      itemi.classInfo = undefined;
    }
    eachclass.classInfo.forEach((i) => {
      let itemj = itemi.sjd.find((each) => {
        return (
          each.xq == i.xq &&
          each.jcdm2 == i.jcdm2 &&
          each.teaxms == i.teaxms &&
          each.zdjxcdmc == i.zdjxcdmc
        );
      });
      if (!itemj) {
        itemj =
          itemi.sjd[
            itemi.sjd.push({
              xq: i.xq,
              jcdm2: i.jcdm2,
              teaxms: i.teaxms,
              zdjxcdmc: i.zdjxcdmc,
              zc: [],
              detail: [],
            }) - 1
          ];
      }
      itemj.zc.push(i.zc);
      itemj.detail.push(i);
    });
  });
  return classarr;
}

function getfirstDay() {
  return request({
    url: "https://jxfw.gdut.edu.cn/xsgrkbcx!getQxkbDataList.action",
    header: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: {
      xnxqdm: getnowxnxqdm(),
      xqdm: 1,
      zc: 1,
      xq: 1,
      kcdm: "",
      kkyxdm: "",
      kkjysdm: "",
      jcdm: "",
      gnqdm: "",
      rq: "",
      jzwdm: "",
      kcrwdm: "",
      teaxm: "",
      jhlxdm: "",
      "queryParams[primarySort]": "dgksdm asc",
      page: 1,
      rows: 1,
      sort: "kxh",
      order: "asc",
    },
  }).then((res) => {
    return res.data.rows[0].pkrq;
  });
}

function getclasseslist() {
  let classList = [];

  return request({
    url: "https://jxfw.gdut.edu.cn/xskktzd!getDataList.action",
    header: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: {
      xnxqdm: getnowxnxqdm(),
      rows: "10000",
    },
  }).then((res) => {
    classList = res.data.rows;
    let promiseArr = [];
    for (let [idx, val] of res.data.rows.entries()) {
      val.color = colorArrays[idx % (colorArrays.length - 1)];
      promiseArr.push(
        request({
          url: "https://jxfw.gdut.edu.cn/xskktzd!getZhouli.action",
          header: {
            "content-type": "application/x-www-form-urlencoded",
          },
          data: {
            kcrwdm: val.kcrwdm,
            page:1,
            rows: "10000",
          },
        })
      );
    }
    return Promise.all(promiseArr).then((resArr) => {
      for (let [idx, val] of classList.entries()) {
        val.classInfo = resArr[idx].data.rows;
      }
      return kbdistinguishtimeperiods(classList);
    });
  });
}

function getDate(datestr) {
  let temp = datestr.split("-");
  let date = new Date(temp[0], temp[1] - 1, temp[2]);
  return date;
}

function generateCalendar(rq) {
  if (!rq) {
    return;
  }
  let dates = [];
  let startTime = getDate(rq);
  for (let i = 0; i < 22; ++i) {
    let week = [];
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

function parsekbRes(rowkb) {
  let kbarr = new Array();
  for (let i of rowkb) {
    i.sjd.forEach((sj) => {
      for (let j of sj.detail) {
        let zc = j.zc - 1;
        j.jcdm2 = sj.jcdm2.split(",");
        j.teaxms = sj.teaxms;
        j.zdjxcdmc = sj.zdjxcdmc
        j.xq = sj.xq>0?sj.xq:7;
        j.color = i.color;
        j.sksj = `${jcStart[j.jcdm2[0] - 1]}-${
          jcEnd[j.jcdm2[j.jcdm2.length - 1] - 1]
        }`;
        if(j.sknrjj){
          j.sknrjj = j.sknrjj.replace(/&.+?;/g, "");
        }
        j.kcmc = i.kcmc;
        j.jxbmc = i.jxbmc.split(",");
        j.xf = i.xf;
        if (!kbarr[zc]) {
          kbarr[zc] = new Array();
        }
        kbarr[zc].push(j);
      }
    });
  }
  return kbarr;
}

function getThisWeek() {
  var st = new Date(),
    day = st.getDay(),
    date = st.getDate();
  if (day == 0) st.setDate(date - 6);
  else st.setDate(date - day + 1);
  let week = [];
  for (let j = 0; j < 7; ++j) {
    let y = st.getFullYear().toString();
    let m = st.getMonth() + 1;
    m = m < 10 ? "0" + m : m + "";
    let d = st.getDate();
    d = d < 10 ? "0" + d : d + "";
    week.push({ y, m, d, w: st.getDay() });
    st.setDate(st.getDate() + 1);
  }
  return week;
}
export {
  login,
  parsekbRes,
  encrypt,
  getclasseslist,
  generateCalendar,
  changeVerifyCode,
  kbdistinguishtimeperiods,
  generatenewclasslist,
  getreport,
  getThisWeek,
  getfirstDay,
};
