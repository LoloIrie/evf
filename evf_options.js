/* Function to display log infos in the browser console */
function myconsole(){
    myconsole.history = myconsole.history || []; 
    myconsole.history.push(arguments); 
    if( arguments[1] == true ) 
        alert ( arguments[0] ); 
    else if( this.console ) 
        console.log( Array.prototype.slice.call( arguments) );
}

myconsole('eVF extension option page loaded...........');
myconsole('eVF default variables loaded: ' + evf_configfile_loaded);

/* Get options from localStorage */
function getDefaultPrefs(){
    //myconsole('eVF: Get current prefs values');
    for(var i in evf_prefs_name){
        if(typeof(localStorage[evf_prefs_name[i]]) != 'undefined'){
            eVF_prefs[evf_prefs_name[i]] = localStorage[evf_prefs_name[i]];
        }else{
            eVF_prefs[evf_prefs_name[i]] = evf_prefs_default[i];
        }
        
    }
    //myconsole(eVF_prefs);
    //myconsole(evf_prefs_default)
}

// Save a pref (localstorage and eVF_prefs object)
function saveP(k,v){
    eVF_prefs[k] = v;
    localStorage[k] = v;
    val = v;
    if(val.length > 50){
        val = val.substr(0, 49) + '...';
    }
    str_html = 'La préférence ' + k + ' a été sauvegardée avec la valeur ' + val + '';
    displayStatus(str_html);
    myconsole('eVF: Save pref ' + k + ': ' + v);
}

