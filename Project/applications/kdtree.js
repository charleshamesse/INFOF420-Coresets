/*
* k-d Tree (only with insert and nearest search methods)
* Inspired from https://github.com/ubilabs/kd-tree-javascript
*/

 (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports === 'objectect') {
        factory(exports);
    } else {
        factory((root.commonJsStrict = {}));
    }
}(this, function (exports) {
  function Node(object, dimension, parent) {
    this.object = object;
    this.left = null;
    this.right = null;
    this.parent = parent;
    this.dimension = dimension;
  }

  function kdTree(points, metric, dimensions) {
    var self = this;
    function buildTree(points, depth, parent) {
      var dim = depth % dimensions.length,
        median,
        node;

      if (points.length === 0) {
        return null;
      }
      if (points.length === 1) {
        return new Node(points[0], dim, parent);
      }

      points.sort(function (a, b) {
        return a[dimensions[dim]] - b[dimensions[dim]];
      });

      median = Math.floor(points.length / 2);
      node = new Node(points[median], dim, parent);
      node.left = buildTree(points.slice(0, median), depth + 1, node);
      node.right = buildTree(points.slice(median + 1), depth + 1, node);

      return node;
    }

    this.root = buildTree(points, 0, null);

    this.insert = function (point) {
      function innerSearch(node, parent) {
        if (node === null) {
          return parent;
        }
        var dimension = dimensions[node.dimension];
        if (point[dimension] < node.object[dimension]) {
          return innerSearch(node.left, node);
        } else {
          return innerSearch(node.right, node);
        }
      }

      var insertPosition = innerSearch(this.root, null),
          newNode,
          dimension;

      if (insertPosition === null) {
        this.root = new Node(point, 0, null);
        return;
      }

      newNode = new Node(point, (insertPosition.dimension + 1) % dimensions.length, insertPosition);
      dimension = dimensions[insertPosition.dimension];

      if (point[dimension] < insertPosition.object[dimension]) {
        insertPosition.left = newNode;
      } else {
        insertPosition.right = newNode;
      }
    };

    this.nearest = function (point, maxNodes, maxDistance) {
      var i,
          result,
          bestNodes;

      bestNodes = new BinaryHeap(
        function (e) { return -e[1]; }
      );

      function nearestSearch(node) {
        var bestChild,
          dimension = dimensions[node.dimension],
          ownDistance = metric(point, node.object),
          linearPoint = {},
          linearDistance,
          otherChild,
          i;
        function saveNode(node, distance) {
          bestNodes.push([node, distance]);
          if (bestNodes.size() > maxNodes) {
            bestNodes.pop();
          }
        }
        for (i = 0; i < dimensions.length; i += 1) {
          if (i === node.dimension) {
            linearPoint[dimensions[i]] = point[dimensions[i]];
          } else {
            linearPoint[dimensions[i]] = node.object[dimensions[i]];
          }
        }
        linearDistance = metric(linearPoint, node.object);
        if (node.right === null && node.left === null) {
          if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
            saveNode(node, ownDistance);
          }
          return;
        }
        if (node.right === null) {
          bestChild = node.left;
        } else if (node.left === null) {
          bestChild = node.right;
        } else {
          if (point[dimension] < node.object[dimension]) {
            bestChild = node.left;
          } else {
            bestChild = node.right;
          }
        }
        nearestSearch(bestChild);
        if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
          saveNode(node, ownDistance);
        }
        if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1]) {
          if (bestChild === node.left) {
            otherChild = node.right;
          } else {
            otherChild = node.left;
          }
          if (otherChild !== null) {
            nearestSearch(otherChild);
          }
        }
      }
      if (maxDistance) {
        for (i = 0; i < maxNodes; i += 1) {
          bestNodes.push([null, maxDistance]);
        }
      }
      if(self.root)
        nearestSearch(self.root);
      result = [];
      for (i = 0; i < Math.min(maxNodes, bestNodes.content.length); i += 1) {
        if (bestNodes.content[i][0]) {
          result.push([bestNodes.content[i][0].object, bestNodes.content[i][1]]);
        }
      }
      return result;
    };

  }

  /*
  * Binary heap
  * As in http://eloquentjavascript.net/appendix2.html (see for explanations)
  */
  function BinaryHeap(scoreFunction){
    this.content = [];
    this.scoreFunction = scoreFunction;
  }

  BinaryHeap.prototype = {
    push: function(element) {
      this.content.push(element);
      this.bubbleUp(this.content.length - 1);
    },

    pop: function() {
      var result = this.content[0];
      var end = this.content.pop();
      if (this.content.length > 0) {
        this.content[0] = end;
        this.sinkDown(0);
      }
      return result;
    },

    peek: function() {
      return this.content[0];
    },

    remove: function(node) {
      var len = this.content.length;
      for (var i = 0; i < len; i++) {
        if (this.content[i] == node) {
          var end = this.content.pop();
          if (i != len - 1) {
            this.content[i] = end;
            if (this.scoreFunction(end) < this.scoreFunction(node))
              this.bubbleUp(i);
            else
              this.sinkDown(i);
          }
          return;
        }
      }
      throw new Error("Node not found.");
    },

    size: function() {
      return this.content.length;
    },

    bubbleUp: function(n) {
      var element = this.content[n];
      while (n > 0) {
        var parentN = Math.floor((n + 1) / 2) - 1,
            parent = this.content[parentN];
        if (this.scoreFunction(element) < this.scoreFunction(parent)) { // swap
          this.content[parentN] = element;
          this.content[n] = parent;
          n = parentN;
        }
        else {
          break;
        }
      }
    },

    sinkDown: function(n) {
      var length = this.content.length,
          element = this.content[n],
          elemScore = this.scoreFunction(element);
      while(true) {
        var child2N = (n + 1) * 2,
            child1N = child2N - 1,
            swap = null;
        if (child1N < length) {
          var child1 = this.content[child1N],
              child1Score = this.scoreFunction(child1);
          if (child1Score < elemScore)
            swap = child1N;
        }
        if (child2N < length) {
          var child2 = this.content[child2N],
              child2Score = this.scoreFunction(child2);
          if (child2Score < (swap == null ? elemScore : child1Score)){
            swap = child2N;
          }
        }
        if (swap != null) {
          this.content[n] = this.content[swap];
          this.content[swap] = element;
          n = swap;
        }
        else {
          break;
        }
      }
    }
  };

  this.kdTree = kdTree;
  exports.kdTree = kdTree;
  exports.BinaryHeap = BinaryHeap;
}));
