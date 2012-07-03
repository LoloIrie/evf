// JavaScript Document
//alert('File j_notes.js included now...');
function j_notes(eVF_serverToUrl){
    //alert('j_notes function start...');
    //evf_ajax_content = $('#mainbrowse').html();
    evf_ajax_content = $('#separated').html();
    evf_ajax_json = j_notes_prepare(evf_ajax_content);
    
    evf_data = {
        evf_action: 152,
        uid: eVF_vfUid,
        evf_obj: evf_ajax_json
    };
    //alert('j_notes ajax to '+eVF_serverToUrl);
    //alert(evf_ajax_content);
    
    evf_ajax_url = eVF_serverToUrl + '?evf_action=152';
    
    $.ajax({
        type: "POST",
        url: evf_ajax_url,
        data: evf_data
    }).done(function( eVF_msg ) {
        //alert('Ajax callback in j_notes...');
        myconsole('Informations de la page envoyées sur les serveurs d\'eVF');
        myconsole( 'eVF: Ajax back... ' + eVF_msg );
    });
    
    //alert('j_notes function end...');
}

function j_notes_prepare(evf_ajax_content){
    objToJson = new Object();
    myconsole('eVF: j_notes_prepare start...');
    /*
    <tr class=" ca1">
        <td class="mg w50" style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(23, 132, 40); ">
            <span class="poste poste_g">GAC
            </span></td>
        <td style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(23, 132, 40); ">
            <a href="#joueur?jid=1196024" title="Fodey Fumnanya">F. Fumnanya</a></td>
        <td class="alc" style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(23, 132, 40); ">-</td>
        <td class="alc" style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(23, 132, 40); ">-</td>
        <td class="alc" style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(23, 132, 40); ">-</td>
        <td class="alc" style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(23, 132, 40); ">-</td>
        <td class=" alc" style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(23, 132, 40); background-color: rgb(182, 216, 187); background-position: initial initial; background-repeat: initial initial; ">24.5</td>
        <td class=" alc" style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(23, 132, 40); background-color: rgb(176, 213, 182); background-position: initial initial; background-repeat: initial initial; ">26</td>
    </tr>
    */
    myconsole($(evf_ajax_content));
    $(evf_ajax_content).find('tr').each(function(i){
        $(this).find('a').each(function(j){
            if($(this).attr('href').substr(0, 12) == '#joueur?jid='){
                // Get player ID
                player_id = $(this).attr('href').substring(12);
                objToJson[player_id] = new Object();
                objToJson[player_id] = {
                    player_name : $(this).attr('title')
                }
            }
            return false;
        });
        $(this).find('td').each(function(j){
            if(j<2){return true;}
            var entryday = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * (7-j)));
			dateTimestamp = Math.round(entryday.getTime() / 1000);
			
            objToJson[player_id][dateTimestamp] = $(this).text();
        });
    });
    myconsole(objToJson);
    objson = JSON.stringify(objToJson);
    return objson;
}
j_notes(eVF_serverToUrl);