// Saves options to localStorage.
function save_options(type_prefs) {
  
  switch(type_prefs){
    case 1:
        // Save colors
        var evf1_color_alert = $('#evf1_color_alert').val();
        saveP("evf1_color_alert", evf1_color_alert);
        
        // Save menu features
        var evf_menu_display = $('input[name=evf_menu_display]:checked').val();
        saveP("evf_menu_display", evf_menu_display);
        
        var evf_magic_help = 0;
        if($('#evf_magic_help').attr('checked') == 'checked'){
            evf_magic_help = 1;
        }
        saveP("evf_magic_help", evf_magic_help);
        myconsole('eVF: evf_magic_help:' + evf_magic_help);
        
        var evf_menu_fixed = 0;
        if($('#evf_menu_fixed').attr('checked') == 'checked'){
            evf_menu_fixed = 1;
        }
        saveP("evf_menu_fixed", evf_menu_fixed);
        
        
        // Save links categories
        var evf_menu_links_categories = new Object();
        var evf_menu_links = new Object();
        $('.evf_menu_links_categories').each(function(index){
            new_id = $(this).attr('id').substr(2);
            evf_menu_links_categories[index] = new Object();
            order_Jid = '#ov_' + new_id;
            label_Jid = '#label_' + new_id;
            id_Jid = '#id_' + new_id;
            evf_menu_links_categories[index].id = $(id_Jid).val();
            evf_menu_links_categories[index].label = $(label_Jid).val();
            evf_menu_links_categories[index].order = $(order_Jid).val();
            if($(this).attr('checked') == 'checked'){
                evf_menu_links_categories[index].displayed = 1;
                myconsole('eVF: link cat added: ' + new_id);
            }
            
            // Save links items
            css_linkscat = '.evf_links_display_' + new_id;
            myconsole($(css_linkscat));
            evf_link_id = evf_menu_links_categories[index].id;
            evf_menu_links[evf_link_id] = new Object();
            $(css_linkscat).each(function(ind){
                myconsole('...');
                evfl_id = $(this).val();
                evf_menu_links[evf_link_id][ind] = new Object();
                evf_menu_links[evf_link_id][ind].id = evfl_id;
                order_Jid = '#evfl_order_' + evfl_id;
                label_Jid = '#evfl_label_' + evfl_id;
                displayed_Jid = '#evfl_displayed_' + evfl_id;
                url_Jid = '#evfl_url_' + evfl_id;
                if($(displayed_Jid).attr('checked') == 'checked'){
                    evf_menu_links[evf_link_id][ind].displayed = 1;
                }
                
                evf_menu_links[evf_link_id][ind].label = $(label_Jid).val();
                evf_menu_links[evf_link_id][ind].url = $(url_Jid).val();
                evf_menu_links[evf_link_id][ind].order = $(order_Jid).val();
            });
            
            evf_menu_links_json = JSON.stringify(evf_menu_links);
            saveP("evf_menu_links_json", evf_menu_links_json);
            myconsole(evf_menu_links);
        });
        
        evf_menu_links_catjson = JSON.stringify(evf_menu_links_categories);
        saveP("evf_menu_links_catjson", evf_menu_links_catjson);
        myconsole(evf_menu_links_categories);
        
        myconsole('eVF: links saved');
        myconsole(evf_menu_links);
        
        
        // Save custom links
        var custom_links = new Object();
        $('.custom_link_label').each(function(index){
            id_tmp = $(this).attr('id').substr(4);
            Jid_order = '#clo_'+id_tmp;
            Jid_label = '#cll_'+id_tmp;
            Jid_url = '#clu_'+id_tmp;
            Jid_target = '#clt_'+id_tmp;
            if($(Jid_label).val() != '' && $(Jid_url).val() != '' && $(Jid_url).val() != 'http://'){
                custom_links[index] = {
                    'order': $(Jid_order).val(),
                    'label': $(Jid_label).val(),
                    'url': $(Jid_url).val(),
                    'target': $(Jid_target).val()
                }
            }
        });
        custom_links_json = JSON.stringify(custom_links);
        myconsole('eVF: custom links: ' + custom_links_json);
        saveP("evf_menu_custom_links", custom_links_json);
        
        str_html = "Options générales sauvegardées.";
        break;
        
    case 2:
        // Save compare players options
        $('#players_compare_values input').each(function(){
            elt_id = $(this).attr('id');
            elt_val = $('#'+elt_id).val();
            saveP(elt_id, elt_val);
            jElt_id = '#td_compVal_' + elt_id;
            $(jElt_id).html(elt_val);
            //myconsole($(jElt_id));
        });
        str_html = "Options relatives aux comparaisons de joueurs sauvegardées pour ce poste";
        break;
        
    case 3:
        if(!confirm('Etes vous sur de vouloir appliquer ces modifications pour tous les postes ?\n\nAction irreversible !!!')){
            return false;
        }
        // Save compare players options
        $('#players_compare_values input').each(function(){
            elt_id = $(this).attr('id');
            elt_val = $('#'+elt_id).val();
            elt_post = elt_id.substring(4);
            for(var i in evf_poste_codes){
                element_id = i + '_' + elt_post;
                saveP(element_id, elt_val);
                jElt_id = '#td_compVal_' + element_id;
                $(jElt_id).html(elt_val);
                //myconsole($(jElt_id));
            }
            myconsole(element_id);
        });
        str_html = "Options relatives aux comparaisons de joueurs sauvegardées. Tous les postes ont été modifiés.";
        break;
    
    case 4:
        // Save eVF LIVE
        eVF_server_status = 0;
        if($('#eVF_server').attr('checked') == 'checked'){
            eVF_server_status = 1;
        }
        saveP('eVF_server', eVF_server_status);
        str_html = "Options du projet eVF LIVE sauvegardée";
        break;
            
    default:
        break;
  }
  
    displayStatus(str_html);
  
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  
  
  
  var favorite = eVF_prefs["evf1_color_alert"];
  if (!favorite) {
    alert('Pref evf1_color_alert not found...');
    return;
  }
  
  color1 = eVF_prefs["evf1_color_alert"];
  $('#evf1_color_alert').val(color1);
  
  if(eVF_prefs['evf_menu_display'] == 2){
    $('#evf_menu_display2').attr('checked','checked');
  }
  
  if(eVF_prefs['evf_magic_help'] == 1){
    $('#evf_magic_help').attr('checked','checked');
    myconsole($('#evf_magic_help').attr('checked'));
  }
  
  if(eVF_prefs['eVF_server'] == 1){
    $('#eVF_server').attr('checked','checked');
    myconsole($('#eVF_server').attr('checked'));
  }
  
  if(eVF_prefs['evf_menu_fixed'] == 1){
    $('#evf_menu_fixed').attr('checked','checked');
    myconsole($('#evf_menu_fixed').attr('checked'));
  }
  
  for(var i in evf_poste_codes){
    for(var j in evf_players_params){
        player_code = i + '_' + j;
        if(typeof(localStorage[player_code]) != 'undefined'){
            eVF_prefs[player_code] = localStorage[player_code];
        }
        
        if(i == 'gar'){
            player_code2 = '#' + player_code;
            $(player_code2).val(eVF_prefs[player_code]);
        }
    }
  }
}

