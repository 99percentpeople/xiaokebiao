Component({
  properties: {
    pagesList: Array,
    fullscreenImg:Boolean
  },
  data: {
    bgImg: false,
    
  },
  options: {
    multipleSlots: true,
  },
  lifetimes: {
    attached() {
      getApp().watchSetting(
        ["bgImg"],
        ({ bgImg }) => {
          this.setData({ bgImg });
        },
        true
      );
      getApp().watchSetting(["fullscreenImg"],({fullscreenImg})=>{
        this.setData({fullscreenImg})
      },true)
      
    },
  },
});
