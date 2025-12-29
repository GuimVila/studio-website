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
  __name: "privacy",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Política de Privacitat | Guillem Vila · Artista, productor musical i enginyer de so",
      meta: [
        {
          name: "description",
          content: "Consulta la política de privacitat de la meva web i descobreix com es gestionen i protegeixen les dades personals dels usuaris d’aquest lloc web."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-bb355442><section class="section" data-v-bb355442><div class="container" data-v-bb355442><h1 class="section-title" data-v-bb355442>Política de Privacitat</h1><h2 data-v-bb355442>Responsable del tractament</h2><p data-v-bb355442> El responsable del tractament de les dades personals és Guillem Vila, artista, productor musical i enginyer de so. Pots contactar a través del correu electrònic: contacte@guillemvila.com </p><h2 data-v-bb355442>Base legal del tractament</h2><p data-v-bb355442> La base legal per al tractament de les dades personals és el consentiment explícit de l’usuari, atorgat mitjançant els formularis disponibles en aquest lloc web. L’usuari pot retirar el consentiment en qualsevol moment. </p><h2 data-v-bb355442>Conservació de les dades</h2><p data-v-bb355442> Les dades personals es conservaran mentre existeixi una relació amb l’usuari o fins que aquest sol·liciti la seva supressió. </p><h2 data-v-bb355442>1. Informació que recopilem</h2><ul data-v-bb355442><li data-v-bb355442>Correu electrònic quan l’usuari es subscriu a la newsletter.</li><li data-v-bb355442>Nom, cognoms i correu electrònic quan l&#39;usuari omple el formulari de contacte.</li><li data-v-bb355442>Dades de navegació (cookies, adreça IP, preferències).</li><li data-v-bb355442> Informació enviada voluntàriament mitjançant formularis de contacte. </li></ul><h2 data-v-bb355442>2. Ús de la informació</h2><ul data-v-bb355442><li data-v-bb355442>Enviar comunicacions relacionades amb la newsletter.</li><li data-v-bb355442>Millorar el funcionament i contingut del lloc web.</li><li data-v-bb355442>Respondre a consultes o sol·licituds dels usuaris.</li></ul><h2 data-v-bb355442>3. Protecció de dades</h2><p data-v-bb355442> S’apliquen mesures tècniques i organitzatives adequades per garantir la seguretat de les dades personals i evitar accessos no autoritzats, pèrdua o divulgació. </p><h2 data-v-bb355442>4. Comunicació de dades a tercers</h2><p data-v-bb355442> Les dades personals no es comunicaran a tercers, excepte quan sigui necessari per obligació legal o amb el consentiment previ de l’usuari. </p><h2 data-v-bb355442>5. Drets de l’usuari</h2><ul data-v-bb355442><li data-v-bb355442>Accedir a les seves dades personals.</li><li data-v-bb355442>Sol·licitar la rectificació o supressió de les dades.</li><li data-v-bb355442>Oposar-se o limitar el tractament de les dades.</li><li data-v-bb355442>Donar-se de baixa de la newsletter en qualsevol moment.</li></ul><h2 data-v-bb355442>6. Canvis en la política de privacitat</h2><p data-v-bb355442> Aquesta política pot actualitzar-se periòdicament. Es recomana revisar-la de manera regular per estar informat de possibles canvis. </p></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/privacy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const privacy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bb355442"]]);

export { privacy as default };
//# sourceMappingURL=privacy-guXfMIaO.mjs.map