// Function to add options to a select field for player positions
function select_options_postes(){
    html_str = '';
    for(var i in evf_poste_codes){
        html_str += '<option value="' + i + '" class="option_' + i.charAt(0) + '" >' + evf_poste_codes[i] + '</option>';
    }
    $('.evf_player_positions_select').append(html_str);
}

$('#posteToCompare').live('change', function(){
    // Change header
    $('#posteToCompare_header').text($('#posteToCompare option:selected').text());
    // Change input fields
    $('#players_compare_values input').each(function(){
        //myconsole('Old ID:' + $(this).attr('id'));
        // Change input IDs
        current_id = $(this).attr('id');
        current_id_parts = current_id.split('_');
        new_id = $('#posteToCompare').val() + '_' + current_id_parts[1];
        $(this).attr('id', new_id);
        // Set values for this position
        //myconsole('New ID:' + new_id);
        //myconsole(typeof(localStorage[new_id]));
        
        // Update sliders
        window['slider_' + current_id_parts[1]] = '#' + new_id;
        slider_id = '#slider_' + current_id_parts[1];
        if(typeof(localStorage[new_id]) != 'undefined'){
            tmp_val = localStorage[new_id];
        }else{
            tmp_val = 5;
        }
        
        $(this).val(tmp_val);
        $(slider_id).slider('value', tmp_val);

        
        //slider_age = '#dlc_age';
        //slider_gar = '#dlc_gar';
        //slider_def = '#dlc_def';
    });
});


// Function to display the full comparaison table
function display_compare_players_table(div_id){
    //alert(eVF_prefs['gar_gar']);
    
    jdiv_id = '#' + div_id;
    $(jdiv_id).append('<table id="compare_players_table"></table');
    for(var i in evf_poste_codes){
        $('#compare_players_table').append('<colgroup></colgroup>');
    }
    $('#compare_players_table').append('<tr></tr>');
    $('#compare_players_table tr:first').append('<td></td>');
    // first row (headers)
    for(var i in evf_poste_codes){
        $('#compare_players_table tr:first').append('<td class="evf_table_header" >' + evf_poste_codes[i] + '</td>');
    }
    col_nr = 0;
    // table cells
    for(var i in evf_players_params){
        $('#compare_players_table').append('<tr></tr>');
        for(var j in evf_poste_codes){
            key = j + '_' + i;
            if(col_nr == 0){
                $('#compare_players_table tr:last').append('<td class="evf_table_header" >' + evf_players_params[i] + '</td>');
            }
            $('#compare_players_table tr:last').append('<td class="evf_table_content" id="td_compVal_' + key + '" >' + eVF_prefs[key] + '</td>');
            col_nr++;
        }
        col_nr = 0;
    }
    
    // Mouseover effect on column and row
    $("#compare_players_table").delegate('td','mouseover mouseleave', function(e) {
        if (e.type == 'mouseover') {
          $(this).parent().addClass("cells_hover");
          $("colgroup").eq($(this).index()).addClass("cells_hover");
        }
        else {
          $(this).parent().removeClass("cells_hover");
          $("colgroup").eq($(this).index()).removeClass("cells_hover");
        }
    });
    
}

function display_required_tab(){
    evf_required_tab = '#evf_optionTab' + eVF_prefs['evf_current_option_page'];
    $(evf_required_tab).fadeIn('slow');
    myconsole('eVF: Display the required tab ' + evf_required_tab);
}

