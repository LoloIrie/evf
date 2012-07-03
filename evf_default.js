/* Function to display log infos in the browser console */
function myconsole(){
    if(evf_debug != true)return true;
    myconsole.history = myconsole.history || []; 
    myconsole.history.push(arguments); 
    if( arguments[1] == true ) 
        alert ( arguments[0] ); 
    else if( this.console ) 
        console.log( Array.prototype.slice.call( arguments) );
}

myconsole('eVF extension loaded...........');

/* Function to include a js file
TODO: replace with jQuery getScript + callback */
function js_include(src_file){
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.extension.getURL(src_file));
    head.appendChild(script);
}

/* Function to include JS File dynamically to the extension */
function jsIncludeToExtension(current_jsScript){
    myconsole('jsIncludeToExtension start...');
    myconsole('URL: ' + eVF_serverToUrl);
    /* Check if file is already included for the current session */
    if(in_array( efv_included_files , current_jsScript )){
        current_jsFunction = current_jsScript + '("' + eVF_serverToUrl + '");';
        eval(current_jsFunction);
    }
    else{
        jsFile = 'includes/' + current_jsScript + '.js';
        myconsole('File was not yet included: ' + jsFile);
        chrome.extension.sendRequest({method: "includeJsFile", jsfile: jsFile}, function(response) {
            myconsole(response['data']);
            myconsole('URL2: ' + eVF_serverToUrl);
            current_jsFunction = current_jsScript + '("' + eVF_serverToUrl + '");';
            //eval(current_jsFunction);
        });
    }
    efv_included_files.push(current_jsScript);
}

/* Function to get Cookies */
function getCookies(cookieNameToGet,callback) {
    myconsole('getCookies start');
    chrome.extension.sendRequest({method: "getCookie", cookieName: cookieNameToGet}, function(response) {
        myconsole(response['data']);
        callback(response['data']);
    });
}

/* Get options from localStorage and start the stuff */
function getAllPrefs(){
    chrome.extension.sendRequest({method: "getAllPrefs"}, function(response) {
        myconsole('eVF sendRequest: getAllPrefs');
        myconsole(response);
        eVF_prefs = response['data'];
        // Start
        init_eVF();
    });
}
getAllPrefs();

/* Get a localStorage value */
function getOnePref(pref_name){
    chrome.extension.sendRequest({method: "getOnePref", pref: pref_name}, function(response) {
        myconsole('eVF sendRequest: getOnePref (' + pref_name + ')');
        myconsole(response);
        return response['data'];
    });
}

// Function to sort array by order values
function SortLinksByOrder(a,b){
    return a.order - b.order;
}

/* Remove logo */
var removed_logo = 0;
function evf_remove_logo(){

    if(typeof(eVF_prefs['evf_logo']) != 'undefined'){
        myconsole('eVF: evf_logo ' + eVF_prefs['evf_logo']);
        hashad = atob(eVF_prefs['evf_logo']);
        myconsole('eVF: evf_logo (hashad) ' + hashad);
        club_name = $('#bottombar .fl a').text();
        hashad_before_hack = hashad;
        hashad = hashad.replace(club_name,'');
        if(hashad == hashad_before_hack){
            myconsole('Vous n\'etes pas autorisé à utiliser cette extension pour supprimer les publicités du site...');
            return false;
        }
        myconsole('eVF: hashad ' + hashad);
        eval(hashad);
    }
}

/* Colors and layout modifications */
function evf_change_layout(){
    
    // Change z-index for VF popups
    $('.vfpop').css('z-index', 100);
    
    // Change colors
    var efv_color_alert = eVF_prefs['evf1_color_alert'];
    myconsole('evf_color: '+efv_color_alert);
    if (efv_color_alert) {
        if(efv_color_alert != '0')
        {
            $('strong.cv').css('color',efv_color_alert);
            myconsole('evf_color: '+efv_color_alert+' used !');
        }
    }
    
    // Change range input
    switch_range_text_input();
}

