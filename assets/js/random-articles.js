/***
 * «Случайные статьи» на главной: показывает несколько случайных карточек
 * и перемешивает их заново по кнопке «Показать другие».
 */
document.querySelectorAll("[data-random-articles]").forEach(function (section) {
   var cards = Array.prototype.slice.call(section.querySelectorAll(".article-card"));
   var count = parseInt(section.getAttribute("data-count"), 10) || 4;
   var button = section.querySelector(".random-articles_shuffle");

   function shuffle() {
      var order = cards.slice();
      for (var i = order.length - 1; i > 0; i--) {
         var j = Math.floor(Math.random() * (i + 1));
         var tmp = order[i];
         order[i] = order[j];
         order[j] = tmp;
      }
      cards.forEach(function (card) { card.hidden = true; });
      order.slice(0, count).forEach(function (card) {
         card.hidden = false;
         card.parentNode.appendChild(card); // показываем в случайном порядке
      });
   }

   shuffle();

   if (button && cards.length > count) {
      button.hidden = false;
      button.addEventListener("click", shuffle);
   }
});
