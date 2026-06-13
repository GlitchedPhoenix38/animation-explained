# AXIOM — Design Audit

## 1. Hero Particle System (2000 WebGL particles + physics + cursor gravity + scroll parallax)

**Why it feels artificial:** The hero background has more computational complexity than the entire contents of most premium websites. 2000 particles each with velocity drift, gravitational pull toward cursor, and spring-back to origin, running through Three.js while a Framer Motion spring overlay tracks the cursor separately, while GSAP scrolls the camera — this isn't a design decision, it's a performance benchmark disguised as a hero.

**Why a human designer would reject it:** It exhausts the user before they've read a single word. The motion never stops. There's no stillness, no silence. Premium design knows that attention is finite — this spends the entire budget on a background effect.

**Principle violated:** *Good design is as little design as possible* (Rams). *Perceived performance* — a heavy page feels slow even if it loads fast. *Cognitive load* — motion ≠ value.

**Solution:** Remove the particle system entirely. Replace with a static or near-static gradient or a single subtle ambient light effect. The hero should be quiet. Let the content breathe.

**Severity: 10 / 10**

---

## 2. Three Animation Frameworks Running Simultaneously in Hero (Three.js + GSAP + Framer Motion)

**Why it feels artificial:** Three frameworks all doing overlapping work (WebGL physics, scroll-driven camera, spring cursor overlay, staggered word reveal) signals "I wanted to use all the tools" rather than "I chose the right tool."

**Why a human designer would reject it:** Each framework introduces its own performance cost, memory footprint, and potential for jank. A senior engineer picks ONE motion layer per page. Having three is technically irresponsible.

