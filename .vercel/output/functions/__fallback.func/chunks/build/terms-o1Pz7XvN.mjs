import { ssrRenderAttrs } from 'vue/server-renderer';
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
  __name: "terms",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Terms and Conditions | Guillem Vila · Artista, productor musical i enginyer de so",
      meta: [
        {
          name: "description",
          content: "Consulta els termes i condicions d'aquesta pàgina web. Informació clara sobre l’ús del lloc web, serveis, drets i responsabilitats dels usuaris i clients."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-37f76e69><section class="section" data-v-37f76e69><div class="container" data-v-37f76e69><h1 class="section-title" data-v-37f76e69>Termes i Condicions</h1><p data-v-37f76e69> Aquests termes i condicions regulen l&#39;ús del nostre lloc web i serveis. En accedir-hi, accepteu aquestes condicions. </p><h2 data-v-37f76e69>1. Ús del lloc web</h2><ul data-v-37f76e69><li data-v-37f76e69>El lloc web és només per a ús informatiu i professional.</li><li data-v-37f76e69> No es permet copiar, distribuir o modificar el contingut sense autorització. </li><li data-v-37f76e69> Els usuaris es comprometen a utilitzar el lloc de manera responsable. </li></ul><h2 data-v-37f76e69>2. Propietat intel·lectual</h2><p data-v-37f76e69> Tots els drets de contingut, disseny, imatges i material audiovisual pertanyen a Guillem Vila o els seus col·laboradors. </p><h2 data-v-37f76e69>3. Limitació de responsabilitat</h2><p data-v-37f76e69> No ens fem responsables de danys directes o indirectes derivats de l&#39;ús del lloc web o contingut. </p><h2 data-v-37f76e69>4. Enllaços a tercers</h2><p data-v-37f76e69> El lloc pot contenir enllaços a pàgines externes. No garantim la seva precisió ni responsabilitat sobre aquests continguts. </p><h2 data-v-37f76e69>5. Modificacions dels termes</h2><p data-v-37f76e69> Podem actualitzar aquests termes en qualsevol moment. L&#39;ús continuat del lloc implica acceptació dels canvis. </p><h2 data-v-37f76e69>6. Contacte</h2><p data-v-37f76e69> Per qualsevol dubte sobre aquests termes, podeu contactar-me a <a href="mailto:info@guillemvila.com" data-v-37f76e69>info@guillemvila.com</a>. </p></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/terms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const terms = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-37f76e69"]]);

export { terms as default };
//# sourceMappingURL=terms-o1Pz7XvN.mjs.map