var previous_valSlider = 100;
function updateAllSliders(val){
    if(typeof(previous_valSlider) == 'undefined'){previous_valSlider=0;}
    current_valSlider = parseInt(val);
    //myconsole(previous_valSlider + ' / ' + current_valSlider);
    diff_slider = Math.abs(current_valSlider - previous_valSlider);
    // Increase value
    if(current_valSlider > previous_valSlider){
        $('.pl_params').each(function(){
            id_input = $(this).attr('id');
            pla_param = id_input.substr(4,3);
            slider_id = '#slider_' + pla_param;
            current_val = parseInt($(this).val());
            if(100 > (current_val+diff_slider)){
                //myconsole(pla_param + ' max: ' + evf_players_params_minmax[pla_param][1]);
                current_val = current_val + diff_slider;
                $(this).val(current_val);
                $(slider_id).slider('value', current_val);
                myconsole('eVF Slider ID: ' + slider_id);
            }else{
                $(this).val(100);
                $(slider_id).slider('value', 100);
            }
        });
    }else{
        $('.pl_params').each(function(){
            id_input = $(this).attr('id');
            pla_param = id_input.substr(4,3);
            current_val = parseInt($(this).val());
            slider_id = '#slider_' + pla_param;
            if(0 < (current_val-diff_slider)){
                //myconsole(pla_param + ' max: ' + evf_players_params_minmax[pla_param][1]);
                current_val = current_val - diff_slider;
                $(this).val(current_val);
                $(slider_id).slider('value', current_val);
            }else{
                $(this).val(0);
                $(slider_id).slider('value', 0);
            }
        });
    }
    
    previous_valSlider = parseInt(val);
    //myconsole('previous_valSlider: ' + previous_valSlider);
}

// Function to get menu links
function get_links_categories_display(){
    myconsole('eVF: get_links_categories_display start...');
    html_str = '';
    
    html_str += '<div id="toggle_link_evf_links_display">+/-</div>';

    // Get menu links categories from user prefs or default values (if not yet saved)
    if(eVF_prefs['evf_menu_links_catjson'] != 0){
        vf_links_categories = JSON.parse(eVF_prefs['evf_menu_links_catjson']);
    }
    if(eVF_prefs['evf_menu_links_json'] != 0){
        vf_links = JSON.parse(eVF_prefs['evf_menu_links_json']);
    }
    
    myconsole(vf_links_categories);
    vf_links_categories_array = new Array();
    for(var i in vf_links_categories){
        vf_links_categories_array[i] = vf_links_categories[i];
    }
    vf_links_categories_array.sort(SortLinksByOrder);
    
    for(var i in vf_links_categories_array){
        cat_id = vf_links_categories_array[i].id;
        vf_links_array = new Array();
        for(var j in vf_links[cat_id]){
            vf_links_array[j] = vf_links[cat_id][j];
        }

        //myconsole(vf_links_categories[i]);
        vf_links_array.sort(SortLinksByOrder);
        
        checked = '';
        if(vf_links_categories_array[i].displayed == 1){
            checked = 'checked="checked"';
        }
        html_str += '<input type="hidden" id="id_' + i + '" value="' + vf_links_categories_array[i].id + '" /><input type="hidden" id="label_' + i + '" value="' + vf_links_categories_array[i].label + '" /><input class="evf_order_value" type="text" id="ov_' + i + '" value="' + vf_links_categories_array[i].order + '" /><input class="evf_menu_links_categories" type="checkbox" id="f_' + i + '" ' + checked + ' /> <span for="f_' + i + '" class="evf_links_categories_display" onclick="$(this).next().next().toggle();" >' + vf_links_categories_array[i].label + '</span><br />';
        
        /* Add links to categories */
        html_str += '<div class="evf_links_display">';
        
        for(var j in vf_links_array){
            evf_link_id = vf_links_array[j].id;
            html_str += '<input class="evf_links_display_' + i + '" type="hidden" id="evfl_id_' + evf_link_id + '" value="' + evf_link_id + '" /><input type="hidden" id="evfl_label_' + evf_link_id + '" value="' + vf_links_array[j].label + '" /><input type="hidden" id="evfl_url_' + evf_link_id + '" value="' + vf_links_array[j].url + '" /><input class="evf_order_value" type="text" id="evfl_order_' + evf_link_id + '" value="' + vf_links_array[j].order + '" />';
            html_str += '<input class="evf_menu_links" type="checkbox" id="evfl_displayed_' + evf_link_id + '" ' + checked + ' /> <label for="f_' + evf_link_id + '" >' + vf_links_array[j].label + '</label><br />';
        }
        html_str += '</div>';
    }
    $('#menu_links_display').append(html_str);
}

