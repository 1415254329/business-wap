import store from '@/store'
var CreatedOKLodop7766 = null
var CLodopIsLocal

//= ===判断是否需要 Web打印服务CLodop:===
//= ==(不支持插件的浏览器版本需要用它)===
function needCLodop () {
  try {
    var ua = navigator.userAgent
    if (ua.match(/Windows\sPhone/i)) { return true }
    if (ua.match(/iPhone|iPod|iPad/i)) { return true }
    if (ua.match(/Android/i)) { return true }
    if (ua.match(/Edge\D?\d+/i)) { return true }

    var verTrident = ua.match(/Trident\D?\d+/i)
    var verIE = ua.match(/MSIE\D?\d+/i)
    var verOPR = ua.match(/OPR\D?\d+/i)
    var verFF = ua.match(/Firefox\D?\d+/i)
    var x64 = ua.match(/x64/i)
    if ((!verTrident) && (!verIE) && (x64)) { return true } else if (verFF) {
      verFF = verFF[0].match(/\d+/)
      if ((verFF[0] >= 41) || (x64)) { return true }
    } else if (verOPR) {
      verOPR = verOPR[0].match(/\d+/)
      if (verOPR[0] >= 32) { return true }
    } else if ((!verTrident) && (!verIE)) {
      var verChrome = ua.match(/Chrome\D?\d+/i)
      if (verChrome) {
        verChrome = verChrome[0].match(/\d+/)
        if (verChrome[0] >= 41) { return true }
      }
    }
    return false
  } catch (err) {
    return true
  }
}

//= ===页面引用CLodop云打印必须的JS文件,用双端口(8000和18000）避免其中某个被占用：====
if (needCLodop()) {
  var src1 = 'http://localhost:8000/CLodopfuncs.js?priority=1'
  var src2 = 'http://localhost:18000/CLodopfuncs.js?priority=0'

  var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
  var result = new Proxy({
    first: false,
    second: false
  }, {
    set (obj, prop, value) {
      obj[prop] = value
      if (obj.first || obj.second) {
        store.commit('print/setIsLodopLoad', true)
      }
      return true
    }
  })
  var oscript = document.createElement('script')
  oscript.src = src1
  oscript.onload = () => {
    result.first = true
  }
  // oscript.onerror = () => {
  //   result.first = false
  // }
  head.insertBefore(oscript, head.firstChild)
  oscript = document.createElement('script')
  oscript.src = src2
  oscript.onload = () => {
    result.second = true
  }
  // oscript.onerror = () => {
  //   result.second = false
  // }
  head.insertBefore(oscript, head.firstChild)
  CLodopIsLocal = !!((src1 + src2).match(/\/\/localho|\/\/127.0.0./i))
}

//= ===获取LODOP对象的主过程：====
export default function getLodop (oOBJECT, oEMBED) {
  var strHtmInstall = ''
  var strHtmUpdate = ''
  var strHtm64_Install = '>'
  var strHtm64_Update = ''
  var strHtmFireFox = ''
  var strHtmChrome = ''
  var strCLodopInstall_1 = ''
  var strCLodopInstall_2 = ''
  var strCLodopInstall_3 = ''
  var strCLodopUpdate = ''
  var LODOP
  try {
    var ua = navigator.userAgent
    var isIE = !!(ua.match(/MSIE/i)) || !!(ua.match(/Trident/i))
    if (needCLodop()) {
      try {
        LODOP = getCLodop()
      } catch (err) {}
      if (!LODOP && document.readyState !== 'complete') {
        alert('网页还没下载完毕，请稍等一下再操作.')
        return
      }

      if (!LODOP) {
        document.body.innerHTML = strCLodopInstall_1 + (CLodopIsLocal ? strCLodopInstall_2 : '') + strCLodopInstall_3 + document.body.innerHTML
        return
      } else {
        if (CLODOP.CVERSION < '3.0.8.3') {
          document.body.innerHTML = strCLodopUpdate + document.body.innerHTML
        }
        if (oEMBED && oEMBED.parentNode) { oEMBED.parentNode.removeChild(oEMBED) }
        if (oOBJECT && oOBJECT.parentNode) { oOBJECT.parentNode.removeChild(oOBJECT) }
      }
    } else {
      var is64IE = isIE && !!(ua.match(/x64/i))
      //= ====如果页面有Lodop就直接使用，没有则新建:==========
      if (oOBJECT || oEMBED) {
        if (isIE) { LODOP = oOBJECT } else { LODOP = oEMBED }
      } else if (!CreatedOKLodop7766) {
        LODOP = document.createElement('object')
        LODOP.setAttribute('width', 0)
        LODOP.setAttribute('height', 0)
        LODOP.setAttribute('style', 'position:absolute;left:0px;top:-100px;width:0px;height:0px;')
        if (isIE) { LODOP.setAttribute('classid', 'clsid:2105C259-1E0C-4534-8141-A753534CB4CA') } else { LODOP.setAttribute('type', 'application/x-print-lodop') }
        document.documentElement.appendChild(LODOP)
        CreatedOKLodop7766 = LODOP
      } else { LODOP = CreatedOKLodop7766 }
      //= ====Lodop插件未安装时提示下载地址:==========
      if ((!LODOP) || (!LODOP.VERSION)) {
        if (ua.indexOf('Chrome') >= 0) { document.body.innerHTML = strHtmChrome + document.body.innerHTML }
        if (ua.indexOf('Firefox') >= 0) { document.body.innerHTML = strHtmFireFox + document.body.innerHTML }
        document.body.innerHTML = (is64IE ? strHtm64_Install : strHtmInstall) + document.body.innerHTML
        return LODOP
      }
    }
    if (LODOP.VERSION < '6.2.2.6') {
      if (!needCLodop()) { document.body.innerHTML = (is64IE ? strHtm64_Update : strHtmUpdate) + document.body.innerHTML }
    }
    //= ==如下空白位置适合调用统一功能(如注册语句、语言选择等):==

    //= ======================================================
    return LODOP
  } catch (err) {
    alert('getLodop出错:' + err)
  }
}
