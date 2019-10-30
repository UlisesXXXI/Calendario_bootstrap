//obtain Prototipe of Calendar
var prototipo = Object.getPrototypeOf($.fn.calendar())


//Add new properties
prototipo._key = 0;

prototipo._autoIncrementId = function(){
    this._key += 1;
    return this._key;
}

prototipo._tipoEvento= {
    unchanged:0,
    modified:1,
    inserted:2,
    deleted:3
}

prototipo._cacheChanges = [];

//Add new Methods

prototipo._addEvent = prototipo.addEvent;

prototipo.addEvent= function(evt, preventRendering) {
    
    
    if(evt._key == ''){

        evt._key = this._autoIncrementId();

        evt.state = this._tipoEvento.inserted;

        this._cacheChanges.push(evt);
    
        
        this._addEvent(evt,true);
        if(!preventRendering){
            this._initializeDatasourceColors();
            this.render();
        }

    }else{
        this.updatedEvent(evt,preventRendering)
    }

    
    
}


prototipo._initializeDatasourceColors= function() {
    console.log("entro");
    for(var i = 0; i < this.options.dataSource.length; i++) {
        if(this.options.dataSource[i].color == null) {
            this.options.dataSource[i].color = '#2C8FC9';
            console.log("entro");
        }
    }
},

prototipo.deleteEvent = function(evt,preventRendering){

    debugger;
    for(var i=0; i<=this.options.dataSource.length ; i++){

        if(this.options.dataSource[i]._key === evt._key){

            var del = this.options.dataSource[i];

            del.state = this._tipoEvento.deleted;

            var existia = false;

            for(var k=0;k<this._cacheChanges.length && !existia; k++){

                if(this._cacheChanges[k]._key == del._key)
                {
                    this._cacheChanges.splice(k,1);

                    existia = true;

                    break;
                }
            }

            if(!existia){

                this._cacheChanges.push(del);

            }
            
            this.options.dataSource.splice(i,1);

            break;
        }
    }
    if(!preventRendering){
        this._initializeDatasourceColors();
        this.render();
    }
    
}

prototipo.updatedEvent = function(evt,preventRendering){

    debugger;
    for(var i=0; i<this.options.dataSource.length ; i++){

        if(this.options.dataSource[i]._key == evt._key){

            this.options.dataSource[i] = evt;
            
            var existia = false;

            for(var k=0;k<this._cacheChanges.length; k++){

                if(this._cacheChanges[k]._key == evt._key)
                {
                    
                    var estadoAnterior =this._cacheChanges[k].state;
                    
                    evt.state = estadoAnterior;

                    this._cacheChanges[k] = evt;

                    existia = true;

                    break;

                }
            }

            if(!existia){

                evt.state = this._tipoEvento.modified;

                this._cacheChanges.push(evt);
            }
            
           this.options

           break;
        }
    }

    if(!preventRendering){
        this._initializeDatasourceColors();
        this.render();
    }
    
}

//sobreescrito _openContextMenu
prototipo._openContextMenu= function(elt) {
    
    var contextMenu = $('.calendar-context-menu');
    
    if(contextMenu.length > 0) {
        contextMenu.hide();
        contextMenu.empty();
    }
    else {
        contextMenu = $(document.createElement('div'));
        contextMenu.addClass('calendar-context-menu');
        $('body').append(contextMenu);
    }
    
    var date = this._getDate(elt);
    var events = this.getEvents(date);
    
    for(var i = 0; i < events.length; i++) {
        var eventItem = $(document.createElement('div'));
        eventItem.addClass('item');
        eventItem.css('border-left', '4px solid ' + events[i].color);
        
        var eventItemContent = $(document.createElement('div'));
        eventItemContent.addClass('content');
        eventItemContent.text(events[i].evento);
        
        eventItem.append(eventItemContent);
        
        var icon = $(document.createElement('span'));
        icon.addClass('glyphicon glyphicon-chevron-right');
        
        eventItem.append(icon);
        
        this._renderContextMenuItems(eventItem, this.options.contextMenuItems, events[i]);
        
        contextMenu.append(eventItem);
    }
    
    if(contextMenu.children().length > 0)
    {
        contextMenu.css('left', elt.offset().left + 25 + 'px');
        contextMenu.css('top', elt.offset().top + 25 + 'px');
        contextMenu.show();
        
        $(window).one('mouseup', function() {
            contextMenu.hide();
        });
    }
}

prototipo.hasChanges = function(){
    if(this._cacheChanges != null && this._cacheChanges.length>0){
        return true;
    }
    

    return false;

}

prototipo.getChanges = function(){
    
    

    return this._cacheChanges || [];

}