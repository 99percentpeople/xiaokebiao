// index.js
// 获取应用实例
import {navOpt} from "../../utils/util"

const app = getApp();
Page({
  data: {
    navOpt,
    canIUseOpenData:
      wx.canIUse("open-data.type.userAvatarUrl") &&
      wx.canIUse("open-data.type.userNickName"), // 如需尝试获取用户信息可改为false
    fullscreenImg: app.setting.fullscreenImg,
    bgImg: app.setting.bgImg,
    style: `
    --themeColor: ${app.setting.themeColor};
    --frontColor: ${app.setting.frontColor};
    --bgImgPath : url(${app.setting.bgImgPath});
    `,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.watchSetting(
      ["themeColor", "frontColor","bgImgPath"],
      () =>
        this.setData(
          {
            style: `
          --themeColor: ${app.setting.themeColor};
          --frontColor: ${app.setting.frontColor};
          --bgImgPath : url(${app.setting.bgImgPath});
          `
          },
        )
    );

    app.watchSetting(
      [ "bgImg", "fullscreenImg"],
      () => {
        this.setData({
          bgImg: app.setting.bgImg,
          fullscreenImg: app.setting.fullscreenImg,
        });
      }
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
