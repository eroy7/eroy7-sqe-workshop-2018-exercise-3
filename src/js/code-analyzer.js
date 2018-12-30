import * as esprima from 'esprima';
import * as escodegen from 'escodegen';



const parseCode = (codeToParse) => {
    let parsedCode = esprima.parseScript(codeToParse,{range: true});
    //return parsedCode
    let env = [];
    //parsedCode.body = [];
    return handleFunction(parsedCode.body[0],env);
    //parsedCode.body[0].body = parsedFunction.body;
    //return escodegen.generate(parsedCode);
};

//code

const handleItemMap = {/*'FunctionDeclaration': (item)=> {return parseFuncDec(item);},*/
    /*'BlockStatement': (item,env)=> {item.body = Array.from(item.body).reduce((acc,curr)=>acc.concat(handleItem(curr,env)),[]); return item;},
    'VariableDeclaration': (item,env)=> {return handleVarDec(item,env);},
    'ExpressionStatement': (item,env)=> {item.expression = handleItem(item.expression,env); return item;},*/
    'WhileStatement': (item,env)=> {return handleWhile(item,env);},
    'IfStatement': (item,env)=> {return handleIf(item,env);},
    'ReturnStatement': (item,env)=> {item.argument = subLeft(item.argument,env); return item;},
    'ForStatement': (item,env)=> {return handleFor(item,env);},
    //'AssignmentExpression': (item,env)=> {item.right = subLeft(item.right,env); return item;},
    'UpdateExpression': (item)=>{return item;},
    'ExpressionStatement': (item)=>{return item;}
};

const handleItem = (item,env) => {
    return handleItemMap[item.type](item,env);
};

const handleFor = (item,env) => {
    item.init.right = subLeft(item.init.right,env);
    item.test = subLeft(item.test,env);
    item.update = handleItem(item.update,env);
    if(item.body.type === 'BlockStatement') {
        item.body.body = Array.from(item.body.body).reduce((acc, curr) => {return handleBody(acc, curr, env);}, []);
        //item.body.body = item.body.body.filter((item) => filterLines(item));
    }
    else /*if(item.body.type === 'ExpressionStatement' && item.body.expression.type === 'AssignmentExpression')*/{
        item.body.expression.right= subLeft(item.body.expression.right,env);
        //env = Array.from(env).map((ass) => {if(ass.Key === item.body.expression.left.name) ass.Value = item.body.expression.right; return ass;});
    }
    /*else if(item.body.type === 'AssignmentExpression'){
        env = env.concat(handleAssStmt(item.body, env));
        item.body.right= subLeft(item.body.right,env);
    }*/
    return item;
};

const handleIf = (item,env) => {
    let defEnv = env.reduce((acc,curr) => acc.concat({Key: curr.Key, Value: curr.Value}),[]);
    item.test = subLeft(item.test, env);
    handleConsequent(item,env);
    if (item.alternate != null)
        handleAlternate(item,defEnv);
    return item;
};

const handleConsequent = (item,env) => {
    if(item.consequent.type === 'BlockStatement') {
        item.consequent.body = Array.from(item.consequent.body).reduce((acc, curr) => {return handleBody(acc, curr, env);}, []);
        //item.consequent.body = item.consequent.body.filter((item) => filterLines(item));
    }
    else /*if(item.consequent.type === 'ExpressionStatement' && item.consequent.expression.type === 'AssignmentExpression')*/{
        item.consequent.expression.right= subLeft(item.consequent.expression.right,env);
        //env = Array.from(env).map((ass) => {if(ass.Key === item.consequent.expression.left.name) ass.Value = item.consequent.expression.right; return ass;});
    }
    /*else if(item.consequent.type === 'AssignmentExpression'){
        env = env.concat(handleAssStmt(item.consequent, env));
        item.consequent.right= subLeft(item.consequent.right,env);
    }*/
};

const handleAlternate = (item, defEnv) => {
    if(item.alternate.type === 'BlockStatement') {
        item.alternate.body = Array.from(item.alternate.body).reduce((acc, curr) => {return handleBody(acc, curr, defEnv);}, []);
        //item.alternate.body = item.alternate.body.filter((item) => filterLines(item));
    }
    else if(item.alternate.type === 'ExpressionStatement' && item.alternate.expression.type === 'AssignmentExpression'){
        item.alternate.expression.right= subLeft(item.alternate.expression.right,defEnv);
        //defEnv = Array.from(defEnv).map((ass) => {if(ass.Key === item.alternate.expression.left.name) ass.Value = item.alternate.expression.right; return ass;});
    }
    /*else if(item.alternate.type === 'AssignmentExpression'){
        defEnv = defEnv.concat(handleAssStmt(item.alternate, defEnv));
        item.alternate.right= subLeft(item.alternate.right,defEnv);
    }*/
    else
        item.alternate = handleItem(item.alternate,defEnv);
};

