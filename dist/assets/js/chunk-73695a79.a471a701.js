(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-73695a79"],{"504c":function(t,n,e){var i=e("0d58"),o=e("6821"),a=e("52a7").f;t.exports=function(t){return function(n){var e,s=o(n),r=i(s),c=r.length,l=0,d=[];while(c>l)a.call(s,e=r[l++])&&d.push(t?[e,s[e]]:s[e]);return d}}},"5dca":function(t,n,e){"use strict";e.r(n);var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",[e("Card",[e("Tree",{attrs:{data:t.data5,render:t.renderContent}})],1),t.box?e("div",[e("Modal",{attrs:{title:"请输入名称"},model:{value:t.box,callback:function(n){t.box=n},expression:"box"}},[e("Input",{staticStyle:{width:"300px"},attrs:{placeholder:"请输入名称..."},model:{value:t.boxValue,callback:function(n){t.boxValue=n},expression:"boxValue"}}),e("div",{attrs:{slot:"footer"},slot:"footer"},[e("Button",{attrs:{type:"warning",size:"large",small:""},on:{click:t.cancel}},[t._v("取消")]),e("Button",{attrs:{type:"success",size:"large",small:""},on:{click:t.ok}},[t._v("确认")])],1)],1)],1):t._e()],1)},o=[],a=(e("ac6a"),e("8615"),e("f751"),e("c24f")),s={data:function(){var t=this;return{box:!1,boxValue:"",boxPid:0,editState:!1,positionList:{},data5:[{title:"主/职位",expand:!0,render:function(n,e){e.root,e.node;var i=e.data;return n("span",{style:{display:"inline-block",lineHeight:"1.6rem",width:"100%",cursor:"pointer"}},[n("span",[n("Icon",{props:{type:"ios-folder-outline"},style:{marginRight:"8px"}}),n("span",i.title)]),n("span",{style:{display:"inline-block",float:"right",marginRight:"32px"}},[n("Button",{props:Object.assign({},t.buttonProps,{icon:"ios-add"}),style:{marginRight:"8px",marginLeft:"8px",borderRadius:"50%",width:"1.5rem",lineHeight:"0",padding:"0",height:"1.4rem"},on:{click:function(){t.box=!0,t.boxPid=0}}})])])},children:[]}],buttonProps:{type:"default",size:"small"},inputContent:"",oldName:""}},mounted:function(){this.render()},methods:{render:function(){var t=this;Object.values(this.positionList).length||this.$api.common.getPosition().then((function(n){t.positionList=n.data,t.render()}));var n=Object.values(this.positionList).filter((function(t){return 0===t.status})).map((function(t,n){return{pid:t.pid,alias:t.alias,id:t.id,expand:!(0!==t.pid&&""!==t.pid),status:t.status,children:null==t.positions?[]:Object.values(t.positions).filter((function(t){return 0===t.status}))}}));this.data5[0].children=n},ok:function(){var t=this;if(""===this.boxValue)return this.$Message.error("名称不能为空"),!1;this.box=!1,Object(a["position"])(this.boxValue,this.boxPid).then((function(n){t.$Message.info("创建成功"),t.$api.common.getPosition().then((function(n){t.positionList=n.data,t.render()}))})),this.box=!1},cancel:function(){this.box=!1,this.boxValue="",this.boxPid=0},renderContent:function(t,n){var e=this,i=n.root,o=n.node,a=n.data;return 0===o.parent?t("span",{class:"hhhaha",style:{display:"inline-block",lineHeight:"1.6rem",width:"100%",cursor:"pointer"},on:{click:function(){!a.editState&&e.handleClickTreeNode(a)}}},[t("span",[t("Icon",{props:{type:"".concat(void 0==a.children||0==a.children.length?"md-document":"ios-folder")},style:{marginRight:"8px"}}),t("".concat(a.editState?"":"span"),a.alias),t("".concat(a.editState?"input":""),{attrs:{value:"".concat(a.editState?a.alias:""),autofocus:"true"},style:{width:"12rem",cursor:"auto"},on:{change:function(t){e.inputContent=t.target.value}}})]),t("".concat(a.editState?"":"span"),{class:"btnNone",style:{marginLeft:"1rem"}},[t("Button",{props:Object.assign({},this.buttonProps,{icon:"ios-brush-outline"}),style:{marginRight:"8px",borderRadius:"50%",width:"1.5rem",lineHeight:"0",padding:"0",height:"1.4rem"},on:{click:function(){e.editTree(a)}}}),t("Button",{props:Object.assign({},this.buttonProps,{icon:"ios-add"}),style:{marginRight:"8px",borderRadius:"50%",width:"1.5rem",lineHeight:"0",padding:"0",height:"1.4rem",display:"".concat(a.expand?"blcok":"none")},on:{click:function(){e.box=!0,e.boxPid=a.id}}}),t("Button",{props:Object.assign({},this.buttonProps,{icon:"ios-remove"}),style:{marginRight:"8px",borderRadius:"50%",width:"1.5rem",padding:"0",lineHeight:"0",height:"1.4rem"},on:{click:function(){e.remove(i,o,a)}}})]),t("".concat(a.editState?"span":""),{style:{marginLeft:".5rem"}},[t("Button",{props:Object.assign({},this.buttonProps,{icon:"md-checkmark"}),style:{border:0,background:"rgba(0,0,0,0)",fontSize:"1.3rem",outline:"none"},on:{click:function(t){e.confirmTheChange(a)}}}),t("Button",{props:Object.assign({},this.buttonProps,{icon:"md-close"}),style:{border:"0",background:"rgba(0,0,0,0)",fontSize:"1.3rem",outline:"none"},on:{click:function(){e.CancelChange(a)}}})])]):t("span",{class:"hhhaha",style:{display:"inline-block",lineHeight:"1.6rem",width:"100%",cursor:"pointer"},on:{click:function(){!a.editState&&e.handleClickTreeNode(a)}}},[t("span",[t("Icon",{props:{type:"".concat(void 0==a.children||0==a.children.length?"md-document":"ios-folder")},style:{marginRight:"8px"}}),t("".concat(a.editState?"":"span"),a.alias),t("".concat(a.editState?"input":""),{attrs:{value:"".concat(a.editState?a.alias:""),autofocus:"true"},style:{width:"12rem",cursor:"auto"},on:{change:function(t){e.inputContent=t.target.value}}})]),t("".concat(a.editState?"":"span"),{class:"btnNone",style:{marginLeft:"1rem"}},[t("Button",{props:Object.assign({},this.buttonProps,{icon:"ios-brush-outline"}),style:{marginRight:"8px",borderRadius:"50%",width:"1.5rem",lineHeight:"0",padding:"0",height:"1.4rem"},on:{click:function(){e.editTree(a)}}}),t("Button",{props:Object.assign({},this.buttonProps,{icon:"ios-add"}),style:{marginRight:"8px",borderRadius:"50%",width:"1.5rem",lineHeight:"0",padding:"0",height:"1.4rem",display:"".concat(a.expand?"blcok":"none")},on:{click:function(){e.append(a)}}}),t("Button",{props:Object.assign({},this.buttonProps,{icon:"ios-remove"}),style:{marginRight:"8px",borderRadius:"50%",width:"1.5rem",padding:"0",lineHeight:"0",height:"1.4rem",display:"".concat(a.expand?"none":"blcok")},on:{click:function(){e.remove(i,o,a)}}})]),t("".concat(a.editState?"span":""),{style:{marginLeft:".5rem"}},[t("Button",{props:Object.assign({},this.buttonProps,{icon:"md-checkmark"}),style:{border:0,background:"rgba(0,0,0,0)",fontSize:"1.3rem",outline:"none"},on:{click:function(t){e.confirmTheChange(a)}}}),t("Button",{props:Object.assign({},this.buttonProps,{icon:"md-close"}),style:{border:"0",background:"rgba(0,0,0,0)",fontSize:"1.3rem",outline:"none"},on:{click:function(){e.CancelChange(a)}}})])])},setStates:function(t){var n=t.editState;n?this.$set(t,"editState",!1):this.$set(t,"editState",!0)},editTree:function(t){event.stopPropagation(),this.inputContent=t.alias,this.oldName=t.alias,this.setStates(t)},append:function(t,n){event.stopPropagation();var e=t.children||[];Object(a["position"])(n,t.id).then((function(i){0===i.code&&e.push({alias:n,expand:!(0!==t.children.pid&&""!==t.children.pid)})})),this.$set(t,"children",e)},remove:function(t,n,e){var i=this;event.stopPropagation(),this.$Modal.confirm({title:"提示",content:"您确定删除 “".concat(e.alias,"” 吗？"),onOk:function(){e.children&&e.children.length?i.$Message.error("存在子职位，无法删除"):Object(a["del_position"])(e.id,e.alias,e.pid).then((function(t){i.positionList={},i.render(),i.$Message.info("删除成功")}))}})},confirmTheChange:function(t){var n=this;this.inputContent?this.oldName!==this.inputContent?(this.$Modal.confirm({title:"提示",content:"您确定将  “".concat(this.oldName,"”  重命名为 “ ").concat(this.inputContent," ” 吗？"),onOk:function(){Object(a["edit_position"])(t.id,n.inputContent,t.pid).then((function(e){t.alias=n.inputContent,n.$Message.info("修改成功")}))}}),this.setStates(t)):this.setStates(t):this.$Notice.warning({title:"当前输入有误"})},CancelChange:function(t){this.setStates(t)},handleClickTreeNode:function(t){}}},r=s,c=(e("be51"),e("2877")),l=Object(c["a"])(r,i,o,!1,null,"7ee8fd21",null);l.options.__file="position.vue";n["default"]=l.exports},8615:function(t,n,e){var i=e("5ca1"),o=e("504c")(!1);i(i.S,"Object",{values:function(t){return o(t)}})},"88a5":function(t,n,e){},be51:function(t,n,e){"use strict";var i=e("88a5"),o=e.n(i);o.a}}]);