load = function (jsFileName) {
    var buffer = new java.io.BufferedReader(new java.io.FileReader(jsFileName));
    var js = '';
    var line = '';
    while(line !== null) {
            var line = buffer.readLine();
            js += line + "\r\n";
    }
    buffer.close();
    return js;
} 