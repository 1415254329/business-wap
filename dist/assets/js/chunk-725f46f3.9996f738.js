(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-725f46f3"],{"504c":function(e,t,i){var r=i("0d58"),c=i("6821"),a=i("52a7").f;e.exports=function(e){return function(t){var i,o=c(t),u=r(o),n=u.length,s=0,l=[];while(n>s)a.call(o,i=u[s++])&&l.push(e?[i,o[i]]:o[i]);return l}}},8615:function(e,t,i){var r=i("5ca1"),c=i("504c")(!1);r(r.S,"Object",{values:function(e){return c(e)}})},9600:function(e,t,i){"use strict";i.r(t);var r=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("Row",{attrs:{gutter:16}},[i("Col",{attrs:{span:"6"}},[i("Card",[i("div",{staticClass:"title"},[i("span",[e._v("职位")]),i("span",[e._v("当前选择:"+e._s(e.curPositionStr||"无"))])]),i("el-tree",{ref:"positions",attrs:{data:e.positions,"node-key":"id","expand-on-click-node":!1,props:{label:"alias",children:"positions"}},on:{"node-click":e.positionSelected}})],1)],1),i("Col",{attrs:{span:"4"}},[i("Card",[i("div",[e._v("会员等级")]),i("RadioGroup",{staticClass:"radio-button-ver",attrs:{type:"button",vertical:""},on:{"on-change":e.memberSelect},model:{value:e.memberKey,callback:function(t){e.memberKey=t},expression:"memberKey"}},[i("Radio",{attrs:{label:"all"}},[e._v("全部不区分")]),i("Radio",{attrs:{label:"normal"}},[e._v("散客")]),e._l(e.memberRule,(function(t,r){return i("Radio",{key:r,attrs:{label:t.id}},[e._v(e._s(t.alias))])}))],2)],1)],1),i("Col",{attrs:{span:"6"}},[i("Card",[i("div",[e._v("项目")]),i("div",{staticClass:"menu"},[i("div",{staticClass:"menu-level1"},e._l(e.category,(function(t,r){return i("div",{key:r,staticClass:"menu-level1-item",class:{active:e.curCategoryId==t.id},on:{click:function(i){e.categorySelect(t)}}},[e._v("\n          "+e._s(t.alias)+"\n        ")])}))),i("div",{staticClass:"menu-level2"},e._l(e.counts[e.curCategoryId],(function(t,r){return i("div",{key:r,staticClass:"menu-level2-item",class:{active:e.curCountId==t.id},on:{click:function(i){e.countsSelect(t)}}},[e._v("\n          "+e._s(t.alias)+"\n        ")])})))])])],1),i("Col",{attrs:{span:"8"}},[i("Card",[i("div",[e._v("规则设置")]),e.calculationRule[e.curCategoryId]&&e.calculationRule[e.curCategoryId][e.curCountId]?i("Form",{ref:"calculationRule",attrs:{model:e.calculationRule[this.curCategoryId][this.curCountId],"label-width":80}},[i("FormItem",{staticClass:"radio-inside",attrs:{label:"提成基数"}},[i("RadioGroup",{model:{value:e.calculationRule[e.curCategoryId][e.curCountId].type,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId],"type",t)},expression:"calculationRule[curCategoryId][curCountId].type"}},[i("Radio",{attrs:{label:1}},[e._v("实付")]),i("Radio",{attrs:{label:2}},[e._v("原价")])],1)],1),i("Card",{staticClass:"mt"},[i("p",{attrs:{slot:"title"},slot:"title"},[e._v("提成")]),i("p",{staticClass:"mt"},[e._v("指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curCategoryId][e.curCountId].commission.specified.value,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].commission.specified,"value",t)},expression:"calculationRule[curCategoryId][curCountId].commission.specified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curCategoryId][e.curCountId].commission.specified.type,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].commission.specified,"type",t)},expression:"calculationRule[curCategoryId][curCountId].commission.specified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1),i("p",{staticClass:"mt"},[e._v("非指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curCategoryId][e.curCountId].commission.unspecified.value,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].commission.unspecified,"value",t)},expression:"calculationRule[curCategoryId][curCountId].commission.unspecified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curCategoryId][e.curCountId].commission.unspecified.type,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].commission.unspecified,"type",t)},expression:"calculationRule[curCategoryId][curCountId].commission.unspecified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1)],1),i("Card",{staticClass:"mt"},[i("p",{attrs:{slot:"title"},slot:"title"},[e._v("业绩")]),i("p",{staticClass:"mt"},[e._v("指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curCategoryId][e.curCountId].perform.specified.value,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].perform.specified,"value",t)},expression:"calculationRule[curCategoryId][curCountId].perform.specified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curCategoryId][e.curCountId].perform.specified.type,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].perform.specified,"type",t)},expression:"calculationRule[curCategoryId][curCountId].perform.specified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1),i("p",{staticClass:"mt"},[e._v("非指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curCategoryId][e.curCountId].perform.unspecified.value,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].perform.unspecified,"value",t)},expression:"calculationRule[curCategoryId][curCountId].perform.unspecified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curCategoryId][e.curCountId].perform.unspecified.type,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].perform.unspecified,"type",t)},expression:"calculationRule[curCategoryId][curCountId].perform.unspecified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1)],1),i("Card",{staticClass:"mt"},[i("p",{attrs:{slot:"title"},slot:"title"},[e._v("赠金业绩")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curCategoryId][e.curCountId].grants.value,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].grants,"value",t)},expression:"calculationRule[curCategoryId][curCountId].grants.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curCategoryId][e.curCountId].grants.type,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].grants,"type",t)},expression:"calculationRule[curCategoryId][curCountId].grants.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1)],1),i("Card",{staticClass:"mt"},[i("p",{attrs:{slot:"title"},slot:"title"},[e._v("成本")]),i("p",{staticClass:"mt"},[e._v("指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curCategoryId][e.curCountId].cost.specified.value,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].cost.specified,"value",t)},expression:"calculationRule[curCategoryId][curCountId].cost.specified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curCategoryId][e.curCountId].cost.specified.type,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].cost.specified,"type",t)},expression:"calculationRule[curCategoryId][curCountId].cost.specified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1),i("p",{staticClass:"mt"},[e._v("非指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curCategoryId][e.curCountId].cost.unspecified.value,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].cost.unspecified,"value",t)},expression:"calculationRule[curCategoryId][curCountId].cost.unspecified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curCategoryId][e.curCountId].cost.unspecified.type,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].cost.unspecified,"type",t)},expression:"calculationRule[curCategoryId][curCountId].cost.unspecified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1)],1),i("Card",{staticClass:"mt"},[i("p",{attrs:{slot:"title"},slot:"title"},[e._v("二次成本")]),i("p",{staticClass:"mt"},[e._v("指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curCategoryId][e.curCountId].twice.specified.value,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].twice.specified,"value",t)},expression:"calculationRule[curCategoryId][curCountId].twice.specified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curCategoryId][e.curCountId].twice.specified.type,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].twice.specified,"type",t)},expression:"calculationRule[curCategoryId][curCountId].twice.specified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1),i("p",{staticClass:"mt"},[e._v("非指定")]),i("Input",{attrs:{type:"number"},model:{value:e.calculationRule[e.curCategoryId][e.curCountId].twice.unspecified.value,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].twice.unspecified,"value",t)},expression:"calculationRule[curCategoryId][curCountId].twice.unspecified.value"}},[i("RadioGroup",{staticClass:"radio-inside",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.calculationRule[e.curCategoryId][e.curCountId].twice.unspecified.type,callback:function(t){e.$set(e.calculationRule[e.curCategoryId][e.curCountId].twice.unspecified,"type",t)},expression:"calculationRule[curCategoryId][curCountId].twice.unspecified.type"}},[i("Radio",{attrs:{label:1}},[e._v("比例")]),i("Radio",{attrs:{label:2}},[e._v("固定")])],1)],1)],1),i("div",{staticClass:"mt"},[i("FormItem",{staticClass:"btn-wrapper"},[i("Button",{attrs:{type:"primary"},on:{click:function(t){e.saveRule("calculationRule")}}},[e._v("保存")]),i("Button",{attrs:{type:"error"},on:{click:function(t){e.handleDelete(e.curId)}}},[e._v("删除")])],1)],1)],1):e._e()],1)],1)],1)},c=[],a=(i("7514"),i("456d"),i("ac6a"),i("8615"),i("cadf"),i("551c"),i("097d"),i("b39c")),o={data:function(){return{curId:0,curRule:{},allRules:{},curPositionStr:"",positions:[],memberKey:"all",memberRule:"",curCategoryId:-1,category:[],curCountId:"all",counts:{},calculationRule:JSON.parse(JSON.stringify(a["m"])),form:{position_id:"",source:"tenant_meter",rule:{}},treeIdCache:""}},watch:{"form.position_id":function(){this.memberKey&&this.isRuleExist(),this.calculationRule[this.curCategoryId]||(this.calculationRule[this.curCategoryId]={}),this.calculationRule[this.curCategoryId][this.curProjectId]||(this.calculationRule[this.curCategoryId][this.curProjectId]=JSON.parse(JSON.stringify(a["n"])))},memberKey:function(){this.form.position_id&&this.isRuleExist()},curCategoryId:function(){this.calculationRule[this.curCategoryId]||(this.calculationRule[this.curCategoryId]={}),this.calculationRule[this.curCategoryId][this.curProjectId]||(this.calculationRule[this.curCategoryId][this.curProjectId]=JSON.parse(JSON.stringify(a["n"])))},curCountId:function(){this.calculationRule[this.curCategoryId][this.curCountId]||(this.calculationRule[this.curCategoryId][this.curCountId]=JSON.parse(JSON.stringify(a["n"])))}},mounted:function(){this.init()},methods:{init:function(){var e=this;this.$api.common.getPosition().then((function(t){e.positions=Object.values(t.data).filter((function(e){return 0===e.status})),e.positions.map((function(e){e.positions=Object.keys(e.positions).length?Object.values(e.positions).filter((function(e){return 0===e.status})):[]}))})),this.memberRule=Object.values(JSON.parse(this.$store.getters.userInfo.member_rule)),this.$api.user.getRules().then((function(t){e.allRules=t.data.tenant_meter||{}})),this.$api.common.getCategory().then((function(t){e.category=Object.values(t.data["tenant_meter"]||{}),e.curCategoryId=e.category[0]&&e.category[0].id})),this.$api.common.getMeter().then((function(t){Object.keys(t.data).map((function(e){t.data[e]=t.data[e]?Object.values(t.data[e]).filter((function(e){return 0===e.status})):{}})),e.counts=t.data}))},positionSelected:function(e){this.setPositionId(e.id);var t=this.positions.find((function(t){return t.positions.find((function(t){return e.id===t.id}))})),i=t?t.id:-1;if(this.allRules[e.id]){var r=this.allRules[e.id];if(this.curId=r.id,r.rule)this.form.rule=JSON.parse(r.rule)||{};else if(this.allRules[i]){var c=this.allRules[i];this.form.rule=JSON.parse(c.rule)||{}}}else if(this.allRules[i]){var a=this.allRules[i];this.form.rule=JSON.parse(a.rule)||{}}else this.form.rule={}},memberSelect:function(e){this.memberKey=e},categorySelect:function(e){this.curCategoryId=e.id,this.curCountId="all"},countsSelect:function(e){this.curCountId=e.id},setPositionId:function(e){var t=this;this.form.position_id=e,this.positions.some((function(i){if(e===i.id)return t.curPositionStr=i.alias,!0;var r=i.alias;null!==i.positions&&Object.values(i.positions).some((function(i){if(e===i.id)return r+=">".concat(i.alias),t.curPositionStr=r,!0}))}))},isRuleExist:function(){this.form.rule&&this.form.rule[this.memberKey]?this.calculationRule=this.form.rule[this.memberKey]:this.form.rule&&this.form.rule["all"]?this.calculationRule=JSON.parse(JSON.stringify(this.form.rule["all"])):(this.calculationRule[this.curCategoryId]={},this.calculationRule[this.curCategoryId][this.curCountId]=JSON.parse(JSON.stringify(a["n"])))},saveRule:function(e){var t=this;this.form.position_id?this.memberKey?this.curCategoryId?("all"===this.curCountId&&this.counts[this.curCategoryId].forEach((function(e){t.calculationRule[t.curCategoryId][e.id]=JSON.parse(JSON.stringify(t.calculationRule[t.curCategoryId]["all"]))})),this.form.rule[this.memberKey]=this.calculationRule,this.allRules[this.form.position_id]?this.handleEdit(e):this.handleSubmit(e)):this.$Message.error("请先选择要修改项目大类"):this.$Message.error("请先选择要修改的会员等级"):this.$Message.error("请先选择要修改的职位")},handleSubmit:function(e){var t=this;this.$refs[e].validate((function(e){if(e){var i=JSON.parse(JSON.stringify(t.form));i.rule=JSON.stringify(i.rule),t.$api.user.add_royalty(i).then((function(e){t.afterOperation(),t.$Message.success("保存成功")}))}else t.$Message.error(res.message)}))},handleEdit:function(e){var t=this;this.$refs[e].validate((function(e){if(e){var i=JSON.parse(JSON.stringify(t.form));i.rule=JSON.stringify(i.rule),t.$api.user.edit_royalty(t.curId,i).then((function(e){t.afterOperation(),t.$Message.success("保存成功")}))}else t.$Message.error(res.message)}))},handleDelete:function(e){var t=this;this.$Modal.confirm({title:"信息",content:"是否确认删除?",onOk:function(){var i=this;this.$api.user.del_royalty(e).then((function(e){t.clear(),i.$Message.success("删除成功")}))}})},afterOperation:function(){var e=this;this.$api.user.getRules().then((function(t){e.allRules=t.data.tenant_meter||{},e.positionSelected({id:e.form.position_id}),setTimeout((function(){e.isRuleExist()}),0)}))},clear:function(){var e=this;this.init(),this.$nextTick((function(){e.memberKey="all",e.form.position_id="",e.form.rule={},e.curPositionStr=""}))}}},u=o,n=(i("a764"),i("2877")),s=Object(n["a"])(u,r,c,!1,null,"ec545782",null);s.options.__file="countBuy.vue";t["default"]=s.exports},a764:function(e,t,i){"use strict";var r=i("f33d"),c=i.n(r);c.a},b39c:function(e,t,i){"use strict";i.d(t,"j",(function(){return a})),i.d(t,"g",(function(){return o})),i.d(t,"i",(function(){return u})),i.d(t,"h",(function(){return n})),i.d(t,"k",(function(){return s})),i.d(t,"e",(function(){return l})),i.d(t,"d",(function(){return d})),i.d(t,"c",(function(){return p})),i.d(t,"n",(function(){return m})),i.d(t,"m",(function(){return f})),i.d(t,"b",(function(){return y})),i.d(t,"f",(function(){return v})),i.d(t,"a",(function(){return g})),i.d(t,"l",(function(){return h}));i("7f7f"),i("7514"),i("6762"),i("2fdb"),i("c5f6"),i("456d"),i("ac6a"),i("5df3"),i("f400"),i("cadf"),i("551c"),i("097d");var c=i("4360");function a(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t={member_id:"",payment_arrears:"",payment_balance:"",payment_giving:"",payment_integral:"",order_no:"",ignore_order_no:0,shopping_cart:"",consume_type:"",system_calculate:"",gross_price:"",profit_price:"",integral:"",prestore_price:"",giving_price:"",arrears_price:"",alias:"",phone:"",gender:"",payments:"",coupones:"",commodity_surplus:"",meter_oredes:"",meter_combo_oredes:"",order_time:"",memo:"",is_new_member:0,notify:1,notify_format:"",bonus:"",body_count:""};return C(t,e),t}function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return[{type:e,staff_id:"",performance_price:"",dividends_price:"",specified_switch:0,source_id:0,source_alias:t,source_weight:0,index:1,show_num:"",cur_position:{},rule:""}]}function u(){return[n()]}function n(){return{type:"",category:{},good:{},originalPrice:"",qty:"",discount:"",discountPrice:"",presentPrice:"",discountPresentPrice:"",bonusList:o()}}function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"normal",t=[{payment_name:"现金",amount_price:""},{payment_name:"微信",amount_price:""},{payment_name:"支付宝",amount_price:""},{payment_name:"银联",amount_price:""},{payment_name:"pos",amount_price:""},{payment_name:"免单",amount_price:""},{payment_name:"收钱吧",amount_price:""},{payment_name:"美团",amount_price:""},{payment_name:"其他",amount_price:""}];if("member"===e){var i=JSON.parse(JSON.stringify(t));return i.splice(0,0,{payment_name:"余额",amount_price:""},{payment_name:"赠金",amount_price:""},{payment_name:"欠款",amount_price:""},{payment_name:"积分",amount_price:""}),i}return t}var l={type:1,commission:{specified:{type:1,value:0},unspecified:{type:1,value:0}},perform:{specified:{type:1,value:0},unspecified:{type:1,value:0}},grants:{type:1,value:0},cost:{specified:{type:1,value:0},unspecified:{type:1,value:0}},twice:{specified:{type:1,value:0},unspecified:{type:1,value:0}}},d={commission:{specified:{type:1,value:0},unspecified:{type:1,value:0}},perform:{specified:{type:1,value:0},unspecified:{type:1,value:0}},grants:{type:1,value:0}},p={1:{type:1,employees:[JSON.parse(JSON.stringify(d))]},2:{type:1,employees:[JSON.parse(JSON.stringify(d)),JSON.parse(JSON.stringify(d))]},3:{type:1,employees:[JSON.parse(JSON.stringify(d)),JSON.parse(JSON.stringify(d)),JSON.parse(JSON.stringify(d))]}},m={type:1,commission:{specified:{type:1,value:0},unspecified:{type:1,value:0}},perform:{specified:{type:1,value:0},unspecified:{type:1,value:0}},grants:{type:1,value:0},cost:{specified:{type:1,value:0},unspecified:{type:1,value:0}},twice:{specified:{type:1,value:0},unspecified:{type:1,value:0}}},f={};function y(e,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,c=arguments.length>3&&void 0!==arguments[3]&&arguments[3],a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{},o=100,u=new Map([["commission",s],["perform",d],["grants",p],["pgSum",l],["cost",m],["twice",f]]);Object.keys(e).map((function(t){e[t].value&&(e[t].value=Number(e[t].value)),["type","grants"].includes(t)||(e[t]=c?e[t].specified:e[t].unspecified)}));var n={cost:0,twice:0,perform:0,grants:0,pgSum:0,commission:0};return a.custom&&C(n,a.custom),a.assign?(u.get(a.assign)(e[a.assign],n),n):(Object.keys(n).forEach((function(t){if(!n[t]&&(!a.custom||!a.custom.hasOwnProperty(t))&&("pgSum"===t&&u.get(t)(n),e.hasOwnProperty(t))){if(1!==e[t].type&&2!==e[t].type)throw new Error("错误类型值r.type：".concat(r.type));e[t].value&&u.get(t)(e[t],n)}})),Object.keys(n).map((function(e){n[e]=Number(n[e]).toFixed(2)})),n);function s(e,i){var r=i.pgSum||t-i.cost-i.twice||0;1===e.type?i.commission=r*e.value/o:2===e.type&&(i.commission=Number(e.value))}function l(e){e.pgSum=e.perform+e.grants}function d(e,i){var r=t-i.cost-i.twice;1===e.type?i.perform=r*e.value/o:2===e.type&&(i.perform=Number(e.value))}function p(e,t){1===e.type?t.grants=i*e.value/o:2===e.type&&(t.grants=Number(e.value))}function m(e,i){1===e.type?i.cost=t*e.value/o:2===e.type&&(i.cost=Number(e.value))}function f(e,i){1===e.type?i.twice=(t-i.cost)*e.value/o:2===e.type&&(i.twice=Number(e.value))}}var v=10;function g(e){var t={type:"commodity",num:0,price:0,memberPrice:0,cost:0,onlyDiscountByGood:0,isSpecial:0,recoup:0,discount:1,memberDiscount:1,good:{},memberRule:{}};C(t,e);var i=Boolean(Object.keys(t.memberRule).length),r=t.good;if(t.price=r.sale_price,t.memberPrice=r.member_price,t.cost=r.cost_price,t.onlyDiscountByGood=r.discount_switch,t.isSpecial=r.special_switch,t.recoup=r.again_member_switch,t.discount=r.discount,t.discount/=v,i)switch(t.type){case"commodity":t.memberDiscount=Number(t.memberRule.commodity)/v;break;case"services":t.memberDiscount=Number(t.memberRule.project)/v;break;case"count":t.memberDiscount=Number(t.memberRule.project)/v;break;default:break}var c={type:-1,originalPrice:0,discount:10,discountPrice:0,originalPriceAll:0,discountPriceAll:0};if(!t.type)return c;var a=!1,o={};if(i&&"services"===t.type&&t.good.member_rule){var u=JSON.parse(t.good.member_rule);a=u[t.memberRule.id],o=u[t.memberRule.id]}return c.originalPrice=i&&"count"!==t.type?t.memberPrice:t.price,"count"===t.type?!t.good.special_switch&&i?(c.discount=t.memberDiscount,c.discountPrice=c.originalPrice*c.discount):(c.discount=1,c.discountPrice=c.originalPrice):a?1===Number(o.type)?(c.discount=1,c.discountPrice=Number(o.ratio)):(c.discount=Number(o.ratio)/v,c.discountPrice=c.originalPrice*c.discount):t.onlyDiscountByGood?(c.type=2,c.discount=t.discount,c.discountPrice=c.originalPrice*c.discount):t.recoup?(c.type=3,c.discount=t.discount*(t.memberDiscount||1),c.discountPrice=c.originalPrice*c.discount):(c.type=1,c.discount=t.discount,c.discountPrice=c.originalPrice),c.originalPriceAll=c.originalPrice*t.num,c.discountPriceAll=c.discountPrice*t.num,Object.keys(c).forEach((function(e){c[e]="discount"!==e?Number(c[e]).toFixed(2):Number(10*c[e]).toFixed(1)})),c}function C(e,t){Object.keys(t).map((function(i){e.hasOwnProperty(i)&&(e[i]=t[i])}))}function h(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>2?arguments[2]:void 0,i=c["a"].getters.userInfo,r="";if(["good","count"].includes(e)){var a=[];t.goodList&&t.goodList.map((function(e){if(Object.keys(e.good).length&&e.good.id){var t=a.find((function(t){return t.id===e.good.id}));t?(t.qty+=Number(e.qty),t.price+=Number(e.discountPriceAll)):a.push({id:e.good.id,name:e.good.alias,qty:Number(e.qty),price:Number(e.discountPriceAll)})}})),a.map((function(e,t){r+="".concat(e.name,"(数量：").concat(e.qty,"，价格：").concat(e.price,")").concat(t===a.length-1?"":",")}))}var o={lable:"card"===e||"recharge"===e?"充值":"消费",sms:{title:"".concat(i.sms_title),remake:"".concat(i.sms_remake)},wechat:{first:r,remake:"".concat(i.sms_remake," ").concat(i.telephone)}};return"count"===e&&(o.sms.meter=r),"card"===e?o.wechat.first="开卡 ".concat(t.gross_price,"元"):"recharge"===e?o.wechat.first="充值 ".concat(t.gross_price,"元"):"consume"===e&&(o.wechat.first="快速消费 ".concat(t.gross_price,"元")),o}},f33d:function(e,t,i){},f400:function(e,t,i){"use strict";var r=i("c26b"),c=i("b39a"),a="Map";e.exports=i("e0b8")(a,(function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}}),{get:function(e){var t=r.getEntry(c(this,a),e);return t&&t.v},set:function(e,t){return r.def(c(this,a),0===e?0:e,t)}},r,!0)}}]);