/***
 * Yoinked in its entirety from https://davidwalsh.name/adding-search-to-your-site-with-javascript
 * and https://trackjs.com/blog/site-search-with-javascript-part-2/
 */

// Build the search index
var searchIndex = lunr(function() {
   // Define searchable fields for each page
   this.ref("id");
   this.field("title", { boost: 100 }); // Boost the importance of the title field, prioritizing title matches
   this.field("content", { boost: 50 });
   this.field("portal", { boost: 10 });
   this.field("categories", { boost: 10 });
   this.field("tags", { boost: 10 });
   for (var key in window.pages) { // Loop through all pages to add their data to the search index
      this.add({
         "id": key,
         "title": pages[key].title,
         "content": pages[key].content,
         "portal": pages[key].portal,
         "categories": pages[key].categories,
         "tags": pages[key].tags
      });
   }
});



function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] === variable) {
         return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
      }
   }
}

var searchTerm = getQueryVariable("q");
// Create index of search term matches
var results = searchIndex.search(searchTerm + "*"); // Wildcard by default
var resultPages = results.map(function (match) {
   return pages[match.ref];
});



// Text highlighting
function formatContent(content, searchTerm) {
   var termIdx = content.toLowerCase().indexOf(searchTerm.toLowerCase());
   if (termIdx >= 0) {
      var startIdx = Math.max(0, termIdx - 140);
      var endIdx = Math.min(content.length, termIdx + searchTerm.length + 140);
      var trimmedContent = (startIdx === 0) ? "" : "&hellip;";
      trimmedContent += content.substring(startIdx, endIdx);
      trimmedContent += (endIdx >= content.length) ? "" : "&hellip;"

      var highlightedContent = trimmedContent.replace(new RegExp(searchTerm, "ig"), function matcher(match) {
         return "<mark class='search_result-highlight'>" + match + "</mark>";
      });

      return highlightedContent;
   }
   else {
      var emptyTrimmedString = content.substr(0, 280);
      emptyTrimmedString += (content.length < 280) ? "" : "&hellip;";
      return emptyTrimmedString;
   }
}



resultsString = "";
resultPages.forEach(function (r) { // Format the output on the search results page
   resultsString += "<dt class='search_result'>";
   resultsString += "<a class='search_result' href='" + r.url + "'>" + r.title + "</a>";
   resultsString += "<span class='search_result-details'>" + r.portal + " ⋅ " + r.categories + "</span></dt>"
   resultsString += "<dd class='search_result-preview'>" + formatContent(r.content, searchTerm) + "" + "</dd>";
});
document.querySelector("#search-results").innerHTML = resultsString;
