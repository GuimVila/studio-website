<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand & Social -->
        <div class="footer-section">
          <div class="brand">
            <img
              src="/images/logo-web_blanc.png"
              alt="Logo dark de Guillem Vila"
              class="logo-image logo-dark"
            >
            <img
              src="/images/logo-web-negre2.png"
              alt="Logo light de Guillem Vila"
              class="logo-image logo-light"
            >
            <h3 class="brand-name">Guillem Vila</h3>
          </div>

          <p class="brand-description">
            {{ $t("footer.brandDescription") }}
          </p>

          <div class="social-links">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              :aria-label="social.name"
            >
              <component :is="social.icon" />
            </a>

            <a
              href="https://wa.me/34682463081"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        <!-- Services -->
        <div class="footer-section">
          <h4 class="footer-title">{{ $t("footer.sections.services") }}</h4>
          <ul class="footer-links">
            <li v-for="service in services" :key="service">{{ service }}</li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-section footer-contact-section">
          <h4 class="footer-title">{{ $t("footer.sections.contact") }}</h4>
          <ul class="footer-contact">
            <li class="contact-item">
              <a
                href="https://www.google.com/maps/place/Riells+i+Viabrea,+El+Baix+Montseny/@41.749,2.6105,12z/data=!3m1!4b1!4m6!3m5!1s0x12a4a5f5f5f5f5f5:0x5f5f5f5f5f5f5f5!8m2!3d41.749!4d2.6105!16s%2Fg%2F11c1f1f1f1"
                target="_blank"
              >
                <LocationIcon class="contact-icon" /> Riells i Viabrea, el Baix
                Montseny</a
              >
            </li>

            <li class="contact-item">
              <PhoneIcon class="contact-icon" />
              <a href="tel:+34682463081">+34 682 463 081</a>
            </li>

            <li class="contact-item">
              <EmailIcon class="contact-icon" />
              <a href="mailto:info@guillemvila.com">info@guillemvila.com</a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="footer-section">
          <h4 class="footer-title">Newsletter</h4>
          <p class="newsletter-text">
            {{ $t("footer.newsletter.text") }}
          </p>

          <form class="newsletter-form" @submit.prevent="subscribe">
            <input
              v-model="email"
              type="email"
              :placeholder="$t('footer.newsletter.placeholderEmail')"
              required
              class="newsletter-input"
            >
            <input
              v-model="honeypot"
              type="text"
              tabindex="-1"
              autocomplete="off"
              class="hp-field"
            >
            <button
              type="submit"
              class="newsletter-button"
              :disabled="isSubmitting"
            >
              {{
                isSubmitting
                  ? $t("footer.newsletter.sending")
                  : $t("footer.newsletter.button")
              }}
            </button>

            <p
              v-if="message"
              :style="{
                marginTop: '0.75rem',
                fontSize: '0.9rem',
                color: success ? '#4ade80' : '#ef4444',
                textAlign: 'center',
              }"
            >
              {{ message }}
            </p>
          </form>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-copyright">
          <p class="copyright">
            {{ $t("footer.legal.copyright", { year }) }}
          </p>
          <p class="copyright credit">
            {{ $t("footer.legal.credit") }}
          </p>
        </div>
        <div class="footer-legal">
          <NuxtLink to="/privacy">{{ $t("footer.legal.privacy") }}</NuxtLink>
          <NuxtLink to="/cookies">{{ $t("footer.legal.cookies") }}</NuxtLink>
          <NuxtLink to="/terms">{{ $t("footer.legal.terms") }}</NuxtLink>
        </div>
      </div>

      <!-- Background Effects -->
      <div class="footer-glow footer-glow-left" />
      <div class="footer-glow footer-glow-right" />
    </div>
  </footer>
</template>

<script setup>
import { useNewsletter } from "~/composables/useNewsletter";
import { useI18n } from "vue-i18n";

import {
  InstagramIcon,
  YoutubeIcon,
  TikTokIcon,
  FacebookIcon,
  LocationIcon,
  PhoneIcon,
  EmailIcon,
  WhatsAppIcon,
} from "~/components/icons";

const { t } = useI18n();
const { email, honeypot, isSubmitting, message, success, subscribe } =
  useNewsletter();

