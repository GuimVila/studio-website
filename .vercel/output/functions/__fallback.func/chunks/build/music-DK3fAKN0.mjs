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
  __name: "music",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Música | Guillem Vila · Artista, productor musical i enginyer de so",
      meta: [
        {
          name: "description",
          content: "Escolta la meva música i projectes destacats com a artista. Descobreix les meves creacions musicals i col·laboracions professionals."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-6717145e><div style="${ssrRenderStyle({ "padding-top": "100px" })}" data-v-6717145e><section class="section" data-v-6717145e><h1 class="section-title" data-v-6717145e>Música</h1><p style="${ssrRenderStyle({ "text-align": "center", "font-size": "1.2rem", "color": "var(--text-secondary)", "margin-bottom": "4rem" })}" data-v-6717145e> Escolta algunes de les meves creacions musicals, col.laboracions i projectes destacats. </p></section></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/music.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const music = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6717145e"]]);

export { music as default };
//# sourceMappingURL=music-DK3fAKN0.mjs.map
