/**
  * stylebot.widget.ui
  * 
  * UI for Stylebot Widget
  **/
  
stylebot.widget.ui = {
    
    createControl: function(control){
        var el = $('<li>', {
            class: 'stylebot-control-set'
        });
        this.createLabel(control.name).appendTo(el);
        
        // Property specific controls to add to control set
        switch(control.id){
            case 'font-size'        :   this.createTextfield('font-size', 4).appendTo(el);
                                        break;
                                        
            case 'color'            :   this.createTextfield('color', 10).appendTo(el);
                                        break;
                                        
            case 'background-color' :   this.createTextfield('background-color', 10).appendTo(el);
                                        break;
                                        
            case 'display'          :   this.createCheckbox(null, 'display', 'none').appendTo(el);
                                        break;
                                        
            case 'style'            :   var select = this.createSelect('style');
                                        this.createSelectOption("Default", ['font-weight','font-style'], ['','']).appendTo(select);
                                        this.createSelectOption("Bold", ['font-weight','font-style'], ['bold', 'none']).appendTo(select);
                                        this.createSelectOption("Italic", ['font-weight','font-style'], ['normal', 'italic']).appendTo(select);                                        
                                        this.createSelectOption("Bold + Italic", ['font-weight','font-style'], ['bold', 'italic']).appendTo(select);
                                        this.createSelectOption("None", ['font-weight','font-style'], ['normal', 'none']).appendTo(select);
                                        select.appendTo(el);
                                        break;
                                        
            case 'text-decoration'  :   var select = this.createSelect('text-decoration');
                                        this.createSelectOption("Default", 'text-decoration', '').appendTo(select);
                                        this.createSelectOption("Underline", 'text-decoration', 'underline').appendTo(select);
                                        this.createSelectOption("None", 'text-decoration', 'none').appendTo(select);
                                        select.appendTo(el);
                                        break;
        }
        return el;
    },
    
    createTextfield: function(property, size){
        var input = $('<input>',{
            type: 'text',
            id: 'stylebot-' + property,
            class: 'stylebot-control stylebot-textfield',
            size: size
        });
        
        input.data("property", property);
        input.keyup(stylebot.widget.ui.events.onTextFieldKeyUp);
        return input;
    },
    
    createCheckbox: function(text, property, value){
        var checkbox = $('<input>',{
            type: 'checkbox',
            id: 'stylebot' + property,
            class: 'stylebot-control stylebot-checkbox',
            value: value
        });
        
        checkbox.data('property', property);
        checkbox.click(stylebot.widget.ui.events.onCheckboxClick);
        if(text)
        {
            var span = $('<span class="stylebot-control"></span>');
            checkbox.appendTo(span);
            this.createInlineLabel(text).appendTo(span);
            return span;
        }
        else
            return checkbox;
    },
    
    createRadio: function(text, name, property, value){
        var span = $('<span>',{
            id: 'stylebot' + property,
            class: 'stylebot-control'
        });

        var radio = $('<input>',{
            type: 'radio',
            name: name,
            class: 'stylebot-control stylebot-radio'
        });
        
        if(typeof(property) == 'string')
            radio.attr('value', value);
        else
            radio.attr('value', value.join(','));
        
        radio.data('property', property);
        radio.click(stylebot.widget.ui.events.onRadioClick);
        radio.appendTo(span);
        this.createInlineLabel(text).appendTo(span);
        return span;
    },
    
    createSelect: function(property){
        var select = $('<select>', {
            id:'stylebot' + property,
            class: 'stylebot-control stylebot-select'
        });
        select.data('property', property);
        select.change(stylebot.widget.ui.events.onSelectChange);
        return select;
    },
    
    createSelectOption: function(text, property, value){
        var option = $('<option>', {
            class: 'stylebot-select-option',
            html: text
        });
        
        if(typeof(property) == 'string')
            option.attr('value', value);
        else
            option.attr('value', value.join(','));
        option.data('property', property);
        return option;
    },
    
    createLabel: function(text){
        return $('<label>', {
            class: 'stylebot-label',
            html: text
        });
    },
    
    createInlineLabel: function(text){
        return $('<label>', {
            class: 'stylebot-inline-label',
            html: text
        });
    },
    
    createButton: function(text){
        return $('<button>', {
            class: 'stylebot-button',
            html: text
        }).button();
    },
    
    fillControl: function(control, styles){
        switch(control.id){
            case 'font-size'        : 
            case 'color'            :
            case 'background-color' :   var index = stylebot.utils.search(styles, "property", control.id);
                                        if(index != null)
                                            this.getControl(control.id).attr('value', styles[index].value);
                                        break;
            case 'display'          :   var index = stylebot.utils.search(styles, "property", control.id);
                                        if(index != null)
                                        {
                                            if(styles[index].value == 'none')
                                                this.getControl(control.id).attr('checked', true);
                                            else
                                                this.getControl(control.id).attr('checked', false);                                                
                                        }
                                        break;
            case 'style'            :   var index = stylebot.utils.search(styles, "property", "font-weight");
                                        var index2 = stylebot.utils.search(styles, "property", "font-style");
                                        if(index != null)
                                        {
                                            var val = styles[index].value;
                                            var val2 = styles[index2].value;
                                            if(val == 'bold' && val2 == 'italic')
                                                this.getControl(control.id).attr('selectedIndex', 3);
                                            else if(val == 'bold')
                                                this.getControl(control.id).attr('selectedIndex', 1);
                                            else if(val2 == 'italic')
                                                this.getControl(control.id).attr('selectedIndex', 2);
                                            else
                                                this.getControl(control.id).attr('selectedIndex', 4);
                                        }
                                        break;
            case 'text-decoration'  :   var index = stylebot.utils.search(styles, "property", "text-decoration");
                                        if(index != null)
                                        {
                                            if(styles[index].value == 'underline')
                                                this.getControl(control.id).attr('selectedIndex', 1);
                                            else
                                                this.getControl(control.id).attr('selectedIndex', 2);
                                        }
                                        break;
        }
    },
    
    getControl: function(controlId){
        return $('#stylebot-' + controlId);
    }
}