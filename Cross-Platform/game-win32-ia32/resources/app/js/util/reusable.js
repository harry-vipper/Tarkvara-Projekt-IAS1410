function conditionToText(condition) {
    switch(String(condition)) {
        
        case "0":
        return insertText("38");

        case "1":
        return insertText("39");

        case "2":
        return insertText("40");  

        case "3":
        return insertText("41");

        default:
        return insertText("38");
    }
}
function strToHTML(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}
function castToType(type, input) {
    switch(type) {
        case "number":
            let val=Number(input);
            if (isNaN(val) || val==undefined) {throw "Broken file: "+input;}
            return val;
        case "boolean":
            if (input==undefined) {throw "Broken file: "+input;}
            return !!input;
        case "string":
            if (input==undefined) {throw "Broken file: "+input;}
            return input;
        case "contentElementType":
            if (input==undefined || (input!="task" && input!="question")) {throw "Broken file: "+input;}
            return input;
        default:
            throw "Incorrect type conversion type";
    }
}
function checkStructure(object) {
    try {
        object.content.forEach(function(game){
            game.properties.condition=castToType("number", game.properties.condition);
            game.properties.description=castToType("string", game.properties.description);
            game.properties.duration=castToType("number", game.properties.duration);
            game.properties.players.min=castToType("number", game.properties.players.min);
            game.properties.players.max=castToType("number", game.properties.players.max);
            game.properties.title=castToType("string", game.properties.title);
            game.properties.volume=castToType("number", game.properties.volume);


            game.settings.contentElementDuration=castToType("number", game.settings.contentElementDuration);

            game.settings.minigames.mg1=castToType("boolean", game.settings.minigames.mg1);
            game.settings.minigames.mg2=castToType("boolean", game.settings.minigames.mg2);
            game.settings.random=castToType("boolean", game.settings.random);

            game.contentElements.forEach(function(contentElement){
                contentElement.likelyRepeats=castToType("number", contentElement.likelyRepeats);
                contentElement.repeatable=castToType("boolean", contentElement.repeatable);
                contentElement.str=castToType("string", contentElement.str);
                contentElement.type=castToType("contentElementType", contentElement.type);
            });
        });
    }
    catch(error) {
        console.log(error);
        return false;
    }
    return true;
}