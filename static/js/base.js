/**
 * A common JQuery script for all Django tools. 
 * Author: Dorjee Tamang
 */

var method_names = ["IEDB recommended", "consensus", "netmhcpan", "ann", "smmpmbec", "smm", "comblib_sidney2008", "arb", "pickpocket", "netmhccons", "netmhcstabpan"];
var mhcii_method_names = ["IEDB recommended", "consensus", "netmhciipan", "nn_align", "smm_align", "combinatorial library", "sturniolo"];
var mhci_id_methods = {
	1: "IEDB recommended", 
	2: "consensus", 
	3: "netmhcpan", 
	4: "ann", 
	5: "smmpmbec", 
	6: "smm", 
	7: "comblib_sidney2008", 
	8: "arb", 
	9: "pickpocket", 
	10: "netmhccons", 
	11: "netmhcstabpan",
	1218: "IEDB recommended 2.18", 
	1219: "IEDB recommended 2.19", 
	1222: "IEDB recommended 2.22",
	328: "netmhcpan 2.8", 
	330: "netmhcpan 3.0", 
	340: "netmhcpan 4.0", 
	3401: "netmhcpan_el 4.0", 
	3402: "netmhcpan_ba 4.0", 
	341: "netmhcpan_el", 
	342: "netmhcpan_ba",
	3411: "netmhcpan_el 4.1", 
	3412: "netmhcpan_ba 4.1", 
	434: "ann 3.4", 
};
var mhcii_id_methods = {
	1: "IEDB recommended", 
	2: "consensus", 
	3: "netmhciipan", 
	4: "nn_align", 
	5: "smm_align", 
	6: "combinatorial library", 
	7: "sturniolo",
	1222: "IEDB recommended 2.22", 
	2222: "consensus 2.22", 
	332: "netmhciipan 3.2", 
	3401: "netmhciipan_el 4.0", 
	3402: "netmhciipan_ba 4.0", 
	423: "nn_align 2.3", 
	1218: "IEDB recommended 2.18", 
	2218: "consensus 2.18", 
	331: "netmhciipan 3.1", 
	422: "nn_align 2.2", 
};

$(document)
.ajaxStart(function(){
    $("#spinnerImage").show();
})
.ajaxStop(function(){
    $("#spinnerImage").hide();
    $("#allele_section").show();
});