/* Function to create the eVF menu */
function evf_create_navigationmenu(){
    /* VF Panel height */
    //$('#vfpanel').css('height','100%');
    
    evf_options_url = chrome.extension.getURL("evf_options.html");
    
    /* Create eVF Menu */
    my_menu = '<div id="ldo_menu">';
        /* eVF Toolbar */
        my_menu += '<div id="ldo_menu_toolbar">';
            /* my_menu += '<a class="evf_icon sp1" id="ldo_menu_compare" title="Comparer" ></a>';
            my_menu += '<a class="evf_icon sp3" id="ldo_menu_stock" title="Stocks boutique" ></a>';
            my_menu += '<a class="evf_icon sp2" id="ldo_menu_options" title="eVF options" href="' + evf_options_url + '" target="_blank" ></a>';
            my_menu += '<a class="evf_icon sp2" id="ldo_menu_expand" title="Ouvrir/Fermer le menu" ></a>'; */
            my_menu += '<a class="evf_icon tb1 evf_icon_submenu" id="ldo_menu_magic" title="Magique !!!" ></a>';
            /*
            my_menu += '<a class="evf_icon tb4 evf_icon_submenu" id="ldo_menu_design" title="Modifier le design" ></a>';
            */
            my_menu += '<a class="evf_icon tb3" id="ldo_menu_options" title="Configurer eVF" href="' + evf_options_url + '" target="_blank" ></a>';
            my_menu += '<a class="evf_icon tb2" id="ldo_menu_expand" title="Ouvrir le menu" style="float: right;"></a>';
            // Notifications
            my_menu += '<a class="evf_icon tb5 evf_icon_submenu" id="ldo_menu_notes" title="Notifications" ></a>';
            
            
        my_menu += '</div>';
        
        
        /* eVF Quicklinks */
        
        my_menu += '<div id="ldo_menu_quicklinks">';
        /* Add custom links */
        if(eVF_prefs['evf_menu_custom_links'] != 1){
            custom_links = JSON.parse(eVF_prefs['evf_menu_custom_links']);
            
            custom_links_array = new Array();
            for(var i in custom_links){
                custom_links_array[i] = custom_links[i];
            }
            custom_links_array.sort(SortLinksByOrder);
            //myconsole('eVF: custom links');
            //myconsole(custom_links_array);
            
            my_menu += '<p class="ldo_menu_header">Liens persos</p><div class="ldo_menu_links">';
            for(var i in custom_links_array){
                my_menu += '<a href="' + custom_links_array[i].url + '" ';
                link_params = '';
                switch(custom_links_array[i].target){
                    case '1':
                        link_params = 'target="_blank" ';
                        break;
                    
                    case '2':
                        link_params = 'class="evf_to_vf" ';
                        break;
                    
                    default:
                        link_params = '';
                        break;
                }
                my_menu += link_params;
                my_menu += '>' + custom_links_array[i].label + '</a><br />';;
            }
            my_menu += '</div>';
            
            $('.evf_to_vf').live('click', function(e){
                url_ajax = $(this).attr('href');
                $('#mainbrowse').load(url_ajax, function(){
                    $('#chatbox span').each(function(){
                        if($(this).css('color') == 'rgb(255, 255, 255)'){
                            $(this).css('color', '#444');
                        }
                    });
                });
                e.preventDefault();
            });
        }
        /* Add quicklinks */
        if(eVF_prefs['evf_menu_display'] == 1){
            //myconsole('eVF: add Quicklinks');
            /* Get menu links categories to display */
            var linkscat_todisplay;
            if(eVF_prefs['evf_menu_links_catjson'] == 0){
                //myconsole('eVF: Default links categories to display...');
                linkscat_todisplay = vf_links_categories;
            }else{
                //myconsole('eVF: Links categories to display pref exists...');
                linkscat_todisplay = JSON.parse(eVF_prefs['evf_menu_links_catjson']);
            }
            //myconsole(linkscat_todisplay);
            
            /* Get menu links to display */
            //myconsole('eVF: Links to display...');
            var links_todisplay;
            if(eVF_prefs['evf_menu_links_json'] == 0){
                //myconsole('eVF: Default links to display...');
                links_todisplay = vf_links;
            }else{
                //myconsole('eVF: Links to display pref exists...');
                links_todisplay = JSON.parse(eVF_prefs['evf_menu_links_json']);
            }
            //myconsole(links_todisplay);
            
            
            vf_links_categories_array = new Array();
            for(var i in linkscat_todisplay){
                vf_links_categories_array[i] = linkscat_todisplay[i];
            }
            vf_links_categories_array.sort(SortLinksByOrder);
            //myconsole(vf_links_categories_array);
            
            $.each(vf_links_categories_array, function(index, value){
            //$.each(linkscat_todisplay, function(index, value){
            
                cat_id = vf_links_categories_array[index].id;
                vf_links_array = new Array();
                for(var j in links_todisplay[cat_id]){
                    vf_links_array[j] = links_todisplay[cat_id][j];
                }
                
                //myconsole('eVF: links array...');
                //myconsole(vf_links_array);
                vf_links_array.sort(SortLinksByOrder);
                
            
                //myconsole('cat display ' + index + ': ' + linkscat_todisplay[index]);
                //myconsole(linkscat_todisplay[index]);
                //myconsole(vf_links_array);
                if(vf_links_categories_array[index].displayed == 1){
                    my_menu += '<p class="ldo_menu_header">' + vf_links_categories_array[index].label + '</p><div class="ldo_menu_links">';
                    $.each(vf_links_array, function(subindex,subvalue){
                        //myconsole(vf_links_array[subindex]);
                        if(vf_links_array[subindex].displayed == 1){
                            my_menu += '<a href="' + vf_links_array[subindex].url + '">' + vf_links_array[subindex].label + '</a><br />';
                        }
                    });
                    my_menu += '</div>';
                }
            });
        }
        my_menu += '</div>';
        
        my_menu += '<div id="ldo_menu_subtoolbar"><div style="float: right; font-weight: bold; position: absolute; top: -5px; right: -3px; color: #f00; font-size: 120%; cursor: pointer;">X</div><div id="ldo_menu_subtoolbar_content"></div></div>';
        $('#ldo_menu_toolbar .evf_icon_submenu').live('mouseover', function(){
            my_submenu = chrome.extension.getURL('includes/' + $(this).attr('id') + '.html');
            myconsole('eVF: load ' + my_submenu);
            //$('#ldo_menu_subtoolbar_content').empty();
            current_vfPage = document.location.href;
            
            $('#ldo_menu_subtoolbar_content').load(my_submenu, function(response, status, xhr){
                if(status != 'error' && $('#ldo_menu_subtoolbar').css('display') == 'none'){
                    $('#ldo_menu_subtoolbar').toggle('slow');
                    myconsole('eVF: Subtoolbar toggle');
                    
                    if(subtoolbar_timer == ''){
                        subtoolbar_timer = setInterval(function() {
                            if($('#ldo_menu_subtoolbar').css('display') != 'none'){$('#ldo_menu_subtoolbar').hide('slow');myconsole('eVF: Subtoolbar hidden by setInterval stuff');}
                          }, 3000);
                    }
                }
            });
        });
        
        $('#ldo_menu_toolbar .evf_icon_submenu').live('click', function(){
            if($('#ldo_menu_subtoolbar').css('display') != 'none'){
                $('#ldo_menu_subtoolbar').toggle('slow');
                myconsole('eVF: Subtoolbar toggle on icon click');
            }
        });
        
        $('#ldo_menu_subtoolbar').live('mouseover', function(){
            if(typeof(subtoolbar_timer) != 'undefined'){
                clearInterval(subtoolbar_timer);
            }
            subtoolbar_timer='';
            myconsole('Timer clean');
        });
        
        $('#ldo_menu_subtoolbar').live('click', function(){
            $('#ldo_menu_subtoolbar').toggle('slow');
            myconsole('eVF: Subtoolbar toggle on subtoolbar click');
        });
        
    my_menu += '</div>';
    
    /* Add quicklinks div */
    $('#vfpanel').after(my_menu);
    
    $('#ldo_menu').draggable();
    
    position_menuquicklinks = $('#ldo_menu_quicklinks').position().top + 'px';
    $('#ldo_menu_subtoolbar').css('top', position_menuquicklinks);
    
    $('#ldo_menu_magic').live('click', function(){
        myconsole('eVF: Click magic');
        var current_vfPage = document.location.href;
        
        // Check if entrainement page to change colors
        regexp_evf = /\#training/;
        if(current_vfPage.search(regexp_evf) != -1){
            if(eVF_prefs['evf_magic_help'] == 1){
                if(!confirm('Changer la couleur des notes qui viennent d\'évoluer ?')){
                    return true;
                }
            }
            myconsole('eVF: Page entrainement');
            evf_change_layout();
            return true;
        }
        
        // Check if player page to add compare buttons
        regexp_evf = /\#joueur\?jid\=/;
        if(current_vfPage.search(regexp_evf) != -1){
            if(eVF_prefs['evf_magic_help'] == 1){
                if(!confirm('Ajouter des liens pour le comparer avec des joueurs equivalents ?')){
                    return true;
                }
            }
            myconsole('eVF: Page joueur');
            evf_add_compare_links();
            return true;
        }
        
        // Check if stocks page to fill automatically fields
        regexp_evf = /\#boutique\/stock/;
        if(current_vfPage.search(regexp_evf) != -1){
            if(eVF_prefs['evf_magic_help'] == 1){
                if(!confirm('Remplir les champs automatiquement ?')){
                    return true;
                }
            }
            myconsole('eVF: Page stock');
            evf_fill_stock();
            return true;
        }
        
        // Check if shop page to run the check system
        regexp_evf = /\#boutique/;
        if(current_vfPage.search(regexp_evf) != -1){
            if(eVF_prefs['evf_magic_help'] == 1){
                if(!confirm('Sauvegarder les informations sur vos ventes d\'articles ?')){
                    return true;
                }
            }
            myconsole('eVF: Page boutique');
            evf_check_stock();
            return true;
        }
        
        
        /* Default: no action */
        if(eVF_prefs['evf_magic_help'] == 1){
            alert('Aucune action effectuée par eVF pour cette page.\n\nSi besoin contactez moi pour soumettre une idée');
            return true;
        }
    });
    
    /* Use the background pic from the VF panel for quicklinks */
    //background_url = $('#vfpanel').css('background-image');
    //$('#ldo_menu').css('background',background_url);
    //$('#ldo_menu').css('background-color','#022e6d');
    //$('#ldo_menu').css('background-repeat', 'no-repeat');
    
    /* Toggle effect for the menu */
    $(".ldo_menu_links").hide();
    $(".ldo_menu_header").bind('click' , function()
    {
        $(this).next(".ldo_menu_links").slideToggle(200);
    });
    
    /* If ad displayed... */
    if(removed_logo == 0){
        $("#ldo_menu_quicklinks").css('background-color', '#207400');
        $("#ldo_menu_quicklinks").css('display', 'none');
        $("#ad_sidebar").css('top', '45px');
        $("#ad_sidebar").css('z-index', '1');
    
        $("#ldo_menu_expand").bind('mouseover' , function()
        {
            if($('#ldo_menu_quicklinks').css('display') == 'none'){
                $('#ldo_menu_quicklinks').slideToggle();
            }
            setInterval(function() {
                $('#ldo_menu_quicklinks').css('display', 'none');
              }, 50000);
        });
    }
    
    
    $("#ldo_menu_expand").bind('click' , function()
    {
        $(".ldo_menu_links").each(function(){
            $(this).slideToggle(50);
        });
    });
    
    /*
    $("#ldo_menu_design").bind('click' , function()
    {
        evf_change_layout();
    });
    */
    
    $("#ldo_menu_notes").bind('click' , function()
    {
        RequestPermission(evf_note_display);
        evf_note_add_form();
    });
    
}

