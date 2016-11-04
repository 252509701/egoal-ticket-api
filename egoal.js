/**
 * Copyright(c) 丽江云创信息技术有限公司
 *
 * Authors: mengkeys <mengkeys@hotmail.com>
 *
 * Website: https://www.yuncreate.con
 *
 * Version: 2.0
 *
 * License: MIT Licensed
 */

var md5    = require('md5');
var qs     = require('querystring');
var request = require('request');
var validator = require('validator');

/**
 * 对象属性排序
 * @name   objectSort
 * @param  {Object} obj    (待处理对象)
 * @return {Object} result (处理后的对象)
 */

function objectSort(obj){
    var result = {};
    var items = Object.keys(obj).sort();
    for(var item in items){
        result[items[item]] = obj[items[item]];
    }
    return result;
}


/**
 * 去空操作
 * @name trim
 * @param  {String} str (待操作字符串)
 * @return {String} str (处理结果)
 */
function trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, ""); 
}

/**
 * 构造对象
 * @name   Ticket
 * @param  {Object} opt    ({url, uname, pass})
 * @return {Object} object (可操作对象)
 *
 */
function Ticket(opt){
    if(arguments.length < 1 || typeof opt !== 'object'){
        throw new Error('options required');
    }

    // verify uname（检测账号）
    if(opt.uname == undefined || trim(opt.uname) == ""){
        throw new Error('uname required.');
    }

    // verify pass（检测密码）
    if(opt.pass == undefined || trim(opt.pass) == ""){
        throw new Error('pass required.');
    }

    if(opt.url == undefined || trim(opt.url) == ""){
        throw new Error('api url required.');
    }

    // 设置全局对象属性
    this.uname = opt.uname;
    this.pass  = opt.pass;
    this.url = opt.url;  // api remote address.
}

/**
 * 签名处理
 * @name   signature
 * @param  {Object} opt  (请求参数对象)
 * @return {String} sign (签名)
 */


Ticket.prototype.signature = function(opt){
    return md5((md5(qs.stringify(objectSort(opt)))+this.pass)).toUpperCase();
};

/**
 * 发起接口调用
 * @name  request
 * @param {Object}   opt
 * @param {Function} callback
 */

Ticket.prototype.request = function(opt, callback){
    request.post(this.url, {form:opt}, function (err, res, body) {
        if(err) return callback(err);
        return callback(null, JSON.parse(body));
    });
};

/**
 * 门票列表接口
 * Examples:
 * ```
 * ticket.orderGetPdcId(callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * Fail:
 * ```
 * {
 *   code:"0",
 *   message:"错误信息"
 * }
 *
 * ```
 * Success:
 * ```
 * {
 *   status: '1',
 *   message: '查询成功',
 *   pdcIds: [{
 *      pdcId: '1',
 *      pdcName: '成人票',
 *      pdcPrice: '1',
 *      days: '20'
 *   }]
 * }
 * ```
  *
 * @name  orderGetPdcId
 * @param {Function} callback (回调函数)
 */
Ticket.prototype.orderGetPdcId = function (callback) {
    if(arguments.length < 1 || typeof callback != 'function'){
        throw new Error('callback function required.');
    }
    var opt = {
        method: 'order_getpdcId',
        uname: this.uname
    };
    opt.sign = this.signature(opt);
    this.request(opt, callback);
};

/**
 * 购买接口
 * Example
 * ```
 * ticket.orderCreate({
 *   threeOrderId: '第三方系统订单编号',
 *   playDate:     '2016-11-08',
 *   mobile:       '手机号',
 *   pdcId:        '1',
 *   pdcPrice:     '100',
 *   checkNum:     '1',
 *   pCount:       '1',
 *   certNo:       '客户身份证号',
 *   money:        '100',
 *   localPay:     '0'
 * }, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * Fail:
 * ```
 * {
 *   code:"0",
 *   message:"错误信息"
 * }
 *
 * ```
 * Success:
 * ```
 *{"status":"0",
 *   "orderId":"T15090600000001",
 *   "message":"查询成功",
 *   "ticketCodes":[
 *       {"pdcId":"1","ticketCode":"010000016813"},
 *       {"pdcId":"2","ticketCode":"010000016814"}]
 *}
 * ```


 *  @name  orderCreate          (购票接口)
 *  @param opt      {Object}    (订单数据对象)
 *  @param callback {Function}  (回调函数)
 */