**Principle violated:** *Principle of parsimony* (Occam's Razor). *Consistency* — three different motion paradigms fight each other.

**Solution:** Pick one. CSS transitions alone would handle 90% of what this page needs. If you must animate, use one framework.

**Severity: 8 / 10**

---

## 3. The Entire Copy Tone (pseudo-intellectual tech jargon)

**Why it feels artificial:** "Stop reading abstracts—start observing coordinate systems," "Kinaesthetic Learning," "Visual Explanatory Engine," "Launch Simulation," "Read Manifesto," "COORDINATE WELL [X, Y, Z]," "Enter Stage," "DESIGNED BY AXIOM CREATIVE LABS," "AXIOM LABS INC." — every single one of these phrases is the kind of thing someone thinks "a serious tech company" sounds like. It's pastiche.

**Why a human designer would reject it:** Stripe, Linear, Notion, Figma all use plain English. "Figma brings your teams together" (5 words). "Notion is the connected workspace" (5 words). The copy here tries to impress instead of inform. It's also inconsistent — is this an "educational engine," a "laboratory," a "stage," or a "simulation"?

**Principle violated:** *Honesty in design* — say what you do, do what you say. *Clarity* — the user should know in 2 seconds what this site does.

**Solution:** Rewrite everything in plain English. "Watch how gravity works. Change the numbers. See what happens." That's the product. Say that.

**Severity: 9 / 10**

---

## 4. Word-by-Word Staggered Slide-Up Headline with Gradient Text on Selected Words

**Why it feels artificial:** "Learn Concepts **Through** **Motion**" where "Through" and "Motion" get a cyan-to-blue-to-indigo gradient AND a staggered entrance animation is the single most recognizable AI-generated-design pattern in 2025-2026. It's in every template, every AI output, every "modern landing page" tutorial.

**Why a human designer would reject it:** The gradient on individual words breaks the typographic color of the sentence. The staggered entrance draws attention to the animation mechanism, not the message. A headline should hit you whole, line by line, not word by word.

**Principle violated:** *Typographic color* — a text block should read as a unified texture. *Krug's "Don't Make Me Think."* *Motion hierarchy* — motion should serve content, not be the content.

**Solution:** Reveal the headline as a single line (or at most two lines), not individual words. Remove gradient text entirely. Use a single solid color for the whole headline.

**Severity: 8 / 10**

---

## 5. 3D is the Wrong Medium for Every Single Explainer

**Why it feels artificial:** Sorting algorithms are not inherently 3D. Database joins are not inherently 3D. Neural network signals are not inherently 3D. These concepts are being forced into Three.js wireframe scenes because 3D is "impressive," not because 3D is instructional. The result is abstract visual clutter that obscures the concept.

**Why a human designer would reject it:** Clarity is the first obligation of an educational tool. A 2D sorting visualization (bars moving) is clearer, faster to parse, and more legible than 3D rotating columns. The 3D adds Z-axis depth that has NO relationship to the concept being taught — it's a lie.

**Principle violated:** *Honest design* — form follows function. *Signal vs. noise.* *Educational integrity* — the visualization should make the concept clearer, not more complex.

**Solution:** Use 2D for everything except the gravity/spacetime scene (where 3D actually matters). 2D canvas or even CSS/SVG would be clearer, faster, and more accessible.

**Severity: 9 / 10**

---

## 6. Scroll-Triggered Camera Orbit on Every Explainer Page

**Why it feels artificial:** The camera orbits the 3D scene as you scroll. This is the defining pattern of "scrollytelling portfolio template" circa 2022-2024. It's been done to death. It adds zero instructional value.

**Why a human designer would reject it:** Scrolling should advance the narrative or reveal new information. Having the camera orbit the same scene from a different angle doesn't teach anything — it just adds motion.

**Principle violated:** *Principle of least surprise.* *Purposeful interaction* — every scroll should surface new content, not just rotate the camera.

**Solution:** Use scroll to progress through distinct steps of the concept, not to orbit a 3D camera. Each scroll position should show something genuinely new.

**Severity: 7 / 10**

---

## 7. Five-Color Category System (amber/cyan/pink/violet/green)

**Why it feels artificial:** Every category gets its own accent color for badges, borders, glows, shadows, and text. This is a textbook "design system demo" — it's meant to show off the system, not serve the user.

**Why a human designer would reject it:** Five competing accent colors create visual noise. The card grid becomes a rainbow of competing glows on hover. Notion uses one. Linear uses one. Stripe uses one. They're right.

**Principle violated:** *Visual consistency.* *Principle of restraint.* *Information design* — color should signal hierarchy, not decorate categories.

**Solution:** Use one accent color (or at most two: one for the brand, one for interactive states). Categories can be distinguished by iconography or typography, not color.

**Severity: 6 / 10**

---

## 8. Footer with Version Number and Coordinates

**Why it feels artificial:** "V1.0.0 (BETA)" and "COORDINATE WELL [X, Y, Z]" in the hero footer are pure portfolio affectation. Real products don't display version numbers in the UI. Real products don't print fake coordinate systems as decorative text.

**Why a human designer would reject it:** These add nothing to the user experience. They're signals to other developers ("look, I made a versioned thing") at the expense of the actual user.

**Principle violated:** *User-centered design.* *Every pixel should serve a purpose.*

**Solution:** Remove both. Replace the footer with a simple copyright line or nothing.

**Severity: 7 / 10**

---

## 9. "Kinaesthetic Learning" Badge with Pulsing Dot

**Why it feels artificial:** A badge with a pulsing cyan dot labeled "Kinaesthetic Learning" (also: misspelled — should be "kinesthetic") that exists only to add a "live" feel to the hero. It doesn't tell the user anything useful.

**Why a human designer would reject it:** The blinking dot screams "attention here!" but has nothing to say. It's the web equivalent of a storefront arrow pointing at the door.

**Principle violated:** *Attention should be earned.* *False affordance* — it looks like a live status indicator for something that isn't live.

**Solution:** Remove the badge entirely. Or replace it with a real, useful label if one exists.

**Severity: 5 / 10**

---

## 10. Generic Card Descriptions Generated from Template

**Why it feels artificial:** Every card description follows the exact same pattern: "Visualize parameters, track vector flows, and experiment with {category} models." This is programmatic text generation, not human copywriting.

**Why a human designer would reject it:** It's repetitive and says nothing specific about any individual concept. "Visualize parameters" is true for ALL of them.

**Principle violated:** *Specificity.* *Honest copywriting.* *Differentiation* — each concept should have a unique value proposition.

**Solution:** Write unique, concrete descriptions for each card. What specifically will the user learn from Gravity vs. Sorting?

**Severity: 5 / 10**

---

## 11. Over-Engineered Card Hover Effects (5 simultaneous transitions)

**Why it feels artificial:** On hover, each card simultaneously: changes border color, adds a colored shadow, reveals a blur-3xl background glow, changes title to cyan, slides the arrow right. Five competing hover effects is the hallmark of template design.

**Why a human designer would reject it:** Hover should provide a single, clear signal that the element is interactive. Five effects is sensory overload. Apple's hover states are a single highlight or scale change.

**Principle violated:** *Restraint in interaction design.* *One interaction, one response.*

**Solution:** Pick one hover effect. A subtle transform (scale 1.02) or a single color change. Remove the rest.

**Severity: 5 / 10**

---

## 12. Geist Font Loaded But Never Applied

**Why it feels artificial:** The layout loads Geist and Geist Mono via next/font and sets CSS variables, but the global CSS body rule sets `font-family: system-ui, -apple-system, ...` which overrides Geist entirely. The Geist variable is available on the HTML element but no CSS rule actually uses `var(--font-geist-sans)` in `font-family`.

**Why a human designer would reject it:** It's a detail that shows lack of polish. Either use the font or don't load it.

**Principle violated:** *Craft.* *Every byte matters.*

**Solution:** Either apply Geist to the body font or remove the font loading.

**Severity: 4 / 10**

---

## 13. Parameter HUD Looks Like a Video Game UI

**Why it feels artificial:** The bottom HUD with "Parameters HUD" label, preset buttons, and range sliders looks like a game debug overlay. It's appropriate for Unity, not for an educational website.

**Why a human designer would reject it:** It signals "technical tool" rather than "learning experience." The HUD competes with the content instead of being integrated into the experience.

**Principle violated:** *Context-appropriate design.* *Visual hierarchy.*

**Solution:** Integrate controls into the narrative. Let parameters change naturally as the user scrolls, or use simpler inline controls.

**Severity: 6 / 10**

---

## 14. Hero Has No Clear Value Proposition

**Why it feels artificial:** What does this site actually DO? The headline says "Learn Concepts Through Motion" — okay, learn how? The subtitle says "An interactive digital medium detailing theories of physics, sorting algorithms, and neural networks visually" — medium? detailing? The brand name is "AXIOM — Visual Explanatory Engine" — this sounds like a product, but it's just a website.

**Why a human designer would reject it:** A user who lands on this page has 2-3 seconds to understand what it is. The value proposition is buried under brand name, badge, animated headline, subtitle, two buttons, and a 2000-particle space scene.

**Principle violated:** *Krug's "Don't make me think." *Above-the-fold clarity.***

**Solution:** One clear sentence. "See how gravity, networks, and algorithms work by playing with them." That's it.

**Severity: 8 / 10**

---

## 15. Excessive Typographic Variance

**Why it feels artificial:** The site uses: text-[10px], text-xs, text-sm, text-base, text-xl, text-3xl, text-4xl, text-5xl, with additional tracking-tight, tracking-tighter, tracking-widest, tracking-wide, and font weights from light through bold. This many distinct type scales creates a noisy visual rhythm.

**Why a human designer would reject it:** A disciplined typographic system uses 3-4 sizes maximum. Every additional size dilutes the hierarchy. The font-mono usage across badges, footers, nav, chapter labels, HUD labels, and parameter values is excessive.

**Principle violated:** *Typographic discipline.* *Rhythm and repetition.*

**Solution:** Define a 3-4 level type scale (h1, h2, body, small). Reduce font-mono to only genuinely technical contexts.

**Severity: 4 / 10**

---

# Prioritized Action Plan

## High Impact (fix these first — they define user perception)

| # | Change | Severity | Effort |
|---|---|---|---|
| 1 | **Remove the hero particle system entirely.** Replace with a static or near-static background. | 10 | Medium |
| 2 | **Rewrite all copy in plain English.** Remove "AXIOM" branding affectations, pseudo-intellectual taglines, "Kinaesthetic Learning," "Explanatory Engine," "Coordinate Well [X,Y,Z]." Write what the site actually does. | 9 | Low |
| 3 | **Flatten the headline.** Remove word-by-word stagger. Remove gradient text. One solid color, one entrance. | 8 | Low |
| 4 | **Replace 3D explainers with 2D visualizations** for sorting, networking, ML, databases. Keep 3D only for gravity/spacetime where it's meaningful. | 9 | High |
| 5 | **Reduce the hero to one animation framework** (preferably zero). Choose CSS transitions and remove Three.js + GSAP + Framer Motion from the hero. | 8 | Medium |
| 6 | **Define a clear, single value proposition** above the fold. Answer "what is this?" in one sentence. | 8 | Low |

## Medium Impact (fix for polish and credibility)

| # | Change | Severity | Effort |
|---|---|---|---|
| 7 | **Remove the staggered scroll camera orbit** on explainer pages. Scroll should advance content, not rotate a camera. | 7 | Medium |
| 8 | **Remove the footer version number and coordinate text.** | 7 | Low |
| 9 | **Unify to a single accent color.** Remove the 5-color category system. | 6 | Low |
| 10 | **Redesign the parameter HUD** to not look like a game debug overlay. Integrate controls into the narrative. | 6 | Medium |
| 11 | **Apply the Geist font correctly** or stop loading it. | 4 | Low |
| 12 | **Reduce card hover to one effect.** Remove the blur glow, color shadow, and color title change. Keep one transform or color highlight. | 5 | Low |
| 13 | **Remove the pulsing dot on the badge.** | 5 | Low |
| 14 | **Write unique card descriptions** instead of the generated template pattern. | 5 | Low |

## Low Impact (nice-to-have cleanup)

| # | Change | Severity | Effort |
|---|---|---|---|
| 15 | **Reduce type scale** from ~9 sizes to 3-4 core sizes. Reduce font-mono usage. | 4 | Medium |
| 16 | **Simplify the header bar** — rounded-full glass is an Apple clone. A simple flat header suffices. | 4 | Low |
| 17 | **Remove custom scrollbar styling** — let the OS handle it. | 3 | Low |
| 18 | **Remove the "DESIGNED BY AXIOM CREATIVE LABS"** footer line. | 3 | Low |
| 19 | **Consider adding a light mode** or removing unused light mode CSS tokens. | 2 | Medium |

---

**Summary:** The site is trying to do too much. It uses technology to solve problems that don't exist. The single highest-leverage change is removing the hero particle system and rewriting the copy — that alone would transform the feel from "AI-generated template" to "intentional product." After those two changes, flattening the animation stack and replacing 3D explainers with 2D would complete the transformation to a calm, human-designed experience.
