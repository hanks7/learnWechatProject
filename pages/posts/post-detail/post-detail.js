var postsData = require('../../../data/posts-data.js')
var app = getApp();
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {
      console.log("cc-page-post-detail");
        var postId = option.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        })

        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            if (postCollected){
              this.setData({
                collected: postCollected
              })
            }
        }
        else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            })
        }
        this.setMusicMonitor();

      wx.request({
        url: "https://api.baletu.com/App401/Homes/activityList?city_id=1&v=4.9.5&public_parameters=%7B%22android_cpu%22%3A%22armeabi-v7a%2Carmeabi%22%2C%22new_project_name%22%3A%221%22%2C%22is_has_contract%22%3Afalse%2C%22is_login%22%3Atrue%2C%22company_city%22%3A%22%E6%97%A0%22%2C%22platformType%22%3A%22Android%22%2C%22device_id%22%3A%2286511129037034%22%2C%22gps_city%22%3A%22%E4%B8%8A%E6%B5%B7%E5%B8%82%22%2C%22blt_user_id%22%3A%221000533471%22%2C%22city_code%22%3A%22310100%22%2C%22channel%22%3A%22guanwang%22%7D&device_id=86511129037034&ut=c600a9a09ad26920d01db66f9ae56b0fad79ddfe&from=3&user_id=1000533471&preset_parameters=%7B%22%24app_version%22%3A%224.9.5%22%2C%22%24lib%22%3A%22Android%22%2C%22%24lib_version%22%3A%223.1.5%22%2C%22%24manufacturer%22%3A%22C50%22%2C%22%24model%22%3A%22C50%22%2C%22%24os%22%3A%22Android%22%2C%22%24os_version%22%3A%226.0%22%2C%22%24screen_height%22%3A1280%2C%22%24screen_width%22%3A720%2C%22%24wifi%22%3Atrue%2C%22%24network_type%22%3A%22WIFI%22%2C%22%24is_first_day%22%3Afalse%2C%22%24device_id%22%3A%222d64562f439748e4%22%2C%22distinct_id%22%3A%221000533471%22%7D",
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          "Content-Type": "json"
        },
        success: function (res) {

          console.log(res.data.result.list[0].activity[0].image_desc);
          wx.showToast({
            title: res.data.result.list[0].activity[0].image_desc,//支持三目运算
            duration: 3000,
            icon: "success"
          })
        },
        fail: function (error) {
          // fail
          wx.showToast({
            title: error,//支持三目运算
            duration: 3000,
            icon: "success"
          })
        }
      })
    
    },

    setMusicMonitor: function () {
        //点击播放图标和总控开关都会触发这个函数
        var that = this;
        wx.onBackgroundAudioPlay(function (event) {
          
            var pages = getCurrentPages();
            
            var currentPage = pages[pages.length - 1];
            if (currentPage.data.currentPostId === that.data.currentPostId) {
                // 打开多个post-detail页面后，每个页面不会关闭，只会隐藏。通过页面栈拿到到
                // 当前页面的postid，只处理当前页面的音乐播放。
                if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
                    // 播放当前页面音乐才改变图标
                    that.setData({
                        isPlayingMusic: true
                    })
                }
                // if(app.globalData.g_currentMusicPostId == that.data.currentPostId )
                // app.globalData.g_currentMusicPostId = that.data.currentPostId;
            }
            app.globalData.g_isPlayingMusic = true;

        });
        wx.onBackgroundAudioPause(function () {
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            if (currentPage.data.currentPostId === that.data.currentPostId) {
                if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
                    that.setData({
                        isPlayingMusic: false
                    })
                }
            }
            app.globalData.g_isPlayingMusic = false;
            // app.globalData.g_currentMusicPostId = null;
        });
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            // app.globalData.g_currentMusicPostId = null;
        });
    },

    onColletionTap: function (event) {
        // this.getPostsCollectedSyc();
        this.getPostsCollectedAsy();
    },

    getPostsCollectedAsy: function () {
        var that = this;
        wx.getStorage({
            key: "posts_collected",
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                // 收藏变成未收藏，未收藏变成收藏
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);
            }
        })
    },

    getPostsCollectedSyc: function () {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);
    },

    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
            showCancel: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    wx.setStorageSync('posts_collected', postsCollected);
                    // 更新数据绑定变量，从而实现切换图片
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },

    showToast: function (postsCollected, postCollected) {
        // 更新文章是否的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        // 更新数据绑定变量，从而实现切换图片
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        })
    },

    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户是不是点击了取消按钮
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: "用户 " + itemList[res.tapIndex],
                    content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
                })
            }
        })
    },

    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
            // app.globalData.g_currentMusicPostId = null;
            app.globalData.g_isPlayingMusic = false;
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
            })
            this.setData({
                isPlayingMusic: true
            })
            app.globalData.g_currentMusicPostId = this.data.currentPostId;
            app.globalData.g_isPlayingMusic = true;
        }
    },

    /*
    * 定义页面分享函数
    */
    onShareAppMessage: function (event) {
        return {
            title: '离思五首·其四',
            desc: '曾经沧海难为水，除却巫山不是云',
            path: '/pages/posts/post-detail/post-detail?id=0'
        }
    }

})