$(document).ready(function() {
	
	/*MergeGridCells();*/
	
	$('#input-form').submit(function() {
		setTimeout(function () { $("#loading").show(); }, 150);
		$("#loading-text").html("Loading... please wait.");
		$('#input-form').fadeOut(500);
		return true;
	});
	
	// DEFAULT SPECIES
	default_species = 'human';
	default_locus = 'DR';
	var tool = $("#pred_tool").val();
	
	/* DEFAULT frequency checkbox is 'checked' */
	$('input[name=freq]').attr('checked', true);
	$('input[name=chains]').attr('checked', false);
	
	var method_id = $('#id_method option:selected').val();
	if (method_id) update_species(method_id);
	if (tool== 'mhcii') update_locus(method_id);
	
	var method_name = '';
	if (tool === 'mhcii'){
			method_name = mhcii_id_methods[method_id]; 				
	} else if (tool === 'mhci') {
			method_name = mhci_id_methods[method_id]; 

	} else { 
		method_name = method_names[method_id-1]; 
	}
	method_name = method_name || '';
	if (tool !== 'mhcii'){
		sort_options(method_name);
	}	
	
	set_cutoff(method_name);
	$('#cutoff_type').change(function() {
		_method_id = $('#id_method option:selected').val();
		var _method_name = '';
		if (tool === 'mhcii'){
				_method_name = mhcii_id_methods[_method_id]; 				
		} else if (tool === 'mhci') {
				_method_name = mhci_id_methods[_method_id]; 
		} else { 
			_method_name = method_names[_method_id-1]; 
		}
		set_cutoff(_method_name);
	});
	
	// Toggle link for the optional MHC protein sequence - only for netmhcpan method
	$("#link-txtbox .allele_seq").hide();
    if (method_name.indexOf('netmhcpan')===0 /*|| method_name == 'pickpocket' || method_name == 'netmhccons'*/) { $("#link-txtbox .allele_seq").show(); }
    
	if (method_name.indexOf('IEDB recommended') == 0 || method_name.indexOf('netmhcpan_el') == 0 ){
		$("#link-txtbox .refset").show(); 
	}else{ 
		$("#link-txtbox .refset").hide(); 
	}

	$('#id_method').change(function() {
		$("#allele_section").hide();
		_method_id = $('#id_method option:selected').val();

		var _method_name = '';
		if (tool === 'mhcii'){
				_method_name = mhcii_id_methods[_method_id]; 				
		} else if (tool === 'mhci') {
				_method_name = mhci_id_methods[_method_id]; 

		} else { 
			_method_name = method_names[_method_id-1]; 
		}
		if (tool !== 'mhcii'){
			sort_options(_method_name);
		}
		var previousMethod = $('#previousValue').val();
		
		if (_method_name.indexOf('netmhcpan')===0 /*|| _method_name === 'pickpocket' || _method_name === 'netmhccons'*/) {
            $("#link-txtbox .allele_seq").show();
            if ($("#link-txtbox .allele_seq").prev('div').text() == 'Input FASTA sequence') {
                $("#link-txtbox .allele_seq").prev('div').remove();
            }
            if ($("#link-txtbox .allele_seq").text() == '(Select MHC allele(s))') {
                $("#link-txtbox .allele_seq").html("(Specify MHC allele sequence)");
            }
        } else {
            $('#txtbox').hide();
            $("#link-txtbox .allele_seq").hide();
            $("#link-txtbox div:first").show();
            if ($("#link-txtbox .allele_seq").prev('div').text() == 'Input FASTA sequence') {
                $("#link-txtbox").show();
                $("#link-txtbox .allele_seq").prev('div').remove();
            }
        }
        $('#tabName').show();

        if (_method_name.indexOf('IEDB recommended') === 0 || _method_name.indexOf('netmhcpan_el') === 0){
			$("#link-txtbox .refset").show(); 
		}else{ 
			$("#link-txtbox .refset").hide(); 
		}
		
        /* TODO: this section is buggy; needs an update */
		allele_selected = $("#tabName tr").length;
		if (allele_selected > 2) {
			var answer = confirm("Changing prediction method will reset allele selection.");
			// On click 'OK'
			if (answer) { 
	            while ($("#tabName tr").length > 2) {
	                $('#added_row td').closest('tr').remove();
	            }
			}
			// On click 'Cancel'
			else {
				if (_method_name.indexOf("netmhcpan")  != 0 || _method_name != "pickpocket" || _method_name != "netmhccons") {
					$('#link-txtbox .allele_seq').hide();
				} 
	            var temp_method_id = method_names.indexOf(previousMethod)+1;
	            _method_id = temp_method_id.toString();
	            $("#id_method").val(_method_id);
	        }
		}
		
		$('#cutoff_type').val('none');
		update_species(_method_id);
		if (tool == 'mhcii') update_locus(_method_id);
		// update for jquery-1.10.2
		$("#allele_section").show();
	});
	
	// On click action on "Specify MHC allele sequence" link
	$('#link-txtbox .allele_seq').click(function() {
        $('#txtbox').slideToggle();
        $(this).text($(this).text() == "(Specify MHC allele sequence)" ? "(Select MHC allele(s))" : "(Specify MHC allele sequence)");
        $('#tabName').show();
        if ($('#link-txtbox .allele_seq').text() == '(Select MHC allele(s))') {
            $(this).prev().hide('div');
            $(this).before("<div>Input FASTA sequence</div>");
            $('#tabName').hide();
            $('.freq').hide();
            $('#id_hla_seq').val('');
            $('#id_allele_list').val('');
            $('#id_length_list').val('');
            while ($("#tabName tr").length > 2) $('#added_row').remove();
        } else {
            $('#link-txtbox .allele_seq').prev('div').remove();
            $("#link-txtbox div:first").show();
            if($('#id_species_list').val() == 'human') {
            	$('.freq').show();
            }
        }
        return false;
    });
	
	$("textarea#id_sequence_text, #id_light_chain, #id_heavy_chain, #id_pdb_id").on('keyup', function() {
    	$('input[type=file]#id_sequence_file').val('');
    	$('input[type=text]#id_swissprot').val('');
    	$('input[type=file]#id_pdb_file').val('');
    });
	
	$("input[type=file]#id_sequence_file, input[type=file]#id_pdb_file").change(function() {
        $("textarea#id_sequence_text").val('');
        $("textarea#id_sequence_text").html('');
        
        //empty out light and heavy chain sequences in PIGS
        $("textarea#id_light_chain").val('');
        $("textarea#id_heavy_chain").val('');
        
        //empty out PDB ID in Paratome
//        $("input:text#id_pdb_id").val('');
    });
	
	$('input[type=text]#id_swissprot').on('click', function() {
		$("textarea#id_sequence_text").val('');
	});
	
	/* reset all in input page */
    $("#reset").click(function(){
    	
    	var method_id = '1';
    	$('table#tabName tr#added_row').remove();
    	
    	// empty out all textarea and text box
    	$('textarea').val('');
    	$('input[type=text]').val('');
    	
    	var seqfile = $("#id_sequence_file");
    	seqfile.replaceWith(seqfile.val('').clone(true));
    	
    	// defualt values for tap_precursor and tap_alpha
    	$('input[name="tap_precursor"]').val('1');
    	$('input[name="tap_alpha"]').val('0.2');
    	
    	$('select option').prop('selected', function() {
    		return this.defaultSelected;
    	});
    	$('input[name=method]:first').attr('checked', true);
    	$('#id_refset').attr('checked',false);
		$('#id_refset_7_allele').attr('checked',false);
    	if (tool == 'mhci' || tool == 'processing') update_species(method_id);
		if (tool == 'mhcnp') update_species(method_id)
    	if (tool == 'mhcii'){
			update_locus(method_id);
			// set length to 15
			$('div#length-btn input').prop('checked', false);
			$('div.length-opt label').removeClass('active');
			$('div.length-opt input:checkbox').prop('checked', false);
			$('div.length-opt label').slice(4,5).addClass('active');
			$('div.length-opt input:checkbox').slice(4,5).prop('checked', true);
		} 
//    	if (tool == 'paratome') update_paratome();
    	history.replaceState('', document.title, window.location.pathname);
    });
    
    $('.file-wrapper input[type=file]').bind('change focus click', LOAD.file);
    $('.delete_upload').on('click', function() {
        $('.file-wrapper input[type=file]').val('');
        $(this).closest('div').remove();
        return false;
    });
    
    
    $('#tabName td .delete').on('click', function() {
    	delete_selection(this);
    });
    
    if (tool == "mhci" || tool == "processing" || tool == "netchop") {
    	
    	$('#id_refset').click(function() {
    		if ($('#id_refset').is(":checked")) {
	    		$.get("refset", function (data) {
	    			upload_mhci_refset(data);
	    		});
			} else {
				$('table#tabName tr#added_row').remove();
			}
    	});
    	
    	$('#id_species_list').change(function() {
    		$("#allele_section").hide();
    		method_id = $('#id_method option:selected').val();
    		_species = $('#id_species_list option:selected').val();
    		update_allele(method_id, _species);
    	});	
    	
    	/* update allele dropdown when allele frequency is check/un-checked */
        $('#freq').click(function() {
        	$("#allele_section").hide();
        	method_id = $('#id_method option:selected').val();
        	update_allele(method_id);
        });

     	/* display all the versions of methods */
        $('#versions').change(function() {
        	if ($('#versions').is(":checked") == true) {
				$('select#id_method option.method-versions').show();
			} else {
				$('select#id_method option.method-versions').hide();				
			}
        });

    	$('#id_allele_list').change(function() {
    		method_id = $('#id_method option:selected').val();
    		_species = $('#id_species_list option:selected').val();
        	update_length(method_id, _species);
        	$("#id_length_list").attr("disabled", false);
    	});
    	
    	$('#id_length_list').change(function() {
    		_allele = $('#id_allele_list option:selected').val();
    		_length = $('#id_length_list option:selected').val();
    		_species = $('#id_species_list option:selected').val();
    		
    		// TODO: needs a better solution to separate out the methods in general
    		if (tool != 'netchop'){ 
    			addRow(_allele, _length, _species);
    			$('#id_allele_list').val('');	//set allele to default 'blank'
        		$('#id_length_list').val('');	//set length to default 'blank'
        		$("#id_length_list").attr("disabled", true);	//disable length selection
    		}
    	});
    	
    	
    } 
    else if (tool == "mhcii") {



    	$('#id_refset').click(function() {
    		if ($('#id_refset').is(":checked")) {
				// set length to 15
				$('div#length-btn input').prop('checked', false);
				$('div.length-opt label').removeClass('active');
				$('div.length-opt input:checkbox').prop('checked', false);
				$('div.length-opt label').slice(4,5).addClass('active');
				$('div.length-opt input:checkbox').slice(4,5).prop('checked', true);

            	$('#id_refset_7_allele').attr('checked',false);
                $('table#tabName tr#added_row').remove();
	    		$.get("refset", function (data) {
	    			upload_mhcii_refset(data);
	    		});
			} else {
				$('table#tabName tr#added_row').remove();
			}
    	});

    	$('#id_refset_7_allele').click(function() {
    		if ($('#id_refset_7_allele').is(":checked")) {
				// set length to 15
				$('div#length-btn input').prop('checked', false);
				$('div.length-opt label').removeClass('active');
				$('div.length-opt input:checkbox').prop('checked', false);
				$('div.length-opt label').slice(4,5).addClass('active');
				$('div.length-opt input:checkbox').slice(4,5).prop('checked', true);

            	$('#id_refset').attr('checked',false);
                $('table#tabName tr#added_row').remove();
	    		$.get("refset_7_allele", function (data) {
	    			upload_mhcii_refset(data);
	    		});
			} else {
				$('table#tabName tr#added_row').remove();
			}
    	});
    	
    	$('#id_locus_list').change(function() {
			update_mhcii_allele();
    	});	
    	
    	/* separate the alpha and beta chains is check/un-checked */
        $('#chains').click(function() {
			update_mhcii_allele();
        });

		//------------------------------------------
    	$('#id_allele_list').change(function() {

			if($("#scan_option").attr("checked")){
				method_id = $('#id_method option:selected').val();
				_locus = $('#id_locus_list option:selected').val();
				update_length(method_id, _locus);
				$("#id_length_list").attr("disabled", false);
			} else{
				_allele = $.trim($('#id_allele_list option:selected').val());
				addRowii(_allele);
				$('#id_allele_list').val('');
			}
    	});    	

		//--------------------------------------

    	//$('#id_allele_list').change(function() {
    	//	_allele = $.trim($('#id_allele_list option:selected').val());
    	//	addRowii(_allele);
    	//	$('#id_allele_list').val('');
    	//});
    	
    	$('#id_allele_list_a').change(function() {
    		method_id = $('#id_method option:selected').val();
    		_locus = $('#id_locus_list option:selected').val();
    		_allele_a = $('#id_allele_list_a option:selected').val();
    		update_mhcii_allele_b(method_id, _locus, _allele_a);
    		$("#id_allele_list_b").attr("disabled", false);	//enable allele_b selection
    	});
    	
    	$('#id_allele_list_b').change(function() {
    		_allele_a = $('#id_allele_list_a option:selected').val();
    		_allele_b = $('#id_allele_list_b option:selected').val();
    		addRowii_ab(_allele_a, $.trim(_allele_b));
    		$('#id_allele_list_a').val('');	//set allele_a to default 'blank'
    		$('#id_allele_list_b').val('');	//set allele_b to default 'blank'
    		$("#id_allele_list_b").attr("disabled", true);	//disable allele_b selection
		});
		

		/* display all the versions of methods */
		$('#versions').change(function() {
			if ($('#versions').is(":checked") == true) {
				$('select#id_method option.method-versions').show();
			} else {
				$('select#id_method option.method-versions').hide();				
			}
		});

    }
    else if (tool == "mhcnp") {
		$('#id_species_list').change(function() {
    		method_id = $('#id_method option:selected').val();
			_species = $('#id_species_list option:selected').val();
			$("#id_allele_list").attr("disabled", false);
    		update_allele(method_id, _species);
		});	
		
		$('#id_allele_list').change(function() {
    		method_id = $('#id_method option:selected').val();
			_species = $('#id_species_list option:selected').val();
        	update_length(method_id, _species);
        	$("#id_length_list").attr("disabled", false);
    	});

    	
    	$('#id_length_list').change(function() {
    		_allele = $('#id_allele_list option:selected').val();
			_length = $('#id_length_list option:selected').val();
			_species = $('#id_species_list option:selected').val();

    		addRow(_allele, _length, _species);
    		$('#id_allele_list').val('');	//set allele to default 'blank'
    		$('#id_length_list').val('');	//set length to default 'blank'
    		$("#id_length_list").attr("disabled", true);	//disable length selection
    	});
    }
    /*else if (tool == "paratome") {
    	update_paratome();
    	$('#id_method').on("change", function() {
    		update_paratome();
		});
    }*/
    else if (tool == "ellipro") {
    	update_ellipro();
    	$('#id_method').on("change", function() {
    		update_ellipro();
		});
    }
    
    /* check for threshold numeric value - netchop  */
	$("input.number[name='threshold']").keydown(function(event) {
		
		var _input = $("input.number[name='threshold']").val();
		
		// Allow decimal, dash, backspace and delete
		if (event.keyCode == 46 || event.keyCode == 8  || event.keyCode == 189 || event.keyCode == 190 || event.keyCode == 37 || event.keyCode == 39) { /* do nothing */ } 
		else { // Ensure that it is a number and stop the keypress
			if (event.keyCode < 48 || event.keyCode > 57 && event.keyCode < 96 || event.keyCode > 105 && event.keyCode < 109) { event.preventDefault(); }	
		}
	});
});


