import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    // Comprovació de seguretat
    if (!config.public.supabaseUrl || !config.public.supabaseKey) {
        throw new Error('supabaseUrl i supabaseKey són necessaris! Revisa el teu .env')
    }

    // Crear client Supabase
    const supabase: SupabaseClient = createClient(
        config.public.supabaseUrl,
        config.public.supabaseKey
    )

    // Proporcionar la instància a l'aplicació
    nuxtApp.provide('supabase', supabase)
})
