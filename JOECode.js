function cleanSingleJOEListing(listingData, joe_year, joe_issue){ 
  let jp_id = listingData["jp_id"];
  let full_joe_id = `${joe_year}_${joe_issue}_${jp_id}`
  
  let url = `https://www.aeaweb.org/joe/listing.php?JOE_ID=${joe_year}-${joe_issue.padStart(2, "0")}_${jp_id}`
  let listing = {
    "joe_year" : joe_year,
    "joe_issue" : joe_issue, 
    "jp_id" : jp_id,
    "full_joe_id" : full_joe_id, 
    "institution" : listingData["jp_institution"]["Text"], 
    "title" : listingData["jp_title"]["Text"],
    "url" : url,
    "posted_date" : (new Date()).toDateString()
  };
  return listing;
}

// This is necessary because JOE is dumb
function cleanXmlSrc(xmlSrc) {
  return xmlSrc.replace(/<8/gm, "&lt;8").replace("<https://lums.edu.pk/facilities-lums>", "https://lums.edu.pk/facilities-lums").replace("<mailto:AppliedEconsesarch@usfca.edu>", "").replace("<https://jrecin.jst.go.jp/seek/SeekJorDetail?fn=1&amp;amp;ln=1&amp;amp;id=D121111597&amp;amp;ln_jor=1>", "https://jrecin.jst.go.jp/seek/SeekJorDetail?fn=1&amp;amp;ln=1&amp;amp;id=D121111597&amp;amp;ln_jor=1").replace("<https://www.iss.u-tokyo.ac.jp/recruitment/index.html>", "https://www.iss.u-tokyo.ac.jp/recruitment/index.html").replace(/<(http.+?)\/>/gm, "$1").replace(/<mailto:(.+?)>/gm, "$1");
}

function getJOEListings(){ 
  let xmlUrl = "https://www.aeaweb.org/joe/resultset_output.php";
  let xmlSrc = UrlFetchApp.fetch(xmlUrl).getContentText();
  let xmlDoc =  XML_to_JSON(cleanXmlSrc(xmlSrc))
  let listings = xmlDoc["JOE_EXPORT"]["year"]["issue"]["position"];
  let joe_year = xmlDoc["JOE_EXPORT"]["year"]["joe_year_ID"];
  let joe_issue = xmlDoc["JOE_EXPORT"]["year"]["issue"]["joe_issue_ID"];

  let cleanListings = listings.map(x => cleanSingleJOEListing(x, joe_year, joe_issue));

  return cleanListings;
}

function mainJOE(){ 
  let listings = getJOEListings();

  let joeSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/1c1O0d3o7CZDJ7ChzGj5fWTMX0SheRpWh7Rt4bHg3bB4/edit#gid=0";
  let spreadsheet = SpreadsheetApp.openByUrl(joeSpreadsheetUrl);
  let sheet = spreadsheet.getSheets()[0];

  let headersDict = getRowHeadersDict(sheet)
  
  let prevListingsData = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();

  let existingIds = new Set(prevListingsData.map(x => x[headersDict["full_joe_id"]]));

  let newValues = []

  for(let listing of listings){
    if(existingIds.has(listing["full_joe_id"])){
      continue; 
    }
    let newRow = new Array(sheet.getLastColumn());

    for(let key of Object.keys(listing)){
      newRow[headersDict[key]] = listing[key]
    }

    let tweetText = `JOE has a new job posting! \n \nInstutition: ${listing.institution}.\n\nPosition: ${listing.title}. \n\nSee more details: ${listing.url}`

    tweet(tweetText);

    newValues.push(newRow);
  } 

  insertRowsAtTop(sheet, newValues);
}



