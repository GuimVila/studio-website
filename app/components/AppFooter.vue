<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand & Social -->
        <div class="footer-section">
          <div class="brand">
            <img
              key="logo"
              src="/assets/images/logo-web_blanc.png"
              alt="Logo de Guillem Vila - Estudi de so i producció musical de Riells i Viabrea, Girona"
              class="logo-image"
            >
            <h3 class="brand-name">Guillem Vila</h3>
          </div>
          <p class="brand-description">
            Estudi de so professional i producció musical.
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
          </div>
        </div>

        <!-- Services -->
        <div class="footer-section">
          <h4 class="footer-title">Serveis</h4>
          <ul class="footer-links">
            <li v-for="service in services" :key="service">{{ service }}</li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-section footer-contact-section">
          <h4 class="footer-title">Contacte</h4>
          <ul class="footer-contact">
            <li class="contact-item">
              <LocationIcon class="contact-icon" />
              Riells i Viabrea, El Baix Montseny
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
            Subscriu-te per rebre les últimes novetats, tutorials i ofertes
            especials.
          </p>
          <form class="newsletter-form" @submit.prevent="subscribe">
            <input
              v-model="email"
              type="email"
              placeholder="Correu electrònic"
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
              {{ isSubmitting ? "Enviant..." : "Subscriu-te" }}
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
        <p class="copyright">
          &copy; 2025 Guillem Vila. Tots els drets reservats.
        </p>
        <div class="footer-legal">
          <a href="privacy">Política de Privacitat</a>
          <a href="cookies">Política de Cookies</a>
          <a href="terms">Termes i Condicions</a>
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

import {
  InstagramIcon,
  YoutubeIcon,
  TikTokIcon,
  FacebookIcon,
  LocationIcon,
  PhoneIcon,
  EmailIcon,
} from "~/components/icons";

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
    href: "https://youtube.com/elteuperfil",
    icon: YoutubeIcon,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@elteuperfil",
    icon: TikTokIcon,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/elteuperfil",
    icon: FacebookIcon,
  },
];

const services = ["Producció Musical", "Edició", "Gravació", "Mescla", "Disseny de So"];

watch(message, (val) => {
  if (!val) return;

  setTimeout(() => {
    message.value = "";
  }, 4000);
});
</script>

<style scoped>
.footer {
  background: linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c61 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #ff6b35 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}
.brand-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin: 0;
}

.brand-description:hover {
  color: white;
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
  background-color: #2d2d2d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b0b0;
  transition: all 0.3s ease;
  text-decoration: none;
}
.social-link:hover {
  background-color: #ff6b35;
  border-color: #ff6b35;
  color: white;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
}

/* Footer Title */
.footer-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
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
  color: #ff6b35;
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

/* ne */
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
  background-color: #2d2d2d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}
.newsletter-input::placeholder {
  color: #b0b0b0;
}
.newsletter-input:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
}
.newsletter-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c61 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}
.newsletter-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 107, 53, 0.5);
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
.footer-legal a {
  color: #b0b0b0;
  text-decoration: none;
  transition: color 0.3s ease;
}
.footer-legal a:hover {
  color: #ff6b35;
}

/* Background Glow */
.footer-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: #ff6b35;
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
