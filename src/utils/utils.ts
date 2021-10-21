import { parse } from 'querystring';
import crypto from 'crypto';
import { Moment } from 'moment';
import { MenuDataItem } from '@ant-design/pro-layout/es/typings';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

Date.prototype.Format = function (fmt: string) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'H+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
  return fmt;
};

export const CommonUtils = {
  getParentNode(list: any[], key: string, value: string) {
    let parentNode: any = null;
    let node: any = null;
    function getNode(list, value) {
      //1.第一层 root 深度遍历整个JSON
      for (let i = 0; i < list.length; i++) {
        if (node) {
          break;
        }
        let obj = list[i];
        //没有就下一个
        if (!obj || !obj[key]) {
          continue;
        }

        //2.有节点就开始找，一直递归下去
        if (obj[key] == value) {
          //找到了与nodeId匹配的节点，结束递归
          node = obj;
          break;
        } else {
          //3.如果有子节点就开始找
          if (obj.children) {
            //4.递归前，记录当前节点，作为parent 父亲
            parentNode = obj;
            //递归往下找
            getNode(obj.children, value);
          } else {
            //跳出当前递归，返回上层递归
            continue;
          }
        }
      }

      //5.如果木有找到父节点，置为null，因为没有父亲
      if (!node) {
        parentNode = null;
      }

      //6.返回结果obj
      return {
        parentNode: parentNode,
        node: node,
      };
    }
    return getNode(list, value);
  },
  /**
   * 数组转树结构
   * @param array 需转换的数组
   * @param parentKey parent key
   */
  translateDataToTree(array: [], parentKey: string) {
    //第一层数据
    let parents: any[] = array.filter((item) => !item[parentKey]);
    //有父节点的数据
    let childrens = array.filter((item) => item[parentKey]);
    function translator(parents: [], childrens: []) {
      parents.forEach((parent: any) => {
        childrens.forEach((children, index) => {
          //找到子层的父层
          if (children[parentKey] === parent.value) {
            //temp 这步不是必须
            //对子节点数据进行深复制
            let temp = JSON.parse(JSON.stringify(childrens));
            //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
            temp.splice(index, 1);
            //判断是否有children属性 有就直接push 没有就增加children属性
            parent.children ? parent.children.push(children) : (parent.children = [children]);
            //不用temp 传childrens也可
            translator([children], temp);
          }
        });
      });
    }
    translator(parents, childrens);
    //返回最终结果
    return parents;
  },
  /*
   * 递归查找指定项, 只查找本身信息
   * */
  deepFindWithoutChain<T extends Record<any, any>, P = any>(
    arr: Array<T>,
    childrenKey: keyof T,
    key: keyof T,
    value: P,
  ): T | undefined {
    return arr.reduce((result, current) => {
      if (current[key] === value) {
        return { ...current };
      } else if (current[childrenKey] && current[childrenKey].length) {
        const find = this.deepFindWithoutChain(current[childrenKey], childrenKey, key, value);
        if (find) {
          result = { ...find };
        }
        return result;
      }
      return result;
    }, undefined as T | undefined);
  },
  filterRoute(pathname: string, menuData: MenuDataItem[]) {
    const router = pathname.split('/').reduce(
      (result, current, index) => {
        if (index === 0) {
          result.arr.push('/' + current);
        } else {
          result.arr.push(result.parent + '/' + current);
          result.parent = result.parent + '/' + current;
        }
        return result;
      },
      { parent: '', arr: [] } as { parent: string; arr: Array<string> },
    ).arr;
    const route = router
      .filter((item) => item !== '/')
      .map((url) => {
        const route = CommonUtils.deepFindWithoutChain(menuData, 'children', 'path', url);
        return route;
      })
      .filter((item) => {
        return !item?.children;
      });
    return route;
  },
  filterRouteAll(pathname: string, menuData: MenuDataItem[]) {
    const router = pathname.split('/').reduce(
      (result, current, index) => {
        if (index === 0) {
          result.arr.push('/' + current);
        } else {
          result.arr.push(result.parent + '/' + current);
          result.parent = result.parent + '/' + current;
        }
        return result;
      },
      { parent: '', arr: [] } as { parent: string; arr: Array<string> },
    ).arr;
    const route = router
      .filter((item) => item !== '/')
      .map((url) => {
        const route = CommonUtils.deepFindWithoutChain(menuData, 'children', 'path', url);
        return route
          ? {
              path: '/commercializefonted' + route && route.path,
              breadcrumbName: route && route.name,
            }
          : {};
      });
    return route.filter((item) => item.path);
  },
  filterTopMenu(pathname: string, menuData: MenuDataItem[]) {
    const target = menuData.find((data) => {
      if (data.children)
        return !!CommonUtils.deepFindWithoutChain(data.children, 'children', 'path', pathname);
      else return false;
    });
    return target;
  },
  isEmptyOrNull(v: any): boolean {
    // 判断字符串是否为空
    return typeof v === 'undefined' || v === '' || v === null ? true : false;
  },
  isObject(v: any): boolean {
    // 判断是否为对象
    if (Object.prototype.toString.call(v) == '[object Array]') {
      return false;
    }
    return typeof v === 'object' || v != null ? true : false;
  },
  isArray(v: any): boolean {
    // 判断是否为数组
    return Object.prototype.toString.call(v) === '[object Array]';
  },
  isNodeList(v: any): boolean {
    // 判断是否为节点集
    return Object.prototype.toString.call(v) === '[object NodeList]';
  },
  isInputElement(v: any): boolean {
    // 判断是否为input元素
    return Object.prototype.toString.call(v) === '[object HTMLInputElement]';
  },
  isFunction(v: any): boolean {
    // 判断是否为函数
    return typeof v === 'function';
  },
  isNumber(v: any): boolean {
    // 判断是否为数字
    return typeof v === 'number';
  },
  isString(v: any): boolean {
    // 判断是否为字符串
    return typeof v === 'string';
  },
  isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path);
  },
  /**
   * @param {*} obj1 对象
   * @param {*} obj2 对象
   * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
   */
  objEqual(obj1: Object, obj2: Object): boolean {
    const keysArr1 = Object.keys(obj1);
    const keysArr2 = Object.keys(obj2);
    if (keysArr1.length !== keysArr2.length) return false;
    else if (keysArr1.length === 0 && keysArr2.length === 0) return true;
    else return !keysArr1.some((key) => obj1[key] != obj2[key]);
  },
  hasChild(item: { children?: any[] }): boolean {
    return item.children !== undefined && item.children.length !== 0;
  },
  /**
   * @param {Array} target 目标数组
   * @param {Array} arr 需要查询的数组
   * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
   */
  hasOneOf(targetarr: any[], arr: any[]): boolean {
    return targetarr.some((_) => arr.indexOf(_) > -1);
  },
  /**
   * @param {String} url
   * @description 从URL中解析参数
   */
  getParams(url: string): Object {
    const keyValueArr = url.split('?')[1].split('&');
    let paramObj = {};
    keyValueArr.forEach((item) => {
      const keyValue = item.split('=');
      paramObj[keyValue[0]] = keyValue[1];
    });
    return paramObj;
  },
  /**
  
   * @param {Number} times 回调函数需要执行的次数
   * @param {Function} callback 回调函数
   */
  doCustomTimes(times: number, callback: Function): void {
    let i = -1;
    while (++i < times) {
      callback(i);
    }
  },
  /**
   * @description 抽取并格式化时间
   * @param {Array} dateArr 时间数组[start,end]
   * @param {Number} index 格式化位置下标
   */
  formatDateArr(dateArr: any[], index: number): string {
    if (Array.isArray(dateArr) && dateArr.length > 0) {
      return index == 0
        ? new Date(dateArr[index]).Format('yyyy/MM/dd') + ' 00:00:00'
        : new Date(dateArr[index]).Format('yyyy/MM/dd') + ' 23:59:59';
    } else {
      return '';
    }
  },

  //todo:: 以下代码没有转ts

  /**
   * @description 格式化参数
   * @param {Object} formData 查询参数
   * @param {String} stateDate 开始时间参数字段
   * @param {String} endDate 结束时间参数字段
   */
  formatParams(formData: { dateTime?: Moment[] }, stateDate = 'start_date', endDate = 'end_date') {
    let params = JSON.parse(JSON.stringify(formData));
    params[stateDate] = CommonUtils.formatDateArr(params.dateTime, 0);
    params[endDate] = CommonUtils.formatDateArr(params.dateTime, 1);

    Object.keys(params).forEach((item) => {
      if (CommonUtils.isEmptyOrNull(params[item]) && params[item] !== 0 && params[item] !== '0') {
        delete params[item];
      }
    });
    return params;
  },

  // 深拷贝
  deepCopy<T>(obj: T): T {
    function deepCopy(obj: any) {
      let newObj = Array.isArray(obj) ? [] : {}; //判断是深拷贝对象还是数组
      for (let i in obj) {
        if (typeof obj[i] === 'object') {
          newObj[i] = deepCopy(obj[i]); //  如果要拷贝的对象的属性依然是个复合类型，递归
        } else {
          newObj[i] = obj[i];
        }
      }
      return newObj;
    }

    return deepCopy(obj) as T;
  },

  /**
   * @description 格式化参数大写
   * @param {Object} formData 查询参数
   */
  formatParamsUpper(formData) {
    let params = JSON.parse(JSON.stringify(formData));
    params.startDate = CommonUtils.formatDateArr(params.dateTime, 0);
    params.endDate = CommonUtils.formatDateArr(params.dateTime, 1);
    Object.keys(params).forEach((item) => {
      if (CommonUtils.isEmptyOrNull(params[item]) && params[item] !== 0) {
        delete params[item];
      }
    });
    return params;
  },
  // 判断对象属性值是否皆为空
  judgeObjNull(obj) {
    let count = 0;
    let objLength = Object.keys(obj);
    for (let key in obj) {
      if (!obj[key] && obj[key] !== 0 && obj[key] !== '0') {
        count++;
      }
    }
    return count >= objLength.length;
  },

  // 判断对象属性值是否有为空
  judgeObjSomeNull(obj, arr = []) {
    for (let key in obj) {
      if (arr.includes(key)) {
        continue;
      }
      if (CommonUtils.isEmptyOrNull(obj[key])) {
        return key;
      }
    }
    return false;
  },

  // 判断数组对象属性是否皆为空
  judgeArrNull(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i]) {
        return true;
      } else {
        let flag = this.judgeObjSomeNull(arr[i]);
        if (flag) return true;
      }
    }
    return false;
  },
  /**
   * @description 格式化单个日期参数
   * @param {Date,String}
   */
  formatDate(date, format = 'yyyy/MM/dd HH:mm:ss') {
    if (!date) return null;
    if (Array.isArray(date)) {
      return [new Date(date[0]).Format(format), new Date(date[1]).Format(format)];
    }
    return new Date(date).Format(format);
  },

  /**
   * @description 金额四舍五入，千位分隔
   * @param {*} current
   * @returns
   */
  numberFormatter(current) {
    current *= 1;
    if (CommonUtils.isNumber(current)) {
      let num = Math.round(current);
      return Math.abs(num) < 1000 ? num : num.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,');
    } else {
      return current;
    }
  },
  /**
   * @description 最多保留两位
   * @param {String} val
   * @returns
   */
  keepTwo(val) {
    if (!CommonUtils.isString(val)) {
      return val;
    }
    let pointIndex = val.indexOf('.');
    let isFloat = pointIndex != -1;
    if (isFloat && val.length > pointIndex + 2 + 1) {
      val = val.substring(0, pointIndex + 2 + 1);
    }
    return val;
  },

  //将base64转换为blob
  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime,
    });
  },
  //将blob转换为file
  blobToFile(base64Data, fileName) {
    let theBlob = this.dataURLtoBlob(base64Data);
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  },

  // 函数节流
  throttle(method, delay, duration) {
    let timer = null;
    let begin = new Date();
    return function () {
      let context = this,
        args = arguments;
      let current = new Date();
      clearTimeout(timer);
      if (current - begin >= duration) {
        method.apply(context, args);
        begin = current;
      } else {
        timer = setTimeout(() => {
          method.apply(context, args);
        }, delay);
      }
    };
  },

  throttleUtil(func, wait) {
    let previous = 0;
    return function () {
      let now = Date.now();
      let context = this;
      let args = arguments;
      if (now - previous > wait) {
        previous = now;
        return func.apply(context, args);
      }
    };
  },

  // 数组去重
  distinct(arr: Array<any>) {
    let result = [];
    let obj = {};
    for (let i of arr) {
      if (!obj[i]) {
        result.push(i);
        obj[i] = 1;
      }
    }
    return result;
  },

  //对象数组根据key去重
  distinctByKey<T extends Record<string, any>>(arr: Array<T>, key: keyof T): T[] {
    let obj: Record<any, boolean> = {};
    return arr.reduce((preArr: Array<T>, currentItem: T) => {
      if (obj[currentItem[key]]) {
        return preArr;
      } else {
        obj[currentItem[key]] = true;
        return preArr.concat([currentItem]);
      }
    }, [] as Array<T>);
  },

  insertValueToArr(list: any[], flag: any, key: string, children: string, obj: any): any[] {
    return list.map((item) => {
      if (item[key] === flag) {
        return {
          ...item,
          [children]: obj,
        };
      } else if (item[children] && item[children].length) {
        return {
          ...item,
          [children]: CommonUtils.insertValueToArr(item[children], flag, key, children, obj),
        };
      } else {
        return item;
      }
    });
  },

  /**
   * 深层对象获取
   * @param {*} obj 传入需要获取的对象数组
   * @param {*} paths 路径，['a', 'b', 'c', 'd'] || 'a.b.c.d' || '0.a.1.b'
   * @returns 获取后的对象属性，如果没有返回undefined
   */
  getDeepObj(obj: object, paths: string) {
    if (typeof paths === 'string') {
      paths = paths.split('.');
    }

    function myReducer(arr, reducer, initVal) {
      for (let i = 0; i < arr.length; i++) {
        initVal = reducer(initVal, arr[i], i, arr);
      }
      return initVal;
    }

    return myReducer(
      paths,
      (value, key) => {
        if (!value && value !== 0 && value !== '0') {
          return undefined;
        }
        if (/^[0-9]+$/.test(key)) {
          key = Number(key);
        }
        return value[key];
      },
      obj,
    );
  },

  //获取count天前后的日期
  getTime(count) {
    let dd = new Date();
    dd.setDate(dd.getDate() + count);
    let year = dd.getFullYear();
    let mon = dd.getMonth() + 1;
    let day = dd.getDate();
    return year + '-' + mon + '-' + day;
  },

  /**
   * @description 表单校验必填
   */
  validateFieldsRequired(value: any, errMsg: string) {
    let errorArr: any[] = [];
    if (CommonUtils.isEmptyOrNull(value)) {
      errorArr = [{ message: errMsg }];
    }
    return errorArr;
  },

  /**
   * @description 获取相对时间差
   *
   */
  diffTime(startDate: Date, endDate: Date): string {
    var diff = endDate.getTime() - startDate.getTime(); //时间差的毫秒数
    if (diff < 0) {
      return '0秒';
    }
    //计算出相差天数
    var days = Math.floor(diff / (24 * 3600 * 1000));

    //计算出小时数
    var leave1 = diff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));

    //计算相差秒数
    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);

    var returnStr = seconds + '秒';
    if (minutes > 0) {
      returnStr = minutes + '分' + returnStr;
    }
    if (hours > 0) {
      returnStr = hours + '小时' + returnStr;
    }
    if (days > 0) {
      returnStr = days + '天' + returnStr;
    }
    return returnStr;
  },

  /**
   * 判断数组是否重复
   */
  isRepeatArr(arr: any[]) {
    let hash = {};

    for (let i in arr) {
      if (hash[arr[i]]) return true;

      hash[arr[i]] = true;
    }

    return false;
  },

  /**
   * 根据数值切割数组
   */
  sliceArrayByNum<T>(arr: Array<T>, num: number): Array<Array<T>> {
    let result: Array<Array<T>> = [];
    const len = Math.ceil(arr.length / num);
    for (let i = 0; i < len; i++) {
      if (i === len - 1) {
        result[i] = arr.slice(i * num, arr.length);
      } else {
        result[i] = arr.slice(i * num, (i + 1) * num);
      }
    }
    return result;
  },

  /**
   *  装换数组对象为对象数组
   */
  transformArrayToObject(arr: Array<any>): object {
    let obj = {};
    arr.forEach((item) => {
      const keys = Object.keys(item);
      keys.forEach((key) => {
        if (obj[key]) {
          obj[key].push(item[key]);
        } else {
          obj[key] = [];
          obj[key].push(item[key]);
        }
      });
    });
    return obj;
  },

  /**
   * 如果target(也就是FirstOBJ[key])存在，
   * 且是对象的话再去调用deepObjectMerge，
   * 否则就是FirstOBJ[key]里面没这个对象，需要与SecondOBJ[key]合并
   */
  deepObjectMerge(FirstOBJ: object, SecondOBJ: object) {
    // 深度合并对象
    if (Object.keys(SecondOBJ).length === 0) {
      return SecondOBJ;
    }
    for (let key in SecondOBJ) {
      FirstOBJ[key] =
        FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]'
          ? CommonUtils.deepObjectMerge(FirstOBJ[key], SecondOBJ[key])
          : SecondOBJ[key];
    }
    return FirstOBJ;
  },

  /**
   * 如果target(也就是FirstOBJ[key])存在，
   * 且是对象的话再去调用deepObjectMerge，
   * 否则就是FirstOBJ[key]里面没这个对象，需要与SecondOBJ[key]合并
   */
  deepMergeObject(FirstOBJ: { [key: string]: any }, SecondOBJ: { [key: string]: any }) {
    // 深度合并对象
    if (Object.keys(SecondOBJ).length === 0) {
      return SecondOBJ;
    }
    for (let key in SecondOBJ) {
      FirstOBJ[key] =
        FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]'
          ? CommonUtils.deepMergeObject(FirstOBJ[key], SecondOBJ[key])
          : SecondOBJ[key];
    }
    return FirstOBJ;
  },

  /**
   * 数组中找最大(小)值,
   * @param arr 数值类型的一维数组
   * @param byUp 是否是升序，true：数组第一个为最小值，false：数组第一位为最大值
   */
  sortArr(arr: Array<number>, byUp: boolean) {
    const list = [...arr];
    return list.sort((a, b) => (byUp ? b - a : a - b));
  },

  /**
   * 格式化数值为
   *
   */
  formatNumber(num: number): number {
    if (num >= 1) {
      let str = Math.ceil(num).toString();
      let flag = false;
      return parseInt(
        str
          .split('')
          .reverse()
          .map((value, index, array) => {
            if (index === array.length - 1) {
              if (flag) {
                return parseInt(value) + 1 + '';
              }
              return value;
            } else if (index === array.length - 2) {
              if (parseInt(value) >= 5) {
                flag = true;
                return '0';
              } else {
                return '5';
              }
            } else {
              return '0';
            }
          })
          .reverse()
          .join(''),
      );
    } else if (num < 1 && num > 0) {
      let str = num.toString();
      const decimal: number = CommonUtils.formatNumber(parseInt(str.split('.')[1]));
      return parseFloat('0.' + decimal);
    } else if (num === 0) {
      return 0;
    } else {
      return CommonUtils.formatNumber(-num);
    }
  },

  /*
   * 根据value从labelMap中获取对应label
   * */
  mapLabelByValue(
    value: string | number,
    labelMap: { label: string | number; value: string | number }[],
    defaultLabel: string = '-',
  ) {
    const find = labelMap.find((item) => item.value === value);
    if (find) {
      return find.label;
    } else {
      return defaultLabel;
    }
  },
};
export function uuid() {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
}
/**
 * @description md5加密
 * @param {String} str
 */