/* Function to get custom links */
function get_custom_links_display(){
    var last_i;
    myconsole('eVF: get_custom_links_display start...');
    
    html_str = '';
    
    html_str += '<table id="evf_custom_links_form">';
        html_str += '<tr>';
            html_str += '<td>';
                html_str += 'Ordre';
            html_str += '</td>';
            html_str += '<td>';
                html_str += 'Label lien';
            html_str += '</td>';
            html_str += '<td>';
                html_str += 'URL du lien';
            html_str += '</td>';
            html_str += '<td>';
                html_str += 'Cible du lien';
            html_str += '</td>';
            html_str += '<td>';
            html_str += '</td>';
        html_str += '</tr>';
    html_str += '</table>';
    
    $('#menu_customlinks_display').append(html_str);
    
    
    // Get menu links categories from user prefs or default values (if not yet saved)
    if(eVF_prefs['evf_menu_custom_links'] != 0){
        html_str = '';
        
        var custom_links = JSON.parse(eVF_prefs['evf_menu_custom_links']);
        vf_custom_links_array = new Array();
        for(var i in custom_links){
            vf_custom_links_array[i] = custom_links[i];
        }
        vf_custom_links_array.sort(SortLinksByOrder);
        
        myconsole(vf_custom_links_array);
        
        for(i=0;i<vf_custom_links_array.length;i++){
            i = parseInt(i);
            html_str += '<tr>';
                html_str += '<td>';
                    html_str += '<input id="clo_' + i + '" type="text" class="custom_link_order" value="' + vf_custom_links_array[i].order + '" />';
                html_str += '</td>';
                html_str += '<td>';
                    html_str += '<input id="cll_' + i + '" type="text" class="custom_link_label" value="' + vf_custom_links_array[i].label + '" />';
                html_str += '</td>';
                html_str += '<td>';
                    html_str += '<input id="clu_' + i + '" type="text" class="custom_link_url" value="' + vf_custom_links_array[i].url + '" />';
                html_str += '</td>';
                html_str += '<td>';
                    html_str += '<select id="clt_' + i + '" class="custom_link_target" >';
                    clt_selected = '';
                    if(vf_custom_links_array[i].target == 0){
                        clt_selected = 'selected="selected" ';
                    }
                    html_str += '<option value="0" ' + clt_selected + '>Meme fenetre</option>';
                    clt_selected = '';
                    if(vf_custom_links_array[i].target == 1){
                        clt_selected = 'selected="selected" ';
                    }
                    html_str += '<option value="1" ' + clt_selected + '>Nouvelle fenetre</option>';
                    clt_selected = '';
                    if(vf_custom_links_array[i].target == 2){
                        clt_selected = 'selected="selected" ';
                    }
                    html_str += '<option value="2" ' + clt_selected + '>Dans VF</option>';
                    html_str += '</select>';
                html_str += '</td>';
                html_str += '<td>';
                    html_str += '<a class="tb6_delete" id="cldel_' + i + '"></a>';
                html_str += '</td>';
            html_str += '</tr>';
        }
        html_str += '<tr>';
            html_str += '<td>';
                html_str += '<input id="clo_' + (i+1) + '" type="text" class="custom_link_order" value="' + (i+1) + '" />';
            html_str += '</td>';
            html_str += '<td>';
                html_str += '<input id="cll_' + (i+1) + '" type="text" class="custom_link_label" value="" />';
            html_str += '</td>';
            html_str += '<td>';
                html_str += '<input id="clu_' + (i+1) + '" type="text" class="custom_link_url" value="http://" />';
            html_str += '</td>';
            html_str += '<td>';
                    html_str += '<select id="clt_' + (i+1) + '" class="custom_link_target" >';
                    html_str += '<option value="0" selected="selected" >Meme fenetre</option>';
                    html_str += '<option value="1" >Nouvelle fenetre</option>';
                    html_str += '<option value="2" >Dans VF</option>';
                    html_str += '</select>';
                html_str += '</td>';
            html_str += '<td>';
                html_str += '<a class="tb6_delete" id="cldel_' + (i+1) + '"></a>';
            html_str += '</td>';
        html_str += '</tr>';
        
        last_i = i+2;
    }else{
        html_str = '';
        html_str += '<tr>';
            html_str += '<td>';
                html_str += '<input id="clo_0" type="text" class="custom_link_order" value="1" />';
            html_str += '</td>';
            html_str += '<td>';
                html_str += '<input id="cll_0" type="text" class="custom_link_label" value="" />';
            html_str += '</td>';
            html_str += '<td>';
                html_str += '<input id="clu_0" type="text" class="custom_link_url" value="http://" />';
            html_str += '</td>';
            html_str += '<td>';
                    html_str += '<select id="clt_0" class="custom_link_target" >';
                    html_str += '<option value="0" selected="selected" >Meme fenetre</option>';
                    html_str += '<option value="1" >Nouvelle fenetre</option>';
                    html_str += '<option value="2" >Dans VF</option>';
                    html_str += '</select>';
                html_str += '</td>';
            html_str += '<td>';
                html_str += '<a class="tb6_delete" id="cldel_0"></a>';
            html_str += '</td>';
        html_str += '</tr>';
        
        last_i = 1;
    }
    
    $('#evf_custom_links_form').append(html_str);
    
    $('#add_custom_link').live('click', function(){
        html_str = '';
        html_str += '<tr>';
            html_str += '<td>';
                html_str += '<input id="clo_' + last_i + '" type="text" class="custom_link_order" value="' + (last_i+1) + '" />';
            html_str += '</td>';
            html_str += '<td>';
                html_str += '<input id="cll_' + last_i + '" type="text" class="custom_link_label" value="" />';
            html_str += '</td>';
            html_str += '<td>';
                html_str += '<input id="clu_' + last_i + '" type="text" class="custom_link_url" value="http://" />';
            html_str += '</td>';
            html_str += '<td>';
                    html_str += '<select id="clt_' + last_i + '" class="custom_link_target" >';
                    html_str += '<option value="0" selected="selected" >Meme fenetre</option>';
                    html_str += '<option value="1" >Nouvelle fenetre</option>';
                    html_str += '<option value="2" >Dans VF</option>';
                    html_str += '</select>';
                html_str += '</td>';
            html_str += '<td>';
                html_str += '<a class="tb6_delete" id="cldel_' + last_i + '"></a>';
            html_str += '</td>';
        html_str += '</tr>';
        $('#evf_custom_links_form').append(html_str);
        last_i++;
    });
    
    $('.tb6_delete').live('click', function(){
        if(confirm('Etes vous sur de vouloir supprimer ce lien ?')){
            $(this).parent().parent().remove();
            save_options(1);
        }
    });
}

