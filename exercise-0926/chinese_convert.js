var convert = require('chinese_convert')
var cn = '林孟勳不要再玩神魔了'
var tw = convert.cn2tw(cn)
var cn2 = convert.tw2cn(tw)

console.log('cn=%s => tw=%s', cn, tw)
console.log('tw=%s => cn2=%s', tw, cn2)