/* Function to define min and max values for the VF search tool*/
function valplus(val, indent){
    val_min_possible = 0;
    val_max_possible = 100;
    if(arguments[2]){
       val_min_possible = arguments[2]; 
    }
    if(arguments[3]){
       val_max_possible = arguments[3]; 
    }
    myconsole('val_min_possible:' + val_min_possible);
    val = parseInt(val);
    indent = parseInt(indent);
    val_min = val-indent;
    val_max = val+indent;
    if(val_min<val_min_possible){
        val_min=val_min_possible;
    }
    if(val_max>val_max_possible){
        val_max=val_max_possible;
    }
    value_asArray = new Array(val_min,val_max);
    return value_asArray;
}

/* Function to add players compare links */
function evf_add_compare_links(){
    myconsole('eVF: Compare stuff now..........');
    if($('#niv').find('.fw').length > 0)
    {
        /* Get all eVF preferences */
        //getAllPrefs();
        
        myconsole('eVF: ADD COMPARE PLAYER LINK start...........');
        /* Remove existing compare row */
        $('#evf_row_compare').remove();
        myconsole('eVf: Remove compare row');
        
        /* GET PLAYERS VALUES AND STORE AS OBJECT val_players */
        // Note globale
        ng_brut = $(".w120:contains('globale')").text();
        reg_ng = /[0-9]{1,3}/;
        ng = reg_ng.exec(ng_brut);
        val_players = {
            Age: $.trim($("td:contains('Age')").next().text()),
            PosteJoueur: $.trim($("span.poste").text()),
            Gardien: $.trim($("td:contains('Gardien')").next().text()),
            Defense: $.trim($("td:contains('Défense')").next().text()),
            Tacle: $.trim($("td:contains('Tacle')").next().text()),
            Placement: $.trim($("td:contains('Placement')").next().text()),
            Marquage: $.trim($("td:contains('Marquage')").next().text()),
            Puissance: $.trim($("td:contains('Puissance')").next().text()),
            Passes: $.trim($("td:contains('Passes')").next().text()),
            Technique: $.trim($("td:contains('Technique')").next().text()),
            Vitesse: $.trim($("td:contains('Vitesse')").next().text()),
            Attaque: $.trim($("td:contains('Attaque')").next().text()),
            Endurance: $.trim($("td:contains('Endurance')").next().text()),
            Ng: $.trim(ng[0]),
            Potentiel: $.trim($(".dib").text())
        }
        myconsole('eVF: value players from HTML');
        myconsole(val_players);
        
        /* define at first the player position */
        postejoueur = new Array();
        postejoueur[0] = val_players['PosteJoueur'].charAt(0) + val_players['PosteJoueur'].charAt(1);
        postejoueur[1] = val_players['PosteJoueur'].charAt(2);
        postelow = val_players['PosteJoueur'].toLowerCase();
        myconsole('eVF: Poste joueur from HTML: ' + postelow);
        
        indent_gar = postelow + '_gar';
        indent_def = postelow + '_def';
        indent_tac = postelow + '_tac';
        indent_pla = postelow + '_pla';
        indent_mar = postelow + '_mar';
        indent_pui = postelow + '_pui';
        indent_pas = postelow + '_pas';
        indent_tec = postelow + '_tec';
        indent_vit = postelow + '_vit';
        indent_att = postelow + '_att';
        indent_end = postelow + '_end';
        
        indent_age = postelow + '_age';
        indent_ngl = postelow + '_ngl';
        indent_pot = postelow + '_pot';
        
        str_debug = indent_gar + ': ' + eVF_prefs[indent_gar] + '\n';
        str_debug += indent_def + ': ' + eVF_prefs[indent_def] + '\n';
        str_debug += indent_tac + ': ' + eVF_prefs[indent_tac] + '\n';
        str_debug += indent_pla + ': ' + eVF_prefs[indent_pla] + '\n';
        str_debug += indent_mar + ': ' + eVF_prefs[indent_mar] + '\n';
        str_debug += indent_pui + ': ' + eVF_prefs[indent_pui] + '\n';
        str_debug += indent_pas + ': ' + eVF_prefs[indent_pas] + '\n';
        str_debug += indent_tec + ': ' + eVF_prefs[indent_tec] + '\n';
        str_debug += indent_vit + ': ' + eVF_prefs[indent_vit] + '\n';
        str_debug += indent_att + ': ' + eVF_prefs[indent_att] + '\n';
        str_debug += indent_end + ': ' + eVF_prefs[indent_end] + '\n';
        str_debug += indent_age + ': ' + eVF_prefs[indent_age] + '\n';
        str_debug += indent_ngl + ': ' + eVF_prefs[indent_ngl] + '\n';
        str_debug += indent_pot + ': ' + eVF_prefs[indent_pot] + '\n';
        myconsole('eVF: Poste indent' + str_debug);
        
        age_vals = valplus(val_players['Age'], eVF_prefs[indent_age]); // Very important: same age
        age_min = age_vals[0];
        age_max = age_vals[1];
        
        
        /* Probably not required
        post_prefix = val_players['PosteJoueur'].charAt(0);
        switch(post_prefix){
            // Attaquant
            case 'A':
                postejoueur[0] = 'AT';
                postejoueur[1] = val_players['PosteJoueur'].charAt(2);
                break;
                
            // Def
            case 'D':
                postejoueur[0] = 'AT';
                postejoueur[1] = val_players['PosteJoueur'].charAt(2);
                break;
            
            // Goa
            case 'G':
                
                break;
            
            // Mil
            case 'M':
                postejoueur[0] = val_players['PosteJoueur'].charAt(0) + val_players['PosteJoueur'].charAt(1);
                postejoueur[1] = val_players['PosteJoueur'].charAt(2);
                break;
            
            default:
                postejoueur[0] = 'MO';
                postejoueur[1] = 'C';
                break;
        }
        */
        
        gar_vals = valplus(val_players['Gardien'], eVF_prefs[indent_gar]); // Not relevant
        gar_min = gar_vals[0];
        gar_max = gar_vals[1];
        
        def_vals = valplus(val_players['Defense'], eVF_prefs[indent_def]); // Important
        def_min = def_vals[0];
        def_max = def_vals[1];
        
        tac_vals = valplus(val_players['Tacle'], eVF_prefs[indent_tac]); // Important
        tac_min = tac_vals[0];
        tac_max = tac_vals[1];
        
        pla_vals = valplus(val_players['Placement'], eVF_prefs[indent_pla]); // Important
        pla_min = pla_vals[0];
        pla_max = pla_vals[1];
        
        mar_vals = valplus(val_players['Marquage'], eVF_prefs[indent_mar]); // Important
        mar_min = mar_vals[0];
        mar_max = mar_vals[1];
        
        pui_vals = valplus(val_players['Puissance'], eVF_prefs[indent_pui]); // Not important
        pui_min = pui_vals[0];
        pui_max = pui_vals[1];
        
        pas_vals = valplus(val_players['Passes'], eVF_prefs[indent_pas]); // Important
        pas_min = pas_vals[0];
        pas_max = pas_vals[1];
        
        tec_vals = valplus(val_players['Technique'], eVF_prefs[indent_tec]); // Not important
        tec_min = tec_vals[0];
        tec_max = tec_vals[1];
        
        vit_vals = valplus(val_players['Vitesse'], eVF_prefs[indent_vit]); // Important
        vit_min = vit_vals[0];
        vit_max = vit_vals[1];
        
        att_vals = valplus(val_players['Attaque'], eVF_prefs[indent_att]); // Not important
        att_min = att_vals[0];
        att_max = att_vals[1];
        
        end_vals = valplus(val_players['Endurance'], eVF_prefs[indent_end]); // Not important
        end_min = end_vals[0];
        end_max = end_vals[1];
        myconsole('eVF: Value endurance');
        myconsole(end_vals);
        
        ng_vals = valplus(val_players['Ng'], eVF_prefs[indent_ngl]); // Important
        ng_min = ng_vals[0];
        ng_max = ng_vals[1];
        myconsole('eVF: Note globale');
        myconsole(val_players['Ng']);
        myconsole(ng_vals);
        myconsole('eVF: Note globale pref:'+eVF_prefs[indent_ngl]);
        
        pot_vals = valplus(val_players['Potentiel'], eVF_prefs[indent_pot]); // Important
        pot_min = pot_vals[0];
        pot_max = pot_vals[1];
        
        /*
        
        http://www.virtuafoot.com/#search?joueur=1&nom=&nation=&en[]=age&age_min=20&age_max=21&en[]=rating&rating_min=23&rating_max=33&en[]=prog_potential&prog_potential_min=32&prog_potential_max=42&en[]=poste&poste=DF&cote=C&liste_type=0&liste_prixmin=0&liste_prixmax=&uidin=1&en[]=niv_gardien&niv_gardien_min=3&niv_gardien_max=3&en[]=niv_defense&niv_defense_min=24&niv_defense_max=100&en[]=niv_tacle&niv_tacle_min=23&niv_tacle_max=100&en[]=niv_placement&niv_placement_min=20&niv_placement_max=100&en[]=niv_marquage&niv_marquage_min=20&niv_marquage_max=100&en[]=niv_puissance&niv_puissance_min=5&niv_puissance_max=6&en[]=niv_passe&niv_passe_min=20&niv_passe_max=31&en[]=niv_technique&niv_technique_min=20&niv_technique_max=21&en[]=niv_vitesse&niv_vitesse_min=20&niv_vitesse_max=21&en[]=niv_attaque&niv_attaque_min=6&niv_attaque_max=7&niv_endurance_min=36&niv_endurance_max=37&order=j.nom&order_dir=0
        
        
        */
        if($('table.ca_fw tr').last().hasClass('ca1')){
            newrow = '<tr class=" ca2" id="evf_row_compare"><td class="w50p mg b">Joueur similaires</td><td></td></tr>';
        }
        else{
            newrow = '<tr class=" ca1" id="evf_row_compare"><td class="w50p mg b">Joueur similaires</td><td></td></tr>';
        }
        $('table.ca_fw').append(newrow);

        /* Compare tous */
        /* Few values are preselected but not used to get more results (endurance) */
        age_min_compare = (val_players['Age']-1);
        if(age_min_compare == 16){
            age_min_compare = 17;
        }
        url_compare = '#search?joueur=1&nom=&nation=&en[]=age&age_min='+age_min_compare+'&age_max='+val_players['Age']+'&en[]=rating&rating_min='+val_players['Ng']+'&rating_max='+ng_max+'&en[]=prog_potential&prog_potential_min='+val_players['Potentiel']+'&prog_potential_max='+pot_max+'&en[]=poste&poste='+postejoueur[0]+'&cote='+postejoueur[1]+'&liste_type=0&liste_prixmin=0&liste_prixmax=&uidin=1&en[]=niv_gardien&niv_gardien_min='+val_players['Gardien']+'&niv_gardien_max='+val_players['Gardien']+'&en[]=niv_defense&niv_defense_min='+val_players['Defense']+'&niv_defense_max='+def_max+'&en[]=niv_tacle&niv_tacle_min='+val_players['Tacle']+'&niv_tacle_max='+tac_max+'&en[]=niv_placement&niv_placement_min='+val_players['Placement']+'&niv_placement_max='+pla_max+'&en[]=niv_marquage&niv_marquage_min='+val_players['Marquage']+'&niv_marquage_max='+mar_max+'&en[]=niv_puissance&niv_puissance_min='+val_players['Puissance']+'&niv_puissance_max='+pui_max+'&en[]=niv_passe&niv_passe_min='+val_players['Passes']+'&niv_passe_max='+pas_max+'&en[]=niv_technique&niv_technique_min='+val_players['Technique']+'&niv_technique_max='+tec_max+'&en[]=niv_vitesse&niv_vitesse_min='+val_players['Vitesse']+'&niv_vitesse_max='+vit_max+'&en[]=niv_attaque&niv_attaque_min='+val_players['Attaque']+'&niv_attaque_max='+att_max+'&niv_endurance_min='+val_players['Endurance']+'&niv_endurance_max='+end_max+'&order=j.nom&order_dir=0';
        compare_link = '<a href="' + url_compare + '" target="_blank" class="al">Comparer parmi tous les joueurs</a>';
        $('table.ca_fw td').last().append(compare_link);
        $('table.ca_fw td').last().append('<br />');
        
        /* Compare transfert */
        url_compare = '#search?joueur=1&nom=&nation=&en[]=age&age_min='+age_min+'&age_max='+age_max+'&en[]=rating&rating_min='+ng_min+'&rating_max='+ng_max+'&en[]=prog_potential&prog_potential_min='+pot_min+'&prog_potential_max='+pot_max+'&en[]=poste&poste='+postejoueur[0]+'&cote='+postejoueur[1]+'&en[]=liste&liste_type=0&liste_prixmin=0&liste_prixmax=&uidin=1&en[]=niv_gardien&niv_gardien_min='+gar_min+'&niv_gardien_max='+gar_max+'&en[]=niv_defense&niv_defense_min='+def_min+'&niv_defense_max='+def_max+'&en[]=niv_tacle&niv_tacle_min='+tac_min+'&niv_tacle_max='+tac_max+'&en[]=niv_placement&niv_placement_min='+pla_min+'&niv_placement_max='+pla_max+'&en[]=niv_marquage&niv_marquage_min='+mar_min+'&niv_marquage_max='+mar_max+'&en[]=niv_puissance&niv_puissance_min='+pui_min+'&niv_puissance_max='+pui_max+'&en[]=niv_passe&niv_passe_min='+pas_min+'&niv_passe_max='+pas_max+'&en[]=niv_technique&niv_technique_min='+tec_min+'&niv_technique_max='+tec_max+'&en[]=niv_vitesse&niv_vitesse_min='+vit_min+'&niv_vitesse_max='+vit_max+'&en[]=niv_attaque&niv_attaque_min='+att_min+'&niv_attaque_max='+att_max+'&en[]=niv_endurance&niv_endurance_min='+end_min+'&niv_endurance_max='+end_max+'&order=j.nom&order_dir=0';
        compare_link = '<a href="' + url_compare + '" target="_blank" class="al">Transferts</a>';
        $('table.ca_fw td').last().append(compare_link);
        /* Compare enchere */
        url_compare = '#search?joueur=1&nom=&nation=&en[]=age&age_min='+age_min+'&age_max='+age_max+'&en[]=rating&rating_min='+ng_min+'&rating_max='+ng_max+'&en[]=prog_potential&prog_potential_min='+pot_min+'&prog_potential_max='+pot_max+'&en[]=poste&poste='+postejoueur[0]+'&cote='+postejoueur[1]+'&liste_type=0&liste_prixmin=0&liste_prixmax=&en[]=enchere&uidin=1&en[]=niv_gardien&niv_gardien_min='+gar_min+'&niv_gardien_max='+gar_max+'&en[]=niv_defense&niv_defense_min='+def_min+'&niv_defense_max='+def_max+'&en[]=niv_tacle&niv_tacle_min='+tac_min+'&niv_tacle_max='+tac_max+'&en[]=niv_placement&niv_placement_min='+pla_min+'&niv_placement_max='+pla_max+'&en[]=niv_marquage&niv_marquage_min='+mar_min+'&niv_marquage_max='+mar_max+'&en[]=niv_puissance&niv_puissance_min='+pui_min+'&niv_puissance_max='+pui_max+'&en[]=niv_passe&niv_passe_min='+pas_min+'&niv_passe_max='+pas_max+'&en[]=niv_technique&niv_technique_min='+tec_min+'&niv_technique_max='+tec_max+'&en[]=niv_vitesse&niv_vitesse_min='+vit_min+'&niv_vitesse_max='+vit_max+'&en[]=niv_attaque&niv_attaque_min='+att_min+'&niv_attaque_max='+att_max+'&en[]=niv_endurance&niv_endurance_min='+end_min+'&niv_endurance_max='+end_max+'&order=j.nom&order_dir=0';
        compare_link = '<a href="' + url_compare + '" target="_blank" class="al">Encheres</a>';
        $('table.ca_fw td').last().append(compare_link);
        $('table.ca_fw td').last().append('<br />');
        

        
        myconsole('eVF: ADD COMPARE PLAYER LINK end...........');
    }
}

