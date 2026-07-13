---
   # You do not need to add any content to this page; the 'reference_desk' layout contains logic that will automatically populate the page with content.
   # If you have multi_projects set to 'true' in your config file, for any page that uses the collections or reference_desk layouts, you must specify in the front matter which project the page belongs to. This is just the name of the collection, but since these organizational pages are not in the collections directory, specifying them in the front matter gives us a way to access the collection variable as [page.project]: instead of saying {{ page.collection }}, since the page is not in a collection, we can say {{ site.[page.project] }} and the output will be the same.
   # If multi_projects is set to false you can delete the project key from the front matter.
   layout: reference_desk
   project: wiki
   permalink: /wiki
---
