var app = getApp();
Page({
  data: {
    test: "test1111"
  },
  onLoad: function(options) {

    // wx.switchTab({
    //   url: "/pages/movies/movies"
    // });
  },
  onTap: function(event) {
    // wx.navigateTo({
    //     url:"../posts/post"  
    // });

    wx.switchTab({
      url: "../posts/post"
    });


    this.test3("test");
    this.test3(app.globalData.doubanBase);

  },
  test3: function(strContent) {
    console.log(strContent)

  },
  test: function() {
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success(res) {
        console.log("success : " + res.tapIndex)
      },
      fail(res) {
        console.log("fail : " + res.errMsg)
      }
    })

  },

  onReady: function(event) {

    wx.setNavigationBarTitle({

      title: this.data.test
    })
  },
 


})