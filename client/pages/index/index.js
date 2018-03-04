//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        user: '',
        pass: ''
    },
    onLoad(options){
      var that = this
      qcloud.setLoginUrl(config.service.loginUrl)

      qcloud.request({
        url: config.service.requestUrl,
        login: true,
        success(result) {
          util.showSuccess('登录成功')
          that.setData({
            userInfo: result.data.data,
            logged: true
          })
        },

        fail(error) {
          util.showModel('请求失败', error)
          console.log('request fail', error)
        }
      })
    },
    userInput: function (e) {
      this.setData({
        user: e.detail.value
      })
    },
    passInput: function (e) {
      this.setData({
        pass: e.detail.value
      })
    },
    showTopTips: function () {
      qcloud.request({
        login: false,
        url: config.service.control + '/test',
        method: 'POST',
        data: {
          user: this.data.user,
          pass: this.data.pass
        },
        success: (res) => {
          util.showModel('请求成功', res.data.data);
          console.log(res.data)
        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        },
      })
      /*
      qcloud.request({
        url: config.service.requestUrl,
        login: true,
        success(result) {
          util.showSuccess('登录成功')
          that.setData({
            userInfo: result.data.data,
            logged: true
          })
        },
      wx.request({
        url: config.service.control+'/test', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          x: this.data.user,
          y: this.data.pass
        },
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          console.log(res.data)
        }
      })
      */
    },
    // 用户登录示例
    login() { 
        if (this.data.logged) return

        util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })
                        },

                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    }
})
