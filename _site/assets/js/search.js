/***
 * Поиск по вики на Lunr.js с поддержкой русского языка (lunr-languages).
 * Основано на https://davidwalsh.name/adding-search-to-your-site-with-javascript
 * и https://trackjs.com/blog/site-search-with-javascript-part-2/
 *
 * Данные статей кладутся в window.pages в _layouts/search.html.
 */
(function () {
   var pages = window.pages || {};
   var resultsElement = document.getElementById("search-results");
   var statusElement = document.getElementById("search-status");
   var inputElement = document.querySelector(".search-input");

   // Строим индекс. multiLanguage("en", "ru") понимает и русские, и латинские слова:
   // «луны», «луне», «луну» находятся по одному запросу.
   var searchIndex = lunr(function () {
      this.use(lunr.multiLanguage("en", "ru"));
      this.ref("id");
      this.field("title", { boost: 100 }); // совпадения в названии важнее всего
      this.field("content", { boost: 50 });
      this.field("portal", { boost: 10 });
      this.field("categories", { boost: 10 });
      this.field("tags", { boost: 10 });
      for (var key in pages) {
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
         if (pair[0] === variable && pair[1] !== undefined) {
            return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
         }
      }
      return "";
   }

   function escapeHtml(text) {
      return String(text)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#39;");
   }

   // В тексте статей могут остаться HTML-сущности вроде &laquo; — превращаем их в символы
   function decodeEntities(text) {
      var textarea = document.createElement("textarea");
      textarea.innerHTML = text;
      return textarea.value;
   }

   function escapeRegExp(text) {
      return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
   }

   // Разбиваем запрос на слова, выкидывая знаки препинания и спецсимволы
   function getWords(term) {
      return term.toLowerCase()
         .replace(/[^\p{L}\p{N}]+/gu, " ")
         .split(" ")
         .filter(function (word) { return word.length > 0; });
   }

   // Основа слова («луны» → «лун»), чтобы подсвечивать все его формы
   function getStem(word) {
      var stemmed = lunr.ru.stemmer(new lunr.Token(word)).toString();
      stemmed = lunr.stemmer(new lunr.Token(stemmed)).toString();
      return stemmed.length > 0 && stemmed.length <= word.length ? stemmed : word;
   }

   function search(words) {
      return searchIndex.query(function (query) {
         words.forEach(function (word) {
            // 1) слово целиком с учётом окончаний (луна / луны / луне)
            query.term(word, { boost: 10 });
            // 2) начало слова: «зо» найдёт «Зора»
            query.term(word, { usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING });
            // 3) однокоренные слова: «безумие» найдёт «безумцы»
            var stem = getStem(word);
            if (stem.length >= 3 && stem !== word) {
               query.term(stem, { usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING });
            }
         });
      });
   }

   function formatContent(content, stems) {
      content = decodeEntities(content);
      var lowerContent = content.toLowerCase();
      var termIdx = -1;
      stems.forEach(function (stem) {
         var idx = lowerContent.indexOf(stem);
         if (idx >= 0 && (termIdx < 0 || idx < termIdx)) {
            termIdx = idx;
         }
      });

      var startIdx = 0;
      var endIdx = Math.min(content.length, 280);
      if (termIdx >= 0) {
         startIdx = Math.max(0, termIdx - 140);
         endIdx = Math.min(content.length, termIdx + 140);
      }

      var snippet = escapeHtml(content.substring(startIdx, endIdx));
      // Подсвечиваем слова, которые начинаются с основы запроса
      var pattern = new RegExp("(?<![\\p{L}\\p{N}])(" + stems.map(escapeRegExp).join("|") + ")[\\p{L}\\p{N}]*", "giu");
      snippet = snippet.replace(pattern, function (match) {
         return "<mark class='search_result-highlight'>" + match + "</mark>";
      });

      return (startIdx > 0 ? "&hellip;" : "") + snippet + (endIdx < content.length ? "&hellip;" : "");
   }

   function render(term) {
      var words = getWords(term);
      if (words.length === 0) {
         statusElement.textContent = "Введите слово для поиска: имя персонажа, этаж или любое слово из статьи.";
         resultsElement.innerHTML = "";
         return;
      }

      var stems = words.map(getStem);
      var results = search(words);

      if (results.length === 0) {
         statusElement.textContent = "По запросу «" + term + "» ничего не найдено. Попробуйте другое слово.";
         resultsElement.innerHTML = "";
         return;
      }

      statusElement.textContent = "По запросу «" + term + "» найдено статей: " + results.length;

      var html = "";
      results.forEach(function (match) {
         var r = pages[match.ref];
         var details = [r.portal, r.categories].filter(function (s) { return s; }).join(" ⋅ ");
         html += "<dt class='search_result'>";
         html += "<a class='search_result-link' href='" + escapeHtml(r.url) + "'>" + escapeHtml(r.title) + "</a>";
         html += "<span class='search_result-details'>" + escapeHtml(details) + "</span></dt>";
         html += "<dd class='search_result-preview'>" + formatContent(r.content, stems) + "</dd>";
      });
      resultsElement.innerHTML = html;
   }

   var searchTerm = getQueryVariable("q").trim();
   if (inputElement) {
      inputElement.value = searchTerm;
   }
   render(searchTerm);
})();
