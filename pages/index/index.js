// index.js
// 获取应用实例

import test from "../../test";
import { parsekbRes, generateCalendar } from "../../utils/util";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pagesList: [
      {
        tag: "navigator",
        icon: "iconfont icon-wodekecheng",
        name: "我的课表",
        path: "/pages/accountPage/accountPage",
      },
      {
        tag: "navigator",
        icon: "iconfont icon-gexinghua",
        name: "设置",
        path: "/pages/settingPage/settingPage",
      },
      {
        tag: "navigator",
        icon: "iconfont icon-bangzhu",
        name: "帮助",
        path: "/pages/accountPage/accountPage",
      },
    ],
    canIUseOpenData:
      wx.canIUse("open-data.type.userAvatarUrl") &&
      wx.canIUse("open-data.type.userNickName"), // 如需尝试获取用户信息可改为false

    kbdata: {
      classesInfo: parsekbRes(test.test),
      calendar: generateCalendar(test.firstclass),
    },
    themeColor: app.setting.themeColor,
    frontColor: app.setting.frontColor,
    bgImgPath: app.setting.bgImgPath,
    bgImg: app.setting.bgImg,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.watchSetting(
      ["themeColor", "frontColor"],
      ({ themeColor, frontColor }) =>
        this.setData({
          themeColor: themeColor ? themeColor : app.setting.themeColor,
          frontColor: frontColor ? frontColor : app.setting.frontColor,
        })
    );
    app.watchSetting(
      ["bgImgPath", "bgImg"],
      ({ bgImgPath, bgImg }) => {
        this.setData({
          bgImgPath: bgImgPath ? bgImgPath : app.setting.bgImgPath,
          bgImg: bgImg ? bgImg : app.setting.bgImg,
        });
      },
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarColor({
      frontColor: app.setting.frontColor,
      backgroundColor: app.setting.themeColor,
    });
  },

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