var LOAD = LOAD || {};
LOAD.file = function() {
	var object = $(this);
    var path = object.val();
    var path_array = path.split('\\');
    var filename = path_array[path_array.length - 1];   
    var fakeFile = object.siblings('.file-holder');
 
    if (filename !== '') {
    	$('.place').html('<div id="file_upload"><u>File</u>: <span class="file-holder">' + filename + '</span><img src="/static/images/delete.png" id="remove_file_upload" class="delete_upload" value="Remove"></div>');
		$('.delete_upload').on('click', function() {
			$('.file-wrapper input[type=file]').val('');
			$(this).closest('div').remove();
			return false;
		});
	}
};

function update_mhcii_allele(){

	//$("#allele_section").hide(); 
	method_id = $('#id_method option:selected').val();
	_locus = $('#id_locus_list option:selected').val();
	if (typeof _locus === 'undefined'){
		_locus = 'DR';
	}
	var chains_checkbox = is_checked();
	if (chains_checkbox == true) {
		$(".a").hide();
		$(".ab").show();
		update_mhcii_allele_a(method_id, _locus);
	} else {
		$(".ab").hide();
		$(".a").show();
		update_mhcii_allele_ab(method_id, _locus);
	}
}


function sort_options(_method){

	if (_method.indexOf("IEDB recommended") === 0 || _method.indexOf("consensus") === 0 ) {
		$('#sort_output').empty().append('<option value="percentile_rank" selected>Percentile Rank</option><option value="position_in_sequence">Position in sequence</option>');	
	} else if(_method == "netmhcstabpan" || _method.indexOf("netmhcpan_el") === 0){
		$('#sort_output').empty().append('<option value="Score" selected>Predicted Score (descend)</option><option value="position_in_sequence">Position in sequence</option>');	
	} else {
		$('#sort_output').empty().append('<option value="MHC_IC50" selected>Predicted IC50</option><option value="position_in_sequence">Position in sequence</option>');	
	}
}

