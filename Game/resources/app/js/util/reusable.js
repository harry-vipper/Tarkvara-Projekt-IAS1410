function conditionToText(condition) {
    console.log(condition);
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