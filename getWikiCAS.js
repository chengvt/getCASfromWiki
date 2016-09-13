function getWikiCAS(name) {
  // this function will only get the first CAS from wikipedia page
  
  //var name = "Vitamin A";
  var url = "https://en.wikipedia.org/w/api.php?action=query&titles=" + encodeURIComponent(name) + "&prop=revisions&rvprop=content&format=json"; 
  var response = UrlFetchApp.fetch(url); // get feed
  var data = JSON.parse(response.getContentText()); 
  
  // get child key
  var key = Object.keys(data["query"]["pages"]);
  var missing = Object.keys(data["query"]["pages"][key]).indexOf("missing") > -1;
  if (missing) return(""); else {
    var key2 = Object.keys(data["query"]["pages"][key]["revisions"]);
    var target = JSON.stringify(data["query"]["pages"][key]["revisions"][key2]["*"]);
    // check for redirect, as in if wikipedia redirect to another page
    var redirect = target.toLowerCase().indexOf("#redirect") > -1; // -1 if not found
    if (redirect) {
      var redirect_index = target.toLowerCase().indexOf("#redirect");
      var redirect_target = target.substr(redirect_index).split("\\n")[0].split("]]")[0].split("[")[2];
      var new_url = "https://en.wikipedia.org/w/api.php?action=query&titles=" + encodeURIComponent(redirect_target) + "&prop=revisions&rvprop=content&format=json";
      var response = UrlFetchApp.fetch(new_url); // get feed
      var data = JSON.parse(response.getContentText()); //
      
      // get child key
      var key = Object.keys(data["query"]["pages"]);
      var key2 = Object.keys(data["query"]["pages"][key]["revisions"]);
      var target = JSON.stringify(data["query"]["pages"][key]["revisions"][key2]["*"]);
    }
    
    // delete empty space in string
    target = target.replace(/\s+/g,"");
    
    // if CAS number information cannot be found then just turn blank as output
    var hasCAS = target.indexOf("CAS");
    if (hasCAS == -1) return("");
    
    var index = target.indexOf("CASNo=");
    if (index == -1) index = target.indexOf("CAS_number=") + 11; else index = index + 6;
    
    // get CAS
    var CAS = target.substr(index).split("\\n")[0].trim();
    
    // check for other CAS if exists
    var allCAS = [];
    var allCAS_length = [];
    allCAS.push(CAS);
    allCAS_length.push(CAS.length);
    var i = 1;
    var nextindex = target.indexOf("CASNo" + i + "=");
    if (nextindex == -1) nextindex = target.indexOf("CAS_number" + i + "=");
    while (nextindex > -1) {
      var index = target.indexOf("CASNo" + i + "=");
      if (index == -1) index = target.indexOf("CAS_number" + i + "=") + 12; else index = index + 7;
      var tmpCAS = target.substr(index).split("\\n")[0].trim();
      allCAS.push(tmpCAS);
      allCAS_length.push(tmpCAS.length);
      i++;
      nextindex = target.indexOf("CASNo" + i + "=");
      if (nextindex == -1) nextindex = target.indexOf("CAS_number=");
    }
    
    // prepare output
    if (allCAS.length == 1) {
      // return CAS number if there is only one result
      return(CAS); 
    } else {
      // for multiple CAS numbers, choose only one
      // The algorithm is to get the CAS number with the shortest length
      var allCAS_MIN = allCAS_length[0];
      for (var j = 1; j < allCAS_length.length; j++) {
        if (allCAS_length[j] < allCAS_MIN) {allCAS_MIN = allCAS_length[j];}
      }
      
      var allCAS_MIN_index = allCAS_length.indexOf(allCAS_MIN);
      return(allCAS[allCAS_MIN_index]);
    }
    
  }
}