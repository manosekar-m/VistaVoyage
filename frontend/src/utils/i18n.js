import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home', packages: 'Packages', wishlist: 'Wishlist',
        myBookings: 'My Bookings', profile: 'Profile', login: 'Login',
        register: 'Register', logout: 'Logout', feedback: 'Feedback',
      },
      home: {
        hero: 'Discover Your Next Adventure',
        sub: 'Explore breathtaking destinations across India and beyond.',
        cta: 'Explore Packages',
      },
      packages: {
        title: 'Explore Packages', search: 'Search destinations...', book: 'Book Now',
        duration: 'Duration', price: 'Price',
      },
      booking: {
        title: 'Book Package', travelDate: 'Travel Date', adults: 'Adults',
        children: 'Children', promoCode: 'Promo Code', apply: 'Apply',
        pay: 'Pay & Book', processing: 'Processing...',
      },
      common: {
        loading: 'Loading...', error: 'Something went wrong.', save: 'Save', cancel: 'Cancel',
      },
    },
  },
  hi: {
    translation: {
      nav: {
        home: 'होम', packages: 'पैकेज', wishlist: 'विशलिस्ट',
        myBookings: 'मेरी बुकिंग', profile: 'प्रोफाइल', login: 'लॉगिन',
        register: 'रजिस्टर', logout: 'लॉगआउट', feedback: 'फीडबैक',
      },
      home: {
        hero: 'अपना अगला एडवेंचर खोजें',
        sub: 'भारत और उससे परे के लुभावने गंतव्यों का अन्वेषण करें।',
        cta: 'पैकेज देखें',
      },
      packages: {
        title: 'पैकेज देखें', search: 'डेस्टिनेशन खोजें...', book: 'अभी बुक करें',
        duration: 'अवधि', price: 'मूल्य',
      },
      booking: {
        title: 'पैकेज बुक करें', travelDate: 'यात्रा तिथि', adults: 'वयस्क',
        children: 'बच्चे', promoCode: 'प्रोमो कोड', apply: 'लागू करें',
        pay: 'भुगतान करें और बुक करें', processing: 'प्रोसेसिंग...',
      },
      common: {
        loading: 'लोड हो रहा है...', error: 'कुछ गलत हुआ।', save: 'सहेजें', cancel: 'रद्द करें',
      },
    },
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil', packages: 'Forfaits', wishlist: 'Favoris',
        myBookings: 'Mes Réservations', profile: 'Profil', login: 'Connexion',
        register: "S'inscrire", logout: 'Déconnexion', feedback: 'Retour',
      },
      home: {
        hero: 'Découvrez Votre Prochaine Aventure',
        sub: 'Explorez des destinations époustouflantes en Inde et au-delà.',
        cta: 'Explorer les Forfaits',
      },
      packages: {
        title: 'Explorer les Forfaits', search: 'Rechercher des destinations...', book: 'Réserver',
        duration: 'Durée', price: 'Prix',
      },
      booking: {
        title: 'Réserver le Forfait', travelDate: 'Date de voyage', adults: 'Adultes',
        children: 'Enfants', promoCode: 'Code Promo', apply: 'Appliquer',
        pay: 'Payer et Réserver', processing: 'Traitement en cours...',
      },
      common: {
        loading: 'Chargement...', error: "Quelque chose s'est mal passé.", save: 'Enregistrer', cancel: 'Annuler',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('vv_lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
