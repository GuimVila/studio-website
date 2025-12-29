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
  __name: "cookies",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Política de Cookies | Guillem Vila · Artista, productor musical i enginyer de so",
      meta: [
        {
          name: "description",
          content: "Consulta la política de cookies de Guillem Vila i descobreix com es gestionen les cookies i el consentiment en aquest lloc web."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-41e632f2><section class="section" data-v-41e632f2><div class="container" data-v-41e632f2><h1 class="section-title" data-v-41e632f2>Política de Cookies</h1><p data-v-41e632f2> Aquesta pàgina explica què són les cookies, com s’utilitzen en aquest lloc web i com pots gestionar-les. </p><h2 data-v-41e632f2>Què són les cookies?</h2><p data-v-41e632f2> Les cookies són petits fitxers de text que s’emmagatzemen al dispositiu de l’usuari quan visita una pàgina web. Serveixen per garantir el bon funcionament del lloc, millorar l’experiència de navegació i obtenir informació estadística. </p><h2 data-v-41e632f2>Tipus de cookies utilitzades</h2><h3 data-v-41e632f2>Cookies tècniques o essencials</h3><p data-v-41e632f2> Aquestes cookies són necessàries per al funcionament correcte del lloc web i no requereixen el consentiment de l’usuari. Inclouen, per exemple, les cookies que permeten guardar les preferències de consentiment. </p><h3 data-v-41e632f2>Cookies no essencials</h3><p data-v-41e632f2> Aquest lloc web pot utilitzar cookies analítiques o de seguiment (com Google Analytics o serveis similars) únicament si l’usuari proporciona el seu consentiment explícit mitjançant el banner de cookies. </p><h2 data-v-41e632f2>Gestió del consentiment</h2><p data-v-41e632f2> L’usuari pot acceptar o rebutjar les cookies no essencials a través del banner de cookies que apareix en accedir al lloc web. El consentiment es pot modificar o retirar en qualsevol moment. </p><h2 data-v-41e632f2>Com desactivar les cookies?</h2><p data-v-41e632f2> A més del sistema de consentiment del lloc web, l’usuari pot configurar el seu navegador per bloquejar o eliminar les cookies instal·lades. Tingues en compte que això pot afectar el funcionament del lloc. </p><h2 data-v-41e632f2>Canvis en la política de cookies</h2><p data-v-41e632f2> Aquesta política pot actualitzar-se periòdicament. Es recomana revisar-la regularment per estar informat de possibles canvis. </p></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cookies.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cookies = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-41e632f2"]]);

export { cookies as default };
//# sourceMappingURL=cookies-BZI8GALe.mjs.map