// Socials i serveis
const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/guim.vila",
    icon: InstagramIcon,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@guillemvila",
    icon: YoutubeIcon,
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@guim_vila",
    icon: TikTokIcon,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/people/Guillem-Vila/pfbid027xnU2TyCpKQp5khQA9cBnoj9hVmSSbFSnW1iYyzLJQWmRUhQq1CryT12Sv4gVVeCl/",
    icon: FacebookIcon,
  },
];

const services = computed(() => [
  t("footer.servicesList.musicProduction"),
  t("footer.servicesList.editing"),
  t("footer.servicesList.recording"),
  t("footer.servicesList.mixing"),
  t("footer.servicesList.soundDesign"),
]);

watch(message, (val) => {
  if (!val) return;

  setTimeout(() => {
    message.value = "";
  }, 4000);
});
</script>

<style scoped>
.footer {
  background: linear-gradient(
    to bottom,
    var(--surface-2) 0%,
    var(--background) 100%
  );
  border-top: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}
.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  position: relative;
  z-index: 1;
}
.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}
.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.footer-copyright {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.copyright {
  font-size: 0.9rem;
  color: #b0b0b0;
  margin: 0;
}

.copyright.credit {
  font-size: 0.8rem;
  opacity: 0.75;
}
/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.logo-image {
  height: 40px;
  margin-right: 10px;
}
.brand-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--accent-dark), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--accent-dark), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}
.brand-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.brand-description:hover {
  color: var(--text);
  transition: color 0.3s ease;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.social-link {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--secondary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-decoration: none;
}
.social-link:hover {
  background-color: var(--accent);
  border-color: var(--accent);
  color: #fff;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
}

/* Footer Title */
.footer-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

/* Footer Links */
.footer-links {
  list-style: none;
  color: #b0b0b0;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-links li:hover {
  color: white;
  transition: color 0.3s ease;
}

/* Contact */
.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #b0b0b0;
  transition: color 0.3s ease;
}
.contact-item:hover {
  color: white;
}
.contact-item .contact-icon {
  color: #d08a3f;
  flex-shrink: 0;
  margin-top: 2px;
}
.contact-item a {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;
}
.contact-item a:hover {
  color: white;
}

/* Newsletter */
.newsletter-text {
  color: #b0b0b0;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.newsletter-text:hover {
  color: white;
  transition: color 0.3s ease;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.newsletter-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  background-color: var(--secondary);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}
.newsletter-input::placeholder {
  color: var(--text-secondary);
}
.newsletter-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(208, 138, 63, 0.18);
}
.newsletter-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    var(--accent-dark) 0%,
    var(--accent) 45%,
    var(--accent-light) 100%
  );
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}
.newsletter-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(208, 138, 63, 0.18);
}
.newsletter-button:active {
  transform: translateY(0);
}

.hp-field {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

/* Footer Bottom */
.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.footer-legal {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
}

/* NuxtLink (scoped) */
.footer-legal :deep(a) {
  color: #b0b0b0;
  text-decoration: none;
  transition: color 0.3s ease;
}
.footer-legal :deep(a:hover) {
  color: #d08a3f;
}

/* Background Glow */
.footer-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: var(--accent);
  filter: blur(120px);
  opacity: 0.15;
  pointer-events: none;
  animation: pulse 8s ease-in-out infinite;
}
.footer-glow-left {
  bottom: -100px;
  left: -100px;
}
.footer-glow-right {
  bottom: -100px;
  right: -100px;
  animation-delay: 1s;
}

.h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
}

/* ===== LOGO THEME SWITCH ===== */

/* Default: dark mode */
.logo-light {
  display: none;
}

.logo-dark {
  display: block;
}

/* Light theme */
:root[data-theme="light"] .logo-dark {
  display: none;
}

:root[data-theme="light"] .logo-light {
  display: block;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.25;
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .footer-container {
    padding: 3rem 1.5rem;
  }
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  .footer-legal {
    flex-direction: column;
    gap: 0.75rem;
  }
  .brand-name {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .social-links {
    gap: 0.75rem;
  }
  .social-link {
    width: 40px;
    height: 40px;
  }
}
</style>
