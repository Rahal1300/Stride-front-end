// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          has_invited_you:'has invited you',
            Team: 'Team',
          Year_of_2021: 'Year of {{year}}',
            Welcome_back: 'Welcome back {{name}}! 🎉',
            Total_growth: 'Total {{percent}} growth',
            this_month: 'this month',
          WorkFlow :'Work Flow',
          projects:'Projects',
          Activity: 'Activity',
          Browse: 'Browse your projects with ease and clarity',
          Projects: 'Projects',
          Add: 'Add New Project',
          Files: 'Files',
          Oh: 'Oh no! ',
          you_don_t_have_any_projects: "It looks like you don't have any projects yet. Let's change that!",
          Add_a_New_Project: 'Add a New Project',
          My_projects: 'My projects',
          Here_s_a_list_of_all_the_projects: 'Here’s a list of all the projects',
          Estimated_End_Date: 'Estimated End Date',
          Scheduled_Meetings: 'Scheduled Meetings',
          Start_Date: 'Start Date',
          Progress: 'Progress',
          Last_meeting: 'Last Meeting',
          Days_Ago:'Days Ago',
          Projects_Invitations: "Projects Invitations",
          Here_s_a_list_of_all_the_projects_that_I_own_within_my_plan_and_my_team:'Here s a list of all the projects that I own within my plan and my team',
          View_Project:'View Project',
          External_Projects:'External Projects',
          View_Projects_invitations:'View Project Invitations',
          Add_New_Project:'Add New Project',
          Add_new_project_if_it_doesn_t_exist:"Add a new project, if it doesn't exist",
          Total:'Total',
          WorkFlow: 'WorkFlow',
          Dashboard: 'Dashboard',
          Profile: 'Profile',
          Notifications: 'Notifications',
          Settings: 'Settings',
          Help: 'Help',
          Logout: 'Logout',
          Chat_History: 'Chat History',
          Account_Billing: 'Account & Billing',
          User: 'User',
          Meeting_Room: 'Meeting Room',
          User: 'User',
          Email: 'Email',
          Role: 'Role',
          Team: 'Team',
          Status: 'Status',
          Action: 'Action',
          Meeting: 'Meeting',
          Last_week: 'Last {{week}} week',
          Total_meetings_hours: 'Total meetings Hours',
          Add_new_project: 'Add New Project',
          Add_new_project_description: 'Add new project, if it doesn\'t exist.',
          Made_with: 'Made with',
          by: 'by',
          Hello_how_can_we_help: 'Hello, how can we help?',
          Or_choose_a_category_to_quickly_find_the_help_you_need: 'Or choose a category to quickly find the help you need',
          Search_placeholder: 'Username',


          Common: 'Common',
          Most_asked_Question: 'Most asked Question',
          General_Settings_Common: 'General Settings Common',
          General_Settings_Content_Common: 'General Settings Content Common',
          Users_Common: 'Users Common',
          Users_Content_Common: 'Users Content Common',
          Personal_data_Common: 'Personal Data Common',
          Personal_data_Content_Common: 'Personal Data Content Common',
          Payment: 'Payment',
          Payments_methods_Payment: 'Payments Methods Payment',
          General_Settings_Payment: 'General Settings Payment',
          General_Settings_Content_Payment: 'General Settings Content Payment',
          Users_Payment: 'Users Payment',
          Users_Content_Payment: 'Users Content Payment',
          Personal_data_Payment: 'Personal Data Payment',
          Personal_data_Content_Payment: 'Personal Data Content Payment',
          Product_Services: 'Product & Services',
          Product_related_question: 'Product Related Question',
          General_Settings_Services: 'General Settings Services',
          General_Settings_Content_Services: 'General Settings Content Services',
          Users_Services: 'Users Services',
          Users_Content_Services: 'Users Content Services',
          Personal_data_Services: 'Personal Data Services',
          Personal_data_Content_Services: 'Personal Data Content Services',
          Personal_data_Services2: 'Personal Data Services 2',
          Personal_data_Content_Services2: 'Personal Data Content Services 2',
          Project_Infos: 'Project Infos',
          Enter_all_project_details: 'Enter all project details',
          Collaborators: 'Collaborators',
          Add_project_members: 'Add project members',
          Meetings: 'Meetings',
          Setup_meetings: 'Setup meetings',
          Documents: 'Documents',
          Upload_project_documents: 'Upload project documents',
          this_month: 'this month',
          Collaborators_List: 'Collaborators List',
          Add_team_members_and_collaborators: 'Add all team members and external collaborators who will/should participate in this project.',
          Export: 'Export',
          Add_Collaborator: 'Add collaborator',
          User: 'User',
          Email: 'Email',
          Role: 'Role',
          Team: 'Team',
          Status: 'Status',
          Action: 'Action',


          "Projects_progess": "Projects progress",
            "Add_all_project_details": "Add all of your project details in here so the workflow is accurate and all members are on the same page.",
            "Projects_Name": "Projects Name",
            "Projects_Name": "Projects Name",
            "You_must_add_a_project_name": "You must add a project name",
            "Go_and_type_in_the_project_name_in_the_correct_feild": "Go and type in the project name in the correct field.",
            "Projects_description": "Projects description",
            "The_names_John_Deo": "The name’s John Deo. I am a tireless seeker of knowledge, an occasional purveyor of wisdom, and also, coincidentally, a graphic designer. Algolia helps businesses across industries quickly create relevant, scalable, and lightning-fast search and discovery experiences.",
            "Projects_Owner": "Projects Owner",
            "Owner": "Owner",
            "Projects_Manager": "Projects Manager",
            "Manager": "Manager",
            "Projects_Website": "Projects Website",
            "www.website.com": "www.website.com",
            "Projects_Size": "Projects Size",
            "1200_Km²": "1200 Km²",
            "Departement": "Departement",
            "Departement_1": "Departement 1",
            "Departement_2": "Departement 2",
            "Departement_3": "Departement 3",
            "Detail_level": "Detail level",
            "UK": "UK",
            "USA": "USA",
            "Project_main_language": "Project main language",
            "French": "French",
            "English": "English",
            "Arabic": "Arabic",
            "Other": "Other",
            "Start_Date": "Start Date",
            "End_Date": "End Date",
            "Extend_to": "Extend to",
            "Estimated_time": "Estimated time",
            "21_working_Days": "21 working Days",
            "Company": "Company",
            "Company_name_here": "Company name here",
            "Client": "Client",
            "Admin": "Admin",
            "Project_photo": "Project photo",
            "Upload_Project_photo": "Upload Project photo",
            "Reset": "Reset",
            "Allowed_JPG_GIF_or_PNG_Max_size_of_800K": "Allowed JPG, GIF or PNG. Max size of 800K",
            "Project_Logo": "Project Logo",
            "Upload_Logo": "Upload Logo",
            "Status": "Status",
            "Active": "Active",
            "Pending_level": "Pending level",
            "Inactive": "Inactive",
            "Save_Changes": "Save Changes",
            "Cancel": "Cancel",
            Manage_meetings_frequency: 'Manage meetings frequency',
          Choose_recurrent_meetings: 'Choose the recurrent meetings and set frequency and priority',
          Schedule_repetitive_meetings: 'Schedule repetitive meetings',
          High: 'High',
          Regular: 'Regular',
          Low: 'Low',
          All_meetings: 'All meetings',
          List_of_all_prescheduled_meetings: 'List of all prescheduled meetings about this project',
          Meetings_Calendar: 'Meetings Calendar',
          All_prescheduled_meetings_are_shown_in_the_calendar: 'All prescheduled meetings are shown in the calendar so everyone is aware.',
          Total_Hours: 'Total Hours.',
          addFilesTitle :'Add files and documents here',
          uploadButton:'Upload a file',
          orDragAndDrop:'or drag and drop ',
          uploadFileType:"Upload any file type with maximum size of 200Mb",

          uploadedOnLabel:"Uploaded on",
          Download:"Download",
          Access:"Access",
          uploaded_yet:"No files have been uploaded yet.",
          Clear_All:'Clear All',
          upgradeToPremiumAlt:"Upgrade To Premium",
          Project_Name_goes_here:"Project Name goes here",
          Accept:'Accept',
          Decline:'Decline',
          No_notifications:'No notifications',
          Loading:'Loading...',
          Name:'Name',
          Actions:'Actions',
          Modify:'Modify',
          Disable:'Disable',
          Create:'Create',
          Searching_For_Teams:'Searching for Teams ...',
          Searching_For_Users:'Searching for Users ...',
          Adding_a_User:'Adding A User',

          No_teams_created_yet:'No teams Created yet',
          Select_Team:'Select Team',
          Choose_a_Team:'Choose A Team',
          Select_Role:'Select Role',
          Choose_a_Role:'Choose A Role',
          AddtoTeam:'Add to Team',
          No_users_found_Try_using_a_full_and_valid_email_address:'No users found. Try using a full and valid email address .',
          Enter_a_search_term_to_find_users:'Enter a search term to find users.',

        },
      },
      fr: {
        translation: {
          No_users_found_Try_using_a_full_and_valid_email_address:'Aucun utilisateur trouvé. Essayez d utiliser une adresse e-mail complète et valide .',
          Enter_a_search_term_to_find_users:'Entrez un terme de recherche pour trouver des utilisateurs.',

          AddtoTeam:'Ajouter à l équipe',
          Choose_a_Role:'Choisir Rôle',
          Select_Role:'Sélectionner Rôle',

          Choose_a_Team:'Choisir une équipe',
          Select_Team:'Choisis une équipe',
          Adding_a_User:'Ajout d un utilisateur',
          Searching_For_Users:'Recherche For Utilisateurs ...',

          No_teams_created_yet:' Aucune équipe créée pour linstant.',
          Searching_For_Teams:'Recherche d équipes ...',
          Create:'Créer',

          Disable:'Désactiver',
          Modify:'Modifier',
            Actions:'Actions',
            Name:'Nom',
            No_notifications:'Aucune notification',
            Loading:'Chargement...',
            Accept:'Accepter',
            Decline:'Déclin',
            has_invited_you :'vous a invité',
            Project_Infos: 'Informations sur le projet',
            Enter_all_project_details: 'Entrez tous les détails du projet',
            Collaborators: 'Collaborateurs',
            Add_project_members: 'Ajouter des membres au projet',
            Meetings: 'Réunions',
            Setup_meetings: 'Configurer des réunions',
            Documents: 'Documents',
            Upload_project_documents: 'Télécharger des documents du projet',
            Hello_how_can_we_help: 'Bonjour, comment pouvons-nous vous aider ?',
            Or_choose_a_category_to_quickly_find_the_help_you_need: 'Ou choisissez une catégorie pour trouver rapidement l\'aide dont vous avez besoin',
            Search_placeholder: 'Nom d\'utilisateur',
            Total_meetings_hours: 'Total heures de réunion',
            Meeting: 'Réunion',
            Last_week: 'La  {{week}}  dernières semaines ',
            Team: 'Équipe',
            Year_of_2021: 'Année {{year}}',
            Welcome_back: 'Bienvenue de retour {{name}} ! 🎉',
            Total_growth: 'Croissance totale de {{percent}}',
             this_month: 'ce mois-ci',
            projects:'Projet',
            WorkFlow :'Flux de travail',
            Add_new_project: 'Ajouter un nouveau projet',
            Add_new_project_description: 'Ajoutez un nouveau projet, s\'il n\'existe pas.',
            Activity: 'Activité',
            Browse: 'Parcourez vos projets avec simplicité et clarté',
            Projects: 'Projets',
            Add: 'Ajouter un nouveau projet',
            Files: 'Dossiers',
            Oh: 'Oh non !',
            you_don_t_have_any_projects: "Il semble que vous n'ayez pas encore de projets. Changeons cela !",
            Add_a_New_Project: 'Ajouter un nouveau projet',
            My_projects: 'Mes projets',
            Here_s_a_list_of_all_the_projects: 'Voici une liste de tous les projets',
            Estimated_End_Date: 'Date de fin estimée',
            Scheduled_Meetings: 'Réunions programmées',
            Start_Date: 'Date de début',
            Progress: 'Progression',
            Last_meeting: 'Dernière réunion',
            Days_Ago:'jours', 
            Projects_Invitations: "Invitations à des projets",
            Here_s_a_list_of_all_the_projects_that_I_own_within_my_plan_and_my_team:"Voici une liste de tous les projets que je possède dans mon plan et mon équipe",
            View_Project:'Voir Projet',
            External_Projects:'Projets Externes',
            View_Projects_invitations:'Voir Invitations aux Projets',
            Add_New_Project:'Ajouter Nouveau Projet',
            Add_new_project_if_it_doesn_t_exist:"Ajouter un nouveau projet, s'il n'existe pas",
            Total:'Total',
            
            WorkFlow: 'WorkFlow',
            Dashboard: 'Tableau de bord',
            Profile: 'Profil',
            Notifications: 'Notifications',
            Settings: 'Paramètres',
            Help: 'Aide',
            Logout: 'Se déconnecter',
            Chat_History: 'Historique du Chat',
            Account_Billing: 'Compte et Facturation',
            User: 'Utilisateur',
            Meeting_Room: 'Salle de Réunion',
            Calendar: 'Calendrier',
            History: 'Historique',
            Chat: 'Chat',
            User: 'Utilisateur',
            Email: 'E-mail',
            Role: 'Role',
            Team: 'Equipe',
            Status: 'Statut',
            Action: 'Action',
            Made_with: 'Créé avec',
            by: 'par',

            Common: 'Commun',
            Users_Payment: 'Utilisateurs de paiement',
             Users_Content_Payment: 'Détails et options liés aux paiements et à la facturation des utilisateurs.',
            Most_asked_Question: 'Question la plus fréquemment posée',
            General_Settings_Common: 'Paramètres généraux courants',
            General_Settings_Content_Common: 'Paramètres communs pour votre application, y compris les préférences et les configurations qui s\'appliquent à tous les utilisateurs.',
            Users_Common: 'Utilisateurs courants',
            Users_Content_Common: 'Informations et options de gestion liées aux comptes d\'utilisateur et aux rôles.',
            Personal_data_Common: 'Données personnelles courantes',
            Personal_data_Content_Common: 'Options pour voir et gérer les données personnelles, les paramètres de confidentialité et la sécurité du compte.',
            Payment: 'Paiement',
            Payments_methods_Payment: 'Méthodes de paiement',
            General_Settings_Payment: 'Paramètres de paiement généraux',
            General_Settings_Content_Payment: 'Configurations liées au paiement et paramètres de votre compte.',
            Users_Payment: 'Utilisateurs de paiement',
            Users_Content_Payment: 'Détails et options liés aux paiements et à la facturation des utilisateurs.',
            Personal_data_Payment: 'Données personnelles de paiement',
            Personal_data_Content_Payment: 'Afficher et gérer les informations personnelles de paiement et les détails de facturation.',
            Product_Services: 'Produit et services',
            Product_related_question: 'Question liée au produit',
            General_Settings_Services: 'Paramètres de services généraux',
            General_Settings_Content_Services: 'Paramètres et configurations pour les produits et services offerts.',
            Users_Services: 'Utilisateurs de services',
            Users_Content_Services: 'Détails et options liés aux interactions des utilisateurs avec les produits et services.',
            Personal_data_Services: 'Données personnelles de services',
            Personal_data_Content_Services: 'Gérer et examiner les données personnelles associées aux produits et services.',
            Personal_data_Services2: 'Données personnelles de services 2',
            Personal_data_Content_Services2: 'Détails supplémentaires et paramètres pour gérer les données personnelles en relation avec les services.',

            Collaborators_List: 'Liste des collaborateurs',
            Add_team_members_and_collaborators: 'Ajoutez tous les membres de l\'équipe et les collaborateurs externes qui participeront/doivent participer à ce projet.',
            Export: 'Exporter',
            Add_Collaborator: 'Ajouter un collaborateur',
           "Projects_progess": "Progression de projet",
            "Add_all_project_details": "Ajoutez tous les détails de votre projet ici afin que le flux de travail soit précis et que tous les membres soient sur la même page.",
            "Projects_Name": "Nom du projet",
            "You_must_add_a_project_name": "Vous devez ajouter un nom de projet",
            "Go_and_type_in_the_project_name_in_the_correct_feild": "Allez et saisissez le nom du projet dans le champ correct.",
            "Projects_description": "Description du projet",
            "The_names_John_Deo": "Je m'appelle John Deo. Je suis un chercheur inlassable de connaissances, un pourvoyeur occasionnel de sagesse et aussi, par hasard, un graphiste. Algolia aide les entreprises de tous les secteurs à créer rapidement des expériences de recherche et de découverte pertinentes, évolutives et ultra-rapides.",
            "Projects_Owner": "Propriétaire du projet",
            "Owner": "Propriétaire",
            "Projects_Manager": "Chef de projet",
            "Manager": "Chef de projet",
            "Projects_Website": "Site Web du projet",
            "www.website.com": "www.website.com",
            "Projects_Size": "Taille du projet",
            "1200_Km²": "1200 Km²",
            "Departement": "Département",
            "Departement_1": "Département 1",
            "Departement_2": "Département 2",
            "Departement_3": "Département 3",
            "Detail_level": "Niveau de détail",
            "UK": "Royaume-Uni",
            "USA": "États-Unis",
            "Project_main_language": "Langue principale du projet",
            "French": "Français",
            "English": "Anglais",
            "Arabic": "Arabe",
            "Other": "Autre",
            "Start_Date": "Date de début",
            "End_Date": "Date de fin",
            "Extend_to": "Prolonger jusqu'à",
            "Estimated_time": "Temps estimé",
            "21_working_Days": "21 jours ouvrables",
            "Company": "Entreprise",
            "Company_name_here": "Nom de l'entreprise ici",
            "Client": "Client",
            "Admin": "Admin",
            "Project_photo": "Photo du projet",
            "Upload_Project_photo": "Télécharger la photo du projet",
            "Reset": "Réinitialiser",
            "Allowed_JPG_GIF_or_PNG_Max_size_of_800K": "JPG autorisé, GIF ou PNG. Taille maximale de 800 Ko",
            "Project_Logo": "Logo du projet",
            "Upload_Logo": "Télécharger le logo",
            "Status": "Statut",
            "Active": "Actif",
            "Pending_level": "Niveau en attente",
            "Inactive": "Inactif",
            "Save_Changes": "Enregistrer les modifications",
            "Cancel": "Annuler",
            Manage_meetings_frequency: 'Gérer la fréquence des réunions',
            Choose_recurrent_meetings: 'Choisissez les réunions récurrentes et définissez la fréquence et la priorité',
            Schedule_repetitive_meetings: 'Planifier des réunions répétitives',
            High: 'Élevé',
            Regular: 'Régulier',
            Low: 'Faible',
            All_meetings: 'Toutes les réunions',
            List_of_all_prescheduled_meetings: 'Liste de toutes les réunions prévues pour ce projet',
            Meetings_Calendar: 'Calendrier des réunions',
            All_prescheduled_meetings_are_shown_in_the_calendar: 'Toutes les réunions prévues sont affichées dans le calendrier pour que tout le monde soit informé.',
            Total_Hours: 'Total Heures',
            addFilesTitle :'Ajouter des fichiers et des documents ici',
            uploadButton:'Télécharger un fichier',
            orDragAndDrop:'ou par glisser-déposer',
            uploadFileType:"Télécharger n'importe quel type de fichier d'une taille maximale de 200 Mo",
            Download:"Téléchargé ",
            Access:"Accès",
            uploaded_yet:"Aucun fichier n'a encore été téléchargé.",
            Clear_All:'Effacer tout',
            uploadedOnLabel:"Téléchargé le",
            upgradeToPremiumAlt:"Passer à la version Premium",
            Project_Name_goes_here:"Le nom du projet va ici",

        },
      },
      
      // Add more languages as needed
    },
    lng: 'en', // Set the default language
    fallbackLng: 'en', // Fallback language in case a translation is missing
    interpolation: {
      escapeValue: false, // React already escapes values by default
    },
  });

export default i18n;