function load_session(s, capturedSeq, args) {
	
	if ($('#pred_tool').val() == 'mhci') {
		if (capturedSeq != ''){
			$("#id_sequence_text").val(capturedSeq);
		} else if (typeof s != 'undefined'){
			for (var i=0; i<s.length; i++){
				if (typeof s[i].mhci_allele != 'undefined') {
					addRow(s[i].mhci_allele, s[i].mhci_length, s[i].mhci_species);
				}
			}
			if (capturedSeq == ''){
				var seq = s[s.length - 2];
				$("#id_sequence_text").val(seq.mhci_sequence); 
			}
		} 
	}
	
	if ($('#pred_tool').val() == 'mhcii') {
		if (capturedSeq != ''){
			$("#id_sequence_text").val(capturedSeq);
		} else if (typeof s != 'undefined'){
			var method_id = s[s.length - 4].mhcii_method_id;
			$(`select#id_method option[value=${method_id}]`).attr('selected', 'selected')
			update_mhcii_allele();

			for (var i=0; i<s.length; i++){
				if (typeof s[i].mhcii_allele != 'undefined') {
					let _allele = s[i].mhcii_allele
					addRowii(_allele);
					//$(`#id_allele_list option[value=${_allele}]`).hide();
				}
			}

			if (capturedSeq == ''){
				var seq = s[s.length - 3];
				$("#id_sequence_text").val(seq.mhcii_sequence);
			}
			var session_lengths = s[s.length - 1].mhcii_length;

			$('div.length-opt label').removeClass('active');
			$('div.length-opt input:checkbox').prop('checked', false);
			$('div#length-btn label').removeClass('active');
			for (var i=0; i<session_lengths.length; i++){
				var session_length = session_lengths[i];

				if (session_length==='as_is'){					
					$('label#len-as-is').addClass('active');
					$('label#len-as-is input').prop('checked', true);
					break;
				}
				$(`div.length-opt input:checkbox[value=${session_length}]`).prop('checked', true);
				$(`div.length-opt input:checkbox[value=${session_length}]`).parent().addClass('active');
			}
		} 
	}
	
	if ($('#pred_tool').val() == 'mhcnp') {
		if (capturedSeq != ''){
			$("#id_sequence_text").val(capturedSeq);
		} else if (typeof s != 'undefined'){
			for (var i=0; i<s.length; i++){
				if (typeof s[i].mhcnp_allele != 'undefined') {
					addRow(s[i].mhcnp_allele, s[i].mhcnp_length, s[i].mhcnp_species);
				}
			}
			if (capturedSeq == ''){
				var seq = s[s.length - 2];
				$("#id_sequence_text").val(seq.mhcnp_sequence); 
			}
		} 
	}
	
	if ($('#pred_tool').val() == 'mhciinp') {
		if (capturedSeq != ''){
			$("#id_sequence_text").val(capturedSeq);
		} else if (typeof s != 'undefined'){
			for (var i=0; i<s.length; i++){
				if (typeof s[i].mhcnp_allele != 'undefined') {
					addRow(s[i].mhcnp_allele, s[i].mhcnp_length, s[i].mhcnp_species);
				}
			}
			if (capturedSeq == ''){
				var seq = s[s.length - 2];
				$("#id_sequence_text").val(seq.mhcnp_sequence); 
			}
		} 
	}
	
	if ($('#pred_tool').val() == 'processing') {
		if (capturedSeq != ''){
			$("#id_sequence_text").val(capturedSeq);
		} else if (typeof s != 'undefined'){
			for (var i=0; i<s.length; i++){
				if (typeof s[i].processing_allele != 'undefined') {
					addRow(s[i].processing_allele, s[i].processing_length, s[i].processing_species);
				}
			}
			if (capturedSeq == ''){
				var seq = s[s.length - 2];
				$("#id_sequence_text").val(seq.processing_sequence); 
			}
		} 
	}
	
	if ($('#pred_tool').val() == 'bcell') {
		if (capturedSeq != ''){
			$("#id_sequence_text").val(capturedSeq);
		} else if (typeof s != 'undefined'){
			var d = s[s.length - 1];
			if (d.swissprot){
				$("#id_swissprot").val(d.swissprot);
			}
			if (d.bcell_sequence){
				$("#id_sequence_text").val(d.bcell_sequence);
			}
		}
	}
	
	if ($('#pred_tool').val() == 'cluster') {
		if (capturedSeq != ''){
			$("#id_sequence_text").val(capturedSeq);
		} else if (typeof s != 'undefined'){
			if (capturedSeq == ''){
				var seq = s[s.length - 2];
				$("#id_sequence_text").val(seq.cluster_sequence); 
			}
		} 
	}
	
	
	check_refset($('#pred_tool').val());
	
	// If sequence captured from URL (using example sequence) is empty,
	// check the cached session for sequence key
	
}


