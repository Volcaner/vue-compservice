/*判断手机系统*/
var u = navigator.userAgent;
window.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
window.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

/*publicPath*/
window.publicPath = "../../../../redev/wechat_service";
window.publicPath1 = "../../../circle";
window.publicPath2 = "../../../..";
window.publicPath3 = "../../../../redev/wechat_for_comp";

/*if mock?*/
window.bIsMock = false;

// service name
window.serviceName = "蚁巢服务号";