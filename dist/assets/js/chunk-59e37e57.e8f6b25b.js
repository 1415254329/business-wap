(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-59e37e57"],{"504c":function(e,t,i){var o=i("0d58"),s=i("6821"),n=i("52a7").f;e.exports=function(e){return function(t){var i,r=s(t),a=o(r),u=a.length,c=0,l=[];while(u>c)n.call(r,i=a[c++])&&l.push(e?[i,r[i]]:r[i]);return l}}},6279:function(e,t,i){},8615:function(e,t,i){var o=i("5ca1"),s=i("504c")(!1);o(o.S,"Object",{values:function(e){return s(e)}})},a30e:function(e,t,i){"use strict";i.r(t);var o=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("Row",{attrs:{gutter:16}},[i("Col",{attrs:{span:"6"}},[i("Card",[i("div",{staticClass:"title"},[i("span",[e._v("职位")]),i("span",[e._v("当前选择:"+e._s(e.curPositionStr||"无"))])]),i("el-tree",{ref:"positions",attrs:{data:e.positions,"node-key":"id","expand-on-click-node":!1,props:{label:"alias",children:"positions"}},on:{"node-click":e.positionSelected}})],1)],1),i("Col",{attrs:{span:"4"}},[i("Card",[i("div",[e._v("会员等级")]),i("RadioGroup",{staticClass:"radio-button-ver",attrs:{type:"button",vertical:""},on:{"on-change":e.memberSelect},model:{value:e.memberKey,callback:function(t){e.memberKey=t},expression:"memberKey"}},[i("Radio",{attrs:{label:"all"}},[e._v("全部不区分")]),i("Radio",{attrs:{label:"normal"}},[e._v("散客")]),e._l(e.memberRule,(function(t,o){return i("Radio",{key:o,attrs:{label:t.id}},[e._v(e._s(t.alias))])}))],2)],1)],1),i("Col",{attrs:{span:"4"}},[i("Card",[i("div",[e._v("开卡提成设置")]),i("RadioGroup",{staticClass:"radio-button-ver",attrs:{value:e.curEmployeeNum,type:"button"},on:{"on-change":e.setEmployeeNum}},[i("Radio",{attrs:{label:1}},[e._v("单人开卡提成设置")]),i("Radio",{attrs:{label:2}},[e._v("两人开卡提成设置")]),i("Radio",{attrs:{label:3}},[e._v("三人开卡提成设置")])],1)],1)],1),i("Col",{attrs:{span:"10"}},[i("Card",[i("div",[e._v("规则设置")]),i("Form",{ref:"calculationRule",attrs:{model:e.calculationRule,"label-width":80}},[i("FormItem",{staticClass:"radio-inside",attrs:{label:"计算类型"}},[i("RadioGroup",{model:{value:e.calculationRule[e.curEmployeeNum].employees.type,callback:function(t){e.$set(e.calculationRule[e.curEmployeeNum].employees,"type",t)},expression:"calculationRule[curEmployeeNum].employees.type"}},[i("Radio",{attrs:{label:1}},[e._v("实付业绩")])],1)],1),e._l(e.calculationRule[e.curEmployeeNum].employees,(function(t,o){return i("div",{key:o},[i("Card",{staticClass:"mt"},[i("p",{attrs:{slot:"title"},slot:"title"},[e._v("会员-("+e._s(o+1)+"人提成)")]),i("p",{staticClass:"mt"},[e._v("指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curEmployeeNum].employees[o].commission.specified.value,callback:function(t){e.$set(e.calculationRule[e.curEmployeeNum].employees[o].commission.specified,"value",t)},expression:"calculationRule[curEmployeeNum].employees[index].commission.specified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curEmployeeNum].employees[o].commission.specified.type,callback:function(t){e.$set(e.calculationRule[e.curEmployeeNum].employees[o].commission.specified,"type",t)},expression:"calculationRule[curEmployeeNum].employees[index].commission.specified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1),i("p",{staticClass:"mt"},[e._v("非指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curEmployeeNum].employees[o].commission.unspecified.value,callback:function(t){e.$set(e.calculationRule[e.curEmployeeNum].employees[o].commission.unspecified,"value",t)},expression:"calculationRule[curEmployeeNum].employees[index].commission.unspecified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curEmployeeNum].employees[o].commission.unspecified.type,callback:function(t){e.$set(e.calculationRule[e.curEmployeeNum].employees[o].commission.unspecified,"type",t)},expression:"calculationRule[curEmployeeNum].employees[index].commission.unspecified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1)],1),i("Card",{staticClass:"mt"},[i("p",{attrs:{slot:"title"},slot:"title"},[e._v("会员-("+e._s(o+1)+"人业绩)")]),i("p",{staticClass:"mt"},[e._v("指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curEmployeeNum].employees[o].perform.specified.value,callback:function(t){e.$set(e.calculationRule[e.curEmployeeNum].employees[o].perform.specified,"value",t)},expression:"calculationRule[curEmployeeNum].employees[index].perform.specified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curEmployeeNum].employees[o].perform.specified.type,callback:function(t){e.$set(e.calculationRule[e.curEmployeeNum].employees[o].perform.specified,"type",t)},expression:"calculationRule[curEmployeeNum].employees[index].perform.specified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1),i("p",{staticClass:"mt"},[e._v("非指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curEmployeeNum].employees[o].perform.unspecified.value,callback:function(t){e.$set(e.calculationRule[e.curEmployeeNum].employees[o].perform.unspecified,"value",t)},expression:"calculationRule[curEmployeeNum].employees[index].perform.unspecified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curEmployeeNum].employees[o].perform.unspecified.type,callback:function(t){e.$set(e.calculationRule[e.curEmployeeNum].employees[o].perform.unspecified,"type",t)},expression:"calculationRule[curEmployeeNum].employees[index].perform.unspecified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1)],1),i("Card",{staticClass:"mt"},[i("p",{attrs:{slot:"title"},slot:"title"},[e._v("会员-("+e._s(o+1)+"人赠金业绩)")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curEmployeeNum].employees[o].grants.value,callback:function(t){e.$set(e.calculationRule[e.curEmployeeNum].employees[o].grants,"value",t)},expression:"calculationRule[curEmployeeNum].employees[index].grants.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curEmployeeNum].employees[o].grants.type,callback:function(t){e.$set(e.calculationRule[e.curEmployeeNum].employees[o].grants,"type",t)},expression:"calculationRule[curEmployeeNum].employees[index].grants.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1)],1)],1)})),i("div",{staticClass:"mt"},[i("FormItem",{staticClass:"btn-wrapper"},[i("Button",{attrs:{type:"primary"},on:{click:function(t){e.saveRule("calculationRule")}}},[e._v("保存")]),i("Button",{attrs:{type:"error"},on:{click:function(t){e.handleDelete(e.curId)}}},[e._v("删除")])],1)],1)],2)],1)],1)],1)},s=[],n=i("be94"),r=(i("7514"),i("456d"),i("ac6a"),i("8615"),i("cadf"),i("551c"),i("097d"),i("b39c")),a={data:function(){return{curId:0,curRule:{},allRules:{},curPositionStr:"",positions:[],memberKey:"all",memberRule:"",curEmployeeNum:1,calculationRule:r["c"],form:{position_id:"",source:"tenant_member",rule:{}},treeIdCache:""}},watch:{"form.position_id":function(){this.memberKey&&this.isRuleExist()},memberKey:function(){this.form.position_id&&this.isRuleExist()},curEmployeeNum:function(){this.isRuleExist()}},mounted:function(){this.init()},methods:{init:function(){var e=this;this.$api.common.getPosition().then((function(t){e.positions=Object.values(t.data).filter((function(e){return 0===e.status})),e.positions.map((function(e){e.positions=Object.keys(e.positions).length?Object.values(e.positions).filter((function(e){return 0===e.status})):[]}))})),this.memberRule=Object.values(JSON.parse(this.$store.getters.userInfo.member_rule)),this.$api.user.getRules().then((function(t){e.allRules=t.data.tenant_member||{}}))},positionSelected:function(e){this.setPositionId(e.id);var t=this.positions.find((function(t){return t.positions.find((function(t){return e.id===t.id}))})),i=t?t.id:-1;if(this.allRules[e.id]){var o=this.allRules[e.id];if(this.curId=o.id,o.rule)this.form.rule=JSON.parse(o.rule)||{};else if(this.allRules[i]){var s=this.allRules[i];this.form.rule=JSON.parse(s.rule)||{}}}else if(this.allRules[i]){var n=this.allRules[i];this.form.rule=JSON.parse(n.rule)||{}}else this.form.rule={}},memberSelect:function(e){this.memberKey=e},setEmployeeNum:function(e){this.curEmployeeNum=e,this.$forceUpdate()},setPositionId:function(e){var t=this;this.form.position_id=e,this.positions.some((function(i){if(e===i.id)return t.curPositionStr=i.alias,!0;var o=i.alias;null!==i.positions&&Object.values(i.positions).some((function(i){if(e===i.id)return o+=">".concat(i.alias),t.curPositionStr=o,!0}))}))},isRuleExist:function(){if(this.form.rule&&this.form.rule[this.memberKey])this.calculationRule=this.form.rule[this.memberKey];else if(this.form.rule&&this.form.rule["all"])this.calculationRule=JSON.parse(JSON.stringify(this.form.rule["all"]));else{this.calculationRule[this.curEmployeeNum].employees=[];for(var e=0;e<this.curEmployeeNum;e++)this.calculationRule[this.curEmployeeNum].employees.push(JSON.parse(JSON.stringify(r["d"])))}},saveRule:function(e){this.form.position_id?this.memberKey?(this.form.rule[this.memberKey]=this.calculationRule,this.allRules[this.form.position_id]?this.handleEdit(e):this.handleSubmit(e)):this.$Message.error("请先选择要修改的会员等级"):this.$Message.error("请先选择要修改的职位")},handleSubmit:function(e){var t=this;this.$refs[e].validate((function(e){if(e){var i=JSON.parse(JSON.stringify(t.form));i.rule=JSON.stringify(i.rule),t.$api.user.add_royalty(i).then((function(e){t.afterOperation(),t.$Message.success("保存成功")}))}else t.$Message.error(res.message)}))},handleEdit:function(e){var t=this;this.$refs[e].validate((function(e){if(e){var i=Object(n["a"])({},t.form);i.rule=JSON.stringify(i.rule),t.$api.user.edit_royalty(t.curId,i).then((function(e){t.afterOperation(),t.$Message.success("保存成功")}))}else t.$Message.error(res.message)}))},handleDelete:function(e){var t=this;this.$Modal.confirm({title:"信息",content:"是否确认删除?",onOk:function(){var i=this;this.$api.user.del_royalty(e).then((function(e){t.clear(),i.$Message.success("删除成功")}))}})},afterOperation:function(){var e=this;this.$api.user.getRules().then((function(t){e.allRules=t.data.tenant_member||{},e.positionSelected({id:e.form.position_id}),setTimeout((function(){e.isRuleExist()}),0)}))},clear:function(){var e=this;this.init(),this.$nextTick((function(){e.memberKey="all",e.form.position_id="",e.form.rule={},e.curPositionStr=""}))}}},u=a,c=(i("e91c"),i("2877")),l=Object(c["a"])(u,o,s,!1,null,"819201fc",null);l.options.__file="card.vue";t["default"]=l.exports},b39c:function(e,t,i){"use strict";i.d(t,"j",(function(){return s})),i.d(t,"g",(function(){return n})),i.d(t,"i",(function(){return a})),i.d(t,"h",(function(){return u})),i.d(t,"k",(function(){return c})),i.d(t,"e",(function(){return l})),i.d(t,"d",(function(){return m})),i.d(t,"c",(function(){return p})),i.d(t,"n",(function(){return d})),i.d(t,"m",(function(){return f})),i.d(t,"b",(function(){return y})),i.d(t,"f",(function(){return v})),i.d(t,"a",(function(){return b})),i.d(t,"l",(function(){return _}));i("7f7f"),i("7514"),i("6762"),i("2fdb"),i("c5f6"),i("456d"),i("ac6a"),i("5df3"),i("f400"),i("cadf"),i("551c"),i("097d");var o=i("4360");function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t={member_id:"",payment_arrears:"",payment_balance:"",payment_giving:"",payment_integral:"",order_no:"",ignore_order_no:0,shopping_cart:"",consume_type:"",system_calculate:"",gross_price:"",profit_price:"",integral:"",prestore_price:"",giving_price:"",arrears_price:"",alias:"",phone:"",gender:"",payments:"",coupones:"",commodity_surplus:"",meter_oredes:"",meter_combo_oredes:"",order_time:"",memo:"",is_new_member:0,notify:1,notify_format:"",bonus:"",body_count:""};return h(t,e),t}function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return[{type:e,staff_id:"",performance_price:"",dividends_price:"",specified_switch:0,source_id:0,source_alias:t,source_weight:0,index:1,show_num:"",cur_position:{},rule:""}]}function a(){return[u()]}function u(){return{type:"",category:{},good:{},originalPrice:"",qty:"",discount:"",discountPrice:"",presentPrice:"",discountPresentPrice:"",bonusList:n()}}function c(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"normal",t=[{payment_name:"现金",amount_price:""},{payment_name:"微信",amount_price:""},{payment_name:"支付宝",amount_price:""},{payment_name:"银联",amount_price:""},{payment_name:"pos",amount_price:""},{payment_name:"免单",amount_price:""},{payment_name:"收钱吧",amount_price:""},{payment_name:"美团",amount_price:""},{payment_name:"其他",amount_price:""}];if("member"===e){var i=JSON.parse(JSON.stringify(t));return i.splice(0,0,{payment_name:"余额",amount_price:""},{payment_name:"赠金",amount_price:""},{payment_name:"欠款",amount_price:""},{payment_name:"积分",amount_price:""}),i}return t}var l={type:1,commission:{specified:{type:1,value:0},unspecified:{type:1,value:0}},perform:{specified:{type:1,value:0},unspecified:{type:1,value:0}},grants:{type:1,value:0},cost:{specified:{type:1,value:0},unspecified:{type:1,value:0}},twice:{specified:{type:1,value:0},unspecified:{type:1,value:0}}},m={commission:{specified:{type:1,value:0},unspecified:{type:1,value:0}},perform:{specified:{type:1,value:0},unspecified:{type:1,value:0}},grants:{type:1,value:0}},p={1:{type:1,employees:[JSON.parse(JSON.stringify(m))]},2:{type:1,employees:[JSON.parse(JSON.stringify(m)),JSON.parse(JSON.stringify(m))]},3:{type:1,employees:[JSON.parse(JSON.stringify(m)),JSON.parse(JSON.stringify(m)),JSON.parse(JSON.stringify(m))]}},d={type:1,commission:{specified:{type:1,value:0},unspecified:{type:1,value:0}},perform:{specified:{type:1,value:0},unspecified:{type:1,value:0}},grants:{type:1,value:0},cost:{specified:{type:1,value:0},unspecified:{type:1,value:0}},twice:{specified:{type:1,value:0},unspecified:{type:1,value:0}}},f={};function y(e,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]&&arguments[3],s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{},n=100,a=new Map([["commission",c],["perform",m],["grants",p],["pgSum",l],["cost",d],["twice",f]]);Object.keys(e).map((function(t){e[t].value&&(e[t].value=Number(e[t].value)),["type","grants"].includes(t)||(e[t]=o?e[t].specified:e[t].unspecified)}));var u={cost:0,twice:0,perform:0,grants:0,pgSum:0,commission:0};return s.custom&&h(u,s.custom),s.assign?(a.get(s.assign)(e[s.assign],u),u):(Object.keys(u).forEach((function(t){if(!u[t]&&(!s.custom||!s.custom.hasOwnProperty(t))&&("pgSum"===t&&a.get(t)(u),e.hasOwnProperty(t))){if(1!==e[t].type&&2!==e[t].type)throw new Error("错误类型值r.type：".concat(r.type));e[t].value&&a.get(t)(e[t],u)}})),Object.keys(u).map((function(e){u[e]=Number(u[e]).toFixed(2)})),u);function c(e,i){var o=i.pgSum||t-i.cost-i.twice||0;1===e.type?i.commission=o*e.value/n:2===e.type&&(i.commission=Number(e.value))}function l(e){e.pgSum=e.perform+e.grants}function m(e,i){var o=t-i.cost-i.twice;1===e.type?i.perform=o*e.value/n:2===e.type&&(i.perform=Number(e.value))}function p(e,t){1===e.type?t.grants=i*e.value/n:2===e.type&&(t.grants=Number(e.value))}function d(e,i){1===e.type?i.cost=t*e.value/n:2===e.type&&(i.cost=Number(e.value))}function f(e,i){1===e.type?i.twice=(t-i.cost)*e.value/n:2===e.type&&(i.twice=Number(e.value))}}var v=10;function b(e){var t={type:"commodity",num:0,price:0,memberPrice:0,cost:0,onlyDiscountByGood:0,isSpecial:0,recoup:0,discount:1,memberDiscount:1,good:{},memberRule:{}};h(t,e);var i=Boolean(Object.keys(t.memberRule).length),o=t.good;if(t.price=o.sale_price,t.memberPrice=o.member_price,t.cost=o.cost_price,t.onlyDiscountByGood=o.discount_switch,t.isSpecial=o.special_switch,t.recoup=o.again_member_switch,t.discount=o.discount,t.discount/=v,i)switch(t.type){case"commodity":t.memberDiscount=Number(t.memberRule.commodity)/v;break;case"services":t.memberDiscount=Number(t.memberRule.project)/v;break;case"count":t.memberDiscount=Number(t.memberRule.project)/v;break;default:break}var s={type:-1,originalPrice:0,discount:10,discountPrice:0,originalPriceAll:0,discountPriceAll:0};if(!t.type)return s;var n=!1,r={};if(i&&"services"===t.type&&t.good.member_rule){var a=JSON.parse(t.good.member_rule);n=a[t.memberRule.id],r=a[t.memberRule.id]}return s.originalPrice=i&&"count"!==t.type?t.memberPrice:t.price,"count"===t.type?!t.good.special_switch&&i?(s.discount=t.memberDiscount,s.discountPrice=s.originalPrice*s.discount):(s.discount=1,s.discountPrice=s.originalPrice):n?1===Number(r.type)?(s.discount=1,s.discountPrice=Number(r.ratio)):(s.discount=Number(r.ratio)/v,s.discountPrice=s.originalPrice*s.discount):t.onlyDiscountByGood?(s.type=2,s.discount=t.discount,s.discountPrice=s.originalPrice*s.discount):t.recoup?(s.type=3,s.discount=t.discount*(t.memberDiscount||1),s.discountPrice=s.originalPrice*s.discount):(s.type=1,s.discount=t.discount,s.discountPrice=s.originalPrice),s.originalPriceAll=s.originalPrice*t.num,s.discountPriceAll=s.discountPrice*t.num,Object.keys(s).forEach((function(e){s[e]="discount"!==e?Number(s[e]).toFixed(2):Number(10*s[e]).toFixed(1)})),s}function h(e,t){Object.keys(t).map((function(i){e.hasOwnProperty(i)&&(e[i]=t[i])}))}function _(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>2?arguments[2]:void 0,i=o["a"].getters.userInfo,s="";if(["good","count"].includes(e)){var n=[];t.goodList&&t.goodList.map((function(e){if(Object.keys(e.good).length&&e.good.id){var t=n.find((function(t){return t.id===e.good.id}));t?(t.qty+=Number(e.qty),t.price+=Number(e.discountPriceAll)):n.push({id:e.good.id,name:e.good.alias,qty:Number(e.qty),price:Number(e.discountPriceAll)})}})),n.map((function(e,t){s+="".concat(e.name,"(数量：").concat(e.qty,"，价格：").concat(e.price,")").concat(t===n.length-1?"":",")}))}var r={lable:"card"===e||"recharge"===e?"充值":"消费",sms:{title:"".concat(i.sms_title),remake:"".concat(i.sms_remake)},wechat:{first:s,remake:"".concat(i.sms_remake," ").concat(i.telephone)}};return"count"===e&&(r.sms.meter=s),"card"===e?r.wechat.first="开卡 ".concat(t.gross_price,"元"):"recharge"===e?r.wechat.first="充值 ".concat(t.gross_price,"元"):"consume"===e&&(r.wechat.first="快速消费 ".concat(t.gross_price,"元")),r}},e91c:function(e,t,i){"use strict";var o=i("6279"),s=i.n(o);s.a},f400:function(e,t,i){"use strict";var o=i("c26b"),s=i("b39a"),n="Map";e.exports=i("e0b8")(n,(function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}}),{get:function(e){var t=o.getEntry(s(this,n),e);return t&&t.v},set:function(e,t){return o.def(s(this,n),0===e?0:e,t)}},o,!0)}}]);