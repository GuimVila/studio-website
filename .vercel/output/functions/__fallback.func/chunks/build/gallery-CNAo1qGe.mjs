import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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

const _sfc_main$2 = {
  __name: "GalleryItem",
  __ssrInlineRender: true,
  props: {
    image: { type: Object, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "gallery-item" }, _attrs))} data-v-45ec05ec><img${ssrRenderAttr("src", __props.image.src)}${ssrRenderAttr("alt", __props.image.alt)} data-v-45ec05ec><div class="overlay" data-v-45ec05ec><span data-v-45ec05ec>${ssrInterpolate(__props.image.alt)}</span></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GalleryItem.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const GalleryItem = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-45ec05ec"]]);
const _sfc_main$1 = {
  __name: "GalleryGrid",
  __ssrInlineRender: true,
  props: {
    images: { type: Array, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "gallery-grid" }, _attrs))} data-v-113dccff><!--[-->`);
      ssrRenderList(__props.images, (img, i) => {
        _push(ssrRenderComponent(GalleryItem, {
          key: i,
          image: img
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GalleryGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const GalleryGrid = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-113dccff"]]);
const _sfc_main = {
  __name: "gallery",
  __ssrInlineRender: true,
  setup(__props) {
    const images = [
      { src: "/assets/images/studio-1.jpg", alt: "Sala principal de control" },
      { src: "/assets/images/studio-2.jpg", alt: "Rack analògic" },
      { src: "/assets/images/studio-3.jpg", alt: "Sessió de gravació" },
      { src: "/assets/images/studio-4.jpg", alt: "Zona de producció" },
      { src: "/assets/images/studio-5.jpg", alt: "Detall equipament" },
      { src: "/assets/images/studio-6.jpg", alt: "Sessió de mescla" }
    ];
    useHead({
      title: "Galeria | Guillem Vila · Artista, productor musical i enginyer de so",
      meta: [
        {
          name: "description",
          content: "Galeria. Fotografies de l’estudi, sessions de gravació i concerts, mostrant el treball creatiu i professional en música i so."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-wrapper" }, _attrs))} data-v-a7f37612><section class="section" data-v-a7f37612><h1 class="section-title" data-v-a7f37612>Galeria</h1><p class="section-subtitle" data-v-a7f37612> Una mostra visual de l&#39;estudi, equipament i sessions de treball. </p>`);
      _push(ssrRenderComponent(GalleryGrid, { images }, null, _parent));
      _push(`</section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const gallery = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a7f37612"]]);

export { gallery as default };
//# sourceMappingURL=gallery-CNAo1qGe.mjs.map
