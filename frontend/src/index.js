import Handsontable from "handsontable/base";
import "handsontable/dist/handsontable.min.css";
import "pikaday/css/pikaday.css";
import "./styles.css";
import { registerLanguageDictionary, arAR } from "handsontable/i18n";
// choose cell types you want to use and import them
import {
  registerCellType,
  CheckboxCellType,
  DateCellType,
  DropdownCellType,
  NumericCellType,
} from "handsontable/cellTypes";
import {
  registerPlugin,
  AutoColumnSize,
  ContextMenu,
  CopyPaste,
  DropdownMenu,
  Filters,
  HiddenColumns,
  HiddenRows,
  ManualRowMove,
  MultiColumnSorting,
  UndoRedo,
  Search,
  ExportFile,
} from 'handsontable/plugins';
import {
  createNewRow
} from "./hooksCallbacks";
import { data } from './constants';

const example = document.querySelector("#example");
const exportButton = document.querySelector('#export-file');
const saveButton = document.querySelector('#save');
const deletButton = document.querySelector('#delete');
const popup = document.querySelector('#import-file');
const popclose = document.querySelector('#close');
const background = document.querySelector('.background')


const promise = data;
  promise.then((appData) => {
    // register imported cell types and plugins
    registerPlugin(AutoColumnSize);
    registerPlugin(ContextMenu);
    registerPlugin(CopyPaste);
    registerPlugin(DropdownMenu);
    registerPlugin(Filters);
    registerPlugin(HiddenColumns);
    registerPlugin(HiddenRows);
    registerPlugin(ManualRowMove);
    registerPlugin(MultiColumnSorting);
    registerPlugin(UndoRedo);
    registerPlugin(Search);
    registerPlugin(ExportFile);
    //registerPlugin()

    // register imported cell types and plugins
    registerCellType(DateCellType);
    registerCellType(DropdownCellType);
    registerCellType(CheckboxCellType);
    registerCellType(NumericCellType);

    registerLanguageDictionary(arAR);
    
    const table = new Handsontable(example, {
      className: 'myTable',
      data: appData,
      hiddenColumns:{
        indicators:true,
        columns:[4]
      },
      height: 'auto',
      colWidths: [140, 192, 250, 200,200],
      colHeaders: [
        "IP",
        "연관정보",
        "비고",
        "작성날짜",
        "data_ID(No touch)"
      ],
      cell:[
        {
          row:0,
          col:0,
          className: 'myCell'
        }
      ],
      columns: [
        { data: 'ipaddr', type: "text" },
        { data: 'gname', type: "text" },
        { data: 'etc', type: "text" },
        {
          data: 'date',
          type: 'date',
          allowInvalid: false,
          dateFormat: 'YYYY-MM-DD',
          correctFormat: true,
        },
        { data: '_id',type:"text"}
      ],
      search:{
        searchResultClass: 'my-custom-search-result-class',
        callback: searchResultCounter
      },
      renderAllRows:false,
      dropdownMenu: true,
      contextMenu: true,
      multiColumnSorting: true,
      filters: true,
      rowHeaders: true,
      manualRowMove: true,
      licenseKey: "non-commercial-and-evaluation",
      afterChange: editValue,
      afterCreateRow: createNewRow,
      outsideClickDeselects: false
    });
    return table;
  })
  .then((table)=>{

    const exportPlugin = table.getPlugin('exportFile');

    exportButton.addEventListener('click', () => {

      exportPlugin.downloadFile('csv', {
        bom: false,
        columnDelimiter: ',',
        columnHeaders: false,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: 'csv',
        filename: 'IP_Info-CSV-file_[YYYY]-[MM]-[DD]',
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: false,
      });
    });


    saveButton.addEventListener('click',()=>{
      for(let val of changeValues){
        fetch("http://localhost:33997/edit",{
          method:"POST",
          headers:{
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
            data:val
          })
        })
        .catch(err=>{
          console.log(err);
        })
      }
      changeValues = []
    })

    deletButton.addEventListener('click',()=>{
      let selected = table.getSelected();
      for(let i=0; i<selected.length; i++){
        //console.log("start row: " + test[i][0] + "   end row: " + test[i][2])
        for(let j=selected[i][0]; j<=selected[i][2]; j++){
          ID = table.getDataAtRowProp(j,"_id")
          fetch("http://localhost:33997/delete",{
          method:"POST",
          headers:{
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
            data:ID
          })
        })
        .catch(err=>{
          console.log(err);
        })
        }
      }
      location.reload();
    })

    popup.addEventListener('click',show);
    popclose.addEventListener('click',close);

  })



console.log(`Handsontable: v${Handsontable.version} (${Handsontable.buildDate})`);

function show(){
  background.className = "background show";
}

function close(){
  background.className = "background";
}

function searchResultCounter(instance, row, col, value, result) {
  const DEFAULT_CALLBACK = function(instance, row, col, data, testResult) {
    instance.getCellMeta(row, col).isSearchResult = testResult;
  };

  DEFAULT_CALLBACK.apply(this, arguments);

  if (result) {
    searchResultCount++;
  }
}

let changeValues = [];
let ID;
let value;
let prop;

function editValue(change){
  console.log(change)
  try{
    ID = this.getDataAtRowProp(change[0][0],"_id")
    value = change[0][3]
    prop = change[0][1]
  }
  catch(e){
    console.log("wait")
  }
  changeValues.push([ID,value,prop])
  console.log(changeValues)
}