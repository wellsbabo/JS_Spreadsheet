export function changeCellValue(changeValues){
  console.log("test")
/*   var row = changeValues[0][0]
  var newVal = changeValues[0][3]
  var prop = changeValues[0][1]
  var ID = this.getDataAtRowProp(row,"_id")

  fetch("http://localhost:33997/edit",{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          prop:prop,
          id:ID,
          newVal:newVal
        })
      }) */
}

export function createNewRow(index, amount){
  console.log("add")
  fetch("http://localhost:33997/addinfo",{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
        })
      })
}

export function removeRow(index, amount, physicalRows){
/*   //console.log("remove")
  console.log(index)
  //console.log(amount)
  console.log(physicalRows)
  var id = this.getDataAtRowProp(index,"_id");
  fetch("http://localhost:33997/delete",{
    method:"POST",
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      id:id
    })
  }) */
}
