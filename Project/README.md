# Geometric Approximations via Coresets


## Running the website
To run the website, the easiest way is to launch a local web server with Python:

```
python -m SimpleHTTPServer
```

In fact, some libraries are loaded dynamically and the website will not display properly if we open the html files right in the browser.

Also, the javascript applets were optimized for Chrome, with successful tests on Safari as well.

> Note: sometimes, MathJax (the LaTeX/HTML engine) doesn't start up and we need to refresh the page to see the equations display properly.

## Implementations
In the `/applications` folder, you will find the following:

- **kdtree.js:** an implementation of k-d tree, used for computing coresets
- **improved_construction_2d.html:** the first file to check, it contains the whole algorithm in 2D.
- **improved_construction_2d_intro.html:** it is somehow a subset of the previous file used at the very top of the article, to give a hint on coresets without spoiling the whole content.
- **improved_construction.html:** the 3D coreset construction algorithm implementation.
- **old/:** this folder contains all the previous tests that lead to the three files mentioned before, I only left it there for the sake of completeness.
