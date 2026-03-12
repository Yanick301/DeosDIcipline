// ============================================================
// i18n.js — Bilingual support FR / EN
// ============================================================

const TRANSLATIONS = {
    en: {
        // Splash
        splash_subtitle: 'Build your best self',
        // Onboarding
        onboard_title: 'Welcome to DeOs',
        onboard_p1_title: 'Track Your Habits',
        onboard_p1_body: 'Build discipline and consistency with daily habit tracking.',
        onboard_p2_title: 'Stay Notified',
        onboard_p2_body: 'Get automatic reminders so you never miss a habit.',
        onboard_p3_title: 'Measure Progress',
        onboard_p3_body: 'Visualize your streaks, scores, and achievements.',
        onboard_lang: 'Choose your language',
        onboard_notif_title: 'Enable Notifications',
        onboard_notif_body: 'We\'ll remind you automatically when it\'s time to complete each habit.',
        onboard_notif_btn: 'Allow Notifications',
        onboard_notif_skip: 'Skip',
        onboard_start: 'Get Started',
        onboard_next: 'Next',
        // Home
        good_morning: 'Good morning',
        good_afternoon: 'Good afternoon',
        good_evening: 'Good evening',
        good_night: 'Good night',
        today: 'Today',
        pending: 'Pending',
        completed: 'Completed',
        skipped_later: 'Skipped / Later',
        left: 'left',
        inspiration: '✦ Inspiration',
        no_habits_title: 'No habits yet',
        no_habits_body: 'Tap + to create your first habit',
        streak: 'Day Streak',
        done: 'Completed',
        score: 'Score',
        // Add Habit
        new_habit: 'New Habit',
        edit_habit: 'Edit Habit',
        cancel: 'Cancel',
        done_btn: 'Done',
        info: 'Info',
        name_label: 'Name',
        notes_label: 'Notes',
        reminder_label: 'Reminder',
        schedule: 'Schedule',
        icon: 'Icon',
        priority: 'Priority',
        color: 'Color',
        name_placeholder: 'Habit name',
        notes_placeholder: 'Optional description',
        days_short: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        enter_name: 'Please enter a habit name',
        pick_day: 'Pick at least one day',
        created: 'created! 🎯',
        updated: 'updated ✨',
        // Stats
        statistics: 'Statistics',
        weekly_activity: 'Weekly Activity',
        heatmap: '90-Day Heatmap',
        leaderboard: 'Leaderboard',
        badges: 'Badges',
        best_streak: 'Best Streak',
        completions: 'Completions',
        success_rate: 'Success Rate',
        no_habits_lb: 'No habits yet',
        // Detail
        completion_rate: 'Completion Rate',
        last_7_days: 'Last 7 Days',
        // Settings
        settings: 'Settings',
        notifications: 'Notifications',
        reminders: 'Reminders',
        send_test: 'Send Test Notification',
        data: 'Data',
        export: 'Export Data',
        reset: 'Reset All Data',
        about: 'About',
        language: 'Language',
        version: 'Version',
        // Toasts
        notif_on: '🔔 Notifications enabled',
        notif_off: 'Notifications off',
        notif_blocked: 'Notifications blocked — check browser settings',
        test_sent: 'Test notification sent 🔔',
        data_exported: 'Data exported 💾',
        // Modals
        delete_habit: 'Delete Habit',
        delete_confirm: 'Delete "%s"? All history will be lost.',
        delete_btn: 'Delete',
        reset_all: 'Reset Everything',
        reset_confirm: 'This will erase ALL habits and history. This cannot be undone!',
        data_cleared: 'All data cleared',
        deleted: 'deleted',
        // Milestone
        milestone_btn: 'Keep Going! 💪',
        // Nav
        home: 'Home',
        stats: 'Stats',
        add: 'Add',
        awards: 'Awards',
        profile: 'Profile',
        // Notif body
        notif_body: 'Time to complete "%s"! Stay disciplined 🔥',
    },
    fr: {
        // Splash
        splash_subtitle: 'Construis ta meilleure version',
        // Onboarding
        onboard_title: 'Bienvenue sur DeOs',
        onboard_p1_title: 'Suivez vos habitudes',
        onboard_p1_body: 'Construisez la discipline et la régularité avec un suivi quotidien.',
        onboard_p2_title: 'Restez alerté',
        onboard_p2_body: 'Recevez des rappels automatiques pour ne jamais oublier une habitude.',
        onboard_p3_title: 'Mesurez vos progrès',
        onboard_p3_body: 'Visualisez vos séries, scores et réalisations.',
        onboard_lang: 'Choisissez votre langue',
        onboard_notif_title: 'Activer les notifications',
        onboard_notif_body: 'Nous vous rappellerons automatiquement quand il est temps de commencer chaque habitude.',
        onboard_notif_btn: 'Autoriser les notifications',
        onboard_notif_skip: 'Ignorer',
        onboard_start: 'Commencer',
        onboard_next: 'Suivant',
        // Home
        good_morning: 'Bonjour',
        good_afternoon: 'Bon après-midi',
        good_evening: 'Bonsoir',
        good_night: 'Bonne nuit',
        today: "Aujourd'hui",
        pending: 'À faire',
        completed: 'Complétées',
        skipped_later: 'Ignorées / Plus tard',
        left: 'restantes',
        inspiration: '✦ Inspiration',
        no_habits_title: 'Aucune habitude',
        no_habits_body: 'Appuyez sur + pour créer votre première habitude',
        streak: 'Jours de suite',
        done: 'Complétées',
        score: 'Score',
        // Add Habit
        new_habit: 'Nouvelle habitude',
        edit_habit: 'Modifier',
        cancel: 'Annuler',
        done_btn: 'Enregistrer',
        info: 'Infos',
        name_label: 'Nom',
        notes_label: 'Notes',
        reminder_label: 'Rappel',
        schedule: 'Jours',
        icon: 'Icône',
        priority: 'Priorité',
        color: 'Couleur',
        name_placeholder: 'Nom de l\'habitude',
        notes_placeholder: 'Description optionnelle',
        days_short: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        high: 'Haute',
        medium: 'Moyenne',
        low: 'Basse',
        enter_name: 'Entrez un nom d\'habitude',
        pick_day: 'Choisissez au moins un jour',
        created: 'créée ! 🎯',
        updated: 'mise à jour ✨',
        // Stats
        statistics: 'Statistiques',
        weekly_activity: 'Activité hebdo.',
        heatmap: 'Carte 90 jours',
        leaderboard: 'Classement',
        badges: 'Réalisations',
        best_streak: 'Meilleure série',
        completions: 'Complétées',
        success_rate: 'Taux de réussite',
        no_habits_lb: 'Aucune habitude',
        // Detail
        completion_rate: 'Taux de réussite',
        last_7_days: '7 derniers jours',
        // Settings
        settings: 'Paramètres',
        notifications: 'Notifications',
        reminders: 'Rappels',
        send_test: 'Envoyer une notification test',
        data: 'Données',
        export: 'Exporter les données',
        reset: 'Réinitialiser',
        about: 'À propos',
        language: 'Langue',
        version: 'Version',
        // Toasts
        notif_on: '🔔 Notifications activées',
        notif_off: 'Notifications désactivées',
        notif_blocked: 'Notifications bloquées — vérifiez les paramètres du navigateur',
        test_sent: 'Notification test envoyée 🔔',
        data_exported: 'Données exportées 💾',
        // Modals
        delete_habit: 'Supprimer l\'habitude',
        delete_confirm: 'Supprimer "%s" ? Tout l\'historique sera perdu.',
        delete_btn: 'Supprimer',
        reset_all: 'Tout réinitialiser',
        reset_confirm: 'Cela effacera TOUTES les habitudes et l\'historique. Impossible à annuler !',
        data_cleared: 'Données effacées',
        deleted: 'supprimée',
        // Milestone
        milestone_btn: 'Continuez ! 💪',
        // Nav
        home: 'Accueil',
        stats: 'Stats',
        add: 'Ajouter',
        awards: 'Succès',
        profile: 'Profil',
        // Notif body
        notif_body: 'Il est temps de faire "%s" ! Restez discipliné 🔥',
    }
};

const i18n = {
    lang: 'en',

    init() {
        const saved = localStorage.getItem('deos_lang') || 'en';
        this.set(saved);
    },

    set(lang) {
        this.lang = TRANSLATIONS[lang] ? lang : 'en';
        localStorage.setItem('deos_lang', this.lang);
        document.documentElement.lang = this.lang;
    },

    t(key, ...replacements) {
        let str = TRANSLATIONS[this.lang]?.[key] ?? TRANSLATIONS['en']?.[key] ?? key;
        replacements.forEach(r => { str = str.replace('%s', r); });
        return str;
    },

    // Day labels (array)
    days() { return TRANSLATIONS[this.lang]?.days_short || TRANSLATIONS['en'].days_short; }
};

window.i18n = i18n;
window.TRANSLATIONS = TRANSLATIONS;