// Function to display message
function displayStatus(str_html){
    
    $("#status").html(str_html);
    
    // Display infobox...
    $('#status_container').css('display','block');
    
    $('#status_container').live('click', function(){
        clearTimeout(evf_timershort);
        $("#status").empty();
        $('#status_container').css('display','none');
    });
    
    // ...but not for a long time
    evf_timershort = setTimeout(function() {
        $("#status").empty();
        $('#status_container').css('display','none');
    //location.reload(true);
    }, 10000);
}

// Function to add select options for each prefs
function prefs_select_importexport(html_id){
    Jid = '#' + html_id;
    html_str = '';
    for(var i in eVF_prefs){
        if(i == 'evf_logo')continue;
        html_str += '<option value="' + i + '">' + i + '</option>';
        
    }
    
    $(Jid).append(html_str);
    
}

// Function to copy textarea content in clipboard
function copyToClipboard( text ){
    var input = document.getElementById( 'impex' );
    input.value = text;
    input.focus();
    input.select();
    document.execCommand( 'Copy' );
}

function evf_import(type){
    switch(type){
        case 1:
            val = $('#impex').val();
            val_parts = val.split('///');
            nb_prefs = val_parts.length;
            myreg = /\=\>\>/;
            if(val.search(myreg) > 0){
                for(i=0;i<nb_prefs;i++){
                    pref_parts = val_parts[i].split('=>>');
                    saveP(pref_parts[0], pref_parts[1]);
                }
            }else{
                alert('Contenu de l\'import non valide.');
                return false;
            }
            break;
        
        case 2:
            nb_prefs = 1;
            saveP($('#prefs_select_importexport').val(), $('#impex_one').val());
            break;
    }
    
    
    if(nb_prefs > 1){
        alert( nb_prefs + ' préférences ont été mises à jour');
    }else{
        alert( 'Une préférence (' + pref_parts[0] + ') a été mise à jour');
    }
    
}

