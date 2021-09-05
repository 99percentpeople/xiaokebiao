// components/ClassTable/ClassTable.js
//Component Object
const app = getApp();
Component({
  properties: {
    kbdata: Object,
  },
  data: {
    swiperCurrent: 0,
    currentzc: 0,
    slidingdirection: Boolean,
    nowdate: Date.now(),
  },
  methods: {
    handleSwiperChange({ detail }) {
      this.setData({
        swiperCurrent: detail.current,
      });
    },
  },
  lifetimes: {
    attached: function () {
      app.watchSetting(
        ["slidingdirection"],
        ({ slidingdirection }) => {
          this.setData({ slidingdirection });
        },
        true
      );
      for (let idx in this.properties.kbdata.calendar) {
        let f = this.properties.kbdata.calendar[idx][0];
        let l = this.properties.kbdata.calendar[idx][
          this.properties.kbdata.calendar[idx].length - 1
        ];
        let stt = Date.parse(`${f.y}-${f.m}-${f.d}`);
        let ett = Date.parse(`${l.y}-${l.m}-${l.d}`);
        let ntt = this.data.nowdate;
        if (stt <= ntt && ett >= ntt) {
          this.setData({
            swiperCurrent: idx,
            currentzc: idx,
          });
          break;
        }
      }
    },

    ready: function () {},
    moved: function () {},
    detached: function () {},
  },
  pageLifetimes:{
    show(){
      this.setData({
        nowdate:Date.now()
      })
    }
  },
});
