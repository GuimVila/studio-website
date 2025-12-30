<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="section-title">Política de Privacitat</h1>

        <h2>Responsable del tractament</h2>
        <p>
          El responsable del tractament de les dades personals és Guillem Vila.
          Pots contactar a través del correu electrònic:
          <a href="mailto:info@guillemvila.com">info@guillemvila.com</a>.
        </p>

        <h2>Quines dades tractem</h2>
        <ul>
          <li>
            <strong>Newsletter:</strong> correu electrònic (i, si escau,
            metadades tècniques mínimes necessàries per al funcionament del
            servei).
          </li>
          <li>
            <strong>Formulari de contacte:</strong> nom i cognoms (si s’indica),
            correu electrònic i el contingut del missatge.
          </li>
          <li>
            <strong>Dades de navegació:</strong> informació agregada i
            estadística del trànsit (analítica).
          </li>
        </ul>

        <h2>Finalitats i base jurídica</h2>
        <ul>
          <li>
            <strong>Gestionar la subscripció a la newsletter</strong> (alta,
            confirmació double opt-in i enviaments): <em>consentiment</em>.
          </li>
          <li>
            <strong>Respondre consultes</strong> a través del formulari de
            contacte: <em>consentiment</em> i/o
            <em>mesures precontractuals</em> (si escau).
          </li>
          <li>
            <strong>Analitzar l’ús del web</strong> per millorar contingut i
            rendiment: <em>interès legítim</em> quan l’analítica és agregada i
            sense identificació personal.
          </li>
        </ul>
        <p>
          Pots retirar el consentiment en qualsevol moment. La retirada del
          consentiment no afecta la licitud del tractament basat en el
          consentiment previ.
        </p>

        <h2>Conservació de les dades</h2>
        <ul>
          <li>
            <strong>Newsletter:</strong> mentre la subscripció estigui activa o
            fins que l’usuari sol·liciti la baixa/supressió.
          </li>
          <li>
            <strong>Contacte:</strong> el temps necessari per gestionar la
            consulta i, posteriorment, durant un període raonable per a
            seguiment o fins que se’n sol·liciti la supressió.
          </li>
          <li>
            <strong>Registres tècnics (logs):</strong> durant el temps necessari
            per seguretat i diagnòstic d’incidències.
          </li>
        </ul>

        <h2>Encàrrecs de tractament i proveïdors</h2>
        <p>
          Per prestar el servei, podem utilitzar proveïdors que actuen com a
          encarregats del tractament, per exemple:
        </p>
        <ul>
          <li>
            <strong>Vercel</strong> (allotjament i infraestructura del web).
          </li>
          <li>
            <strong>Supabase</strong> (base de dades i serveis associats).
          </li>
          <li><strong>Resend</strong> (enviament de correus electrònics).</li>
          <li><strong>Plausible Analytics</strong> (analítica web).</li>
        </ul>

        <h2>Transferències internacionals</h2>
        <p>
          Alguns proveïdors poden tractar dades fora de l’Espai Econòmic
          Europeu. En aquests casos, s’apliquen garanties adequades, com ara
          clàusules contractuals tipus o mecanismes equivalents previstos per la
          normativa.
        </p>

        <h2>Drets de les persones usuàries</h2>
        <p>
          Pots exercir els teus drets de protecció de dades contactant-nos a
          <a href="mailto:info@guillemvila.com">info@guillemvila.com</a>.
        </p>
        <ul>
          <li>Dret d’accés.</li>
          <li>Dret de rectificació.</li>
          <li>Dret de supressió (“dret a l’oblit”).</li>
          <li>Dret d’oposició.</li>
          <li>Dret a la limitació del tractament.</li>
          <li>Dret a la portabilitat de les dades.</li>
        </ul>
        <p>
          També tens dret a presentar una reclamació davant l’autoritat de
          control competent (a Espanya, l’AEPD) si consideres que s’ha vulnerat
          la normativa.
        </p>

        <h2>Baixa de la newsletter</h2>
        <p>
          Pots donar-te de baixa en qualsevol moment mitjançant l’enllaç de
          baixa inclòs als correus de la newsletter o escrivint a
          <a href="mailto:info@guillemvila.com">info@guillemvila.com</a>.
        </p>

        <h2>Canvis en la política de privacitat</h2>
        <p>
          Aquesta política pot actualitzar-se periòdicament. Es recomana
          revisar-la regularment per estar informat de possibles canvis.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title:
    "Política de Privacitat | Guillem Vila · Artista, productor musical i enginyer de so",
  meta: [
    {
      name: "description",
      content:
        "Política de privacitat de Guillem Vila: dades tractades, finalitats, base jurídica, conservació, proveïdors, drets de les persones usuàries i baixa de la newsletter.",
    },
  ],
});
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 3rem);
  font-weight: 900;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #ff6b35 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  color: var(--text);
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

p,
li {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1rem;
}

ul {
  padding-left: 1.5rem;
  list-style: disc;
}

a {
  color: inherit;
  text-decoration: underline;
}
</style>
