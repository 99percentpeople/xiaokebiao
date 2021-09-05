// components/InnerTable/InnerTable.js
//Component Object
const app = getApp();

Component({
  properties: {
    classes: Array,
    weeklist: Array,
    nowdate: Number,
    status: Number,
  },

  data: {
    width: 0,
    height: 0,
    xiaoxiaole: false,
    hiddenArr: [],
    jcArrays: [
      "08:30",
      "09:20",
      "10:25",
      "11:15",
      "13:50",
      "14:40",
      "15:30",
      "16:30",
      "17:20",
      "18:30",
      "19:20",
      "20:10",
      "21:00",
    ],
    colorArrays: [
      "#85B8CF",
      "#90C652",
      "#D8AA5A",
      "#FC9F9D",
      "#0A9A84",
      "#61BC69",
      "#12AEF3",
      "#E29AAD",
    ],
  },
  observers: {
    "nowdate,status,xiaoxiaole"() {
      if (this.data.xiaoxiaole) {
        this.hideOutdated();
      } else {
        this.setData({ hiddenArr: [] });
      }
    },
  },
  methods: {
    hideOutdated() {
      switch (this.properties.status) {
        case -1:
          this.setData({
            hiddenArr: Array.from("1".repeat(this.properties.classes.length)),
          });
          break;
        case 0:
          let hiddenArr = new Array(this.properties.classes.length);
          for (let idx in this.properties.classes) {
            let theclass = this.properties.classes[idx];
            let week = this.properties.weeklist[
              theclass.xq == 0 ? 6 : theclass.xq - 1
            ];
            let classdate = Date.parse(
              `${week.y}-${week.m}-${week.d} ${
                this.data.jcArrays[parseInt(theclass.jcdm[0]) - 1]
              }`
            );
            hiddenArr[idx] =
              classdate <= this.properties.nowdate ? true : false;
          }
          this.setData({ hiddenArr });
          break;
        case 1:
        default:
          break;
      }
    },
  },
  lifetimes: {
    attached: function () {
      wx.createSelectorQuery()
        .in(this)
        .select(".table")
        .boundingClientRect((rect) => {
          this.setData({ height: rect.height, width: rect.width });
        })
        .exec();
      app.watchSetting(
        ["xiaoxiaole"],
        ({ xiaoxiaole }) => {
          this.setData({ xiaoxiaole });
        },
        true
      );
    },
  },
});