function getSingleURLVariable(variable){
	var query = window.location.search.substring(1);
	var pair = query.split("=");
	if(pair[0] == variable){
		return pair[1];
	}
	return('');
}

function getMultipleURLVariable(variable){
	var query = window.location.search.substring(1);
	var vars = query.split(escape("&"));
	for (var i=0;i<vars.length;i++){
		var pair = vars[i].split(escape("="));
		if(pair[0] == variable){
			return pair[1];
		}
	}
	return('');
}

/**
 * NetChop, NetCTL and NetCTLpan forms components are selected
 * depending on method_selected.
 * @param method_selected
 */
function UpdateForm(method_selected) {
	var rows = $("table.entry tr");
	if (method_selected == 'netchop') {
		var netchop = rows.filter(".netchop_form").show();
		$(".netctl_form").hide();
		$(".netctlpan_form").hide();
	} else if (method_selected == 'netctl') {
		var netctl = rows.filter(".netctl_form").show();
		$(".netchop_form").hide();
		$(".netctlpan_form").hide();
	} else {
		var netctlpan = rows.filter(".netctlpan_form").show();
		$(".netchop_form").hide();
		$(".netctl_form").hide();
		UpdateAllele("human", freq=true);
	}
}


function check_refset(method) {
	refset = "refset_"+method;
	if (typeof s != 'undefined' && typeof s.refset != 'undefined'){
		if (s[0].refset != 'off') {
			$('#id_refset').attr('checked', true);
		}
	}
}



function set_cutoff(method){
	if ($('#cutoff_type option:selected').val() != 'none') {
		$("#cutoff").fadeIn('slow')
	} else {
		$("#cutoff").fadeOut('slow');
	}
	if (method.indexOf('IEDB recommended') == 0 || method.indexOf('consensus') == 0) {
        $('#cutoff_type option[value="MHC_IC50"]').attr("disabled", true);
        $('#cutoff_type option[value="percent"]').attr("disabled", false);
    } else {
        $('#cutoff_type option[value="percent"]').attr("disabled", true);
        $('#cutoff_type option[value="MHC_IC50"]').attr("disabled", false);
    }
}

