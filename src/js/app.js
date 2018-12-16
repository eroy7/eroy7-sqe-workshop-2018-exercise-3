import $ from 'jquery';
import {parseCode,subInputVector} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let inputVecor = $('#inputVector').val()===''?null:JSON.parse($('#inputVector').val());
        let parsedCode = parseCode(codeToParse);
        //('#codePlaceholder').val(JSON.stringify(parsedCode));
        //$('#linesToPrint').val(JSON.stringify(parsedCode, null, 2));
        $('#linesToPrint').empty();
        parsedCode.forEach((line)=>{
            if(inputVecor != null && line.includes('if')) {
                if (subInputVector(line.split('if')[1].substring(0, line.split('if')[1].length - 1), inputVecor))
                    $('#lin0esToPrint').append('<p style="background: greenyellow">' + line + '<br></p>');
                else
                    $('#linesToPrint').append( '<p style="background: firebrick">'+line+'<br></p>' );
            }
            else
                $('#linesToPrint').append( '<p>'+line+'<br></p>' );
        });
    });
});
