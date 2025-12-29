import { ssrRenderAttrs, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    const aboutParagraphs = [
      `Sóc en Guillem Vila, músic, productor i enginyer de so nascut a Arenys de Mar. Durant els meus primers anys professionals em vaig dedicar a la formació constant i al treball de camp en estudis i projectes locals, consolidant coneixements en producció, guitarra i enginyeria de so que més endavant em portarien a formar-me a Berklee College of Music.`,
      `Als trenta anys vaig cursar el Bachelor en Professional Music a Berklee College of Music (Boston), amb mencions en Music Production & Engineering i Performance, complementat amb el minor en Music Technology & Innovation a València. A Berklee vaig tenir l’oportunitat d’aprendre de professors com Sean McLaughlin, Lyle Brewer, Colin Sapp, Dave Fiuczynski, Scott DeOgburn i Steve Rochinsky, experiència que em va donar eines per combinar rigor tècnic i expressió artística de manera efectiva.`,
      `Després d’una breu etapa a Igloo Music a Califòrnia, vaig tornar a Catalunya, on compagino la producció musical, la composició i l’enginyeria de so amb la docència. He estat professor a Microfusa i, des de fa cinc anys, treballo com a docent d’ESO, mentre continuo estudiant i perfeccionant tècniques de guitarra, baix, veu, mescla, mastering, producció i disseny de so.`,
      `Com a artista, busco crear un llenguatge propi que combina influències diverses, com Jacob Collier, Billie Eilish, Bob Dylan, John Mayer, Bon Iver i la cançó catalana. M’interessa una mirada minimalista i una música on tècnica i emoció conviuen, amb l’honestedat artística i l’expressió personal com a valors centrals. Aquesta web és l’espai on mostro totes aquestes facetes: músic, productor, enginyer i docent, amb la música com a eix central del meu treball i la meva passió.`
    ];
    useHead({
      title: "Sobre mi | Guillem Vila · Artista, productor musical i enginyer de so",
      meta: [
        {
          name: "description",
          content: "Em dic Guillem Vila i sóc artista, productor musical i enginyer de so. Tinc experiència en gravació, mescla i producció per a artistes i projectes professionals."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-09b10591><div class="content-wrapper" data-v-09b10591><section class="about-header" data-v-09b10591><h1 class="section-title" data-v-09b10591>Sobre mi</h1><p class="section-subtitle" data-v-09b10591> Una mica sobre mi i la meva trajectòria en el món de la música. </p></section><section class="about-paragraph" data-v-09b10591><!--[-->`);
      ssrRenderList(aboutParagraphs, (text, index) => {
        _push(`<p class="section-subtitle separated-paragraph" data-v-09b10591>${ssrInterpolate(text)}</p>`);
      });
      _push(`<!--]--></section></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-09b10591"]]);

export { about as default };
//# sourceMappingURL=about-C1ecLMpl.mjs.map