function countChar(field, maxlimit) {
	if (field.value.length > maxlimit) {
		// if the input is too long... Trim it!
		field.value = field.value.substring(0, maxlimit); 
		if ($("#pred_tool").val() != 'pigs') {
			alert("Input must be <= 10 MB or < 10,485,760 residues in size.");
		} else {
			alert("Input must be <= 500 bytes or < 500 residues in size.");
		}
	}
}


function delete_selection(object) {
	var allele = $(object).closest('tr').find('input[name=allele]').val();
	$(object).closest('tr').remove();
	$(`#id_allele_list option[value='${allele}']`).show();
    return false;
}

/* add a new row of allele-length to the table */
function addSequence(sequence){
	$("textarea#id_sequence_text").insert(sequence);
}

/* add a new row of allele-length to the table */
function addRow(allele, peplength, species){
	$("#tabName tr:last").before("<tr id='added_row'><td><input type='hidden' name='allele' value='" + allele + "'>" + allele + "</td><td><input type='hidden' name='length' value='" + peplength + "'>" + peplength + "</td><td style='background:transparent;border:0;'><input type='hidden' name='species' value='" + species + "'><img src='/static/images/delete.png' border='0' class='delete' value='" +allele+","+peplength+","+species+ "'></td></tr>");
	$('#tabName td .delete').on('click', function() {
    	delete_selection(this);
    });
}

/* add a new row of allele-length to the table */
function addRowii(allele){
	$("#tabName tr:last").before("<tr id='added_row'><td><input type='hidden' name='allele' value='" + allele + "'>" + allele + "</td><td style='background:transparent;border:0;'><img src='/static/images/delete.png' border='0' class='delete' value='" +allele+ "'></td></tr>");
	$(`#id_allele_list option[value='${allele}']`).hide();
	$('#tabName td .delete').on('click', function() {
    	delete_selection(this);
    });
}

function addRowii_ab(allele_a, allele_b){
	$("#tabName tr:last")
		.before("<tr id='added_row'><td>"+
					"<input type='hidden' name='allele_a' value='" + allele_a + "'>" + allele_a +"/"+
					"<input type='hidden' name='allele_b' value='" + allele_b + "'>" + allele_b + "</td>" +
					"<td style='background:transparent;border:0;'>" +
					"<img src='/static/images/delete.png' border='0' class='delete' value='" +allele_a+"/"+allele_b+ "'></td></tr>");
	$('#tabName td .delete').on('click', function() {
		delete_selection(this);
	});
}

/*function update_paratome(input_val){
	var method_id = $('#id_method').val();
	method_id = input_val ? input_val : method_id;
	
	if (method_id == '0') {
		$('select[name=method] option[value=0]').attr('selected', 'selected');
		$('.paratome_seq').show(); $('.paratome_str').hide();
		$("#id_pdb_id").val('');
		
	} else {
		$('select[name=method] option[value=1]').attr('selected', 'selected');
		$('.paratome_str').show(); $('.paratome_seq').hide(); 
		$("#id_sequence_text").val('');
	}
}*/

function update_ellipro(input_val){
	var method_id = $('#id_method').val();
	method_id = input_val ? input_val : method_id;
	
	if (method_id == '0') {
		$('select[name=method] option[value=0]').attr('selected', 'selected');
		$('.ellipro_seq').show(); $('.ellipro_str').hide();
		$("#id_pdb_id").val('');
		
	} else {
		$('select[name=method] option[value=1]').attr('selected', 'selected');
		$('.ellipro_str').show(); $('.ellipro_seq').hide(); 
		$("#id_sequence_text").val('');
	}
}



//reference set of alleles for mhci
function upload_mhci_refset(data){
	var kvpairs = data.split("\n");
	kvpairs = $.grep(kvpairs,function(n){ return(n); });
	var _species = 'human';
	$.each(kvpairs, function(key, value) {
		var arr = value.split(",");
		addRow(arr[0], arr[1], _species);
	});
}

// reference set of alleles for mhcii
function upload_mhcii_refset(data){
	var kvpairs = data.split("\n");
	kvpairs = $.grep(kvpairs,function(n){ return(n); });
	$.each(kvpairs, function(key, value) {
		addRowii(value);
	});
}

function update_species(method_id){
	$('#id_species_list').empty();
	
	// If it's MHC-I Processing tool and the method used
	// is IEDB recommened, just use NetMHCpan method instead
	if ($("#pred_tool").val() == 'processing'){
		if (method_id == 1){ method_id = 3; }
	}

	$.get(method_id + '/', function (data) {
		var kvpairs = data.split("\n");
    	kvpairs = $.grep(kvpairs,function(n){ return(n); });
		$.each(kvpairs, function(key, value) {  
			if(value == default_species) {
				$('#id_species_list')
					.append('<option value="' + value + '" selected>' + value + '</option>');
			} else {
				$('#id_species_list')
					.append('<option value="' + value + '">' + value + '</option>');
			}
		});
	});
	update_allele(method_id);
}

