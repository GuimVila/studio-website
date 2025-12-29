import { _ as __nuxt_component_0 } from './nuxt-link-C5eMeJEz.mjs';
import { mergeProps, withCtx, createTextVNode, ref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, u as useHead } from './server.mjs';
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

const _sfc_main$1 = {
  __name: "PricingCard",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    price: { type: [String, Number], required: true },
    unit: { type: String, default: "" },
    features: { type: Array, default: () => [] },
    link: { type: String, default: "/contact" },
    button: { type: String, default: "Contactar" },
    badge: { type: String, default: "" },
    featured: { type: Boolean, default: false }
  },
  setup(__props) {
    const cardRef = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "cardRef",
        ref: cardRef,
        class: ["pricing-card", { featured: __props.featured }]
      }, _attrs))} data-v-f555aa6d>`);
      if (__props.badge) {
        _push(`<div class="badge-popular" data-v-f555aa6d>${ssrInterpolate(__props.badge)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h3 data-v-f555aa6d>${ssrInterpolate(__props.title)}</h3><div class="price" data-v-f555aa6d>${ssrInterpolate(__props.price)}`);
      if (__props.unit) {
        _push(`<span class="price-unit" data-v-f555aa6d>${ssrInterpolate(__props.unit)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><ul class="pricing-features" data-v-f555aa6d><!--[-->`);
      ssrRenderList(__props.features, (feature, i) => {
        _push(`<li data-v-f555aa6d>${ssrInterpolate(feature)}</li>`);
      });
      _push(`<!--]--></ul>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.link,
        class: ["btn btn-margin-top", __props.featured ? "btn-primary" : "btn-secondary"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.button)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.button), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PricingCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const PricingCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-f555aa6d"]]);
const _sfc_main = {
  __name: "services",
  __ssrInlineRender: true,
  setup(__props) {
    const mixingPackages = [
      {
        title: "Mescla bàsica",
        price: "75€",
        unit: "/cançó",
        features: [
          "Mescla professional ITB",
          "Fins a 40 pistes",
          "Automatitzacions bàsiques",
          "2 revisions incloses",
          "Lliurament en 4–6 dies"
        ],
        link: "/contact",
        button: "Contractar"
      },
      {
        title: "Mescla híbrida",
        price: "95€",
        unit: "/cançó",
        features: [
          "Mescla híbrida analògica (Silver Bullet + SSL)",
          "Fins a 60 pistes",
          "Automatitzacions completes",
          "3 revisions incloses",
          "Mix final + instrumental",
          "Lliurament en 5–7 dies"
        ],
        link: "/contact",
        button: "Contractar",
        featured: true,
        badge: "SERVEI PRINCIPAL"
      },
      {
        title: "Mescla avançada",
        price: "120€",
        unit: "/cançó",
        features: [
          "Mescla híbrida analògica (Silver Bullet + SSL)",
          "Sessions complexes (+60 pistes)",
          "Automatitzacions completes",
          "3 revisions incloses",
          "Lliurament en 7–10 dies"
        ],
        link: "/contact",
        button: "Contractar"
      }
    ];
    const trackingPackages = [
      {
        title: "Gravació d’instruments",
        price: "40€",
        unit: "/hora",
        features: [
          "Instruments elèctrics, acústics i overdubs",
          "Suhr Reactive Load",
          "Captura DI + amp",
          "Enginyer inclòs",
          "Edició inclosa"
        ],
        link: "/contact",
        button: "Reservar"
      },
      {
        title: "Dia complet d’estudi",
        price: "300€",
        unit: "/8h",
        features: [
          "8 hores de gravació",
          "Tot l’equip disponible",
          "Enginyer inclòs",
          "Edició inclosa",
          "Estalvi respecte hores soltes"
        ],
        link: "/contact",
        button: "Reservar",
        featured: true,
        badge: "RECOMANAT"
      },
      {
        title: "Gravació vocal",
        price: "50€",
        unit: "/hora",
        features: [
          "UAD Sphere DLX (microfonia modelada)",
          "Sala completament tractada",
          "Direcció vocal i coaching",
          "Enginyer inclòs",
          "Edició inclosa"
        ],
        link: "/contact",
        button: "Reservar"
      }
    ];
    const productionPackages = [
      {
        title: "Sound Design",
        price: "Des de 100€",
        unit: "/patch",
        features: [
          "Disseny sonor per sintetitzadors i samplers",
          "Creació de kits originals i textures úniques",
          "Optimitzat per produccions i live",
          "Consultoria sobre implementació en DAW"
        ],
        link: "/contact",
        button: "Demanar pressupost"
      },
      {
        title: "Producció / Coproducció completa",
        price: "A mida",
        unit: "",
        features: [
          "Preproducció i arranjaments",
          "Sound design i selecció sonora",
          "Producció musical completa",
          "Direcció artística",
          "Mescla inclosa"
        ],
        link: "/contact",
        button: "Demanar pressupost",
        featured: true,
        badge: "SERVEI PRINCIPAL"
      },
      {
        title: "Beat Making",
        price: "Des de 150€",
        unit: "/cançó",
        features: [
          "Producció original adaptada a l’artista",
          "Llicència inclosa",
          "Revisions segons acord",
          "Compatible amb vocals o instrumentals existents"
        ],
        link: "/contact",
        button: "Demanar pressupost"
      }
    ];
    const editingPackages = [
      {
        title: "Preparació de sessions",
        price: "30€",
        unit: "/projecte",
        features: [
          "Organització de sessions a Pro Tools",
          "Neteja de pistes i silencis",
          "Ruteig i etiquetatge correcte",
          "Preparació òptima per mescla o enviament"
        ],
        link: "/contact",
        button: "Contractar"
      },
      {
        title: "Edició completa pre-mescla",
        price: "70€",
        unit: "/cançó",
        features: [
          "Comping vocal i instrumental",
          "Correcció de timing musical",
          "Afinació vocal transparent",
          "Edició musical amb criteri artístic",
          "Session ready per mescla professional"
        ],
        link: "/contact",
        button: "Contractar",
        featured: true,
        badge: "MÉS DEMANAT"
      },
      {
        title: "Edició i afinació vocal",
        price: "40€",
        unit: "/cançó",
        features: [
          "Comping vocal",
          "Correcció de timing",
          "Afinació natural i transparent",
          "Respecte total pel caràcter de la veu"
        ],
        link: "/contact",
        button: "Contractar"
      }
    ];
    const proServicePackages = [
      {
        title: "Reamp de guitarres i baixos",
        price: "35€",
        unit: "/pista",
        features: [
          "Reamp amb amplificació real",
          "Captura DI + amp",
          "Fender Blues Jr III / Suhr Reactive Load",
          "Integració directa a la teva sessió"
        ],
        link: "/contact",
        button: "Contractar"
      },
      {
        title: "Mix bus processing extern",
        price: "40€",
        unit: "/cançó",
        features: [
          "Processament analògic del mix bus",
          "Silver Bullet MK2 + SSL Bus+",
          "Sense alterar balances",
          "Ideal per mixers ITB"
        ],
        link: "/contact",
        button: "Contractar",
        featured: true,
        badge: "MÉS SOL·LICITAT"
      },
      {
        title: "Processament analògic de pistes",
        price: "30€",
        unit: "/stem o pista",
        features: [
          "Color analògic amb Silver Bullet",
          "Tape79 Mojo Module",
          "Ideal per drums, bass, synths o vocals",
          "Entrega alineada i fase-correcta"
        ],
        link: "/contact",
        button: "Contractar"
      },
      {
        title: "Assessorament tècnic",
        price: "50€",
        unit: "/hora",
        features: [
          "Flux de treball professional",
          "Equipament i routing",
          "Plugins i gestió de sessions",
          "Optimització d’estudi i acústica"
        ],
        link: "/contact",
        button: "Reservar"
      },
      {
        title: "Mix coaching",
        price: "40€",
        unit: "/hora",
        features: [
          "Feedback tècnic i artístic",
          "Revisió de mescles reals",
          "Orientat a productors i mixers",
          "Sessió 1 a 1"
        ],
        link: "/contact",
        button: "Reservar"
      },
      {
        title: "Listening session professional",
        price: "30€",
        unit: "/hora",
        features: [
          "Escolta crítica en sala tractada",
          "Adam Audio A7V calibrats (Sonarworks)",
          "Feedback honest i constructiu",
          "Ideal abans de publicar o enviar a mescla"
        ],
        link: "/contact",
        button: "Reservar"
      }
    ];
    useHead({
      title: "Serveis | Guillem Vila · Productor musical, artista i enginyer de so",
      meta: [
        {
          name: "description",
          content: "Ofereixo serveis professionals de producció musical, gravació, edició, mescla i d'altres. Treballo per fer realitat projectes musicals amb qualitat i creativitat."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-wrapper" }, _attrs))} data-v-dbf4c1c9><section class="section" data-v-dbf4c1c9><h1 class="section-title" data-v-dbf4c1c9>Serveis i preus</h1><p class="section-subtitle" data-v-dbf4c1c9> Estudi professional de mescla, producció i gravació. Treball híbrid, sala tractada i flux de treball d’alt nivell. </p><h2 class="section-title section-title-margin" data-v-dbf4c1c9>Mescla</h2><div class="pricing-grid" data-v-dbf4c1c9><!--[-->`);
      ssrRenderList(mixingPackages, (pack, i) => {
        _push(ssrRenderComponent(PricingCard, mergeProps({
          key: "mix-" + i
        }, { ref_for: true }, pack), null, _parent));
      });
      _push(`<!--]--></div><h2 class="section-title section-title-margin" data-v-dbf4c1c9>Gravació</h2><div class="pricing-grid" data-v-dbf4c1c9><!--[-->`);
      ssrRenderList(trackingPackages, (pack, i) => {
        _push(ssrRenderComponent(PricingCard, mergeProps({
          key: "track-" + i
        }, { ref_for: true }, pack), null, _parent));
      });
      _push(`<!--]--></div><h2 class="section-title section-title-margin" data-v-dbf4c1c9>Producció musical</h2><div class="pricing-grid" data-v-dbf4c1c9><!--[-->`);
      ssrRenderList(productionPackages, (pack, i) => {
        _push(ssrRenderComponent(PricingCard, mergeProps({
          key: "prod-" + i
        }, { ref_for: true }, pack), null, _parent));
      });
      _push(`<!--]--></div><h2 class="section-title section-title-margin" data-v-dbf4c1c9>Edició</h2><div class="pricing-grid" data-v-dbf4c1c9><!--[-->`);
      ssrRenderList(editingPackages, (pack, i) => {
        _push(ssrRenderComponent(PricingCard, mergeProps({
          key: "edit-" + i
        }, { ref_for: true }, pack), null, _parent));
      });
      _push(`<!--]--></div><h2 class="section-title section-title-margin" data-v-dbf4c1c9>Altres serveis</h2><div class="pricing-grid" data-v-dbf4c1c9><!--[-->`);
      ssrRenderList(proServicePackages, (pack, i) => {
        _push(ssrRenderComponent(PricingCard, mergeProps({
          key: "pro-" + i
        }, { ref_for: true }, pack), null, _parent));
      });
      _push(`<!--]--></div><div class="volume-discounts" data-v-dbf4c1c9><h3 data-v-dbf4c1c9>Descomptes per volum</h3><p data-v-dbf4c1c9> ✓ 10% de descompte a partir de 5 cançons<br data-v-dbf4c1c9> ✓ 15% de descompte a partir de 10 cançons (EP / Àlbum)<br data-v-dbf4c1c9> ✓ Pressupost personalitzat per projectes grans </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "btn btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Demanar pressupost `);
          } else {
            return [
              createTextVNode(" Demanar pressupost ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/services.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const services = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dbf4c1c9"]]);

export { services as default };
//# sourceMappingURL=services-DfboEnOr.mjs.map
