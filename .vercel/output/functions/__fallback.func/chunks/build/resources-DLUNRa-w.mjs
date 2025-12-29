import { mergeProps, unref, ref, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "TutorialCard",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "tutorial-card" }, _attrs))}><div class="tutorial-thumbnail">${ssrInterpolate(__props.icon)}</div><div class="tutorial-content"><span class="tutorial-category">${ssrInterpolate(__props.category)}</span><h3 class="tutorial-title">${ssrInterpolate(__props.title)}</h3><p class="tutorial-description">${ssrInterpolate(__props.description)}</p><div class="tutorial-meta"><span>⏱️ ${ssrInterpolate(__props.duration)}</span><span>📅 ${ssrInterpolate(__props.date)}</span></div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TutorialCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
function useTutorials() {
  const selectedCategory = ref("Tots");
  const categories = [
    "Tots",
    "Producció",
    "Gravació",
    "Edició",
    "Mescla",
    "Disseny de So",
    "Harmonia",
    "Llenguatge Musical"
  ];
  const tutorials = ref([
    {
      id: 1,
      title: "Introducció a la Mescla: Conceptes Bàsics",
      description: "Aprèn els fonaments de la mescla: guany, equalització, compressió i panoràmica.",
      category: "Mescla",
      icon: "🎚️",
      duration: "15 min",
      date: "15 Nov 2024"
    },
    {
      id: 2,
      title: "Com Gravar Guitarres Elèctriques",
      description: "Tècniques de microfonació, col·locació i processament per aconseguir el millor so.",
      category: "Guitarra",
      icon: "🎸",
      duration: "22 min",
      date: "10 Nov 2024"
    },
    {
      id: 3,
      title: "Mastering per Streaming: Spotify i Apple Music",
      description: "Optimitza les teves cançons per les plataformes de streaming amb els nivells correctes.",
      category: "Mastering",
      icon: "💎",
      duration: "18 min",
      date: "5 Nov 2024"
    },
    {
      id: 4,
      title: "Producció de Baix: Sons Moderns",
      description: "Com aconseguir sons de baix potents i moderns per hip-hop, trap i electrònica.",
      category: "Baix",
      icon: "🎵",
      duration: "20 min",
      date: "1 Nov 2024"
    },
    {
      id: 5,
      title: "Teoria Musical per Productors",
      description: "Escales, acords i progressions harmòniques explicades de forma pràctica.",
      category: "Teoria",
      icon: "📚",
      duration: "30 min",
      date: "28 Oct 2024"
    },
    {
      id: 6,
      title: "Compressió Paral·lela en Bateries",
      description: "Tècnica avançada per aconseguir bateries amb punch i caràcter.",
      category: "Mescla",
      icon: "🥁",
      duration: "12 min",
      date: "25 Oct 2024"
    },
    {
      id: 7,
      title: "Arranjaments: Del Demo a la Cançó Final",
      description: "Aprèn a estructurar i arreglar les teves idees per crear cançons completes.",
      category: "Producció",
      icon: "🎹",
      duration: "25 min",
      date: "20 Oct 2024"
    },
    {
      id: 8,
      title: "Tècniques de Fingerstyle per Baix",
      description: "Millora la teva tècnica de dits i aconsegueix un so més dinàmic.",
      category: "Baix",
      icon: "🎸",
      duration: "18 min",
      date: "15 Oct 2024"
    }
  ]);
  const filteredTutorials = computed(() => {
    if (selectedCategory.value === "Tots") return tutorials.value;
    return tutorials.value.filter(
      (t) => t.category === selectedCategory.value
    );
  });
  return {
    selectedCategory,
    categories,
    tutorials,
    filteredTutorials
  };
}
const _sfc_main = {
  __name: "resources",
  __ssrInlineRender: true,
  setup(__props) {
    const { selectedCategory, categories, filteredTutorials } = useTutorials();
    useHead({
      title: "Recursos | Guillem Vila · Producció musical i educació en música",
      meta: [
        {
          name: "description",
          content: "Comparteixo recursos educatius en producció, mescla, harmonia, teoria musical, gravació i d'altres, per ajudar artistes i productors a millorar les seves habilitats i projectes musicals."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-8c9e2d9a><section class="section" data-v-8c9e2d9a><h1 class="section-title" data-v-8c9e2d9a>Recursos</h1><p class="section-intro" data-v-8c9e2d9a> Aprèn producció, mescla, disseny de so i més amb els recursos que trobaràs a continuació. </p><div class="categories" data-v-8c9e2d9a><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        _push(`<button class="${ssrRenderClass([
          "btn",
          "category-btn",
          unref(selectedCategory) === cat ? "btn-primary" : "btn-secondary"
        ])}" data-v-8c9e2d9a>${ssrInterpolate(cat)}</button>`);
      });
      _push(`<!--]--></div><div class="tutorials-grid" data-v-8c9e2d9a><!--[-->`);
      ssrRenderList(unref(filteredTutorials), (tutorial) => {
        _push(ssrRenderComponent(_sfc_main$1, mergeProps({
          key: tutorial.id
        }, { ref_for: true }, tutorial), null, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref(filteredTutorials).length === 0) {
        _push(`<div class="empty-state" data-v-8c9e2d9a><p data-v-8c9e2d9a>No hi ha tutorials disponibles en aquesta category.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/resources.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const resources = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8c9e2d9a"]]);

export { resources as default };
//# sourceMappingURL=resources-DLUNRa-w.mjs.map
