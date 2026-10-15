export const LANGS = ['es', 'en', 'fr', 'pt'] as const
export type Lang = (typeof LANGS)[number]

export interface Block {
  heading: string
  body: string
}

export interface Copy {
  brand: string
  nav: {
    home: string
    features: string
    widgets: string
    pricing: string
    help: string
    terms: string
    privacy: string
    contact: string
    windows: string
  }
  theme: { toLight: string; toDark: string }
  langLabel: string
  pages: Record<'home' | 'pricing' | 'help' | 'terms' | 'privacy' | 'contact' | 'missing', { title: string; lede: string; blocks: Block[] }>
  pricing: {
    email: string
    device: string
    pay: string
    basic: string
    complete: string
    missingDevice: string
    paid: string
    reused: string
    partial: string
    year: string
    popular: string
    choose: string
    promoTitle: string
    promoLead: string
    promoAction: string
    promoBusy: string
    promoNeed: string
    promoMissing: string
    promoUsed: string
    promoEmpty: string
    promoInvalid: string
    promoCovered: string
    promoDone: string
    promoCongrats: string
    promoClose: string
    promoDays: string
  }
}

const shared = {
  es: {
    brand: 'M2 Optimizer',
    nav: { home: 'Inicio', features: 'Funciones', widgets: 'Widgets', pricing: 'Licencias', help: 'Ayuda', terms: 'Términos', privacy: 'Privacidad', contact: 'Contacto', windows: 'Para Windows' },
    theme: { toLight: 'Usar tema claro', toDark: 'Usar tema oscuro' },
    langLabel: 'Idioma',
  },
  en: {
    brand: 'M2 Optimizer',
    nav: { home: 'Home', features: 'Features', widgets: 'Widgets', pricing: 'Licenses', help: 'Help', terms: 'Terms', privacy: 'Privacy', contact: 'Contact', windows: 'For Windows' },
    theme: { toLight: 'Use light theme', toDark: 'Use dark theme' },
    langLabel: 'Language',
  },
  fr: {
    brand: 'M2 Optimizer',
    nav: { home: 'Accueil', features: 'Fonctions', widgets: 'Widgets', pricing: 'Licences', help: 'Aide', terms: 'Conditions', privacy: 'Confidentialité', contact: 'Contact', windows: 'Pour Windows' },
    theme: { toLight: 'Thème clair', toDark: 'Thème sombre' },
    langLabel: 'Langue',
  },
  pt: {
    brand: 'M2 Optimizer',
    nav: { home: 'Início', features: 'Funções', widgets: 'Widgets', pricing: 'Licenças', help: 'Ajuda', terms: 'Termos', privacy: 'Privacidade', contact: 'Contato', windows: 'Para Windows' },
    theme: { toLight: 'Usar tema claro', toDark: 'Usar tema escuro' },
    langLabel: 'Idioma',
  },
} as const

