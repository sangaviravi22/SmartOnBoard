export type Language = 'English' | 'Spanish' | 'French' | 'German';

export const translations: Record<Language, Record<string, any>> = {
  English: {
    // Landing View
    landing: {
      title: 'SmartOnboard AI',
      subtitle: 'Your AI-Powered Learning Companion',
      description: 'Personalized learning paths powered by AI. Take assessments, get a customized 30-day plan, and track your progress.',
      button: 'Start Free Journey',
      features: {
        personalized: 'Personalized Learning',
        ai: 'AI Mentor',
        tracking: 'Progress Tracking'
      }
    },
    // Auth View
    auth: {
      title: 'Welcome Back',
      subtitle: 'Enter your email to get started',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      button: 'Continue',
      loading: 'Checking...',
      error: 'Please enter a valid email'
    },
    // Onboarding View
    onboarding: {
      step1: 'Select Your Role',
      step2: 'Choose Your Skills',
      step3: 'Experience Level',
      step4: 'Preferences',
      next: 'Next',
      back: 'Back',
      complete: 'Complete Onboarding',
      selectRole: 'What role are you targeting?',
      selectSkills: 'Select your skills',
      selectExperience: 'What is your experience level?',
      selectLanguage: 'Choose your language',
      roles: [
        'Frontend Engineer',
        'Backend Engineer',
        'Full Stack Developer',
        'DevOps Engineer',
        'Data Scientist',
        'Mobile Developer'
      ],
      skills: [
        'JavaScript',
        'Python',
        'Java',
        'React',
        'Vue.js',
        'Node.js',
        'Django',
        'MongoDB',
        'PostgreSQL',
        'AWS',
        'Docker',
        'Kubernetes'
      ],
      experience: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    // Assessment View
    assessment: {
      title: 'Skill Assessment',
      subtitle: 'Let\'s test your current skills',
      question: 'Question',
      of: 'of',
      selectAnswer: 'Select an answer',
      submit: 'Submit Answer',
      next: 'Next Question',
      previous: 'Previous',
      finish: 'Finish Assessment',
      loading: 'Generating assessment questions...',
      score: 'Your Score',
      maxScore: 'out of'
    },
    // Dashboard View
    dashboard: {
      welcome: 'Welcome back',
      learning: 'Learning',
      analytics: 'Analytics',
      projects: 'Projects',
      settings: 'Settings',
      support: 'Support',
      reports: 'Reports',
      logout: 'Logout',
      
      // Learning Section
      todaysLesson: 'Today\'s Lesson',
      day: 'Day',
      topic: 'Topic',
      resources: 'Resources',
      quiz: 'Daily Quiz',
      quizQuestion: 'Quiz Question',
      selectAnswer: 'Select an answer',
      submit: 'Submit Quiz',
      correct: 'Correct!',
      incorrect: 'Incorrect',
      explanation: 'Explanation',
      nextDay: 'Next Day',
      dayLocked: 'This day is locked. Complete the quiz to unlock.',
      dayCompleted: 'Completed',
      
      // Analytics Section
      overallProgress: 'Overall Progress',
      skillProficiency: 'Skill Proficiency',
      quizAccuracy: 'Quiz Accuracy',
      engagementLevel: 'Engagement Level',
      conceptMastery: 'Concept Mastery',
      totalHours: 'Total Hours',
      weeklyStreak: 'Weekly Streak',
      estimatedCompletion: 'Est. Completion',
      days: 'days',
      hours: 'h',
      complete: 'Complete',
      
      // Projects Section
      availableProjects: 'Available Projects',
      projectTitle: 'Project',
      difficulty: 'Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      submitProject: 'Submit Project',
      projectSubmission: 'Project Submission',
      enterDescription: 'Enter your project description or code',
      submit: 'Submit',
      cancel: 'Cancel',
      submissionSuccess: 'Project submitted successfully!',
      
      // Settings Modal
      language: 'Language',
      darkMode: 'Dark Mode',
      emailNotifications: 'Email Notifications',
      emailNotificationsDesc: 'Get updates on your progress',
      account: 'Account',
      email: 'Email',
      role: 'Role',
      level: 'Level',
      close: 'Close',
      
      // Support Modal
      needHelp: 'Need Help?',
      faq: 'Frequently Asked Questions',
      contactSupport: 'Contact Support',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      thankYou: 'Thank you for reaching out!',
      
      // Reports Modal
      downloadReport: 'Download Progress Report',
      shareProgress: 'Share Your Progress',
      certificates: 'Your Certificates',
      viewCertificate: 'View Certificate',
      downloadCertificate: 'Download',
      
      // AI Mentor
      mentor: 'AI Mentor',
      askQuestion: 'Ask me anything about the lesson...',
      send: 'Send',
      mentorGreeting: 'Hello! I\'m your AI mentor. How can I help you learn today?',
      
      // Notifications
      lessonCompleted: 'Lesson completed!',
      projectSubmitted: 'Project submitted!',
      settingsSaved: 'Settings saved!',
      error: 'Something went wrong',
      tryAgain: 'Try Again'
    },
    // Final Assessment
    finalAssessment: {
      title: 'Final Assessment',
      congratulations: 'Congratulations!',
      completed: 'You have successfully completed the course!',
      yourScore: 'Your Score',
      percentage: 'Percentage',
      passed: 'Passed',
      failed: 'Not Yet',
      downloadCertificate: 'Download Certificate',
      retakeAssessment: 'Retake Assessment',
      dashboard: 'Back to Dashboard'
    }
  },
  Spanish: {
    // Landing View
    landing: {
      title: 'SmartOnboard IA',
      subtitle: 'Tu Compañero de Aprendizaje Impulsado por IA',
      description: 'Rutas de aprendizaje personalizadas impulsadas por IA. Realiza evaluaciones, obtén un plan personalizado de 30 días y realiza un seguimiento de tu progreso.',
      button: 'Comenzar Viaje Gratuito',
      features: {
        personalized: 'Aprendizaje Personalizado',
        ai: 'Mentor de IA',
        tracking: 'Seguimiento de Progreso'
      }
    },
    // Auth View
    auth: {
      title: 'Bienvenido',
      subtitle: 'Ingresa tu correo electrónico para comenzar',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'tu@correo.com',
      button: 'Continuar',
      loading: 'Verificando...',
      error: 'Por favor ingresa un correo válido'
    },
    // Onboarding View
    onboarding: {
      step1: 'Selecciona Tu Rol',
      step2: 'Elige Tus Habilidades',
      step3: 'Nivel de Experiencia',
      step4: 'Preferencias',
      next: 'Siguiente',
      back: 'Atrás',
      complete: 'Completar Incorporación',
      selectRole: '¿Qué rol estás buscando?',
      selectSkills: 'Selecciona tus habilidades',
      selectExperience: '¿Cuál es tu nivel de experiencia?',
      selectLanguage: 'Elige tu idioma',
      roles: [
        'Ingeniero Frontend',
        'Ingeniero Backend',
        'Desarrollador Full Stack',
        'Ingeniero DevOps',
        'Científico de Datos',
        'Desarrollador Móvil'
      ],
      skills: [
        'JavaScript',
        'Python',
        'Java',
        'React',
        'Vue.js',
        'Node.js',
        'Django',
        'MongoDB',
        'PostgreSQL',
        'AWS',
        'Docker',
        'Kubernetes'
      ],
      experience: ['Principiante', 'Intermedio', 'Avanzado', 'Experto']
    },
    // Assessment View
    assessment: {
      title: 'Evaluación de Habilidades',
      subtitle: 'Probemos tus habilidades actuales',
      question: 'Pregunta',
      of: 'de',
      selectAnswer: 'Selecciona una respuesta',
      submit: 'Enviar Respuesta',
      next: 'Siguiente Pregunta',
      previous: 'Anterior',
      finish: 'Finalizar Evaluación',
      loading: 'Generando preguntas de evaluación...',
      score: 'Tu Puntuación',
      maxScore: 'de'
    },
    // Dashboard View
    dashboard: {
      welcome: 'Bienvenido de vuelta',
      learning: 'Aprendizaje',
      analytics: 'Analítica',
      projects: 'Proyectos',
      settings: 'Configuración',
      support: 'Soporte',
      reports: 'Reportes',
      logout: 'Cerrar Sesión',
      
      // Learning Section
      todaysLesson: 'Lección de Hoy',
      day: 'Día',
      topic: 'Tema',
      resources: 'Recursos',
      quiz: 'Quiz Diario',
      quizQuestion: 'Pregunta del Quiz',
      selectAnswer: 'Selecciona una respuesta',
      submit: 'Enviar Quiz',
      correct: '¡Correcto!',
      incorrect: 'Incorrecto',
      explanation: 'Explicación',
      nextDay: 'Siguiente Día',
      dayLocked: 'Este día está bloqueado. Completa el quiz para desbloquearlo.',
      dayCompleted: 'Completado',
      
      // Analytics Section
      overallProgress: 'Progreso General',
      skillProficiency: 'Dominio de Habilidades',
      quizAccuracy: 'Precisión del Quiz',
      engagementLevel: 'Nivel de Compromiso',
      conceptMastery: 'Dominio de Conceptos',
      totalHours: 'Horas Totales',
      weeklyStreak: 'Racha Semanal',
      estimatedCompletion: 'Finalización Est.',
      days: 'días',
      hours: 'h',
      complete: 'Completar',
      
      // Projects Section
      availableProjects: 'Proyectos Disponibles',
      projectTitle: 'Proyecto',
      difficulty: 'Dificultad',
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
      submitProject: 'Enviar Proyecto',
      projectSubmission: 'Envío de Proyecto',
      enterDescription: 'Ingresa la descripción de tu proyecto o código',
      submit: 'Enviar',
      cancel: 'Cancelar',
      submissionSuccess: '¡Proyecto enviado exitosamente!',
      
      // Settings Modal
      language: 'Idioma',
      darkMode: 'Modo Oscuro',
      emailNotifications: 'Notificaciones por Correo',
      emailNotificationsDesc: 'Recibe actualizaciones sobre tu progreso',
      account: 'Cuenta',
      email: 'Correo',
      role: 'Rol',
      level: 'Nivel',
      close: 'Cerrar',
      
      // Support Modal
      needHelp: '¿Necesitas Ayuda?',
      faq: 'Preguntas Frecuentes',
      contactSupport: 'Contactar Soporte',
      subject: 'Asunto',
      message: 'Mensaje',
      send: 'Enviar',
      thankYou: '¡Gracias por comunicarte!',
      
      // Reports Modal
      downloadReport: 'Descargar Reporte de Progreso',
      shareProgress: 'Comparte Tu Progreso',
      certificates: 'Tus Certificados',
      viewCertificate: 'Ver Certificado',
      downloadCertificate: 'Descargar',
      
      // AI Mentor
      mentor: 'Mentor de IA',
      askQuestion: 'Pregúntame algo sobre la lección...',
      send: 'Enviar',
      mentorGreeting: '¡Hola! Soy tu mentor de IA. ¿Cómo puedo ayudarte a aprender hoy?',
      
      // Notifications
      lessonCompleted: '¡Lección completada!',
      projectSubmitted: '¡Proyecto enviado!',
      settingsSaved: '¡Configuración guardada!',
      error: 'Algo salió mal',
      tryAgain: 'Intentar de Nuevo'
    },
    // Final Assessment
    finalAssessment: {
      title: 'Evaluación Final',
      congratulations: '¡Felicidades!',
      completed: '¡Has completado exitosamente el curso!',
      yourScore: 'Tu Puntuación',
      percentage: 'Porcentaje',
      passed: 'Aprobado',
      failed: 'Aún No',
      downloadCertificate: 'Descargar Certificado',
      retakeAssessment: 'Repetir Evaluación',
      dashboard: 'Volver al Panel'
    }
  },
  French: {
    // Landing View
    landing: {
      title: 'SmartOnboard IA',
      subtitle: 'Votre Compagnon d\'Apprentissage Alimenté par l\'IA',
      description: 'Des parcours d\'apprentissage personnalisés alimentés par l\'IA. Faites des évaluations, obtenez un plan personnalisé de 30 jours et suivez votre progression.',
      button: 'Commencer le Voyage Gratuit',
      features: {
        personalized: 'Apprentissage Personnalisé',
        ai: 'Mentor IA',
        tracking: 'Suivi de la Progression'
      }
    },
    // Auth View
    auth: {
      title: 'Bienvenue',
      subtitle: 'Entrez votre email pour commencer',
      emailLabel: 'Email',
      emailPlaceholder: 'votre@email.com',
      button: 'Continuer',
      loading: 'Vérification...',
      error: 'Veuillez entrer un email valide'
    },
    // Onboarding View
    onboarding: {
      step1: 'Sélectionnez Votre Rôle',
      step2: 'Choisissez Vos Compétences',
      step3: 'Niveau d\'Expérience',
      step4: 'Préférences',
      next: 'Suivant',
      back: 'Retour',
      complete: 'Terminer l\'Intégration',
      selectRole: 'Quel rôle visez-vous?',
      selectSkills: 'Sélectionnez vos compétences',
      selectExperience: 'Quel est votre niveau d\'expérience?',
      selectLanguage: 'Choisissez votre langue',
      roles: [
        'Ingénieur Frontend',
        'Ingénieur Backend',
        'Développeur Full Stack',
        'Ingénieur DevOps',
        'Scientifique des Données',
        'Développeur Mobile'
      ],
      skills: [
        'JavaScript',
        'Python',
        'Java',
        'React',
        'Vue.js',
        'Node.js',
        'Django',
        'MongoDB',
        'PostgreSQL',
        'AWS',
        'Docker',
        'Kubernetes'
      ],
      experience: ['Débutant', 'Intermédiaire', 'Avancé', 'Expert']
    },
    // Assessment View
    assessment: {
      title: 'Évaluation des Compétences',
      subtitle: 'Testons vos compétences actuelles',
      question: 'Question',
      of: 'sur',
      selectAnswer: 'Sélectionnez une réponse',
      submit: 'Soumettre la Réponse',
      next: 'Question Suivante',
      previous: 'Précédente',
      finish: 'Terminer l\'Évaluation',
      loading: 'Génération des questions d\'évaluation...',
      score: 'Votre Score',
      maxScore: 'sur'
    },
    // Dashboard View
    dashboard: {
      welcome: 'Bienvenue',
      learning: 'Apprentissage',
      analytics: 'Analytique',
      projects: 'Projets',
      settings: 'Paramètres',
      support: 'Assistance',
      reports: 'Rapports',
      logout: 'Déconnexion',
      
      // Learning Section
      todaysLesson: 'Leçon d\'Aujourd\'hui',
      day: 'Jour',
      topic: 'Sujet',
      resources: 'Ressources',
      quiz: 'Quiz Quotidien',
      quizQuestion: 'Question du Quiz',
      selectAnswer: 'Sélectionnez une réponse',
      submit: 'Soumettre le Quiz',
      correct: 'Correct!',
      incorrect: 'Incorrect',
      explanation: 'Explication',
      nextDay: 'Jour Suivant',
      dayLocked: 'Ce jour est verrouillé. Complétez le quiz pour le déverrouiller.',
      dayCompleted: 'Complété',
      
      // Analytics Section
      overallProgress: 'Progression Globale',
      skillProficiency: 'Maîtrise des Compétences',
      quizAccuracy: 'Précision du Quiz',
      engagementLevel: 'Niveau d\'Engagement',
      conceptMastery: 'Maîtrise des Concepts',
      totalHours: 'Heures Totales',
      weeklyStreak: 'Série Hebdomadaire',
      estimatedCompletion: 'Achèvement Est.',
      days: 'jours',
      hours: 'h',
      complete: 'Complet',
      
      // Projects Section
      availableProjects: 'Projets Disponibles',
      projectTitle: 'Projet',
      difficulty: 'Difficulté',
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
      submitProject: 'Soumettre le Projet',
      projectSubmission: 'Soumission de Projet',
      enterDescription: 'Entrez la description de votre projet ou le code',
      submit: 'Soumettre',
      cancel: 'Annuler',
      submissionSuccess: 'Projet soumis avec succès!',
      
      // Settings Modal
      language: 'Langue',
      darkMode: 'Mode Sombre',
      emailNotifications: 'Notifications par Email',
      emailNotificationsDesc: 'Recevez des mises à jour sur votre progression',
      account: 'Compte',
      email: 'Email',
      role: 'Rôle',
      level: 'Niveau',
      close: 'Fermer',
      
      // Support Modal
      needHelp: 'Besoin d\'Aide?',
      faq: 'Questions Fréquemment Posées',
      contactSupport: 'Contacter le Support',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer',
      thankYou: 'Merci de nous avoir contactés!',
      
      // Reports Modal
      downloadReport: 'Télécharger le Rapport de Progression',
      shareProgress: 'Partagez Votre Progression',
      certificates: 'Vos Certificats',
      viewCertificate: 'Voir le Certificat',
      downloadCertificate: 'Télécharger',
      
      // AI Mentor
      mentor: 'Mentor IA',
      askQuestion: 'Posez-moi une question sur la leçon...',
      send: 'Envoyer',
      mentorGreeting: 'Bonjour! Je suis votre mentor IA. Comment puis-je vous aider à apprendre aujourd\'hui?',
      
      // Notifications
      lessonCompleted: 'Leçon complétée!',
      projectSubmitted: 'Projet soumis!',
      settingsSaved: 'Paramètres enregistrés!',
      error: 'Une erreur s\'est produite',
      tryAgain: 'Réessayer'
    },
    // Final Assessment
    finalAssessment: {
      title: 'Évaluation Finale',
      congratulations: 'Félicitations!',
      completed: 'Vous avez terminé le cours avec succès!',
      yourScore: 'Votre Score',
      percentage: 'Pourcentage',
      passed: 'Réussi',
      failed: 'Pas Encore',
      downloadCertificate: 'Télécharger le Certificat',
      retakeAssessment: 'Reprendre l\'Évaluation',
      dashboard: 'Retour au Tableau de Bord'
    }
  },
  German: {
    // Landing View
    landing: {
      title: 'SmartOnboard KI',
      subtitle: 'Dein KI-gestützter Lernbegleiter',
      description: 'Personalisierte Lernpfade mit KI-Unterstützung. Absolvieren Sie Bewertungen, erhalten Sie einen benutzerdefinierten 30-Tage-Plan und verfolgen Sie Ihren Fortschritt.',
      button: 'Kostenlose Reise Starten',
      features: {
        personalized: 'Personalisiertes Lernen',
        ai: 'KI-Mentor',
        tracking: 'Fortschrittsverfolgung'
      }
    },
    // Auth View
    auth: {
      title: 'Willkommen',
      subtitle: 'Geben Sie Ihre E-Mail ein, um zu beginnen',
      emailLabel: 'E-Mail',
      emailPlaceholder: 'deine@email.de',
      button: 'Fortfahren',
      loading: 'Überprüfung...',
      error: 'Bitte geben Sie eine gültige E-Mail ein'
    },
    // Onboarding View
    onboarding: {
      step1: 'Wählen Sie Ihre Rolle',
      step2: 'Wählen Sie Ihre Fähigkeiten',
      step3: 'Erfahrungsstufe',
      step4: 'Einstellungen',
      next: 'Weiter',
      back: 'Zurück',
      complete: 'Onboarding Abschließen',
      selectRole: 'Welche Rolle streben Sie an?',
      selectSkills: 'Wählen Sie Ihre Fähigkeiten aus',
      selectExperience: 'Was ist Ihr Erfahrungslevel?',
      selectLanguage: 'Wählen Sie Ihre Sprache',
      roles: [
        'Frontend-Ingenieur',
        'Backend-Ingenieur',
        'Full-Stack-Entwickler',
        'DevOps-Ingenieur',
        'Datenwissenschaftler',
        'Mobile-Entwickler'
      ],
      skills: [
        'JavaScript',
        'Python',
        'Java',
        'React',
        'Vue.js',
        'Node.js',
        'Django',
        'MongoDB',
        'PostgreSQL',
        'AWS',
        'Docker',
        'Kubernetes'
      ],
      experience: ['Anfänger', 'Fortgeschrittene', 'Erweitert', 'Experte']
    },
    // Assessment View
    assessment: {
      title: 'Fähigkeitsbewertung',
      subtitle: 'Testen wir Ihre aktuellen Fähigkeiten',
      question: 'Frage',
      of: 'von',
      selectAnswer: 'Wählen Sie eine Antwort',
      submit: 'Antwort Einreichen',
      next: 'Nächste Frage',
      previous: 'Zurück',
      finish: 'Bewertung Beenden',
      loading: 'Generiere Bewertungsfragen...',
      score: 'Deine Punktzahl',
      maxScore: 'von'
    },
    // Dashboard View
    dashboard: {
      welcome: 'Willkommen zurück',
      learning: 'Lernen',
      analytics: 'Analytik',
      projects: 'Projekte',
      settings: 'Einstellungen',
      support: 'Hilfe',
      reports: 'Berichte',
      logout: 'Abmelden',
      
      // Learning Section
      todaysLesson: 'Heutige Lektion',
      day: 'Tag',
      topic: 'Thema',
      resources: 'Ressourcen',
      quiz: 'Tägliches Quiz',
      quizQuestion: 'Quiz-Frage',
      selectAnswer: 'Wählen Sie eine Antwort',
      submit: 'Quiz Einreichen',
      correct: 'Richtig!',
      incorrect: 'Falsch',
      explanation: 'Erklärung',
      nextDay: 'Nächster Tag',
      dayLocked: 'Dieser Tag ist gesperrt. Schließen Sie das Quiz ab, um ihn freizuschalten.',
      dayCompleted: 'Abgeschlossen',
      
      // Analytics Section
      overallProgress: 'Gesamtfortschritt',
      skillProficiency: 'Fähigkeitsbeherrschung',
      quizAccuracy: 'Quiz-Genauigkeit',
      engagementLevel: 'Engagement-Niveau',
      conceptMastery: 'Konzeptbeherrschung',
      totalHours: 'Gesamtstunden',
      weeklyStreak: 'Wöchentliche Serie',
      estimatedCompletion: 'Geschätzte Fertigstellung',
      days: 'Tage',
      hours: 'h',
      complete: 'Fertig',
      
      // Projects Section
      availableProjects: 'Verfügbare Projekte',
      projectTitle: 'Projekt',
      difficulty: 'Schwierigkeitsgrad',
      easy: 'Leicht',
      medium: 'Mittel',
      hard: 'Schwierig',
      submitProject: 'Projekt Einreichen',
      projectSubmission: 'Projekteinreichung',
      enterDescription: 'Geben Sie Ihre Projektbeschreibung oder Ihren Code ein',
      submit: 'Einreichen',
      cancel: 'Abbrechen',
      submissionSuccess: 'Projekt erfolgreich eingereicht!',
      
      // Settings Modal
      language: 'Sprache',
      darkMode: 'Dunkler Modus',
      emailNotifications: 'E-Mail-Benachrichtigungen',
      emailNotificationsDesc: 'Erhalten Sie Updates zu Ihrem Fortschritt',
      account: 'Konto',
      email: 'E-Mail',
      role: 'Rolle',
      level: 'Stufe',
      close: 'Schließen',
      
      // Support Modal
      needHelp: 'Benötigen Sie Hilfe?',
      faq: 'Häufig Gestellte Fragen',
      contactSupport: 'Kontakt zum Support',
      subject: 'Betreff',
      message: 'Nachricht',
      send: 'Senden',
      thankYou: 'Danke, dass Sie uns kontaktiert haben!',
      
      // Reports Modal
      downloadReport: 'Fortschrittsbericht Herunterladen',
      shareProgress: 'Teilen Sie Ihren Fortschritt',
      certificates: 'Ihre Zertifikate',
      viewCertificate: 'Zertifikat Anzeigen',
      downloadCertificate: 'Herunterladen',
      
      // AI Mentor
      mentor: 'KI-Mentor',
      askQuestion: 'Stellen Sie mir eine Frage zur Lektion...',
      send: 'Senden',
      mentorGreeting: 'Hallo! Ich bin dein KI-Mentor. Wie kann ich dir heute beim Lernen helfen?',
      
      // Notifications
      lessonCompleted: 'Lektion abgeschlossen!',
      projectSubmitted: 'Projekt eingereicht!',
      settingsSaved: 'Einstellungen gespeichert!',
      error: 'Etwas ist schief gelaufen',
      tryAgain: 'Nochmal Versuchen'
    },
    // Final Assessment
    finalAssessment: {
      title: 'Abschließende Bewertung',
      congratulations: 'Glückwunsch!',
      completed: 'Sie haben den Kurs erfolgreich abgeschlossen!',
      yourScore: 'Ihre Punktzahl',
      percentage: 'Prozentsatz',
      passed: 'Bestanden',
      failed: 'Noch Nicht',
      downloadCertificate: 'Zertifikat Herunterladen',
      retakeAssessment: 'Bewertung Wiederholen',
      dashboard: 'Zurück zum Dashboard'
    }
  }
};

export function useTranslation(language: Language) {
  return translations[language] || translations.English;
}