Ticket.prototype.orderCreate = function(opt, callback){
    if(arguments.length < 1){
        throw  new Error('please provide options and callback');
    }

    if(typeof opt != 'object'){
        throw new Error('booking options object required.');
    }

    if(typeof opt == 'function'){
        // 错误
        return opt(new Error('booking options object required.'));
    }

    if(opt.threeOrderId == undefined || trim(opt.threeOrderId) == ""){
        return callback(new Error('options.threeOrderId required.'));
    }

    if(opt.playDate == undefined || trim(opt.playDate) == ""){
        return callback(new Error('options.playDate required.'));
    }

    if(opt.mobile == undefined || trim(opt.mobile) == ""){
        return callback(new Error('options.mobile required.'));
    }

    if(opt.pdcId == undefined || trim(opt.pdcId) == ""){
        return callback(new Error('options.pdcId required.'));
    }

    if(opt.pdcPrice == undefined || trim(opt.pdcPrice) == ""){
        return callback(new Error('options.pdcPrice required.'));
    }

    if(opt.pCount == undefined || trim(opt.pCount) == ""){
        return callback(new Error('options.pCount required.'));
    }

    if(opt.checkNum == undefined || trim(opt.checkNum) == ""){
        return callback(new Error('options.checkNum required.'));
    }

    if(opt.money == undefined || trim(opt.money) == ""){
        return callback(new Error('options.money required.'));
    }

    if(opt.localPay == undefined || trim(opt.localPay) == ""){
        return callback(new Error('options.localPay required.'));
    }

    var threeOrderId    = opt.threeOrderId,
        playDate        = opt.playDate,
        mobile          = opt.mobile,
        pdcId           = opt.pdcId,
        pdcPrice        = opt.pdcPrice,
        pCount          = opt.pCount,
        checkNum        = opt.checkNum,
        certNo          = opt.certNo ? opt.certNo: "",
        money           = opt.money;


    // 时间验证
    if(!validator.isDate(playDate)){
        return callback(new Error('playDate invalid.'));
    }
    // 手机号验证
    if(!validator.isMobilePhone(mobile, 'zh-CN')){
        return callback(new Error('mobile invalid.'));
    }
    // pdcId, pdcPrice, pCount 联合校验
    if(pdcId.split('|').length != pdcPrice.split('|').length || pdcId.split('|').length != pCount.split('|').length || pdcPrice.split('|').length != pCount.split('|').length){
        return callback(new Error('pdcId, pdcPrice, pCount not match'));
    }

    // 匹配问题

    var args = {
        method:       'order_create',
        uname:        this.uname,
        mobile:       mobile,
        threeOrderId: threeOrderId,
        playDate:     playDate,
        pdcId:        pdcId,
        pdcPrice:     pdcPrice,
        pCount:       pCount,
        certNo:       certNo,
        checkNum:     checkNum,
        money:        money
    };
    args.sign = this.signature(args);
    this.request(args, callback);
};

/**
 *  退票接口
 *  Example
 *  ```
 *  ticket.orderCancel({
 *      threeOrderId: '第三方系统订单编号',
 *      orderId:      '易高系统订单编号',
 *      ticketCode:   '票号'
 *  }, callback)
 *  ```
 *  Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * Fail:
 * ```
 * {
 *   code:"0",
 *   message:"错误信息"
 * }
 * ```
 * Success:
 * ```
 * {
 *   code:"0",
 *   message:"申请退票成功"
 * }
 * ```
 *  @name  orderCancel         (订单退订接口)
 *  @param {Object}   opt      (参数对象)    {Object{orderId:"", threeOrderId:"",ticketCode:""}}
 *  @param {Function} callback (回调函数)
 */
Ticket.prototype.orderCancel = function (opt, callback) {
    if(arguments.length < 1 || typeof opt !== 'object'){
        // 错误
        throw new Error('Params Invalid.');
    }

    if(opt.orderId == undefined || trim(opt.orderId) == ""){
        return callback(new Error('orderId required'));
    }

    if(opt.threeOrderId == undefined || trim(opt.threeOrderId) == ""){
        return callback(new Error('threeOrderId required'));
    }

    if(opt.ticketCode == undefined || trim(opt.ticketCode) == ""){
        return callback(new Error('ticketCode required'));
    }

    var args = {
        method: 'order_cancel',
        uname: this.uname,
        orderId: opt.orderId,
        threeOrderId: opt.threeOrderId,
        ticketCode: opt.ticketCode
    };

    args.sign = this.signature(args);
    this.request(args, callback);
};

