import { ref, computed, onMounted } from 'vue'

type ConsentStatus = 'unset' | 'accepted' | 'rejected'

const STORAGE_KEY = 'cookie_consent'

const consent = ref<ConsentStatus>('unset')

export function useCookieConsent() {
  const loadConsent = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY) as ConsentStatus | null
      if (stored === 'accepted' || stored === 'rejected') {
        consent.value = stored
      }
    }
  }

  const accept = () => {
    consent.value = 'accepted'
    localStorage.setItem(STORAGE_KEY, 'accepted')
  }

  const reject = () => {
    consent.value = 'rejected'
    localStorage.setItem(STORAGE_KEY, 'rejected')
  }

  const isUnset = computed(() => consent.value === 'unset')
  const isAccepted = computed(() => consent.value === 'accepted')

  onMounted(loadConsent)

  return {
    consent,
    isUnset,
    isAccepted,
    accept,
    reject,
  }
}