const handleBody = (acc,curr,env) => {
    if(curr.type === 'VariableDeclaration') {
        env = env.concat(handleVarDec(curr, env));
        curr.declarations[0].init = subLeft(curr.declarations[0].init,env);
        return acc.concat(curr);
    }
    else if(curr.type === 'ExpressionStatement' && curr.expression.type === 'AssignmentExpression'){
        curr.expression.right= subLeft(curr.expression.right,env);
        env = Array.from(env).map((ass) => {if(ass.Key === curr.expression.left.name) ass.Value = curr.expression.right; return ass;});
        return acc.concat(curr);
    }
    /*else if(curr.type === 'AssignmentExpression'){
        env = env.concat(handleAssStmt(curr, env));
        curr.right= subLeft(curr.right,env);
        return acc.concat(curr);
    }*/
    else
        return acc.concat(handleItem(curr,env));
};

const handleWhile = (item,env) => {
    item.test = subLeft(item.test, env);
    if(item.body.type === 'BlockStatement') {
        item.body.body = Array.from(item.body.body).reduce((acc, curr) => {return handleBody(acc, curr, env);}, []);
        //item.body.body = item.body.body.filter((item) => filterLines(item));
    }
    else /*if(item.body.type === 'ExpressionStatement' && item.body.expression.type === 'AssignmentExpression')*/{
        item.body.expression.right= subLeft(item.body.expression.right,env);
        //env = Array.from(env).map((ass) => {if(ass.Key === item.body.expression.left.name) ass.Value = item.body.expression.right; return ass;});
    }
    /*else if(item.body.type === 'AssignmentExpression'){
        env = env.concat(handleAssStmt(item.body, env));
        item.body.right= subLeft(item.body.right,env);
    }*/
    return item;
};

/*const handleAssStmt = (item,env) =>{
    item.right = subLeft(item.right,env);
    return [{Key: item.left.name , Value: item.right}];
};*/

const subLeft = (exp,env) => {
    exp = subLeftMap[exp.type](exp,env);
    return exp;
};

const subLeftMap = {'Literal': (exp/*,env*/)=> {/*env.map((ass) => {if(ass.Key === exp.raw)exp=ass.Value;});*/ return exp;},
    'BinaryExpression': (exp,env)=> {exp.left = subLeft(exp.left,env); exp.right = subLeft(exp.right,env); return exp;},
    'Identifier': (exp,env)=> {Array.from(env).map((ass) => {if(ass.Key === exp.name)exp=ass.Value;}); return exp;},
    'UnaryExpression': (exp,env)=> {exp.argument = subLeft(exp.argument,env); return exp;},
    //'MemberExpression': (exp,env)=> {exp.object = subLeft(exp.object,env); exp.property = subLeft(exp.property,env); return exp;},
    /*'UpdateExpression': (exp)=> {return parseExp(exp.argument) + exp.operator;},*/
    'LogicalExpression': (exp,env)=> {exp.left = subLeft(exp.left,env);exp.right = subLeft(exp.right,env);return exp;}
};

/*const complexTypes = ['BinaryExpression','UnaryExpression','LogicalExpression'];*/

const handleFunction = (item,env) => {
    Array.from(item.body).concat(Array.from(item.body.body).reduce((acc,curr) => {
        if(curr.type === 'VariableDeclaration') {
            env = env.concat(handleVarDec(curr, env));
            return acc;
        }
        else if(curr.type === 'ExpressionStatement' && curr.expression.type === 'AssignmentExpression'){
            curr.expression.right= subLeft(curr.expression.right,env);
            //env = Array.from(env).map((ass) => {if(ass.Key === curr.expression.left.name) ass.Value = curr.expression.right; return ass;});
            return acc.concat(curr);
        }
        /*else if(curr.type === 'AssignmentExpression'){
            env = env.concat(handleAssStmt(curr, env));
            curr.right= subLeft(curr.right,env);
            return acc.concat(curr);
        }*/
        else return acc.concat(handleItem(curr,env));},[]));
    //item.body.body = item.body.body.filter((item) => filterLines(item));
    return item;
};

const handleVarDec = (item,env) => {
    item.declarations[0].init = subLeft(item.declarations[0].init,env);
    return [{Key: item.declarations[0].id.name , Value: item.declarations[0].init}];
};

const subInputVector = (line,input) => {
    let parsedLine = esprima.parseScript(line);
    changeToinput(parsedLine.body[0].expression,input);
    return eval(escodegen.generate(parsedLine));
};

const changeToinput = (item,input) => {
    return changeToinputMap[item.type](item,input);
};

const changeToinputMap = {
    'Literal': (exp) => {
        return exp;
    },
    'BinaryExpression': (exp, input) => {
        exp.left = changeToinput(exp.left, input);
        exp.right = changeToinput(exp.right, input);
        return exp;
    },
    'Identifier': (exp, input) => {
        return esprima.parseScript(input[exp.name].toString()).body[0].expression;
    },
    'UnaryExpression': (exp, input) => {
        exp.argument = changeToinput(exp.argument, input);
        return exp;
    },
    /*'MemberExpression': (exp, input) => {
        exp.object = changeToinput(exp.object, input);
        exp.property = changeToinput(exp.property,input);
        return exp;
    },*/
};


export {parseCode,subInputVector};