function evf_export(type){
    
    str_txt = '';
    nb_prefs = evf_prefs_name.length;
    for(i=0;i<nb_prefs;i++){
        str_txt += evf_prefs_name[i] + '=>>';
        /*
        if(evf_prefs_name[i] == 'evf_logo'){
           eVF_prefs[evf_prefs_name[i]] = evf_prefs_default[i];
        }
        */
        if(typeof(eVF_prefs[evf_prefs_name[i]]) != 'undefined'){
            str_txt += eVF_prefs[evf_prefs_name[i]];
        }else{
            str_txt += evf_prefs_default[i];
        }
        str_txt += '///';
    }
    str_txt = str_txt.substring(0,str_txt.length-3);
    $('#impex').val(str_txt);
    copyToClipboard(str_txt);
    
    alert('Vos préférences ont été copiées dans le presse-papier');
}

function table_stock_fields_input(){
    html_str = '';
    
    myconsole(evf_stock_fields);
    total_articles = 10000;
    
    eVF_stocks = JSON.parse(eVF_prefs['evf_stocks']);
    myconsole(eVF_stocks);
    
    fac_calc = 0;
    for(i=0;i<evf_stock_fields.length;i++){
        fac_calc = parseFloat(fac_calc + (1/evf_stock_fields[i][1]));
    }
    
    nbr_already_articles = 0;
    html_str += '<tr><td colspan="2" class="evf_header1">Valeurs actuelles</td></tr>';
    for(i=0;i<evf_stock_fields.length;i++){
        if(eVF_prefs['evf_stocks'] != 0){
            sfield_val = parseInt(eVF_stocks['current_stock_values'][i]);
        }else{
            if(i<(evf_stock_fields.length-1)){
                sfield_val = Math.round(((1/evf_stock_fields[i][1])*total_articles)/fac_calc);
            }else{
                sfield_val = total_articles - nbr_already_articles;
            }
            
        }
        nbr_already_articles += sfield_val;
        
        
        html_str += '<tr>';
        html_str += '<td class="label">';
        html_str += evf_stock_fields[i][0] + ' (' + evf_stock_fields[i][1] + '€)';
        html_str += '</td>';
        html_str += '<td class="val_displayed1">';
        html_str += '<input onkeyup="set_nbr_total_articles();" type="text" class="current_values stock_field" id="stockf_' + i + '" value="' + sfield_val + '" />';
        html_str += '</td>';
        html_str += '</tr>';
    }
    $('#stock_fields').html(html_str);
    $('#total_stock_user').html(nbr_already_articles);
}

function display_stock_results_detail(evf_date){
    myconsole(evf_date);
    html_str = '<table id="stock_history_detail_table" >';
    html_str += '<tr><td class="evf_header1">Quantité</td></tr>';
    for(j=0;j<evf_stock_fields.length;j++){
        input_css = '';
        if(eVF_stocks[evf_date]['stock_values'][j] != eVF_stocks['current_stock_values'][j]){
            input_css = ' sf_bold';
        }
        html_str += '<tr><td><input class="stock_field' + input_css + '" type="text" value="' + eVF_stocks[evf_date]['stock_values'][j] + '" style="border: 0; background-color: transparent;" /></td></tr>';
    }
    html_str += '</table>';
    $('#stock_fields_form_history').html(html_str);
}

function delete_stock_results_detail(evf_date){
    if(confirm('Etes vous sur de vouloir supprimer les informations pour ce jour ?\n\nAction irreversible !!!')){
        tmp_obj = eVF_stocks;
        myconsole(tmp_obj);
        for(var i in tmp_obj){
            if(i == evf_date){
                delete tmp_obj[i];
            }
        }
        myconsole(tmp_obj);
    
        saveP('evf_stocks',JSON.stringify(tmp_obj));
        eVF_stocks = tmp_obj;
        
        JtableId = '#table_' + evf_date;
        $(JtableId).fadeOut();
    }
}

