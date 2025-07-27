
# 🧮 Math Examples

This document demonstrates the mathematical capabilities of the Advanced Markdown Viewer using MathJax.

## Basic Math Notation

### Inline Math

Here are some inline math examples:
- Einstein's equation: $E = mc^2$
- Pythagorean theorem: $a^2 + b^2 = c^2$
- Quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
- Natural logarithm: $\ln(e) = 1$

### Display Math

Complex equations look better in display mode:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

## Advanced Examples

### Calculus

#### Derivatives
$$
\frac{d}{dx} \sin(x) = \cos(x)
$$

$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

#### Integrals
$$
\int_0^1 x^2 dx = \frac{1}{3}
$$

$$
\oint_C \vec{F} \cdot d\vec{r} = \iint_S (\nabla \times \vec{F}) \cdot \hat{n} \, dS
$$

### Linear Algebra

#### Matrices
$$
A = \begin{pmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{pmatrix}
$$

#### Determinant
$$
\det(A) = \begin{vmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{vmatrix} = a(ei - fh) - b(di - fg) + c(dh - eg)
$$

#### Eigenvalues
$$
A\vec{v} = \lambda\vec{v}
$$

### Statistics

#### Normal Distribution
$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
$$

#### Bayes' Theorem
$$
P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}
$$

### Physics

#### Schrödinger Equation
$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)
$$

#### Maxwell's Equations
$$
\begin{align}
\nabla \cdot \vec{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \vec{B} &= 0 \\
\nabla \times \vec{E} &= -\frac{\partial \vec{B}}{\partial t} \\
\nabla \times \vec{B} &= \mu_0\vec{J} + \mu_0\epsilon_0\frac{\partial \vec{E}}{\partial t}
\end{align}
$$

## Greek Letters

Common Greek letters used in mathematics:

| Letter | Symbol | LaTeX |
|--------|--------|-------|
| Alpha | $\alpha$ | `\alpha` |
| Beta | $\beta$ | `\beta` |
| Gamma | $\gamma$ | `\gamma` |
| Delta | $\delta$ | `\delta` |
| Epsilon | $\epsilon$ | `\epsilon` |
| Lambda | $\lambda$ | `\lambda` |
| Mu | $\mu$ | `\mu` |
| Pi | $\pi$ | `\pi` |
| Sigma | $\sigma$ | `\sigma` |
| Omega | $\omega$ | `\omega` |

## Complex Expressions

### Fourier Transform
$$
\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x) e^{-2\pi i x \xi} dx
$$

### Taylor Series
$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n
$$

### Riemann Zeta Function
$$
\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} = \prod_{p \text{ prime}} \frac{1}{1-p^{-s}}
$$

## Formatting Tips

### Fractions
- Simple: `\frac{a}{b}` → $\frac{a}{b}$
- Continued: `\cfrac{a}{b + \cfrac{c}{d}}` → $\cfrac{a}{b + \cfrac{c}{d}}$

### Roots
- Square root: `\sqrt{x}` → $\sqrt{x}$
- nth root: `\sqrt[n]{x}` → $\sqrt[n]{x}$

### Subscripts and Superscripts
- Subscript: `x_1` → $x_1$
- Superscript: `x^2` → $x^2$
- Both: `x_1^2` → $x_1^2$

### Operators
- Sum: `\sum_{i=1}^n` → $\sum_{i=1}^n$
- Product: `\prod_{i=1}^n` → $\prod_{i=1}^n$
- Integral: `\int_a^b` → $\int_a^b$
- Limit: `\lim_{x \to 0}` → $\lim_{x \to 0}$

---

**Mathematical expressions make documentation more precise and beautiful! ✨**
