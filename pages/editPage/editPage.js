// pages/editPage/editPage.js
import { generatenewclasslist } from "../../utils/jxfw";
import { colorArrays } from "../../utils/util";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    w: ["日", "一", "二", "三", "四", "五", "六"],
    colorArrays,
    thisclass: {},
    show: false,
    show_page: "",
    list: [],
    idx: 0,
    colorlist: [],
    jcslectstart: false,
    isedit:false
  },

  onkcmc({ detail }) {
    this.setData({ "thisclass.kcmc": detail });
  },
  onxf({ detail }) {
    this.setData({ "thisclass.xf": detail });
  },
  onjxbmc({ detail }) {
    this.setData({ "thisclass.jxbmc": detail });
  },
  InitColor() {
    let idx = this.data.colorArrays.findIndex(
      (e) => e == this.data.thisclass.color
    );
    if (idx == -1) {
      return;
    } else {
      let colorlist = new Array(this.data.colorArrays.length).fill(false);
      colorlist[idx] = true;
      this.setData({ colorlist });
    }
  },
  onChooseColor({ target }) {
    let idx = target.dataset.index;
    let colorlist = new Array(this.data.colorArrays.length).fill(false);
    colorlist[idx] = true;
    let thisclass = this.data.thisclass;
    thisclass.color = this.data.colorArrays[idx];
    this.setData({ colorlist, thisclass });
  },
  onzc({ target }) {
    let list = new Array(22).fill(false);
    this.data.thisclass.sjd[target.dataset.index].zc.forEach((z) => {
      list[z - 1] = true;
    });
    this.setData({
      show: true,
      show_page: "zc",
      list,
      idx: target.dataset.index,
    });
  },
  onxq({ target }) {
    let list = new Array(7).fill(false);
    list[this.data.thisclass.sjd[target.dataset.index].xq] = true;
    this.setData({
      show: true,
      show_page: "xq",
      list,
      idx: target.dataset.index,
    });
  },
  onjc({ target }) {
    let list = new Array(12).fill(false);
    let jcdm = this.data.thisclass.sjd[target.dataset.index].jcdm2.split(",");
    jcdm.forEach((jc) => {
      list[jc - 1] = true;
    });
    this.setData({
      show: true,
      show_page: "jc",
      list,
      idx: target.dataset.index,
    });
  },
  onzdjxcdmc({ detail, target }) {
    let thisclass = this.data.thisclass;
    let idx = target.dataset.index;
    thisclass.sjd[idx].zdjxcdmc = detail;
    this.setData({ thisclass });
  },
  onteaxms({ detail, target }) {
    let thisclass = this.data.thisclass;
    let idx = target.dataset.index;
    thisclass.sjd[idx].teaxms = detail;
    this.setData({ thisclass });
  },
  onDel({ target }) {
    wx.showModal({
      title: "确定要删除吗？",
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          let thisclass = this.data.thisclass;
          let idx = target.dataset.index;
          thisclass.sjd.splice(idx, 1);
          this.setData({ thisclass });
        }
      },
    });
  },
  onAdd() {
    let thisclass = this.data.thisclass;
    thisclass.sjd.push({
      detail: [],
      xq: "",
      teaxms: "",
      zdjxcdmc: "",
      jcdm2: "",
      zc: [],
    });
    this.setData({ thisclass });
  },
  onzcbtn({ target }) {
    let idx = target.dataset.index;
    let list = this.data.list;
    list[idx] = !list[idx];
    this.setData({ list });
  },
  onxqbtn({ target }) {
    let idx = target.dataset.index;
    let list = new Array(7).fill(false);
    list[idx] = true;
    this.setData({ list });
  },
  onjcbtn({ target }) {
    let list = new Array(12).fill(false);
    let idx = target.dataset.index;
    if (this.data.jcslectstart == false) {
      list[idx] = true;
      this.setData({ jcslectstart: true });
    } else {
      let start = this.data.list.indexOf(true);
      let length = Math.abs(idx - start) + 1;
      list.splice(
        Math.min(start, idx),
        length,
        ...new Array(length).fill(true)
      );
      this.setData({ jcslectstart: false });
    }
    this.setData({ list });
  },

  onbtnok() {
    this.setData({ show: false });
    let thisclass = this.data.thisclass;
    switch (this.data.show_page) {
      case "zc": {
        thisclass.sjd[this.data.idx].zc.length = 0;
        for (let [idx, val] of this.data.list.entries()) {
          let zc = idx + 1;
          val ? thisclass.sjd[this.data.idx].zc.push(zc.toString()) : null;
        }
        break;
      }
      case "xq": {
        for (let [idx, val] of this.data.list.entries()) {
          if (val) {
            thisclass.sjd[this.data.idx].xq = idx;
            break;
          }
        }
        break;
      }
      case "jc": {
        if (this.data.jcslectstart) {
          this.setData({ jcslectstart: false });
          return;
        }
        let jcdmarr = [];
        for (let [idx, val] of this.data.list.entries()) {
          let jc = idx + 1;
          jc = jc < 10 ? "0" + jc : jc;
          val ? jcdmarr.push(jc) : null;
        }
        thisclass.sjd[this.data.idx].jcdm2 = jcdmarr.join(",");
        break;
      }
    }
    this.setData({ thisclass });
  },
  onClose() {
    this.setData({ show: false,jcslectstart:false });
  },
  onDelClass() {
    wx.showModal({
      title: "确定要删除这门课程吗？",
      success: (res) => {
        if (res.confirm) {
          let data = wx.getStorageSync("data");
          let idx = data.findIndex((ele) => {
            return ele.kcmc == this.data.thisclass.kcmc;
          });
          if (idx == -1) {
            wx.showToast({
              title: "删除失败",
              icon: "error",
            });
          } else {
            data.splice(idx, 1);
            wx.setStorageSync("data", data);
            wx.setStorageSync("data_status", "update");
            wx.navigateBack({
              success: () => {
                wx.showToast({
                  title: "删除成功",
                  icon: "success",
                });
              },
            });
          }
        }
      },
    });
  },
  onSubmit() {
    if (!this.data.thisclass.kcmc) {
      wx.showToast({
        title: "课程名称为空",
        icon: "error",
      });
      return;
    }
    if (!this.data.thisclass.sjd.length) {
      wx.showToast({
        title: "至少一个时间段",
        icon: "error",
      });
      return;
    }
    for (let sj of this.data.thisclass.sjd) {
      if (!sj.zc.length) {
        wx.showToast({
          title: "周次不能为空",
          icon: "error",
        });
        return;
      }
    }
    let data = wx.getStorageSync("data");
    let res = generatenewclasslist(this.data.thisclass, data);
    wx.setStorageSync("data", res);
    wx.setStorageSync("data_status", "update");
    wx.navigateBack({
      success:()=>{
        wx.showToast({
          title: "保存成功",
          icon: "success",
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ kcmc }) {
    wx.setNavigationBarColor({
      frontColor: getApp().setting.frontColor,
      backgroundColor: getApp().setting.themeColor,
    });
    if (kcmc) {
      let res = wx.getStorageSync("data").find((each) => {
        return each.kcmc == kcmc;
      });
      this.setData({
        thisclass: res,
        isedit:true
      });
    } else {
      this.setData({
        thisclass: {color:this.data.colorArrays[0], kcmc: "", xf: "", jxbmc: "", sjd: [] },
      });
    }
  },
  onShow() {
    this.InitColor();
  },
});
