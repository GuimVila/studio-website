import { unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useNewsletter } from './useNewsletter-Br3VUKBE.mjs';
import { _ as _export_sfc } from './server.mjs';
import './useSupabaseClient-DykwVqLQ.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      email,
      honeypot,
      isSubmitting,
      message: submitMessage,
      success: submitSuccess
    } = useNewsletter();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-6cc7949d><div style="${ssrRenderStyle({ "padding-top": "100px" })}" data-v-6cc7949d><section class="section" data-v-6cc7949d><h1 class="section-title" data-v-6cc7949d>Subscriu-te</h1><p style="${ssrRenderStyle({ "text-align": "center", "font-size": "1.2rem", "color": "var(--text-secondary)", "margin-bottom": "2rem" })}" data-v-6cc7949d> Subscriu-te al meu butlletí per rebre les últimes novetats, tutorials i ofertes especials directament al teu correu electrònic. </p></section><form class="subscribe-form" data-v-6cc7949d><input${ssrRenderAttr("value", unref(email))} type="email" required placeholder="Introdueix el teu correu electrònic" data-v-6cc7949d><input${ssrRenderAttr("value", unref(honeypot))} type="text" tabindex="-1" autocomplete="off" class="hp-field" data-v-6cc7949d><button${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} data-v-6cc7949d>${ssrInterpolate(unref(isSubmitting) ? "Enviant..." : "Subscriu-te")}</button></form>`);
      if (unref(submitMessage)) {
        _push(`<p style="${ssrRenderStyle({
          textAlign: "center",
          marginTop: "1rem",
          color: unref(submitSuccess) ? "#4ade80" : "#ef4444"
        })}" data-v-6cc7949d>${ssrInterpolate(unref(submitMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/subscribe/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6cc7949d"]]);

export { index as default };
//# sourceMappingURL=index-CjPYCWKD.mjs.map
