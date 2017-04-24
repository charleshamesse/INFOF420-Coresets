## 3. Applications
{: #s3}

In this section, we will review the kind of measures we can approximate using such coresets and my implementations of the improved algorithm. I introduced two algorithms, the one using a grid and the one using a sphere. The former is rather intuitive and straightforward, I chose to focus on the latter which seems much more elegant to me.
To help visualizing the concept, I made two different versions, one in 2D and one in 3D.

### 3.1 Approximating faithful extent measures ###
{: #s3-1}

> We call an extent measure \\( µ \\) faithful if there exists a constant \\( \alpha  > 0 \\) such that for any \\( ε\\)-approximation \\(Q\\) of \\(P\\), \\( \mu(Q) \geq (1 − \alpha ε) \mu(P) \\).

Examples of faithful measures are common and include diameter, width, radius of the smallest enclosing ball, volume of the minimum bounding box, volume of \\(\mathcal{CH}(P)\\), and surface area of \\(\mathcal{CH}(P)\\). A common property of all these measures is that \\( \mu (P) = \mu (\mathcal{CH}(P)) \\). As mentioned in Section 2, if \\(P \subset \mathbb{C}\\), then the Hausdorff distance between \\( \delta (\mathcal{CH}(P))\\) and \\( \delta( \mathcal{CH}(Q)) \\), for an \\(ε\\)-approximation \\(Q\\) of \\(P\\), is at most \\(O(ε)\\), which implies that \\( \mu(P) = \mu(\mathcal{CH}(P)) \geq \mu(Q) \leq (1 − ε) \mu(P) \\). For a given point set \\(P\\), a faithful measure \\( \mu \\), and a parameter \\( ε > 0 \\), we can compute a value \\( \bar {μ} \\), with \\( (1 − ε) \mu(P ) \leq \bar{\mu} \leq \mu(P) \\) by first computing an \\(ε\\)-approximation \\(Q\\) of \\(P\\) and then using an exact algorithm for computing \\( \mu (Q) \\).

### 3.2 Improved construction in 2D
{: #s3-2}

This is the extended version of the applet shown in the introduction. As described in the improved algorithm paragraph, points on a sphere (a circle in 2D) are used to compute their nearest neighbor, that will make the coreset of the input point set. To allow nearest neighbors queries, points are all put in a k-d tree. Such data structures allow nearest neighbor queries running with an \\( O(\log n) \\) time complexity.

#### [Open the interactive applet](./applications/improved_construction_2d.html)

I added some range controls, for the reader to play with the input set point as well as the epsilon value. It is expected that the error rises as the epsilon value rises. Now, we need to discuss how the error is computed. For a set of directions \\( \Delta \\) in \\( S^1 \\) (the circle in 2D), it is defined as:
$$
err(Q, P) = \max\_{u \in \Delta} \frac{\omega(u,P) - \omega(u,Q)}{\omega(u, P)}
$$
The intuition is the following: it's the maximum value amongst all relatives errors on directional widths, for all directions in \\( \Delta \\). It goes without saying that this metric's accuracy rises with the number of directions considered. The authors use 1000 directions in a 4D space. I chose to implement an algorithm with 4 directions for this example in 2D as it should be enough for the proof of concept. The four directions are, for the two unit vectors \\(\vec{x}\\) and \\(\vec{y}\\) in the 2D cartesian space (with a slight abuse of notation to match the aforementioned developments, mixing points on the unit sphere and directions):

$$
u\_1 = \vec{x} \\\\
u\_2 = \vec{y} \\\\
u\_3 = \cos( \pi /4 ) \vec{x} + \sin( \pi /4 ) \vec{y} \\\\
u\_4 = \cos( \pi /4 ) \vec{x} - \sin( \pi /4 ) \vec{y}
$$
Which makes sense as directional widths are symmetrical, we get the horizontal, the vertical and the two diagonals.


### 3.3 Improved construction in 3D
{: #s3-3}

I wanted to have something a little fancier to see and demonstrate the concept of coresets so I spent some time developing this 3D applet.

#### [Open the interactive applet](./applications/improved_construction.html)

However, I chose not to compute the error on that one because of the increased complexity - to achieve roughly the same level of accuracy as with 4 directional widths in 2D, I would need to compute many more directional widths.

This remains a beautiful way to quickly grasp the concepts and play with them.

On a side note, an interesting and elegant feature of this implementation is the algorithm used to spatially distribute the points on the sphere. I used Fibonacci's algorithm,  which turns to be an efficient way to do this task with an accuracy high enough to trick the human eye. Here's a sketch of the algorithm for a set \\(P\\) with \\(|P| = N\\) points on the unit 2-sphere. Set:
$$
\begin{eqnarray}
\text{offset} &=& 2/N \\\\
\text{increment} &=&  \pi  \times (3 - \sqrt{5}) \\\\
\end{eqnarray}
$$
Now, for each \\( p \in [0, N[ \\):
$$
\begin{eqnarray}
y &=& ((p * \text{offset}) - 1) + (\text{offset} / 2) \\\\
r &=&\sqrt{1 - y^2} \\\\
\varphi &=& ((p + 1) \% N) \times \text{increment} \\\\
x &=& \cos(\varphi) \times r \\\\
z &=& \sin(\varphi) \times r
\end{eqnarray}
$$
And here, give the p-th point the coordinates \\( (x,y,z) \\).


----

And that closes the article. I hope you enjoyed reading! There might be typos or even errors in the text, I will try to read it again every now and then to detect them as much as possible.

Should you need any information, please contact me: charles.hamesse@ulb.ac.be
