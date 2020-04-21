var color=new function() {
    this.hue={
        min: 0,
        max: 100,
        constrain: function(number) {
            if (number>this.max || number<this.min) {
                notify("Hue value out of bounds", "function");
            }
            return Math.min(this.max, (Math.max(this.min, number)));
        },
        normalize:function(value) {
            let part=value/(100);
            return (part*(360)).toFixed(0);
        },
    };
    this.saturation={ 
        min: 0,
        max: 100,
        constrain:function(number) {
            if (number>this.max || number<this.min) {
                notify("Saturation value out of bounds", "function");
            }
            return Math.min(this.max, (Math.max(this.min, number)));
        },
    };
    this.lightness={ 
        min: 10,
        max: 100,
        constrain:function(number) {
            if (number>this.max || number<this.min) {
                notify("Lightness value out of bounds", "function");
            }
            return Math.min(this.max, (Math.max(this.min, number)));
        },
    };
    
    this.Color=function(H, S, L) {
        this.H=H;
        this.S=S;
        this.L=L;
    };
   
    this.css=function(values) {
        return "hsl("+this.hue.normalize(values.H)+","+(values.S).toFixed(0)+"%,"+(values.L).toFixed(0)+"%)";
    };
    this.getTones=function(color) {
        return {
            dull: new this.Color(
                this.hue.constrain(color.H), 
                this.saturation.constrain(color.S-100), 
                this.lightness.constrain(color.L)
            ),
            darkest: new this.Color(
                this.hue.constrain(color.H), 
                this.saturation.constrain(color.S), 
                this.lightness.constrain(color.L-30)
            ),
            dark: new this.Color(
                this.hue.constrain(color.H), 
                this.saturation.constrain(color.S), 
                this.lightness.constrain(color.L-10)
            ),
            normal: new this.Color(
                this.hue.constrain(color.H), 
                this.saturation.constrain(color.S), 
                this.lightness.constrain(color.L)
            ),
            bright: new this.Color(
                this.hue.constrain(color.H), 
                this.saturation.constrain(color.S), 
                this.lightness.constrain(color.L+20)
            ),
            brightest: new this.Color(
                this.hue.constrain(color.H), 
                this.saturation.constrain(color.S), 
                this.lightness.constrain(color.L+50)
            ),
            bloom: new this.Color(
                this.hue.constrain(color.H), 
                this.saturation.constrain(color.S+100),
                this.lightness.constrain(color.L)
            )
        }
    };
    this.getPalette=function(fgColor, bgColor) {
        return {
            bg: this.getTones(bgColor),
            fg: this.getTones(fgColor)
        }
    };
    this.palette= undefined;

    this.setColor=function(){
            let colors=file.savefile.content.settings.color;
            this.bgcolor=new this.Color(colors.background[0],colors.background[1],colors.background[2]);
            this.fgcolor=new this.Color(colors.foreground[0],colors.foreground[1],colors.foreground[2]);
            this.palette=this.getPalette(this.fgcolor,this.bgcolor);
        
        
            return document.getElementById("color-style").innerHTML=`:root {
                --fgColor-dull: `+this.css(this.palette.fg.dull)+`;
                --fgColor-darkest: `+this.css(this.palette.fg.darkest)+`;
                --fgColor-dark: `+this.css(this.palette.fg.dark)+`;
        
                --fgColor-normal: `+this.css(this.palette.fg.normal)+`;
                
                --fgColor-bright: `+this.css(this.palette.fg.bright)+`;
                --fgColor-brightest: `+this.css(this.palette.fg.brightest)+`;
                --fgColor-bloom: `+this.css(this.palette.fg.bloom)+`;
        
        
                --bgColor-dull: `+this.css(this.palette.bg.dull)+`;
                --bgColor-darkest: `+this.css(this.palette.bg.darkest)+`;
                --bgColor-dark: `+this.css(this.palette.bg.dark)+`;
        
                --bgColor-normal: `+this.css(this.palette.bg.normal)+`;
                
                --bgColor-bright: `+this.css(this.palette.bg.bright)+`;
                --bgColor-brightest: `+this.css(this.palette.bg.brightest)+`;
                --bgColor-bloom: `+this.css(this.palette.bg.bloom)+`;
        
                --primaryColor: var(--fgColor-normal);
                --secondaryColor: var(--bgColor-darkest);
                --footerColor: var(--fgColor-normal);
                --footerGroupTitleColor: var(--fgColor-dull);
            }`;
    };
}