/***
 * Оглавление статьи: собирается из заголовков ## и ### текста.
 * Показывается, только если в статье хотя бы два заголовка.
 * Основано на http://blustemy.io/creating-a-table-of-contents-in-javascript/
 */
(function () {
   var content = document.querySelector(".entry-content");
   var toc = document.querySelector(".entry-toc");
   if (!content || !toc) {
      return;
   }

   var headings = content.querySelectorAll("h2, h3");
   if (headings.length < 2) {
      return;
   }

   var title = document.createElement("p");
   title.className = "entry-toc_title";
   title.textContent = "Содержание";
   toc.appendChild(title);

   var list = document.createElement("ol");
   var currentSublist = null;

   headings.forEach(function (heading, index) {
      if (!heading.id) {
         heading.id = "section-" + (index + 1);
      }

      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent;
      item.appendChild(link);

      if (heading.tagName === "H3" && list.lastElementChild) {
         if (!currentSublist) {
            currentSublist = document.createElement("ol");
            list.lastElementChild.appendChild(currentSublist);
         }
         currentSublist.appendChild(item);
      } else {
         list.appendChild(item);
         currentSublist = null;
      }
   });

   toc.appendChild(list);
   toc.hidden = false;
})();
