
function editEvent(event) {
  
    $('#event-modal input[name="event-index"]').val(event ? event.id : '');
    $('#event-modal input[name="event-name"]').val(event ? event.evento : '');
    $('#event-modal input[name="event-start-date"]').datepicker('update', event ? event.startDate : '');
    $('#event-modal input[name="event-end-date"]').datepicker('update', event ? event.endDate : '');
    $('#event-modal input[name="_key"]').val(event ? event._key : 0);
    $('#event-modal').modal();

    
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

$(function() {
    var currentYear = new Date().getFullYear();

    $('#calendar').calendar({
        enableContextMenu: true,
        enableRangeSelection: true,
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
            editEvent({ startDate: e.startDate, endDate: e.endDate });
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


    window.onbeforeunload = function() {
        if($('#calendar').data('calendar').hasChanges()){
            return "Are you sure you want to navigate away?";
        }
        
      }
});