function display_stock_results(){
    
    myconsole('eVF: display_stock_results start');
    myconsole(eVF_stocks);
    
    for(var i in eVF_stocks){
        html_str = '<table class="stock_history_table" id="table_' + i + '" >';
        if(i == parseInt(i) && i != evf_tomorrow && typeof(eVF_stocks[i]['gain']) != 'undefined'){
            i_date = i.substring(6,8) + '/' + i.substring(4,6) + '/' + i.substring(0,4);
            html_str += '<tr>';
            html_str += '<td colspan="2" class="evf_header1">';
            html_str += i_date + '<br /> CA: ' + eVF_stocks[i]['gain'] + ' €<br />';
            html_str += '<input class="link save_input" onclick="display_stock_results_detail(' + i + ');" value="Voir" /> <input class="link save_input" onclick="delete_stock_results_detail(' + i + ');" value="Supprimer" />';
            html_str += '</td>';
            html_str += '</tr>';
            if(eVF_stocks[i]['restes'].length > 0){
                for(j=0;j<evf_stock_fields.length;j++){
                    if(typeof(eVF_stocks[i]['restes'][j]) != 'undefined'){
                        html_str += '<tr><td><b>' + eVF_stocks[i]['restes'][j][1] + '</b></td>';
                        html_str += '<td><span title="' + eVF_stocks[i]['restes'][j][0] + '">' + eVF_stocks[i]['restes'][j][0].substring(0, 8) + '...</span></td></tr>';
                    }
                }
            }else{
                html_str += '<tr><td colspan="2">Tout a été vendu</td></tr>';
            }
            
        }
        html_str += '</table>';
        $('#stock_history').append(html_str);
    }
    
}

function set_nbr_total_articles(){
    nbr_articles = 0;
    $('.current_values').each(function(){
        nbr_articles += parseInt($(this).val());
    });
    
    $('#total_stock_user').html(nbr_articles);
    
    return true;
}

function evf_save_stock(){
    myconsole(evf_currentDay);
    
    if(typeof(eVF_stocks['last_update']) != 'undefined'){
        // Create tmp object to save from user prefs
        tmp_obj = eVF_stocks;
    }else{
        // Create new tmp object to save
        tmp_obj = {
            last_update: evf_currentDay,
            current_stock_values : [], // Updated
        };
        tmp_obj[evf_tomorrow] = {  // Updated
                'stock_values' : []
            };
    }
    
    if(typeof(tmp_obj[evf_tomorrow]) == 'undefined'){
        tmp_obj[evf_tomorrow] = new Object();
        tmp_obj[evf_tomorrow]['stock_values'] = new Array();
    }
    
    nb_fields = evf_stock_fields.length;
    for(i=0;i<nb_fields;i++){
        JinputID = '#stockf_' + i;
        tmp_obj['current_stock_values'][i] = $(JinputID).val();
        tmp_obj[evf_tomorrow]['stock_values'][i] = tmp_obj['current_stock_values'][i];
    }
    
    saveP('evf_stocks',JSON.stringify(tmp_obj));
    
    myconsole(tmp_obj);
    myconsole('eVF: evf_save_stock done...');
}

// Function to sort array by order values
function SortLinksByOrder(a,b){
    return a.order - b.order;
}

$(document).ready(function(){
    // Get default preferences
    getDefaultPrefs();
    
    // Get user preferences if existing and set variables on the option page
    restore_options();
    
    // Display menu links list
    get_links_categories_display();
    
    // Display custom links form
    get_custom_links_display();
    
    // Add select options for prefs import/export
    prefs_select_importexport('prefs_select_importexport');
    $('#prefs_select_importexport').change(function(){
        $('#impex_one').html(eVF_prefs[$(this).val()]);
    });
    
    // Display stock fields form
    table_stock_fields_input();
    display_stock_results();
    
    // Display select menu for players poste
    select_options_postes();
    
    // Display compare table
    display_compare_players_table('players_compare_table');
    
    // Add tabs links
    $('#tabs').bind('tabsselect', function(event, ui) {
        // Objects available in the function context:
        //ui.tab     // anchor element of the selected (clicked) tab
        //ui.panel   // element, that contains the selected/clicked tab contents
        //ui.index   // zero-based index of the selected (clicked) tab
        //myconsole('eVF Tab selected: ' + ui.index);
        saveP('evf_current_option_page', ui.index);
    
    });
    
    // Add toggle links for legend
    $('legend').bind('click', function() {
        $(this).next().toggle();
    });
    
    // Add toggle links for menu links categories
    $('#toggle_link_evf_links_display').bind('click', function() {
        $('.evf_links_display').each(function(){
            $(this).toggle();
        });
    });
    
    // Add toggle links for help
    $('#help_container h2').bind('click', function() {
        $(this).next().toggle();
    });
});


myconsole('eVF extension option page completed...........');
