import { EmailTemplateMap } from './types/EmailTemplateMap.type';

export const EmailTemplateDetailsList = {
  clientWelcome: {
    audience: 'client',
    templateName: 'clientWelcome',
    HTMLHeader: 'Projekt aranżacji wnętrza',
    emailSubject: (setName: string) => `Projekt aranżacji wnętrza: ${setName}`,
    message: () => 'Przesyłamy link do inwestycji',
  },

  clientInfo: {
    audience: 'client',
    templateName: 'clientInfo',
    HTMLHeader: 'Informacja',
    emailSubject: (setName: string) => `Informacja: ${setName} `,
    message: () => 'Przesyłamy nowe informacje o inwestycji',
  },

  supplierOffer: {
    audience: 'supplier',
    templateName: 'supplierOffer',
    HTMLHeader: 'Oferta',
    emailSubject: (setName: string) => `Oferta: ${setName} `,
    message: () =>
      'Prosimy o przygotowanie oferty, poniżej załączamy link do zestawienia',
  },

  supplierOrder: {
    audience: 'supplier',
    templateName: 'supplierOrder',
    HTMLHeader: 'Zamówienie',
    emailSubject: (setName: string) => `Zamówienie: ${setName} `,
    message: ({
      client,
    }) => `Proszę o realizację zamówienia zgodnie z przesłanym zestawieniem.

Prosimy o wystawienie proformy na poniższe dane:
${client?.firstName} ${client?.lastName}
${client?.company}
`,
  },
} satisfies EmailTemplateMap;
