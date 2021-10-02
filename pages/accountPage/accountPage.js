// pages/accountPage/accountPage.js
import { Event } from "../../utils/gevent";
const app = getApp();
import { request, downloadFile } from "../../utils/request";
import {
  getclasseslist,
  login,
  getfirstDay,
  changeVerifyCode,
  kbdistinguishtimeperiods,
} from "../../utils/jxfw";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    datenow: Date.now(),
    tmpPath: "",
    edituser: false,
    islogged: false,
    account: "",
    pwd: "",
    showdlg: false,
    verifycode: "",
    w: ["日", "一", "二", "三", "四", "五", "六"],
    classList:[]
  },


  onClickIcon() {
    wx.showModal({
      title: "提示",
      content: "登录密码为教务管理系统的密码",
      showCancel: false,
    });
  },
  onShowDlg() {
    this.setData({ showdlg: true });
  },
  onUpdate() {
    wx.showLoading({
      title: "正在获取课表",
    });
    this.setData({ islogged: false });
    getclasseslist()
      .then((res) => {
        wx.setStorage({
          key: "data",
          data: res,
          success() {},
          fail() {
            wx.hideLoading({});
            wx.showToast({
              title: "课表保存失败",
              icon: "error",
            });
          },
        });
      })
      .then((res) => {
        return getfirstDay();
      })
      .then((res) => {
        wx.setStorage({
          key: "rq",
          data: res,
          success() {
            wx.showToast({
              title: "获取课表成功",
            });
            wx.setStorage({
              key:"data_status",
              data:"update",
              success:()=>{
                wx.navigateBack({})
              }
            })
          },
          fail() {
            wx.showToast({
              title: "日期保存失败",
              icon: "error",
            });
          },
        });
      })
      .catch((err) => {
        wx.showToast({
          title: "发生错误",
          icon: "error",
        });
      });
  },
  onSubmit() {
    wx.showLoading({title:"登录中"})
    login(this.data.account, this.data.pwd, this.data.verifycode)
      .then((res) => {
        if (this.data.edituser) {
          app.setting.account = this.data.account;
          app.setting.pwd = this.data.pwd;
        }
        wx.showToast({
          title: res,
          icon: "success",
        });
        this.setData({ islogged: true });
        this.onUpdate();
      })
      .catch((err) => {
        wx.showToast({
          title: err,
          icon: "error",
        });
      })
      .finally(() => {
        this.onChange();
      });
  },
  onModify() {
    wx.showModal({
      title: "提示",
      content: "您确定要重新设置账号吗？",
      success: (res) => {
        if (res.confirm) {
          this.onChange();
          app.setting.account = "";
          app.setting.pwd = "";
          this.setData({
            account: "",
            pwd: "",
          });
        }
      },
    });
  },
  onChange() {
    this.setData({ tmpPath: "" });
    changeVerifyCode()
      .then((res) => {
        this.setData({ tmpPath: res, verifycode: "" });
      })
      .catch((err) => {
        wx.showToast({
          title: "获取验证码失败",
          icon: "error",
        });
      });
  },
  onLoad(options) {
    wx.setNavigationBarColor({
      frontColor: getApp().setting.frontColor,
      backgroundColor: getApp().setting.themeColor,
    });
    getApp().watchSetting(
      ["account", "pwd"],
      ({ account, pwd }) => {
        this.setData({
          edituser: !getApp().setting.account || !getApp().setting.pwd,
        });
        this.setData({
          account: account ? account : this.data.account,
          pwd: pwd ? pwd : this.data.pwd,
        });
      },
      true
    );
  },
  onReady(){
  },
  onShow: function () {
    if (this.data.edituser) {
      this.onChange();
    }
    wx.getStorage({
      key: "data_status",
      success: ({ data }) => {
        if (data == "default"||data == "update") {
          this.setData({classList:wx.getStorageSync('data')})
        }
      },
    });
  },
});
