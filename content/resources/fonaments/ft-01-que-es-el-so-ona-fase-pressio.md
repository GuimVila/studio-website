---
id: "FT-01"
title: "Què és el so (ona, fase, pressió)"
excerpt: "Entendre el so com una ona i què implica fase i polaritat."
category: "Fonaments transversals"
categorySlug: "fonaments"
module: "Acústica i percepció"
level: 0
seq: 1
slug: "que-es-el-so-ona-fase-pressio"
path: "/resources/fonaments/ft-01-que-es-el-so-ona-fase-pressio"
prereqIds: []
resourceType: "Article"
estMinutes: 20
tags: "fonaments, transversals, acústica, percepció, què, ona, fase, pressió"
monetization: "Free"
cta: ""
---

## Idea principal

El so és una variació de pressió que es propaga per un medi, com l'aire. Quan una font vibra, empeny i allibera l'aire del seu voltant. Aquestes petites compressions i rarefaccions viatgen fins a l'oïda o fins al micròfon.

Dit d'una altra manera: el so no és només "una ona dibuixada" dins del DAW. El dibuix que veiem a la pantalla és una representació d'un moviment físic que abans ha passat per l'aire, pel micròfon, pel previ, pel convertidor i pel sistema digital.

<div class="article-note">
  <p><strong>Idea útil per producció i mescla:</strong> quan parlem de fase, polaritat, greus o cancel·lacions, no parlem d'un concepte abstracte. Parlem de com diferents variacions de pressió arriben juntes, separades o oposades.</p>
</div>

<figure>
  <img src="/images/resources/ft-01/ona-pressio.svg" alt="Diagrama d'una ona de pressió amb compressions i rarefaccions." />
  <figcaption>Una ona sonora alterna zones de més pressió i zones de menys pressió. El micròfon converteix aquestes variacions en un senyal elèctric.</figcaption>
</figure>

## Ona, pressió i aire

Una font sonora, per exemple una corda de guitarra, una membrana d'altaveu o una veu, vibra endavant i enrere. Quan avança, comprimeix una mica l'aire. Quan retrocedeix, deixa una zona amb una pressió lleugerament menor. Aquest patró es transmet de partícula en partícula.

Les partícules d'aire no viatgen des de l'instrument fins a l'oïda com si fossin objectes disparats. Oscil·len al voltant de la seva posició. El que avança és la pertorbació: la informació del canvi de pressió.

Això és important perquè explica dues coses que apareixen constantment en àudio:

- Si dues fonts generen pressions semblants al mateix moment, poden sumar.
- Si una font arriba oposada a una altra, pot restar o cancel·lar parcialment.

## Freqüència i longitud d'ona

La freqüència indica quants cicles fa una ona cada segon. Es mesura en hertzs (Hz). Una ona de 100 Hz fa 100 cicles per segon; una de 1 kHz en fa 1000.

La longitud d'ona és la distància física que ocupa un cicle complet. En l'aire, a temperatura ambient, el so viatja aproximadament a 343 m/s. Per això una freqüència greu té una longitud d'ona molt més llarga que una freqüència aguda.

<figure>
  <img src="/images/resources/ft-01/longitud-frequencia.svg" alt="Comparació entre una ona greu i una ona aguda." />
  <figcaption>Quan la freqüència puja, hi ha més cicles per segon i la longitud d'ona es fa més curta. Aquesta relació ajuda a entendre per què els greus interactuen tant amb la sala.</figcaption>
</figure>

Una manera simple de recordar-ho és:

<p class="formula-line">velocitat del so = freqüència × longitud d'ona</p>

Per exemple, si prenem 343 m/s com a aproximació:

- 50 Hz té una longitud d'ona d'uns 6,86 metres.
- 100 Hz té una longitud d'ona d'uns 3,43 metres.
- 1000 Hz té una longitud d'ona d'uns 34 centímetres.

Aquesta és una de les raons per les quals el tractament acústic dels greus és complicat: les longituds d'ona són grans en relació amb moltes habitacions.

## Fase i polaritat

La fase descriu en quin punt del cicle es troba una ona. Si dues ones iguals arriben alineades, tendeixen a sumar. Si arriben desplaçades, el resultat canvia. Si arriben gairebé oposades, poden cancel·lar-se parcialment.

La polaritat és una inversió del signe del senyal. No és exactament el mateix que "fase", però en molts contextos pràctics s'hi barreja perquè una inversió de polaritat pot provocar cancel·lacions molt evidents quan es combina amb un altre senyal semblant.

<figure>
  <img src="/images/resources/ft-01/fase-i-polaritat.svg" alt="Diagrama amb ones alineades, desplaçades i invertides." />
  <figcaption>Dues ones poden sumar, modificar el timbre o cancel·lar-se segons com arriben entre elles. Per això la fase és crítica en microfonia, bateries, capes de baix i processament paral·lel.</figcaption>
</figure>

En una sessió real, aquests problemes poden aparèixer en llocs molt concrets:

- Dos micròfons captant la mateixa font des de distàncies diferents.
- Una caixa gravada amb micròfon superior i inferior.
- Un baix duplicat en una pista de DI i una pista d'amplificador.
- Compressió paral·lela amb latència o plugins que no compensen correctament.
- Capes de kick, sub o sintetitzadors que comparteixen la mateixa zona greu.

## Vídeo de referència

<div class="video-card">
  <strong>MIT OpenCourseWare: Sound Waves</strong>
  <p>Un vídeo útil per veure el concepte de so com a ona mecànica. No cal mirar-lo com una classe sencera d'acústica; pot servir simplement per reforçar la intuïció física.</p>
  <video controls preload="metadata" poster="/images/resources/ft-01/ona-pressio.svg">
    <source src="https://archive.org/download/MIT8.03SCF16/MIT8_03SCF16_lec11_300k.mp4" type="video/mp4" />
    El navegador no pot reproduir aquest vídeo. Pots obrir-lo des de l'enllaç de sota.
  </video>
  <p><a href="https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/resources/lecture-11-video/" target="_blank" rel="noopener">Obrir el vídeo a MIT OpenCourseWare</a></p>
</div>

## Per què importa en una producció

Entendre el so com a pressió ajuda a prendre decisions més clares. No substitueix l'oïda, però evita moltes intuïcions falses.

Si una veu sona prima quan actives dos micròfons, potser no és un problema d'equalització. Pot ser una cancel·lació. Si el baix desapareix en mono, potser no és només una qüestió d'amplada estèreo. Pot ser una relació de fase entre capes. Si el bombo perd cos quan hi afegeixes un sub, potser les dues ones no estan empenyent en la mateixa direcció.

La pregunta pràctica no és "això està bé o malament en teoria?", sinó:

> Quan aquests senyals sonen junts, el resultat té més intenció, més cos i més claredat, o en perd?

## Referències

- MIT OpenCourseWare. [Lecture 11: Sound Waves](https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/resources/lecture-11-video/), *8.03SC Physics III: Vibrations and Waves*, Massachusetts Institute of Technology.
- NIST Chemistry WebBook. [Thermophysical Properties of Fluid Systems](https://webbook.nist.gov/chemistry/fluid/), National Institute of Standards and Technology.
- Howard, David M. i Angus, Jamie. *Acoustics and Psychoacoustics*. Routledge.
- Rossing, Thomas D.; Moore, F. Richard; Wheeler, Paul A. *The Science of Sound*. Addison-Wesley.
