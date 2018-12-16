import assert from 'assert';
import {parseCode, subInputVector} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    
    it('test1', () => {assert.equal(JSON.stringify(parseCode('function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        '    \n' +
        '    if (b < z) {\n' +
        '        c = c + 5;\n' +
        '        return x + y + z + c;\n' +
        '    } else if (b < z * 2) {\n' +
        '        c = c + x + 5;\n' +
        '        return x + y + z + c;\n' +
        '    } else {\n' +
        '        c = c + z + 5;\n' +
        '        return x + y + z + c;\n' +
        '    }\n' +
        '}\n')), '["function foo(x, y, z) {","    if (x + 1 + y < z) {","        return x + y + z + (0 + 5);","    } else if (x + 1 + y < z * 2) {","        return x + y + z + (0 + x + 5);","    } else {","        return x + y + z + (0 + z + 5);","    }","}"]');
    });

    it('test2', () => {assert.equal(JSON.stringify(parseCode('function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        '    \n' +
        '    while (a < z) {\n' +
        '        c = a + b;\n' +
        '        z = c * 2;\n' +
        '    }\n' +
        '    \n' +
        '    return z;\n' +
        '}\n')), '["function foo(x, y, z) {","    while (x + 1 < z) {","        z = (x + 1 + (x + 1 + y)) * 2;","    }","    return z;","}"]');
    });


    it('test3', () => {assert.equal(JSON.stringify(parseCode('  let a = x + 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        'function foo(x, y, z){\n' +
        '    while (a < z) {\n' +
        '        c = a + b;\n' +
        '        z = c * 2;\n' +
        '    }\n' +
        '    \n' +
        '    return z;\n' +
        '}\n')), '["function foo(x, y, z) {","    while (x + 1 < z) {","        z = (x + 1 + (x + 1 + y)) * 2;","    }","    return z;","}"]');
    });

    it('test4', () => {assert.equal(JSON.stringify(parseCode('function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        '    \n' +
        '    for (i=0; i < 5; i++) {\n' +
        '        c = a + b;\n' +
        '        z = c * 2;\n' +
        '    }\n' +
        '    \n' +
        '    return z;\n' +
        '}\n')), '["function foo(x, y, z) {","    for (i = 0; i < 5; i++) {","        z = (x + 1 + (x + 1 + y)) * 2;","    }","    return z;","}"]');
    });

    it('test5', () => {assert.equal(JSON.stringify(parseCode('function foo(v){\n' +
        'if(v>5)\n' +
        'v=5;\n' +
        'else\n' +
        'v=8;\n' +
        'for(i=0;i<7;i++)\n' +
        'v = i;\n' +
        'while(v===0)\n' +
        'v=5;\n' +
        '}')), '["function foo(v) {","    if (v > 5)","        v = 5;","    else","        v = 8;","    for (i = 0; i < 7; i++)","        v = i;","    while (v === 0)","        v = 5;","}"]');
    });

    it('test6', () => {assert.equal(subInputVector('(x + 5 > -7)',JSON.parse('{"x":5}')), true);
    });



    it('test7', () => {assert.equal(JSON.stringify(parseCode('function foo (v){\n' +
        'if(v === 6){\n' +
        'let c = 6;\n' +
        'v=c;\n' +
        '}\n' +
        'else{\n' +
        'let c=7;\n' +
        'v=c;\n' +
        '}\n' +
        '}')), '["function foo(v) {","    if (v === 6) {","        v = c;","    } else {","        v = c;","    }","}"]');
    });

    it('test8', () => {assert.equal(JSON.stringify(parseCode('function doo (v){\n' +
        'if(v===6)\n' +
        'v = v+6;\n' +
        '}')), '["function doo(v) {","    if (v === 6)","        v = v + 6;","}"]');
    });

    it('test9', () => {assert.equal(JSON.stringify(parseCode('function foo (x){\n' +
        'let c = 5;\n' +
        'for(i=0;i<5;i++){\n' +
        'x = c;\n' +
        'x = 2* x;\n' +
        '}\n' +
        '}')), '["function foo(x) {","    for (i = 0; i < 5; i++) {","        x = 5;","        x = 2 * x;","    }","}"]');
    });

    it('test10', () => {assert.equal(JSON.stringify(parseCode('function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        '    \n' +
        '    while (a < -z) {\n' +
        '        c = a + b;\n' +
        '        z = c * 2;\n' +
        '    }\n' +
        '    z = 5;\n' +
        '    return z;\n' +
        '}\n')), '["function foo(x, y, z) {","    while (x + 1 < -z) {","        z = (x + 1 + (x + 1 + y)) * 2;","    }","    z = 5;","    return z;","}"]');
    });

    /*it('test5', () => {assert.equal(JSON.stringify(parseCode('')), '');
    });*/

});