/**
 *  订单信息接口
 *  Example
 *  ```
 *  ticket.orderCancel({
 *      threeOrderId: '第三方系统订单编号',
 *      orderId:      '易高系统订单编号',
 *      ticketCode:   '票号'
 *  }, callback);
 *  ```
 *  Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * Fail:
 * ```
 * {
 *   code:"0",
 *   message:"错误信息"
 * }
 * ```
 * Success:
 * ```
 * {"status":"1",
 *      "message":"订单详情",
 *      "orderId":"T15090600000001",
 *      "orderStatus ":[
 *          {"pdcId":"1","ticketCode":"010000016813","orderStatus ":"1"},
 *          {"pdcId":"2","ticketCode":"010000016814","orderStatus ": "1"}]
 * }
 * ```
 *  @name  orderGetInfo              (获取订单状态)
 *  @param {String|Object}   opt   (第三方系统订单编号)
 *  @param {Function} callback       (回调函数)
 *
 */
Ticket.prototype.orderGetInfo = function (opt, callback) {
    if(typeof opt == 'function'){
        //threeOrderId = threeOrderId.threeOrderId;
        return opt(new Error('threeOrderId param required.'));
    }

    var threeOrderId ="";
    var orderId = "";
    var ticketCode = "";
    if(typeof opt != 'object'){
        threeOrderId = opt;
    } else {
         threeOrderId = opt.threeOrderId;
         orderId = opt.orderId?opt.orderId:"";
         ticketCode = opt.ticketCode?opt.orderId:"";
    }

    if(trim(threeOrderId) == ""){
        return callback(new Error('threeOrderId param required.'));
    }

    // 逻辑校验
    // 必须要有一个参数（字符串直接就是threeOrderId,如果是对象，则获取其中的threeOrderId)
    // 如果不符合条件就报错
    var args = {
        method: 'order_getinfo',
        uname: this.uname,
        threeOrderId: threeOrderId,
        orderId : orderId,
        ticketCode : ticketCode
    };
    args.sign = this.signature(args);
    this.request(args, callback);
};

/**
 *  消费通知接口
 *  Example
 *  ```
 *  ticket.ticketNotice(req.body, callback);
 *  ```
 *  Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * Fail:
 * ```
 * {
 *   code:"0",
 *   message:"错误信息"
 * }
 * ```
 * Success:
 * ```
 * {
 *  "status":"1",
 *  "message":"订单详情",
 *  "sign":"",
 *  "uname":"",
 *  "orderId":"T15090600000001",
 *  "threeOrderId":"",
 *  "ticketCode":"010000016813",
 * }
 * ```
 *  @name  ticketNotice          (消费通知接口)
 *  @param {Object} data         (收到的数据)
 *  @param {Function} callback   (回调函数)
 */
Ticket.prototype.ticketNotice = function (data, callback) {
    var self = this;
    if(typeof data == 'function' || typeof data != 'object'){
        return callback(new Error('data required.'));
    }

    if(data.method == undefined || trim(data.method) == ""){
        return callback(new Error('method param not provide.'));
    }

    if(data.sign == undefined || trim(data.sign) == ""){
        return callback(new Error('sign param not provide'));
    }

    if(data.uname == undefined || trim(data.uname) == ""){
        return callback(new Error('uname param not provide'));
    }

    if(data.orderId == undefined || trim(data.orderId) == ""){
        return callback(new Error('orderId param not provide'));
    }

    if(data.threeOrderId == undefined || trim(data.threeOrderId) == ""){
        return callback(new Error('threeOrderId param not provide'));
    }

    if(data.ticketCode == undefined || trim(data.ticketCode) == ""){
        return callback(new Error('ticketCode param not provide.'));
    }

    var method       = data.method;
    var sign         = data.sign;
    var uname        = data.uname;
    var orderId      = data.orderId;
    var threeOrderId = data.threeOrderId;
    var ticketCode   = data.ticketCode;

    if(method != 'order_check'){
        return callback(new Error('method invalid'));
    }

    if(uname != self.uname){
        return callback(new Error('uname invalid.'));
    }
    var params = {
        method: method,
        uname: uname,
        orderId: orderId,
        threeOrderId:threeOrderId,
        ticketCode:ticketCode
    };

    try{
        var check = self.signature(params);
    } catch (e){
        return callback(new Error('sign error'));
    }

    if(check != sign){
        return callback(new Error('sign invalid'));
    }

    // 验证通过
    return callback(null, {
        orderId: orderId,
        threeOrderId:threeOrderId,
        ticketCode:ticketCode
    });
};

module.exports = Ticket;

