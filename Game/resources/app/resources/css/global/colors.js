var color=new function() {
    this.tones={
        min: 0,
        max: 255,
        constrain: function(number) {
            if (number>this.max || number<this.min) {
                notify("Tone color value out of bounds", "function");
            }
            return Math.min(this.max, Math.max(this.min, number));
        }
    };
    this.bases={ 
        min: 30,
        max: 225,
        constrain:function(number) {
            if (number>this.max || number<this.min) {
                notify("Base color value out of bounds", "function");
            }
            return Math.min(this.max, Math.max(this.min, number));
        },
    };
    this.normalizeHSL_SL=function(value) {
        const i_min=0;
        const i_max=255;
        const o_min=0;
        const o_max=100;
        return this.normalize(value, i_min, i_max, o_min, o_max);
    };
    this.normalize100_255=function(value) {
        const i_min=0;
        const i_max=100;
        const o_min=0;
        const o_max=255;
        return this.normalize(value, i_min, i_max, o_min, o_max);
    };
    this.normalizeHSL_H=function(value) {
        const i_min=0;
        const i_max=255;
        const o_min=0;
        const o_max=360;
        return this.normalize(value, i_min, i_max, o_min, o_max);
    };
    this.normalize=function(value, i_min, i_max, o_min, o_max) {
        let part=value/(i_max-i_min);
        return (part*(o_max-o_min)).toFixed(0);
    };
    this.Color=function(H, S, L) {
        this.H=H;
        this.S=S;
        this.L=L;
    };
    this.Color100;
    this.css=function(values) {
        return "hsl("+this.normalizeHSL_H(values.H)+","+this.normalizeHSL_SL(values.S)+"%,"+this.normalizeHSL_SL(values.L)+"%)";
    };
    this.getTones=function(color) {
        return {
            dull: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S-100), this.tones.constrain(color.L)),
            darkest: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S), this.tones.constrain(color.L-70)),
            dark: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S), this.tones.constrain(color.L-40)),
            normal: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S), this.tones.constrain(color.L)),
            bright: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S*1.3), this.tones.constrain(color.L+20)),
            brightest: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S*1.6), this.tones.constrain(color.L+100)),
            bloom: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S*0.4-10), this.tones.constrain(color.L+100))
        }
    };
    this.getPalette=function(fgColor, bgColor) {
        return {
            bg: this.getTones(bgColor),
            fg: this.getTones(fgColor)
        }
    };
    this.palette= undefined;
}
color.Color100=function(H, S, L) {
    this.H=color.normalize100_255(H);
    this.S=color.normalize100_255(S);
    this.L=color.normalize100_255(L);
};