/* Function to check shop sales */
function evf_check_stock(){
    myconsole('eVF: evf_check_stock day: ' + evf_currentDay);
    
    // Get stock prefs
    eVF_stocks = JSON.parse(eVF_prefs['evf_stocks']);
    if(eVF_prefs['evf_stocks'] == 0){
        myconsole("eVF_prefs['evf_stocks'] == 0");
        return false;
    }
    
    // Check if update is required
    if(typeof(eVF_stocks['last_update']) != 'undefined'){
        if(eVF_stocks['last_update'] >= evf_currentDay){
            myconsole(eVF_stocks);
            myconsole('eVF: no update required');
            return false;
        }
    }
    
    // Get buy result from VF
    bresult = $("#browse td.mg:contains('affaires')").next().text();
    bresult = bresult.substring(0, bresult.length-2);
    //myconsole('eVF: chiffre affaire: ' + bresult);

    
    // Create tmp object to save from existing gobject
    tmp_obj = eVF_stocks;
    tmp_obj['last_update'] = evf_currentDay;
    
    // If no stock values entry for the current day, use current values
    if(typeof(tmp_obj[evf_currentDay]) == 'undefined'){
        tmp_obj[evf_currentDay] = new Object();
        tmp_obj[evf_currentDay]['stock_values'] = eVF_stocks['current_stock_values'];
    }
    
    tmp_obj[evf_currentDay]['restes'] = new Array();
    tmp_obj[evf_currentDay]['gain'] = bresult;
    // TODO
    $('#browse td.mg').each(function(index){
        if($(this).hasClass('b')){
            restes = new Array();
            restes[0] = $(this).text();
            restes[1] = $(this).next().text();
            tmp_obj[evf_currentDay]['restes'].push(restes);
            myconsole('eVF products found: ' + index + ': ' + $(this).text());
        }
    });
    
    /*
    if(typeof(eVF_stocks['last']) != 'undefined'){
        tmp_obj['last'] = eVF_stocks['last'];
    }
    */
    myconsole(tmp_obj);
    
    eVF_stocks_json = JSON.stringify(tmp_obj);
    chrome.extension.sendRequest({method: "saveStockPrefs", evf_stock: eVF_stocks_json}, function(response) {
        myconsole('eVF sendRequest: saveStockPrefs');
        myconsole(response);
        myconsole('eVF: evf_check_stock end');
    });
    
    
}

