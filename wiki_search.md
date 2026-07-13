---
   # You do not need to add any content to this page; the script below will automatically populate the page with content.
   layout: search
   permalink: /wiki:search
   title: Search results
---

<script>
   window.pages = {
      {% for page in site.wiki %}
         {% include search_results.html %}
      {% unless forloop.last %},{% endunless %}
      {% endfor %}
   };
</script>
