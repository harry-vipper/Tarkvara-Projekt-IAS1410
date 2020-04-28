function conditionToText(condition) {
    if(condition===0){
        return insertText("38");
    }
    if(condition===1){
        return insertText("39");
    }
    if(condition===2){
        return insertText("40");
    }
    if(condition===3){
        return insertText("41");
    }
}
function strToHTML(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}