export function getmd5(str: string): string {
  let encryption;
  let md5 = crypto.createHash('md5');
  md5.update(str);
  encryption = md5.digest('hex');
  return encryption;
}

/**
 * @description dec加密
 * @param {String} data 需要加密的数据
 * 商家后台管理系统与后端约定的key为”xm.quzhuangxiang“
 * @return {String} 加密后的字符串
 */
export function getDec(data: string): string {
  //用'aes192'算法和key密匙创建加密对象
  let cipher = crypto.createCipher('aes-128-ecb', 'xm.quzhuangxiang');
  let crypted = cipher.update(data, 'utf8', 'hex'); //添加数据
  crypted += cipher.final('hex'); //加密
  return crypted;
}

/**
 * @description dec解密
 * @param {String} encrypted 需要解密的数据
 * 商家后台管理系统与后端约定的key为”xm.quzhuangxiang“
 * @return {String} 返回解密后的字符串
 */
export function getStringFromDecrypt(encrypted: string) {
  var decipher = crypto.createDecipher('aes-128-ecb', 'xm.quzhuangxiang');
  var dec = decipher.update(encrypted, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

export function download(data: any, fileName: string, contentType?: string) {
  let elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';

  let blob = new Blob([data], {
    type: contentType || 'application/octet-stream',
  });

  elink.href = URL.createObjectURL(blob);

  document.body.appendChild(elink);
  elink.click();

  document.body.removeChild(elink);
}

export function downloadIamge(imgsrc: string, name: string) {
  //下载图片地址和图片名
  let image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = function () {
    let canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    let url = canvas.toDataURL('image/png'); //得到图片的base64编码数据
    let a = document.createElement('a'); // 生成一个a元素
    let event = new MouseEvent('click'); // 创建一个单击事件
    a.download = name || 'photo'; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
    // document.body.removeChild(canvas);
    // document.body.removeChild(a);
  };
  image.src = imgsrc;
}

/**
 * @description 获取店铺信息
 * @returns storeData
 */
export function getStoreInfo() {
  const storeData: any = localStorage.getItem('storeData') || '';

  if (storeData) {
    return JSON.parse(storeData);
  } else {
    return undefined;
  }
}

/**
 * @description 获取店铺Id
 * @returns storeId
 */
export function getStoreId() {
  const storeData: any = getStoreInfo();
  if (!storeData) return undefined;
  return CommonUtils.getDeepObj(storeData, 'storeInfoResp.id');
}

export function copyToClipboard(content) {
  // 创建元素用于复制
  let aux = document.createElement('input');

  // 设置元素内容
  aux.setAttribute('value', content);

  // 将元素插入页面进行调用
  document.body.appendChild(aux);

  // 复制内容
  aux.select();

  // 将内容复制到剪贴板
  document.execCommand('copy');

  // 删除创建元素
  document.body.removeChild(aux);

  //提示
  return '复制内容成功：' + aux.value;
}

//金额格式化+-符号
export function moneyFormat(value) {
  if (value == 0) return value;
  if (!value) return '-';
  let valueData = value;
  if (value < 0) {
    value = Number(value.toString().replace('-', ''));
  }
  var s = parseFloat((value + '').replace(/[^\d\.-]/g, '')).toFixed(2) + '';
  var l = s.split('.')[0].split('').reverse(),
    r = s.split('.')[1],
    t = '';
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
  }
  var valuestring = t.split('').reverse().join('') + '.' + r;
  return valueData > 0 ? '+' + valuestring : '-' + valuestring;
}

//金额千位分隔符
export function toThoudIdo(s, n) {
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
  var l = s.split('.')[0].split('').reverse(),
    r = s.split('.')[1],
    t = '';
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
  }
  return t.split('').reverse().join('') + '.' + r;
}

export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

export function toThousandFilter2(num) {
  return (+num || 0).toString();
}

export function tranNumber(num: string, point: number) {
  // 将数字转换为字符串,然后通过split方法用.分隔,取到第0个
  let numStr = num.toString().split('.')[0];
  if (numStr.length < 6) {
    // 判断数字有多长,如果小于6,,表示10万以内的数字,让其直接显示
    return num;
  } else if (numStr.length >= 6 && numStr.length <= 8) {
    // 如果数字大于6位,小于8位,让其数字后面加单位万
    let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point);
    // 由千位,百位组成的一个数字
    return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
  } else if (numStr.length > 8) {
    // 如果数字大于8位,让其数字后面加单位亿
    let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
    return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
  }
}
