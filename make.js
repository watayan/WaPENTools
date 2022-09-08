"use strict";

var sources;
var filenameSelect;
var sourceTextarea;
var convert;
var save_file;

function reset()
{
    sources = [];
}

function convert_sample()
{
    var rtnv = '"use strict";\nvar sample=[';
    for(var source of sources)
    {
        var lines = source.split("\n");
        for(var line of lines)
        {
            line = line.replace(/\\/g,'\\\\');
            line = line.replace(/"/g,'\\"');
            rtnv += '"' + line + '\\n" +\n';
        }
        rtnv += '"",';
    }
    return rtnv + '];\n';
}

function convert_answer()
{
    var rtnv = '"use strict";\nvar Quizzes=[\n';
    for(var source of sources)
    {
        var title = '', question = '', input = [], output = [], timeout = -1;
        var item_name = null;
        var buff = [];
        var re = /^\[(.*)\]$/;
        var lines = source.split("\n");
        for(var line of lines)
        {
            var result = re.exec(line);
            if(result)
            {
                if(item_name == 'TITLE') title = buff.join('');
                else if(item_name == 'QUESTION') question = buff.join('<BR>');
                else if(item_name == 'INPUT') input.push(buff.join(','));
                else if(item_name == 'OUTPUT') output.push(buff.join('\\n'));
                else if(item_name == 'TIMEOUT') timeout = Number(buff.join(','));
                buff = [];
                item_name = result[1].toUpperCase();
            }
            else
            {
                line = line.replace(/\\/g,'\\\\');
                line = line.replace(/"/g,'\\"');
                if(item_name == 'INPUT') buff.push("'" + line + "'");
                else buff.push(line);
            }
        }
        if(item_name == 'TITLE') title = buff.join('');
        else if(item_name == 'QUESTION') question = buff.join('<BR>');
        else if(item_name == 'INPUT') input.push(buff.join(','));
        else if(item_name == 'OUTPUT') output.push(buff.join('\\n'));
        else if(item_name == 'TIMEOUT') timeout = Number(buff.join(','));
        rtnv += "new Quiz('" + title + "',\n";
        rtnv += "'" + question + "',\n";
        rtnv += '[';
        for(var i of input) rtnv += "[" + i + "],";
        rtnv += '],'
        rtnv += '[';
        for(var o of output) rtnv += "'" + o.replace(/\\n$/,'') + "',";
        rtnv += ']'
        if(timeout > 0) rtnv += ',' + timeout;
        rtnv += '),\n';
        title = ''; question = ''; input = []; output = []; timeout = -1; buff = [];
    }
    return rtnv + '];\n';
}

onload = function(){
    reset();
    sourceTextarea = document.getElementById("source");
    filenameSelect = document.getElementById("filenames");
    if(mode == 1)
    {
        convert = convert_sample;
        save_file = "sample.js";
    }
    else if(mode == 2)
    {
        convert = convert_answer;
        save_file = "answer.js"
    }
    document.getElementById("uploadLink").addEventListener("change", function(ev)
    {
        var files = ev.target.files;
        for(var file of files)  // 1つしかないが
        {
            var reader = new FileReader();
            var option = document.createElement('option');
            option.innerHTML = file.name;
            filenames.appendChild(option);
            reader.readAsText(file, "UTF-8");
            reader.onload = function(e)
            {
                var text = reader.result;
                sources.push(text)
                filenameSelect.selectedIndex = filenameSelect.length - 1;
                filenameSelect.onchange();
            }
        }
    }
    ,false);
    sourceTextarea.onchange = function()
    {
        var n = filenameSelect.selectedIndex;
        if(n >= 0) sources[n] = sourceTextarea.value;
    }
    document.getElementById("downloadLink").onclick = function()
    {
        var blob = new Blob([convert()], {type:"text/plain"});
        if(window.navigator.msSaveBlob)
        {
            window.navigator.msSaveBlob(blob, filename);
        }
        else
        {
            window.URL = window.URL || window.webkitURL;
            downloadLink.setAttribute("href", window.URL.createObjectURL(blob));
            downloadLink.setAttribute("download", save_file);
        }
    };
    filenameSelect.onchange = function()
    {
        var n = filenameSelect.selectedIndex;
        if(n >= 0) sourceTextarea.value = sources[n];
        else sourceTextarea.value = '';
    };
    document.getElementById("upButton").onclick = function()
    {
        var n = filenameSelect.selectedIndex;
        if(n > 0)
        {
            var temp = sources[n - 1];
            sources[n - 1] = sources[n];
            sources[n] = temp;
            temp = filenameSelect.item(n);
            filenameSelect.remove(n);
            filenameSelect.add(temp, n - 1);
        }
    };
    document.getElementById("downButton").onclick = function()
    {
        var n = filenameSelect.selectedIndex;
        if(n >= 0 && n < filenameSelect.length - 1)
        {
            var temp = sources[n + 1];
            sources[n + 1] = sources[n];
            sources[n] = temp;
            temp = filenameSelect.item(n + 1);
            filenameSelect.remove(n + 1);
            filenameSelect.add(temp, n);
        }
    };
    this.document.getElementById("deleteButton").onclick = function()
    {
        var n = filenameSelect.selectedIndex;
        if(n >= 0)
        {
            filenameSelect.remove(n);
            sources.splice(n, 1);
            if(filenameSelect.length <= n) n--;
            filenameSelect.selectedIndex = n;
            filenameSelect.onchange();
        }
    }
}
