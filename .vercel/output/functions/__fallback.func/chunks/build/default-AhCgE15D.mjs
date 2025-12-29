import { _ as _export_sfc, k as __nuxt_component_0 } from './server.mjs';
import { mergeProps, defineComponent, ref, unref, withCtx, createTextVNode, watch, createVNode, resolveDynamicComponent, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { _ as __nuxt_component_0$1 } from './nuxt-link-C5eMeJEz.mjs';
import { u as useNewsletter } from './useNewsletter-Br3VUKBE.mjs';
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
import './useSupabaseClient-DykwVqLQ.mjs';

const _imports_0 = "" + __buildAssetsURL("logo-web_blanc.h3A5R7L7.png");
const _sfc_main$b = {
  __name: "ToggleSwitch",
  __ssrInlineRender: true,
  emits: ["toggle"],
  setup(__props, { emit: __emit }) {
    const isOn = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: ["toggle-container", isOn.value ? "on" : "off"],
        "aria-label": isOn.value ? "Dark mode enabled" : "Light mode enabled"
      }, _attrs))} data-v-87b3fed4><div class="toggle-handle" data-v-87b3fed4></div></button>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ToggleSwitch.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const ToggleSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-87b3fed4"]]);
const _sfc_main$a = {
  __name: "NavigationMenu",
  __ssrInlineRender: true,
  setup(__props) {
    const menuOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "header" }, _attrs))} data-v-65bebab6><nav class="nav-container" data-v-65bebab6><div class="logo" data-v-65bebab6><img${ssrRenderAttr("src", _imports_0)} alt="Logo" class="logo-image" data-v-65bebab6><p data-v-65bebab6>Guillem Vila</p></div><button class="mobile-toggle" data-v-65bebab6>☰</button><ul class="${ssrRenderClass([{ active: unref(menuOpen) }, "nav-menu"])}" data-v-65bebab6><li data-v-65bebab6>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Inici`);
          } else {
            return [
              createTextVNode("Inici")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-65bebab6>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Galeria`);
          } else {
            return [
              createTextVNode("Galeria")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-65bebab6>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/services",
        class: "nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Serveis`);
          } else {
            return [
              createTextVNode("Serveis")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-65bebab6>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        class: "nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Sobre mi`);
          } else {
            return [
              createTextVNode("Sobre mi")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-65bebab6>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/portfolio",
        class: "nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Portfoli`);
          } else {
            return [
              createTextVNode("Portfoli")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-65bebab6>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/music",
        class: "nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Música`);
          } else {
            return [
              createTextVNode("Música")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-65bebab6>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/resources",
        class: "nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Recursos`);
          } else {
            return [
              createTextVNode("Recursos")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-65bebab6>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/subscribe",
        class: "nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Subscriu-te`);
          } else {
            return [
              createTextVNode("Subscriu-te")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-65bebab6>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Contacte`);
          } else {
            return [
              createTextVNode("Contacte")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul><div class="user-actions" data-v-65bebab6>`);
      _push(ssrRenderComponent(ToggleSwitch, null, null, _parent));
      _push(`</div></nav></header>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NavigationMenu.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const NavigationMenu = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-65bebab6"]]);
const _sfc_main$9 = {};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, _attrs))}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`);
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/InstagramIcon.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const InstagramIcon = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$6]]), { __name: "IconsInstagramIcon" });
const _sfc_main$8 = {};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, _attrs))}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/YoutubeIcon.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const YoutubeIcon = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$5]]), { __name: "IconsYoutubeIcon" });
const _sfc_main$7 = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, _attrs))}><path d="M9 2c0 0 3 0 3 3v11.5a4.5 4.5 0 1 1-4.5-4.5V6H6C6 6 6 12 12 12c0 0 0 3 3 3V9.5a6 6 0 1 0-6-6z"></path></svg>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/TikTokIcon.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const TikTokIcon = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$4]]), { __name: "IconsTikTokIcon" });
const _sfc_main$6 = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, _attrs))}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/FacebookIcon.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const FacebookIcon = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$3]]), { __name: "IconsFacebookIcon" });
const _sfc_main$5 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, _attrs))}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/LocationIcon.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const LocationIcon = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$2]]), { __name: "IconsLocationIcon" });
const _sfc_main$4 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, _attrs))}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/PhoneIcon.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const PhoneIcon = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$1]]), { __name: "IconsPhoneIcon" });
const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, _attrs))}><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/EmailIcon.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const EmailIcon = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]), { __name: "IconsEmailIcon" });
const _sfc_main$2 = {
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const { email, honeypot, isSubmitting, message, success } = useNewsletter();
    const socialLinks = [
      {
        name: "Instagram",
        href: "https://instagram.com/guim.vila",
        icon: InstagramIcon
      },
      {
        name: "YouTube",
        href: "https://youtube.com/elteuperfil",
        icon: YoutubeIcon
      },
      {
        name: "TikTok",
        href: "https://www.tiktok.com/@elteuperfil",
        icon: TikTokIcon
      },
      {
        name: "Facebook",
        href: "https://facebook.com/elteuperfil",
        icon: FacebookIcon
      }
    ];
    const services = ["Producció Musical", "Edició", "Gravació", "Mescla", "Disseny de So"];
    watch(message, (val) => {
      if (!val) return;
      setTimeout(() => {
        message.value = "";
      }, 4e3);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-925b2341><div class="footer-container" data-v-925b2341><div class="footer-grid" data-v-925b2341><div class="footer-section" data-v-925b2341><div class="brand" data-v-925b2341><img${ssrRenderAttr("src", _imports_0)} alt="Logo de Guillem Vila - Estudi de so i producció musical de Riells i Viabrea, Girona" class="logo-image" data-v-925b2341><h3 class="brand-name" data-v-925b2341>Guillem Vila</h3></div><p class="brand-description" data-v-925b2341> Estudi de so professional i producció musical. </p><div class="social-links" data-v-925b2341><!--[-->`);
      ssrRenderList(socialLinks, (social) => {
        _push(`<a${ssrRenderAttr("href", social.href)} target="_blank" rel="noopener noreferrer" class="social-link"${ssrRenderAttr("aria-label", social.name)} data-v-925b2341>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(social.icon), null, null), _parent);
        _push(`</a>`);
      });
      _push(`<!--]--></div></div><div class="footer-section" data-v-925b2341><h4 class="footer-title" data-v-925b2341>Serveis</h4><ul class="footer-links" data-v-925b2341><!--[-->`);
      ssrRenderList(services, (service) => {
        _push(`<li data-v-925b2341>${ssrInterpolate(service)}</li>`);
      });
      _push(`<!--]--></ul></div><div class="footer-section footer-contact-section" data-v-925b2341><h4 class="footer-title" data-v-925b2341>Contacte</h4><ul class="footer-contact" data-v-925b2341><li class="contact-item" data-v-925b2341>`);
      _push(ssrRenderComponent(unref(LocationIcon), { class: "contact-icon" }, null, _parent));
      _push(` Riells i Viabrea, El Baix Montseny </li><li class="contact-item" data-v-925b2341>`);
      _push(ssrRenderComponent(unref(PhoneIcon), { class: "contact-icon" }, null, _parent));
      _push(`<a href="tel:+34682463081" data-v-925b2341>+34 682 463 081</a></li><li class="contact-item" data-v-925b2341>`);
      _push(ssrRenderComponent(unref(EmailIcon), { class: "contact-icon" }, null, _parent));
      _push(`<a href="mailto:info@guillemvila.com" data-v-925b2341>info@guillemvila.com</a></li></ul></div><div class="footer-section" data-v-925b2341><h4 class="footer-title" data-v-925b2341>Newsletter</h4><p class="newsletter-text" data-v-925b2341> Subscriu-te per rebre les últimes novetats, tutorials i ofertes especials. </p><form class="newsletter-form" data-v-925b2341><input${ssrRenderAttr("value", unref(email))} type="email" placeholder="Correu electrònic" required class="newsletter-input" data-v-925b2341><input${ssrRenderAttr("value", unref(honeypot))} type="text" tabindex="-1" autocomplete="off" class="hp-field" data-v-925b2341><button type="submit" class="newsletter-button"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} data-v-925b2341>${ssrInterpolate(unref(isSubmitting) ? "Enviant..." : "Subscriu-te")}</button>`);
      if (unref(message)) {
        _push(`<p style="${ssrRenderStyle({
          marginTop: "0.75rem",
          fontSize: "0.9rem",
          color: unref(success) ? "#4ade80" : "#ef4444",
          textAlign: "center"
        })}" data-v-925b2341>${ssrInterpolate(unref(message))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></div><div class="footer-bottom" data-v-925b2341><p class="copyright" data-v-925b2341> © 2025 Guillem Vila. Tots els drets reservats. </p><div class="footer-legal" data-v-925b2341><a href="privacy" data-v-925b2341>Política de Privacitat</a><a href="cookies" data-v-925b2341>Política de Cookies</a><a href="terms" data-v-925b2341>Termes i Condicions</a></div></div><div class="footer-glow footer-glow-left" data-v-925b2341></div><div class="footer-glow footer-glow-right" data-v-925b2341></div></div></footer>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppFooter = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-925b2341"]]);
const STORAGE_KEY = "cookie_consent";
const consent = ref("unset");
function useCookieConsent() {
  const accept = () => {
    consent.value = "accepted";
    localStorage.setItem(STORAGE_KEY, "accepted");
  };
  const reject = () => {
    consent.value = "rejected";
    localStorage.setItem(STORAGE_KEY, "rejected");
  };
  const isUnset = computed(() => consent.value === "unset");
  const isAccepted = computed(() => consent.value === "accepted");
  return {
    consent,
    isUnset,
    isAccepted,
    accept,
    reject
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AnalyticsLoader",
  __ssrInlineRender: true,
  setup(__props) {
    const { isAccepted } = useCookieConsent();
    const loadPlausible = () => {
      if ((void 0).getElementById("plausible-script")) return;
      const script = (void 0).createElement("script");
      script.id = "plausible-script";
      script.defer = true;
      script.dataset.domain = "guillemvila.com";
      script.src = "https://plausible.io/js/script.js";
      script.crossOrigin = "anonymous";
      (void 0).head.appendChild(script);
    };
    watch(
      isAccepted,
      (accepted) => {
        if (accepted) {
          loadPlausible();
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AnalyticsLoader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AnalyticsLoader = Object.assign(_sfc_main$1, { __name: "AnalyticsLoader" });
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout" }, _attrs))}>`);
      _push(ssrRenderComponent(NavigationMenu, null, null, _parent));
      _push(`<main class="main">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(AnalyticsLoader, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-AhCgE15D.mjs.map
