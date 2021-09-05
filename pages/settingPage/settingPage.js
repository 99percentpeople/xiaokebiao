// pages/settingPage/settingPage.js
import { colorHex, colorRgb } from "../../utils/util";
const app = getApp();

Page({
  data: {
    fontColorchecked: Boolean,
    xiaoxiaolechecked: Boolean,
    slidingdirection:Boolean,
    bgImgchecked: Boolean,
    bgImgPath: String,
    frontColor: String,
    rgb: colorRgb(app.setting.themeColor),
    pick: false,
  },
  toPick: function () {
    // 显示取色器
    this.setData({
      pick: true,
    });
  },
  handleloadImg() {
    var that = this;
    if (this.data.bgImgPath) {
      return;
    }
    wx.chooseImage({
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        wx.saveFile({
          tempFilePath: tempFilePaths[0],
          success(res) {
            const savedFilePath = res.savedFilePath;
            app.setting.bgImgPath = savedFilePath;
            that.setData({ bgImgPath: savedFilePath });
          },
        });
      },
    });
  },
  pickColor({ detail }) {
    //取色结果回调
    app.setting.themeColor = colorHex(detail.color);
    this.setData({ rgb: detail.color });
  },
  fontColorChange({ detail }) {
    app.setting.frontColor = detail ? "#000000" : "#ffffff";
    this.setData({
      fontColorchecked: detail,
      frontColor: detail ? "#000000" : "#ffffff",
    });
  },
  xiaoxiaoleChanged({ detail }) {
    app.setting.xiaoxiaole = detail;
    this.setData({ xiaoxiaole: detail });
  },
  bgImgChanged({ detail }) {
    app.setting.bgImg = detail;
    this.setData({ bgImgchecked: detail });
  },
  slidingdirectionChanged({detail}){
      app.setting.slidingdirection=detail;
      this.setData({slidingdirection:detail})
  },
  handleDel() {
    wx.getSavedFileList({
      success(res) {
        if (res.fileList.length > 0) {
          res.fileList.forEach((file) => {
            wx.removeSavedFile({
              filePath: file.filePath,
            });
          });
        }
      },
    });
    this.setData({ bgImgPath: "" });
    app.setting.bgImgPath = "";
  },
  onLoad: function (options) {
    this.setData({
      rgb: colorRgb(app.setting.themeColor),
      fontColorchecked: app.setting.frontColor == "#000000" ? true : false,
      bgImgPath: app.setting.bgImgPath,
      bgImgchecked: app.setting.bgImg,
      frontColor: app.setting.frontColor,
      xiaoxiaole: app.setting.xiaoxiaole,
      slidingdirection: app.setting.slidingdirection,
    });
    wx.setNavigationBarColor({
      frontColor: app.setting.frontColor, // 必写项【该字体颜色仅支持 #ffffff 和 #000000 】
      backgroundColor: app.setting.themeColor, // 传递的颜色值【仅支持有效值为十六进制颜色】
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
