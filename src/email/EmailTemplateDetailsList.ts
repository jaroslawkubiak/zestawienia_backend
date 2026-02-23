import { EmailTemplateMap } from './types/EmailTemplateMap.type';

export const EmailTemplateDetailsList = {
  clientWelcome: {
    audience: 'client',
    templateName: 'clientWelcome',
    HTMLHeader: 'Inwestycja',
    emailSubject: (setName: string, createdAt: string) =>
      `Inwestycja: ${setName} utworzona w dniu ${createdAt}`,
    message: () => 'Przesyłamy link do inwestycji',
  },

  clientInfo: {
    audience: 'client',
    templateName: 'clientInfo',
    HTMLHeader: 'Informacja',
    emailSubject: (setName: string, createdAt: string) =>
      `Informacja: ${setName} utworzona w dniu ${createdAt}`,
    message: () => 'Przesyłamy nowe informacje o inwestycji',
  },

  supplierOffer: {
    audience: 'supplier',
    templateName: 'supplierOffer',
    HTMLHeader: 'Oferta',
    emailSubject: () => `Oferta`,
    message: () =>
      'Prosimy o przygotowanie oferty, poniżej załączamy link do zestawienia',
  },

  supplierOrder: {
    audience: 'supplier',
    templateName: 'supplierOrder',
    HTMLHeader: 'Zamówienie',
    emailSubject: () => `Zamówienie`,
    message: ({
      client,
    }) => `Proszę o realizację zamówienia zgodnie z przesłanym zestawieniem.

Prosimy o wystawienie proformy na poniższe dane:
${client?.firstName} ${client?.lastName}
${client?.company}
`,
  },
} satisfies EmailTemplateMap;
