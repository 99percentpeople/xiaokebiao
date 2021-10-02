// components/LoginDlg/LoginDlg.js
import { changeVerifyCode, login } from "../../utils/jxfw";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
  },
  data: {
    showDlg: false,
    account: "",
    pwd: "",
    tempFilePath: "",
    verifyCode: "",
  },
  observers: {
    show(newval) {
      if (newval) {
        if (!getApp().setting.account || !getApp().setting.pwd) {
          wx.showToast({
            title: "请先登录",
            icon: "error",
          });
          this.triggerEvent("loginerr");
        } else {
          this.setData({
            account: getApp().setting.account,
            pwd: getApp().setting.pwd,
          });
          this.setData({ showDlg: true });
          this.onChange();
        }
      }
    },
  },

  methods: {
    onSubmit() {
      login(this.data.account, this.data.pwd, this.data.verifyCode)
        .then((res) => {
          wx.showToast({
            title: res,
            icon: "success",
          });
          this.triggerEvent("newlogin");
        })
        .catch((err) => {
          wx.showToast({
            title: err,
            icon: "error",
          });
        });
    },
    onChange() {
      changeVerifyCode()
        .then((res) => {
          this.setData({ tempFilePath: res, verifyCode: "" });
        })
        .catch((err) => {
          wx.showToast({
            title: "获取验证码失败",
            icon: "error",
          });
        });
    },
  },
});
