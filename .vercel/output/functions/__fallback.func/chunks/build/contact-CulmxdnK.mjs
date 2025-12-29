import { mergeProps, unref, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-DykwVqLQ.mjs';
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function useContactForm() {
  const supabase = useSupabaseClient();
  const formData = ref({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const honeypot = ref("");
  const isSubmitting = ref(false);
  const submitMessage = ref("");
  const submitSuccess = ref(false);
  function validateForm() {
    if (formData.value.name.trim().length < 2) {
      return "El nom ha de tenir com a mínim 2 caràcters.";
    }
    if (!emailRegex.test(formData.value.email.trim().toLowerCase())) {
      return "Introdueix una adreça de correu electrònic vàlida.";
    }
    if (!formData.value.service) {
      return "Selecciona un servei d’interès.";
    }
    if (formData.value.message.trim().length < 20) {
      return "El missatge ha de tenir com a mínim 20 caràcters.";
    }
    return null;
  }
  async function submitForm() {
    if (isSubmitting.value) return;
    if (honeypot.value) {
      submitSuccess.value = true;
      submitMessage.value = "Missatge enviat correctament! Em posaré en contacte amb tu aviat.";
      return;
    }
    const validationError = validateForm();
    if (validationError) {
      submitSuccess.value = false;
      submitMessage.value = validationError;
      return;
    }
    isSubmitting.value = true;
    submitMessage.value = "";
    try {
      const { error } = await supabase.from("contacts").insert({
        name: formData.value.name.trim(),
        email: formData.value.email.trim().toLowerCase(),
        phone: formData.value.phone?.trim() || null,
        service: formData.value.service,
        message: formData.value.message.trim()
      });
      if (error) throw error;
      submitSuccess.value = true;
      submitMessage.value = "Missatge enviat correctament! Em posaré en contacte amb tu el més aviat possible.";
      formData.value = {
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      };
      honeypot.value = "";
    } catch (err) {
      console.error(err);
      submitSuccess.value = false;
      submitMessage.value = "Hi ha hagut un error. Si us plau, intenta-ho de nou o contacta'm per email.";
    } finally {
      isSubmitting.value = false;
    }
  }
  return {
    formData,
    honeypot,
    isSubmitting,
    submitMessage,
    submitSuccess,
    submitForm
  };
}
const _sfc_main = {
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    const { formData, isSubmitting, submitMessage, submitSuccess } = useContactForm();
    useHead({
      title: "Contacte | Guillem Vila · Artista, productor musical i enginyer de so",
      meta: [
        {
          name: "description",
          content: "Contacta amb mi per col·laboracions, projectes musicals o serveis de gravació, mescla, edició i producció professional."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-padding" }, _attrs))} data-v-3ff17a36><section class="section" data-v-3ff17a36><h1 class="section-title" data-v-3ff17a36>Contacta amb nosaltres</h1><p class="section-intro" data-v-3ff17a36> Explica&#39;ns el teu projecte i t&#39;enviarem un pressupost personalitzat </p><div class="contact-container" data-v-3ff17a36><form class="contact-form" data-v-3ff17a36><div class="form-group" data-v-3ff17a36><label for="name" data-v-3ff17a36>Nom complet *</label><input id="name"${ssrRenderAttr("value", unref(formData).name)} type="text" required placeholder="El teu nom" data-v-3ff17a36></div><div class="form-group" data-v-3ff17a36><label for="email" data-v-3ff17a36>Email *</label><input id="email"${ssrRenderAttr("value", unref(formData).email)} type="email" required placeholder="email@exemple.com" data-v-3ff17a36></div><div class="form-group" data-v-3ff17a36><label for="phone" data-v-3ff17a36>Telèfon</label><input id="phone"${ssrRenderAttr("value", unref(formData).phone)} type="tel" placeholder="+34 600 000 000" data-v-3ff17a36></div><input${ssrRenderAttr("value", _ctx.honeypot)} type="text" tabindex="-1" autocomplete="off" class="hp-field" data-v-3ff17a36><div class="form-group" data-v-3ff17a36><label for="service" data-v-3ff17a36>Servei d&#39;interès *</label><select id="service" required data-v-3ff17a36><option value="" data-v-3ff17a36${ssrIncludeBooleanAttr(Array.isArray(unref(formData).service) ? ssrLooseContain(unref(formData).service, "") : ssrLooseEqual(unref(formData).service, "")) ? " selected" : ""}>Selecciona un servei</option><option value="mescla" data-v-3ff17a36${ssrIncludeBooleanAttr(Array.isArray(unref(formData).service) ? ssrLooseContain(unref(formData).service, "mescla") : ssrLooseEqual(unref(formData).service, "mescla")) ? " selected" : ""}>Mescla</option><option value="gravacio" data-v-3ff17a36${ssrIncludeBooleanAttr(Array.isArray(unref(formData).service) ? ssrLooseContain(unref(formData).service, "gravacio") : ssrLooseEqual(unref(formData).service, "gravacio")) ? " selected" : ""}>Gravació</option><option value="produccio" data-v-3ff17a36${ssrIncludeBooleanAttr(Array.isArray(unref(formData).service) ? ssrLooseContain(unref(formData).service, "produccio") : ssrLooseEqual(unref(formData).service, "produccio")) ? " selected" : ""}>Producció</option><option value="formacio" data-v-3ff17a36${ssrIncludeBooleanAttr(Array.isArray(unref(formData).service) ? ssrLooseContain(unref(formData).service, "formacio") : ssrLooseEqual(unref(formData).service, "formacio")) ? " selected" : ""}>Edició</option><option value="altre" data-v-3ff17a36${ssrIncludeBooleanAttr(Array.isArray(unref(formData).service) ? ssrLooseContain(unref(formData).service, "altre") : ssrLooseEqual(unref(formData).service, "altre")) ? " selected" : ""}>Altres</option></select></div><div class="form-group" data-v-3ff17a36><label for="message" data-v-3ff17a36>Missatge *</label><textarea id="message" required placeholder="Explica&#39;ns el teu projecte, quan vols començar, etc." data-v-3ff17a36>${ssrInterpolate(unref(formData).message)}</textarea></div><button type="submit" class="btn btn-primary submit-btn"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} data-v-3ff17a36>`);
      if (unref(isSubmitting)) {
        _push(`<span data-v-3ff17a36>Enviant...</span>`);
      } else {
        _push(`<span data-v-3ff17a36>Enviar missatge</span>`);
      }
      _push(`</button>`);
      if (unref(submitMessage)) {
        _push(`<p class="${ssrRenderClass(unref(submitSuccess) ? "submit-success" : "submit-error")}" data-v-3ff17a36>${ssrInterpolate(unref(submitMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><div class="contact-cards" data-v-3ff17a36><div class="card" data-v-3ff17a36><div class="card-icon" data-v-3ff17a36>📧</div><h3 data-v-3ff17a36>Email</h3><p data-v-3ff17a36>info@guillemvila.cat</p></div><div class="card" data-v-3ff17a36><div class="card-icon" data-v-3ff17a36>📱</div><h3 data-v-3ff17a36>Telèfon</h3><p data-v-3ff17a36>+34 682 463 081</p></div><div class="card" data-v-3ff17a36><div class="card-icon" data-v-3ff17a36>📍</div><h3 data-v-3ff17a36>Ubicació</h3><p data-v-3ff17a36>Riells i Viabrea, El Baix Montseny</p></div></div></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const contact = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3ff17a36"]]);

export { contact as default };
//# sourceMappingURL=contact-CulmxdnK.mjs.map
