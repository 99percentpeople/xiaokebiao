// components/InnerTable/InnerTable.js
//Component Object
import { jcStart } from "../../utils/util";

const app = getApp();

Component({
  properties: {
    classes: Array,
    weeklist: Array,
    nowdate: Number,
    status: Number,
    outerIdx: Number,
  },

  data: {
    width: 0,
    height: 0,
    xiaoxiaole: false,
    hiddenArr: [],
  },
  observers: {
    "nowdate,status"() {
      this.hideOutdated();
    },
  },
  methods: {
    showCardView({ currentTarget }) {
      this.triggerEvent("showcard", {
        innerIdx: currentTarget.dataset.index,
        outerIdx: this.properties.outerIdx,
      });
    },
    hideOutdated() {
      let hiddenArr = new Array(this.properties.classes.length);
      switch (this.properties.status) {
        case -1:
          hiddenArr.fill(true);
          break;
        case 0:
          for (let idx in this.properties.classes) {
            let theclass = this.properties.classes[idx];
            let week = this.properties.weeklist[
              theclass.xq == 0 ? 6 : theclass.xq - 1
            ];
            let classdate = Date.parse(
              `${week.y}-${week.m}-${week.d} ${
                jcStart[parseInt(theclass.jcdm2[0]) - 1]
              }`
            );
            hiddenArr[idx] = classdate < this.properties.nowdate ? true : false;
          }
          break;
        case 1:
        default:
          break;
      }
      this.setData({ hiddenArr });
    },
  },
  lifetimes: {
    attached() {
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
