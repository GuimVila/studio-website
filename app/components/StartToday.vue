<template>
  <section class="start-today-section">
    <div class="start-today-container">
      <div class="cta-card">
        <div class="cta-content">
          <h2 class="cta-title">{{ $t("startToday.title") }}</h2>
          <p class="cta-subtitle">
            {{ $t("startToday.subtitle") }}
          </p>
          <div class="cta-actions">
            <LocaleLink to="/contact" class="cta-button">
              <span>{{ $t("startToday.cta") }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.start-today-section {
  padding: clamp(3rem, 6vw, 6rem) 0 clamp(4rem, 8vw, 8rem) 0;
  background: var(--background);
}

.start-today-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 3rem);
}

.cta-card {
  background: linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%);
  border: 1px solid var(--border);
  border-radius: 32px;
  padding: clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-1);
}

.cta-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(208, 138, 63, 0.4) 50%,
    transparent 100%
  );
}

.cta-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(208, 138, 63, 0.08) 0%,
    transparent 60%
  );
  pointer-events: none;
}

:root[data-theme="light"] .cta-card::after {
  background: radial-gradient(
    circle at 50% 0%,
    rgba(208, 138, 63, 0.1) 0%,
    transparent 60%
  );
}

.cta-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  line-height: 1.15;
  margin: 0 0 1.25rem 0;
  background: linear-gradient(
    135deg,
    var(--text) 0%,
    var(--text) 40%,
    var(--accent) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-subtitle {
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 2.5rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1.125rem 2.5rem;
  font-size: 1.05rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--accent-dark), var(--accent));
  color: #fff;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 10px 30px rgba(208, 138, 63, 0.3),
    0 0 0 1px rgba(208, 138, 63, 0.2) inset;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow:
    0 15px 45px rgba(208, 138, 63, 0.4),
    0 0 0 1px rgba(208, 138, 63, 0.3) inset;
}

.cta-button svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-button:hover svg {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .cta-card {
    border-radius: 24px;
    padding: clamp(2.5rem, 6vw, 3rem) clamp(1.5rem, 5vw, 2rem);
  }

  .cta-button {
    width: 100%;
    justify-content: center;
    padding: 1rem 2rem;
  }
}
</style>
