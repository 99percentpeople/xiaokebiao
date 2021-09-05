// app.js
//app.js

App({
  globalData: {
    _setting: {
      _themeColor: "#DCDCDC",
      _frontColor: "#000000",
      _bgImg: false,
      _bgImgPath: "",
      _slidingdirection: true,
      _xiaoxiaole: true,
      _account: {
        _username: "",
        _password: "",
      },
    },
    _methods: {},
  },
  //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
  onLaunch: function (options) {
    let that = this;
    try {
      let value = wx.getStorageSync("_setting");
      if (value) {
        this.globalData._setting = value;
      }
    } catch (e) {
      // Do something when catch error
    }
    Object.defineProperty(this, "setting", {
      get() {
        return this.globalData._setting;
      },
      set(value) {
        this.globalData._setting = value;
      },
    });

    this.watchSetting(
      Object.keys(this.setting).map((currentValue) => currentValue.substr(1)),
      (params) => wx.setStorage({ key: "_setting", data: this.setting })
    );

    this.watchSetting(
      ["themeColor", "frontColor"],
      ({ themeColor, frontColor }) => {
        wx.setNavigationBarColor({
          frontColor: frontColor ? frontColor : this.setting.frontColor, // 必写项【该字体颜色仅支持 #ffffff 和 #000000 】
          backgroundColor: themeColor ? themeColor : this.setting.themeColor, // 传递的颜色值【仅支持有效值为十六进制颜色】
          animation: {
            duration: 200,
            timingFunc: "easeIn",
          },
        });
      },
      true
    );
  },
  onShow: function (options) {},
  onHide: function () {},
  onError: function (msg) {},
  //options(path,query,isEntryPage)
  onPageNotFound: function (options) {},
  watchSetting: function (sets = Array(), method, execute = Boolean()) {
    let that = this;
    let setting = that.setting;
    let handle = [];
    sets.forEach((set) => {
      if (
        !Object.getOwnPropertyDescriptor(
          that.globalData._methods,
          `_methods_${set}`
        )
      ) {
        Object.defineProperty(that.globalData._methods, `_methods_${set}`, {
          value: [],
        });
      }

      if (method) {
        handle.push(
          Object.getOwnPropertyDescriptor(
            that.globalData._methods,
            `_methods_${set}`
          ).value.push(method)
        );
      }

      if (!Object.getOwnPropertyDescriptor(setting, `${set}`)) {
        Object.defineProperty(setting, `${set}`, {
          configurable: true,
          set: function (value) {
            Object.defineProperty(setting, `_${set}`, { value });

            let params = {};
            Object.defineProperty(params, `${set}`, { value });
            Object.getOwnPropertyDescriptor(
              that.globalData._methods,
              `_methods_${set}`
            ).value.forEach((method) => method(params));
          },
          get: function () {
            return Object.getOwnPropertyDescriptor(setting, `_${set}`).value;
          },
        });
      }
    });

    if (execute) {
      let params = {};
      sets.forEach((set) =>
        Object.defineProperty(params, set, {
          value: Object.getOwnPropertyDescriptor(setting, `_${set}`).value,
        })
      );
      method(params);
    }
    return handle;
  },
});