function update_locus(method_id){
	$('#id_locus_list').empty();
	$.get(method_id + '/', function (data) {
    	var kvpairs = data.split("\n");
    	kvpairs = $.grep(kvpairs,function(n){ return(n); });
		$.each(kvpairs, function(key, value) {  
			if(value == default_locus) {
				var option = 'Human, HLA-'+value;
				$('#id_locus_list')
					.append('<option value="' + value + '" selected>' + option + '</option>');
			} else {
				var option = value != 'H2' ? 'Human, HLA-'+value: 'mouse, H-2-I';
				$('#id_locus_list')
					.append('<option value="' + value + '">' + option + '</option>');
			}
		});
	});
	
	locus = typeof locus !== 'undefined' ? locus : 'DR';
	var chains_checkbox = is_checked();
	if (chains_checkbox == true) { 
		update_mhcii_allele_ab(method_id, locus); 
	}else { 
		update_mhcii_allele_a(method_id, locus); 
	}
}

// when the checkbox is unchecked for combined alpha-beta chains
function update_mhcii_allele_ab(method_id, locus){	
	if (locus == 'H2') {
		$(".freq, .refset").hide();
	}else{ 
		if (method_id.indexOf('1') !== 0) $(".refset").hide();
		else $(".refset").show();
	}
	$("#allele_section").hide();
	$("#spinnerImage").show();    
	$.get(method_id + '/' + locus + '/ab/', function (data) {
		var list_data = data.split("\n");
		list_data = $.grep(list_data,function(n){ return(n); });
		$('#id_allele_list').empty();
		$('#id_allele_list').append("<option></option>");
		$.each(list_data, function(){
			$('#id_allele_list').append('<option value="' + this + '">' + this + '</option>');
		});
	});
	$("#spinnerImage").hide();
    $("#allele_section").show();
}

// when the checkbox is checked for separate alpha-beta chains
function update_mhcii_allele_a(method_id, locus){
	if (locus == 'H2') $(".freq, .refset").hide();
	else 
		if (method_id.indexOf('1') !== 0) $(".refset").hide();
		else $(".refset").show();

	$("#allele_section").hide();
	$("#spinnerImage").show();    	
	$('#id_allele_list').empty();
	$.get(method_id + '/' + locus + '/', function (data) {
		var list_data = data.split("\n");
		list_data = $.grep(list_data,function(n){ return(n); });
		$('#id_allele_list').append("<option></option>");
		
		$('#id_allele_list_a').empty();
		$('#id_allele_list_a').append("<option></option>");
		
		$.each(list_data, function(){
			if (this.indexOf("DP") >= 0 || this.indexOf("DQ") >= 0) {
				$(".a").hide();
				$(".ab").show();
				$('#id_allele_list_a')
					.append('<option value="' + this + '">' + this + '</option>');
			} else {
				$(".ab").hide();
				$(".a").show();
				$('#id_allele_list')
					.append('<option value="' + this + '">' + this + '</option>');
			}
		});		
	});
	$("#spinnerImage").hide();
    $("#allele_section").show();
	//update_mhcii_allele_b(method_id, locus)

}

function update_mhcii_allele_b(method_id, locus, allele_a){
	
	allele_a = typeof allele_a !== 'undefined' ? allele_a : '';
	
	$('#id_allele_list_b').empty();
	$.get(method_id + '/' + locus + '/' + allele_a, function (data) {
		
		var list_data = data.split("\n");
		list_data = $.grep(list_data,function(n){ return(n); });
		$('#id_allele_list_b').append("<option></option>");
		
		$.each(list_data, function(){
			
			if (this.indexOf("DP") >= 0 || this.indexOf("DQ") >= 0) {
				$('#id_allele_list_b')
					.append('<option value="' + this + '">' + this + '</option>');
			} 
		});		
	});
}


/*function display_refset(method_id, species_locus){
}*/

function update_allele(method_id, species){
	species = typeof species !== 'undefined' ? species : 'human';
	//show/hide HLA reference set depending on method and species selected 
	if (species != 'human') $(".freq, .refset").hide();
	else 
		if ([1, 1218, 1219, 1222, 341, 3411, 3412, "1", "1218", "1219", "1222", "341", "3411", "3412" ].indexOf(method_id)>-1){
			$(".refset").show();
		}else{
			$(".refset").hide();
		}
	
	$('#id_allele_list').empty();
	
	// Class-I Binding or Processing
	if ($('#pred_tool').val() == "mhci" || $('#pred_tool').val() == "processing") {
		
		// If it's MHC-I Processing tool and the method used
		// is IEDB recommened, just use NetMHCpan method instead
		if ($("#pred_tool").val() == 'processing'){
			if (method_id == 1){ method_id = 3; }
		}
		
		$.get(method_id + '/' + species + '/', function (data) {
			var list_data = data.split("\n");
			list_data = $.grep(list_data,function(n){ return(n); });
			
			$('#id_allele_list').append("<option></option>");
			$.each(list_data, function(){
				var list_allele = this.split("\t");
				if (species == "human") {
					var freq_checkbox = is_checked();
					if (freq_checkbox == true) {
						if (list_allele[1] > 1) {
							$('#id_allele_list')
								.append('<option value="' + list_allele[0] + '">' + list_allele[0] + '</option>');
						}
					} else {
						$('#id_allele_list')
							.append('<option value="' + list_allele[0] + '">' + list_allele[0] + '</option>');
					}
				} else {
					$('#id_allele_list')
						.append('<option value="' + list_allele[0] + '">' + list_allele[0] + '</option>');
				}
			});
		});
		set_cutoff(mhci_id_methods[method_id]);
	}
	// MHC-NP
	else if ($('#pred_tool').val() == "mhcnp" || $('#pred_tool').val() == "netmhcpan 4.0") {
		$.get(method_id + '/' + species + '/', function (data) {
			var list_data = data.split("\n");
			list_data = $.grep(list_data,function(n){ return(n); });
			$('#id_allele_list').append("<option></option>");
			$.each(list_data, function(){
				$('#id_allele_list')
					.append('<option value="' + this + '">' + this + '</option>');
			});
		});
	}
	
	else if ($('#pred_tool').val() == 'netchop'){
		$.get(method_id + '/' + species + '/', function (data) {
			var list_data = data.split("\n");
			list_data = $.grep(list_data,function(n){ return(n); });
			$('#id_allele_list').append("<option></option>");
			$.each(list_data, function(){
				$('#id_allele_list')
					.append('<option value="' + this + '">' + this + '</option>');
			});
		});
	}
}

