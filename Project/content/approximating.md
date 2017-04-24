# 2. Approximating the extent of point sets #
{: #s2}

This section will include two different algorithms for computing ε-approximations of the extent of a set of points in \\(\mathbb{R}^d\\), whose size depends only on ε and \\(d\\). We will start by showing that if we can compute an ε-approximation of the directional width of a *fat point set* contained in in the unit hypercube \\(C\\), then we can also compute an ε-approximation of an arbitrary point set. We then describe fast algorithms for computing ε-approximations of fat point sets.

### Reduction to a fat point set ###
{: #s2-1}

> A point set \\(P\\) is \\(\alpha\\)-fat if there exists a point \\(p \in \mathbb{R}^d \\) and a hypercube \\(\bar{\mathbb{C}}\\) centered at the origin so that:
$$
p + \alpha \bar{\mathbb{C}} \subset \text{CH} (P) \subset p + \bar{\mathbb{C}}
$$
So in this sense, an \\( \alpha \\)-fat point set is just a non-empty set of points whose convex hull (1) contains the hypercube of edge length \\( \alpha \\) centered at the origin and (2) is contained in the unit hypercube.

The following lemmas are elegant, but they might be tricky and require much time to fully understand for the hurried reader.
If this is the case, don't worry: the proofs of the first four lemmas aren't critical to get a good understanding of the concept of coresets. However, please do spend the time needed on the two coreset construction algorithms described in lemmas 5 and 6.

**Lemma 1:** Let \\(T(x) = Mx + b\\) be an affine transformation from \\( \mathbb{R}^d \\) to \\( \mathbb{R}^d \\), where \\( M \in \mathbb{R}^{d \times d} \\) is non-singular and \\( b \in \mathbb{R}^d \\), let \\( P \\) be a point set in \\( \mathbb{R}^d \\) and let \\( \Delta \subseteq \mathbb{R}^d \\).
Define \\( \widehat{M} (\Delta) = \\{ u \in \mathbb{R}^{d-1} | \phi(M^T \tilde u) \in \Delta^\*  \\} \\) where \\(\tilde{u} = (u,1) \\) and \\( \phi(x) = x / ||x|| \\) and \\( \Delta^\* = \\{ x^\* | x \in \Delta \\} \\). Then \\( Q \subseteq P \\) ε-approximates \\( P \\) if and only if \\( T(Q) \\) ε-approximates \\( T(P) \\) within \\( \widehat{M}(\Delta) \\).

Proof: for any vectors \\( t \in \mathbb{R}^d \\) and \\( u \in \mathbb{R}^{d-1} \\), it is easily seen that \\( \omega(u, P) = \omega(u, P +t) \\). Therefore we may consider \\(T(x)\\) to be an affine transform with \\(b = 0\\). Also, we note that \\( \omega(u, P) = \bar{\omega}(\tilde{u}, P) \\). Obviously, for any vector \\(x \in \mathbb{R}^d \\),
$$
\langle x, Mp \rangle = x^T Mp = \langle M^Tx, p \rangle
$$
Therefore, for any \\(z \in \widehat{M}(\Delta)\\),
$$\begin{eqnarray}
\omega(z, M(Q)) &=& \bar{\omega}(\tilde{z}, M(Q)) \\\\
&=& \max\_{q \in Q} \langle \tilde{z}, Mq \rangle - \min\_{q \in Q} \langle \tilde{z}, Mq \rangle \\\\
&=& \max\_{q \in Q} \langle M^T \tilde{z}, q \rangle - \min\_{q \in Q} \langle M^T\tilde{z}, q \rangle \\\\
&=& \bar{\omega}(M^T \tilde{z}, Q).
\end{eqnarray}
$$
Since \\(z \in \widehat{M}(\Delta)\\), we have \\( \phi(M^T \tilde{z}) \in \Delta^\* \\), which implies that
$$
\bar{\omega}(M^T \tilde{z}, Q) \geq (1 - \varepsilon) \bar{\omega}(M^T \tilde{z}, P)
$$
Hence,
$$
\omega(z, M(Q)) \geq (1 - \varepsilon) \bar{\omega} (M^T \tilde{z}, P) = (1 - \varepsilon) \bar{\omega}(\tilde{z}, M(P)) = (1 - \varepsilon) \omega(z, T(P))
$$



**Lemma 2:** Let \\(P\\) be a set of \\(n\\) points in \\( \mathbb{R}^d \\) and let ε be a parameter. There exists a linear non-singular transform \\(T\\) such that \\(T(P)\\) is \\( \alpha\_d\\)-fat, where \\(\alpha\_d\\) is a constant depending only on \\(d\\).

Proof: it uses the linear time algorithm of Barequet and Har-Peled [BH01]. In short, it is a translation together with a scaling operation. The intuition is quite straightforward and the proof isn't critical for understanding the concept of coresets, so I will redirect the interested reader to [AHV03] and [BH01].

Lemmas 1 and 2 imply that it suffices to describe an algorithm for computing an ε-approximation of an \\( \alpha \\)-fat point set for some \\( \alpha < 1 \\). Without loss of generality, we assume that \\( \mathbb{C} \supset P \supset [− \alpha, \alpha]^d \\). The following simple lemma, which follows immediately from the observation that for any point \\( q \in \partial CH(P) \\) and for any \\( u \in \mathbb{R}^d, \langle u, q \rangle \geq \alpha ||u|| \\), will be useful for our analysis.

**Lemma 3:** Let \\( P \subset \mathbb{C} \\) be a set of \\(n\\) points in \\( \mathbb{R}^d \\), which is \\( \alpha \\)-fat. For any \\(x \in \mathbb{R}^d \\), we have \\(\bar{\omega} (x, P) \geq 2 \alpha || x || \\)

Proof: it is seen directly considering the previous observation.

**Lemma 4:** Let P be a \\(\alpha\\)-fat point set contained in \\(C = [−1, +1]^d\\), and let \\(ε > 0\\) be a parameter. Suppose P' is a point set with the following property: for any \\(p \in P\\), there is a \\(p' \in P' \\) such that \\(d(p,p') \leq ε \alpha\\). Then \\( (1-ε) \bar{\omega}(x,P) \leq  \bar{\omega}(x,P') \\) for any \\( x \in \mathbb{R}^d \\).

Proof: by Lemma 3, \\( \bar{\omega}(x, P) \geq 2 \alpha ||x|| \\). Let \\( p, q \in P \\) be two points such that
$$
\bar{\omega}(x, \\{ p, q\\}) = \bar{\omega}(x, P) \geq 2 \alpha ||x||
$$
and let \\( p', q' \in P' \\) be two points such that \\(d(p,p'), d(q,q') \leq \varepsilon \alpha \\).

Let \\( w = p - q \\) and \\( w' = p' - q' \\). Then
$$
|| w - w '|| \leq ||p - p'|| + ||q - q'|| \leq 2 \varepsilon \alpha
$$
Moreover,
$$
\begin{eqnarray}
\bar{\omega}(x, \\{ p, q \\}) &=& \max \\{ \langle p, x \rangle, \langle q, x \rangle \\}  - \min \\{ \langle p, x \rangle, \langle q, x \rangle \\} \\\\
 &=& |\langle p, x \rangle - \langle q, x \rangle| = | \langle w, x \rangle |
 \end{eqnarray}
$$
Similarly, \\( \bar{\omega} (x, \\{p',q'\\}) = | \langle w', x \rangle | \\), so
$$
\begin{eqnarray}
\bar{\omega}(x, P) - \bar{\omega}(x, P') &\leq& \bar{\omega}(x, \\{ p, q \\}) -  \bar{\omega}(x, \\{ p', q' \\}) \\\\
&=& | \langle w, x \rangle | - | \langle w', x \rangle | \\\\
&\leq& | \langle w - w', x \rangle | \leq || w - w' || \cdot ||x || \\\\
&\leq&  2 \varepsilon \alpha ||x|| \\\\
&\leq& \varepsilon \bar{\omega}(x, P)
\end{eqnarray}
$$

Using the above lemma, we can construct an ε-approximation of a fat point set as follows.

### Grid-based algorithm for coresets ###
{: #s2-2}

Now that we have a sufficient background, let's discover a first, intuitive way to compute a coreset.

**Lemma 5:** Let \\(P\\) be a \\(\alpha\\)-fat point set contained in \\(\mathbb{C}\\). For any \\(ε > 0\\), we can compute, in \\(O(n + 1/(\alpha ε)^{d-1}) \\) time, a subset \\(Q \subseteq P\\) of \\(O(1/(\alpha ε)^{d−1}) \\) points that ε-approximates \\(P\\).

Proof: consider a \\(d\\)-dimensional grid \\( \mathbb{Z} \\) of size \\( \delta = \frac{ε}{6 \sqrt{d}} \alpha \\). That is:
$$
\mathbb{Z} = \\{ ( \delta i\_1, ..., \delta i\_d) | i\_1, ..., i\_d \in \mathbb{Z} \\}
$$

Now, for each \\(d\\)-tuple \\(I = (i\_1, ..., i\_d) \\), let \\(C\_I\\) be the cell (in \\(x\_d\\)-direction) of \\(\mathbb{Z}\\) of the following form:
$$
[\delta i\_1, \delta (i\_1 + 1)] \times \dots \times [\delta i\_{d-1}, \delta(i\_{d-1} + 1)] \times [\delta\_r, \delta(r+1)], r \in \mathbb{Z}
$$
that contains a point of \\(P\\). If none of the cells in this column contains a point of \\(P\\), we can define \\(C\_I^-, C\_I^+\\) to be any cell in the column. Otherwise, we take any point in the two extreme cells of the column. Let \\( \mathcal{P} = \bigcup\_I (P \cap (C\_I^-, C\_I^+)) \\), i.e., the subset of points that lie in the cells \\(C\_I^-\\) and \\(C\_I^+\\). Clearly, by construction, the Hausdorff distance between \\(\mathcal{CH}(P)\\) and \\(\mathcal{CH}(\mathcal{P})\\) is smaller than \\( \alpha ε/6 \\). Thus, arguing as in the proof of Lemma 4, we have that for any point \\( u \in \mathbb{R}^{d-1} \\), \\( \omega(u, P) \\) is realized by a pair of vertices of \\( \mathcal{CH}(P) \\), and therefore \\( \omega(u, P) - (ε \alpha /3) \leq \omega(u, \mathcal{P}) \\); namely \\( (1 - ε/3) \omega(u, P) \leq \omega(u, \mathcal{P}) \\).

> The Hausdorff distance, or Hausdorff metric, measures how far two subsets of a metric space are from each other. It turns the set of non-empty compact subsets of a metric space into a metric space in its own right.
It is defined as (see illustration):
$$
d_{{{\mathrm  H}}}(X,Y) = \max\\{ \sup\_{{x \in X}}\inf\_{{y\in Y}}d(x,y),\sup\_{{y\in Y}}\inf\_{{x\in X}}d(x,y) \\}
$$
![image](img/Hausdorff_d2.png){: width="100%"}
*Illustration of the Hausdorff distance. Source: `https://en.wikipedia.org/wiki/Hausdorff_distance#/media/File:Hausdorff_distance_sample.svg`*

Now for each \\((d-1)\\)-tuple  \\(I\\), we choose one point from \\(P \cap C\_I^-\\) and another point from \\(P \cap C\_I^+\\) and add them both to \\(Q\\). Since \\( P \subseteq \mathbb{C} = [-1,1]^d, |Q| = O(1/(\alpha ε)^{d-1}); \\) \\(Q\\) can be constructed in \\( O(n + 1/(\alpha ε)^{d-1}) \\) time, assuming that the ceiling operation can be performed in constant time.

![image](img/grid_coreset_intro.png){: width="100%"}
*An example coreset (red points) that can be computed with the grid-based algorithm in \\( \mathbb{R}^2 \\).*

 We have chosen in \\(Q\\) one point of \\(P\\) from grid cells \\( C\_I^- , C\_I^+ \\), for every \\((d-1)\\)-tuple \\(I\\), which contained a point of \\(P\\). Therefore for every point \\(p \in \mathcal{P} \\), there is a point \\( q \in Q \\) with the property that \\( d(p,q) \leq ε/6 \\). Hence, by Lemma 3:

$$
(1 - ε)\omega(u, P) \leq (1 - ε/3)^2 \omega (u, P) \leq (1 - ε/3) \omega(u, \mathcal{P} ) \leq \omega(u, Q)
$$
thereby implying that \\( Q \\) is an \\(ε\\)-approximation of \\( P \\).

### Improved construction###
{: #s2-3}

Let us describe an improved construction, observed independently in [C04] and [Y04], which is a simplification of an algorithm of [AHV04], which in turn is an adaptation of a method of[D74].

**Lemma 6:** Let \\( S \\) be the sphere of radius \\( \sqrt{d + 1} \\) centered at the origin. Set \\( \delta = \sqrt{\varepsilon \alpha} \leq 1/2 \\). One can construct a set \\(J\\) of \\(O(1/\delta^{d−1}) = O(1/ε^{(d−1)/2}) \\) points on the sphere \\(S\\) so that for any point \\(x\\) on S, there exists a point \\(y \in J\\) such that \\(||x − y|| \leq \delta\\). We process P into a data structure that can answer ε-approximate nearest-neighbor queries [A98]. In my implementation, I will use k-d trees which allow exact nearest-neighbor queries for the sake of simplicity. For a query point \\( q \\), let \\( \phi(q) \\) be the point of \\( P \\) returned by this data structure. For each point \\( y \in J \\), we compute \\( \phi (y) \\) using this data structure. We finally return the set \\( Q = \\{ \phi(y) | y \in J \\} \\).


![image](img/coreset_improved.png){: width="100%"}
*Coreset construction with this improved algorithm in \\( \mathbb{R}^2 \\). Here \\(S\\) is the sphere and C is the unit hypercube (in 2D, so we may actually talk of circle and square).*

Let us now explain why \\( Q \\) is a coreset of \\( P \\), following the argument in [Y04]. For simplicity, we prove the claim under the assumption that \\( \phi(y) \\) is the exact nearest-neighbor of \\( y \\) in  \\( P\\). Fix a direction \\( u \in S^{d−1} \\).
Let \\( \sigma \in P \\) be the point that maximizes \\( \langle u,p \rangle \\) over all \\( p \in P \\). Suppose the ray emanating from \\( \sigma \\) in direction \\( u \\) hits \\( S \\) at a point \\( x \\). We know that there exists a point
\\( y \in J \\) such that \\( || x − y || \leq \delta \\).  
If \\( \phi (y) = \sigma \\), then \\( \sigma \in Q \\) and
$$
\max\_{p \in P} \langle u, p \rangle - \max\_{q \in Q} \langle u, q \rangle = 0
$$
Now suppose \\( \phi (y) \neq \sigma \\). Let \\( B \\) be the d-dimensional ball of radius \\( ||y − \sigma || \\) centered at \\(y\\). Since \\( || y − \phi(y) || \leq || y − \sigma||, \phi(y) \in B \\). Let us denote by \\( z \\) the point on the sphere \\( \partial B\\) that is hit by the ray emanating from \\( y\\) in direction \\( − u \\).

Let \\( w \\) be the point on \\( zy \\) such that \\( zy ⊥ \sigma w \\) and \\( h \\) the point on \\( \sigma x \\) such that \\( yh⊥ \sigma x \\):

![image](img/improved_construction_correctness.png){: width="100%"}
*Correctness of this construction*


The hyperplane normal to \\( u \\) and passing through \\( z \\) is tangent to \\( B\\). Since \\( \phi (y) \\) lies inside \\( B \\), \\( \langle u, \phi (y) \rangle \geq \langle u, z \rangle \\). Moreover, it can be shown that \\( \langle u, \sigma \rangle −
\langle u, \phi (y) \rangle \leq \alpha \varepsilon \\). Thus, we can write
$$
\max\_{p \in P} \langle u, P \rangle - \max\_{q \in Q} \langle u, Q \rangle \leq \langle u, \sigma \rangle - \langle u, \phi(y) \rangle \leq \alpha \varepsilon
$$
Similarly, we have \\( \min\_{p \in P} \langle u, p \rangle − \min\_{q \in Q} \langle u, q \rangle \geq − \alpha \varepsilon \\).

The above two inequalities together imply that \\( \omega(u,Q) \geq \omega(u,P) − 2 \alpha \varepsilon \\). Since \\( \alpha C \subset CH(P) \\) (as \\( P \\) is fat), \\( \omega(u,P) \geq 2 \alpha \\). Hence \\( \omega (u,Q) \geq (1− \varepsilon) \omega (u,P) \\), for any direction \\(u \in S^{d−1}\\), thereby implying that \\( Q \\) is an \\( \varepsilon \\)-kernel of \\( P \\).
