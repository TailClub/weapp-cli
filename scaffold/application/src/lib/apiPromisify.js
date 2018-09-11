const apis = [
    // 网络
    'request',
    'getNetworkType',
    // 上传 下载
    'uploadFile',
    'downloadFile',
    // websocket
    'connectSocket',
    'sendSocketMessage',

    // 图片
    'chooseImage',
    'previewImage',
    'getImageInfo',
    'saveImageToPhotosAlbum',

    // 音频
    'startRecord',
    'playVoice',
    'getBackgroundAudioPlayerState',
    'playBackgroundAudio',
    'seekBackgroundAudio',

    // 视频
    'chooseVideo',
    'saveVideoToPhotosAlbum',

    // 字体
    'loadFontFace',

    // 文件
    'saveFile',
    'getFileInfo',
    'getSavedFileList',
    'getSavedFileInfo',
    'removeSavedFile',
    'openDocument',

    // 缓存
    'setStorage',
    'getStorage',
    'getStorageInfo',
    'removeStorage',

    // 位置
    'getLocation',
    'chooseLocation',
    'openLocation',

    // 设备
    'getSystemInfo',
    'getNetworkType',
    'startCompass',
    'makePhoneCall',
    'scanCode',
    'setClipboardData',
    'getClipboardData',
    // 蓝牙
    'openBluetoothAdapter',
    'closeBluetoothAdapter',
    'getBluetoothAdapterState',
    'startBluetoothDevicesDiscovery',
    'getBluetoothDevices',
    'getConnectedBluetoothDevices',
    'createBLEConnection',
    'closeBLEConnection',
    'getBLEDeviceServices',
    'getBLEDeviceCharacteristics',
    'readBLECharacteristicValue',
    'writeBLECharacteristicValue',
    // ibeacon
    'startBeaconDiscovery',
    'getBeacons',
    // 屏幕亮度
    'setScreenBrightness',
    'getScreenBrightness',
    'setKeepScreenOn',
    // 震动
    'vibrateLong',
    'vibrateShort',
    // 手机联系人
    'addPhoneContact',
    // NFC
    'getHCEState',
    'startHCE',
    'stopHCE',
    'sendHCEMessage',
    // wifi
    'startWifi',
    'stopWifi',
    'connectWifi',
    'getWifiList',
    'setWifiList',
    'getConnectedWifi',

    // 交互
    'showToast',
    'showLoading',
    'showModal',
    'showActionSheet',

    // 设置导航条
    'setNavigationBarTitle',
    'setNavigationBarColor',

    // 设置tabbar
    'setTabBarBadge',
    'removeTabBarBadge',
    'showTabBarRedDot',
    'hideTabBarRedDot',
    'setTabBarStyle',
    'setTabBarItem',
    'showTabBar',
    'hideTabBar',

    // 设置置顶信息
    'setTopBarText',

    // 导航
    'navigateTo',
    'redirectTo',
    'switchTab',
    'reLaunch',

    // 下拉刷新
    'startPullDownRefresh',

    // 第三方平台
    'getExtConfig',

    // 开发接口
    'login',
    'checkSession',
    'authorize',
    'getUserInfo',
    'requestPayment',

    // 转发
    'showShareMenu',
    'hideShareMenu',
    'updateShareMenu',
    'getShareInfo',

    // 收货地址
    'chooseAddress',
    'addCard',
    'openCard',

    // 设置
    'openSetting',
    'getSetting',

    // 微信运动
    'getWeRunData',

    // 打开小程序
    'navigateToMiniProgram',
    'navigateBackMiniProgram',

    // 获取发票抬头
    'chooseInvoiceTitle',

    // 生物认证
    'checkIsSupportSoterAuthentication',
    'startSoterAuthentication',
    'checkIsSoterEnrolledInDevice'
]

function init() {
    apis.forEach(name => {
        let omethod = wx[name]
        Object.defineProperty(wx, name, {
            get: function() {
                return function(params = {}) {
                    return new Promise((resolve, reject) => {
                        omethod({
                            ...params,
                            success(res) {
                                resolve(res)
                            },
                            complete(res) {
                                resolve(res)
                            },
                            fail(err) {
                                reject(err)
                            }
                        })
                    })
                }
            }
        })
    })
}

module.exports = init
