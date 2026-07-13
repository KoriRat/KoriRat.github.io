---
   # If you have multi_projects set to 'true' in your config file, for any page that uses the collections or reference_desk layouts, you must specify in the front matter which project the page belongs to. This is just the name of the collection, but since these organizational pages are not in the collections directory, specifying them in the front matter gives us a way to access the variable, as [page.project]: instead of saying {{ page.collection }}, since the page is not in a collection, we can say {{ site.[page.project] }} and the output will be the same.
   # If multi_projects is set to false you can delete the project key from the front matter.
   layout: collections
   project: wiki
   title: Wiki contents
   permalink: /wiki:contents
---

The information in this wiki is organized into the following subject portals. Each portal broadly surveys and is further organized into various levels of subcategories.

{% for item in site.data.portals %}
   <dl class="">
      <dd><a href="{{ item.link }}">{{ item.name }}</a></dd>
      <dt>{{ item.contents }}</dt>
   </dl>
{% endfor %}
