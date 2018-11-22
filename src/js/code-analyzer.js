import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    let parsedList = [];
    let parsedCode = esprima.parseScript(codeToParse,{loc:true});
    parsedList = Array.from(parsedCode.body).reduce((acc,curr)=>acc.concat(parseItem(curr)),parsedList);
    return parsedList;
};

const parseItemMap = {'FunctionDeclaration': (item)=> {return parseFuncDec(item);},
    'BlockStatement': (item)=> {return Array.from(item.body).reduce((acc,curr)=>acc.concat(parseItem(curr)),[]);},
    'VariableDeclaration': (item)=> {return parseVarDec(item);},
    'ExpressionStatement': (item)=> {return parseExpStmt(item);},
    'WhileStatement': (item)=> {return parseWhile(item);},
    'IfStatement': (item)=> {return parseIf(item);},
    'ReturnStatement': (item)=> {return [{Line: item.loc.start.line, Type: 'return statement', Name: '', Condition: '', Value: parseExp(item.argument)}];},
    'ForStatement': (item)=> {return parseFor(item);},
    'AssignmentExpression': (item)=> {return parseAssStmt(item);},
    'UpdateExpression': (item)=>{return item.prefix?[{Line: item.loc.start.line, Type: 'assignment statement', Name: item.argument.name, Condition: '', Value: item.operator + item.argument.name}]:[{Line: item.loc.start.line, Type: 'assignment statement', Name: item.argument.name, Condition: '', Value: item.argument.name + item.operator}];},
};

const parseItem = (item) => {
    return parseItemMap[item.type](item);
};

const parseFor = (item) => {
    let list = [{Line: item.test.loc.start.line, Type: 'for statement', Name: '', Condition: parseExp(item.test), Value: ''}];
    list = list.concat(parseItem(item.init));
    list = list.concat(parseItem(item.update));
    list = list.concat(parseItem(item.body));
    return list;
};

const parseIf = (item) => {
    let list = [{Line: item.test.loc.start.line, Type: 'if statement', Name: '', Condition: parseExp(item.test), Value: ''}];
    list = list.concat(parseItem(item.consequent));
    if(item.alternate != null && item.alternate.type === 'IfStatement')
        list = list.concat(parseElseIf(item.alternate));
    else if(item.alternate != null )
        list = list.concat(parseItem(item.alternate));
    return list;
};

const parseElseIf = (item) => {
    let list = [{Line: item.test.loc.start.line, Type: 'else if statement', Name: '', Condition: parseExp(item.test), Value: ''}];
    list = list.concat(parseItem(item.consequent));
    if(item.alternate != null && item.alternate.type === 'IfStatement')
        list = list.concat(parseElseIf(item.alternate));
    else if(item.alternate != null )
        list = list.concat(parseItem(item.alternate));
    return list;
};

const parseWhile = (item) => {
    let list = [{Line: item.test.loc.start.line, Type: 'while statement', Name: '', Condition: parseExp(item.test), Value: ''}];
    return list.concat(parseItem(item.body));
};

const parseExpStmt = (item) => {
    if(item.expression.type === 'AssignmentExpression' && item.expression.operator === '='){
        return [{Line: item.expression.left.loc.start.line, Type: 'assignment expression', Name: item.expression.left.name, Condition: ' ',Value: parseExp(item.expression.right)}];
    }
    else
        return parseItem(item.expression);

};

const parseAssStmt = (item) =>{
    return [{Line: item.left.loc.start.line, Type: 'assignment expression', Name: item.left.name, Condition: ' ',Value: parseExp(item.right)}];
};

const parseExp = (exp) => {
    return parseExpMap[exp.type](exp);
};

const parseExpMap = {'Literal': (exp)=> {return exp.raw;},
    'BinaryExpression': (exp)=> {return (complexTypes.includes(exp.left.type)?('('+parseExp(exp.left)+')'):parseExp(exp.left))
                                + ' ' +exp.operator + ' '
                                + (complexTypes.includes(exp.right.type)?('('+parseExp(exp.right)+')'):parseExp(exp.right));},
    'Identifier': (exp)=> {return exp.name;},
    'UnaryExpression': (exp)=> {return exp.operator + (complexTypes.includes(exp.argument.type)?('('+parseExp(exp.argument)+')'):parseExp(exp.argument));},
    'MemberExpression': (exp)=> {return parseExp(exp.object)+ '[' + parseExp(exp.property) +']';},
    'UpdateExpression': (exp)=> {return parseExp(exp.argument) + exp.operator;},
    'LogicalExpression': (exp)=> {return (complexTypes.includes(exp.left.type)?('('+parseExp(exp.left)+')'):parseExp(exp.left))
        + ' ' +exp.operator + ' '
        + (complexTypes.includes(exp.right.type)?('('+parseExp(exp.right)+')'):parseExp(exp.right));}
};

const complexTypes = ['BinaryExpression','UnaryExpression','LogicalExpression'];

const parseFuncDec = (item) => {
    let list = [];
    list.push({Line: item.id.loc.start.line, Type: 'function declaration',Name: item.id.name, Condition: ' ',Value: ' '});
    list = Array.from(item.params).reduce((acc,curr)=>acc.concat(parseParam(curr)),list);
    list = list.concat(parseItem(item.body));
    return list;
};

const parseVarDec = (item) => {
    return Array.from(item.declarations).reduce((acc,curr)=>
        acc.concat([{Line: curr.id.loc.start.line, Type: 'variable declaration',Name: curr.id.name, Condition: ' ',Value: curr.init==null?'NULL':parseExp(curr.init)}]) ,[]);
};

const parseParam = (param) => {
    return [{Line: param.loc.start.line, Type: 'variable declaration',Name: param.name, Condition: ' ',Value: ' '}];
};
export {parseCode};