function update_length(method_id, species){
	var _allele = $('#id_allele_list option:selected').val();
	$('#id_length_list').empty();

	// Class-I Binding or Processing
	if ($('#pred_tool').val() == "mhci" || $('#pred_tool').val() == "processing") {
		// If it's MHC-I Processing tool and the method used
		// is IEDB recommened, just use NetMHCpan method instead
		if ($("#pred_tool").val() == 'processing'){
			if (method_id == 1){ method_id = 3; }
		}
		
		$.get(method_id + '/' + species + '/' + _allele + '/', function (data) {
			var kvpairs = data.split("\n");
			kvpairs = $.grep(kvpairs,function(n){ return(n); });
			sorted = kvpairs.sort(function(a,b){ return a-b; });
			$('#id_length_list').append("<option></option>");
			$.each(kvpairs, function(key, value) {
				$('#id_length_list')
					.append('<option value="' + value + '">' + value + '</option>');
			});
			if (kvpairs.length > 1){
				$('#id_length_list').append('<option value="All lengths">All lengths</option>');
			}
		});
	}
	// Class-II Binding
	if ($('#pred_tool').val() == "mhcii") {
		
		$.get(method_id + '/' + species + '/' + _allele + '/', function (data) {
			var kvpairs = data.split("\n");
			kvpairs = $.grep(kvpairs,function(n){ return(n); });
			sorted = kvpairs.sort(function(a,b){ return a-b; });
			$('#id_length_list').append("<option></option>");
			$.each(kvpairs, function(key, value) {
				$('#id_length_list')
					.append('<option value="' + value + '">' + value + '</option>');
			});
			if (kvpairs.length > 1){
				$('#id_length_list').append('<option value="All lengths">All lengths</option>');
			}
		});
	}
	// MHC-NP
	else if ($('#pred_tool').val() == "mhcnp") {
		$.get(method_id + '/' + species + '/' + _allele + '/', function (data) {
			var kvpairs = data.split("\n");
			kvpairs = $.grep(kvpairs,function(n){ return(n); });
			sorted = kvpairs.sort(function(a,b){ return a-b; });
			$('#id_length_list').append("<option></option>");
			$.each(kvpairs, function(key, value) {
				$('#id_length_list')
					.append('<option value="' + value + '">' + value + '</option>');
			});
			if (kvpairs.length > 1){
				$('#id_length_list').append('<option value="All lengths">All lengths</option>');
			}
		});
	}
	
	else if ($('#pred_tool').val() == "netchop") {
		
		$.get(method_id + '/' + species + '/' + _allele + '/', function (data) {
			var kvpairs = data.split("\n");
			kvpairs = $.grep(kvpairs,function(n){ return(n); });
			sorted = kvpairs.sort(function(a,b){ return a-b; });
			$('#id_length_list').append("<option></option>");
			$.each(kvpairs, function(key, value) {
				$('#id_length_list')
					.append('<option value="' + value + '">' + value + '</option>');
			});
		});
	}
}

/* returns 'true' or 'false' depending on whether or
not the frequency checkbox is 'checked' */
function is_checked (){
	if ($('#freq').is(":checked") == true) {
		return true;
    } else if ($('#chains').is(":checked") == true) {
		return true;
    } else {
    	return false;
    }
}

/* Parse the HTML table to generate CSV file */
function exportTableToCSV($table, filename) {
	var $rows = $table.find('tr'),

	// Temporary delimiter characters unlikely to be typed by keyboard
	// This is to avoid accidentally splitting the actual contents
	tmpColDelim = String.fromCharCode(11), // vertical tab character
	tmpRowDelim = String.fromCharCode(0), // null character

	// actual delimiter characters for CSV format
	colDelim = '","',
	rowDelim = '"\r\n"',

	// Grab text from table into CSV formatted string
	csv = '"' + $rows.map(function (i, row) {
//		var $row = $(row), $cols = $row.find('td'); 
		var $row = $(row), $cols = $row.children();
		
		return $cols.map(function (j, col) {
			var $col = $(col), text = $col.text();
			text = $.trim(text);
			if(text){
				return text.replace(/"/g, '""'); // escape double quotes
			}
		}).get().join(tmpColDelim);
	}).get().join(tmpRowDelim).split(tmpRowDelim).join(rowDelim).split(tmpColDelim).join(colDelim) + '"',
	// Data URI
	csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
	
	$(this).attr({
		'download': filename,
		'href': csvData,
		'target': '_blank'
	});
}
