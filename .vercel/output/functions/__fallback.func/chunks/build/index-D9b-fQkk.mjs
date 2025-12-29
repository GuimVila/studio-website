import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-C5eMeJEz.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { u as useHead, _ as _export_sfc } from './server.mjs';
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

const _sfc_main$4 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "hero" }, _attrs))}><div class="hero-content"><h1>Dona vida a la teva música</h1><p> Producció, mescla, mastering i gravació professional. El teu so, portat a la perfecció. </p><div class="cta-buttons">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/contact",
    class: "btn btn-primary"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Comença ara`);
      } else {
        return [
          createTextVNode("Comença ara")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/services",
    class: "btn btn-secondary"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Els nostres serveis`);
      } else {
        return [
          createTextVNode("Els nostres serveis")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></section>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHero.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const AppHero = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$1]]), { __name: "AppHero" });
const _sfc_main$3 = {
  __name: "ServiceCard",
  __ssrInlineRender: true,
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "service-card" }, _attrs))}><div class="service-icon">${ssrInterpolate(__props.icon)}</div><h3>${ssrInterpolate(__props.title)}</h3><p>${ssrInterpolate(__props.description)}</p></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ServiceCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "WhyChooseMe",
  __ssrInlineRender: true,
  setup(__props) {
    const services = [
      {
        icon: "🎛️",
        title: "Producció Professional",
        description: "Des de la preproducció fins al producte final, t'acompanyo en cada pas del procés creatiu."
      },
      {
        icon: "🎚️",
        title: "Mescla i Mastering",
        description: "Equipament 'boutique' d'última generació i espai acustitzat per aconseguir el millor so possible."
      },
      {
        icon: "🎸",
        title: "Gravació",
        description: "Estudi complet dissenyat per a gravacions de veu i instruments per pistes."
      },
      {
        icon: "🎓",
        title: "Recursos",
        description: "Recursos per a músics i productors que volen millorar les seves habilitats."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))}><h2 class="section-title">Per què treballar amb mi?</h2><div class="services-grid"><!--[-->`);
      ssrRenderList(services, (item, index) => {
        _push(ssrRenderComponent(_sfc_main$3, {
          key: index,
          icon: item.icon,
          title: item.title,
          description: item.description
        }, null, _parent));
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/WhyChooseMe.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-0ad487eb><div class="container" data-v-0ad487eb><h2 class="section-title" data-v-0ad487eb>Comença el teu projecte avui</h2><p class="section-subtitle" data-v-0ad487eb> Més de 100 projectes realitzats amb artistes d&#39;arreu </p><div class="button-wrapper" data-v-0ad487eb>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/contact",
    class: "btn btn-primary"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Contacta&#39;ns`);
      } else {
        return [
          createTextVNode("Contacta'ns")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></section>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StartToday.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const StartToday = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-0ad487eb"]]), { __name: "StartToday" });
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Guillem Vila · Artista, productor musical i enginyer de so",
      meta: [
        {
          name: "description",
          content: "Em dic Guillem Vila i sóc artista, productor musical i enginyer de so. Ofereix serveis professionals de gravació, mescla, producció musical i col·laboracions creatives per projectes artístics i musicals."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(AppHero, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(ssrRenderComponent(StartToday, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D9b-fQkk.mjs.map
