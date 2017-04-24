An usual technique used to develop approximation algorithms is to extract small amounts
of "relevant" information from the input data and to perform relatively-heavy computation on this extracted piece of data.
In a geometric context, uses of this technique include methods such as random sampling, convex approximation, surface simplification or feature extraction. When the input is a set of points, the question can be reduced to the one of finding a small subset (i.e. a coreset) of the points, such that one can perform the desired computation on the coreset.

Motivated by a variety of applications, considerable work has been done on measuring various descriptors of the extent of a set \\(P\\) of \\(n\\) points in \\(\mathbb{R}^d\\).

**Exact algorithms** for computing extent measures are generally expensive. For instance, it is said that the best known algorithms for computing the smallest volume bounding box or tetrahedron containing \\(P\\) in \\(\mathbb{R}^3\\) require \\(O(n^3)\\) time.

Consequently, attention has shifted to developing **approximation algorithms**. Despite considerable work, no unified theory has evolved for computing extent measures approximately. Ideally, one would like to argue that for any extent measure \\(µ\\) and for any given parameter ε such that \\( 0 < ε < 1 \\), there exists a subset \\(Q \in P\\) of size \\(1/ε^{O(1)}\\) so that \\(\mu(Q) \geq (1 − ε)\mu(P)\\). No such result is known except in a few special cases.

The main topic I chose to work on a study consisting in developing a **unified theory for approximating extent measures**. Let's introduce the notion of ε-approximation of a point set \\(P\\): a subset \\(Q \subseteq P\\) is called an ε-approximation of \\(P\\) if for every slab \\(W\\) containing \\(Q\\), the expanded slab \\((1 + ε)W\\) contains \\(P\\).

Let's take a quick look at some example coresets:
![image](img/grid_coreset_intro.png){: width="100%"}
*An example coreset computed by a grid-based algorithm, as we will see later on. Points belonging to the coreset are in red.*

#### [Click here to view an interactive example coreset](#1){: data-toggle=modal data-target=#modal1}


> The following content is based mainly on the work of Pankaj K. Agarwal, Sariel Har-Peled and Kasturi R. Varadarajanin in their paper "Approximating Extent Measures of Points" [AHV03] and in their survey "Geometric Approximation via Coresets" [AHV05].