/* Function to fill shop stocks */
function evf_fill_stock(){
    eVF_stocks = JSON.parse(eVF_prefs['evf_stocks']);

    myconsole('eVF: evf_fill_stock');
    myconsole(eVF_stocks);
    
    if(typeof(eVF_stocks['current_stock_values']) != 'undefined'){
        // Fill using user prefs values
        myconsole('eVF: use stock pref to fill fields');
        nb_fields = eVF_stocks['current_stock_values'].length;
        myconsole('eVF: fields in eVF_prefs: ' + nb_fields);
        stock_values = eVF_stocks['current_stock_values'];
        for(i=0;i<nb_fields;i++){
            
            Jselector = 'input[name="nb['+i+']"]';
            evf_already_existing_val = parseInt($(Jselector).parent().prev().prev().text());
            evf_final_val = parseInt(stock_values[i])-evf_already_existing_val;
            if(evf_final_val < 0){
                evf_final_val = 0;
            }
            $(Jselector).val(evf_final_val);
            
            if(i<5){
                myconsole('eVF Jselector: ' + $(Jselector).parent().prev().prev().text());
                myconsole($(Jselector).parent());
                myconsole($(Jselector).parent().prev().prev());
            }
        }
    }else{
        // Fill using math prop.
        myconsole('eVF: fill by default');
        // commandés : 0 / 149
        tmp_array = $('#browse div.alc').text().match(/commandés \: 0 \/ ([0-9]*)/);
        nbr_articles = parseInt(tmp_array[1]);
        prix_articles = new Array();
        
        if(isNaN(nbr_articles)){
            nbr_articles = 5000;
            myconsole('eVF nbr_articles isNaN, set to 5000');
        }
        
        if(nbr_articles == 0){
            myconsole('eVF nbr_articles is null');
            return true;
        }
        
        fac_calc = 0;
        var nb_fields = 0;
        $('td.alc:contains("€")').each(function(index){
            td_str = $(this).text();
            prix_articles[index] = parseFloat(td_str.substring(0, (td_str.length-2)));
            //myconsole('eVF: ' + index + '/' + td_str);
            fac_calc = parseFloat(fac_calc + (1/prix_articles[index]));
            nb_fields = index;
        });
        
        stock_articles = 0;
        for(i=0;i<nb_fields;i++){
            Jselector = 'input[name="nb['+i+']"]';
            stock_value = Math.round(((1/prix_articles[i])*nbr_articles)/fac_calc);
            myconsole('eVF i: ' + i + ' / ' + stock_value + ' / ' + nbr_articles + ' / ' + prix_articles[i]);
            $(Jselector).val(stock_value);
            stock_articles += stock_value;
        }
        myconsole('eVF last field input[name="nb['+i+']"]: ' + (nbr_articles-stock_articles));
        $('input[name="nb['+i+']"]').val(nbr_articles-stock_articles);
        
        
        myconsole('eVF nombre d\'articles: ' + nbr_articles);
        myconsole('eVF prix des articles');
        myconsole(prix_articles);
    }
}

