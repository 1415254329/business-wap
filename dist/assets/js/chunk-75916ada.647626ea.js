(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-75916ada"],{"02ea":function(t,s,i){},"098e":function(t,s,i){"use strict";i.r(s);var e=function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",{staticClass:"bonus"},[i("div",{staticClass:"list"},t._l(t.list,(function(s,e){return i("div",{key:e,staticClass:"item"},[i("div",{staticClass:"name"},[t._v("\n            "+t._s(s.source_alias)+"\n        ")]),i("div",{staticClass:"info"},[i("div",{staticClass:"time"},[t._v(t._s(s.order_time))]),i("div",{staticClass:"bonu"},[i("div",{staticClass:"perf"},[t._v("业绩:"+t._s(s.performance_price))]),i("div",{staticClass:"divi"},[t._v("提成:"+t._s(s.dividends_price))])])])])}))),i("div",{staticClass:"stats"},[i("div",[t._v("业绩合计："+t._s(Number(t.stats.performALL).toFixed(2)))]),i("div",[t._v("提成合计："+t._s(Number(t.stats.commissionAll).toFixed(2)))])])])},a=[],n=(i("ac6a"),i("cadf"),i("551c"),i("097d"),{data:function(){return{list:[],stats:{performALL:0,commissionAll:0}}},created:function(){this.getList()},methods:{getList:function(){var t=this;this.$api.wx.getStaffBonusList(this.$route.query.id,{start_time:this.$route.query.startTime+" 00:00:00",end_time:this.$route.query.endTime+" 23:59:59"}).then((function(s){s.data.forEach((function(s){t.stats.performALL+=s.performance_price,t.stats.commissionAll+=s.dividends_price})),t.list=s.data}))}}}),r=n,c=(i("aa20"),i("2877")),o=Object(c["a"])(r,e,a,!1,null,"5f5cd66e",null);o.options.__file="bonus.vue";s["default"]=o.exports},aa20:function(t,s,i){"use strict";var e=i("02ea"),a=i.n(e);a.a}}]);