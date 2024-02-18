import { c as createAstro, d as createComponent, r as renderTemplate, m as maybeRenderHead } from '../astro_Ctgn66Ex.mjs';
import 'kleur/colors';
import 'clsx';
import 'cssesc';

const $$Astro = createAstro();
const prerender = false;
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  return renderTemplate`${maybeRenderHead()}<div>this is a ssr page</div>`;
}, "D:/Adrien/Documents/Developpement Web/astro_wordpress/astro-estates/src/pages/[...ssr].astro", void 0);

const $$file = "D:/Adrien/Documents/Developpement Web/astro_wordpress/astro-estates/src/pages/[...ssr].astro";
const $$url = "/[...ssr]";

export { $$ as default, $$file as file, prerender, $$url as url };
