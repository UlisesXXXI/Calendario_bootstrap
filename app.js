
function editEvent(event) {
  
    // $('#event-modal input[name="event-index"]').val(event ? event.id : '');
    // $('#event-modal input[name="event-name"]').val(event ? event.evento : '');
    // $('#event-modal input[name="event-start-date"]').datepicker('update', event ? event.startDate : '');
    // $('#event-modal input[name="event-end-date"]').datepicker('update', event ? event.endDate : '');
    // $('#event-modal input[name="_key"]').val(event ? event._key : 0);
    // $('#event-modal').modal();
    
    

    event.seleccionados.each(index => {
        var ele = $(event.seleccionados[index]);
        if(ele.hasClass('checked')){
            ele.removeClass('checked');
        }else{
            ele.addClass('checked');
        }
    });
   

    
}

function deleteEvent(event) {
    $('#calendar').data('calendar').deleteEvent(event);
}

function saveEvent() {
    var event = {
        id: $('#event-modal input[name="event-index"]').val(),
        evento: $('#event-modal input[name="event-name"]').val(),
        startDate: $('#event-modal input[name="event-start-date"]').datepicker('getDate'),
        endDate: $('#event-modal input[name="event-end-date"]').datepicker('getDate'),
        _key: $('#event-modal input[name="_key"]').val()
    }
    
    
    if(event.id=='' && event._key =='') {

        $('#calendar').data('calendar').addEvent(event,false);
    }
    else
    {
        
        $('#calendar').data('calendar').updatedEvent(event,false);

    }
    
   
    $('#event-modal').modal('hide');
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return undefined;
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    if(exdays){
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }else{
        document.cookie = cname + "=" + cvalue  +";path=/";
    }
    
  }

function addEvents(){
    $("#config-btn-calendar").click(function(){
        var language = getCookie("language-calendar") || 'es';
        $('#idioma-calendario').val(language);
        $("#config-modal").modal();
        
    });

    $("#idioma-calendario").change(function(event){
       var language = event.target.value;
       setCookie("language-calendar",language);
       $('#calendar').data('calendar').setLanguage(language);

    });

    window.onbeforeunload = function() {
        if($('#calendar').data('calendar').hasChanges()){
            return "Are you sure you want to navigate away?";
        }
        
      }
}



$(function() {
    var languagePorDefecto = "es";
    var currentYear = new Date().getFullYear();
    var language = getCookie("language-calendar") || languagePorDefecto ;
    console.log(language);
    $('#calendar').calendar({
        enableContextMenu: true,
        enableRangeSelection: true,
        language: language,
        contextMenuItems:[
            {
                text: 'Editar',
                click: editEvent
            },
            {
                text: 'Eliminar',
                click: deleteEvent
            }
        ],
        selectRange: function(e) {
            editEvent(e);
        },
        mouseOnDay: function(e) {
            if(e.events.length > 0) {
                var content = '';
                
                for(var i in e.events) {
                    content += '<div class="event-tooltip-content">'
                                    + '<div class="event-name" style="color:' + e.events[i].color + '">' + e.events[i].evento + '</div>'
                                + '</div>';
                }
            
                $(e.element).popover({
                    trigger: 'manual',
                    container: 'body',
                    html:true,
                    content: content
                });
                
                $(e.element).popover('show');

                console.log(e.events);
            }
        },
        mouseOutDay: function(e) {
            if(e.events.length > 0) {
                $(e.element).popover('hide');
            }
        },
        dayContextMenu: function(e) {
            $(e.element).popover('hide');
        },
        dataSource: []
        
    });
    
    $('#save-event').click(function() {
        saveEvent();
    });


    addEvents();



});