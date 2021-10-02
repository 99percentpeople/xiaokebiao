// pages/achievementPage/achievementPage.js
import { getreport } from "../../utils/jxfw";
import { items } from "../../utils/util";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showDlg: false,
    reportData: [],
    showData: [],
    isLoading: true,
    switch1: true,
    switch2: false,
    pjjd: 0,
    list: [
      "大一上",
      "大一下",
      "大二上",
      "大二下",
      "大三上",
      "大三下",
      "大四上",
      "大四下",
    ],
    result: [],
  },
  updatepjjd() {
    let fz = 0;
    let fm = 0;

    this.data.showData.forEach((item) => {
      fz += parseFloat(item.cjjd) * parseFloat(item.xf);
      fm += parseFloat(item.xf);
    });

    this.setData({ pjjd: Math.floor(fz / fm * 10000) / 10000 });
  },

  onCheckChange(event) {
    this.setData({
      result: event.detail,
    });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  onSort(data) {
    let newdata = data.sort((a, b) => {
      return b.cjjd - a.cjjd;
    });
    return newdata;
  },
  electiveCourse(data) {
    let newdata = data.filter((item) => {
      return !(item.xdfsmc == "选修");
    });
    return newdata;
  },
  selectxq(){
    let data = wx.getStorageSync("report_data").filter((item1) => {
      return this.data.result.find((item2) => {
        return item1.xq == item2;
      });
    });
    this.setData({ reportData: data });
    this.selectdata();
  },
  selectdata() {
    this.setData({ isLoading: true });
    return new Promise((resolve, reject) => {
      let data = this.data.reportData;
      if (this.data.switch1) {
      } else {
        data = this.electiveCourse(data);
      }
      if (this.data.switch2) {
        data = this.onSort(data);
      }
      this.setData({ showData: data });
      this.updatepjjd();
      return resolve();
    }).finally(() => {
      this.setData({ isLoading: false });
    });
  },

  onSwitch1Change({ detail }) {
    this.setData({ switch1: detail });
  },

  onSwitch2Change({ detail }) {
    this.setData({ switch2: detail });
  },
  onShowDlg(e) {
    this.setData({ showDlg: true });
  },
  onUpdateReport() {
    wx.showLoading({
      title: "正在查询成绩",
    });
    getreport()
      .then((res) => {
        let xn = res[0].xnxqdm.substr(0, 4);
        let idx = 0;
        const xqarr = ["大一", "大二", "大三", "大四"];
        let yn= new Date().getFullYear()
        res.map((item) => {
          let y = item.xnxqdm.substr(0, 4);
          let s = item.xnxqdm.substr(4, 2);
          if (y != xn) {
            xn = y;
            idx++;
          }
          item.xq = `${xqarr[idx]}${s == 1 ? "上" : "下"}`;
          return item;
        });
        //console.log(res);
        wx.setStorage({
          key: "report_data",
          data: res,
          success: () => {
            this.setData({ reportData: res, showData: res });
            this.updatepjjd();
            wx.showToast({
              title: "查询成绩成功",
              icon: "success",
            });
          },
        });
      })
      .catch((err) => {
        wx.showToast({
          title: err,
          icon: "error",
        });
      })
      .finally(() => {
        wx.hideLoading({});
      });
  },
  reSetReport() {
    wx.getStorage({
      key: "report_data",
      success: ({ data }) => {
        this.setData({ reportData: data, showData: data });
        this.updatepjjd();
      },
      complete: () => {
        this.setData({ isLoading: false });
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reSetReport();
    wx.setNavigationBarColor({
      frontColor: getApp().setting.frontColor,
      backgroundColor: getApp().setting.themeColor,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
