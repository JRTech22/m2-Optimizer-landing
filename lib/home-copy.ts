import type { Lang } from '@/lib/copy'

export interface HomeCopy {
  badge: string
  badgeTrail: string
  title: string
  accent: string
  lede: string
  cta: string
  ctaSecondary: string
  imageAlt: string
  tiles: string[]
  checks: string[]
  strip: { title: string; body: string }[]
  featuresTitle: string
  featuresLede: string
  features: { title: string; body: string }[]
  widgetsTitle: string
  widgetsLede: string
  widgetCards: { kicker: string; title: string; note: string }[]
  stepsTitle: string
  steps: { title: string; body: string }[]
  plansTitle: string
  plansLede: string
  plans: { name: string; price: string; body: string; cta: string }[]
  bandTitle: string
  bandBody: string
  bandCta: string
}

export const HOME: Record<Lang, HomeCopy> = {
  es: {
    badge: 'EN TU PC',
    badgeTrail: 'Mide · Revisa · Decide',
    title: 'Deja Windows en orden',
    accent: 'con el plan a la vista.',
    lede: 'M2 Optimizer lee el equipo donde está, enseña cada cambio y espera tu sí antes de tocar el inicio, la energía o los temporales.',
    cta: 'Para Windows',
    ctaSecondary: 'Ver el recorrido',
    imageAlt: 'Escritorio con M2 Optimizer abierto en el monitor',
    tiles: ['Lectura del equipo', 'Plan a la vista', 'Inicio y energía', 'Relojes en el escritorio'],
    checks: ['Análisis gratis', 'Pago con PayPal', 'Windows 10 y 11'],
    strip: [
      { title: 'Lectura en el propio PC', body: 'La puntuación y los consejos no salen del equipo.' },
      { title: 'Nada se aplica a ciegas', body: 'Ves el plan antes. Lo que no entra queda bloqueado.' },
      { title: 'Relojes y sensores', body: 'Los relojes van con la gratis. Los sensores, con la completa.' },
      { title: 'Un año, este Windows', body: 'La licencia queda ligada a la huella del equipo.' },
    ],
    featuresTitle: 'Lo que hace en el equipo',
    featuresLede: 'Lee, propone y espera. El resto sigue cerrado hasta que la licencia lo abre.',
    features: [
      { title: 'Lectura en el equipo', body: 'Puntuación, consejos e historial se quedan en el PC. No se leen tus documentos.' },
      { title: 'Plan visible', body: 'Cada cambio aparece antes de aplicarse. Lo que no entra en tu licencia se muestra bloqueado.' },
      { title: 'Tramo reversible', body: 'La licencia básica abre desactivar el inicio y el plan de energía. Nada más.' },
      { title: 'Catálogo completo', body: 'Temporales, papelera, cierre de apps, basura, rutina y widgets encima de los juegos.' },
      { title: 'Widgets vivos', body: 'Relojes en la gratis. Sensores, pieles y modo encima de juegos con la licencia completa.' },
      { title: 'Instalador a tu ritmo', body: 'Publicas la versión en la misma URL. Al abrir, la app descarga el instalador y lo abre.' },
    ],
    widgetsTitle: 'Encima del escritorio',
    widgetsLede: 'Cinco pieles y dos colores. La hora sale del reloj del equipo. El resto, de los sensores que Windows sí reporta.',
    widgetCards: [
      { kicker: 'Reloj', title: 'Hora del equipo', note: 'Fecha corta. La temperatura solo si la máquina la tiene.' },
      { kicker: 'CPU', title: 'Uso y reloj', note: 'Porcentaje, grados si existen, y la serie que se va midiendo.' },
      { kicker: 'RAM', title: 'Usada y total', note: 'Lo que el equipo informa, sin cifras de adorno.' },
    ],
    stepsTitle: 'De la lectura al cambio',
    steps: [
      { title: 'Abre y mide', body: 'La app analiza Windows en el equipo y deja el resultado en Inicio.' },
      { title: 'Revisa el plan', body: 'Aceptas solo lo que quieres. El resto espera, con el motivo a la vista.' },
      { title: 'Elige la licencia', body: 'Gratis para leer. 4,99 o 19,99 USD al año para escribir en Windows.' },
    ],
    plansTitle: 'Tres niveles, un año',
    plansLede: 'La licencia empieza cuando el pago queda confirmado y queda ligada a la huella de este PC.',
    plans: [
      { name: 'Gratis', price: '0 USD', body: 'Análisis, puntuación, consejos, historial en solo lectura y relojes.', cta: 'Seguir en gratis' },
      { name: 'Básica', price: '4,99 USD', body: 'Lo gratis, más desactivar programas del inicio y cambiar el plan de energía.', cta: 'Elegir básica' },
      { name: 'Completa', price: '19,99 USD', body: 'Todo el catálogo, la rutina, los sensores y el modo encima de juegos.', cta: 'Elegir completa' },
    ],
    bandTitle: 'Empieza por la lectura. Sube cuando el plan te convenza.',
    bandBody: 'El pago se hace en esta web. La app de escritorio reconoce la licencia al volver.',
    bandCta: 'Ver licencias',
  },
  en: {
    badge: 'ON YOUR PC',
    badgeTrail: 'Measure · Review · Decide',
    title: 'Put Windows in order',
    accent: 'with the plan in view.',
    lede: 'M2 Optimizer reads the machine where it sits, shows every change, and waits for your yes before it touches startup, power, or temp files.',
    cta: 'For Windows',
    ctaSecondary: 'See the path',
    imageAlt: 'A desk with M2 Optimizer open on the monitor',
    tiles: ['A reading of the PC', 'A plan in view', 'Startup and power', 'Clocks on the desktop'],
    checks: ['Free analysis', 'PayPal checkout', 'Windows 10 and 11'],
    strip: [
      { title: 'Read on the PC', body: 'The score and the advice stay on the machine.' },
      { title: 'Nothing runs unseen', body: 'You see the plan first. Anything outside it stays locked.' },
      { title: 'Clocks and sensors', body: 'Clocks come with Free. Sensors come with Complete.' },
      { title: 'One year, this Windows', body: 'The license stays tied to this PC fingerprint.' },
    ],
    featuresTitle: 'What it does on the machine',
    featuresLede: 'It reads, proposes, and waits. The rest stays closed until a license opens it.',
    features: [
      { title: 'Read on the PC', body: 'Score, advice and history stay on the machine. Your documents are never read.' },
      { title: 'A visible plan', body: 'Every change is shown before it runs. Anything outside your license stays locked, with the reason.' },
      { title: 'The reversible slice', body: 'Basic opens disabling startup programs and switching the power plan. Nothing else.' },
      { title: 'The full catalog', body: 'Temp files, recycle bin, closing apps, junk, automation and widgets over your games.' },
      { title: 'Living widgets', body: 'Clocks on the free license. Sensors, skins and game overlay on the complete license.' },
      { title: 'You publish the build', body: 'You publish the version on the same URL. On open, the app downloads the installer and opens it.' },
    ],
    widgetsTitle: 'On the desktop',
    widgetsLede: 'Five skins and two colors. The time comes from the PC clock. The rest comes from sensors Windows actually reports.',
    widgetCards: [
      { kicker: 'Clock', title: 'The machine’s time', note: 'A short date. Temperature only when the PC has it.' },
      { kicker: 'CPU', title: 'Use and clock', note: 'Percent, degrees when they exist, and the series as it is measured.' },
      { kicker: 'RAM', title: 'Used and total', note: 'What the machine reports, with no decorative figures.' },
    ],
    stepsTitle: 'From a reading to a change',
    steps: [
      { title: 'Open and measure', body: 'The app analyzes Windows on the PC and leaves the result on Home.' },
      { title: 'Review the plan', body: 'You accept only what you want. The rest waits, with the reason in view.' },
      { title: 'Pick a license', body: 'Free to read. 4.99 or 19.99 USD a year to write to Windows.' },
    ],
    plansTitle: 'Three tiers, one year',
    plansLede: 'The license starts when payment is confirmed and stays tied to this PC fingerprint.',
    plans: [
      { name: 'Free', price: '0 USD', body: 'Analysis, score, advice, read-only history and clocks.', cta: 'Stay on free' },
      { name: 'Basic', price: '4.99 USD', body: 'Everything in Free, plus startup programs and the power plan.', cta: 'Choose basic' },
      { name: 'Complete', price: '19.99 USD', body: 'The full catalog, automation, sensors and game overlay.', cta: 'Choose complete' },
    ],
    bandTitle: 'Start with the reading. Upgrade when the plan earns it.',
    bandBody: 'Payment happens on this site. The desktop app recognizes the license when you return.',
    bandCta: 'See licenses',
  },
  fr: {
    badge: 'SUR VOTRE PC',
    badgeTrail: 'Mesurer · Relire · Décider',
    title: 'Remettez Windows en ordre',
    accent: 'avec le plan sous les yeux.',
    lede: 'M2 Optimizer lit la machine là où elle est, montre chaque changement et attend votre oui avant de toucher au démarrage, à l’alimentation ou aux fichiers temporaires.',
    cta: 'Pour Windows',
    ctaSecondary: 'Voir le parcours',
    imageAlt: 'Un bureau avec M2 Optimizer ouvert sur l’écran',
    tiles: ['Lecture du PC', 'Plan visible', 'Démarrage et alimentation', 'Horloges sur le bureau'],
    checks: ['Analyse gratuite', 'Paiement PayPal', 'Windows 10 et 11'],
    strip: [
      { title: 'Lecture sur le PC', body: 'Le score et les conseils restent sur la machine.' },
      { title: 'Rien ne part en aveugle', body: 'Vous voyez le plan d’abord. Le reste reste bloqué.' },
      { title: 'Horloges et capteurs', body: 'Les horloges vont avec la gratuite. Les capteurs, avec la complète.' },
      { title: 'Un an, ce Windows', body: 'La licence reste liée à l’empreinte de ce PC.' },
    ],
    featuresTitle: 'Ce qu’elle fait sur la machine',
    featuresLede: 'Elle lit, propose et attend. Le reste reste fermé tant qu’une licence ne l’ouvre pas.',
    features: [
      { title: 'Lecture sur le PC', body: 'Score, conseils et historique restent sur la machine. Vos documents ne sont pas lus.' },
      { title: 'Plan visible', body: 'Chaque changement s’affiche avant d’être appliqué. Hors licence, il reste bloqué, avec le motif.' },
      { title: 'Partie réversible', body: 'La basique ouvre la désactivation du démarrage et le plan d’alimentation. Rien d’autre.' },
      { title: 'Catalogue complet', body: 'Fichiers temporaires, corbeille, fermeture d’apps, indésirables, routine et widgets au-dessus des jeux.' },
      { title: 'Widgets vivants', body: 'Horloges avec la licence gratuite. Capteurs, peaux et mode jeu avec la licence complète.' },
      { title: 'Vous publiez la version', body: 'Vous publiez la version sur la même URL. À l’ouverture, l’app télécharge l’installateur et l’ouvre.' },
    ],
    widgetsTitle: 'Sur le bureau',
    widgetsLede: 'Cinq peaux et deux couleurs. L’heure vient de l’horloge du PC. Le reste, des capteurs que Windows rapporte vraiment.',
    widgetCards: [
      { kicker: 'Horloge', title: 'L’heure du PC', note: 'Date courte. La température seulement si la machine l’a.' },
      { kicker: 'CPU', title: 'Usage et fréquence', note: 'Pourcentage, degrés s’ils existent, et la série au fil de la mesure.' },
      { kicker: 'RAM', title: 'Utilisée et totale', note: 'Ce que la machine indique, sans chiffres d’apparat.' },
    ],
    stepsTitle: 'De la lecture au changement',
    steps: [
      { title: 'Ouvrir et mesurer', body: 'L’app analyse Windows sur le PC et laisse le résultat à l’accueil.' },
      { title: 'Relire le plan', body: 'Vous n’acceptez que ce que vous voulez. Le reste attend, motif à l’écran.' },
      { title: 'Choisir la licence', body: 'Gratuite pour lire. 4,99 ou 19,99 USD par an pour écrire dans Windows.' },
    ],
    plansTitle: 'Trois niveaux, un an',
    plansLede: 'La licence commence quand le paiement est confirmé et reste liée à l’empreinte de ce PC.',
    plans: [
      { name: 'Gratuite', price: '0 USD', body: 'Analyse, score, conseils, historique en lecture seule et horloges.', cta: 'Rester en gratuit' },
      { name: 'Basique', price: '4,99 USD', body: 'La gratuite, plus le démarrage et le plan d’alimentation.', cta: 'Choisir basique' },
      { name: 'Complète', price: '19,99 USD', body: 'Tout le catalogue, la routine, les capteurs et le mode jeu.', cta: 'Choisir complète' },
    ],
    bandTitle: 'Commencez par la lecture. Montez quand le plan vous convainc.',
    bandBody: 'Le paiement se fait sur ce site. L’app de bureau reconnaît la licence au retour.',
    bandCta: 'Voir les licences',
  },
  pt: {
    badge: 'NO SEU PC',
    badgeTrail: 'Mede · Revisa · Decide',
    title: 'Deixe o Windows em ordem',
    accent: 'com o plano à vista.',
    lede: 'O M2 Optimizer lê a máquina onde ela está, mostra cada mudança e espera o seu sim antes de mexer na inicialização, na energia ou nos temporários.',
    cta: 'Para Windows',
    ctaSecondary: 'Ver o percurso',
    imageAlt: 'Uma mesa com o M2 Optimizer aberto no monitor',
    tiles: ['Leitura do PC', 'Plano à vista', 'Inicialização e energia', 'Relógios na área de trabalho'],
    checks: ['Análise grátis', 'Pagamento PayPal', 'Windows 10 e 11'],
    strip: [
      { title: 'Leitura no próprio PC', body: 'A pontuação e os conselhos ficam na máquina.' },
      { title: 'Nada se aplica no escuro', body: 'Você vê o plano antes. O que fica de fora continua bloqueado.' },
      { title: 'Relógios e sensores', body: 'Os relógios vêm no grátis. Os sensores, na completa.' },
      { title: 'Um ano, este Windows', body: 'A licença fica ligada à impressão deste PC.' },
    ],
    featuresTitle: 'O que faz na máquina',
    featuresLede: 'Lê, propõe e espera. O resto fica fechado até a licença abrir.',
    features: [
      { title: 'Leitura no PC', body: 'Pontuação, conselhos e histórico ficam na máquina. Os seus documentos não são lidos.' },
      { title: 'Plano visível', body: 'Cada mudança aparece antes de ser aplicada. Fora da licença, fica bloqueada, com o motivo.' },
      { title: 'Trecho reversível', body: 'A básica abre desativar a inicialização e o plano de energia. Nada além disso.' },
      { title: 'Catálogo completo', body: 'Temporários, lixeira, fechar apps, lixo, rotina e widgets sobre os jogos.' },
      { title: 'Widgets vivos', body: 'Relógios na licença grátis. Sensores, peles e modo sobre os jogos na licença completa.' },
      { title: 'Você publica a versão', body: 'Você publica a versão na mesma URL. Ao abrir, o app baixa o instalador e o abre.' },
    ],
    widgetsTitle: 'Na área de trabalho',
    widgetsLede: 'Cinco peles e duas cores. A hora vem do relógio do PC. O resto, dos sensores que o Windows realmente informa.',
    widgetCards: [
      { kicker: 'Relógio', title: 'Hora do equipamento', note: 'Data curta. Temperatura só se a máquina tiver.' },
      { kicker: 'CPU', title: 'Uso e clock', note: 'Porcentagem, graus se existirem, e a série conforme a medição.' },
      { kicker: 'RAM', title: 'Usada e total', note: 'O que o equipamento informa, sem números de enfeite.' },
    ],
    stepsTitle: 'Da leitura à mudança',
    steps: [
      { title: 'Abra e meça', body: 'O app analisa o Windows no PC e deixa o resultado no início.' },
      { title: 'Revise o plano', body: 'Você aceita só o que quer. O resto espera, com o motivo à vista.' },
      { title: 'Escolha a licença', body: 'Grátis para ler. 4,99 ou 19,99 USD por ano para escrever no Windows.' },
    ],
    plansTitle: 'Três níveis, um ano',
    plansLede: 'A licença começa quando o pagamento é confirmado e fica ligada à impressão deste PC.',
    plans: [
      { name: 'Grátis', price: '0 USD', body: 'Análise, pontuação, conselhos, histórico só de leitura e relógios.', cta: 'Ficar no grátis' },
      { name: 'Básica', price: '4,99 USD', body: 'O grátis, mais a inicialização e o plano de energia.', cta: 'Escolher básica' },
      { name: 'Completa', price: '19,99 USD', body: 'O catálogo inteiro, a rotina, os sensores e o modo sobre os jogos.', cta: 'Escolher completa' },
    ],
    bandTitle: 'Comece pela leitura. Suba quando o plano convencer.',
    bandBody: 'O pagamento acontece neste site. O app de desktop reconhece a licença ao voltar.',
    bandCta: 'Ver licenças',
  },
}
