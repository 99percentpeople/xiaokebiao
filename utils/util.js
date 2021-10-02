function globalData() {
  (this._setting = {
    _themeColor: "#B22222",
    _frontColor: "#ffffff",
    _bgImg: false,
    _bgImgPath: "",
    _slidingdirection: true,
    _xiaoxiaole: true,
    _account: "",
    _pwd: "",
    _fullscreenImg: false,
  }),
    (this._methods = {});
}

const navOpt = [
  {
    tag: "navigator",
    icon: "iconfont icon-wodekecheng",
    name: "我的课表",
    path: "/pages/accountPage/accountPage",
  },
  {
    tag: "navigator",
    icon: "iconfont icon-kejianyulan",
    name: "成绩查询",
    path: "/pages/achievementPage/achievementPage",
  },
  {
    tag: "navigator",
    icon: "iconfont icon-shezhi",
    name: "设置",
    path: "/pages/settingPage/settingPage",
  },
  {
    tag: "navigator",
    icon: "iconfont icon-bangzhu",
    name: "帮助",
    path: "/pages/aboutPage/aboutPage",
  },
];

const classesInfo = [
  [
    {
      xq: 1,
      kcmc: "欢迎使用小课表",
      jcdm2: [3, 4, 5],
      color: "#85B8CF",
    },
    {
      xq: 2,
      kcmc: "左边是侧边栏",
      jcdm2: [4, 5, 6, 7],
      color: "#90C652",
    },
    {
      xq: 3,
      kcmc: "请选择 “我的课表” 页面进行初始化",
      jcdm2: [3, 4, 5, 6],
      color: "#90C652",
    },
    {
      xq: 4,
      kcmc: "此课表支持拥有丰富的自定义主题功能",
      jcdm2: [4, 5, 6, 7, 8],
      color: "#12AEF3",
    },
    {
      xq: 5,
      kcmc: "目前只实现的课表功能，更多功能会陆续推出",
      jcdm2: [2, 3, 4, 5, 6, 7],
      color: "#FF7F50",
    },
    {
      xq: 6,
      kcmc: "目前只实现的课表功能，更多功能会陆续推出",
      jcdm2: [4, 5, 6, 7, 8],
      color: "#FF7F50",
    },
  ],
];
const colorArrays = [
  "#66CCCC",
  "#CC6600",
  "#FF99CC",
  "#FF9999",
  "#FFCC99",
  "#FF6666",
  "#0099CC",
  "#99CC66",
  "#88AA11",
  "#FF9900",
  "#FFCC00",
  "#B22222",
  "#FF9966",
  "#CCFF00",
  "#CC3399",
  "#CCCC33",
];

const jcStart = [
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
];
const jcEnd = [
  "09:15",
  "10:05",
  "11:10",
  "12:00",
  "14:35",
  "15:25",
  "16:15",
  "17:15",
  "18:05",
  "19:15",
  "20:05",
  "20:55",
];

module.exports = {
  colorArrays,
  jcStart,
  jcEnd,
  navOpt,
  globalData,
  classesInfo,
};
