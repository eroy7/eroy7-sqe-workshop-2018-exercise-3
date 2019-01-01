import $ from 'jquery';
import {parseCode,subInputVector} from './code-analyzer';
import * as esgraph from 'esgraph';
import Viz from 'viz.js';
import {Module,render} from 'viz.js/full.render.js';
import * as escodegen from 'escodegen';

let drawNodes;
let inputVector;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        drawNodes = {}; inputVector = null;
        let codeToParse = $('#codePlaceholder').val();
        inputVector = $('#inputVector').val()===''?null:JSON.parse($('#inputVector').val());
        let parsedCode = parseCode(codeToParse);
        let cfg = cleanCFG(esgraph(parsedCode.body));
        for(let i = 0; i < cfg[2].length; i++) {
            cfg[2][i].indexInGraph = i;
            drawNodes[i] = 'none';
        }
        if(inputVector != null) cfg[2][0] = drawCFG(cfg[2][0],true);
        let dotInput = setDOT(esgraph.dot(cfg,{counter:0, source: codeToParse}));
        let dot = 'digraph{' + dotInput + '}';
        let graphElement = document.getElementById('graph');
        let viz = new Viz({Module,render});
        viz.renderSVGElement(dot).then(element =>{graphElement.innerHTML = '';graphElement.append(element);});
    });
});

let cleanCFG = (cfg)=> {
    cfg[2].splice(0,1);
    cfg[2].splice(cfg[2].length - 1, 1);
    for(let i = 0; i < cfg[2].length; i++){
        if(cfg[2][i].next[0].type === 'exit')
            cfg[2][i].next.splice(0,1);
        if(cfg[2][i].normal != undefined && cfg[2][i].normal.type === 'exit')
            cfg[2][i].normal = undefined;

        cfg[2][i].exception = undefined;
    }
    return cfg;
};

let setDOT = (dot) => {
    let lineCounter = 1, isDiamond = false, dotLines = dot.split('\n');
    for(let i = 0; i < dotLines.length; i++) {
        dotLines[i] = dotLines[i].replace('true', 'T').replace('false', 'F');
        if(!dotLines[i].includes('->')){
            isDiamond = false;
            ifWhileSigns.forEach((sign) => {
                if(dotLines[i].includes(sign) && !isDiamond) {
                    dotLines[i] = dotLines[i].replace('[', '[shape="diamond",');
                    isDiamond = true;
                }
            });
            if(!isDiamond) dotLines[i] = dotLines[i].replace('[','[shape="square",');
            dotLines[i] = dotLines[i].replace('label="','label="-'+ lineCounter++ +'-\n');
            if(drawNodes[i] === 'green') dotLines[i] = dotLines[i].replace('[','[style="filled", color= "green",');
        }
    }
    return dotLines.join('\n');
};

let drawCFG = (node,draw) =>{
    if(drawNodes[node.indexInGraph] === 'green' || (drawNodes[node.indexInGraph] === 'gray' && !draw))
        return node;
    if(draw)
        node = handleDraw(node);

    node = continueDrawing(node,draw);
    return node;
};

const handleDraw = node => {
    drawNodes[node.indexInGraph] = 'green' ;
    if(node.parent.type === 'IfStatement') {
        let lineEval = subInputVector(escodegen.generate(node.astNode), inputVector);
        node.true = drawCFG(node.true, lineEval);
        node.false = drawCFG(node.false, !lineEval);
    }
    return node;
};

const continueDrawing = (node,draw) => {
    if(drawNodes[node.indexInGraph] != 'green')
        drawNodes[node.indexInGraph] = 'gray' ;
    if(node.parent.type != 'IfStatement') {
        for (let i = 0; i < node.next.length; i++)
            node.next[i] = drawCFG(node.next[i], draw);
    }
    return node;
};

const ifWhileSigns = ['===','>','<','==','>=','<=','&&','||'];