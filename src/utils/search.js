/**
 * 会员搜索
 * @param {string} qs  搜索文本
  * @param {Array} list  搜索列表
 */
export function member (qs, list) {
  let r = [{}]
  r = list.filter(search(qs))
  return r

  function search (qs) {
    return (v) => {
      return v.phone.indexOf(qs) >= 0 ||
      v.serial_num.indexOf(qs) >= 0 ||
      (v.alias.toLowerCase().indexOf(qs.toLowerCase()) >= 0) ||
      v.alias_spell.indexOf(qs) >= 0
    }
  }
}
// export function member (qs, list) {
//   const funcList = new Map([
//     ['name', nameSearch], // alias
//     ['card', spellSearch], // spell
//     ['num', numSearch] // phone serial_num 后续添加查询字段:alias
//   ])
//   let r = [{}]
//   var isNum = Number(qs)
//   if (escape(qs).indexOf('%u') >= 0) {
//     r = list.filter(funcList.get('name')(qs))
//   } else if (/^[A-Za-z]+$/.test(qs)) {
//     r = list.filter(funcList.get('card')(qs))
//   } else if (!isNaN(isNum)) {
//     r = list.filter(funcList.get('num')(qs))
//   }
//   return r

//   function nameSearch (qs) {
//     return (v) => {
//       return (v.alias.toLowerCase().indexOf(qs.toLowerCase()) >= 0)
//     }
//   }

//   function numSearch (qs) {
//     return (v) => {
//       return v.phone.indexOf(qs) >= 0 || v.serial_num.indexOf(qs) >= 0 || (v.alias.toLowerCase().indexOf(qs.toLowerCase()) >= 0)
//     }
//   }

//   function spellSearch (qs) {
//     return (v) => {
//       return v.alias_spell.indexOf(qs) >= 0
//     }
//   }
// }
