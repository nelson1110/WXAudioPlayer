function formatTime(time) {
  if (!isNaN(time)) {
    var minutes = parseInt(time / 60);
    var seconds = parseInt(time % 60);
    seconds < 10 && (seconds = "0" + seconds);
    return minutes + ":" + seconds
  }
}
var innerAudioContext;

Component({

  behaviors: [],

  properties: {
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '歌曲名称', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          title: newVal
        })
      }
    },
    src: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
        console.log('播放地址已变为'+newVal)
        this.setData({
          url: newVal
        })
        if (innerAudioContext!=null){
          innerAudioContext.src = newVal
        }
        
      }
    },
    image:{
      type: String,
      value: '../img/music.png',
      observer: function (newVal, oldVal, changedPath) {
        this.setData({
          image: newVal
        })
      }
    }
  },
  data: {
    url: "",
    title: "歌曲名称",
    position: 0,
    time: "0:00",
    max: 0,
    current: "0:00",
    isDraging: false,
    isPlaying: false,
    isLoop: false,
    image: '../img/music.png',
  }, // 私有数据，可用于模版渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {},
    moved: function() {},
    detached: function() {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {
    var that = this;
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.url
 
    innerAudioContext.onTimeUpdate(() => {
      
      if (!that.data.isDraging) {
        that.setData({
          time: formatTime(innerAudioContext.duration),
          max: parseInt(innerAudioContext.duration),
          position: parseInt(innerAudioContext.currentTime),
          current: formatTime(innerAudioContext.currentTime),
        })
      }
    })

    innerAudioContext.onPlay(() => {
      this.triggerEvent("onPlay")
      that.setData({
        isPlaying: true,
      })

    })

    innerAudioContext.onPause(() => {
      this.triggerEvent("onPause")
      that.setData({
        isPlaying: false,
      })
    })

    innerAudioContext.onStop(() => {
      this.triggerEvent("onStop")
      that.setData({
        position: 0,
        isPlaying: false,
      })
    })

    innerAudioContext.onEnded(() => {
      this.triggerEvent("end")
    })

    innerAudioContext.onCanplay(() => {
      this.triggerEvent("onCanplay")
    })

    innerAudioContext.onSeeking(() => {
      this.triggerEvent("onSeeking")
    })

    innerAudioContext.onSeeked(() => {
      this.triggerEvent("onSeeked")
    })

    innerAudioContext.onError((res) => {
      this.triggerEvent("onError")
      console.log(res.errMsg)
      console.log(res.errCode)
    })


  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
  },

  methods: {
    // 内部方法建议以下划线开头
    _sliderChange: function(event) {
      this.setData({
        isDraging: false
      })
      innerAudioContext.seek(event.detail.value)
    },
    _sliderChanging: function(event) {
      this.setData({
        current: formatTime(event.detail.value),
        isDraging: true
      })
    },
    _play: function(event){
      innerAudioContext.play()
    },
    _pause: function (event) {
      innerAudioContext.pause()
    },
    _loop: function (event){
      innerAudioContext.loop = !innerAudioContext.loop
      this.setData({
        isLoop: innerAudioContext.loop
      })
    },
    _next: function(event){
      this.triggerEvent("onNext")
    },
    _last: function(event){
      this.triggerEvent("onLast")
    }
  },

})