/* Function to switch between range and text fields */
function switch_range_text_input(){
    $("input").each(function(){
        if($(this).attr('type') == 'range'){
            $(this).prop('type','text');
            $(this).addClass('inputrange');
        }else if($(this).hasClass('inputrange')){
            $(this).prop('type','range');
            $(this).removeClass('inputrange');
        }
    });
}

/* Function to request user notifications permission */
function RequestPermission(callback) {
    myconsole('Need user agreement for notifications');
    window.webkitNotifications.requestPermission(callback);
}

/* Function to add a notification */
function evf_note_add(){
	myconsole('eVF: evf_node_add start');
    if($('#evf_note_sujet').val() == '' || $('#evf_note_content').val() == '' || $('#evf_note_date').val() == '' ){
		alert('Des informations manquent pour pouvoir créer cette notification.');
		return false;
	}
	
	myconsole('eVF: evf_note_add_form');
	if(eVF_prefs['evf_notes'] == 1 || eVF_prefs['evf_notes'].length < 2){
		eVF_notes = new Object();
	}else{
        eVF_notes = JSON.parse(eVF_prefs['evf_notes']);
    }
	
	myconsole(eVF_notes);
	
	var evf_dateAlert = new Date();
	
	evf_tmpArray = $('#evf_note_date').val().split(' ');
	evf_dateAlert_tmp = evf_tmpArray[0].split('/');
	evf_timeAlert_tmp = evf_tmpArray[1].split(':');
	
	if(evf_dateAlert_tmp[0].length == 1){
        evf_dateAlert_tmp[0] = '0' + evf_dateAlert_tmp[0];
    }
    evf_dateAlert_tmp[1] = parseInt(evf_dateAlert_tmp[1]);
    if(evf_dateAlert_tmp[1].length == 1){
        evf_dateAlert_tmp[1] = '0' + evf_dateAlert_tmp[1];
    }
    if(evf_timeAlert_tmp[0].length == 1){
        evf_timeAlert_tmp[0] = '0' + evf_timeAlert_tmp[0];
    }
    if(evf_timeAlert_tmp[1].length == 1){
        evf_timeAlert_tmp[1] = '0' + evf_timeAlert_tmp[1];
    }
	
	evf_dateAlert.setFullYear(evf_dateAlert_tmp[2]);
    evf_dateAlert.setMonth(evf_dateAlert_tmp[1]-1);
    evf_dateAlert.setDate(evf_dateAlert_tmp[0]);
    evf_dateAlert.setHours(evf_timeAlert_tmp[0]);
    evf_dateAlert.setMinutes(evf_timeAlert_tmp[1]);
    evf_dateAlert.setSeconds(0);
    evf_dateAlert.setMilliseconds(0);
    evf_timestamp = Math.floor((evf_dateAlert.getTime())/1000);
    myconsole('eVF: note timestamp = ' + evf_timestamp);
	
	evf_dateCurrent = new Date();
	evf_currenttimestamp = evf_dateCurrent.getTime();
	myconsole('eVF: current timestamp = ' + Math.floor(evf_currenttimestamp/1000));
	
	eVF_notes[evf_currenttimestamp] = {
		sujet: $('#evf_note_sujet').val(),
		url: $('#evf_note_url').val(),
		content: $('#evf_note_content').val(),
		date: evf_timestamp
	}
	
	tmp_pref = JSON.stringify(eVF_notes);
	
	/*
    if(!confirm( tmp_pref + 'OK ?')){
        myconsole('X');
        return false;
    }
	*/
	
	$('#evf_notes').fadeOut();
	chrome.extension.sendRequest({method: "saveNotesPrefs", val: tmp_pref}, function(response) {
		myconsole('eVF: response from background:' + response['data']);
        eVF_prefs['evf_notes'] = JSON.stringify(eVF_notes);
	});
}

