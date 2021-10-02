// pages/settingPage/settingPage.js
import { colorHex, colorRgb } from "../../utils/color";
import { globalData, colorArrays } from "../../utils/util";
const app = getApp();

Page({
  data: {
    colorArrays,
    colorList: new Array(colorArrays.length),
    fontColorchecked: Boolean,
    xiaoxiaolechecked: Boolean,
    slidingdirection: Boolean,
    bgImgchecked: Boolean,
    bgImgPath: String,
    frontColor: String,
    fullscreenImgChecked: Boolean,
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
      wx.previewImage({
        urls: [this.data.bgImgPath],
        current: this.data.bgImgPath,
      });
      return;
    }
    wx.chooseImage({
      count: 1,
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
  onChooseColor({ target }) {
    let colorList = new Array(colorArrays.length);
    colorList[target.dataset.index] = true;
    this.setData({rgb:colorRgb(colorArrays[target.dataset.index]), colorList });
    app.setting.themeColor=colorArrays[target.dataset.index]
  },
  initData() {
    this.setData({
      rgb: colorRgb(app.setting.themeColor),
      fontColorchecked: app.setting.frontColor == "#000000" ? true : false,
      bgImgPath: app.setting.bgImgPath,
      bgImgchecked: app.setting.bgImg,
      frontColor: app.setting.frontColor,
      xiaoxiaole: app.setting.xiaoxiaole,
      slidingdirection: app.setting.slidingdirection,
      fullscreenImgChecked: app.setting.fullscreenImg,
    });
  },
  pickColor({ detail }) {
    //取色结果回调
    app.setting.themeColor = colorHex(detail.color);
    this.setData({ rgb: detail.color,colorList: new Array(colorArrays.length) });
  },
  fontColorChange({ detail }) {
    app.setting.frontColor = detail ? "#000000" : "#ffffff";
    this.setData({
      fontColorchecked: detail,
      frontColor: detail ? "#000000" : "#ffffff",
    });
  },
  fullscreenImgChanged({ detail }) {
    app.setting.fullscreenImg = detail;
    this.setData({ fullscreenImgChecked: detail });
  },
  xiaoxiaoleChanged({ detail }) {
    app.setting.xiaoxiaole = detail;
    this.setData({ xiaoxiaole: detail });
  },
  bgImgChanged({ detail }) {
    app.setting.bgImg = detail;
    this.setData({ bgImgchecked: detail });
  },
  slidingdirectionChanged({ detail }) {
    app.setting.slidingdirection = detail;
    this.setData({ slidingdirection: detail });
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
    app.setting.bgImgPath = "";
    this.setData({ bgImgPath: "" });
  },
  handleInit() {
    wx.showModal({
      title: "提示",
      content: "确定要初始化设置吗，账号和密码都会被删除",
      success: (res) => {
        if (res.confirm) {
          this.handleDel();
          wx.clearStorage({
            success: (res) => {
              Object.entries(new globalData()._setting).forEach(
                ([key, val]) => {
                  app.setting[key.substr(1)] = val;
                }
              );
              this.initData();
              wx.setStorage({
                key: "data_status",
                data: "none",
                success: () => {
                  wx.navigateBack({});
                },
              });
            },
          });
        }
      },
    });
  },
  onLoad: function (options) {
    this.initData();
    wx.setNavigationBarColor({
      frontColor: app.setting.frontColor, // 必写项【该字体颜色仅支持 #ffffff 和 #000000 】
      backgroundColor: app.setting.themeColor, // 传递的颜色值【仅支持有效值为十六进制颜色】
    });
    let index = colorArrays.findIndex(x=>x==app.setting.themeColor);
    if (index != -1) {
      let colorList = new Array(colorArrays.length);
      colorList[index] = true;
      this.setData({ colorList });
    }
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
