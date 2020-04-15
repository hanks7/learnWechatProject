import { Movie } from 'class/Movie.js';
var app = getApp();
Page({
  data: {
    movie: {} 
  },
  onLoad: function (options) {
    console.log("cc-page-movies-detail");
    var movieId = options.id;
    var url = app.globalData.doubanBase +
      "/v2/movie/subject/" + movieId;
    var movieClass = new Movie(url);
    // var movieData = movie.getMovieData();
    // var that = this;
    // movie.getMovieData(function (movie) {
    //   that.setData({
    //     movie: movie
    //   })
    // })
    //C#、Java、Python lambda
    movieClass.getMovieData((param) => {
      this.setData({
        movie: param
      })
    })
  },

  /*查看图片*/
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
})