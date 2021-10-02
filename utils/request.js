export const request = (params) => {
  return new Promise((resolve, reject) => {
    if(wx.getStorageSync('session')){
      Object.assign(params.header,{
        cookie: wx.getStorageSync('session').join()
      })
    }
    wx.request({
      ...params,
      success(res) {
        if(res.cookies&&res.cookies.length>0){
          wx.setStorage({
            key:"session",
            data:res.cookies
          })
        }
        return resolve(res);
      },
      fail(err) {
        return reject(err);
      },
    });
  });
};

export const downloadFile =(params) => {
  return new Promise((resolve, reject) => {
    if(wx.getStorageSync('session')){
      Object.assign(params.header,{
        cookie: wx.getStorageSync('session').join()
      })
    }
    wx.downloadFile({
      ...params,
      success(res) {
        if(res.cookies&&res.cookies.length>0){
          // console.log(res.cookies);
          wx.setStorage({
            key:"session",
            data:res.cookies
          })
        }
        return resolve(res);
      },
      fail(err) {
        return reject(err);
      },
    });
  });
};