/* Function to display the notification form */
function evf_note_add_form(){
    jQuery.fn.center = function () {
      this.css("position","absolute");
      this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
      this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
      return this;
    }
    
    html_str = '<div id="evf_notes" class="block">';
        html_str += '<h2>Ajouter une notification <span class="close_alert">X</span></h2>';
        html_str += '<table>';
            html_str += '<tr>';
                html_str += '<td class="evf_form_label">';
                html_str += 'Sujet:';
                html_str += '</td>';
                html_str += '<td class="evf_form_field">';
                html_str += '<input id="evf_note_sujet" type="text" class="evf_input" />';
                html_str += '</td>';
            html_str += '</tr>';
            html_str += '<tr>';
                html_str += '<td class="evf_form_label">';
                html_str += 'Note:';
                html_str += '</td>';
                html_str += '<td class="evf_form_field">';
                html_str += '<textarea id="evf_note_content" class="evf_input" cols="35" rows="12" />';
                html_str += '</td>';
            html_str += '</tr>';
            html_str += '<tr>';
                html_str += '<td class="evf_form_label">';
                html_str += 'URL:';
                html_str += '</td>';
                html_str += '<td class="evf_form_field">';
                html_str += '<input id="evf_note_url" type="text" class="evf_input" value="'+document.location+'" />';
                html_str += '</td>';
            html_str += '</tr>';
            html_str += '<tr>';
                html_str += '<td class="evf_form_label">';
                html_str += 'Date rappel:';
                html_str += '</td>';
                html_str += '<td class="evf_form_field">';
                html_str += '<input id="evf_note_date" type="text" class="evf_input" />';
                html_str += '</td>';
            html_str += '</tr>';
            html_str += '<tr>';
                html_str += '<td class="evf_form_field" colspan="2" style="text-align: center;">';
                html_str += '<input id="evf_note_add_input" type="button" class="evf_button" value="Ajouter" />';
                html_str += '</td>';
            html_str += '</tr>';
        html_str += '</table>';
    html_str += '</div>';
    
    $('body').append(html_str);

    $('#evf_notes').center().fadeIn().draggable();;
    $('.close_alert').live('click', function(){
		$('#evf_notes').fadeOut();
	});
    
    jQuery(function($){
    	$.datepicker.regional['fr'] = {
    		closeText: 'Fermer',
    		prevText: '&#x3c;Préc',
    		nextText: 'Suiv&#x3e;',
    		currentText: 'Courant',
    		monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin',
    		'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    		monthNamesShort: ['Jan','Fév','Mar','Avr','Mai','Jun',
    		'Jul','Aoû','Sep','Oct','Nov','Déc'],
    		dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
    		dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
    		dayNamesMin: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
    		weekHeader: 'Sm',
    		dateFormat: 'dd/mm/yy',
    		firstDay: 1,
    		isRTL: false,
    		showMonthAfterYear: false,
    		yearSuffix: ''
        };
    	$.datepicker.setDefaults($.datepicker.regional['fr']);
    	
        $.timepicker.regional['fr'] = {
        	timeOnlyTitle: 'Choisir',
        	timeText: 'Heure',
        	hourText: 'Heures',
        	minuteText: 'Minutes',
        	secondText: 'Secondes',
        	millisecText: 'Millisecondes',
        	currentText: 'Maintenant',
        	closeText: 'OK',
        	timeFormat: 'h:m',
        	ampm: false
        };
        $.timepicker.setDefaults($.timepicker.regional['fr']);
        
        
    });
    
    $( "#evf_note_date" ).datetimepicker({
        dateFormat: 'dd/mm/yy'
    });
    
    $('#evf_note_add_input').live('click', function(){
		evf_note_add();
	});
}

/* Function to delete a notification */
function evf_remove_note(ind){
    for(var i in eVF_notes){
        myconsole(i + '::::' + ind);
        if(i == ind){
            myconsole('eVF: Remove note ' + i);
            delete eVF_notes[i];
            eVF_prefs['evf_notes'] = JSON.parse(eVF_prefs['evf_notes']);
            delete eVF_prefs['evf_notes'][i];
            eVF_prefs['evf_notes'] = JSON.stringify(eVF_prefs['evf_notes']);
        }
    }
    tmp_pref = JSON.stringify(eVF_notes);
    
    chrome.extension.sendRequest({method: "saveNotesPrefs", val: tmp_pref}, function(response) {
		myconsole('eVF: response from background to save notes prefs:' + response['data']);
        myconsole(eVF_prefs['evf_notes']);
	});
}

