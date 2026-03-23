import { EmailTemplateMap } from './types/EmailTemplateMap.type';

function HTMLLinkToSet(link: string): string {
  return `<a href="${link}" target="_blank" style='color: #3bbfa1; text-decoration:none; font-weight:bold; cursor: pointer;'>Link do panelu.</a>`;
}
export const EmailTemplateDetailsList = {
  clientFunctionalLayout: {
    audience: 'client',
    templateName: 'clientFunctionalLayout',
    HTMLHeader: 'Układy funkcjonalne',
    emailSubject: (setName: string) => `Układy funkcjonalne: ${setName}`,
    message: ({
      linkToSet,
    }) => `Załączamy w panelu klienta w zakładce <strong>Załączniki -> Układy funkcjonalne</strong> 
przygotowane przez nas warianty układów funkcjonalnych Inwestycji. ${HTMLLinkToSet(linkToSet)}

Każdy z nich pokazuje nieco inne podejście do organizacji przestrzeni i możliwych rozwiązań
aranżacyjnych.

Przy opracowywaniu układów staraliśmy się uwzględnić Twoje/Wasze oczekiwania opisane w
ankiecie preferencji klienta, zasady ergonomii oraz zaproponować ciekawe i funkcjonalne
rozwiązania. Poszczególne warianty można traktować elastycznie — wybrane elementy mogą być
ze sobą łączone, przenoszone pomiędzy układami lub dalej modyfikowane.

Prosimy o dokładne zapoznanie się ze wszystkimi wariantami.

Finalny układ funkcjonalny wybierzemy wspólnie podczas spotkania na żywo, kiedy będziemy
mogli dokładnie omówić każdą z propozycji i wypracować najlepsze rozwiązanie dla całej
przestrzeni.

Kolejnym etapem po analizie układów funkcjonalnych będzie przygotowanie modelu 3D wnętrza.
`,
  },
  clientMoodboard: {
    audience: 'client',
    templateName: 'clientMoodboard',
    HTMLHeader: 'Moodboardy',
    emailSubject: (setName: string) => `Moodboardy: ${setName} `,
    message: ({
      linkToSet,
    }) => `Załączamy w panelu klienta w zakładce <strong>Załączniki -> Moodboardy</strong> przygotowane przez nas
moodboardy inspiracyjne. ${HTMLLinkToSet(linkToSet)}

Są one swego rodzaju „mapą myśli” projektu - w formie kolażu zdjęć przedstawiają możliwe
kierunki stylistyczne dla poszczególnych pomieszczeń oraz wybrane detale. Pokazują potencjalną
kolorystykę, materiały, faktury, przykładowe rozwiązania oraz ogólny klimat i charakter wnętrza.

Moodboardy traktujemy jako narzędzie inspiracyjne, które pomaga określić kierunek estetyczny
projektu. Nie przedstawiają one dosłownie przyszłego wnętrza - czasami kluczowy jest jeden detal,
materiał czy kolor. Moodboardy powstały na podstawie analizy ankiety preferencji klienta oraz
przesłanych przez Ciebie/Was inspiracji, a ich głównym celem jest uchwycenie atmosfery, stylu,
kolorystyki, które mogą stać się punktem wyjścia do dalszego etapu projektowego.

Prosimy o dokładne zapoznanie się z przygotowanymi inspiracjami. Podczas naszego spotkania na
żywo szczegółowo je omówimy - będziemy pytać o elementy, które szczególnie Tobie/Wam
odpowiadają oraz te, które są mniej bliskie. Każda taka informacja pozwoli nam jeszcze lepiej
dopasować projekt do Waszych potrzeb.

Kolejnym etapem po analizie moodboardów będzie przygotowanie modelu 3D wnętrza`,
  },
  clientInvoice: {
    audience: 'client',
    templateName: 'clientInvoice',
    HTMLHeader: 'Faktury',
    emailSubject: (setName: string) => `Faktury: ${setName} `,
    message: ({
      linkToSet,
    }) => `Załączamy w panelu klienta w zakładce <strong>Załączniki -> Faktury</strong> dokument - fakturę/proformę do
opłacenia. ${HTMLLinkToSet(linkToSet)}

Będziemy wdzięczni za jej terminowe uregulowanie.

Uprzejmie prosimy również o krótką informację zwrotną po dokonaniu płatności lub o przesłanie
potwierdzenia przelewu, co pozwoli nam sprawnie kontynuować kolejne etapy prac projektowych.
`,
  },
  clientModel3d: {
    audience: 'client',
    templateName: 'clientModel3d',
    HTMLHeader: 'Model 3D',
    emailSubject: (setName: string) => `Model 3D: ${setName} `,
    message: ({
      linkToSet,
    }) => `Załączamy w panelu klienta w zakładce <strong>Załączniki -> Model 3D</strong> przygotowane przez nas warianty
modelu 3D dla projektowanego wnętrza. ${HTMLLinkToSet(linkToSet)}

Każdy z nich pokazuje nieco inne podejście do organizacji przestrzeni i możliwych rozwiązań
aranżacyjnych.

Przy opracowywaniu modelu 3D staraliśmy się uwzględnić Twoje/Wasze oczekiwania po wyborze
najkorzystniejszego układu funkcjonalnego oraz omówionych inspiracji, stylu, kolorystyki,
uwzględniliśmy również zasady ergonomii oraz zaproponowaliśmy ciekawe i funkcjonalne
rozwiązania. Poszczególne warianty można traktować elastycznie — wybrane elementy mogą być
ze sobą łączone, przenoszone pomiędzy wariantami modelu 3D lub dalej modyfikowane.

Prosimy o dokładne zapoznanie się ze wszystkimi wariantami.

Finalny wariant modelu 3D wybierzemy wspólnie podczas spotkania na żywo, kiedy będziemy
mogli dokładnie omówić każdą z propozycji i wypracować najlepsze rozwiązanie dla całej
przestrzeni.

Uwaga!

Na tym etapie skupiamy się przede wszystkim na formie, proporcjach oraz organizacji przestrzeni,
dlatego model pokazuje głównie bryłę i układ poszczególnych elementów.

Model 3D jest dla nas narzędziem roboczym, które pozwala na szybkie wprowadzanie zmian i
dopracowywanie koncepcji. Nie oddaje on natomiast docelowej kolorystyki, materiałów ani faktur
- te elementy dobierzemy wspólnie na kolejnym etapie - wspólnie tworząc materialboard (zestaw
fizycznych próbek materiałów do przyszłego wnętrza).

Materiały, kolory i wykończenia omówimy podczas spotkania na żywo, ponieważ tylko w ten
sposób możemy świadomie i precyzyjnie dopasować je do całego wnętrza oraz stworzyć spójną,
dopracowaną kompozycję.

Kolejnym etapem po analizie modeli 3D będzie przygotowanie fotorealistycznych wizualizacji
wnętrza.
`,
  },
  clientSet: {
    audience: 'client',
    templateName: 'clientSet',
    HTMLHeader: 'Zestawienie',
    emailSubject: (setName: string) => `Zestawienie: ${setName} `,
    message: ({
      linkToSet,
    }) => `Załączamy w panelu klienta w zakładce <strong>Załączniki -> Zestawienie</strong> przygotowane przez nas
zestawienie produktowe dla projektowanego wnętrza. ${HTMLLinkToSet(linkToSet)}

Dokument został podzielony na zakładki odpowiadające grupom produktowym, a pierwsza
zakładka zawiera legendę - prosimy o zapoznanie się z nią, co ułatwi poruszanie się po całym
zestawieniu.

W zestawieniu znajdują się wszystkie produkty przewidziane do projektu, wraz ze szczegółowym
opisem, ilością, ceną, linkiem do strony producenta oraz kontaktem do dystrybutora/dostawcy.

Umieściliśmy również możliwe zamienniki produktów - nie wliczają się one do sumy całkowitej
projektu, ale mogą posłużyć jako alternatywa przy wyborze.

Prosimy o dokładną analizę zestawienia, aby możliwy był ostateczny wybór każdego z produktów.
Przy każdym elemencie panel umożliwia dodanie komentarza, co ułatwi nam wspólne omówienie
decyzji zakupowych.
`,
  },
  clientInspirations: {
    audience: 'client',
    templateName: 'clientInspirations',
    HTMLHeader: 'Inspiracje',
    emailSubject: (setName: string) => `Inspiracje: ${setName} `,
    message: ({
      linkToSet,
    }) => `Prosimy o umieszczenie inspiracji dotyczących projektowanego wnętrza w panelu klienta w
zakładce <strong>Załączniki -> Inspiracje</strong> - mogą to być zdjęcia znalezione w internecie, screeny itp., lub
dostęp do tablicy Pinterest (w tym wypadku drogą mailową). ${HTMLLinkToSet(linkToSet)}

Wraz z wypełnioną ankietą umożliwi nam to pełniejsze zrozumienie Twoich/Waszych oczekiwań i
preferencji oraz pozwoli przygotować projekt wnętrza zgodny z wizją, stylem i funkcjonalnymi
potrzebami. Im więcej inspiracji otrzymamy, tym łatwiej będzie nam uchwycić charakter i
atmosferę przestrzeni, którą wspólnie tworzymy. W późniejszym etapie podzielimy się również
naszymi inspiracjami w moodboardach inspiracyjnych.
`,
  },
  clientDrawings: {
    audience: 'client',
    templateName: 'clientDrawings',
    HTMLHeader: 'Rysunki techniczne',
    emailSubject: (setName: string) => `Rysunki techniczne: ${setName} `,
    message: ({
      linkToSet,
    }) => `Załączamy w panelu klienta w zakładce <strong>Załączniki -> Rysunki techniczne</strong> przygotowane przez
nas rysunki techniczne dla projektowanego wnętrza. ${HTMLLinkToSet(linkToSet)}

Są to szczegółowe opracowania niezbędne do realizacji projektu, obejmujące m.in. instalacje
elektryczne, hydrauliczne, rozkład płytek, zabudowy meblowe oraz inne kluczowe elementy.

Dokumentacja zawiera wszystkie niezbędne informacje, takie jak wymiary, ilości, materiały oraz
wytyczne wykonawcze. Rysunki stanowią podstawę pracy dla ekip realizacyjnych i będą pomocne
na każdym etapie wykonawczym.

Rekomendujemy przekazanie ich wszystkim wykonawcom - zarówno w wersji cyfrowej, jak i
wydrukowanej, aby zapewnić sprawną i zgodną z projektem realizację.
`,
  },
  clientVisualizations: {
    audience: 'client',
    templateName: 'clientVisualizations',
    HTMLHeader: 'Wizualizacje',
    emailSubject: (setName: string) => `Wizualizacje: ${setName} `,
    message: ({
      linkToSet,
    }) => `Załączamy w panelu klienta w zakładce <strong>Załączniki -> Wizualizacje</strong> przygotowane przez nas
fotorealistyczne wizualizacje dla projektowanego wnętrza. ${HTMLLinkToSet(linkToSet)}

Mają one charakter fotorealistyczny i w możliwie najpełniejszy sposób pokazują docelowy wygląd
przestrzeni, jej klimat oraz założenia estetyczne.

Wizualizacje przygotowujemy z dużą starannością, aby jak najlepiej oddać przyszłe wnętrze, jednak
prosimy pamiętać, że nie odwzorowują one w 100% rzeczywistych kolorów i materiałów (m.in. ze
względu na różnice w wyświetlaniu obrazu na ekranach). Ostateczna kolorystyka i dobór
materiałów zostały ustalone na podstawie naszego spotkania, podczas którego tworzyliśmy
materialboard — to on najwierniej oddaje docelową wizję wnętrza.
`,
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
