import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    
    it('test1', () => {assert.equal(JSON.stringify(parseCode('let a = 1;')),
        '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":" ","Value":"1"}]');
    });
	
    it('test2', () => {
        assert.equal(JSON.stringify(parseCode('function binarySearch(X, V, n){ ' + '\nlet low, high, mid;' + '\n  low = 0;' + '\n high = n - 1;' + '\n while (low <= high) {' + '\n   mid = (low + high)/2;' + '\n   if (X < V[mid])' + '\n      high = mid - 1;' + '\n  else if (X > V[mid])' + '\n      low = mid + 1;' + '\n   else' + '\n    return mid;' + '\n }' + '\nreturn -1;' + '\n }')),
            JSON.stringify([{'Line': 1, 'Type': 'function declaration', 'Name': 'binarySearch', 'Condition': ' ', 'Value': ' '}, {'Line': 1, 'Type': 'variable declaration', 'Name': 'X', 'Condition': ' ', 'Value': ' '}, {'Line': 1, 'Type': 'variable declaration', 'Name': 'V', 'Condition': ' ', 'Value': ' '}, {'Line': 1, 'Type': 'variable declaration', 'Name': 'n', 'Condition': ' ', 'Value': ' '}, {'Line': 2, 'Type': 'variable declaration', 'Name': 'low', 'Condition': ' ', 'Value': 'NULL'}, {'Line': 2, 'Type': 'variable declaration', 'Name': 'high', 'Condition': ' ', 'Value': 'NULL'}, {'Line': 2, 'Type': 'variable declaration', 'Name': 'mid', 'Condition': ' ', 'Value': 'NULL'}, {'Line': 3, 'Type': 'assignment expression', 'Name': 'low', 'Condition': ' ', 'Value': '0'}, {'Line': 4, 'Type': 'assignment expression', 'Name': 'high', 'Condition': ' ', 'Value': 'n - 1'}, {'Line': 5, 'Type': 'while statement', 'Name': '', 'Condition': 'low <= high', 'Value': ''}, {'Line': 6, 'Type': 'assignment expression', 'Name': 'mid', 'Condition': ' ', 'Value': '(low + high) / 2'}, {'Line': 7, 'Type': 'if statement', 'Name': '', 'Condition': 'X < V[mid]', 'Value': ''}, {'Line': 8, 'Type': 'assignment expression', 'Name': 'high', 'Condition': ' ', 'Value': 'mid - 1'}, {'Line': 9, 'Type': 'else if statement', 'Name': '', 'Condition': 'X > V[mid]', 'Value': ''}, {'Line': 10, 'Type': 'assignment expression', 'Name': 'low', 'Condition': ' ', 'Value': 'mid + 1'}, {'Line': 12, 'Type': 'return statement', 'Name': '', 'Condition': '', 'Value': 'mid'}, {'Line': 14, 'Type': 'return statement', 'Name': '', 'Condition': '', 'Value': '-1'}]));
    });

    it('test3', () => {assert.equal(JSON.stringify(parseCode('for(i=0;i<5 && i<10;i++){ '+'\n ++x;' +'\n}')),
        JSON.stringify([{'Line': 1, 'Type': 'for statement', 'Name': '', 'Condition': '(i < 5) && (i < 10)', 'Value': ''}, {'Line': 1, 'Type': 'assignment expression', 'Name': 'i', 'Condition': ' ', 'Value': '0'}, {'Line': 1, 'Type': 'assignment statement', 'Name': 'i', 'Condition': '', 'Value': 'i++'}, {'Line': 2, 'Type': 'assignment statement', 'Name': 'x', 'Condition': '', 'Value': '++x'}]));
    });

    it('test4', () => {assert.equal(JSON.stringify(parseCode('if(x<5)' +'\nx++;' +'\nelse' +'\n x--;')),
        JSON.stringify([{'Line': 1, 'Type': 'if statement', 'Name': '', 'Condition': 'x < 5', 'Value': ''}, {'Line': 2, 'Type': 'assignment statement', 'Name': 'x', 'Condition': '', 'Value': 'x++'}, {'Line': 4, 'Type': 'assignment statement', 'Name': 'x', 'Condition': '', 'Value': 'x--'}]));
    });

    it('test5', () => {assert.equal(JSON.stringify(parseCode('if(x<4)' +'\nx++;' +'\nelse if(x<3)' +'\n x--;')),
        JSON.stringify([{'Line': 1, 'Type': 'if statement', 'Name': '', 'Condition': 'x < 4', 'Value': ''},
            {
                'Line': 2,
                'Type': 'assignment statement',
                'Name': 'x',
                'Condition': '',
                'Value': 'x++'
            },
            {
                'Line': 3,
                'Type': 'else if statement',
                'Name': '',
                'Condition': 'x < 3',
                'Value': ''
            },
            {
                'Line': 4,
                'Type': 'assignment statement',
                'Name': 'x',
                'Condition': '',
                'Value': 'x--'
            }
        ]));
    });

    it('test6', () => {assert.equal(JSON.stringify(parseCode('if(x<4)'+'\nx++;' +'\nelse if(x<3)' +'\nx--;' +'\nelse' +'\nx++;')),
        JSON.stringify([{'Line': 1, 'Type': 'if statement', 'Name': '', 'Condition': 'x < 4', 'Value': ''}, {'Line': 2, 'Type': 'assignment statement', 'Name': 'x', 'Condition': '', 'Value': 'x++'}, {'Line': 3, 'Type': 'else if statement', 'Name': '', 'Condition': 'x < 3', 'Value': ''}, {'Line': 4, 'Type': 'assignment statement', 'Name': 'x', 'Condition': '', 'Value': 'x--'}, {'Line': 6, 'Type': 'assignment statement', 'Name': 'x', 'Condition': '', 'Value': 'x++'}]));});

    it('test7', () => {assert.equal(JSON.stringify(parseCode('function temp(){'+'\nreturn -(-1);}')),
        JSON.stringify([
            {
                'Line': 1,
                'Type': 'function declaration',
                'Name': 'temp',
                'Condition': ' ',
                'Value': ' '
            },
            {
                'Line': 2,
                'Type': 'return statement',
                'Name': '',
                'Condition': '',
                'Value': '-(-1)'
            }
        ]));
    });

    it('test8', () => {assert.equal(JSON.stringify(parseCode('if(x<4)\n' + 'x++;\n' + 'else if(x<3)\n' + 'x--;\n' + 'else if(x>90)\n' + 'x++;')),
        JSON.stringify([
            {
                'Line': 1,
                'Type': 'if statement',
                'Name': '',
                'Condition': 'x < 4',
                'Value': ''
            },
            {
                'Line': 2,
                'Type': 'assignment statement',
                'Name': 'x',
                'Condition': '',
                'Value': 'x++'
            },
            {
                'Line': 3,
                'Type': 'else if statement',
                'Name': '',
                'Condition': 'x < 3',
                'Value': ''
            },
            {
                'Line': 4,
                'Type': 'assignment statement',
                'Name': 'x',
                'Condition': '',
                'Value': 'x--'
            },
            {
                'Line': 5,
                'Type': 'else if statement',
                'Name': '',
                'Condition': 'x > 90',
                'Value': ''
            },
            {
                'Line': 6,
                'Type': 'assignment statement',
                'Name': 'x',
                'Condition': '',
                'Value': 'x++'
            }
        ]));
    });

    it('test9', () => {assert.equal(JSON.stringify(parseCode('if(x<5)\n' +
        'x=2/(x+y);')), JSON.stringify([
        {
            'Line': 1,
            'Type': 'if statement',
            'Name': '',
            'Condition': 'x < 5',
            'Value': ''
        },
        {
            'Line': 2,
            'Type': 'assignment expression',
            'Name': 'x',
            'Condition': ' ',
            'Value': '2 / (x + y)'
        }
    ]));
    });

    it('test10', () => {assert.equal(JSON.stringify(parseCode('if(x && y)'
        +'\nx=y++;')), JSON.stringify([
        {
            'Line': 1,
            'Type': 'if statement',
            'Name': '',
            'Condition': 'x && y',
            'Value': ''
        },
        {
            'Line': 2,
            'Type': 'assignment expression',
            'Name': 'x',
            'Condition': ' ',
            'Value': 'y++'
        }
    ]));
    });

    it('test11', () => {assert.equal(JSON.stringify(parseCode('for(i=0;i<5;i=i++){\n' + 'x++;\n' + '}')), JSON.stringify([
        {
            'Line': 1,
            'Type': 'for statement',
            'Name': '',
            'Condition': 'i < 5',
            'Value': ''
        },
        {
            'Line': 1,
            'Type': 'assignment expression',
            'Name': 'i',
            'Condition': ' ',
            'Value': '0'
        },
        {
            'Line': 1,
            'Type': 'assignment expression',
            'Name': 'i',
            'Condition': ' ',
            'Value': 'i++'
        },
        {
            'Line': 2,
            'Type': 'assignment statement',
            'Name': 'x',
            'Condition': '',
            'Value': 'x++'
        }
    ]));
    });


});
