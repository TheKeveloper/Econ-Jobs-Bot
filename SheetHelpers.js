function getRowHeadersDict(sheet){
  let headerRange = sheet.getRange("1:1");
  let headerValues = headerRange.getValues()[0];

  let headerDict = {}
  for(let i = 0; i < headerValues.length; i++){
    let header = headerValues[i];
    if(header.toString().length > 0){ 
      headerDict[headerValues[i]] = i;
    }
    else{
      break;
    }
  }
  
  return headerDict;
}

function insertRowsAtTop(sheet, newValues){
  if(newValues.length == 0){
    return; 
  }
  let firstRowValues = sheet.getRange("1:1").getValues()[0];
  for(let row of newValues){
    if(row.length != firstRowValues.length){
      throw "Rows do not have correct number of values"
    }
  }

  sheet.insertRows(2,newValues.length);
  let range = sheet.getRange(2, 1, newValues.length, newValues[0].length);
  range.setValues(newValues);
}


