// Config and global variables

// Check if preferences are already loaded
if(typeof(evf_configfile_loaded) == 'undefined'){
    /* VF User Id */
    var vfUid = false;
    
    /* Debug mode */
    var evf_debug = true;
    
    /* Preferences names */
    var evf_prefs_name = new Array( 'eVF_server', 'evf1_color_alert', 'evf_current_option_page', 'evf_menu_links_catjson', 'evf_menu_links_json', 'evf_menu_display', 'evf_menu_fixed', 'evf_logo', 'evf_stocks', 'evf_magic_help', 'evf_notes', 'evf_menu_custom_links',
                                'gar_gar', 'gar_def', 'gar_tac', 'gar_pla', 'gar_mar', 'gar_pui', 'gar_pas', 'gar_tec', 'gar_vit', 'gar_att', 'gar_end', 'gar_age', 'gar_ngl', 'gar_pot',
                                'dlc_gar', 'dlc_def', 'dlc_tac', 'dlc_pla', 'dlc_mar', 'dlc_pui', 'dlc_pas', 'dlc_tec', 'dlc_vit', 'dlc_att', 'dlc_end', 'dlc_age', 'dlc_ngl', 'dlc_pot',
                                'dld_gar', 'dld_def', 'dld_tac', 'dld_pla', 'dld_mar', 'dld_pui', 'dld_pas', 'dld_tec', 'dld_vit', 'dld_att', 'dld_end', 'dld_age', 'dld_ngl', 'dld_pot',
                                'dlg_gar', 'dlg_def', 'dlg_tac', 'dlg_pla', 'dlg_mar', 'dlg_pui', 'dlg_pas', 'dlg_tec', 'dlg_vit', 'dlg_att', 'dlg_end', 'dlg_age', 'dlg_ngl', 'dlg_pot',
                                'dfc_gar', 'dfc_def', 'dfc_tac', 'dfc_pla', 'dfc_mar', 'dfc_pui', 'dfc_pas', 'dfc_tec', 'dfc_vit', 'dfc_att', 'dfc_end', 'dfc_age', 'dfc_ngl', 'dfc_pot',
                                'dfd_gar', 'dfd_def', 'dfd_tac', 'dfd_pla', 'dfd_mar', 'dfd_pui', 'dfd_pas', 'dfd_tec', 'dfd_vit', 'dfd_att', 'dfd_end', 'dfd_age', 'dfd_ngl', 'dfd_pot',
                                'dfg_gar', 'dfg_def', 'dfg_tac', 'dfg_pla', 'dfg_mar', 'dfg_pui', 'dfg_pas', 'dfg_tec', 'dfg_vit', 'dfg_att', 'dfg_end', 'dfg_age', 'dfg_ngl', 'dfg_pot',
                                'mdc_gar', 'mdc_def', 'mdc_tac', 'mdc_pla', 'mdc_mar', 'mdc_pui', 'mdc_pas', 'mdc_tec', 'mdc_vit', 'mdc_att', 'mdc_end', 'mdc_age', 'mdc_ngl', 'mdc_pot',
                                'mdd_gar', 'mdd_def', 'mdd_tac', 'mdd_pla', 'mdd_mar', 'mdd_pui', 'mdd_pas', 'mdd_tec', 'mdd_vit', 'mdd_att', 'mdd_end', 'mdd_age', 'mdd_ngl', 'mdd_pot',
                                'mdg_gar', 'mdg_def', 'mdg_tac', 'mdg_pla', 'mdg_mar', 'mdg_pui', 'mdg_pas', 'mdg_tec', 'mdg_vit', 'mdg_att', 'mdg_end', 'mdg_age', 'mdg_ngl', 'mdg_pot',
                                'moc_gar', 'moc_def', 'moc_tac', 'moc_pla', 'moc_mar', 'moc_pui', 'moc_pas', 'moc_tec', 'moc_vit', 'moc_att', 'moc_end', 'moc_age', 'moc_ngl', 'moc_pot',
                                'mod_gar', 'mod_def', 'mod_tac', 'mod_pla', 'mod_mar', 'mod_pui', 'mod_pas', 'mod_tec', 'mod_vit', 'mod_att', 'mod_end', 'mod_age', 'mod_ngl', 'mod_pot',
                                'mog_gar', 'mog_def', 'mog_tac', 'mog_pla', 'mog_mar', 'mog_pui', 'mog_pas', 'mog_tec', 'mog_vit', 'mog_att', 'mog_end', 'mog_age', 'mog_ngl', 'mog_pot',
                                'asc_gar', 'asc_def', 'asc_tac', 'asc_pla', 'asc_mar', 'asc_pui', 'asc_pas', 'asc_tec', 'asc_vit', 'asc_att', 'asc_end', 'asc_age', 'asc_ngl', 'asc_pot',
                                'asd_gar', 'asd_def', 'asd_tac', 'asd_pla', 'asd_mar', 'asd_pui', 'asd_pas', 'asd_tec', 'asd_vit', 'asd_att', 'asd_end', 'asd_age', 'asd_ngl', 'asd_pot',
                                'asg_gar', 'asg_def', 'asg_tac', 'asg_pla', 'asg_mar', 'asg_pui', 'asg_pas', 'asg_tec', 'asg_vit', 'asg_att', 'asg_end', 'asg_age', 'asg_ngl', 'asg_pot',
                                'atc_gar', 'atc_def', 'atc_tac', 'atc_pla', 'atc_mar', 'atc_pui', 'atc_pas', 'atc_tec', 'atc_vit', 'atc_att', 'atc_end', 'atc_age', 'atc_ngl', 'atc_pot',
                                'atd_gar', 'atd_def', 'atd_tac', 'atd_pla', 'atd_mar', 'atd_pui', 'atd_pas', 'atd_tec', 'atd_vit', 'atd_att', 'atd_end', 'atd_age', 'atd_ngl', 'atd_pot',
                                'atg_gar', 'atg_def', 'atg_tac', 'atg_pla', 'atg_mar', 'atg_pui', 'atg_pas', 'atg_tec', 'atg_vit', 'atg_att', 'atg_end', 'atg_age', 'atg_ngl', 'atg_pot' );
    
    /* Preferences default values */
    var evf_prefs_default = new Array( 0, '#ff0000', 1, 0, 0, 1, 1, 'bXljb25zb2xlKCJlVkYgqSAyMDEyIExhdXJlbnQgRG9yaWVyIChhbGlhcyBMb2xvIElyaWUpIik7', 0, 0, 1, 0,
                                    5, 32, 10, 32, 32, 32, 32, 32, 32, 32, 32, 10, 1, 40, //gar_
                                    100, 5, 5, 5, 5, 10, 32, 32, 32, 32, 10, 1, 40, 10, // dlc_
                                    100, 5, 5, 5, 5, 10, 32, 32, 32, 32, 10, 1, 40, 10,
                                    100, 5, 5, 5, 5, 10, 32, 32, 32, 32, 10, 1, 40, 10,
                                    100, 5, 5, 5, 5, 10, 32, 32, 32, 32, 10, 1, 40, 10, //dfc_
                                    100, 5, 5, 5, 5, 10, 32, 32, 32, 32, 10, 1, 40, 10,
                                    100, 5, 5, 5, 5, 10, 32, 32, 32, 32, 10, 1, 40, 10,
                                    100, 10, 32, 32, 32, 10, 10, 32, 32, 32, 10, 1, 40, 10, // mdc_
                                    100, 10, 32, 32, 32, 10, 10, 32, 32, 32, 10, 1, 40, 10,
                                    100, 10, 32, 32, 32, 10, 10, 32, 32, 32, 10, 1, 40, 10,
                                    100, 32, 32, 32, 32, 10, 10, 10, 32, 10, 10, 1, 40, 10, // moc_
                                    100, 32, 32, 32, 32, 10, 10, 10, 32, 10, 10, 1, 40, 10,
                                    100, 32, 32, 32, 32, 10, 10, 10, 32, 10, 10, 1, 40, 10,
                                    100, 32, 32, 32, 32, 32, 10, 32, 32, 10, 10, 1, 40, 10, // asc_
                                    100, 32, 32, 32, 32, 32, 10, 32, 32, 10, 10, 1, 40, 10, 
                                    100, 32, 32, 32, 32, 32, 10, 32, 32, 10, 10, 1, 40, 10,
                                    100, 32, 32, 32, 32, 32, 32, 10, 10, 10, 10, 1, 40, 10, // atc_
                                    100, 32, 32, 32, 32, 32, 32, 10, 10, 10, 10, 1, 40, 10, 
                                    100, 32, 32, 32, 32, 32, 32, 10, 10, 10, 10, 1, 40, 10 );
    
    /* Global variables or objects */
    var eVF_prefs = new Object();
    /* Global object for the shop */
    var eVF_stocks = new Object();
    
    /* Use (or not) Web Server to store VF infos */
    var eVF_server = 0;
    var eVF_serverToUrl = 'http://localhost:8080/evf_base/index.php';
    var eVF_vfUid = 0;
    
    /* Poste codes */
    var evf_poste_codes = {
        gar: 'Gardien',
        dlc: 'Libéro central',
        dld: 'Libéro (droite)',
        dlg: 'Libéro (gauche)',
        dfc: 'Defenseur central',
        dfd: 'Latéral droit',
        dfg: 'Latéral gauche',
        mdc: 'Milieu defensif central',
        mdd: 'Milieu defensif (droite)',
        mdg: 'Milieu defensif (gauche)',
        moc: 'Milieu offensif central',
        mog: 'Milieu offensif gauche',
        mod: 'Milieu offensif droit',
        asc: 'Attaquant soutien central',
        asd: 'Attaquant soutien (droite)',
        asg: 'Attaquant soutien central',
        atc: 'Attaquant de pointe central',
        atg: 'Ailier gauche',
        atd: 'Ailier droit'
    }
    
    /* Nbr postes */
    var evf_nbr_postes = evf_poste_codes.length;
    
    /* Player params */
    var evf_players_params = {
        age: 'Age',
        gar: 'Gardien',
        def: 'Défense',
        tac: 'Tacle',
        pla: 'Placement',
        mar: 'Marquage',
        pui: 'Puissance',
        pas: 'Passe',
        tec: 'Technique',
        vit: 'Vitesse',
        att: 'Attaquant',
        end: 'Endurance',
        ngl: 'Note globale',
        pot: 'Potentiel'
    }
    
    /* Player min/max params */
    var evf_players_params_minmax = {
        age: [17,90],
        gar: [0,100],
        def: [0,100],
        tac: [0,100],
        pla: [0,100],
        mar: [0,100],
        pui: [0,100],
        pas: [0,100],
        tec: [0,100],
        vit: [0,100],
        att: [0,100],
        end: [0,100],
        ngl: [0,100],
        pot: [0,100]
    }
    
    /* Nbr player params */
    var evf_nbr_player_params = evf_players_params.length;

    /* Var to check if this file was already loaded */
    var evf_configfile_loaded = true;
    
    /* Menu links */
    var vf_links_categories = {
        0:{
            id: 'entente',
            order: 1,
            label: 'Entente',
            displayed: 1
        },
        1:{
            id: 'home',
            order: 2,
            label: 'Divers',
            displayed: 1
        },
        2:{
            id: 'transferts',
            order: 3,
            label: 'Transferts',
            displayed: 1
        },
        3:{
            id: 'staff',
            order: 4,
            label: 'Staff',
            displayed: 1
        },
        4:{
            id: 'presse',
            order: 5,
            label: 'Presse',
            displayed: 1
        },
        5:{
            id: 'joueurs',
            order: 6,
            label: 'Joueurs',
            displayed: 1
        },
        6:{
            id: 'training',
            order: 7,
            label: 'Entrainement',
            displayed: 1
        },
        7:{
            id: 'formation',
            order: 1,
            label: 'Centre de formation',
            displayed: 1
        },
        8:{
            id: 'stade',
            order: 9,
            label: 'Stade',
            displayed: 1
        },
        9:{
            id: 'boutique',
            order: 10,
            label: 'Boutique',
            displayed: 1
        },
        10:{
            id: 'coupe',
            order: 11,
            label: 'Coupes',
            displayed: 1
        },
        11:{
            id: 'ranking',
            order: 12,
            label: 'Classements',
            displayed: 1
        }
    };
    
    var vf_links = {
        'entente' : {
            0:{
                id: 1,
                order: 2,
                label: 'Entente',
                url: '#entente',
                displayed: 1
            },
            1:{
                id: 2,
                order: 3,
                label: 'Aide',
                url: '#entente?aide',
                displayed: 1
            },
            2:{
                id: 3,
                order: 1,
                label: 'Don',
                url: '#entente?don',
                displayed: 1
            }
        },
        'home' : {
            0:{
                id: 4,
                order: 1,
                label: 'Analyser',
                url: '#home?analyse',
                displayed: 1
            }
        },
        'transferts' : {
            0:{
                id: 5,
                order: 1,
                label: 'Negociations',
                url: '#transferts?Negociations',
                displayed: 1
            },
            1:{
                id: 6,
                order: 2,
                label: 'Encheres',
                url: '#transferts?enchere',
                displayed: 1
            },
            2:{
                id: 7,
                order: 3,
                label: 'Prets',
                url: '#transferts?prets',
                displayed: 1
            },
            3:{
                id: 8,
                order: 4,
                label: 'Transferts',
                url: '#transferts?list',
                displayed: 1
            },
            4:{
                id: 9,
                order: 5,
                label: 'Libres',
                url: '#transferts?free=&order=4',
                displayed: 1
            },
            5:{
                id: 10,
                order: 6,
                label: 'Journal',
                url: '#transferts?log',
                displayed: 1
            }
        },
        'staff' : {
            0:{
                id: 11,
                order: 1,
                label: 'Recruter',
                url: '#staff?recruter',
                displayed: 1
            },
            1:{
                id: 12,
                order: 2,
                label: 'Stage',
                url: '#staff/stage',
                displayed: 1
            },
            2:{
                id: 13,
                order: 3,
                label: 'Reconversion',
                url: '#staff/reconversion',
                displayed: 1
            }
        },
        'presse' : {
            0:{
                id: 14,
                order: 1,
                label: 'Interviews',
                url: '#presse?interviews',
                displayed: 1
            },
            1:{
                id: 15,
                order: 2,
                label: 'Repondre',
                url: '#presse?newinterview',
                displayed: 1
            }
        },
        'joueurs' : {
            0:{
                id: 16,
                order: 1,
                label: 'Profils',
                url: '#joueurs?view=profile',
                displayed: 1
            },
            1:{
                id: 17,
                order: 2,
                label: 'Niveaux',
                url: '#joueurs?view=niv',
                displayed: 1
            },
            2:{
                id: 18,
                order: 3,
                label: 'Progressions',
                url: '#joueurs?view=prog',
                displayed: 1
            },
            3:{
                id: 19,
                order: 4,
                label: 'Temps de jeu',
                url: '#joueurs?view=mins',
                displayed: 1
            },
            4:{
                id: 20,
                order: 5,
                label: 'Notes',
                url: '#joueurs?view=notes',
                displayed: 1
            },
            5:{
                id: 21,
                order: 6,
                label: 'Infos',
                url: '#joueurs?view=club',
                displayed: 1
            }
        },
        'training' : {
            0:{
                id: 22,
                order: 1,
                label: 'Entrainement',
                url: '#training',
                displayed: 1
            },
            1:{
                id: 23,
                order: 2,
                label: 'Entrainer',
                url: '#training/train',
                displayed: 1
            },
            2:{
                id: 24,
                order: 3,
                label: 'Collectif',
                url: '#training/group',
                displayed: 1
            },
            3:{
                id: 25,
                order: 4,
                label: 'Individuel',
                url: '#training/indiv',
                displayed: 1
            },
            4:{
                id: 26,
                order: 5,
                label: 'Programmes',
                url: '#training/program',
                displayed: 1
            },
            5:{
                id: 27,
                order: 6,
                label: 'Créer',
                url: '#training/program?create',
                displayed: 1
            }
        },
        'formation' : {
            0:{
                id: 28,
                order: 1,
                label: 'Centre de formation',
                url: '#formation',
                displayed: 1
            },
            1:{
                id: 29,
                order: 2,
                label: 'Entrainer',
                url: '#formation/training',
                displayed: 1
            },
            2:{
                id: 30,
                order: 3,
                label: 'Recruter',
                url: '#formation/scout',
                displayed: 1
            },
            3:{
                id: 31,
                order: 4,
                label: 'Rapports',
                url: '#formation/scout_result',
                displayed: 1
            }
        },
        'stade' : {
            0:{
                id: 32,
                order: 1,
                label: 'Stade',
                url: '#stade?manage',
                displayed: 1
            },
            1:{
                id: 33,
                order: 2,
                label: 'Gerer',
                url: '#stade?equipement',
                displayed: 1
            },
            2:{
                id: 34,
                order: 3,
                label: 'Pelouse',
                url: '#stade?changeturf',
                displayed: 1
            },
            3:{
                id: 35,
                order: 4,
                label: 'Places',
                url: '#stade?equipement&construction=0',
                displayed: 1
            },
            4:{
                id: 36,
                order: 5,
                label: 'Arrosage',
                url: '#stade?equipement&construction=2',
                displayed: 1
            },
            5:{
                id: 37,
                order: 6,
                label: 'Drainage',
                url: '#stade?equipement&construction=3',
                displayed: 1
            },
            6:{
                id: 38,
                order: 7,
                label: 'Chauffage',
                url: '#stade?equipement&construction=4',
                displayed: 1
            },
            7:{
                id: 39,
                order: 8,
                label: 'Loges VIP',
                url: '#stade?equipement&construction=5',
                displayed: 1
            },
            8:{
                id: 40,
                order: 9,
                label: 'Toit',
                url: '#stade?equipement&construction=6',
                displayed: 1
            },
            9:{
                id: 41,
                order: 10,
                label: 'Tribune',
                url: '#stade?equipement&construction=1',
                displayed: 1
            }
        },
        'boutique' : {
            0:{
                id: 42,
                order: 1,
                label: 'Boutique',
                url: '#boutique',
                displayed: 1
            },
            1:{
                id: 43,
                order: 2,
                label: 'Stocks',
                url: '#boutique?stock',
                displayed: 1
            }
        },
        'coupe' : {
            0:{
                id: 44,
                order: 1,
                label: 'Coupes',
                url: '#coupe',
                displayed: 1
            },
            1:{
                id: 45,
                order: 2,
                label: 'Mes coupes',
                url: '#coupe/my',
                displayed: 1
            },
            2:{
                id: 46,
                order: 3,
                label: 'Chercher',
                url: '#coupe/search',
                displayed: 1
            },
            3:{
                id: 47,
                order: 4,
                label: 'Coupes officielles',
                url: '#coupe/official',
                displayed: 1
            }
        },
        'ranking' : {
            0:{
                id: 48,
                order: 1,
                label: 'Classements',
                url: '#ranking',
                displayed: 1
            },
            1:{
                id: 49,
                order: 2,
                label: 'Championnats',
                url: '#ranking?type=championnat',
                displayed: 1
            },
            2:{
                id: 50,
                order: 3,
                label: 'Ententes',
                url: '#ranking?type=entente',
                displayed: 1
            },
            3:{
                id: 51,
                order: 4,
                label: 'Buteurs',
                url: '#ranking?type=buteurs',
                displayed: 1
            }
        }
    }
    
    evf_stock_fields = new Array(
        ['Pop-Corn', 0.5],
        ['Porte-Clés', 1.5],
        ['Décapsuleur', 2],
        ['Boisson', 2.5],
        ['Autocollants pour voiture', 3],
        ['Images Collector', 3],
        ['Sifflet d\'arbitre', 4],
        ['Drapeau Petit Format', 4],
        ['Stylo Feutre', 4],
        ['Déodorant', 4],
        ['Maquillage de supporter', 5],
        ['Brassard du Capitaine', 6],
        ['Chasuble d\'entraînement', 6],
        ['Thermos', 6],
        ['Poster', 7.5],
        ['Lunettes de soleil', 7.5],
        ['Ballon de Futsal', 7.5],
        ['Chaussettes', 7.5],
        ['Casquette', 7.5],
        ['Peluche de la mascotte', 7.5],
        ['Gants d\'hiver', 10],
        ['CD des chansons de supporters', 11],
        ['CD de l\'hymne Officiel', 12.5],
        ['Écharpe', 10],
        ['Fanion Grand Format', 11],
        ['Parapluie', 12.5],
        ['DVD Meilleurs Moments', 14],
        ['K-Way', 15],
        ['Chemise', 15],
        ['Protège-tibia', 15],
        ['Gilet Polaire', 17.5],
        ['Short', 17.5],
        ['Plots d\'entrainement', 20],
        ['Gants de Gardien', 20],
        ['Maillot Domicile', 22.5],
        ['Maillot Extérieur', 22.5],
        ['But d\'entraînement', 25],
        ['Drapeau Grand Format', 25],
        ['Chaussures raptor', 25],
        ['Mégaphone de supporter', 30],
        ['Costume de la Mascotte', 30],
        ['Poteau de corner', 30],
        ['Survêtement', 35],
        ['Chaussures total 09', 45],
        ['Ballon sapipa', 45],
        ['Ballon ekin', 45],
        ['Ballon kobeer', 45],
        ['Filet de but', 75]
    );
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd}
    if(mm<10){mm='0'+mm}
    
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
    var tdd = tomorrow.getDate();
    var tmm = tomorrow.getMonth()+1;
    var tyyyy = tomorrow.getFullYear();
    if(tdd<10){tdd='0'+tdd}
    if(tmm<10){tmm='0'+tmm}
    
    var yersterday = new Date();
    yersterday.setDate(yersterday.getDate()+1);
    var ydd = yersterday.getDate();
    var ymm = yersterday.getMonth()+1;
    var yyyyy = yersterday.getFullYear();
    if(ydd<10){ydd='0'+ydd}
    if(ymm<10){ymm='0'+ymm}
    
    var evf_currentDay = yyyy+mm+dd;
    var evf_tomorrow = tyyyy+tmm+tdd;
    var evf_yersterday = yyyyy+ymm+ydd;
    //alert(evf_tomorrow);
    
    var evf_timershort;
    var subtoolbar_timer = '';
    
    var evf_players_tocompare = new Object();
    
    var current_vfPage = document.location.href;
    
    var evf_regex_standard = new Array(
        ['\\#joueurs\\?view\\=profile','j_profile'],
        //['\\#joueurs\\?view\\=niv','j_niv'],
        //['\\#joueurs\\?view\\=prog','j_prog'],
        //['\\#joueurs\\?view\\=mins','j_mins'],
        ['\\#joueurs\\?view\\=notes','j_notes']
        //['\\#joueurs\\?view\\=club','j_club']
    );
    var nb_evf_regex_standard = evf_regex_standard.length;
    var evf_ajax_content = '';
    
    
    var efv_included_files = new Array();
}