### 1.1 The basics ###
{: #s1-1}

First of all, let us introduce some critical notions.

#### About coresets
In computational geometry, a **coreset** is a small set of points that approximates the shape of a larger point set, in the sense that applying some geometric measure to the two sets (such as their minimum bounding box volume) results in approximately equal numbers.

Many natural geometric optimization problems have coresets that approximate an optimal solution to within a factor of \\(1 + ε\\), that can be found quickly (in roughly linear time \\(O(n + f(ε))\\) or near-linear time \\( O(nf(ε)) \\) ), and that have size bounded by a function of \\(1/ε\\), independently of the size of the input.

#### On shape fitting problems
Let us start by showing some usual shape fitting problems that can be solved with the help of coresets. First, there are bounding box problems, where one wants to find a \\(d-\\)dimensional box whose width, length or depth is at most (1+ε) times that of the minimum-size box that contains all points of an input set \\(P\\).
Those are relatively straight forward, so let's directly take a look at two other kinds of problems:

**Spherical-shell problem:** given a point \\(x\\) in \\(\mathbb{R}^d\\) and two real numbers \\(0 \leq r \leq R\\), the spherical shell \\(\sigma (x, r, R)\\) is the closed region lying between the two concentric spheres of radii \\(r\\) and \\(R\\) centered in \\(x\\):

$$
\sigma(l,r,R) = \\{ p \in \mathbb{R}^d | r \leq d(x,p) \leq R  \\}
$$

where \\(d(x, p)\\) is the Euclidean distance between the points \\(p\\) and \\(x\\). The width of \\(\sigma(x, r, R)\\) is \\(R − r\\). In the ε-approximate spherical-shell problem, we are given a set \\(P\\) of \\(n\\) points and a parameter \\(ε > 0\\), and we want to compute an spherical shell containing \\(P\\) whose width is at most \\((1 + ε)\\) times the width of the minimum-width spherical shell containing \\(P\\).


**Cylindrical-shell problem:** given a line \\(l\\) in \\(\mathbb{R}^d\\) and two real numbers \\(0 \leq r \leq R\\), the cylindrical shell \\(\Sigma(l, r, R)\\) is the closed region lying between two co-axial cylinders of radii \\(r\\)
and \\(R\\) centered on an axis \\(l\\):

$$
\Sigma(l, r, R) = \\{ p \in \mathbb{R}^d | r \leq d(l, p) \leq R \\}
$$

where \\(d(l, p)\\) is the Euclidean distance between the point \\(p\\) and line \\(l\\). The width of \\( \Sigma (l, r, R) \\) is \\(R − r\\).
Again, in the approximate cylindrical shell problem, we are given a set \\(P\\) of \\(n\\) points and a parameter \\(ε > 0\\), and we want to compute a cylindrical shell containing \\(P\\) whose width is at most \\((1 + ε)\\) times the width of the minimum-width cylindrical shell containing \\(P\\).


### 1.2 More specific notions ###
{: #s1-2}

Now that we have an idea of the kind of problems we're dealing with, let's first go on with a few other notions that will then allow us to dive right in the presented algorithms.
#### On envelopes, extent, directions and widths

**Envelopes and extent:** Let \\( F = \\{ f\_1, ..., f\_n \\} \\) be a set of \\(n\\) \\( d \\)-variate functions defined over \\( x = (x\_1, ..., x\_{d}) \in \mathbb{R}^{d} \\). We define the **lower envelope** of \\(F\\) as the graph of the following function:

$$
L\_F : \mathbb{R}^{d} \rightarrow \mathbb{R} : x \rightarrow \min\_{f \in F} f(x)
$$

Similarly, the **upper envelope** of \\(F\\) is the graph of the following function:

$$
U\_F : \mathbb{R}^{d} \rightarrow \mathbb{R} : x \rightarrow \max\_{f \in F} f(x)
$$

![image](img/envelopes_2.png){: width="100%"}
*Upper and lower envelope of a set of functions \\( F \\) and that of an ε-approximation \\( G \\) of \\( F \\).*

And the **extent** is finally defined as:

$$
J\_F : \mathbb{R}^{d} \rightarrow \mathbb{R} : x \rightarrow U\_F(x) - L\_F (x)
$$

Now let us introduce a parameter \\(ε > 0\\) and let \\( \Delta \\) be a subset of \\( \mathbb{R}^{d} \\). The ε-approximation of the extent of \\(F\\) within \\(\Delta\\) is the subset \\(G\\) such that, for each \\(x \in \Delta \\):

$$
(1 - ε) J\_F (x) \leq J\_G(x)
$$

Clearly, we have \\(J\_G(x) \leq J\_F(x) \\) as \\( G \subseteq F \\). Also, if \\( \Delta = \mathcal{R}^{d} \\), then we simply call this an ε-approximation of the extent of \\(F\\).

**Directions and directional width:** In the following content, we're going to use directions defined as unit vectors on a n-dimensional sphere, so let's start by reviewing the definition of a \\(n-\\)sphere.
> The \\(n\\)-sphere is the generalization of the ordinary sphere to spaces of arbitrary dimension.
It is an \\(n\\)-dimensional manifold that can be embedded in Euclidean \\((n + 1)\\)-space.
For any natural number \\(n\\), an \\(n\\)-sphere of radius \\(r\\) may be defined in terms of an embedding in \\((n + 1)\\)-dimensional Euclidean space as the set of points that are at distance \\(r\\) from a central point, where the radius \\(r\\) may be any positive real number. Thus, the \\(n\\)-sphere would be defined by:
$$
S^{n} = \\{ x \in \mathbb {R}^{n+1} : |x| = r  \\}
$$

So the "usual" sphere is really is 2-sphere, or \\( S^2 \\).

Now, let \\( \mathbb{S}^{d-1} \\) be the unit sphere centered at the origin in \\( \mathbb{R}^d \\). For any direction \\( u \in \mathbb{S}^{d-1} \\) and a point set \\( P \subseteq \mathbb{R}^d \\), we define the **directional width** as:
$$
\omega(u, P) = \max\_{p \in P\} \langle x, p \rangle - \min\_{p \in P\} \langle x, p \rangle
$$
where \\( \langle \cdot , \cdot \rangle \\) is the usual inner product.

![image](img/dir_width.png){: width="100%"}
*A representation of the directional width of a set of points in \\( \mathbb{R}^2 \\).*

As in the previous paragraph, let's introduce a parameter \\(ε > 0\\) and set \\(\Delta \subseteq \mathbb{R}^{d} \\). A set \\(Q \subseteq P\\) is an ε-approximation of \\(P\\) within \\(\Delta \subseteq \mathbb{R} \\) if for each \\(u \in \Delta\\):

$$
(1 - ε) \omega(u, P) \leq \omega(u, Q)
$$