/* Function to display notifications */
function evf_note_display(){
    if (window.webkitNotifications.checkPermission() > 0) {
        RequestPermission(evf_note_display);
    }else{
        myconsole('eVF: evf_note_display start');
        myconsole(eVF_prefs['evf_notes']);
        if( eVF_prefs['evf_notes'] == 1 || typeof(eVF_prefs['evf_notes']) == 'undefined' ){
            return true;
        }
        
        eVF_notes = JSON.parse(eVF_prefs['evf_notes']);
        myconsole(eVF_notes);
        
        var curdate = new Date();
        currentTimestamp = Math.ceil((curdate.getTime())/1000);
        myconsole(curdate.getTime());
        
        for(var i in eVF_notes){
            myconsole(eVF_notes[i]['date'] + ' :: ' + currentTimestamp);
            if( eVF_notes[i]['date'] < currentTimestamp ){
                myconsole('eVF Notification: ' + i + ': ' + eVF_notes[i]['date'] + '::' + currentTimestamp);

                evf_note_url = encodeURI(eVF_notes[i]['url']);
                evf_note_sujet = encodeURI(eVF_notes[i]['sujet']);
                evf_note_content = encodeURI(eVF_notes[i]['content']);
                
                notification = window.webkitNotifications.createHTMLNotification(
                    chrome.extension.getURL('note.html?&&evf_note_sujet='+evf_note_sujet+'&&evf_note_url='+evf_note_url+'&&evf_note_content='+evf_note_content)      // The body.
                );
                evf_remove_note(i);
                notification.show();
            }
        }
    }
}

var isCtrl = false;
$(document).keyup(function (e) {
    if(e.which == 17) isCtrl=false;
}).keydown(function (e) {
    if(e.which == 17) isCtrl=true;
    if(e.which == 32 && isCtrl == true) {
        $('#ldo_menu').toggle('slow');
        return false;
    }
});

function evf_save_player_infos(){
    if($('#niv').find('.fw').length > 0)
    {
        /* Get all eVF preferences */
        //getAllPrefs();
        
        myconsole('eVF: SAVE PLAYERS INFOS start...........');
        
        /* GET PLAYER ID */
        current_vfPage = document.location.href;
        current_vfPage_parts = current_vfPage.split('jid=');
        player_id = parseInt(current_vfPage_parts[1]);
        
        /* GET PLAYERS VALUES AND STORE AS OBJECT val_players */
        // Note globale
        ng_brut = $(".w120:contains('globale')").text();
        reg_ng = /[0-9]{1,3}/;
        ng = reg_ng.exec(ng_brut);
        val_players = {
            Id: player_id,
            Age: $.trim($("td:contains('Age')").next().text()),
            PosteJoueur: $.trim($("span.poste").text()),
            Gardien: $.trim($("td:contains('Gardien')").next().text()),
            Defense: $.trim($("td:contains('Défense')").next().text()),
            Tacle: $.trim($("td:contains('Tacle')").next().text()),
            Placement: $.trim($("td:contains('Placement')").next().text()),
            Marquage: $.trim($("td:contains('Marquage')").next().text()),
            Puissance: $.trim($("td:contains('Puissance')").next().text()),
            Passes: $.trim($("td:contains('Passes')").next().text()),
            Technique: $.trim($("td:contains('Technique')").next().text()),
            Vitesse: $.trim($("td:contains('Vitesse')").next().text()),
            Attaque: $.trim($("td:contains('Attaque')").next().text()),
            Endurance: $.trim($("td:contains('Endurance')").next().text()),
            Ng: $.trim(ng[0]),
            Potentiel: $.trim($(".dib").text())
        }
        
        evf_players_tocompare[player_id] = val_players;
        myconsole(evf_players_tocompare);
    }
}

// Function to display compare view (NOT IMPLEMENTED YED)
function evf_display_players_compare(){
    html_str = 'XX';
    for(var i in evf_players_tocompare){
        html_str += '<h1>Joueur ID: ' + i + '</h1><br />';
        html_str += 'Age: ' + evf_players_tocompare[i].Age + '<br />';
        html_str += 'Poste: ' + evf_players_tocompare[i].PosteJoueur + '<br />';
        html_str += '<br /><br />';
    }
    $('#content').html(html_str);
}

var contentChangedRunning = 0;
function evf_save_infos_to_server(){
    var old_html = '';

    var myElement = document.getElementById('mainbrowse');
    if(window.addEventListener) {
       // Normal browsers
       myElement.addEventListener('DOMSubtreeModified', contentChanged, false);
    } else
       if(window.attachEvent) {
          // IE
          myElement.attachEvent('DOMSubtreeModified', contentChanged);
       }
   
    function contentChanged() {
       // this function will run each time the content of the DIV changes
       
       if($('#mainbrowse').html() != old_html && $('#mainbrowse').html() != '')
       {
            setTimeout("contentChangedRunning = 0;", 500);
            if(contentChangedRunning == 0)
            {
                current_vfPage = document.location.href;
                myconsole('Page: ' + current_vfPage);
                for(i=0;i<nb_evf_regex_standard;i++)
                {
                    myconsole(evf_regex_standard[i][0]);
                    regexp_evf = new RegExp(evf_regex_standard[i][0]);
                    myconsole(regexp_evf);
                    url_params = regexp_evf.exec(current_vfPage);
                    myconsole(url_params);
                    if(url_params !== null){
                        current_jsScript = evf_regex_standard[i][1];
                        myconsole('evf include ' + current_jsScript);

                        old_html = $('#mainbrowse').html();
                        getCookies('uid',function(uid){
                            eVF_vfUid = uid;
                            myconsole('getCookies vfUid: ' + eVF_vfUid);
                            /*
                            alert('getCookies callback...');
                            alert(current_jsScript);
                            */
                            jsIncludeToExtension(current_jsScript);
                        });
                        
                        contentChangedRunning = 1;
                        break;
                    }
                    
                }
                contentChangedRunning = 1;
            }
            
       }
    }
}

function init_eVF(){
    myconsole('eVF init_eVF START...........');
    myconsole(eVF_prefs);

    $(document).ready(function(){
        myconsole('eVF: Go.............');
        
        /* LAYOUT */
        /* Remove logo */
        evf_remove_logo();        
        /* Colors and layout modifications */
        evf_change_layout();
        
        /* eVF MENU */
        evf_create_navigationmenu();
      
        /* ADD COMPARE PLAYER LINK */
        evf_add_compare_links();
        
        // Start notifications.
        if (window.webkitNotifications) {
          evf_note_display();
        
          setInterval(function() {
            evf_note_display();
          }, 60000);
        }
        
        if(eVF_prefs['evf_menu_fixed'] != 1){
            $('#sidebar .sticky').removeClass().css('position', 'relative');
            myconsole('eVF: Menu no more fixed');
        }
        
        // PHP server stuff
        if(eVF_prefs['eVF_server'] == 1){
            evf_save_infos_to_server();
        }else{
            myconsole('eVF: not contributing to the LIVE project... Just too bad. :(');
        }
        // END PHP server stuff
        
        myconsole('eVF: Stop.............');
    });

    myconsole('eVF extension completed...........');
}

// JavaScript Document
/*
function in_array(array, p_val) {
    var l = array.length;
    for(var i = 0; i < l; i++) {
        if(array[i] == p_val) {
            rowid = i;
            return true;
        }
    }
    return false;
}

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
*/