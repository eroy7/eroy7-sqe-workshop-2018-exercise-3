import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);

        $('#parsedCode').empty();
        $('#parsedCode').append(' <tr style="background: aqua; border: solid black 1px;"><th>Line</th><th>Type</th><th>Name</th><<th>Condition</th><th>Value</th><<</tr>');

        parsedCode.forEach((line)=>{
            $('#parsedCode').append( '<tr style="border: solid black 1px;"><td>'+line.Line+'</td><td>'+line.Type+'</td><td>'+line.Name+'</td><td>'+line.Condition+'</td><td>'+line.Value+'</td></tr>' );
        });
    });
});
