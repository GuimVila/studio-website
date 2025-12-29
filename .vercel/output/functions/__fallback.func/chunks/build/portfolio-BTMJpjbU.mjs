import { ssrRenderAttrs, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc, u as useHead } from './server.mjs';
import { useSSRContext } from 'vue';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'better-sqlite3';
import 'node:url';
import 'ipx';
import 'vue-router';
import '@supabase/ssr';
import 'tailwindcss/colors';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = {
  __name: "portfolio",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Portfoli | Guillem Vila · Artista, productor musical i enginyer de so",
      meta: [
        {
          name: "description",
          content: "Descobreix el meu portfoli. Mostra de projectes, col·laboracions i treballs destacats com a productor musical i enginyer de so."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-01ea7b14><div style="${ssrRenderStyle({ "padding-top": "100px" })}" data-v-01ea7b14><section class="section" data-v-01ea7b14><h1 class="section-title" data-v-01ea7b14>Portfoli</h1><p style="${ssrRenderStyle({ "text-align": "center", "font-size": "1.2rem", "color": "var(--text-secondary)", "margin-bottom": "4rem" })}" data-v-01ea7b14> Una selecció dels meus projectes i treballs realitzats. </p></section></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/portfolio.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const portfolio = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-01ea7b14"]]);

export { portfolio as default };
//# sourceMappingURL=portfolio-BTMJpjbU.mjs.map
