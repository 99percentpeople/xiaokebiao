// components/DateBar/DateBar.js
Component({
  properties: {
    nowdate: Number,
    weeklist: Array,
  },
  observers: {
    "nowdate,weeklist"() {
      this.setData({ weeknow: 0 });
      this.findToday();
    },
  },
  data: {
    date: {},
    weeknow: 0,
    w: ["日", "一", "二", "三", "四", "五", "六"],
  },
  methods: {
    findToday() {
      this.properties.weeklist.forEach((week) => {
        let date = new Date(this.properties.nowdate);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        if (y == week.y && m == week.m && d == week.d) {
          this.setData({
            weeknow: date.getDay() ? date.getDay() : 7,
          });
        }
      });
    },
  },
});
