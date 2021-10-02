// components/ClassTable/ClassTable.js
//Component Object
import { generateCalendar, parsekbRes, getThisWeek } from "../../utils/jxfw";
import { classesInfo, colorArrays } from "../../utils/util";
const app = getApp();
Component({
  properties: {
    fullscreenImg: Boolean,
    bgImg: Boolean,
  },
  data: {
    swiperCurrent: 0,
    currentzc: 0,
    showCard: false,
    slidingdirection: false,
    nowdate: Date.now(),
    tabbarActive: 0,
    classesInfo: parsekbRes(wx.getStorageSync("data")),
    calendar: generateCalendar(wx.getStorageSync("rq")),
    colorArrays,
  },
  methods: {
    onChooseColor({ target }) {
      let idx = target.dataset.index;
      let kcmc = this.data.classesInfo[this.data.chooseidx[0]][
        this.data.chooseidx[1]
      ].kcmc;
      let classInfo = wx.getStorageSync("data");
      for (let item of classInfo) {
        if (item.kcmc == kcmc) {
          item.color = this.data.colorArrays[idx];
          break;
        }
      }
      wx.setStorage({
        key: "data",
        data: classInfo,
        success: () => {
          this.setData({
            classesInfo: parsekbRes(classInfo),
          });
          wx.showToast({
            title: "设置成功",
            icon: "success",
          });
        },
      });
    },

    showDefault() {
      this.setData({
        classesInfo,
        calendar: [getThisWeek()],
      });
    },
    handleSwiperChange({ detail }) {
      wx.setNavigationBarTitle({
        title: `第${detail.current + 1}周`,
      });
      this.setData({
        swiperCurrent: detail.current,
      });
    },
    onTabBarChange({ detail }) {
      this.setData({ tabbarActive: detail });
    },
    showCard({ detail }) {
      this.setData({
        card: {
          ...this.data.classesInfo[detail.outerIdx][detail.innerIdx],
        },
        chooseidx: [detail.outerIdx, detail.innerIdx],
        tabbarActive: 0,
        showCard: true,
      });
    },
    refresh() {
      for (let idx in this.data.calendar) {
        let f = this.data.calendar[idx][0];
        let l = this.data.calendar[idx][this.data.calendar[idx].length - 1];
        let stt = Date.parse(`${f.y}-${f.m}-${f.d} 00:00`);
        let ett = Date.parse(`${l.y}-${l.m}-${l.d} 24:00`);
        let ntt = this.data.nowdate;
        if (stt <= ntt && ett > ntt) {
          this.setData({
            swiperCurrent: idx,
            currentzc: idx,
          });
          break;
        }
      }
    },
    onClose() {
      this.setData({ showCard: false });
    },
  },

  lifetimes: {
    attached: function () {
      getApp().watchSetting(
        ["bgImg"],
        ({ bgImg }) => {
          this.setData({ bgImg });
        },
        true
      );
      getApp().watchSetting(
        ["fullscreenImg"],
        ({ fullscreenImg }) => {
          this.setData({ fullscreenImg });
        },
        true
      );
      app.watchSetting(
        ["slidingdirection"],
        ({ slidingdirection }) => {
          this.setData({ slidingdirection });
        },
        true
      );
      if (!this.data.classesInfo.length) {
        this.showDefault();
      }
      this.refresh();
    },
  },
  pageLifetimes: {
    show() {
      this.setData({
        nowdate: Date.now(),
      });
      wx.getStorage({
        key: "data_status",
        success: ({ data }) => {
          if (data == "update") {
            this.setData({
              classesInfo: parsekbRes(wx.getStorageSync("data")),
              calendar:generateCalendar(wx.getStorageSync("rq"))
            });            
          } else if (data == "none"||!data) {
            this.showDefault();
          }
          wx.setStorageSync('data_status',"default" )
          this.refresh();
        },
      });
    },
  },
});