export const COPY: Record<Lang, Copy> = {
  es: {
    ...shared.es,
    pages: {
      home: {
        title: 'Windows más ligero, con tu aprobación',
        lede: 'M2 Optimizer mide el equipo en el propio PC y solo cambia Windows cuando tú lo aceptas.',
        blocks: [
          { heading: 'Lee antes de tocar', body: 'El análisis, la puntuación y los consejos están en la licencia gratis. Nada se borra ni se cierra sin un plan que puedas revisar.' },
          { heading: 'Dos licencias anuales', body: 'La básica, 4,99 USD, abre el inicio de Windows y el plan de energía. La completa, 19,99 USD, abre temporales, papelera, cierre de apps, basura, rutina y los widgets de sensores.' },
          { heading: 'El instalador lo publicas tú', body: 'Subes M2 Optimizer Installer.exe a la misma URL de Drive y anotas la versión nueva. Al abrir, la app descarga ese instalador y lo abre.' },
        ],
      },
      pricing: {
        title: 'Precios',
        lede: 'Un año desde el pago confirmado. La huella del equipo viaja con el pedido. Si tienes un código, canjéalo aquí.',
        blocks: [
          { heading: 'Básica · 4,99 USD', body: 'Análisis, historial en solo lectura, relojes, desactivar programas del inicio y cambiar el plan de energía.' },
          { heading: 'Completa · 19,99 USD', body: 'Todo el catálogo: temporales, papelera, cierre de apps, desinstalación de basura, rutina automática, widgets de sensores y modo encima de juegos.' },
        ],
      },
      help: {
        title: 'Ayuda',
        lede: 'La app mide en el PC. Esta web cobra la licencia y publica el instalador.',
        blocks: [
          { heading: 'No aparece la licencia', body: 'Abre Pagos en la app de escritorio, termina el pago y vuelve a la app. Ajustes muestra el nivel y la caducidad.' },
          { heading: 'Widgets de sensores', body: 'Relojes están en la licencia gratis. CPU, RAM, discos, red y el modo encima de juegos piden la licencia completa.' },
          { heading: 'Instalador nuevo', body: 'Cuando publiques una versión en m2_releases, Ajustes ofrece la descarga. Tú decides cuándo instalarla.' },
        ],
      },
      terms: {
        title: 'Términos',
        lede: 'La licencia es anual, personal para la huella del equipo y no transfiere el control de Windows a M2 Optimizer.',
        blocks: [
          { heading: 'Qué compras', body: 'La básica abre solo el tramo reversible. La completa abre el catálogo descrito en la página de precios. La gratis no escribe en Windows.' },
          { heading: 'Pago', body: 'PayPal cobra 4,99 o 19,99 USD. La licencia empieza cuando el servidor confirma la captura y dura un año.' },
          { heading: 'Cambios en Windows', body: 'Cada acción se muestra antes de aplicarse. M2 Optimizer no modifica software de seguridad.' },
        ],
      },
      privacy: {
        title: 'Privacidad',
        lede: 'El análisis del PC no sale del equipo. Esta web guarda la licencia, no tus archivos.',
        blocks: [
          { heading: 'Huella', body: 'Es el identificador de máquina de Windows, pasado por SHA-256. No es un rastreo del navegador.' },
          { heading: 'Pago', body: 'PayPal procesa la tarjeta o el saldo. Guardamos el correo, el nivel, la caducidad, la huella y el id de la orden.' },
          { heading: 'Contacto', body: 'Si escribes a contacto@m2dominicanrd.com, el mensaje llega a ese buzón.' },
        ],
      },
      contact: {
        title: 'Contacto',
        lede: 'Escríbenos para licencias, el instalador o una duda de uso.',
        blocks: [{ heading: 'Correo', body: 'contacto@m2dominicanrd.com' }],
      },
      missing: {
        title: 'Página no encontrada',
        lede: 'Esa dirección no existe en M2 Optimizer.',
        blocks: [{ heading: 'Siguiente paso', body: 'Vuelve al inicio o abre Precios si ibas a pagar la licencia.' }],
      },
    },
    pricing: {
      email: 'Correo',
      device: 'Huella del equipo',
      pay: 'Pagar con PayPal',
      basic: 'Básica',
      complete: 'Completa',
      missingDevice: 'Abre Pagos en la app de escritorio. La huella llega sola con el enlace.',
      paid: 'Pago confirmado. Vuelve a la app: Ajustes mostrará la licencia.',
      reused: 'Esta compra ya tiene una licencia vigente. Quedó activada en este equipo, sin un cobro nuevo.',
      partial: 'La licencia básica vigente quedó en este equipo. La completa sigue siendo una compra nueva.',
      year: '1 año',
      popular: 'Más elegida',
      choose: 'Elegir',
      promoTitle: '¿Tienes un código promocional?',
      promoLead: 'Canjéalo y la licencia queda activa en este equipo. Cada PC puede usarlo una sola vez.',
      promoAction: 'Canjear',
      promoBusy: 'Canjeando…',
      promoNeed: 'Escribe el correo. La huella tiene que llegar desde la app.',
      promoMissing: 'Ese código no existe. Revísalo e inténtalo otra vez.',
      promoUsed: 'Este equipo ya usó ese código.',
      promoEmpty: 'Este código ya se agotó: no le quedan usos.',
      promoInvalid: 'Este código no es válido.',
      promoCovered: 'Este equipo ya tiene una licencia que cubre ese código.',
      promoDone: '¡Código canjeado!',
      promoCongrats: 'La licencia quedó activa en este equipo.',
      promoClose: 'Listo',
      promoDays: 'días',
    },
  },
  en: {
    ...shared.en,
    pages: {
      home: {
        title: 'A lighter Windows, with your approval',
        lede: 'M2 Optimizer measures the PC on the PC and only changes Windows when you accept it.',
        blocks: [
          { heading: 'Read before touching', body: 'Analysis, score and advice are in the free license. Nothing is deleted or closed without a plan you can review.' },
          { heading: 'Two annual licenses', body: 'Basic, 4.99 USD, opens startup programs and the power plan. Complete, 19.99 USD, opens temp files, recycle bin, closing apps, junk, automation and sensor widgets.' },
          { heading: 'You publish the installer', body: 'Upload M2 Optimizer Installer.exe to the same Drive URL and record the new version. On open, the app downloads that installer and opens it.' },
        ],
      },
      pricing: {
        title: 'Pricing',
        lede: 'One year from the confirmed payment. The PC fingerprint travels with the order. If you have a code, redeem it here.',
        blocks: [
          { heading: 'Basic · 4.99 USD', body: 'Analysis, read-only history, clocks, disabling startup programs and changing the power plan.' },
          { heading: 'Complete · 19.99 USD', body: 'The full catalog: temp files, recycle bin, closing apps, junk uninstall, automation, sensor widgets and game overlay.' },
        ],
      },
      help: {
        title: 'Help',
        lede: 'The app measures on the PC. This site charges the license and publishes the installer.',
        blocks: [
          { heading: 'The license does not show', body: 'Open Billing in the desktop app, finish payment and return. Settings shows the tier and the expiry.' },
          { heading: 'Sensor widgets', body: 'Clocks are in the free license. CPU, RAM, disks, network and game overlay need the complete license.' },
          { heading: 'A newer installer', body: 'When you publish a version in m2_releases, Settings offers the download. You choose when to install it.' },
        ],
      },
      terms: {
        title: 'Terms',
        lede: 'The license is annual, tied to the PC fingerprint, and does not hand Windows over to M2 Optimizer.',
        blocks: [
          { heading: 'What you buy', body: 'Basic opens only the reversible slice. Complete opens the catalog on the pricing page. Free does not write to Windows.' },
          { heading: 'Payment', body: 'PayPal charges 4.99 or 19.99 USD. The license starts when the server confirms the capture and lasts one year.' },
          { heading: 'Windows changes', body: 'Each action is shown before it is applied. M2 Optimizer does not modify security software.' },
        ],
      },
      privacy: {
        title: 'Privacy',
        lede: 'The PC analysis stays on the machine. This site stores the license, not your files.',
        blocks: [
          { heading: 'Fingerprint', body: 'It is the Windows machine id, passed through SHA-256. It is not a browser tracker.' },
          { heading: 'Payment', body: 'PayPal processes the card or balance. We store the email, tier, expiry, fingerprint and order id.' },
          { heading: 'Contact', body: 'Mail to contacto@m2dominicanrd.com arrives in that inbox.' },
        ],
      },
      contact: {
        title: 'Contact',
        lede: 'Write about licenses, the installer or how to use the app.',
        blocks: [{ heading: 'Email', body: 'contacto@m2dominicanrd.com' }],
      },
      missing: {
        title: 'Page not found',
        lede: 'That address does not exist on M2 Optimizer.',
        blocks: [{ heading: 'Next step', body: 'Go home or open Pricing if you were paying for a license.' }],
      },
    },
    pricing: {
      email: 'Email',
      device: 'PC fingerprint',
      pay: 'Pay with PayPal',
      basic: 'Basic',
      complete: 'Complete',
      missingDevice: 'Open Billing in the desktop app. The fingerprint arrives with the link.',
      paid: 'Payment confirmed. Return to the app: Settings will show the license.',
      reused: 'This purchase already has an active license. It is on this PC now, with no new charge.',
      partial: 'The active Basic license is on this PC. Complete is still a new purchase.',
      year: '1 year',
      popular: 'Most chosen',
      choose: 'Choose',
      promoTitle: 'Have a promo code?',
      promoLead: 'Redeem it and the license turns on for this PC. Each PC can use it only once.',
      promoAction: 'Redeem',
      promoBusy: 'Redeeming…',
      promoNeed: 'Enter the email. The fingerprint has to come from the app.',
      promoMissing: 'That code does not exist. Check it and try again.',
      promoUsed: 'This PC already used that code.',
      promoEmpty: 'This code is used up.',
      promoInvalid: 'This code is not valid.',
      promoCovered: 'This PC already has a license that covers that code.',
      promoDone: 'Code redeemed',
      promoCongrats: 'The license is active on this PC.',
      promoClose: 'Done',
      promoDays: 'days',
    },
  },
  fr: {
    ...shared.fr,
    pages: {
      home: {
        title: 'Un Windows plus léger, avec votre accord',
        lede: 'M2 Optimizer mesure le PC sur le PC et ne change Windows que lorsque vous l’acceptez.',
        blocks: [
          { heading: 'Lire avant de toucher', body: 'L’analyse, le score et les conseils sont dans la licence gratuite. Rien n’est effacé ni fermé sans un plan que vous pouvez relire.' },
          { heading: 'Deux licences annuelles', body: 'La basique, 4,99 USD, ouvre le démarrage et le plan d’alimentation. La complète, 19,99 USD, ouvre les fichiers temporaires, la corbeille, la fermeture d’apps, les indésirables, la routine et les widgets capteurs.' },
          { heading: 'Vous publiez l’installateur', body: 'Vous déposez M2 Optimizer Installer.exe sur la même URL Drive et notez la nouvelle version. À l’ouverture, l’app télécharge cet installateur et l’ouvre.' },
        ],
      },
      pricing: {
        title: 'Tarifs',
        lede: 'Un an à partir du paiement confirmé. L’empreinte du PC voyage avec la commande. Un code se réclame ici.',
        blocks: [
          { heading: 'Basique · 4,99 USD', body: 'Analyse, historique en lecture seule, horloges, désactivation des programmes au démarrage et plan d’alimentation.' },
          { heading: 'Complète · 19,99 USD', body: 'Tout le catalogue : fichiers temporaires, corbeille, fermeture d’apps, désinstallation des indésirables, routine, widgets capteurs et mode jeu.' },
        ],
      },
      help: {
        title: 'Aide',
        lede: 'L’app mesure sur le PC. Ce site encaisse la licence et publie l’installateur.',
        blocks: [
          { heading: 'La licence n’apparaît pas', body: 'Ouvrez Paiement dans l’app de bureau, terminez le paiement et revenez. Paramètres montre le niveau et l’échéance.' },
          { heading: 'Widgets capteurs', body: 'Les horloges sont dans la licence gratuite. CPU, RAM, disques, réseau et mode jeu demandent la licence complète.' },
          { heading: 'Nouvel installateur', body: 'Quand vous publiez une version dans m2_releases, Paramètres propose le téléchargement.' },
        ],
      },
      terms: {
        title: 'Conditions',
        lede: 'La licence est annuelle, liée à l’empreinte du PC, et ne confie pas Windows à M2 Optimizer.',
        blocks: [
          { heading: 'Ce que vous achetez', body: 'La basique ouvre seulement la partie réversible. La complète ouvre le catalogue de la page tarifs. La gratuite n’écrit pas dans Windows.' },
          { heading: 'Paiement', body: 'PayPal encaisse 4,99 ou 19,99 USD. La licence commence quand le serveur confirme la capture et dure un an.' },
          { heading: 'Changements Windows', body: 'Chaque action est montrée avant d’être appliquée. M2 Optimizer ne modifie pas les logiciels de sécurité.' },
        ],
      },
      privacy: {
        title: 'Confidentialité',
        lede: 'L’analyse du PC reste sur la machine. Ce site garde la licence, pas vos fichiers.',
        blocks: [
          { heading: 'Empreinte', body: 'C’est l’identifiant machine de Windows, passé par SHA-256. Ce n’est pas un suivi du navigateur.' },
          { heading: 'Paiement', body: 'PayPal traite la carte ou le solde. Nous gardons le courriel, le niveau, l’échéance, l’empreinte et l’id de commande.' },
          { heading: 'Contact', body: 'Un message à contacto@m2dominicanrd.com arrive dans cette boîte.' },
        ],
      },
      contact: {
        title: 'Contact',
        lede: 'Écrivez pour une licence, l’installateur ou une question d’usage.',
        blocks: [{ heading: 'Courriel', body: 'contacto@m2dominicanrd.com' }],
      },
      missing: {
        title: 'Page introuvable',
        lede: 'Cette adresse n’existe pas sur M2 Optimizer.',
        blocks: [{ heading: 'Suite', body: 'Revenez à l’accueil ou ouvrez Tarifs si vous alliez payer.' }],
      },
    },
    pricing: {
      email: 'Courriel',
      device: 'Empreinte du PC',
      pay: 'Payer avec PayPal',
      basic: 'Basique',
      complete: 'Complète',
      missingDevice: 'Ouvrez Paiement dans l’app de bureau. L’empreinte arrive avec le lien.',
      paid: 'Paiement confirmé. Revenez à l’app : Paramètres affichera la licence.',
      reused: 'Cet achat a déjà une licence en cours. Elle est sur ce PC, sans nouveau paiement.',
      partial: 'La licence basique en cours est sur ce PC. La complète reste un nouvel achat.',
      year: '1 an',
      popular: 'La plus choisie',
      choose: 'Choisir',
      promoTitle: 'Vous avez un code promo ?',
      promoLead: 'Réclamez-le et la licence s’active sur ce PC. Chaque PC ne peut l’utiliser qu’une fois.',
      promoAction: 'Réclamer',
      promoBusy: 'Réclamation…',
      promoNeed: 'Écrivez le courriel. L’empreinte doit venir de l’app.',
      promoMissing: 'Ce code n’existe pas. Vérifiez-le et réessayez.',
      promoUsed: 'Ce PC a déjà utilisé ce code.',
      promoEmpty: 'Ce code est épuisé.',
      promoInvalid: 'Ce code n’est pas valide.',
      promoCovered: 'Ce PC a déjà une licence qui couvre ce code.',
      promoDone: 'Code réclamé',
      promoCongrats: 'La licence est active sur ce PC.',
      promoClose: 'OK',
      promoDays: 'jours',
    },
  },
  pt: {
    ...shared.pt,
    pages: {
      home: {
        title: 'Um Windows mais leve, com a sua aprovação',
        lede: 'O M2 Optimizer mede o PC no próprio PC e só muda o Windows quando você aceita.',
        blocks: [
          { heading: 'Ler antes de mexer', body: 'A análise, a pontuação e os conselhos estão na licença grátis. Nada é apagado nem fechado sem um plano que você possa rever.' },
          { heading: 'Duas licenças anuais', body: 'A básica, 4,99 USD, abre a inicialização e o plano de energia. A completa, 19,99 USD, abre temporários, lixeira, fechar apps, lixo, rotina e widgets de sensores.' },
          { heading: 'Você publica o instalador', body: 'Você envia M2 Optimizer Installer.exe para a mesma URL do Drive e registra a versão nova. Ao abrir, o app baixa esse instalador e o abre.' },
        ],
      },
      pricing: {
        title: 'Preços',
        lede: 'Um ano a partir do pagamento confirmado. A impressão do PC vai com o pedido. Se tiver um código, resgate aqui.',
        blocks: [
          { heading: 'Básica · 4,99 USD', body: 'Análise, histórico só de leitura, relógios, desativar programas da inicialização e mudar o plano de energia.' },
          { heading: 'Completa · 19,99 USD', body: 'O catálogo inteiro: temporários, lixeira, fechar apps, desinstalar lixo, rotina, widgets de sensores e modo sobre os jogos.' },
        ],
      },
      help: {
        title: 'Ajuda',
        lede: 'O app mede no PC. Este site cobra a licença e publica o instalador.',
        blocks: [
          { heading: 'A licença não aparece', body: 'Abra Pagamentos no app, termine o pagamento e volte. Configurações mostra o nível e a validade.' },
          { heading: 'Widgets de sensores', body: 'Os relógios estão na licença grátis. CPU, RAM, discos, rede e o modo sobre os jogos pedem a licença completa.' },
          { heading: 'Instalador novo', body: 'Quando você publica uma versão em m2_releases, Configurações oferece o download.' },
        ],
      },
      terms: {
        title: 'Termos',
        lede: 'A licença é anual, ligada à impressão do PC, e não entrega o Windows ao M2 Optimizer.',
        blocks: [
          { heading: 'O que você compra', body: 'A básica abre só o trecho reversível. A completa abre o catálogo da página de preços. A grátis não escreve no Windows.' },
          { heading: 'Pagamento', body: 'O PayPal cobra 4,99 ou 19,99 USD. A licença começa quando o servidor confirma a captura e dura um ano.' },
          { heading: 'Mudanças no Windows', body: 'Cada ação aparece antes de ser aplicada. O M2 Optimizer não modifica software de segurança.' },
        ],
      },
      privacy: {
        title: 'Privacidade',
        lede: 'A análise do PC fica na máquina. Este site guarda a licença, não os seus arquivos.',
        blocks: [
          { heading: 'Impressão', body: 'É o identificador de máquina do Windows, passado por SHA-256. Não é um rastreio do navegador.' },
          { heading: 'Pagamento', body: 'O PayPal processa o cartão ou o saldo. Guardamos o e-mail, o nível, a validade, a impressão e o id do pedido.' },
          { heading: 'Contato', body: 'Uma mensagem para contacto@m2dominicanrd.com chega nessa caixa.' },
        ],
      },
      contact: {
        title: 'Contato',
        lede: 'Escreva sobre licenças, o instalador ou uma dúvida de uso.',
        blocks: [{ heading: 'E-mail', body: 'contacto@m2dominicanrd.com' }],
      },
      missing: {
        title: 'Página não encontrada',
        lede: 'Esse endereço não existe no M2 Optimizer.',
        blocks: [{ heading: 'Próximo passo', body: 'Volte ao início ou abra Preços se ia pagar a licença.' }],
      },
    },
    pricing: {
      email: 'E-mail',
      device: 'Impressão do PC',
      pay: 'Pagar com PayPal',
      basic: 'Básica',
      complete: 'Completa',
      missingDevice: 'Abra Pagamentos no app. A impressão chega com o link.',
      paid: 'Pagamento confirmado. Volte ao app: Configurações mostrará a licença.',
      reused: 'Esta compra já tem uma licença vigente. Ficou neste PC, sem uma nova cobrança.',
      partial: 'A licença básica vigente ficou neste PC. A completa continua sendo uma compra nova.',
      year: '1 ano',
      popular: 'Mais escolhida',
      choose: 'Escolher',
      promoTitle: 'Tem um código promocional?',
      promoLead: 'Resgate e a licença fica ativa neste PC. Cada PC só pode usar uma vez.',
      promoAction: 'Resgatar',
      promoBusy: 'Resgatando…',
      promoNeed: 'Escreva o e-mail. A impressão tem de vir do app.',
      promoMissing: 'Esse código não existe. Confira e tente de novo.',
      promoUsed: 'Este PC já usou esse código.',
      promoEmpty: 'Esse código esgotou.',
      promoInvalid: 'Esse código não é válido.',
      promoCovered: 'Este PC já tem uma licença que cobre esse código.',
      promoDone: 'Código resgatado',
      promoCongrats: 'A licença ficou ativa neste PC.',
      promoClose: 'Pronto',
      promoDays: 'dias',
    },
  },
}
