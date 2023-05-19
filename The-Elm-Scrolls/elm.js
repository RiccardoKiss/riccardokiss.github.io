(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


// eslint-disable-next-line no-unused-vars
var _Texture_load = F6(function (magnify, mininify, horizontalWrap, verticalWrap, flipY, url) {
  var isMipmap = mininify !== 9728 && mininify !== 9729;
  return _Scheduler_binding(function (callback) {
    var img = new Image();
    function createTexture(gl) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magnify);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mininify);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, horizontalWrap);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, verticalWrap);
      if (isMipmap) {
        gl.generateMipmap(gl.TEXTURE_2D);
      }
      gl.bindTexture(gl.TEXTURE_2D, null);
      return texture;
    }
    img.onload = function () {
      var width = img.width;
      var height = img.height;
      var widthPowerOfTwo = (width & (width - 1)) === 0;
      var heightPowerOfTwo = (height & (height - 1)) === 0;
      var isSizeValid = (widthPowerOfTwo && heightPowerOfTwo) || (
        !isMipmap
        && horizontalWrap === 33071 // clamp to edge
        && verticalWrap === 33071
      );
      if (isSizeValid) {
        callback(_Scheduler_succeed({
          $: 0,
          createTexture: createTexture,
          a: width,
          b: height
        }));
      } else {
        callback(_Scheduler_fail(A2(
          $elm_explorations$webgl$WebGL$Texture$SizeError,
          width,
          height
        )));
      }
    };
    img.onerror = function () {
      callback(_Scheduler_fail($elm_explorations$webgl$WebGL$Texture$LoadError));
    };
    if (url.slice(0, 5) !== 'data:') {
      img.crossOrigin = 'Anonymous';
    }
    img.src = url;
  });
});

// eslint-disable-next-line no-unused-vars
var _Texture_size = function (texture) {
  return _Utils_Tuple2(texture.a, texture.b);
};


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


/*
 * Copyright (c) 2010 Mozilla Corporation
 * Copyright (c) 2010 Vladimir Vukicevic
 * Copyright (c) 2013 John Mayer
 * Copyright (c) 2018 Andrey Kuzmin
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

// Vector2

var _MJS_v2 = F2(function(x, y) {
    return new Float64Array([x, y]);
});

var _MJS_v2getX = function(a) {
    return a[0];
};

var _MJS_v2getY = function(a) {
    return a[1];
};

var _MJS_v2setX = F2(function(x, a) {
    return new Float64Array([x, a[1]]);
});

var _MJS_v2setY = F2(function(y, a) {
    return new Float64Array([a[0], y]);
});

var _MJS_v2toRecord = function(a) {
    return { x: a[0], y: a[1] };
};

var _MJS_v2fromRecord = function(r) {
    return new Float64Array([r.x, r.y]);
};

var _MJS_v2add = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    return r;
});

var _MJS_v2sub = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    return r;
});

var _MJS_v2negate = function(a) {
    var r = new Float64Array(2);
    r[0] = -a[0];
    r[1] = -a[1];
    return r;
};

var _MJS_v2direction = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    var im = 1.0 / _MJS_v2lengthLocal(r);
    r[0] = r[0] * im;
    r[1] = r[1] * im;
    return r;
});

function _MJS_v2lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}
var _MJS_v2length = _MJS_v2lengthLocal;

var _MJS_v2lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1];
};

var _MJS_v2distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
});

var _MJS_v2distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return dx * dx + dy * dy;
});

var _MJS_v2normalize = function(a) {
    var r = new Float64Array(2);
    var im = 1.0 / _MJS_v2lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    return r;
};

var _MJS_v2scale = F2(function(k, a) {
    var r = new Float64Array(2);
    r[0] = a[0] * k;
    r[1] = a[1] * k;
    return r;
});

var _MJS_v2dot = F2(function(a, b) {
    return a[0] * b[0] + a[1] * b[1];
});

// Vector3

var _MJS_v3temp1Local = new Float64Array(3);
var _MJS_v3temp2Local = new Float64Array(3);
var _MJS_v3temp3Local = new Float64Array(3);

var _MJS_v3 = F3(function(x, y, z) {
    return new Float64Array([x, y, z]);
});

var _MJS_v3getX = function(a) {
    return a[0];
};

var _MJS_v3getY = function(a) {
    return a[1];
};

var _MJS_v3getZ = function(a) {
    return a[2];
};

var _MJS_v3setX = F2(function(x, a) {
    return new Float64Array([x, a[1], a[2]]);
});

var _MJS_v3setY = F2(function(y, a) {
    return new Float64Array([a[0], y, a[2]]);
});

var _MJS_v3setZ = F2(function(z, a) {
    return new Float64Array([a[0], a[1], z]);
});

var _MJS_v3toRecord = function(a) {
    return { x: a[0], y: a[1], z: a[2] };
};

var _MJS_v3fromRecord = function(r) {
    return new Float64Array([r.x, r.y, r.z]);
};

var _MJS_v3add = F2(function(a, b) {
    var r = new Float64Array(3);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    return r;
});

function _MJS_v3subLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    return r;
}
var _MJS_v3sub = F2(_MJS_v3subLocal);

var _MJS_v3negate = function(a) {
    var r = new Float64Array(3);
    r[0] = -a[0];
    r[1] = -a[1];
    r[2] = -a[2];
    return r;
};

function _MJS_v3directionLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    return _MJS_v3normalizeLocal(_MJS_v3subLocal(a, b, r), r);
}
var _MJS_v3direction = F2(_MJS_v3directionLocal);

function _MJS_v3lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}
var _MJS_v3length = _MJS_v3lengthLocal;

var _MJS_v3lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
};

var _MJS_v3distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
});

var _MJS_v3distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return dx * dx + dy * dy + dz * dz;
});

function _MJS_v3normalizeLocal(a, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    var im = 1.0 / _MJS_v3lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    r[2] = a[2] * im;
    return r;
}
var _MJS_v3normalize = _MJS_v3normalizeLocal;

var _MJS_v3scale = F2(function(k, a) {
    return new Float64Array([a[0] * k, a[1] * k, a[2] * k]);
});

var _MJS_v3dotLocal = function(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};
var _MJS_v3dot = F2(_MJS_v3dotLocal);

function _MJS_v3crossLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    r[0] = a[1] * b[2] - a[2] * b[1];
    r[1] = a[2] * b[0] - a[0] * b[2];
    r[2] = a[0] * b[1] - a[1] * b[0];
    return r;
}
var _MJS_v3cross = F2(_MJS_v3crossLocal);

var _MJS_v3mul4x4 = F2(function(m, v) {
    var w;
    var tmp = _MJS_v3temp1Local;
    var r = new Float64Array(3);

    tmp[0] = m[3];
    tmp[1] = m[7];
    tmp[2] = m[11];
    w = _MJS_v3dotLocal(v, tmp) + m[15];
    tmp[0] = m[0];
    tmp[1] = m[4];
    tmp[2] = m[8];
    r[0] = (_MJS_v3dotLocal(v, tmp) + m[12]) / w;
    tmp[0] = m[1];
    tmp[1] = m[5];
    tmp[2] = m[9];
    r[1] = (_MJS_v3dotLocal(v, tmp) + m[13]) / w;
    tmp[0] = m[2];
    tmp[1] = m[6];
    tmp[2] = m[10];
    r[2] = (_MJS_v3dotLocal(v, tmp) + m[14]) / w;
    return r;
});

// Vector4

var _MJS_v4 = F4(function(x, y, z, w) {
    return new Float64Array([x, y, z, w]);
});

var _MJS_v4getX = function(a) {
    return a[0];
};

var _MJS_v4getY = function(a) {
    return a[1];
};

var _MJS_v4getZ = function(a) {
    return a[2];
};

var _MJS_v4getW = function(a) {
    return a[3];
};

var _MJS_v4setX = F2(function(x, a) {
    return new Float64Array([x, a[1], a[2], a[3]]);
});

var _MJS_v4setY = F2(function(y, a) {
    return new Float64Array([a[0], y, a[2], a[3]]);
});

var _MJS_v4setZ = F2(function(z, a) {
    return new Float64Array([a[0], a[1], z, a[3]]);
});

var _MJS_v4setW = F2(function(w, a) {
    return new Float64Array([a[0], a[1], a[2], w]);
});

var _MJS_v4toRecord = function(a) {
    return { x: a[0], y: a[1], z: a[2], w: a[3] };
};

var _MJS_v4fromRecord = function(r) {
    return new Float64Array([r.x, r.y, r.z, r.w]);
};

var _MJS_v4add = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    r[3] = a[3] + b[3];
    return r;
});

var _MJS_v4sub = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    r[3] = a[3] - b[3];
    return r;
});

var _MJS_v4negate = function(a) {
    var r = new Float64Array(4);
    r[0] = -a[0];
    r[1] = -a[1];
    r[2] = -a[2];
    r[3] = -a[3];
    return r;
};

var _MJS_v4direction = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    r[3] = a[3] - b[3];
    var im = 1.0 / _MJS_v4lengthLocal(r);
    r[0] = r[0] * im;
    r[1] = r[1] * im;
    r[2] = r[2] * im;
    r[3] = r[3] * im;
    return r;
});

function _MJS_v4lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
}
var _MJS_v4length = _MJS_v4lengthLocal;

var _MJS_v4lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3];
};

var _MJS_v4distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    var dw = a[3] - b[3];
    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
});

var _MJS_v4distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    var dw = a[3] - b[3];
    return dx * dx + dy * dy + dz * dz + dw * dw;
});

var _MJS_v4normalize = function(a) {
    var r = new Float64Array(4);
    var im = 1.0 / _MJS_v4lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    r[2] = a[2] * im;
    r[3] = a[3] * im;
    return r;
};

var _MJS_v4scale = F2(function(k, a) {
    var r = new Float64Array(4);
    r[0] = a[0] * k;
    r[1] = a[1] * k;
    r[2] = a[2] * k;
    r[3] = a[3] * k;
    return r;
});

var _MJS_v4dot = F2(function(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
});

// Matrix4

var _MJS_m4x4temp1Local = new Float64Array(16);
var _MJS_m4x4temp2Local = new Float64Array(16);

var _MJS_m4x4identity = new Float64Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
]);

var _MJS_m4x4fromRecord = function(r) {
    var m = new Float64Array(16);
    m[0] = r.m11;
    m[1] = r.m21;
    m[2] = r.m31;
    m[3] = r.m41;
    m[4] = r.m12;
    m[5] = r.m22;
    m[6] = r.m32;
    m[7] = r.m42;
    m[8] = r.m13;
    m[9] = r.m23;
    m[10] = r.m33;
    m[11] = r.m43;
    m[12] = r.m14;
    m[13] = r.m24;
    m[14] = r.m34;
    m[15] = r.m44;
    return m;
};

var _MJS_m4x4toRecord = function(m) {
    return {
        m11: m[0], m21: m[1], m31: m[2], m41: m[3],
        m12: m[4], m22: m[5], m32: m[6], m42: m[7],
        m13: m[8], m23: m[9], m33: m[10], m43: m[11],
        m14: m[12], m24: m[13], m34: m[14], m44: m[15]
    };
};

var _MJS_m4x4inverse = function(m) {
    var r = new Float64Array(16);

    r[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
        m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    r[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
        m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    r[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
        m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    r[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
        m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    r[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
        m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    r[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
        m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    r[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
        m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    r[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
        m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    r[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
        m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    r[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
        m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    r[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
        m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    r[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
        m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    r[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
        m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    r[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
        m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    r[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
        m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    r[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
        m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

    var det = m[0] * r[0] + m[1] * r[4] + m[2] * r[8] + m[3] * r[12];

    if (det === 0) {
        return $elm$core$Maybe$Nothing;
    }

    det = 1.0 / det;

    for (var i = 0; i < 16; i = i + 1) {
        r[i] = r[i] * det;
    }

    return $elm$core$Maybe$Just(r);
};

var _MJS_m4x4inverseOrthonormal = function(m) {
    var r = _MJS_m4x4transposeLocal(m);
    var t = [m[12], m[13], m[14]];
    r[3] = r[7] = r[11] = 0;
    r[12] = -_MJS_v3dotLocal([r[0], r[4], r[8]], t);
    r[13] = -_MJS_v3dotLocal([r[1], r[5], r[9]], t);
    r[14] = -_MJS_v3dotLocal([r[2], r[6], r[10]], t);
    return r;
};

function _MJS_m4x4makeFrustumLocal(left, right, bottom, top, znear, zfar) {
    var r = new Float64Array(16);

    r[0] = 2 * znear / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 * znear / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = (right + left) / (right - left);
    r[9] = (top + bottom) / (top - bottom);
    r[10] = -(zfar + znear) / (zfar - znear);
    r[11] = -1;
    r[12] = 0;
    r[13] = 0;
    r[14] = -2 * zfar * znear / (zfar - znear);
    r[15] = 0;

    return r;
}
var _MJS_m4x4makeFrustum = F6(_MJS_m4x4makeFrustumLocal);

var _MJS_m4x4makePerspective = F4(function(fovy, aspect, znear, zfar) {
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return _MJS_m4x4makeFrustumLocal(xmin, xmax, ymin, ymax, znear, zfar);
});

function _MJS_m4x4makeOrthoLocal(left, right, bottom, top, znear, zfar) {
    var r = new Float64Array(16);

    r[0] = 2 / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = -2 / (zfar - znear);
    r[11] = 0;
    r[12] = -(right + left) / (right - left);
    r[13] = -(top + bottom) / (top - bottom);
    r[14] = -(zfar + znear) / (zfar - znear);
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeOrtho = F6(_MJS_m4x4makeOrthoLocal);

var _MJS_m4x4makeOrtho2D = F4(function(left, right, bottom, top) {
    return _MJS_m4x4makeOrthoLocal(left, right, bottom, top, -1, 1);
});

function _MJS_m4x4mulLocal(a, b) {
    var r = new Float64Array(16);
    var a11 = a[0];
    var a21 = a[1];
    var a31 = a[2];
    var a41 = a[3];
    var a12 = a[4];
    var a22 = a[5];
    var a32 = a[6];
    var a42 = a[7];
    var a13 = a[8];
    var a23 = a[9];
    var a33 = a[10];
    var a43 = a[11];
    var a14 = a[12];
    var a24 = a[13];
    var a34 = a[14];
    var a44 = a[15];
    var b11 = b[0];
    var b21 = b[1];
    var b31 = b[2];
    var b41 = b[3];
    var b12 = b[4];
    var b22 = b[5];
    var b32 = b[6];
    var b42 = b[7];
    var b13 = b[8];
    var b23 = b[9];
    var b33 = b[10];
    var b43 = b[11];
    var b14 = b[12];
    var b24 = b[13];
    var b34 = b[14];
    var b44 = b[15];

    r[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    r[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    r[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    r[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    r[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    r[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    r[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    r[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    r[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    r[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    r[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    r[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    r[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return r;
}
var _MJS_m4x4mul = F2(_MJS_m4x4mulLocal);

var _MJS_m4x4mulAffine = F2(function(a, b) {
    var r = new Float64Array(16);
    var a11 = a[0];
    var a21 = a[1];
    var a31 = a[2];
    var a12 = a[4];
    var a22 = a[5];
    var a32 = a[6];
    var a13 = a[8];
    var a23 = a[9];
    var a33 = a[10];
    var a14 = a[12];
    var a24 = a[13];
    var a34 = a[14];

    var b11 = b[0];
    var b21 = b[1];
    var b31 = b[2];
    var b12 = b[4];
    var b22 = b[5];
    var b32 = b[6];
    var b13 = b[8];
    var b23 = b[9];
    var b33 = b[10];
    var b14 = b[12];
    var b24 = b[13];
    var b34 = b[14];

    r[0] = a11 * b11 + a12 * b21 + a13 * b31;
    r[1] = a21 * b11 + a22 * b21 + a23 * b31;
    r[2] = a31 * b11 + a32 * b21 + a33 * b31;
    r[3] = 0;
    r[4] = a11 * b12 + a12 * b22 + a13 * b32;
    r[5] = a21 * b12 + a22 * b22 + a23 * b32;
    r[6] = a31 * b12 + a32 * b22 + a33 * b32;
    r[7] = 0;
    r[8] = a11 * b13 + a12 * b23 + a13 * b33;
    r[9] = a21 * b13 + a22 * b23 + a23 * b33;
    r[10] = a31 * b13 + a32 * b23 + a33 * b33;
    r[11] = 0;
    r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14;
    r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24;
    r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34;
    r[15] = 1;

    return r;
});

var _MJS_m4x4makeRotate = F2(function(angle, axis) {
    var r = new Float64Array(16);
    axis = _MJS_v3normalizeLocal(axis, _MJS_v3temp1Local);
    var x = axis[0];
    var y = axis[1];
    var z = axis[2];
    var c = Math.cos(angle);
    var c1 = 1 - c;
    var s = Math.sin(angle);

    r[0] = x * x * c1 + c;
    r[1] = y * x * c1 + z * s;
    r[2] = z * x * c1 - y * s;
    r[3] = 0;
    r[4] = x * y * c1 - z * s;
    r[5] = y * y * c1 + c;
    r[6] = y * z * c1 + x * s;
    r[7] = 0;
    r[8] = x * z * c1 + y * s;
    r[9] = y * z * c1 - x * s;
    r[10] = z * z * c1 + c;
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
});

var _MJS_m4x4rotate = F3(function(angle, axis, m) {
    var r = new Float64Array(16);
    var im = 1.0 / _MJS_v3lengthLocal(axis);
    var x = axis[0] * im;
    var y = axis[1] * im;
    var z = axis[2] * im;
    var c = Math.cos(angle);
    var c1 = 1 - c;
    var s = Math.sin(angle);
    var xs = x * s;
    var ys = y * s;
    var zs = z * s;
    var xyc1 = x * y * c1;
    var xzc1 = x * z * c1;
    var yzc1 = y * z * c1;
    var t11 = x * x * c1 + c;
    var t21 = xyc1 + zs;
    var t31 = xzc1 - ys;
    var t12 = xyc1 - zs;
    var t22 = y * y * c1 + c;
    var t32 = yzc1 + xs;
    var t13 = xzc1 + ys;
    var t23 = yzc1 - xs;
    var t33 = z * z * c1 + c;
    var m11 = m[0], m21 = m[1], m31 = m[2], m41 = m[3];
    var m12 = m[4], m22 = m[5], m32 = m[6], m42 = m[7];
    var m13 = m[8], m23 = m[9], m33 = m[10], m43 = m[11];
    var m14 = m[12], m24 = m[13], m34 = m[14], m44 = m[15];

    r[0] = m11 * t11 + m12 * t21 + m13 * t31;
    r[1] = m21 * t11 + m22 * t21 + m23 * t31;
    r[2] = m31 * t11 + m32 * t21 + m33 * t31;
    r[3] = m41 * t11 + m42 * t21 + m43 * t31;
    r[4] = m11 * t12 + m12 * t22 + m13 * t32;
    r[5] = m21 * t12 + m22 * t22 + m23 * t32;
    r[6] = m31 * t12 + m32 * t22 + m33 * t32;
    r[7] = m41 * t12 + m42 * t22 + m43 * t32;
    r[8] = m11 * t13 + m12 * t23 + m13 * t33;
    r[9] = m21 * t13 + m22 * t23 + m23 * t33;
    r[10] = m31 * t13 + m32 * t23 + m33 * t33;
    r[11] = m41 * t13 + m42 * t23 + m43 * t33;
    r[12] = m14,
    r[13] = m24;
    r[14] = m34;
    r[15] = m44;

    return r;
});

function _MJS_m4x4makeScale3Local(x, y, z) {
    var r = new Float64Array(16);

    r[0] = x;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = y;
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = z;
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeScale3 = F3(_MJS_m4x4makeScale3Local);

var _MJS_m4x4makeScale = function(v) {
    return _MJS_m4x4makeScale3Local(v[0], v[1], v[2]);
};

var _MJS_m4x4scale3 = F4(function(x, y, z, m) {
    var r = new Float64Array(16);

    r[0] = m[0] * x;
    r[1] = m[1] * x;
    r[2] = m[2] * x;
    r[3] = m[3] * x;
    r[4] = m[4] * y;
    r[5] = m[5] * y;
    r[6] = m[6] * y;
    r[7] = m[7] * y;
    r[8] = m[8] * z;
    r[9] = m[9] * z;
    r[10] = m[10] * z;
    r[11] = m[11] * z;
    r[12] = m[12];
    r[13] = m[13];
    r[14] = m[14];
    r[15] = m[15];

    return r;
});

var _MJS_m4x4scale = F2(function(v, m) {
    var r = new Float64Array(16);
    var x = v[0];
    var y = v[1];
    var z = v[2];

    r[0] = m[0] * x;
    r[1] = m[1] * x;
    r[2] = m[2] * x;
    r[3] = m[3] * x;
    r[4] = m[4] * y;
    r[5] = m[5] * y;
    r[6] = m[6] * y;
    r[7] = m[7] * y;
    r[8] = m[8] * z;
    r[9] = m[9] * z;
    r[10] = m[10] * z;
    r[11] = m[11] * z;
    r[12] = m[12];
    r[13] = m[13];
    r[14] = m[14];
    r[15] = m[15];

    return r;
});

function _MJS_m4x4makeTranslate3Local(x, y, z) {
    var r = new Float64Array(16);

    r[0] = 1;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 1;
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = 1;
    r[11] = 0;
    r[12] = x;
    r[13] = y;
    r[14] = z;
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeTranslate3 = F3(_MJS_m4x4makeTranslate3Local);

var _MJS_m4x4makeTranslate = function(v) {
    return _MJS_m4x4makeTranslate3Local(v[0], v[1], v[2]);
};

var _MJS_m4x4translate3 = F4(function(x, y, z, m) {
    var r = new Float64Array(16);
    var m11 = m[0];
    var m21 = m[1];
    var m31 = m[2];
    var m41 = m[3];
    var m12 = m[4];
    var m22 = m[5];
    var m32 = m[6];
    var m42 = m[7];
    var m13 = m[8];
    var m23 = m[9];
    var m33 = m[10];
    var m43 = m[11];

    r[0] = m11;
    r[1] = m21;
    r[2] = m31;
    r[3] = m41;
    r[4] = m12;
    r[5] = m22;
    r[6] = m32;
    r[7] = m42;
    r[8] = m13;
    r[9] = m23;
    r[10] = m33;
    r[11] = m43;
    r[12] = m11 * x + m12 * y + m13 * z + m[12];
    r[13] = m21 * x + m22 * y + m23 * z + m[13];
    r[14] = m31 * x + m32 * y + m33 * z + m[14];
    r[15] = m41 * x + m42 * y + m43 * z + m[15];

    return r;
});

var _MJS_m4x4translate = F2(function(v, m) {
    var r = new Float64Array(16);
    var x = v[0];
    var y = v[1];
    var z = v[2];
    var m11 = m[0];
    var m21 = m[1];
    var m31 = m[2];
    var m41 = m[3];
    var m12 = m[4];
    var m22 = m[5];
    var m32 = m[6];
    var m42 = m[7];
    var m13 = m[8];
    var m23 = m[9];
    var m33 = m[10];
    var m43 = m[11];

    r[0] = m11;
    r[1] = m21;
    r[2] = m31;
    r[3] = m41;
    r[4] = m12;
    r[5] = m22;
    r[6] = m32;
    r[7] = m42;
    r[8] = m13;
    r[9] = m23;
    r[10] = m33;
    r[11] = m43;
    r[12] = m11 * x + m12 * y + m13 * z + m[12];
    r[13] = m21 * x + m22 * y + m23 * z + m[13];
    r[14] = m31 * x + m32 * y + m33 * z + m[14];
    r[15] = m41 * x + m42 * y + m43 * z + m[15];

    return r;
});

var _MJS_m4x4makeLookAt = F3(function(eye, center, up) {
    var z = _MJS_v3directionLocal(eye, center, _MJS_v3temp1Local);
    var x = _MJS_v3normalizeLocal(_MJS_v3crossLocal(up, z, _MJS_v3temp2Local), _MJS_v3temp2Local);
    var y = _MJS_v3normalizeLocal(_MJS_v3crossLocal(z, x, _MJS_v3temp3Local), _MJS_v3temp3Local);
    var tm1 = _MJS_m4x4temp1Local;
    var tm2 = _MJS_m4x4temp2Local;

    tm1[0] = x[0];
    tm1[1] = y[0];
    tm1[2] = z[0];
    tm1[3] = 0;
    tm1[4] = x[1];
    tm1[5] = y[1];
    tm1[6] = z[1];
    tm1[7] = 0;
    tm1[8] = x[2];
    tm1[9] = y[2];
    tm1[10] = z[2];
    tm1[11] = 0;
    tm1[12] = 0;
    tm1[13] = 0;
    tm1[14] = 0;
    tm1[15] = 1;

    tm2[0] = 1; tm2[1] = 0; tm2[2] = 0; tm2[3] = 0;
    tm2[4] = 0; tm2[5] = 1; tm2[6] = 0; tm2[7] = 0;
    tm2[8] = 0; tm2[9] = 0; tm2[10] = 1; tm2[11] = 0;
    tm2[12] = -eye[0]; tm2[13] = -eye[1]; tm2[14] = -eye[2]; tm2[15] = 1;

    return _MJS_m4x4mulLocal(tm1, tm2);
});


function _MJS_m4x4transposeLocal(m) {
    var r = new Float64Array(16);

    r[0] = m[0]; r[1] = m[4]; r[2] = m[8]; r[3] = m[12];
    r[4] = m[1]; r[5] = m[5]; r[6] = m[9]; r[7] = m[13];
    r[8] = m[2]; r[9] = m[6]; r[10] = m[10]; r[11] = m[14];
    r[12] = m[3]; r[13] = m[7]; r[14] = m[11]; r[15] = m[15];

    return r;
}
var _MJS_m4x4transpose = _MJS_m4x4transposeLocal;

var _MJS_m4x4makeBasis = F3(function(vx, vy, vz) {
    var r = new Float64Array(16);

    r[0] = vx[0];
    r[1] = vx[1];
    r[2] = vx[2];
    r[3] = 0;
    r[4] = vy[0];
    r[5] = vy[1];
    r[6] = vy[2];
    r[7] = 0;
    r[8] = vz[0];
    r[9] = vz[1];
    r[10] = vz[2];
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
});


var _WebGL_guid = 0;

function _WebGL_listEach(fn, list) {
  for (; list.b; list = list.b) {
    fn(list.a);
  }
}

function _WebGL_listLength(list) {
  var length = 0;
  for (; list.b; list = list.b) {
    length++;
  }
  return length;
}

var _WebGL_rAF = typeof requestAnimationFrame !== 'undefined' ?
  requestAnimationFrame :
  function (cb) { setTimeout(cb, 1000 / 60); };

// eslint-disable-next-line no-unused-vars
var _WebGL_entity = F5(function (settings, vert, frag, mesh, uniforms) {
  return {
    $: 0,
    a: settings,
    b: vert,
    c: frag,
    d: mesh,
    e: uniforms
  };
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableBlend = F2(function (cache, setting) {
  var blend = cache.blend;
  blend.toggle = cache.toggle;

  if (!blend.enabled) {
    cache.gl.enable(cache.gl.BLEND);
    blend.enabled = true;
  }

  // a   b   c   d   e   f   g h i j
  // eq1 f11 f12 eq2 f21 f22 r g b a
  if (blend.a !== setting.a || blend.d !== setting.d) {
    cache.gl.blendEquationSeparate(setting.a, setting.d);
    blend.a = setting.a;
    blend.d = setting.d;
  }
  if (blend.b !== setting.b || blend.c !== setting.c || blend.e !== setting.e || blend.f !== setting.f) {
    cache.gl.blendFuncSeparate(setting.b, setting.c, setting.e, setting.f);
    blend.b = setting.b;
    blend.c = setting.c;
    blend.e = setting.e;
    blend.f = setting.f;
  }
  if (blend.g !== setting.g || blend.h !== setting.h || blend.i !== setting.i || blend.j !== setting.j) {
    cache.gl.blendColor(setting.g, setting.h, setting.i, setting.j);
    blend.g = setting.g;
    blend.h = setting.h;
    blend.i = setting.i;
    blend.j = setting.j;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableDepthTest = F2(function (cache, setting) {
  var depthTest = cache.depthTest;
  depthTest.toggle = cache.toggle;

  if (!depthTest.enabled) {
    cache.gl.enable(cache.gl.DEPTH_TEST);
    depthTest.enabled = true;
  }

  // a    b    c    d
  // func mask near far
  if (depthTest.a !== setting.a) {
    cache.gl.depthFunc(setting.a);
    depthTest.a = setting.a;
  }
  if (depthTest.b !== setting.b) {
    cache.gl.depthMask(setting.b);
    depthTest.b = setting.b;
  }
  if (depthTest.c !== setting.c || depthTest.d !== setting.d) {
    cache.gl.depthRange(setting.c, setting.d);
    depthTest.c = setting.c;
    depthTest.d = setting.d;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableStencilTest = F2(function (cache, setting) {
  var stencilTest = cache.stencilTest;
  stencilTest.toggle = cache.toggle;

  if (!stencilTest.enabled) {
    cache.gl.enable(cache.gl.STENCIL_TEST);
    stencilTest.enabled = true;
  }

  // a   b    c         d     e     f      g      h     i     j      k
  // ref mask writeMask test1 fail1 zfail1 zpass1 test2 fail2 zfail2 zpass2
  if (stencilTest.d !== setting.d || stencilTest.a !== setting.a || stencilTest.b !== setting.b) {
    cache.gl.stencilFuncSeparate(cache.gl.FRONT, setting.d, setting.a, setting.b);
    stencilTest.d = setting.d;
    // a and b are set in the cache.gl.BACK diffing because they should be the same
  }
  if (stencilTest.e !== setting.e || stencilTest.f !== setting.f || stencilTest.g !== setting.g) {
    cache.gl.stencilOpSeparate(cache.gl.FRONT, setting.e, setting.f, setting.g);
    stencilTest.e = setting.e;
    stencilTest.f = setting.f;
    stencilTest.g = setting.g;
  }
  if (stencilTest.c !== setting.c) {
    cache.gl.stencilMask(setting.c);
    stencilTest.c = setting.c;
  }
  if (stencilTest.h !== setting.h || stencilTest.a !== setting.a || stencilTest.b !== setting.b) {
    cache.gl.stencilFuncSeparate(cache.gl.BACK, setting.h, setting.a, setting.b);
    stencilTest.h = setting.h;
    stencilTest.a = setting.a;
    stencilTest.b = setting.b;
  }
  if (stencilTest.i !== setting.i || stencilTest.j !== setting.j || stencilTest.k !== setting.k) {
    cache.gl.stencilOpSeparate(cache.gl.BACK, setting.i, setting.j, setting.k);
    stencilTest.i = setting.i;
    stencilTest.j = setting.j;
    stencilTest.k = setting.k;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableScissor = F2(function (cache, setting) {
  var scissor = cache.scissor;
  scissor.toggle = cache.toggle;

  if (!scissor.enabled) {
    cache.gl.enable(cache.gl.SCISSOR_TEST);
    scissor.enabled = true;
  }

  if (scissor.a !== setting.a || scissor.b !== setting.b || scissor.c !== setting.c || scissor.d !== setting.d) {
    cache.gl.scissor(setting.a, setting.b, setting.c, setting.d);
    scissor.a = setting.a;
    scissor.b = setting.b;
    scissor.c = setting.c;
    scissor.d = setting.d;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableColorMask = F2(function (cache, setting) {
  var colorMask = cache.colorMask;
  colorMask.toggle = cache.toggle;
  colorMask.enabled = true;

  if (colorMask.a !== setting.a || colorMask.b !== setting.b || colorMask.c !== setting.c || colorMask.d !== setting.d) {
    cache.gl.colorMask(setting.a, setting.b, setting.c, setting.d);
    colorMask.a = setting.a;
    colorMask.b = setting.b;
    colorMask.c = setting.c;
    colorMask.d = setting.d;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableCullFace = F2(function (cache, setting) {
  var cullFace = cache.cullFace;
  cullFace.toggle = cache.toggle;

  if (!cullFace.enabled) {
    cache.gl.enable(cache.gl.CULL_FACE);
    cullFace.enabled = true;
  }

  if (cullFace.a !== setting.a) {
    cache.gl.cullFace(setting.a);
    cullFace.a = setting.a;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enablePolygonOffset = F2(function (cache, setting) {
  var polygonOffset = cache.polygonOffset;
  polygonOffset.toggle = cache.toggle;

  if (!polygonOffset.enabled) {
    cache.gl.enable(cache.gl.POLYGON_OFFSET_FILL);
    polygonOffset.enabled = true;
  }

  if (polygonOffset.a !== setting.a || polygonOffset.b !== setting.b) {
    cache.gl.polygonOffset(setting.a, setting.b);
    polygonOffset.a = setting.a;
    polygonOffset.b = setting.b;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableSampleCoverage = F2(function (cache, setting) {
  var sampleCoverage = cache.sampleCoverage;
  sampleCoverage.toggle = cache.toggle;

  if (!sampleCoverage.enabled) {
    cache.gl.enable(cache.gl.SAMPLE_COVERAGE);
    sampleCoverage.enabled = true;
  }

  if (sampleCoverage.a !== setting.a || sampleCoverage.b !== setting.b) {
    cache.gl.sampleCoverage(setting.a, setting.b);
    sampleCoverage.a = setting.a;
    sampleCoverage.b = setting.b;
  }
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableSampleAlphaToCoverage = function (cache) {
  var sampleAlphaToCoverage = cache.sampleAlphaToCoverage;
  sampleAlphaToCoverage.toggle = cache.toggle;

  if (!sampleAlphaToCoverage.enabled) {
    cache.gl.enable(cache.gl.SAMPLE_ALPHA_TO_COVERAGE);
    sampleAlphaToCoverage.enabled = true;
  }
};

var _WebGL_disableBlend = function (cache) {
  if (cache.blend.enabled) {
    cache.gl.disable(cache.gl.BLEND);
    cache.blend.enabled = false;
  }
};

var _WebGL_disableDepthTest = function (cache) {
  if (cache.depthTest.enabled) {
    cache.gl.disable(cache.gl.DEPTH_TEST);
    cache.depthTest.enabled = false;
  }
};

var _WebGL_disableStencilTest = function (cache) {
  if (cache.stencilTest.enabled) {
    cache.gl.disable(cache.gl.STENCIL_TEST);
    cache.stencilTest.enabled = false;
  }
};

var _WebGL_disableScissor = function (cache) {
  if (cache.scissor.enabled) {
    cache.gl.disable(cache.gl.SCISSOR_TEST);
    cache.scissor.enabled = false;
  }
};

var _WebGL_disableColorMask = function (cache) {
  var colorMask = cache.colorMask;
  if (!colorMask.a || !colorMask.b || !colorMask.c || !colorMask.d) {
    cache.gl.colorMask(true, true, true, true);
    colorMask.a = true;
    colorMask.b = true;
    colorMask.c = true;
    colorMask.d = true;
  }
};

var _WebGL_disableCullFace = function (cache) {
  cache.gl.disable(cache.gl.CULL_FACE);
};

var _WebGL_disablePolygonOffset = function (cache) {
  cache.gl.disable(cache.gl.POLYGON_OFFSET_FILL);
};

var _WebGL_disableSampleCoverage = function (cache) {
  cache.gl.disable(cache.gl.SAMPLE_COVERAGE);
};

var _WebGL_disableSampleAlphaToCoverage = function (cache) {
  cache.gl.disable(cache.gl.SAMPLE_ALPHA_TO_COVERAGE);
};

var _WebGL_settings = ['blend', 'depthTest', 'stencilTest', 'scissor', 'colorMask', 'cullFace', 'polygonOffset', 'sampleCoverage', 'sampleAlphaToCoverage'];
var _WebGL_disableFunctions = [_WebGL_disableBlend, _WebGL_disableDepthTest, _WebGL_disableStencilTest, _WebGL_disableScissor, _WebGL_disableColorMask, _WebGL_disableCullFace, _WebGL_disablePolygonOffset, _WebGL_disableSampleCoverage, _WebGL_disableSampleAlphaToCoverage];

function _WebGL_doCompile(gl, src, type) {
  var shader = gl.createShader(type);
  // Enable OES_standard_derivatives extension
  gl.shaderSource(shader, '#extension GL_OES_standard_derivatives : enable\n' + src);
  gl.compileShader(shader);
  return shader;
}

function _WebGL_doLink(gl, vshader, fshader) {
  var program = gl.createProgram();

  gl.attachShader(program, vshader);
  gl.attachShader(program, fshader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw ('Link failed: ' + gl.getProgramInfoLog(program) +
      '\nvs info-log: ' + gl.getShaderInfoLog(vshader) +
      '\nfs info-log: ' + gl.getShaderInfoLog(fshader));
  }

  return program;
}

function _WebGL_getAttributeInfo(gl, type) {
  switch (type) {
    case gl.FLOAT:
      return { size: 1, arraySize: 1, type: Float32Array, baseType: gl.FLOAT };
    case gl.FLOAT_VEC2:
      return { size: 2, arraySize: 1, type: Float32Array, baseType: gl.FLOAT };
    case gl.FLOAT_VEC3:
      return { size: 3, arraySize: 1, type: Float32Array, baseType: gl.FLOAT };
    case gl.FLOAT_VEC4:
      return { size: 4, arraySize: 1, type: Float32Array, baseType: gl.FLOAT };
    case gl.FLOAT_MAT4:
      return { size: 4, arraySize: 4, type: Float32Array, baseType: gl.FLOAT };
    case gl.INT:
      return { size: 1, arraySize: 1, type: Int32Array, baseType: gl.INT };
  }
}

/**
 *  Form the buffer for a given attribute.
 *
 *  @param {WebGLRenderingContext} gl context
 *  @param {WebGLActiveInfo} attribute the attribute to bind to.
 *         We use its name to grab the record by name and also to know
 *         how many elements we need to grab.
 *  @param {Mesh} mesh The mesh coming in from Elm.
 *  @param {Object} attributes The mapping between the attribute names and Elm fields
 *  @return {WebGLBuffer}
 */
function _WebGL_doBindAttribute(gl, attribute, mesh, attributes) {
  // The length of the number of vertices that
  // complete one 'thing' based on the drawing mode.
  // ie, 2 for Lines, 3 for Triangles, etc.
  var elemSize = mesh.a.elemSize;

  var idxKeys = [];
  for (var i = 0; i < elemSize; i++) {
    idxKeys.push(String.fromCharCode(97 + i));
  }

  function dataFill(data, cnt, fillOffset, elem, key) {
    var i;
    if (elemSize === 1) {
      for (i = 0; i < cnt; i++) {
        data[fillOffset++] = cnt === 1 ? elem[key] : elem[key][i];
      }
    } else {
      idxKeys.forEach(function (idx) {
        for (i = 0; i < cnt; i++) {
          data[fillOffset++] = cnt === 1 ? elem[idx][key] : elem[idx][key][i];
        }
      });
    }
  }

  var attributeInfo = _WebGL_getAttributeInfo(gl, attribute.type);

  if (attributeInfo === undefined) {
    throw new Error('No info available for: ' + attribute.type);
  }

  var dataIdx = 0;
  var dataOffset = attributeInfo.size * attributeInfo.arraySize * elemSize;
  var array = new attributeInfo.type(_WebGL_listLength(mesh.b) * dataOffset);

  _WebGL_listEach(function (elem) {
    dataFill(array, attributeInfo.size * attributeInfo.arraySize, dataIdx, elem, attributes[attribute.name] || attribute.name);
    dataIdx += dataOffset;
  }, mesh.b);

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  return buffer;
}

/**
 *  This sets up the binding caching buffers.
 *
 *  We don't actually bind any buffers now except for the indices buffer.
 *  The problem with filling the buffers here is that it is possible to
 *  have a buffer shared between two webgl shaders;
 *  which could have different active attributes. If we bind it here against
 *  a particular program, we might not bind them all. That final bind is now
 *  done right before drawing.
 *
 *  @param {WebGLRenderingContext} gl context
 *  @param {Mesh} mesh a mesh object from Elm
 *  @return {Object} buffer - an object with the following properties
 *  @return {Number} buffer.numIndices
 *  @return {WebGLBuffer|null} buffer.indexBuffer - optional index buffer
 *  @return {Object} buffer.buffers - will be used to buffer attributes
 */
function _WebGL_doBindSetup(gl, mesh) {
  if (mesh.a.indexSize > 0) {
    var indexBuffer = gl.createBuffer();
    var indices = _WebGL_makeIndexedBuffer(mesh.c, mesh.a.indexSize);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    return {
      numIndices: indices.length,
      indexBuffer: indexBuffer,
      buffers: {}
    };
  } else {
    return {
      numIndices: mesh.a.elemSize * _WebGL_listLength(mesh.b),
      indexBuffer: null,
      buffers: {}
    };
  }
}

/**
 *  Create an indices array and fill it from indices
 *  based on the size of the index
 *
 *  @param {List} indicesList the list of indices
 *  @param {Number} indexSize the size of the index
 *  @return {Uint32Array} indices
 */
function _WebGL_makeIndexedBuffer(indicesList, indexSize) {
  var indices = new Uint32Array(_WebGL_listLength(indicesList) * indexSize);
  var fillOffset = 0;
  var i;
  _WebGL_listEach(function (elem) {
    if (indexSize === 1) {
      indices[fillOffset++] = elem;
    } else {
      for (i = 0; i < indexSize; i++) {
        indices[fillOffset++] = elem[String.fromCharCode(97 + i)];
      }
    }
  }, indicesList);
  return indices;
}

function _WebGL_getProgID(vertID, fragID) {
  return vertID + '#' + fragID;
}

var _WebGL_drawGL = F2(function (model, domNode) {
  var cache = model.f;
  var gl = cache.gl;

  if (!gl) {
    return domNode;
  }

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  if (!cache.depthTest.b) {
    gl.depthMask(true);
    cache.depthTest.b = true;
  }
  if (cache.stencilTest.c !== cache.STENCIL_WRITEMASK) {
    gl.stencilMask(cache.STENCIL_WRITEMASK);
    cache.stencilTest.c = cache.STENCIL_WRITEMASK;
  }
  _WebGL_disableScissor(cache);
  _WebGL_disableColorMask(cache);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

  function drawEntity(entity) {
    if (!entity.d.b.b) {
      return; // Empty list
    }

    var progid;
    var program;
    var i;

    if (entity.b.id && entity.c.id) {
      progid = _WebGL_getProgID(entity.b.id, entity.c.id);
      program = cache.programs[progid];
    }

    if (!program) {

      var vshader;
      if (entity.b.id) {
        vshader = cache.shaders[entity.b.id];
      } else {
        entity.b.id = _WebGL_guid++;
      }

      if (!vshader) {
        vshader = _WebGL_doCompile(gl, entity.b.src, gl.VERTEX_SHADER);
        cache.shaders[entity.b.id] = vshader;
      }

      var fshader;
      if (entity.c.id) {
        fshader = cache.shaders[entity.c.id];
      } else {
        entity.c.id = _WebGL_guid++;
      }

      if (!fshader) {
        fshader = _WebGL_doCompile(gl, entity.c.src, gl.FRAGMENT_SHADER);
        cache.shaders[entity.c.id] = fshader;
      }

      var glProgram = _WebGL_doLink(gl, vshader, fshader);

      program = {
        glProgram: glProgram,
        attributes: Object.assign({}, entity.b.attributes, entity.c.attributes),
        currentUniforms: {},
        activeAttributes: [],
        activeAttributeLocations: []
      };

      program.uniformSetters = _WebGL_createUniformSetters(
        gl,
        model,
        program,
        Object.assign({}, entity.b.uniforms, entity.c.uniforms)
      );

      var numActiveAttributes = gl.getProgramParameter(glProgram, gl.ACTIVE_ATTRIBUTES);
      for (i = 0; i < numActiveAttributes; i++) {
        var attribute = gl.getActiveAttrib(glProgram, i);
        var attribLocation = gl.getAttribLocation(glProgram, attribute.name);
        program.activeAttributes.push(attribute);
        program.activeAttributeLocations.push(attribLocation);
      }

      progid = _WebGL_getProgID(entity.b.id, entity.c.id);
      cache.programs[progid] = program;
    }

    if (cache.lastProgId !== progid) {
      gl.useProgram(program.glProgram);
      cache.lastProgId = progid;
    }

    _WebGL_setUniforms(program.uniformSetters, entity.e);

    var buffer = cache.buffers.get(entity.d);

    if (!buffer) {
      buffer = _WebGL_doBindSetup(gl, entity.d);
      cache.buffers.set(entity.d, buffer);
    }

    for (i = 0; i < program.activeAttributes.length; i++) {
      attribute = program.activeAttributes[i];
      attribLocation = program.activeAttributeLocations[i];

      if (buffer.buffers[attribute.name] === undefined) {
        buffer.buffers[attribute.name] = _WebGL_doBindAttribute(gl, attribute, entity.d, program.attributes);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffers[attribute.name]);

      var attributeInfo = _WebGL_getAttributeInfo(gl, attribute.type);
      if (attributeInfo.arraySize === 1) {
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, attributeInfo.size, attributeInfo.baseType, false, 0, 0);
      } else {
        // Point to four vec4 in case of mat4
        var offset = attributeInfo.size * 4; // float32 takes 4 bytes
        var stride = offset * attributeInfo.arraySize;
        for (var m = 0; m < attributeInfo.arraySize; m++) {
          gl.enableVertexAttribArray(attribLocation + m);
          gl.vertexAttribPointer(attribLocation + m, attributeInfo.size, attributeInfo.baseType, false, stride, offset * m);
        }
      }
    }

    // Apply all the new settings
    cache.toggle = !cache.toggle;
    _WebGL_listEach($elm_explorations$webgl$WebGL$Internal$enableSetting(cache), entity.a);
    // Disable the settings that were applied in the previous draw call
    for (i = 0; i < _WebGL_settings.length; i++) {
      var setting = cache[_WebGL_settings[i]];
      if (setting.toggle !== cache.toggle && setting.enabled) {
        _WebGL_disableFunctions[i](cache);
        setting.enabled = false;
        setting.toggle = cache.toggle;
      }
    }

    if (buffer.indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indexBuffer);
      gl.drawElements(entity.d.a.mode, buffer.numIndices, gl.UNSIGNED_INT, 0);
    } else {
      gl.drawArrays(entity.d.a.mode, 0, buffer.numIndices);
    }
  }

  _WebGL_listEach(drawEntity, model.g);
  return domNode;
});

function _WebGL_createUniformSetters(gl, model, program, uniformsMap) {
  var glProgram = program.glProgram;
  var currentUniforms = program.currentUniforms;
  var textureCounter = 0;
  var cache = model.f;
  function createUniformSetter(glProgram, uniform) {
    var uniformName = uniform.name;
    var uniformLocation = gl.getUniformLocation(glProgram, uniformName);
    switch (uniform.type) {
      case gl.INT:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform1i(uniformLocation, value);
            currentUniforms[uniformName] = value;
          }
        };
      case gl.FLOAT:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform1f(uniformLocation, value);
            currentUniforms[uniformName] = value;
          }
        };
      case gl.FLOAT_VEC2:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform2f(uniformLocation, value[0], value[1]);
            currentUniforms[uniformName] = value;
          }
        };
      case gl.FLOAT_VEC3:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform3f(uniformLocation, value[0], value[1], value[2]);
            currentUniforms[uniformName] = value;
          }
        };
      case gl.FLOAT_VEC4:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform4f(uniformLocation, value[0], value[1], value[2], value[3]);
            currentUniforms[uniformName] = value;
          }
        };
      case gl.FLOAT_MAT4:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniformMatrix4fv(uniformLocation, false, new Float32Array(value));
            currentUniforms[uniformName] = value;
          }
        };
      case gl.SAMPLER_2D:
        var currentTexture = textureCounter++;
        return function (texture) {
          gl.activeTexture(gl.TEXTURE0 + currentTexture);
          var tex = cache.textures.get(texture);
          if (!tex) {
            tex = texture.createTexture(gl);
            cache.textures.set(texture, tex);
          }
          gl.bindTexture(gl.TEXTURE_2D, tex);
          if (currentUniforms[uniformName] !== texture) {
            gl.uniform1i(uniformLocation, currentTexture);
            currentUniforms[uniformName] = texture;
          }
        };
      case gl.BOOL:
        return function (value) {
          if (currentUniforms[uniformName] !== value) {
            gl.uniform1i(uniformLocation, value);
            currentUniforms[uniformName] = value;
          }
        };
      default:
        return function () { };
    }
  }

  var uniformSetters = {};
  var numUniforms = gl.getProgramParameter(glProgram, gl.ACTIVE_UNIFORMS);
  for (var i = 0; i < numUniforms; i++) {
    var uniform = gl.getActiveUniform(glProgram, i);
    uniformSetters[uniformsMap[uniform.name] || uniform.name] = createUniformSetter(glProgram, uniform);
  }

  return uniformSetters;
}

function _WebGL_setUniforms(setters, values) {
  Object.keys(values).forEach(function (name) {
    var setter = setters[name];
    if (setter) {
      setter(values[name]);
    }
  });
}

// VIRTUAL-DOM WIDGET

// eslint-disable-next-line no-unused-vars
var _WebGL_toHtml = F3(function (options, factList, entities) {
  return _VirtualDom_custom(
    factList,
    {
      g: entities,
      f: {},
      h: options
    },
    _WebGL_render,
    _WebGL_diff
  );
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableAlpha = F2(function (options, option) {
  options.contextAttributes.alpha = true;
  options.contextAttributes.premultipliedAlpha = option.a;
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableDepth = F2(function (options, option) {
  options.contextAttributes.depth = true;
  options.sceneSettings.push(function (gl) {
    gl.clearDepth(option.a);
  });
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableStencil = F2(function (options, option) {
  options.contextAttributes.stencil = true;
  options.sceneSettings.push(function (gl) {
    gl.clearStencil(option.a);
  });
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableAntialias = F2(function (options, option) {
  options.contextAttributes.antialias = true;
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enableClearColor = F2(function (options, option) {
  options.sceneSettings.push(function (gl) {
    gl.clearColor(option.a, option.b, option.c, option.d);
  });
});

// eslint-disable-next-line no-unused-vars
var _WebGL_enablePreserveDrawingBuffer = F2(function (options, option) {
  options.contextAttributes.preserveDrawingBuffer = true;
});

/**
 *  Creates canvas and schedules initial _WebGL_drawGL
 *  @param {Object} model
 *  @param {Object} model.f that may contain the following properties:
           gl, shaders, programs, buffers, textures
 *  @param {List<Option>} model.h list of options coming from Elm
 *  @param {List<Entity>} model.g list of entities coming from Elm
 *  @return {HTMLElement} <canvas> if WebGL is supported, otherwise a <div>
 */
function _WebGL_render(model) {
  var options = {
    contextAttributes: {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    },
    sceneSettings: []
  };

  _WebGL_listEach(function (option) {
    return A2($elm_explorations$webgl$WebGL$Internal$enableOption, options, option);
  }, model.h);

  var canvas = _VirtualDom_doc.createElement('canvas');
  var gl = canvas.getContext && (
    canvas.getContext('webgl', options.contextAttributes) ||
    canvas.getContext('experimental-webgl', options.contextAttributes)
  );

  if (gl && typeof WeakMap !== 'undefined') {
    options.sceneSettings.forEach(function (sceneSetting) {
      sceneSetting(gl);
    });

    // Activate extensions
    gl.getExtension('OES_standard_derivatives');
    gl.getExtension('OES_element_index_uint');

    model.f.gl = gl;

    // Cache the current settings in order to diff them to avoid redundant calls
    // https://emscripten.org/docs/optimizing/Optimizing-WebGL.html#avoid-redundant-calls
    model.f.toggle = false; // used to diff the settings from the previous and current draw calls
    model.f.blend = { enabled: false, toggle: false };
    model.f.depthTest = { enabled: false, toggle: false };
    model.f.stencilTest = { enabled: false, toggle: false };
    model.f.scissor = { enabled: false, toggle: false };
    model.f.colorMask = { enabled: false, toggle: false };
    model.f.cullFace = { enabled: false, toggle: false };
    model.f.polygonOffset = { enabled: false, toggle: false };
    model.f.sampleCoverage = { enabled: false, toggle: false };
    model.f.sampleAlphaToCoverage = { enabled: false, toggle: false };

    model.f.shaders = [];
    model.f.programs = {};
    model.f.lastProgId = null;
    model.f.buffers = new WeakMap();
    model.f.textures = new WeakMap();
    // Memorize the initial stencil write mask, because
    // browsers may have different number of stencil bits
    model.f.STENCIL_WRITEMASK = gl.getParameter(gl.STENCIL_WRITEMASK);

    // Render for the first time.
    // This has to be done in animation frame,
    // because the canvas is not in the DOM yet
    _WebGL_rAF(function () {
      return A2(_WebGL_drawGL, model, canvas);
    });

  } else {
    canvas = _VirtualDom_doc.createElement('div');
    canvas.innerHTML = '<a href="https://get.webgl.org/">Enable WebGL</a> to see this content!';
  }

  return canvas;
}

function _WebGL_diff(oldModel, newModel) {
  newModel.f = oldModel.f;
  return _WebGL_drawGL(newModel);
}
var $author$project$Main$LinkClicked = function (a) {
	return {$: 'LinkClicked', a: a};
};
var $author$project$Main$UrlChanged = function (a) {
	return {$: 'UrlChanged', a: a};
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$NotFoundPage = {$: 'NotFoundPage'};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$DecodingJson$Flags = F5(
	function (save1, save2, save3, settings, highScores) {
		return {highScores: highScores, save1: save1, save2: save2, save3: save3, settings: settings};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map5 = _Json_map5;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$DecodingJson$Save = F5(
	function (name, difficulty, player, time, level) {
		return {difficulty: difficulty, level: level, name: name, player: player, time: time};
	});
var $author$project$DecodingJson$Easy = {$: 'Easy'};
var $author$project$DecodingJson$Hard = {$: 'Hard'};
var $author$project$DecodingJson$Medium = {$: 'Medium'};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$DecodingJson$difficultyDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (string) {
		switch (string) {
			case 'easy':
				return $elm$json$Json$Decode$succeed($author$project$DecodingJson$Easy);
			case 'medium':
				return $elm$json$Json$Decode$succeed($author$project$DecodingJson$Medium);
			case 'hard':
				return $elm$json$Json$Decode$succeed($author$project$DecodingJson$Hard);
			default:
				return $elm$json$Json$Decode$fail('Invalid Difficulty');
		}
	},
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Level$Level = F8(
	function (map, mapTexture, enemies, items, startX, startY, endX, endY) {
		return {endX: endX, endY: endY, enemies: enemies, items: items, map: map, mapTexture: mapTexture, startX: startX, startY: startY};
	});
var $author$project$Level$Lvl1 = {$: 'Lvl1'};
var $author$project$Level$Lvl2 = {$: 'Lvl2'};
var $author$project$Level$Lvl3 = {$: 'Lvl3'};
var $author$project$Enemy$Bandit = {$: 'Bandit'};
var $author$project$Enemy$Down = {$: 'Down'};
var $author$project$Enemy$Enemy = function (initX) {
	return function (initY) {
		return function (initDir) {
			return function (x) {
				return function (y) {
					return function (vx) {
						return function (vy) {
							return function (dir) {
								return function (width) {
									return function (height) {
										return function (enemyType) {
											return function (distanceLoop) {
												return function (speed) {
													return function (attack) {
														return function (health) {
															return function (expDrop) {
																return function (detectPlayerRadius) {
																	return function (hostile) {
																		return function (alive) {
																			return {alive: alive, attack: attack, detectPlayerRadius: detectPlayerRadius, dir: dir, distanceLoop: distanceLoop, enemyType: enemyType, expDrop: expDrop, health: health, height: height, hostile: hostile, initDir: initDir, initX: initX, initY: initY, speed: speed, vx: vx, vy: vy, width: width, x: x, y: y};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Enemy$Left = {$: 'Left'};
var $author$project$Enemy$Prototype = {$: 'Prototype'};
var $author$project$Enemy$Right = {$: 'Right'};
var $author$project$Enemy$Skeleton = {$: 'Skeleton'};
var $author$project$Enemy$Up = {$: 'Up'};
var $author$project$Enemy$Zombie = {$: 'Zombie'};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded = A2($elm$core$Basics$composeR, $elm$json$Json$Decode$succeed, $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom);
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $author$project$DecodingJson$enemyDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'alive',
	$elm$json$Json$Decode$bool,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'hostile',
		$elm$json$Json$Decode$bool,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'detectPlayerRadius',
			$elm$json$Json$Decode$float,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'expDrop',
				$elm$json$Json$Decode$int,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'health',
					$elm$json$Json$Decode$int,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'attack',
						$elm$json$Json$Decode$int,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'speed',
							$elm$json$Json$Decode$float,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'distanceLoop',
								$elm$json$Json$Decode$float,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'enemyType',
									A2(
										$elm$json$Json$Decode$andThen,
										function (string) {
											switch (string) {
												case 'bandit':
													return $elm$json$Json$Decode$succeed($author$project$Enemy$Bandit);
												case 'zombie':
													return $elm$json$Json$Decode$succeed($author$project$Enemy$Zombie);
												case 'skeleton':
													return $elm$json$Json$Decode$succeed($author$project$Enemy$Skeleton);
												case 'prototype':
													return $elm$json$Json$Decode$succeed($author$project$Enemy$Prototype);
												default:
													return $elm$json$Json$Decode$fail('Invalid EnemyType');
											}
										},
										$elm$json$Json$Decode$string),
									A2(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
										2.0,
										A2(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
											1.0,
											A3(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'dir',
												A2(
													$elm$json$Json$Decode$andThen,
													function (string) {
														switch (string) {
															case 'left':
																return $elm$json$Json$Decode$succeed($author$project$Enemy$Left);
															case 'right':
																return $elm$json$Json$Decode$succeed($author$project$Enemy$Right);
															case 'up':
																return $elm$json$Json$Decode$succeed($author$project$Enemy$Up);
															case 'down':
																return $elm$json$Json$Decode$succeed($author$project$Enemy$Down);
															default:
																return $elm$json$Json$Decode$fail('Invalid Direction');
														}
													},
													$elm$json$Json$Decode$string),
												A3(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
													'vy',
													$elm$json$Json$Decode$float,
													A3(
														$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
														'vx',
														$elm$json$Json$Decode$float,
														A3(
															$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
															'y',
															$elm$json$Json$Decode$float,
															A3(
																$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																'x',
																$elm$json$Json$Decode$float,
																A3(
																	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																	'initDir',
																	A2(
																		$elm$json$Json$Decode$andThen,
																		function (string) {
																			switch (string) {
																				case 'left':
																					return $elm$json$Json$Decode$succeed($author$project$Enemy$Left);
																				case 'right':
																					return $elm$json$Json$Decode$succeed($author$project$Enemy$Right);
																				case 'up':
																					return $elm$json$Json$Decode$succeed($author$project$Enemy$Up);
																				case 'down':
																					return $elm$json$Json$Decode$succeed($author$project$Enemy$Down);
																				default:
																					return $elm$json$Json$Decode$fail('Invalid Direction');
																			}
																		},
																		$elm$json$Json$Decode$string),
																	A3(
																		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																		'initY',
																		$elm$json$Json$Decode$float,
																		A3(
																			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																			'initX',
																			$elm$json$Json$Decode$float,
																			$elm$json$Json$Decode$succeed($author$project$Enemy$Enemy))))))))))))))))))));
var $author$project$Item$DragonArmor_ItemStand = {$: 'DragonArmor_ItemStand'};
var $author$project$Item$DragonSword_ItemStand = {$: 'DragonSword_ItemStand'};
var $author$project$Item$HealthPotion_ItemStand = {$: 'HealthPotion_ItemStand'};
var $author$project$Item$IronSword_ItemStand = {$: 'IronSword_ItemStand'};
var $author$project$Item$Item = F6(
	function (x, y, width, height, itemType, pickable) {
		return {height: height, itemType: itemType, pickable: pickable, width: width, x: x, y: y};
	});
var $author$project$Item$ItemStand = {$: 'ItemStand'};
var $author$project$Item$LeatherArmor_ItemStand = {$: 'LeatherArmor_ItemStand'};
var $author$project$Item$SilverArmor_ItemStand = {$: 'SilverArmor_ItemStand'};
var $author$project$Item$SpeedPotion_ItemStand = {$: 'SpeedPotion_ItemStand'};
var $author$project$Item$StoneSword_ItemStand = {$: 'StoneSword_ItemStand'};
var $author$project$Item$WoodSword_ItemStand = {$: 'WoodSword_ItemStand'};
var $elm$json$Json$Decode$map6 = _Json_map6;
var $author$project$DecodingJson$itemDecoder = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Item$Item,
	A2($elm$json$Json$Decode$field, 'x', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'y', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'width', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'height', $elm$json$Json$Decode$float),
	A2(
		$elm$json$Json$Decode$field,
		'itemType',
		A2(
			$elm$json$Json$Decode$andThen,
			function (string) {
				switch (string) {
					case 'empty':
						return $elm$json$Json$Decode$succeed($author$project$Item$ItemStand);
					case 'health_potion_idle':
						return $elm$json$Json$Decode$succeed($author$project$Item$HealthPotion_ItemStand);
					case 'speed_potion_idle':
						return $elm$json$Json$Decode$succeed($author$project$Item$SpeedPotion_ItemStand);
					case 'sword_wood_idle':
						return $elm$json$Json$Decode$succeed($author$project$Item$WoodSword_ItemStand);
					case 'sword_stone_idle':
						return $elm$json$Json$Decode$succeed($author$project$Item$StoneSword_ItemStand);
					case 'sword_iron_idle':
						return $elm$json$Json$Decode$succeed($author$project$Item$IronSword_ItemStand);
					case 'sword_dragon_idle':
						return $elm$json$Json$Decode$succeed($author$project$Item$DragonSword_ItemStand);
					case 'leather_chest':
						return $elm$json$Json$Decode$succeed($author$project$Item$LeatherArmor_ItemStand);
					case 'silver_chest':
						return $elm$json$Json$Decode$succeed($author$project$Item$SilverArmor_ItemStand);
					case 'dragon_chest':
						return $elm$json$Json$Decode$succeed($author$project$Item$DragonArmor_ItemStand);
					default:
						return $elm$json$Json$Decode$fail('Invalid ItemType');
				}
			},
			$elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'pickable', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$map8 = _Json_map8;
var $author$project$DecodingJson$levelDecoder = A9(
	$elm$json$Json$Decode$map8,
	$author$project$Level$Level,
	A2(
		$elm$json$Json$Decode$field,
		'map',
		A2(
			$elm$json$Json$Decode$andThen,
			function (string) {
				switch (string) {
					case 'LvL1':
						return $elm$json$Json$Decode$succeed($author$project$Level$Lvl1);
					case 'LvL2':
						return $elm$json$Json$Decode$succeed($author$project$Level$Lvl2);
					case 'LvL3':
						return $elm$json$Json$Decode$succeed($author$project$Level$Lvl3);
					default:
						return $elm$json$Json$Decode$fail('Invalid Map');
				}
			},
			$elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'mapTexture', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'enemies',
		$elm$json$Json$Decode$list($author$project$DecodingJson$enemyDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'items',
		$elm$json$Json$Decode$list($author$project$DecodingJson$itemDecoder)),
	A2($elm$json$Json$Decode$field, 'startX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'startY', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'endX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'endY', $elm$json$Json$Decode$float));
var $author$project$Player$Idle = {$: 'Idle'};
var $author$project$Player$Player = function (x) {
	return function (y) {
		return function (vx) {
			return function (vy) {
				return function (baseSpeed) {
					return function (currentSpeed) {
						return function (width) {
							return function (height) {
								return function (dir) {
									return function (sword) {
										return function (armor) {
											return function (maxDefense) {
												return function (maxHealth) {
													return function (currentHealth) {
														return function (playerLevel) {
															return function (maxExp) {
																return function (currentExp) {
																	return function (healthPotions) {
																		return function (speedPotions) {
																			return {armor: armor, baseSpeed: baseSpeed, currentExp: currentExp, currentHealth: currentHealth, currentSpeed: currentSpeed, dir: dir, healthPotions: healthPotions, height: height, maxDefense: maxDefense, maxExp: maxExp, maxHealth: maxHealth, playerLevel: playerLevel, speedPotions: speedPotions, sword: sword, vx: vx, vy: vy, width: width, x: x, y: y};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Armor$Dragon = {$: 'Dragon'};
var $author$project$Armor$dragonArmorSet = {armorType: $author$project$Armor$Dragon, chestDef: 30, helmetDef: 30, legsDef: 30, totalDef: 90};
var $author$project$Sword$Dragon = {$: 'Dragon'};
var $author$project$Sword$Idle = {$: 'Idle'};
var $author$project$Sword$NotAttack = {$: 'NotAttack'};
var $author$project$Sword$dragonSword = {action: $author$project$Sword$NotAttack, attack: 20, dir: $author$project$Sword$Idle, height: 1.0, swordType: $author$project$Sword$Dragon, width: 0.5, x: 0, y: 0};
var $author$project$Sword$Iron = {$: 'Iron'};
var $author$project$Sword$ironSword = {action: $author$project$Sword$NotAttack, attack: 15, dir: $author$project$Sword$Idle, height: 1.0, swordType: $author$project$Sword$Iron, width: 0.5, x: 0, y: 0};
var $author$project$Armor$Leather = {$: 'Leather'};
var $author$project$Armor$leatherArmorSet = {armorType: $author$project$Armor$Leather, chestDef: 10, helmetDef: 10, legsDef: 10, totalDef: 30};
var $author$project$Armor$None = {$: 'None'};
var $author$project$Armor$noneArmorSet = {armorType: $author$project$Armor$None, chestDef: 5, helmetDef: 0, legsDef: 5, totalDef: 10};
var $author$project$Potion$Potion = F5(
	function (ratio, duration, cooldown, timeOfLastUse, count) {
		return {cooldown: cooldown, count: count, duration: duration, ratio: ratio, timeOfLastUse: timeOfLastUse};
	});
var $author$project$DecodingJson$potionDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Potion$Potion,
	A2($elm$json$Json$Decode$field, 'ratio', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'duration', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'cooldown', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'timeOfLastUse', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'count', $elm$json$Json$Decode$int));
var $author$project$Armor$Silver = {$: 'Silver'};
var $author$project$Armor$silverArmorSet = {armorType: $author$project$Armor$Silver, chestDef: 20, helmetDef: 20, legsDef: 20, totalDef: 60};
var $author$project$Sword$Stone = {$: 'Stone'};
var $author$project$Sword$stoneSword = {action: $author$project$Sword$NotAttack, attack: 10, dir: $author$project$Sword$Idle, height: 1.0, swordType: $author$project$Sword$Stone, width: 0.5, x: 0, y: 0};
var $author$project$Sword$Wood = {$: 'Wood'};
var $author$project$Sword$woodSword = {action: $author$project$Sword$NotAttack, attack: 5, dir: $author$project$Sword$Idle, height: 1.0, swordType: $author$project$Sword$Wood, width: 0.5, x: 0, y: 0};
var $author$project$DecodingJson$playerDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'speedPotions',
	$author$project$DecodingJson$potionDecoder,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'healthPotions',
		$author$project$DecodingJson$potionDecoder,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'currentExp',
			$elm$json$Json$Decode$int,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'maxExp',
				$elm$json$Json$Decode$int,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'playerLevel',
					$elm$json$Json$Decode$int,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'currentHealth',
						$elm$json$Json$Decode$int,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'maxHealth',
							$elm$json$Json$Decode$int,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'maxDefense',
								$elm$json$Json$Decode$int,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'armor',
									A2(
										$elm$json$Json$Decode$andThen,
										function (string) {
											switch (string) {
												case 'none':
													return $elm$json$Json$Decode$succeed($author$project$Armor$noneArmorSet);
												case 'leather':
													return $elm$json$Json$Decode$succeed($author$project$Armor$leatherArmorSet);
												case 'silver':
													return $elm$json$Json$Decode$succeed($author$project$Armor$silverArmorSet);
												case 'dragon':
													return $elm$json$Json$Decode$succeed($author$project$Armor$dragonArmorSet);
												default:
													return $elm$json$Json$Decode$fail('Invalid Armor');
											}
										},
										$elm$json$Json$Decode$string),
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'sword',
										A2(
											$elm$json$Json$Decode$andThen,
											function (string) {
												switch (string) {
													case 'wood':
														return $elm$json$Json$Decode$succeed($author$project$Sword$woodSword);
													case 'stone':
														return $elm$json$Json$Decode$succeed($author$project$Sword$stoneSword);
													case 'iron':
														return $elm$json$Json$Decode$succeed($author$project$Sword$ironSword);
													case 'dragon':
														return $elm$json$Json$Decode$succeed($author$project$Sword$dragonSword);
													default:
														return $elm$json$Json$Decode$fail('Invalid Sword');
												}
											},
											$elm$json$Json$Decode$string),
										A2(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
											$author$project$Player$Idle,
											A2(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
												2.0,
												A2(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
													1.0,
													A3(
														$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
														'currentSpeed',
														$elm$json$Json$Decode$float,
														A3(
															$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
															'baseSpeed',
															$elm$json$Json$Decode$float,
															A2(
																$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
																0.0,
																A2(
																	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
																	0.0,
																	A3(
																		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																		'y',
																		$elm$json$Json$Decode$float,
																		A3(
																			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																			'x',
																			$elm$json$Json$Decode$float,
																			$elm$json$Json$Decode$succeed($author$project$Player$Player))))))))))))))))))));
var $author$project$DecodingJson$saveDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$DecodingJson$Save,
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'difficulty', $author$project$DecodingJson$difficultyDecoder),
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'player', $author$project$DecodingJson$playerDecoder)),
	A2($elm$json$Json$Decode$field, 'time', $elm$json$Json$Decode$float),
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'level', $author$project$DecodingJson$levelDecoder)));
var $author$project$DecodingJson$Score = F3(
	function (name, difficulty, score) {
		return {difficulty: difficulty, name: name, score: score};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$DecodingJson$scoresDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$DecodingJson$Score,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'difficulty', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'score', $elm$json$Json$Decode$float));
var $author$project$DecodingJson$Settings = F2(
	function (music, movement) {
		return {movement: movement, music: music};
	});
var $author$project$Settings$Arrows = {$: 'Arrows'};
var $author$project$Settings$WASD = {$: 'WASD'};
var $author$project$DecodingJson$movementDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (string) {
		switch (string) {
			case 'wasd':
				return $elm$json$Json$Decode$succeed($author$project$Settings$WASD);
			case 'arrows':
				return $elm$json$Json$Decode$succeed($author$project$Settings$Arrows);
			default:
				return $elm$json$Json$Decode$fail('Invalid Movement');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Settings$Off = {$: 'Off'};
var $author$project$Settings$On = {$: 'On'};
var $author$project$DecodingJson$musicDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (string) {
		switch (string) {
			case 'on':
				return $elm$json$Json$Decode$succeed($author$project$Settings$On);
			case 'off':
				return $elm$json$Json$Decode$succeed($author$project$Settings$Off);
			default:
				return $elm$json$Json$Decode$fail('Invalid Music');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$DecodingJson$settingsDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$DecodingJson$Settings,
	A2($elm$json$Json$Decode$field, 'music', $author$project$DecodingJson$musicDecoder),
	A2($elm$json$Json$Decode$field, 'movement', $author$project$DecodingJson$movementDecoder));
var $author$project$DecodingJson$flagsDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$DecodingJson$Flags,
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'save1', $author$project$DecodingJson$saveDecoder)),
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'save2', $author$project$DecodingJson$saveDecoder)),
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'save3', $author$project$DecodingJson$saveDecoder)),
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'settings', $author$project$DecodingJson$settingsDecoder)),
	$elm$json$Json$Decode$maybe(
		A2(
			$elm$json$Json$Decode$field,
			'highScores',
			$elm$json$Json$Decode$list($author$project$DecodingJson$scoresDecoder))));
var $author$project$Game$First = {$: 'First'};
var $author$project$Main$GamePage = function (a) {
	return {$: 'GamePage', a: a};
};
var $author$project$Main$GamePageMsg = function (a) {
	return {$: 'GamePageMsg', a: a};
};
var $author$project$Main$HelpPage = function (a) {
	return {$: 'HelpPage', a: a};
};
var $author$project$Main$HelpPageMsg = function (a) {
	return {$: 'HelpPageMsg', a: a};
};
var $author$project$Main$HighScoresPage = function (a) {
	return {$: 'HighScoresPage', a: a};
};
var $author$project$Main$HighScoresPageMsg = function (a) {
	return {$: 'HighScoresPageMsg', a: a};
};
var $author$project$Main$HomePage = function (a) {
	return {$: 'HomePage', a: a};
};
var $author$project$Main$HomePageMsg = function (a) {
	return {$: 'HomePageMsg', a: a};
};
var $author$project$Main$LoadGamePage = function (a) {
	return {$: 'LoadGamePage', a: a};
};
var $author$project$Main$LoadGamePageMsg = function (a) {
	return {$: 'LoadGamePageMsg', a: a};
};
var $author$project$Main$NewGamePage = function (a) {
	return {$: 'NewGamePage', a: a};
};
var $author$project$Main$NewGamePageMsg = function (a) {
	return {$: 'NewGamePageMsg', a: a};
};
var $author$project$Game$Second = {$: 'Second'};
var $author$project$Main$SettingsPage = function (a) {
	return {$: 'SettingsPage', a: a};
};
var $author$project$Main$SettingsPageMsg = function (a) {
	return {$: 'SettingsPageMsg', a: a};
};
var $author$project$Game$Third = {$: 'Third'};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $author$project$Level$Easy = {$: 'Easy'};
var $author$project$Level$Hard = {$: 'Hard'};
var $author$project$Level$Medium = {$: 'Medium'};
var $author$project$Game$Resources = function (a) {
	return {$: 'Resources', a: a};
};
var $Zinggi$elm_2d_game$Game$TwoD$Camera$Area = function (a) {
	return {$: 'Area', a: a};
};
var $Zinggi$elm_2d_game$Game$TwoD$Camera$Camera = function (a) {
	return {$: 'Camera', a: a};
};
var $Zinggi$elm_2d_game$Game$TwoD$Camera$fixedArea = F2(
	function (a, pos) {
		return $Zinggi$elm_2d_game$Game$TwoD$Camera$Camera(
			{
				position: pos,
				size: $Zinggi$elm_2d_game$Game$TwoD$Camera$Area(a)
			});
	});
var $Zinggi$elm_game_resources$Game$Resources$R = function (a) {
	return {$: 'R', a: a};
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $Zinggi$elm_game_resources$Game$Resources$init = $Zinggi$elm_game_resources$Game$Resources$R($elm$core$Dict$empty);
var $author$project$Potion$healthPotion = F5(
	function (rt, dur, cdr, sec, c) {
		return {cooldown: cdr, count: c, duration: dur, ratio: rt, timeOfLastUse: sec};
	});
var $author$project$Level$level1StartCoordinates = {x: 55.5, y: 9.0};
var $author$project$Potion$speedPotion = F5(
	function (rt, dur, cdr, sec, c) {
		return {cooldown: cdr, count: c, duration: dur, ratio: rt, timeOfLastUse: sec};
	});
var $author$project$Game$initPlayer = {
	armor: $author$project$Armor$noneArmorSet,
	baseSpeed: 5.0,
	currentExp: 0,
	currentHealth: 50,
	currentSpeed: 5.0,
	dir: $author$project$Player$Idle,
	healthPotions: A5($author$project$Potion$healthPotion, 0.1, 0.0, 3.0, 0.0, 0),
	height: 2.0,
	maxDefense: 100,
	maxExp: 10,
	maxHealth: 100,
	playerLevel: 1,
	speedPotions: A5($author$project$Potion$speedPotion, 1.5, 5.0, 5.0, 0.0, 0),
	sword: $author$project$Sword$woodSword,
	vx: 0,
	vy: 0,
	width: 1.0,
	x: $author$project$Level$level1StartCoordinates.x,
	y: $author$project$Level$level1StartCoordinates.y
};
var $author$project$Level$applyDifficultyToEnemy = F2(
	function (difficulty, enemy) {
		switch (difficulty.$) {
			case 'Easy':
				return _Utils_update(
					enemy,
					{health: enemy.health * 1});
			case 'Medium':
				return _Utils_update(
					enemy,
					{health: enemy.health * 2});
			default:
				return _Utils_update(
					enemy,
					{health: enemy.health * 3});
		}
	});
var $author$project$Enemy$skeleton = F3(
	function (initX, initY, initDir) {
		return {alive: true, attack: 7, detectPlayerRadius: 3, dir: initDir, distanceLoop: 5.0, enemyType: $author$project$Enemy$Skeleton, expDrop: 5, health: 25, height: 2.0, hostile: false, initDir: initDir, initX: initX, initY: initY, speed: 2.5, vx: 0, vy: 0, width: 1.0, x: initX, y: initY};
	});
var $author$project$Level$level1Enemies = function (difficulty) {
	var enemies = _List_fromArray(
		[
			A3($author$project$Enemy$skeleton, 57, 17, $author$project$Enemy$Right)
		]);
	return A2(
		$elm$core$List$map,
		$author$project$Level$applyDifficultyToEnemy(difficulty),
		enemies);
};
var $author$project$Item$healthPotionStand = F2(
	function (x, y) {
		return {height: 2.0, itemType: $author$project$Item$HealthPotion_ItemStand, pickable: true, width: 1.0, x: x, y: y};
	});
var $author$project$Item$leatherArmorStand = F2(
	function (x, y) {
		return {height: 2.0, itemType: $author$project$Item$LeatherArmor_ItemStand, pickable: true, width: 1.0, x: x, y: y};
	});
var $author$project$Item$speedPotionStand = F2(
	function (x, y) {
		return {height: 2.0, itemType: $author$project$Item$SpeedPotion_ItemStand, pickable: true, width: 1.0, x: x, y: y};
	});
var $author$project$Item$stoneSwordStand = F2(
	function (x, y) {
		return {height: 2.0, itemType: $author$project$Item$StoneSword_ItemStand, pickable: true, width: 1.0, x: x, y: y};
	});
var $author$project$Level$level1Items = _List_fromArray(
	[
		A2($author$project$Item$healthPotionStand, 53, 9),
		A2($author$project$Item$speedPotionStand, 58, 9),
		A2($author$project$Item$healthPotionStand, 74, 12),
		A2($author$project$Item$speedPotionStand, 78, 12),
		A2($author$project$Item$healthPotionStand, 27, 37),
		A2($author$project$Item$speedPotionStand, 31, 37),
		A2($author$project$Item$healthPotionStand, 23, 53),
		A2($author$project$Item$speedPotionStand, 23, 49),
		A2($author$project$Item$healthPotionStand, 90, 53),
		A2($author$project$Item$speedPotionStand, 90, 49),
		A2($author$project$Item$healthPotionStand, 100, 44),
		A2($author$project$Item$speedPotionStand, 104, 44),
		A2($author$project$Item$stoneSwordStand, 46, 72),
		A2($author$project$Item$healthPotionStand, 44, 73),
		A2($author$project$Item$speedPotionStand, 48, 73),
		A2($author$project$Item$leatherArmorStand, 110, 17),
		A2($author$project$Item$healthPotionStand, 108, 16),
		A2($author$project$Item$speedPotionStand, 112, 16)
	]);
var $author$project$Level$level1 = function (difficulty) {
	return {
		endX: 81.0,
		endY: 79.0,
		enemies: $author$project$Level$level1Enemies(difficulty),
		items: $author$project$Level$level1Items,
		map: $author$project$Level$Lvl1,
		mapTexture: 'assets/level/level_1.png',
		startX: $author$project$Level$level1StartCoordinates.x,
		startY: $author$project$Level$level1StartCoordinates.y
	};
};
var $Zinggi$elm_game_resources$Game$Resources$LoadedTexture = F2(
	function (a, b) {
		return {$: 'LoadedTexture', a: a, b: b};
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $elm_explorations$webgl$WebGL$Texture$Resize = function (a) {
	return {$: 'Resize', a: a};
};
var $elm_explorations$webgl$WebGL$Texture$linear = $elm_explorations$webgl$WebGL$Texture$Resize(9729);
var $elm_explorations$webgl$WebGL$Texture$nearestMipmapLinear = $elm_explorations$webgl$WebGL$Texture$Resize(9986);
var $elm_explorations$webgl$WebGL$Texture$Wrap = function (a) {
	return {$: 'Wrap', a: a};
};
var $elm_explorations$webgl$WebGL$Texture$repeat = $elm_explorations$webgl$WebGL$Texture$Wrap(10497);
var $elm_explorations$webgl$WebGL$Texture$defaultOptions = {flipY: true, horizontalWrap: $elm_explorations$webgl$WebGL$Texture$repeat, magnify: $elm_explorations$webgl$WebGL$Texture$linear, minify: $elm_explorations$webgl$WebGL$Texture$nearestMipmapLinear, verticalWrap: $elm_explorations$webgl$WebGL$Texture$repeat};
var $elm_explorations$webgl$WebGL$Texture$LoadError = {$: 'LoadError'};
var $elm_explorations$webgl$WebGL$Texture$SizeError = F2(
	function (a, b) {
		return {$: 'SizeError', a: a, b: b};
	});
var $elm_explorations$webgl$WebGL$Texture$loadWith = F2(
	function (_v0, url) {
		var magnify = _v0.magnify;
		var minify = _v0.minify;
		var horizontalWrap = _v0.horizontalWrap;
		var verticalWrap = _v0.verticalWrap;
		var flipY = _v0.flipY;
		var expand = F4(
			function (_v1, _v2, _v3, _v4) {
				var mag = _v1.a;
				var min = _v2.a;
				var hor = _v3.a;
				var vert = _v4.a;
				return A6(_Texture_load, mag, min, hor, vert, flipY, url);
			});
		return A4(expand, magnify, minify, horizontalWrap, verticalWrap);
	});
var $elm_explorations$webgl$WebGL$Texture$load = $elm_explorations$webgl$WebGL$Texture$loadWith($elm_explorations$webgl$WebGL$Texture$defaultOptions);
var $Zinggi$elm_game_resources$Game$Resources$loadTextures = function (urls) {
	return $elm$core$Platform$Cmd$batch(
		A2(
			$elm$core$List$map,
			function (url) {
				return A2(
					$elm$core$Task$attempt,
					$Zinggi$elm_game_resources$Game$Resources$LoadedTexture(url),
					$elm_explorations$webgl$WebGL$Texture$load(url));
			},
			urls));
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Ports$loadedPage = _Platform_outgoingPort(
	'loadedPage',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $elm$core$Debug$log = _Debug_log;
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Enemy$textures = _List_fromArray(
	['assets/enemy/enemy_right.png', 'assets/enemy/enemy_left.png', 'assets/enemy/enemy_up.png', 'assets/enemy/enemy_down.png', 'assets/enemy/bandit_right.png', 'assets/enemy/bandit_left.png', 'assets/enemy/bandit_up.png', 'assets/enemy/bandit_down.png', 'assets/enemy/zombie_right.png', 'assets/enemy/zombie_left.png', 'assets/enemy/zombie_up.png', 'assets/enemy/zombie_down.png', 'assets/enemy/skeleton_right.png', 'assets/enemy/skeleton_left.png', 'assets/enemy/skeleton_up.png', 'assets/enemy/skeleton_down.png', 'assets/enemy/dragonKnight_right.png', 'assets/enemy/dragonKnight_left.png', 'assets/enemy/dragonKnight_up.png', 'assets/enemy/dragonKnight_down.png']);
var $author$project$Item$textures = _List_fromArray(
	['assets/item/item_stand_empty.png', 'assets/item/item_stand_health_potion_idle.png', 'assets/item/item_stand_speed_potion_idle.png', 'assets/item/item_stand_sword_wood_idle.png', 'assets/item/item_stand_sword_stone_idle.png', 'assets/item/item_stand_sword_iron_idle.png', 'assets/item/item_stand_sword_dragon_idle.png', 'assets/item/item_stand_leather_chest.png', 'assets/item/item_stand_silver_chest.png', 'assets/item/item_stand_dragon_chest.png']);
var $author$project$Level$textures = _List_fromArray(
	['assets/level/level_1.png', 'assets/level/level_2.png', 'assets/level/level_3.png']);
var $author$project$Player$textures = _List_fromArray(
	['assets/player/player_EEE_idle.png', 'assets/player/player_EEE_right.png', 'assets/player/player_EEE_left.png', 'assets/player/player_EEE_up.png', 'assets/player/player_EEE_down.png', 'assets/player/player_LLL_idle.png', 'assets/player/player_LLL_right.png', 'assets/player/player_LLL_left.png', 'assets/player/player_LLL_up.png', 'assets/player/player_LLL_down.png', 'assets/player/player_SSS_idle.png', 'assets/player/player_SSS_right.png', 'assets/player/player_SSS_left.png', 'assets/player/player_SSS_up.png', 'assets/player/player_SSS_down.png', 'assets/player/player_DDD_idle.png', 'assets/player/player_DDD_right.png', 'assets/player/player_DDD_left.png', 'assets/player/player_DDD_up.png', 'assets/player/player_DDD_down.png']);
var $author$project$Sword$textures = _List_fromArray(
	['assets/sword/sword_wood.png', 'assets/sword/sword_wood_attack_right.png', 'assets/sword/sword_wood_attack_left.png', 'assets/sword/sword_wood_attack_up.png', 'assets/sword/sword_wood_attack_down.png', 'assets/sword/sword_stone.png', 'assets/sword/sword_stone_attack_right.png', 'assets/sword/sword_stone_attack_left.png', 'assets/sword/sword_stone_attack_up.png', 'assets/sword/sword_stone_attack_down.png', 'assets/sword/sword_iron.png', 'assets/sword/sword_iron_attack_right.png', 'assets/sword/sword_iron_attack_left.png', 'assets/sword/sword_iron_attack_up.png', 'assets/sword/sword_iron_attack_down.png', 'assets/sword/sword_dragon.png', 'assets/sword/sword_dragon_attack_right.png', 'assets/sword/sword_dragon_attack_left.png', 'assets/sword/sword_dragon_attack_up.png', 'assets/sword/sword_dragon_attack_down.png']);
var $author$project$Game$texturesList = $elm$core$List$concat(
	_List_fromArray(
		[$author$project$Level$textures, $author$project$Player$textures, $author$project$Enemy$textures, $author$project$Sword$textures, $author$project$Item$textures]));
var $author$project$Game$init = F5(
	function (save, pos, settings, highScores, navKey) {
		var _v0 = A2($elm$core$Debug$log, '[Game.init] save', save);
		var _v1 = A2($elm$core$Debug$log, '[Game.init] pos', pos);
		var _v2 = A2($elm$core$Debug$log, '[Game.init] settings', settings);
		return _Utils_Tuple2(
			{
				button_DS_respawn: 'assets/button/button_DS_respawn.png',
				button_DS_return: 'assets/button/button_DS_return_MainMenu.png',
				button_PS_help: 'assets/button/button_help.png',
				button_PS_resume: 'assets/button/button_resume.png',
				button_PS_return: 'assets/button/button_return_MainMenu.png',
				button_PS_settings: 'assets/button/button_settings.png',
				camera: A2(
					$Zinggi$elm_2d_game$Game$TwoD$Camera$fixedArea,
					32 * 16,
					_Utils_Tuple2(0, 0)),
				difficulty: function () {
					if (save.$ === 'Just') {
						var s = save.a;
						return s.difficulty;
					} else {
						return $author$project$DecodingJson$Easy;
					}
				}(),
				keys: _List_Nil,
				level: function () {
					if (save.$ === 'Just') {
						var s = save.a;
						var _v5 = s.level;
						if (_v5.$ === 'Just') {
							var lvl = _v5.a;
							return lvl;
						} else {
							var _v6 = s.difficulty;
							switch (_v6.$) {
								case 'Easy':
									return $author$project$Level$level1($author$project$Level$Easy);
								case 'Medium':
									return $author$project$Level$level1($author$project$Level$Medium);
								default:
									return $author$project$Level$level1($author$project$Level$Hard);
							}
						}
					} else {
						return $author$project$Level$level1($author$project$Level$Easy);
					}
				}(),
				movement: function () {
					if (settings.$ === 'Just') {
						var s = settings.a;
						return s.movement;
					} else {
						return $author$project$Settings$WASD;
					}
				}(),
				music: function () {
					if (settings.$ === 'Just') {
						var s = settings.a;
						return s.music;
					} else {
						return $author$project$Settings$Off;
					}
				}(),
				name: function () {
					if (save.$ === 'Just') {
						var s = save.a;
						var _v10 = s.name;
						if (_v10.$ === 'Just') {
							var name = _v10.a;
							return name;
						} else {
							return 'PLAYER';
						}
					} else {
						return 'PLAYER';
					}
				}(),
				navKey: navKey,
				pauseToggle: false,
				player: function () {
					if (save.$ === 'Just') {
						var s = save.a;
						var _v12 = s.player;
						if (_v12.$ === 'Just') {
							var p = _v12.a;
							return p;
						} else {
							return $author$project$Game$initPlayer;
						}
					} else {
						return $author$project$Game$initPlayer;
					}
				}(),
				resources: $Zinggi$elm_game_resources$Game$Resources$init,
				savePosition: pos,
				scores: function () {
					if (highScores.$ === 'Just') {
						var hS = highScores.a;
						return hS;
					} else {
						return _List_Nil;
					}
				}(),
				screen: _Utils_Tuple2(1280, 720),
				time: function () {
					if (save.$ === 'Just') {
						var s = save.a;
						return s.time;
					} else {
						return 0.0;
					}
				}()
			},
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Ports$loadedPage(_Utils_Tuple0),
						A2(
						$elm$core$Platform$Cmd$map,
						$author$project$Game$Resources,
						$Zinggi$elm_game_resources$Game$Resources$loadTextures($author$project$Game$texturesList))
					])));
	});
var $author$project$Help$Controls = {$: 'Controls'};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Help$init = function (navKey) {
	return _Utils_Tuple2(
		{activeTab: $author$project$Help$Controls, buttonBack: 'assets/button/button_back.png', navKey: navKey},
		$elm$core$Platform$Cmd$none);
};
var $author$project$HighScores$init = F2(
	function (highScores, navKey) {
		return _Utils_Tuple2(
			{
				buttonBack: 'assets/button/button_back.png',
				navKey: navKey,
				scores: function () {
					if (highScores.$ === 'Just') {
						var hS = highScores.a;
						return hS;
					} else {
						return _List_Nil;
					}
				}()
			},
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Home$init = function (navKey) {
	return _Utils_Tuple2(
		{button_help: 'assets/button/button_help.png', button_highScore: 'assets/button/button_highScore.png', button_loadGame: 'assets/button/button_loadGame.png', button_newGame: 'assets/button/button_newGame.png', button_settings: 'assets/button/button_settings.png', navKey: navKey},
		$author$project$Ports$loadedPage(_Utils_Tuple0));
};
var $author$project$LoadGame$init = F2(
	function (flags, navKey) {
		return _Utils_Tuple2(
			{buttonBack: 'assets/button/button_back.png', buttonGame1: 'assets/button/button_loadGameInstance_background.png', buttonGame2: 'assets/button/button_loadGameInstance_background.png', buttonGame3: 'assets/button/button_loadGameInstance_background.png', navKey: navKey, save1: flags.save1, save2: flags.save2, save3: flags.save3},
			$elm$core$Platform$Cmd$none);
	});
var $author$project$NewGame$First = {$: 'First'};
var $author$project$NewGame$init = function (navKey) {
	return _Utils_Tuple2(
		{buttonBack: 'assets/button/button_back.png', buttonStart: 'assets/button/button_start.png', difficulty: $author$project$DecodingJson$Easy, navKey: navKey, playerName: '', savePosition: $author$project$NewGame$First},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Settings$init = function (navKey) {
	return _Utils_Tuple2(
		{buttonBack: 'assets/button/button_back.png', movement: $author$project$Settings$WASD, music: $author$project$Settings$Off, navKey: navKey},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Main$initPage = function (_v0) {
	var model = _v0.a;
	var existingCmds = _v0.b;
	var _v1 = function () {
		var _v2 = model.route;
		switch (_v2.$) {
			case 'NotFound':
				return _Utils_Tuple2($author$project$Main$NotFoundPage, $elm$core$Platform$Cmd$none);
			case 'Home':
				var _v3 = $author$project$Home$init(model.navKey);
				var pageModel = _v3.a;
				var pageCmds = _v3.b;
				return _Utils_Tuple2(
					$author$project$Main$HomePage(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$HomePageMsg, pageCmds));
			case 'NewGame':
				var _v4 = $author$project$NewGame$init(model.navKey);
				var pageModel = _v4.a;
				var pageCmds = _v4.b;
				return _Utils_Tuple2(
					$author$project$Main$NewGamePage(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$NewGamePageMsg, pageCmds));
			case 'Game1':
				var _v5 = A5($author$project$Game$init, model.flags.save1, $author$project$Game$First, model.flags.settings, model.flags.highScores, model.navKey);
				var pageModel = _v5.a;
				var pageCmds = _v5.b;
				return _Utils_Tuple2(
					$author$project$Main$GamePage(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$GamePageMsg, pageCmds));
			case 'Game2':
				var _v6 = A5($author$project$Game$init, model.flags.save2, $author$project$Game$Second, model.flags.settings, model.flags.highScores, model.navKey);
				var pageModel = _v6.a;
				var pageCmds = _v6.b;
				return _Utils_Tuple2(
					$author$project$Main$GamePage(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$GamePageMsg, pageCmds));
			case 'Game3':
				var _v7 = A5($author$project$Game$init, model.flags.save3, $author$project$Game$Third, model.flags.settings, model.flags.highScores, model.navKey);
				var pageModel = _v7.a;
				var pageCmds = _v7.b;
				return _Utils_Tuple2(
					$author$project$Main$GamePage(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$GamePageMsg, pageCmds));
			case 'LoadGame':
				var _v8 = A2($author$project$LoadGame$init, model.flags, model.navKey);
				var pageModel = _v8.a;
				var pageCmds = _v8.b;
				return _Utils_Tuple2(
					$author$project$Main$LoadGamePage(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$LoadGamePageMsg, pageCmds));
			case 'HighScores':
				var _v9 = A2($author$project$HighScores$init, model.flags.highScores, model.navKey);
				var pageModel = _v9.a;
				var pageCmds = _v9.b;
				return _Utils_Tuple2(
					$author$project$Main$HighScoresPage(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$HighScoresPageMsg, pageCmds));
			case 'Settings':
				var _v10 = $author$project$Settings$init(model.navKey);
				var pageModel = _v10.a;
				var pageCmds = _v10.b;
				return _Utils_Tuple2(
					$author$project$Main$SettingsPage(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$SettingsPageMsg, pageCmds));
			default:
				var _v11 = $author$project$Help$init(model.navKey);
				var pageModel = _v11.a;
				var pageCmds = _v11.b;
				return _Utils_Tuple2(
					$author$project$Main$HelpPage(pageModel),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$HelpPageMsg, pageCmds));
		}
	}();
	var currentPageModel = _v1.a;
	var mappedPageCmds = _v1.b;
	return _Utils_Tuple2(
		_Utils_update(
			model,
			{pageModel: currentPageModel}),
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[existingCmds, mappedPageCmds])));
};
var $author$project$Route$NotFound = {$: 'NotFound'};
var $author$project$Route$Game1 = {$: 'Game1'};
var $author$project$Route$Game2 = {$: 'Game2'};
var $author$project$Route$Game3 = {$: 'Game3'};
var $author$project$Route$Help = {$: 'Help'};
var $author$project$Route$HighScores = {$: 'HighScores'};
var $author$project$Route$Home = {$: 'Home'};
var $author$project$Route$LoadGame = {$: 'LoadGame'};
var $author$project$Route$NewGame = {$: 'NewGame'};
var $author$project$Route$Settings = {$: 'Settings'};
var $elm$url$Url$Parser$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {frag: frag, params: params, unvisited: unvisited, value: value, visited: visited};
	});
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.visited;
		var unvisited = _v0.unvisited;
		var params = _v0.params;
		var frag = _v0.frag;
		var value = _v0.value;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0.a;
		return $elm$url$Url$Parser$Parser(
			function (_v1) {
				var visited = _v1.visited;
				var unvisited = _v1.unvisited;
				var params = _v1.params;
				var frag = _v1.frag;
				var value = _v1.value;
				return A2(
					$elm$core$List$map,
					$elm$url$Url$Parser$mapState(value),
					parseArg(
						A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
			});
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return $elm$url$Url$Parser$Parser(
		function (state) {
			return A2(
				$elm$core$List$concatMap,
				function (_v0) {
					var parser = _v0.a;
					return parser(state);
				},
				parsers);
		});
};
var $elm$url$Url$Parser$s = function (str) {
	return $elm$url$Url$Parser$Parser(
		function (_v0) {
			var visited = _v0.visited;
			var unvisited = _v0.unvisited;
			var params = _v0.params;
			var frag = _v0.frag;
			var value = _v0.value;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				return _Utils_eq(next, str) ? _List_fromArray(
					[
						A5(
						$elm$url$Url$Parser$State,
						A2($elm$core$List$cons, next, visited),
						rest,
						params,
						frag,
						value)
					]) : _List_Nil;
			}
		});
};
var $elm$url$Url$Parser$top = $elm$url$Url$Parser$Parser(
	function (state) {
		return _List_fromArray(
			[state]);
	});
var $author$project$Route$matchRoute = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Home,
			$elm$url$Url$Parser$s('index.html')),
			A2($elm$url$Url$Parser$map, $author$project$Route$Home, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$NewGame,
			$elm$url$Url$Parser$s('new-game')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Game1,
			$elm$url$Url$Parser$s('game1')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Game2,
			$elm$url$Url$Parser$s('game2')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Game3,
			$elm$url$Url$Parser$s('game3')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$LoadGame,
			$elm$url$Url$Parser$s('load-game')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$HighScores,
			$elm$url$Url$Parser$s('highscores')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Settings,
			$elm$url$Url$Parser$s('settings')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Help,
			$elm$url$Url$Parser$s('help'))
		]));
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.unvisited;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.value);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.value);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 'Nothing') {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 'Nothing') {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 'Nothing') {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0.a;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.path),
					$elm$url$Url$Parser$prepareQuery(url.query),
					url.fragment,
					$elm$core$Basics$identity)));
	});
var $author$project$Route$parseUrl = function (url) {
	var _v0 = A2($elm$url$Url$Parser$parse, $author$project$Route$matchRoute, url);
	if (_v0.$ === 'Just') {
		var route = _v0.a;
		return route;
	} else {
		return $author$project$Route$NotFound;
	}
};
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 'Nothing') {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 'Nothing') {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.protocol;
		if (_v0.$ === 'Http') {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.fragment,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.query,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.port_,
					_Utils_ap(http, url.host)),
				url.path)));
};
var $author$project$Main$init = F3(
	function (flags, url, navKey) {
		var stringUrl = $elm$url$Url$toString(url);
		var replacedUrl = A2($elm$core$String$contains, '/The-Elm-Scrolls/', stringUrl) ? A3($elm$core$String$replace, '/The-Elm-Scrolls/', '/', stringUrl) : stringUrl;
		var decodedFlags = function () {
			var _v7 = A2($elm$json$Json$Decode$decodeValue, $author$project$DecodingJson$flagsDecoder, flags);
			if (_v7.$ === 'Ok') {
				var decoded = _v7.a;
				return decoded;
			} else {
				return {highScores: $elm$core$Maybe$Nothing, save1: $elm$core$Maybe$Nothing, save2: $elm$core$Maybe$Nothing, save3: $elm$core$Maybe$Nothing, settings: $elm$core$Maybe$Nothing};
			}
		}();
		var model = {
			flags: decodedFlags,
			navKey: navKey,
			pageModel: $author$project$Main$NotFoundPage,
			route: function () {
				var _v4 = $elm$url$Url$fromString(replacedUrl);
				if (_v4.$ === 'Just') {
					var u = _v4.a;
					var _v5 = A2($elm$core$Debug$log, '[Main.init] parseUrl1', u);
					return $author$project$Route$parseUrl(u);
				} else {
					var _v6 = A2($elm$core$Debug$log, '[Main.init] parseUrl2', url);
					return $author$project$Route$parseUrl(url);
				}
			}()
		};
		var _v0 = A2($elm$core$Debug$log, '[Main.init] url', url);
		var _v1 = A2($elm$core$Debug$log, '[Main.init] stringUrl', stringUrl);
		var _v2 = A2($elm$core$Debug$log, '[Main.init] replacedUrl', replacedUrl);
		var _v3 = A2($elm$core$Debug$log, '[Main.init] decodedFlags', decodedFlags);
		return $author$project$Main$initPage(
			_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
	});
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Game$Keys = function (a) {
	return {$: 'Keys', a: a};
};
var $author$project$Game$Reload = function (a) {
	return {$: 'Reload', a: a};
};
var $author$project$Game$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {oldTime: oldTime, request: request, subs: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.request;
		var oldTime = _v0.oldTime;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 'Nothing') {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.subs;
		var oldTime = _v0.oldTime;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrameDelta = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Delta(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrameDelta = $elm$browser$Browser$AnimationManager$onAnimationFrameDelta;
var $author$project$Ports$reloadPage = _Platform_incomingPort('reloadPage', $elm$json$Json$Decode$bool);
var $ohanhi$keyboard$Keyboard$Down = function (a) {
	return {$: 'Down', a: a};
};
var $ohanhi$keyboard$Keyboard$Up = function (a) {
	return {$: 'Up', a: a};
};
var $ohanhi$keyboard$Keyboard$RawKey = function (a) {
	return {$: 'RawKey', a: a};
};
var $ohanhi$keyboard$Keyboard$eventKeyDecoder = A2(
	$elm$json$Json$Decode$field,
	'key',
	A2($elm$json$Json$Decode$map, $ohanhi$keyboard$Keyboard$RawKey, $elm$json$Json$Decode$string));
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keydown');
var $ohanhi$keyboard$Keyboard$downs = function (toMsg) {
	return $elm$browser$Browser$Events$onKeyDown(
		A2($elm$json$Json$Decode$map, toMsg, $ohanhi$keyboard$Keyboard$eventKeyDecoder));
};
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keyup');
var $ohanhi$keyboard$Keyboard$ups = function (toMsg) {
	return $elm$browser$Browser$Events$onKeyUp(
		A2($elm$json$Json$Decode$map, toMsg, $ohanhi$keyboard$Keyboard$eventKeyDecoder));
};
var $ohanhi$keyboard$Keyboard$subscriptions = $elm$core$Platform$Sub$batch(
	_List_fromArray(
		[
			$ohanhi$keyboard$Keyboard$downs($ohanhi$keyboard$Keyboard$Down),
			$ohanhi$keyboard$Keyboard$ups($ohanhi$keyboard$Keyboard$Up)
		]));
var $author$project$Game$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2($elm$core$Platform$Sub$map, $author$project$Game$Keys, $ohanhi$keyboard$Keyboard$subscriptions),
				$elm$browser$Browser$Events$onAnimationFrameDelta(
				A2(
					$elm$core$Basics$composeR,
					function (dt) {
						return dt / 1000;
					},
					$author$project$Game$Tick)),
				$author$project$Ports$reloadPage($author$project$Game$Reload)
			]));
};
var $author$project$Home$Reload = function (a) {
	return {$: 'Reload', a: a};
};
var $author$project$Home$subscriptions = function (_v0) {
	return $author$project$Ports$reloadPage($author$project$Home$Reload);
};
var $author$project$LoadGame$Reload = function (a) {
	return {$: 'Reload', a: a};
};
var $author$project$LoadGame$subscriptions = function (_v0) {
	return $author$project$Ports$reloadPage($author$project$LoadGame$Reload);
};
var $author$project$Main$subscriptions = function (model) {
	var _v0 = model.pageModel;
	switch (_v0.$) {
		case 'NotFoundPage':
			return $elm$core$Platform$Sub$none;
		case 'HomePage':
			var modelHome = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$HomePageMsg,
				$author$project$Home$subscriptions(modelHome));
		case 'NewGamePage':
			var modelNewGame = _v0.a;
			return $elm$core$Platform$Sub$none;
		case 'GamePage':
			var modelGame = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$GamePageMsg,
				$author$project$Game$subscriptions(modelGame));
		case 'LoadGamePage':
			var modelLoadGame = _v0.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$LoadGamePageMsg,
				$author$project$LoadGame$subscriptions(modelLoadGame));
		case 'HighScoresPage':
			var modelHighScores = _v0.a;
			return $elm$core$Platform$Sub$none;
		case 'SettingsPage':
			var modelSettings = _v0.a;
			return $elm$core$Platform$Sub$none;
		default:
			var modelHelp = _v0.a;
			return $elm$core$Platform$Sub$none;
	}
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $ohanhi$keyboard$Keyboard$Escape = {$: 'Escape'};
var $author$project$DecodingJson$difficultyToString = function (difficulty) {
	switch (difficulty.$) {
		case 'Easy':
			return 'easy';
		case 'Medium':
			return 'medium';
		default:
			return 'hard';
	}
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Level$mapToString = function (level) {
	var _v0 = level.map;
	switch (_v0.$) {
		case 'Lvl1':
			return 'LvL1';
		case 'Lvl2':
			return 'LvL2';
		default:
			return 'LvL3';
	}
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$Enemy$enemyDirToString = function (dir) {
	switch (dir.$) {
		case 'Left':
			return 'left';
		case 'Right':
			return 'right';
		case 'Up':
			return 'up';
		default:
			return 'down';
	}
};
var $author$project$Enemy$enemyTypeToString = function (enemy) {
	var _v0 = enemy.enemyType;
	switch (_v0.$) {
		case 'Bandit':
			return 'bandit';
		case 'Zombie':
			return 'zombie';
		case 'Skeleton':
			return 'skeleton';
		case 'DragonKnight':
			return 'dragonKnight';
		default:
			return 'enemy';
	}
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Game$saveEnemy = function (enemy) {
	return _List_fromArray(
		[
			_Utils_Tuple2(
			'initX',
			$elm$json$Json$Encode$float(enemy.initX)),
			_Utils_Tuple2(
			'initY',
			$elm$json$Json$Encode$float(enemy.initY)),
			_Utils_Tuple2(
			'initDir',
			$elm$json$Json$Encode$string(
				$author$project$Enemy$enemyDirToString(enemy.initDir))),
			_Utils_Tuple2(
			'x',
			$elm$json$Json$Encode$float(enemy.x)),
			_Utils_Tuple2(
			'y',
			$elm$json$Json$Encode$float(enemy.y)),
			_Utils_Tuple2(
			'vx',
			$elm$json$Json$Encode$float(enemy.vx)),
			_Utils_Tuple2(
			'vy',
			$elm$json$Json$Encode$float(enemy.vy)),
			_Utils_Tuple2(
			'dir',
			$elm$json$Json$Encode$string(
				$author$project$Enemy$enemyDirToString(enemy.dir))),
			_Utils_Tuple2(
			'width',
			$elm$json$Json$Encode$float(enemy.width)),
			_Utils_Tuple2(
			'height',
			$elm$json$Json$Encode$float(enemy.height)),
			_Utils_Tuple2(
			'enemyType',
			$elm$json$Json$Encode$string(
				$author$project$Enemy$enemyTypeToString(enemy))),
			_Utils_Tuple2(
			'distanceLoop',
			$elm$json$Json$Encode$float(enemy.distanceLoop)),
			_Utils_Tuple2(
			'speed',
			$elm$json$Json$Encode$float(enemy.speed)),
			_Utils_Tuple2(
			'attack',
			$elm$json$Json$Encode$int(enemy.attack)),
			_Utils_Tuple2(
			'health',
			$elm$json$Json$Encode$int(enemy.health)),
			_Utils_Tuple2(
			'expDrop',
			$elm$json$Json$Encode$int(enemy.expDrop)),
			_Utils_Tuple2(
			'detectPlayerRadius',
			$elm$json$Json$Encode$float(enemy.detectPlayerRadius)),
			_Utils_Tuple2(
			'hostile',
			$elm$json$Json$Encode$bool(enemy.hostile)),
			_Utils_Tuple2(
			'alive',
			$elm$json$Json$Encode$bool(enemy.alive))
		]);
};
var $author$project$Item$itemTypeToString = function (item) {
	var _v0 = item.itemType;
	switch (_v0.$) {
		case 'ItemStand':
			return 'empty';
		case 'HealthPotion_ItemStand':
			return 'health_potion_idle';
		case 'SpeedPotion_ItemStand':
			return 'speed_potion_idle';
		case 'WoodSword_ItemStand':
			return 'sword_wood_idle';
		case 'StoneSword_ItemStand':
			return 'sword_stone_idle';
		case 'IronSword_ItemStand':
			return 'sword_iron_idle';
		case 'DragonSword_ItemStand':
			return 'sword_dragon_idle';
		case 'LeatherArmor_ItemStand':
			return 'leather_chest';
		case 'SilverArmor_ItemStand':
			return 'silver_chest';
		default:
			return 'dragon_chest';
	}
};
var $author$project$Game$saveItem = function (item) {
	return _List_fromArray(
		[
			_Utils_Tuple2(
			'x',
			$elm$json$Json$Encode$float(item.x)),
			_Utils_Tuple2(
			'y',
			$elm$json$Json$Encode$float(item.y)),
			_Utils_Tuple2(
			'width',
			$elm$json$Json$Encode$float(item.width)),
			_Utils_Tuple2(
			'height',
			$elm$json$Json$Encode$float(item.height)),
			_Utils_Tuple2(
			'itemType',
			$elm$json$Json$Encode$string(
				$author$project$Item$itemTypeToString(item))),
			_Utils_Tuple2(
			'pickable',
			$elm$json$Json$Encode$bool(item.pickable))
		]);
};
var $author$project$Game$saveLevel = function (level) {
	var encodeItems = A2($elm$core$List$map, $author$project$Game$saveItem, level.items);
	var encodeEnemies = A2($elm$core$List$map, $author$project$Game$saveEnemy, level.enemies);
	var encodeLevel = _List_fromArray(
		[
			_Utils_Tuple2(
			'map',
			$elm$json$Json$Encode$string(
				$author$project$Level$mapToString(level))),
			_Utils_Tuple2(
			'mapTexture',
			$elm$json$Json$Encode$string(level.mapTexture)),
			_Utils_Tuple2(
			'enemies',
			A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$object, encodeEnemies)),
			_Utils_Tuple2(
			'items',
			A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$object, encodeItems)),
			_Utils_Tuple2(
			'startX',
			$elm$json$Json$Encode$float(level.startX)),
			_Utils_Tuple2(
			'startY',
			$elm$json$Json$Encode$float(level.startY)),
			_Utils_Tuple2(
			'endX',
			$elm$json$Json$Encode$float(level.endX)),
			_Utils_Tuple2(
			'endY',
			$elm$json$Json$Encode$float(level.endY))
		]);
	return encodeLevel;
};
var $author$project$Armor$armorTypeToString = function (armor) {
	var _v0 = armor.armorType;
	switch (_v0.$) {
		case 'None':
			return 'none';
		case 'Leather':
			return 'leather';
		case 'Silver':
			return 'silver';
		default:
			return 'dragon';
	}
};
var $author$project$Game$savePotion = function (potion) {
	return _List_fromArray(
		[
			_Utils_Tuple2(
			'ratio',
			$elm$json$Json$Encode$float(potion.ratio)),
			_Utils_Tuple2(
			'duration',
			$elm$json$Json$Encode$float(potion.duration)),
			_Utils_Tuple2(
			'cooldown',
			$elm$json$Json$Encode$float(potion.cooldown)),
			_Utils_Tuple2(
			'timeOfLastUse',
			$elm$json$Json$Encode$float(potion.timeOfLastUse)),
			_Utils_Tuple2(
			'count',
			$elm$json$Json$Encode$int(potion.count))
		]);
};
var $author$project$Sword$swordTypeToString = function (sword) {
	var _v0 = sword.swordType;
	switch (_v0.$) {
		case 'Wood':
			return 'wood';
		case 'Stone':
			return 'stone';
		case 'Iron':
			return 'iron';
		default:
			return 'dragon';
	}
};
var $author$project$Game$savePlayer = function (player) {
	var encodePlayer = _List_fromArray(
		[
			_Utils_Tuple2(
			'x',
			$elm$json$Json$Encode$float(player.x)),
			_Utils_Tuple2(
			'y',
			$elm$json$Json$Encode$float(player.y)),
			_Utils_Tuple2(
			'baseSpeed',
			$elm$json$Json$Encode$float(player.baseSpeed)),
			_Utils_Tuple2(
			'currentSpeed',
			$elm$json$Json$Encode$float(player.currentSpeed)),
			_Utils_Tuple2(
			'sword',
			$elm$json$Json$Encode$string(
				$author$project$Sword$swordTypeToString(player.sword))),
			_Utils_Tuple2(
			'armor',
			$elm$json$Json$Encode$string(
				$author$project$Armor$armorTypeToString(player.armor))),
			_Utils_Tuple2(
			'maxDefense',
			$elm$json$Json$Encode$int(player.maxDefense)),
			_Utils_Tuple2(
			'maxHealth',
			$elm$json$Json$Encode$int(player.maxHealth)),
			_Utils_Tuple2(
			'currentHealth',
			$elm$json$Json$Encode$int(player.currentHealth)),
			_Utils_Tuple2(
			'playerLevel',
			$elm$json$Json$Encode$int(player.playerLevel)),
			_Utils_Tuple2(
			'maxExp',
			$elm$json$Json$Encode$int(player.maxExp)),
			_Utils_Tuple2(
			'currentExp',
			$elm$json$Json$Encode$int(player.currentExp)),
			_Utils_Tuple2(
			'healthPotions',
			$elm$json$Json$Encode$object(
				$author$project$Game$savePotion(player.healthPotions))),
			_Utils_Tuple2(
			'speedPotions',
			$elm$json$Json$Encode$object(
				$author$project$Game$savePotion(player.speedPotions)))
		]);
	return encodePlayer;
};
var $author$project$Ports$storeSave1 = _Platform_outgoingPort('storeSave1', $elm$core$Basics$identity);
var $author$project$Ports$storeSave2 = _Platform_outgoingPort('storeSave2', $elm$core$Basics$identity);
var $author$project$Ports$storeSave3 = _Platform_outgoingPort('storeSave3', $elm$core$Basics$identity);
var $author$project$Game$encodeSave = function (model) {
	var encodedSave = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(model.name)),
				_Utils_Tuple2(
				'difficulty',
				$elm$json$Json$Encode$string(
					$author$project$DecodingJson$difficultyToString(model.difficulty))),
				_Utils_Tuple2(
				'player',
				$elm$json$Json$Encode$object(
					$author$project$Game$savePlayer(model.player))),
				_Utils_Tuple2(
				'level',
				$elm$json$Json$Encode$object(
					$author$project$Game$saveLevel(model.level))),
				_Utils_Tuple2(
				'time',
				$elm$json$Json$Encode$float(model.time))
			]));
	var _v0 = model.savePosition;
	switch (_v0.$) {
		case 'First':
			return $author$project$Ports$storeSave1(encodedSave);
		case 'Second':
			return $author$project$Ports$storeSave2(encodedSave);
		default:
			return $author$project$Ports$storeSave3(encodedSave);
	}
};
var $author$project$Game$newScore = F3(
	function (name, difficulty, score) {
		return {
			difficulty: $author$project$DecodingJson$difficultyToString(difficulty),
			name: name,
			score: score
		};
	});
var $author$project$Game$saveScores = function (score) {
	return _List_fromArray(
		[
			_Utils_Tuple2(
			'name',
			$elm$json$Json$Encode$string(score.name)),
			_Utils_Tuple2(
			'difficulty',
			$elm$json$Json$Encode$string(score.difficulty)),
			_Utils_Tuple2(
			'score',
			$elm$json$Json$Encode$float(score.score))
		]);
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Ports$storeScores = _Platform_outgoingPort('storeScores', $elm$core$Basics$identity);
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Game$encodeScore = function (model) {
	var difficultyPenalty = function () {
		var _v0 = model.difficulty;
		switch (_v0.$) {
			case 'Easy':
				return 3.0;
			case 'Medium':
				return 2.0;
			default:
				return 1.0;
		}
	}();
	var score = ((model.player.playerLevel / model.time) / difficultyPenalty) * 1000.0;
	var myScore = $elm$core$List$singleton(
		A3($author$project$Game$newScore, model.name, model.difficulty, score));
	var sortedScores = A2(
		$elm$core$List$take,
		5,
		$elm$core$List$reverse(
			A2(
				$elm$core$List$sortBy,
				function ($) {
					return $.score;
				},
				A2($elm$core$List$append, model.scores, myScore))));
	var encodedScore = A2(
		$elm$json$Json$Encode$list,
		$elm$json$Json$Encode$object,
		A2($elm$core$List$map, $author$project$Game$saveScores, sortedScores));
	return $author$project$Ports$storeScores(encodedScore);
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Enemy$getExpDrop = function (enemy) {
	return enemy.expDrop;
};
var $author$project$Enemy$isDead = function (enemy) {
	return enemy.alive ? false : true;
};
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Game$getExp = F2(
	function (enemyList, player) {
		var expGained = $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				$author$project$Enemy$getExpDrop,
				A2($elm$core$List$filter, $author$project$Enemy$isDead, enemyList)));
		return (_Utils_cmp(player.currentExp + expGained, player.maxExp) < 1) ? _Utils_update(
			player,
			{currentExp: player.currentExp + expGained}) : _Utils_update(
			player,
			{currentExp: (player.currentExp + expGained) - player.maxExp, currentHealth: player.currentHealth + 10, maxHealth: player.maxHealth + 10, playerLevel: player.playerLevel + 1});
	});
var $author$project$Level$level2Enemies = function (difficulty) {
	return _List_Nil;
};
var $author$project$Item$ironSwordStand = F2(
	function (x, y) {
		return {height: 2.0, itemType: $author$project$Item$IronSword_ItemStand, pickable: true, width: 1.0, x: x, y: y};
	});
var $author$project$Item$silverArmorStand = F2(
	function (x, y) {
		return {height: 2.0, itemType: $author$project$Item$SilverArmor_ItemStand, pickable: true, width: 1.0, x: x, y: y};
	});
var $author$project$Level$level2Items = _List_fromArray(
	[
		A2($author$project$Item$speedPotionStand, 16, 28),
		A2($author$project$Item$healthPotionStand, 16, 9),
		A2($author$project$Item$speedPotionStand, 35, 9),
		A2($author$project$Item$healthPotionStand, 35, 28),
		A2($author$project$Item$ironSwordStand, 53, 70),
		A2($author$project$Item$healthPotionStand, 48, 76),
		A2($author$project$Item$speedPotionStand, 48, 65),
		A2($author$project$Item$speedPotionStand, 59, 76),
		A2($author$project$Item$healthPotionStand, 59, 65),
		A2($author$project$Item$silverArmorStand, 106, 78),
		A2($author$project$Item$speedPotionStand, 107, 80),
		A2($author$project$Item$healthPotionStand, 76, 13),
		A2($author$project$Item$speedPotionStand, 79, 13),
		A2($author$project$Item$healthPotionStand, 80, 57),
		A2($author$project$Item$speedPotionStand, 80, 60),
		A2($author$project$Item$healthPotionStand, 68, 97),
		A2($author$project$Item$speedPotionStand, 71, 97),
		A2($author$project$Item$healthPotionStand, 107, 116),
		A2($author$project$Item$speedPotionStand, 107, 113)
	]);
var $author$project$Level$level2StartCoordinates = {x: 47.0, y: 18.0};
var $author$project$Level$level2 = function (difficulty) {
	return {
		endX: 106.0,
		endY: 59.0,
		enemies: $author$project$Level$level2Enemies(difficulty),
		items: $author$project$Level$level2Items,
		map: $author$project$Level$Lvl2,
		mapTexture: 'assets/level/level_2.png',
		startX: $author$project$Level$level2StartCoordinates.x,
		startY: $author$project$Level$level2StartCoordinates.y
	};
};
var $author$project$Level$level3Enemies = function (difficulty) {
	return _List_Nil;
};
var $author$project$Item$dragonArmorStand = F2(
	function (x, y) {
		return {height: 2.0, itemType: $author$project$Item$DragonArmor_ItemStand, pickable: true, width: 1.0, x: x, y: y};
	});
var $author$project$Item$dragonSwordStand = F2(
	function (x, y) {
		return {height: 2.0, itemType: $author$project$Item$DragonSword_ItemStand, pickable: true, width: 1.0, x: x, y: y};
	});
var $author$project$Level$level3Items = _List_fromArray(
	[
		A2($author$project$Item$speedPotionStand, 74, 29),
		A2($author$project$Item$healthPotionStand, 77, 29),
		A2($author$project$Item$speedPotionStand, 34, 46),
		A2($author$project$Item$healthPotionStand, 37, 46),
		A2($author$project$Item$speedPotionStand, 22, 65),
		A2($author$project$Item$healthPotionStand, 22, 62),
		A2($author$project$Item$speedPotionStand, 45, 81),
		A2($author$project$Item$healthPotionStand, 45, 78),
		A2($author$project$Item$speedPotionStand, 81, 93),
		A2($author$project$Item$healthPotionStand, 81, 90),
		A2($author$project$Item$speedPotionStand, 101, 81),
		A2($author$project$Item$healthPotionStand, 101, 78),
		A2($author$project$Item$speedPotionStand, 101, 49),
		A2($author$project$Item$healthPotionStand, 101, 46),
		A2($author$project$Item$speedPotionStand, 26, 113),
		A2($author$project$Item$healthPotionStand, 26, 110),
		A2($author$project$Item$dragonArmorStand, 28, 111),
		A2($author$project$Item$speedPotionStand, 102, 98),
		A2($author$project$Item$healthPotionStand, 105, 98),
		A2($author$project$Item$dragonSwordStand, 104, 100)
	]);
var $author$project$Level$level3StartCoordinates = {x: 63.5, y: 63.5};
var $author$project$Level$level3 = function (difficulty) {
	return {
		endX: 108.0,
		endY: 31.0,
		enemies: $author$project$Level$level3Enemies(difficulty),
		items: $author$project$Level$level3Items,
		map: $author$project$Level$Lvl3,
		mapTexture: 'assets/level/level_3.png',
		startX: $author$project$Level$level3StartCoordinates.x,
		startY: $author$project$Level$level3StartCoordinates.y
	};
};
var $author$project$Game$initNextLevel = F2(
	function (difficulty, currentLevel) {
		var levelDifficulty = function () {
			switch (difficulty.$) {
				case 'Easy':
					return $author$project$Level$Easy;
				case 'Medium':
					return $author$project$Level$Medium;
				default:
					return $author$project$Level$Hard;
			}
		}();
		var _v0 = currentLevel.map;
		switch (_v0.$) {
			case 'Lvl1':
				return $author$project$Level$level2(levelDifficulty);
			case 'Lvl2':
				return $author$project$Level$level3(levelDifficulty);
			default:
				return currentLevel;
		}
	});
var $author$project$Game$initNextLevelPlayer = F2(
	function (currentLevel, player) {
		var _v0 = currentLevel.map;
		switch (_v0.$) {
			case 'Lvl1':
				return _Utils_update(
					player,
					{x: $author$project$Level$level2StartCoordinates.x, y: $author$project$Level$level2StartCoordinates.y});
			case 'Lvl2':
				return _Utils_update(
					player,
					{x: $author$project$Level$level3StartCoordinates.x, y: $author$project$Level$level3StartCoordinates.y});
			default:
				return player;
		}
	});
var $author$project$Enemy$isAlive = function (enemy) {
	return enemy.alive ? true : false;
};
var $author$project$Sword$Attack = {$: 'Attack'};
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Game$collisionSwordEnemy = F2(
	function (sword, enemy) {
		return ((_Utils_cmp(sword.x + sword.width, enemy.x) > -1) && ((_Utils_cmp(sword.x, enemy.x + enemy.width) < 1) && ((_Utils_cmp(sword.y + sword.height, enemy.y) > -1) && (_Utils_cmp(sword.y, enemy.y + enemy.height) < 1)))) ? true : false;
	});
var $author$project$Game$dmgDoneToEnemy = F2(
	function (sword, enemy) {
		return _Utils_eq(sword.action, $author$project$Sword$Attack) ? (A2($author$project$Game$collisionSwordEnemy, sword, enemy) ? sword.attack : 0) : 0;
	});
var $author$project$Game$enemyAttacked = F2(
	function (player, enemy) {
		var dmgTaken = A2($author$project$Game$dmgDoneToEnemy, player.sword, enemy);
		var newHp = enemy.health - dmgTaken;
		return (dmgTaken > 0) ? _Utils_update(
			enemy,
			{
				alive: (newHp <= 0) ? false : true,
				health: (newHp <= 0) ? 0 : newHp,
				x: _Utils_eq(enemy.dir, $author$project$Enemy$Left) ? (enemy.x + 2) : (_Utils_eq(enemy.dir, $author$project$Enemy$Right) ? (enemy.x - 2) : enemy.x),
				y: _Utils_eq(enemy.dir, $author$project$Enemy$Down) ? (enemy.y + 2) : (_Utils_eq(enemy.dir, $author$project$Enemy$Up) ? (enemy.y - 2) : enemy.y)
			}) : enemy;
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$Enemy$chasePlayer = F3(
	function (playerX, playerY, enemy) {
		var yDiff = playerY - enemy.y;
		var xDiff = playerX - enemy.x;
		var coefficientVy = yDiff / $elm$core$Basics$abs(yDiff);
		var coefficientVx = xDiff / $elm$core$Basics$abs(xDiff);
		return _Utils_update(
			enemy,
			{hostile: true, vx: enemy.speed * coefficientVx, vy: enemy.speed * coefficientVy});
	});
var $author$project$Enemy$enemyLoop = function (enemy) {
	var _v0 = enemy.initDir;
	switch (_v0.$) {
		case 'Left':
			return _Utils_eq(
				$elm$core$Basics$floor(enemy.x),
				enemy.initX - enemy.distanceLoop) ? _Utils_update(
				enemy,
				{dir: $author$project$Enemy$Right, vx: enemy.speed}) : (_Utils_eq(
				$elm$core$Basics$floor(enemy.x),
				enemy.initX) ? _Utils_update(
				enemy,
				{dir: $author$project$Enemy$Left, vx: (-1) * enemy.speed}) : enemy);
		case 'Right':
			return _Utils_eq(
				$elm$core$Basics$floor(enemy.x),
				enemy.initX + enemy.distanceLoop) ? _Utils_update(
				enemy,
				{dir: $author$project$Enemy$Left, vx: (-1) * enemy.speed}) : (_Utils_eq(
				$elm$core$Basics$floor(enemy.x),
				enemy.initX) ? _Utils_update(
				enemy,
				{dir: $author$project$Enemy$Right, vx: enemy.speed}) : enemy);
		case 'Up':
			return _Utils_eq(
				$elm$core$Basics$floor(enemy.y),
				enemy.initY + enemy.distanceLoop) ? _Utils_update(
				enemy,
				{dir: $author$project$Enemy$Down, vy: (-1) * enemy.speed}) : (_Utils_eq(
				$elm$core$Basics$floor(enemy.y),
				enemy.initY) ? _Utils_update(
				enemy,
				{dir: $author$project$Enemy$Up, vy: enemy.speed}) : enemy);
		default:
			return _Utils_eq(
				$elm$core$Basics$floor(enemy.y),
				enemy.initY - enemy.distanceLoop) ? _Utils_update(
				enemy,
				{dir: $author$project$Enemy$Up, vy: enemy.speed}) : (_Utils_eq(
				$elm$core$Basics$floor(enemy.y),
				enemy.initY) ? _Utils_update(
				enemy,
				{dir: $author$project$Enemy$Down, vy: (-1) * enemy.speed}) : enemy);
	}
};
var $elm$core$Basics$pow = _Basics_pow;
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$Enemy$euclideanDistance = F4(
	function (x1, y1, x2, y2) {
		return $elm$core$Basics$sqrt(
			A2($elm$core$Basics$pow, x2 - x1, 2) + A2($elm$core$Basics$pow, y2 - y1, 2));
	});
var $author$project$Enemy$enemyMovement = F3(
	function (playerX, playerY, enemy) {
		var playerInRange = (_Utils_cmp(
			A4($author$project$Enemy$euclideanDistance, playerX, playerY, enemy.x, enemy.y),
			enemy.detectPlayerRadius) < 1) ? true : false;
		return (playerInRange || enemy.hostile) ? A3($author$project$Enemy$chasePlayer, playerX, playerY, enemy) : $author$project$Enemy$enemyLoop(enemy);
	});
var $author$project$Game$collisionPlayerEnemy = F2(
	function (player, enemy) {
		return ((_Utils_cmp(player.x + player.width, enemy.x) > -1) && ((_Utils_cmp(player.x, enemy.x + enemy.width) < 1) && ((_Utils_cmp(player.y + player.height, enemy.y) > -1) && (_Utils_cmp(player.y, enemy.y + enemy.height) < 1)))) ? true : false;
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Tilemap$level1TileMap = $elm$core$Array$fromList(
	_List_fromArray(
		[
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTETTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFTTTTTTFXXXXXXXXXXXXXXXFFFFFFFFFFFFFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXFFFFFFFFFFFFFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFFFFFFFFFFFFFFTTTTTTFFFFFFFFFFFXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'))
		]));
var $author$project$Tilemap$level2TileMap = $elm$core$Array$fromList(
	_List_fromArray(
		[
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFFFFFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFFFFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFFFFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXFFFFFFFFFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXFFFFFFXXXXXXXXXXFTTTTFXXXXXXXXXXFFFFFFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXFTTTTFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFFFFFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFFFFFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXFFFFFFFFFFFFFFXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXFTTTTTTTTTTTTFXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFFFFFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXFTTTTTTTTTTTTFXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXFTTTTTTTTTTTTFXXFTTTTFXXXXXXXXXXXXXXFTTTTFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXFTTTTTTTTTTTTFFFFTTTTFXXXXXXXXXXXXXXFTTTTFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXFTTTTTTTTTTTTFFFFTTTTFXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXFTTTTTTTTTTTTFXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFFFFFFFFFTTTTFXXXXXXXXXXFTTTTFXXFTTTTTTTTTTTTFXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFFFFFFFFFTTTTFXXXXXXXXXXFTTTTFXXFTTTTTTTTTTTTFXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXFFFFFFFFFFFFFFXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFFFFFTTTTFXXXXXXXXXXFFFFFFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFFFFTTTTFXXXXXXXXXXFFFFFTTTTFXXXXXXXXXXFFFFFFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFFFFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXFTTTTTTETFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXFTTTTFXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXFFFFFTTTTFXXXXXXXXXXFTTTTFFFFFXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFFFFFFFFFTTTTFXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFFFFFFFFFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFFFFFFFFFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFTTTTFFFFFFFFFFFFTTTTFFFFFFFFFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFTTTTFFFFFFFFFFFFTTTTFFFFFFFFFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFFFFFFFFFTTTTFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFFFFFFFFFTTTTFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'))
		]));
var $author$project$Tilemap$level3TileMap = $elm$core$Array$fromList(
	_List_fromArray(
		[
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFTTTTFXXXXXXXXXXFTTTTFFFFFFFFTTTTFFFFFFFFFFFFTTTTFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXFFFFTTTTFXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFTTTTFFFFFXXXXXXFFFFFFFFFFFFFFFFFFFFFFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFTTTTFFFFFFFFFXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFFFFFFFFFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFFFFFFFFFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTFFFFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTFXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTFXXFTTTTFXXXXXXFTTTTFFFFFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTFXXFTTTTFXXXXXXFTTTTFFFFFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTFXXFTTTTFXXXXXXFTTTTTTTTFXXXXXXXXXXFFFFFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTFXXFTTTTFXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTFFFFTTTTFXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTFFFFTTTTFXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXFTTTTFFFFFXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXFFFFFFFFFTTTTFFFFFFFFFXXXXXXFFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXFFFFFFFFFTTTTFFFFFFFFFXXXXXXFFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXFFFFFFFFFTTTTFXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXFTTTTFFFFTTTTFFFFTTTTFXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXFTTTTFXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFFFFFTTTTFFFFFFFFTTTTFFFFXXXXXXXFTTTTFFFFTTTTFFFFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFFFFFTTTTFFFFFFFFTTTTFFFFFFFFFFFFTTTTFFFFTTTTFFFFTTTTFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFTTTTFFFFFFFFFFFFTTTTFFFFTTTTFFFFTTTTFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXFTTTTFXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFFFFTTTTFFFFTTTTFXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFFFFTTTTFFFFTTTTFXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFTTTTFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXFFFFFFFFFTTTTFFFFFFFFFXXXXXXFFFFFFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTFFFFFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFTTTTFFFFFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXFFFFFFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXFFFFFFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFFFFFFXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFXXXXXXFTTTTFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXFFFFFXXXXXXXFTTTTTTTTFFFFFXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFXXXXXXFTTTTFFFFFFFFTTTTFXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFTTTTTTTTFFFFFXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXFFFFFFXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTEFXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXFFFFFFXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFFFFFTTTTFXXXXXXFFFFFFFFFFFFFTTTTFXXXXXXFTTTTFXXXXXXFTTTTFFFFFFFFTTTTTTTTFFFFFXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFTTTTFFFFFFFFTTTTFXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFTTTTFFFFFFFFTTTTFXXXXXXFTTTTTTTTFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFFFFFFFFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFFFFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFTTTTFXXXXXXXXXXFTTTTFFFFFFFFFFFFFFFFFFFFTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXFFFFFFXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTTTTTTTTTTTTTFXXXXXXFTTTTFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFTTTTTTTTTTTTTTTTFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXFFFFFFFFFFFFFFFFFFXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')),
			$elm$core$Array$fromList(
			$elm$core$String$toList('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'))
		]));
var $author$project$Tilemap$getTileMap = function (lvl) {
	switch (lvl.$) {
		case 'Lvl1':
			return $author$project$Tilemap$level1TileMap;
		case 'Lvl2':
			return $author$project$Tilemap$level2TileMap;
		default:
			return $author$project$Tilemap$level3TileMap;
	}
};
var $author$project$Tilemap$getTileTypeFromTileMap = F3(
	function (lvl, x, y) {
		return A2(
			$elm$core$Maybe$andThen,
			$elm$core$Array$get(
				$elm$core$Basics$floor(x)),
			A2(
				$elm$core$Array$get,
				127 - $elm$core$Basics$floor(y),
				$author$project$Tilemap$getTileMap(lvl)));
	});
var $author$project$Game$enemyPhysics = F4(
	function (dt, lvl, player, enemy) {
		var newY = enemy.y + (dt * enemy.vy);
		var newX = enemy.x + (dt * enemy.vx);
		var tileType = _Utils_eq(enemy.dir, $author$project$Enemy$Left) ? A3($author$project$Tilemap$getTileTypeFromTileMap, lvl, newX - 1, newY) : (_Utils_eq(enemy.dir, $author$project$Enemy$Up) ? A3($author$project$Tilemap$getTileTypeFromTileMap, lvl, newX, newY + 1) : A3($author$project$Tilemap$getTileTypeFromTileMap, lvl, newX, newY));
		var xDiff = $elm$core$Basics$abs(player.x - newX);
		if (tileType.$ === 'Just') {
			var tile = tileType.a;
			if (_Utils_eq(
				tile,
				_Utils_chr('T'))) {
				if (A2($author$project$Game$collisionPlayerEnemy, player, enemy)) {
					var _v1 = enemy.dir;
					switch (_v1.$) {
						case 'Left':
							return _Utils_update(
								enemy,
								{x: enemy.x + 1});
						case 'Right':
							return _Utils_update(
								enemy,
								{x: enemy.x - 1});
						case 'Up':
							return _Utils_update(
								enemy,
								{y: enemy.y - 1});
						default:
							return _Utils_update(
								enemy,
								{y: enemy.y + 1});
					}
				} else {
					return _Utils_update(
						enemy,
						{
							dir: (xDiff < 0.10) ? ((_Utils_cmp(newY, enemy.y) > 0) ? $author$project$Enemy$Up : $author$project$Enemy$Down) : ((_Utils_cmp(newX, enemy.x) < 0) ? $author$project$Enemy$Left : $author$project$Enemy$Right),
							x: newX,
							y: newY
						});
				}
			} else {
				return enemy;
			}
		} else {
			return enemy;
		}
	});
var $author$project$Game$enemiesTick = F3(
	function (dt, player, level) {
		return A2(
			$elm$core$List$map,
			$author$project$Game$enemyAttacked(player),
			A2(
				$elm$core$List$map,
				A3($author$project$Game$enemyPhysics, dt, level.map, player),
				A2(
					$elm$core$List$map,
					A2($author$project$Enemy$enemyMovement, player.x, player.y),
					A2($elm$core$List$filter, $author$project$Enemy$isAlive, level.enemies))));
	});
var $elm$core$Basics$round = _Basics_round;
var $author$project$Item$checkItemStandByCoordinates = F3(
	function (x, y, item) {
		return (_Utils_eq(item.x, x) && _Utils_eq(item.y, y)) ? true : false;
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Item$itemPickedUp = function (item) {
	return (!_Utils_eq(item.itemType, $author$project$Item$ItemStand)) ? _Utils_update(
		item,
		{itemType: $author$project$Item$ItemStand, pickable: false}) : item;
};
var $author$project$Item$updateItemStand = F3(
	function (x, y, item) {
		return (A3($author$project$Item$checkItemStandByCoordinates, x, y, item) && item.pickable) ? $author$project$Item$itemPickedUp(item) : item;
	});
var $author$project$Game$itemsTick = F3(
	function (dt, player, level) {
		var newY = player.y + (dt * player.vy);
		var newX = player.x + (dt * player.vx);
		return A2(
			$elm$core$List$map,
			A2(
				$author$project$Item$updateItemStand,
				$elm$core$Basics$round(newX),
				$elm$core$Basics$round(newY)),
			level.items);
	});
var $author$project$Game$levelTick = F4(
	function (dt, pauseToggle, player, level) {
		return pauseToggle ? level : _Utils_update(
			level,
			{
				enemies: A3($author$project$Game$enemiesTick, dt, player, level),
				items: A3($author$project$Game$itemsTick, dt, player, level)
			});
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $Zinggi$elm_2d_game$Game$TwoD$Camera$moveTo = F2(
	function (pos, _v0) {
		var camera = _v0.a;
		return $Zinggi$elm_2d_game$Game$TwoD$Camera$Camera(
			_Utils_update(
				camera,
				{position: pos}));
	});
var $elm$core$Basics$not = _Basics_not;
var $ohanhi$keyboard$Keyboard$Character = function (a) {
	return {$: 'Character', a: a};
};
var $author$project$Potion$canUsePotion = F2(
	function (time, potion) {
		var secondsSinceLastUse = time - potion.timeOfLastUse;
		return ((_Utils_cmp(secondsSinceLastUse, potion.cooldown) > -1) || (potion.timeOfLastUse === 0.0)) ? true : false;
	});
var $author$project$Potion$decrementPotionsCount = function (potion) {
	return _Utils_update(
		potion,
		{count: potion.count - 1});
};
var $author$project$Potion$updateTimeOfLastUse = F2(
	function (time, potion) {
		return _Utils_update(
			potion,
			{timeOfLastUse: time});
	});
var $author$project$Player$applyHealthPotion = F3(
	function (keys, time, player) {
		var healAmount = player.maxHealth * player.healthPotions.ratio;
		var newCurrHealth = (_Utils_cmp(
			player.currentHealth + $elm$core$Basics$round(healAmount),
			player.maxHealth) < 0) ? (player.currentHealth + $elm$core$Basics$round(healAmount)) : player.maxHealth;
		return (player.healthPotions.count > 0) ? ((_Utils_cmp(player.currentHealth, player.maxHealth) < 0) ? (A2($author$project$Potion$canUsePotion, time, player.healthPotions) ? (A2(
			$elm$core$List$member,
			$ohanhi$keyboard$Keyboard$Character('Q'),
			keys) ? _Utils_update(
			player,
			{
				currentHealth: newCurrHealth,
				healthPotions: A2(
					$author$project$Potion$updateTimeOfLastUse,
					time,
					$author$project$Potion$decrementPotionsCount(player.healthPotions))
			}) : player) : player) : player) : player;
	});
var $author$project$Player$applySpeedPotion = F3(
	function (keys, time, player) {
		return A2($author$project$Potion$canUsePotion, time, player.speedPotions) ? ((player.speedPotions.count > 0) ? (A2(
			$elm$core$List$member,
			$ohanhi$keyboard$Keyboard$Character('E'),
			keys) ? _Utils_update(
			player,
			{
				currentSpeed: player.baseSpeed * player.speedPotions.ratio,
				speedPotions: A2(
					$author$project$Potion$updateTimeOfLastUse,
					time,
					$author$project$Potion$decrementPotionsCount(player.speedPotions))
			}) : _Utils_update(
			player,
			{currentSpeed: player.baseSpeed})) : _Utils_update(
			player,
			{currentSpeed: player.baseSpeed})) : player;
	});
var $ohanhi$keyboard$Keyboard$ArrowDown = {$: 'ArrowDown'};
var $ohanhi$keyboard$Keyboard$ArrowLeft = {$: 'ArrowLeft'};
var $ohanhi$keyboard$Keyboard$ArrowRight = {$: 'ArrowRight'};
var $ohanhi$keyboard$Keyboard$ArrowUp = {$: 'ArrowUp'};
var $ohanhi$keyboard$Keyboard$Arrows$boolToInt = function (bool) {
	return bool ? 1 : 0;
};
var $ohanhi$keyboard$Keyboard$Arrows$arrows = function (keys) {
	var toInt = function (key) {
		return $ohanhi$keyboard$Keyboard$Arrows$boolToInt(
			A2($elm$core$List$member, key, keys));
	};
	var x = toInt($ohanhi$keyboard$Keyboard$ArrowRight) - toInt($ohanhi$keyboard$Keyboard$ArrowLeft);
	var y = toInt($ohanhi$keyboard$Keyboard$ArrowUp) - toInt($ohanhi$keyboard$Keyboard$ArrowDown);
	return {x: x, y: y};
};
var $author$project$Enemy$getAttack = function (enemy) {
	return enemy.attack;
};
var $author$project$Game$playerAttacked = F2(
	function (enemyList, player) {
		var dmgTaken = $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				$author$project$Enemy$getAttack,
				A2(
					$elm$core$List$filter,
					$author$project$Game$collisionPlayerEnemy(player),
					enemyList)));
		var dmgAfterMitigation = dmgTaken - ((player.armor.totalDef / 10) | 0);
		var newHp = (dmgAfterMitigation > 0) ? (player.currentHealth - dmgAfterMitigation) : player.currentHealth;
		return _Utils_update(
			player,
			{
				currentHealth: (newHp <= 0) ? 0 : newHp
			});
	});
var $author$project$Player$Left = {$: 'Left'};
var $author$project$Player$Up = {$: 'Up'};
var $author$project$Item$getItemType = function (item) {
	return item.itemType;
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Potion$incrementPotionsCount = function (potion) {
	return _Utils_update(
		potion,
		{count: potion.count + 1});
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Game$playerPhysics = F3(
	function (dt, lvl, player) {
		var newY = player.y + (dt * player.vy);
		var newX = player.x + (dt * player.vx);
		var tileType = _Utils_eq(player.dir, $author$project$Player$Left) ? A3($author$project$Tilemap$getTileTypeFromTileMap, lvl.map, newX - 1, newY) : (_Utils_eq(player.dir, $author$project$Player$Up) ? A3($author$project$Tilemap$getTileTypeFromTileMap, lvl.map, newX, newY + 1) : A3($author$project$Tilemap$getTileTypeFromTileMap, lvl.map, newX, newY));
		var newTileItemStand = A2(
			$elm$core$List$filter,
			A2(
				$author$project$Item$checkItemStandByCoordinates,
				$elm$core$Basics$round(newX),
				$elm$core$Basics$round(newY)),
			lvl.items);
		return _Utils_update(
			player,
			{
				armor: function () {
					var _v0 = $elm$core$List$head(newTileItemStand);
					if (_v0.$ === 'Just') {
						var itemStand = _v0.a;
						return _Utils_eq(
							$author$project$Item$getItemType(itemStand),
							$author$project$Item$LeatherArmor_ItemStand) ? $author$project$Armor$leatherArmorSet : (_Utils_eq(
							$author$project$Item$getItemType(itemStand),
							$author$project$Item$SilverArmor_ItemStand) ? $author$project$Armor$silverArmorSet : (_Utils_eq(
							$author$project$Item$getItemType(itemStand),
							$author$project$Item$DragonArmor_ItemStand) ? $author$project$Armor$dragonArmorSet : player.armor));
					} else {
						return player.armor;
					}
				}(),
				healthPotions: function () {
					var _v1 = $elm$core$List$head(newTileItemStand);
					if (_v1.$ === 'Just') {
						var itemStand = _v1.a;
						return _Utils_eq(
							$author$project$Item$getItemType(itemStand),
							$author$project$Item$HealthPotion_ItemStand) ? $author$project$Potion$incrementPotionsCount(player.healthPotions) : player.healthPotions;
					} else {
						return player.healthPotions;
					}
				}(),
				speedPotions: function () {
					var _v2 = $elm$core$List$head(newTileItemStand);
					if (_v2.$ === 'Just') {
						var itemStand = _v2.a;
						return _Utils_eq(
							$author$project$Item$getItemType(itemStand),
							$author$project$Item$SpeedPotion_ItemStand) ? $author$project$Potion$incrementPotionsCount(player.speedPotions) : player.speedPotions;
					} else {
						return player.speedPotions;
					}
				}(),
				sword: function () {
					var _v3 = $elm$core$List$head(newTileItemStand);
					if (_v3.$ === 'Just') {
						var itemStand = _v3.a;
						return _Utils_eq(
							$author$project$Item$getItemType(itemStand),
							$author$project$Item$WoodSword_ItemStand) ? $author$project$Sword$woodSword : (_Utils_eq(
							$author$project$Item$getItemType(itemStand),
							$author$project$Item$StoneSword_ItemStand) ? $author$project$Sword$stoneSword : (_Utils_eq(
							$author$project$Item$getItemType(itemStand),
							$author$project$Item$IronSword_ItemStand) ? $author$project$Sword$ironSword : (_Utils_eq(
							$author$project$Item$getItemType(itemStand),
							$author$project$Item$DragonSword_ItemStand) ? $author$project$Sword$dragonSword : player.sword)));
					} else {
						return player.sword;
					}
				}(),
				x: function () {
					if (tileType.$ === 'Just') {
						var tile = tileType.a;
						return (_Utils_eq(
							tile,
							_Utils_chr('T')) || _Utils_eq(
							tile,
							_Utils_chr('E'))) ? ($elm$core$List$isEmpty(newTileItemStand) ? newX : player.x) : player.x;
					} else {
						return player.x;
					}
				}(),
				y: function () {
					if (tileType.$ === 'Just') {
						var tile = tileType.a;
						return (_Utils_eq(
							tile,
							_Utils_chr('T')) || _Utils_eq(
							tile,
							_Utils_chr('E'))) ? ($elm$core$List$isEmpty(newTileItemStand) ? newY : player.y) : player.y;
					} else {
						return player.y;
					}
				}()
			});
	});
var $author$project$Sword$Down = {$: 'Down'};
var $author$project$Sword$Left = {$: 'Left'};
var $author$project$Sword$Right = {$: 'Right'};
var $author$project$Sword$Up = {$: 'Up'};
var $ohanhi$keyboard$Keyboard$Spacebar = {$: 'Spacebar'};
var $author$project$Sword$swordAttack = F2(
	function (sword, keys) {
		return A2($elm$core$List$member, $ohanhi$keyboard$Keyboard$Spacebar, keys) ? _Utils_update(
			sword,
			{
				action: $author$project$Sword$Attack,
				height: (_Utils_eq(sword.dir, $author$project$Sword$Up) || _Utils_eq(sword.dir, $author$project$Sword$Down)) ? 1.0 : 0.5,
				width: (_Utils_eq(sword.dir, $author$project$Sword$Up) || _Utils_eq(sword.dir, $author$project$Sword$Down)) ? 0.5 : 1.0
			}) : _Utils_update(
			sword,
			{action: $author$project$Sword$NotAttack, height: 1.0, width: 0.5});
	});
var $author$project$Sword$updateSwordCoordinates = F4(
	function (playerDir, playerX, playerY, sword) {
		switch (playerDir.$) {
			case 'Left':
				return _Utils_update(
					sword,
					{
						dir: playerDir,
						x: function () {
							var _v1 = sword.action;
							if (_v1.$ === 'NotAttack') {
								return playerX + 0.15;
							} else {
								return playerX - 0.7;
							}
						}(),
						y: function () {
							var _v2 = sword.action;
							if (_v2.$ === 'NotAttack') {
								return playerY + 0.7;
							} else {
								return playerY + 0.6;
							}
						}()
					});
			case 'Right':
				return _Utils_update(
					sword,
					{
						dir: playerDir,
						x: function () {
							var _v3 = sword.action;
							if (_v3.$ === 'NotAttack') {
								return playerX + 0.4;
							} else {
								return playerX + 0.3;
							}
						}(),
						y: function () {
							var _v4 = sword.action;
							if (_v4.$ === 'NotAttack') {
								return playerY + 0.5;
							} else {
								return playerY + 0.4;
							}
						}()
					});
			case 'Up':
				return _Utils_update(
					sword,
					{
						dir: playerDir,
						x: function () {
							var _v5 = sword.action;
							if (_v5.$ === 'NotAttack') {
								return playerX + 0.75;
							} else {
								return playerX + 0.65;
							}
						}(),
						y: function () {
							var _v6 = sword.action;
							if (_v6.$ === 'NotAttack') {
								return playerY + 0.6;
							} else {
								return playerY + 1.2;
							}
						}()
					});
			case 'Down':
				return _Utils_update(
					sword,
					{
						dir: playerDir,
						x: function () {
							var _v7 = sword.action;
							if (_v7.$ === 'NotAttack') {
								return playerX + 0.2;
							} else {
								return playerX;
							}
						}(),
						y: function () {
							var _v8 = sword.action;
							if (_v8.$ === 'NotAttack') {
								return playerY + 0.5;
							} else {
								return playerY - 0.2;
							}
						}()
					});
			default:
				return _Utils_update(
					sword,
					{
						dir: playerDir,
						x: function () {
							var _v9 = sword.action;
							if (_v9.$ === 'NotAttack') {
								return playerX + 0.1;
							} else {
								return playerX - 0.7;
							}
						}(),
						y: function () {
							var _v10 = sword.action;
							if (_v10.$ === 'NotAttack') {
								return playerY + 0.5;
							} else {
								return playerY + 0.5;
							}
						}()
					});
		}
	});
var $author$project$Player$swordPhysics = F2(
	function (keys, player) {
		var swordDir = function () {
			var _v0 = player.dir;
			switch (_v0.$) {
				case 'Left':
					return $author$project$Sword$Left;
				case 'Right':
					return $author$project$Sword$Right;
				case 'Up':
					return $author$project$Sword$Up;
				case 'Down':
					return $author$project$Sword$Down;
				default:
					return $author$project$Sword$Idle;
			}
		}();
		return _Utils_update(
			player,
			{
				sword: A4(
					$author$project$Sword$updateSwordCoordinates,
					swordDir,
					player.x,
					player.y,
					A2($author$project$Sword$swordAttack, player.sword, keys))
			});
	});
var $author$project$Player$Down = {$: 'Down'};
var $author$project$Player$Right = {$: 'Right'};
var $author$project$Player$walk = F2(
	function (_v0, player) {
		var x = _v0.x;
		var y = _v0.y;
		return _Utils_update(
			player,
			{
				dir: (x < 0) ? $author$project$Player$Left : ((x > 0) ? $author$project$Player$Right : ((y < 0) ? $author$project$Player$Down : ((y > 0) ? $author$project$Player$Up : $author$project$Player$Idle))),
				vx: player.currentSpeed * x,
				vy: player.currentSpeed * y
			});
	});
var $ohanhi$keyboard$Keyboard$Arrows$wasd = function (keys) {
	var toInt = function (_char) {
		return $ohanhi$keyboard$Keyboard$Arrows$boolToInt(
			A2(
				$elm$core$List$member,
				$ohanhi$keyboard$Keyboard$Character(_char),
				keys));
	};
	var x = toInt('D') - toInt('A');
	var y = toInt('W') - toInt('S');
	return {x: x, y: y};
};
var $author$project$Game$playerTick = F7(
	function (dt, time, lvl, keys, movement, enemyList, player) {
		var moveInput = function () {
			if (movement.$ === 'WASD') {
				return $ohanhi$keyboard$Keyboard$Arrows$wasd(keys);
			} else {
				return $ohanhi$keyboard$Keyboard$Arrows$arrows(keys);
			}
		}();
		return A2(
			$author$project$Game$playerAttacked,
			enemyList,
			A2(
				$author$project$Player$swordPhysics,
				keys,
				A3(
					$author$project$Game$playerPhysics,
					dt,
					lvl,
					A2(
						$author$project$Player$walk,
						moveInput,
						A3(
							$author$project$Player$applySpeedPotion,
							keys,
							time,
							A3($author$project$Player$applyHealthPotion, keys, time, player))))));
	});
var $elm$browser$Browser$Navigation$reload = _Browser_reload(false);
var $Zinggi$elm_game_resources$Game$Resources$update = F2(
	function (_v0, _v1) {
		var url = _v0.a;
		var result = _v0.b;
		var res = _v1.a;
		if (result.$ === 'Ok') {
			var tex = result.a;
			return $Zinggi$elm_game_resources$Game$Resources$R(
				A3($elm$core$Dict$insert, url, tex, res));
		} else {
			var err = result.a;
			return $Zinggi$elm_game_resources$Game$Resources$R(res);
		}
	});
var $ohanhi$keyboard$Keyboard$Backspace = {$: 'Backspace'};
var $ohanhi$keyboard$Keyboard$Clear = {$: 'Clear'};
var $ohanhi$keyboard$Keyboard$Copy = {$: 'Copy'};
var $ohanhi$keyboard$Keyboard$CrSel = {$: 'CrSel'};
var $ohanhi$keyboard$Keyboard$Cut = {$: 'Cut'};
var $ohanhi$keyboard$Keyboard$Delete = {$: 'Delete'};
var $ohanhi$keyboard$Keyboard$EraseEof = {$: 'EraseEof'};
var $ohanhi$keyboard$Keyboard$ExSel = {$: 'ExSel'};
var $ohanhi$keyboard$Keyboard$Insert = {$: 'Insert'};
var $ohanhi$keyboard$Keyboard$Paste = {$: 'Paste'};
var $ohanhi$keyboard$Keyboard$Redo = {$: 'Redo'};
var $ohanhi$keyboard$Keyboard$Undo = {$: 'Undo'};
var $ohanhi$keyboard$Keyboard$editingKey = function (_v0) {
	var value = _v0.a;
	switch (value) {
		case 'Backspace':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Backspace);
		case 'Clear':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Clear);
		case 'Copy':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Copy);
		case 'CrSel':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$CrSel);
		case 'Cut':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Cut);
		case 'Delete':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Delete);
		case 'EraseEof':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$EraseEof);
		case 'ExSel':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ExSel);
		case 'Insert':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Insert);
		case 'Paste':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Paste);
		case 'Redo':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Redo);
		case 'Undo':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Undo);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $ohanhi$keyboard$Keyboard$F1 = {$: 'F1'};
var $ohanhi$keyboard$Keyboard$F10 = {$: 'F10'};
var $ohanhi$keyboard$Keyboard$F11 = {$: 'F11'};
var $ohanhi$keyboard$Keyboard$F12 = {$: 'F12'};
var $ohanhi$keyboard$Keyboard$F13 = {$: 'F13'};
var $ohanhi$keyboard$Keyboard$F14 = {$: 'F14'};
var $ohanhi$keyboard$Keyboard$F15 = {$: 'F15'};
var $ohanhi$keyboard$Keyboard$F16 = {$: 'F16'};
var $ohanhi$keyboard$Keyboard$F17 = {$: 'F17'};
var $ohanhi$keyboard$Keyboard$F18 = {$: 'F18'};
var $ohanhi$keyboard$Keyboard$F19 = {$: 'F19'};
var $ohanhi$keyboard$Keyboard$F2 = {$: 'F2'};
var $ohanhi$keyboard$Keyboard$F20 = {$: 'F20'};
var $ohanhi$keyboard$Keyboard$F3 = {$: 'F3'};
var $ohanhi$keyboard$Keyboard$F4 = {$: 'F4'};
var $ohanhi$keyboard$Keyboard$F5 = {$: 'F5'};
var $ohanhi$keyboard$Keyboard$F6 = {$: 'F6'};
var $ohanhi$keyboard$Keyboard$F7 = {$: 'F7'};
var $ohanhi$keyboard$Keyboard$F8 = {$: 'F8'};
var $ohanhi$keyboard$Keyboard$F9 = {$: 'F9'};
var $ohanhi$keyboard$Keyboard$functionKey = function (_v0) {
	var value = _v0.a;
	switch (value) {
		case 'F1':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F1);
		case 'F2':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F2);
		case 'F3':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F3);
		case 'F4':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F4);
		case 'F5':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F5);
		case 'F6':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F6);
		case 'F7':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F7);
		case 'F8':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F8);
		case 'F9':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F9);
		case 'F10':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F10);
		case 'F11':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F11);
		case 'F12':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F12);
		case 'F13':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F13);
		case 'F14':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F14);
		case 'F15':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F15);
		case 'F16':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F16);
		case 'F17':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F17);
		case 'F18':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F18);
		case 'F19':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F19);
		case 'F20':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$F20);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $ohanhi$keyboard$Keyboard$ChannelDown = {$: 'ChannelDown'};
var $ohanhi$keyboard$Keyboard$ChannelUp = {$: 'ChannelUp'};
var $ohanhi$keyboard$Keyboard$MediaFastForward = {$: 'MediaFastForward'};
var $ohanhi$keyboard$Keyboard$MediaPause = {$: 'MediaPause'};
var $ohanhi$keyboard$Keyboard$MediaPlay = {$: 'MediaPlay'};
var $ohanhi$keyboard$Keyboard$MediaPlayPause = {$: 'MediaPlayPause'};
var $ohanhi$keyboard$Keyboard$MediaRecord = {$: 'MediaRecord'};
var $ohanhi$keyboard$Keyboard$MediaRewind = {$: 'MediaRewind'};
var $ohanhi$keyboard$Keyboard$MediaStop = {$: 'MediaStop'};
var $ohanhi$keyboard$Keyboard$MediaTrackNext = {$: 'MediaTrackNext'};
var $ohanhi$keyboard$Keyboard$MediaTrackPrevious = {$: 'MediaTrackPrevious'};
var $ohanhi$keyboard$Keyboard$mediaKey = function (_v0) {
	var value = _v0.a;
	switch (value) {
		case 'ChannelDown':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ChannelDown);
		case 'ChannelUp':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ChannelUp);
		case 'MediaFastForward':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$MediaFastForward);
		case 'MediaPause':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$MediaPause);
		case 'MediaPlay':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$MediaPlay);
		case 'MediaPlayPause':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$MediaPlayPause);
		case 'MediaRecord':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$MediaRecord);
		case 'MediaRewind':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$MediaRewind);
		case 'MediaStop':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$MediaStop);
		case 'MediaTrackNext':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$MediaTrackNext);
		case 'MediaTrackPrevious':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$MediaTrackPrevious);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $ohanhi$keyboard$Keyboard$Alt = {$: 'Alt'};
var $ohanhi$keyboard$Keyboard$AltGraph = {$: 'AltGraph'};
var $ohanhi$keyboard$Keyboard$CapsLock = {$: 'CapsLock'};
var $ohanhi$keyboard$Keyboard$Control = {$: 'Control'};
var $ohanhi$keyboard$Keyboard$Fn = {$: 'Fn'};
var $ohanhi$keyboard$Keyboard$FnLock = {$: 'FnLock'};
var $ohanhi$keyboard$Keyboard$Hyper = {$: 'Hyper'};
var $ohanhi$keyboard$Keyboard$Meta = {$: 'Meta'};
var $ohanhi$keyboard$Keyboard$NumLock = {$: 'NumLock'};
var $ohanhi$keyboard$Keyboard$ScrollLock = {$: 'ScrollLock'};
var $ohanhi$keyboard$Keyboard$Shift = {$: 'Shift'};
var $ohanhi$keyboard$Keyboard$Super = {$: 'Super'};
var $ohanhi$keyboard$Keyboard$Symbol = {$: 'Symbol'};
var $ohanhi$keyboard$Keyboard$SymbolLock = {$: 'SymbolLock'};
var $ohanhi$keyboard$Keyboard$modifierKey = function (_v0) {
	var value = _v0.a;
	switch (value) {
		case 'Alt':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Alt);
		case 'AltGraph':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$AltGraph);
		case 'CapsLock':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$CapsLock);
		case 'Control':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Control);
		case 'Fn':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Fn);
		case 'FnLock':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$FnLock);
		case 'Hyper':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Hyper);
		case 'Meta':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Meta);
		case 'NumLock':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$NumLock);
		case 'ScrollLock':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ScrollLock);
		case 'Shift':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Shift);
		case 'Super':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Super);
		case 'OS':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Super);
		case 'Symbol':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Symbol);
		case 'SymbolLock':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$SymbolLock);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $ohanhi$keyboard$Keyboard$End = {$: 'End'};
var $ohanhi$keyboard$Keyboard$Home = {$: 'Home'};
var $ohanhi$keyboard$Keyboard$PageDown = {$: 'PageDown'};
var $ohanhi$keyboard$Keyboard$PageUp = {$: 'PageUp'};
var $ohanhi$keyboard$Keyboard$navigationKey = function (_v0) {
	var value = _v0.a;
	switch (value) {
		case 'ArrowDown':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ArrowDown);
		case 'ArrowLeft':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ArrowLeft);
		case 'ArrowRight':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ArrowRight);
		case 'ArrowUp':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ArrowUp);
		case 'Down':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ArrowDown);
		case 'Left':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ArrowLeft);
		case 'Right':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ArrowRight);
		case 'Up':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ArrowUp);
		case 'End':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$End);
		case 'Home':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Home);
		case 'PageDown':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$PageDown);
		case 'PageUp':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$PageUp);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $ohanhi$keyboard$Keyboard$oneOf = F2(
	function (fns, key) {
		oneOf:
		while (true) {
			if (!fns.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var fn = fns.a;
				var rest = fns.b;
				var _v1 = fn(key);
				if (_v1.$ === 'Just') {
					var a = _v1.a;
					return $elm$core$Maybe$Just(a);
				} else {
					var $temp$fns = rest,
						$temp$key = key;
					fns = $temp$fns;
					key = $temp$key;
					continue oneOf;
				}
			}
		}
	});
var $ohanhi$keyboard$Keyboard$AppSwitch = {$: 'AppSwitch'};
var $ohanhi$keyboard$Keyboard$Call = {$: 'Call'};
var $ohanhi$keyboard$Keyboard$Camera = {$: 'Camera'};
var $ohanhi$keyboard$Keyboard$CameraFocus = {$: 'CameraFocus'};
var $ohanhi$keyboard$Keyboard$EndCall = {$: 'EndCall'};
var $ohanhi$keyboard$Keyboard$GoBack = {$: 'GoBack'};
var $ohanhi$keyboard$Keyboard$GoHome = {$: 'GoHome'};
var $ohanhi$keyboard$Keyboard$HeadsetHook = {$: 'HeadsetHook'};
var $ohanhi$keyboard$Keyboard$LastNumberRedial = {$: 'LastNumberRedial'};
var $ohanhi$keyboard$Keyboard$MannerMode = {$: 'MannerMode'};
var $ohanhi$keyboard$Keyboard$Notification = {$: 'Notification'};
var $ohanhi$keyboard$Keyboard$VoiceDial = {$: 'VoiceDial'};
var $ohanhi$keyboard$Keyboard$phoneKey = function (_v0) {
	var value = _v0.a;
	switch (value) {
		case 'AppSwitch':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$AppSwitch);
		case 'Call':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Call);
		case 'Camera':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Camera);
		case 'CameraFocus':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$CameraFocus);
		case 'EndCall':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$EndCall);
		case 'GoBack':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$GoBack);
		case 'GoHome':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$GoHome);
		case 'HeadsetHook':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$HeadsetHook);
		case 'LastNumberRedial':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$LastNumberRedial);
		case 'Notification':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Notification);
		case 'MannerMode':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$MannerMode);
		case 'VoiceDial':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$VoiceDial);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $ohanhi$keyboard$Keyboard$Again = {$: 'Again'};
var $ohanhi$keyboard$Keyboard$Attn = {$: 'Attn'};
var $ohanhi$keyboard$Keyboard$Cancel = {$: 'Cancel'};
var $ohanhi$keyboard$Keyboard$ContextMenu = {$: 'ContextMenu'};
var $ohanhi$keyboard$Keyboard$Execute = {$: 'Execute'};
var $ohanhi$keyboard$Keyboard$Find = {$: 'Find'};
var $ohanhi$keyboard$Keyboard$Finish = {$: 'Finish'};
var $ohanhi$keyboard$Keyboard$Help = {$: 'Help'};
var $ohanhi$keyboard$Keyboard$Pause = {$: 'Pause'};
var $ohanhi$keyboard$Keyboard$Play = {$: 'Play'};
var $ohanhi$keyboard$Keyboard$Props = {$: 'Props'};
var $ohanhi$keyboard$Keyboard$Select = {$: 'Select'};
var $ohanhi$keyboard$Keyboard$ZoomIn = {$: 'ZoomIn'};
var $ohanhi$keyboard$Keyboard$ZoomOut = {$: 'ZoomOut'};
var $ohanhi$keyboard$Keyboard$uiKey = function (_v0) {
	var value = _v0.a;
	switch (value) {
		case 'Again':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Again);
		case 'Attn':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Attn);
		case 'Cancel':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Cancel);
		case 'ContextMenu':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ContextMenu);
		case 'Escape':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Escape);
		case 'Execute':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Execute);
		case 'Find':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Find);
		case 'Finish':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Finish);
		case 'Help':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Help);
		case 'Pause':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Pause);
		case 'Play':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Play);
		case 'Props':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Props);
		case 'Select':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Select);
		case 'ZoomIn':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ZoomIn);
		case 'ZoomOut':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$ZoomOut);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $ohanhi$keyboard$Keyboard$Enter = {$: 'Enter'};
var $ohanhi$keyboard$Keyboard$Tab = {$: 'Tab'};
var $ohanhi$keyboard$Keyboard$whitespaceKey = function (_v0) {
	var value = _v0.a;
	switch (value) {
		case 'Enter':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Enter);
		case 'Tab':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Tab);
		case 'Spacebar':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Spacebar);
		case ' ':
			return $elm$core$Maybe$Just($ohanhi$keyboard$Keyboard$Spacebar);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $ohanhi$keyboard$Keyboard$anyKeyWith = function (charParser) {
	return $ohanhi$keyboard$Keyboard$oneOf(
		_List_fromArray(
			[$ohanhi$keyboard$Keyboard$whitespaceKey, charParser, $ohanhi$keyboard$Keyboard$modifierKey, $ohanhi$keyboard$Keyboard$navigationKey, $ohanhi$keyboard$Keyboard$editingKey, $ohanhi$keyboard$Keyboard$functionKey, $ohanhi$keyboard$Keyboard$uiKey, $ohanhi$keyboard$Keyboard$phoneKey, $ohanhi$keyboard$Keyboard$mediaKey]));
};
var $elm$core$String$toUpper = _String_toUpper;
var $ohanhi$keyboard$Keyboard$characterKeyUpper = function (_v0) {
	var value = _v0.a;
	return ($elm$core$String$length(value) === 1) ? $elm$core$Maybe$Just(
		$ohanhi$keyboard$Keyboard$Character(
			$elm$core$String$toUpper(value))) : $elm$core$Maybe$Nothing;
};
var $ohanhi$keyboard$Keyboard$anyKeyUpper = $ohanhi$keyboard$Keyboard$anyKeyWith($ohanhi$keyboard$Keyboard$characterKeyUpper);
var $ohanhi$keyboard$Keyboard$insert = F3(
	function (keyParser, rawKey, list) {
		var _v0 = keyParser(rawKey);
		if (_v0.$ === 'Just') {
			var key = _v0.a;
			return A2(
				$elm$core$List$cons,
				key,
				A2(
					$elm$core$List$filter,
					$elm$core$Basics$neq(key),
					list));
		} else {
			return list;
		}
	});
var $ohanhi$keyboard$Keyboard$remove = F3(
	function (keyParser, rawKey, list) {
		var _v0 = keyParser(rawKey);
		if (_v0.$ === 'Just') {
			var key = _v0.a;
			return A2(
				$elm$core$List$filter,
				$elm$core$Basics$neq(key),
				list);
		} else {
			return list;
		}
	});
var $ohanhi$keyboard$Keyboard$updateWithParser = F3(
	function (keyParser, msg, state) {
		if (msg.$ === 'Down') {
			var key = msg.a;
			return A3($ohanhi$keyboard$Keyboard$insert, keyParser, key, state);
		} else {
			var key = msg.a;
			return A3($ohanhi$keyboard$Keyboard$remove, keyParser, key, state);
		}
	});
var $ohanhi$keyboard$Keyboard$update = $ohanhi$keyboard$Keyboard$updateWithParser($ohanhi$keyboard$Keyboard$anyKeyUpper);
var $author$project$Game$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Tick':
				var dt = msg.a;
				var playerWithExp = A2($author$project$Game$getExp, model.level.enemies, model.player);
				var exitReached = _Utils_eq(
					$elm$core$Basics$floor(model.player.x),
					$elm$core$Basics$floor(model.level.endX)) && _Utils_eq(
					$elm$core$Basics$floor(model.player.y),
					$elm$core$Basics$floor(model.level.endY));
				var enemies = A2($elm$core$List$filter, $author$project$Enemy$isAlive, model.level.enemies);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							camera: A2(
								$Zinggi$elm_2d_game$Game$TwoD$Camera$moveTo,
								_Utils_Tuple2(model.player.x, model.player.y),
								model.camera),
							level: exitReached ? A2($author$project$Game$initNextLevel, model.difficulty, model.level) : A4($author$project$Game$levelTick, dt, model.pauseToggle, model.player, model.level),
							pauseToggle: (!model.player.currentHealth) ? true : ((exitReached && _Utils_eq(model.level.map, $author$project$Level$Lvl3)) ? true : model.pauseToggle),
							player: exitReached ? A2($author$project$Game$initNextLevelPlayer, model.level, model.player) : A7($author$project$Game$playerTick, dt, model.time, model.level, model.keys, model.movement, enemies, playerWithExp),
							time: model.pauseToggle ? model.time : (model.time + dt)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Resources':
				var rMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							resources: A2($Zinggi$elm_game_resources$Game$Resources$update, rMsg, model.resources)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Keys':
				var keyMsg = msg.a;
				var keys = A2($ohanhi$keyboard$Keyboard$update, keyMsg, model.keys);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							keys: model.pauseToggle ? _List_Nil : keys,
							pauseToggle: (model.player.currentHealth > 0) ? (A2($elm$core$List$member, $ohanhi$keyboard$Keyboard$Escape, keys) ? (!model.pauseToggle) : model.pauseToggle) : model.pauseToggle
						}),
					(A2($elm$core$List$member, $ohanhi$keyboard$Keyboard$Escape, keys) && (!model.pauseToggle)) ? $author$project$Game$encodeSave(model) : $elm$core$Platform$Cmd$none);
			case 'Hover':
				var button = msg.a;
				switch (button.$) {
					case 'DeathScreenRespawn':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_DS_respawn: 'assets/button/button_DS_respawn_hover.png'}),
							$elm$core$Platform$Cmd$none);
					case 'DeathScreenReturn':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_DS_return: 'assets/button/button_DS_return_MainMenu_hover.png'}),
							$elm$core$Platform$Cmd$none);
					case 'PauseScreenResume':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_PS_resume: 'assets/button/button_resume_hover.png'}),
							$elm$core$Platform$Cmd$none);
					case 'PauseScreenSettings':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_PS_settings: 'assets/button/button_settings_hover.png'}),
							$elm$core$Platform$Cmd$none);
					case 'PauseScreenHelp':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_PS_help: 'assets/button/button_help_hover.png'}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_PS_return: 'assets/button/button_return_MainMenu_hover.png'}),
							$elm$core$Platform$Cmd$none);
				}
			case 'MouseOut':
				var button = msg.a;
				switch (button.$) {
					case 'DeathScreenRespawn':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_DS_respawn: 'assets/button/button_DS_respawn.png'}),
							$elm$core$Platform$Cmd$none);
					case 'DeathScreenReturn':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_DS_return: 'assets/button/button_DS_return_MainMenu.png'}),
							$elm$core$Platform$Cmd$none);
					case 'PauseScreenResume':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_PS_resume: 'assets/button/button_resume.png'}),
							$elm$core$Platform$Cmd$none);
					case 'PauseScreenSettings':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_PS_settings: 'assets/button/button_settings.png'}),
							$elm$core$Platform$Cmd$none);
					case 'PauseScreenHelp':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_PS_help: 'assets/button/button_help.png'}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button_PS_return: 'assets/button/button_return_MainMenu.png'}),
							$elm$core$Platform$Cmd$none);
				}
			case 'ClickResume':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{pauseToggle: false}),
					$elm$core$Platform$Cmd$none);
			case 'FinishedGame':
				return _Utils_Tuple2(
					model,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Game$encodeSave(model),
								$author$project$Game$encodeScore(model)
							])));
			default:
				var rel = msg.a;
				return rel ? _Utils_Tuple2(model, $elm$browser$Browser$Navigation$reload) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Help$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'HoverBack':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonBack: 'assets/button/button_back_hover.png'}),
					$elm$core$Platform$Cmd$none);
			case 'MouseOut':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonBack: 'assets/button/button_back.png'}),
					$elm$core$Platform$Cmd$none);
			default:
				var tab = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{activeTab: tab}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$HighScores$update = F2(
	function (msg, model) {
		if (msg.$ === 'HoverBack') {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{buttonBack: 'assets/button/button_back_hover.png'}),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{buttonBack: 'assets/button/button_back.png'}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Home$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'HoverNewGame':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{button_newGame: 'assets/button/button_newGame_hover.png'}),
					$elm$core$Platform$Cmd$none);
			case 'HoverLoadGame':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{button_loadGame: 'assets/button/button_loadGame_hover.png'}),
					$elm$core$Platform$Cmd$none);
			case 'HoverHighScore':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{button_highScore: 'assets/button/button_highScore_hover.png'}),
					$elm$core$Platform$Cmd$none);
			case 'HoverSettings':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{button_settings: 'assets/button/button_settings_hover.png'}),
					$elm$core$Platform$Cmd$none);
			case 'HoverHelp':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{button_help: 'assets/button/button_help_hover.png'}),
					$elm$core$Platform$Cmd$none);
			case 'MouseOut':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{button_help: 'assets/button/button_help.png', button_highScore: 'assets/button/button_highScore.png', button_loadGame: 'assets/button/button_loadGame.png', button_newGame: 'assets/button/button_newGame.png', button_settings: 'assets/button/button_settings.png'}),
					$elm$core$Platform$Cmd$none);
			default:
				var rel = msg.a;
				return rel ? _Utils_Tuple2(model, $elm$browser$Browser$Navigation$reload) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$LoadGame$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'HoverGame1':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonGame1: 'assets/button/button_loadGameInstance_background_hover.png'}),
					$elm$core$Platform$Cmd$none);
			case 'HoverGame2':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonGame2: 'assets/button/button_loadGameInstance_background_hover.png'}),
					$elm$core$Platform$Cmd$none);
			case 'HoverGame3':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonGame3: 'assets/button/button_loadGameInstance_background_hover.png'}),
					$elm$core$Platform$Cmd$none);
			case 'HoverBack':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonBack: 'assets/button/button_back_hover.png'}),
					$elm$core$Platform$Cmd$none);
			case 'MouseOut':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonBack: 'assets/button/button_back.png', buttonGame1: 'assets/button/button_loadGameInstance_background.png', buttonGame2: 'assets/button/button_loadGameInstance_background.png', buttonGame3: 'assets/button/button_loadGameInstance_background.png'}),
					$elm$core$Platform$Cmd$none);
			default:
				var rel = msg.a;
				return rel ? _Utils_Tuple2(model, $elm$browser$Browser$Navigation$reload) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$NewGame$createSave = function (model) {
	var encodedSave = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				(model.playerName === '') ? $elm$json$Json$Encode$null : $elm$json$Json$Encode$string(model.playerName)),
				_Utils_Tuple2(
				'difficulty',
				$elm$json$Json$Encode$string(
					$author$project$DecodingJson$difficultyToString(model.difficulty))),
				_Utils_Tuple2('player', $elm$json$Json$Encode$null),
				_Utils_Tuple2('level', $elm$json$Json$Encode$null),
				_Utils_Tuple2(
				'time',
				$elm$json$Json$Encode$float(0.0))
			]));
	var _v0 = model.savePosition;
	switch (_v0.$) {
		case 'First':
			return $author$project$Ports$storeSave1(encodedSave);
		case 'Second':
			return $author$project$Ports$storeSave2(encodedSave);
		default:
			return $author$project$Ports$storeSave3(encodedSave);
	}
};
var $author$project$NewGame$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'HoverBack':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonBack: 'assets/button/button_back_hover.png'}),
					$elm$core$Platform$Cmd$none);
			case 'HoverStart':
				var _v1 = A2($elm$core$Debug$log, '[NewGame.HoverStart] name', model.playerName);
				var _v2 = A2($elm$core$Debug$log, '[NewGame.HoverStart] diff', model.difficulty);
				var _v3 = A2($elm$core$Debug$log, '[NewGame.HoverStart] pos', model.savePosition);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonStart: 'assets/button/button_start_hover.png'}),
					$author$project$NewGame$createSave(model));
			case 'MouseOut':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonBack: 'assets/button/button_back.png', buttonStart: 'assets/button/button_start.png'}),
					$elm$core$Platform$Cmd$none);
			case 'NameChanged':
				var name = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{playerName: name}),
					$elm$core$Platform$Cmd$none);
			case 'DifficultyTo':
				var choice = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{difficulty: choice}),
					$elm$core$Platform$Cmd$none);
			default:
				var position = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{savePosition: position}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Ports$storeSettings = _Platform_outgoingPort('storeSettings', $elm$core$Basics$identity);
var $author$project$Settings$saveSettings = function (model) {
	var musicToString = function () {
		var _v1 = model.music;
		if (_v1.$ === 'On') {
			return 'on';
		} else {
			return 'off';
		}
	}();
	var movementToString = function () {
		var _v0 = model.movement;
		if (_v0.$ === 'WASD') {
			return 'wasd';
		} else {
			return 'arrows';
		}
	}();
	var encodedSettings = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'music',
				$elm$json$Json$Encode$string(musicToString)),
				_Utils_Tuple2(
				'movement',
				$elm$json$Json$Encode$string(movementToString))
			]));
	return $author$project$Ports$storeSettings(encodedSettings);
};
var $author$project$Settings$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'HoverBack':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonBack: 'assets/button/button_back_hover.png'}),
					$author$project$Settings$saveSettings(model));
			case 'MouseOut':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{buttonBack: 'assets/button/button_back.png'}),
					$elm$core$Platform$Cmd$none);
			case 'MusicTo':
				var choice = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{music: choice}),
					$elm$core$Platform$Cmd$none);
			default:
				var choice = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{movement: choice}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(msg, model.pageModel);
		_v0$9:
		while (true) {
			switch (_v0.a.$) {
				case 'LinkClicked':
					var urlRequest = _v0.a.a;
					if (urlRequest.$ === 'Internal') {
						var url = urlRequest.a;
						return _Utils_Tuple2(
							model,
							A2(
								$elm$browser$Browser$Navigation$pushUrl,
								model.navKey,
								$elm$url$Url$toString(url)));
					} else {
						var url = urlRequest.a;
						return _Utils_Tuple2(
							model,
							$elm$browser$Browser$Navigation$load(url));
					}
				case 'UrlChanged':
					var url = _v0.a.a;
					var newRoute = $author$project$Route$parseUrl(url);
					return $author$project$Main$initPage(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{route: newRoute}),
							$elm$core$Platform$Cmd$none));
				case 'HomePageMsg':
					if (_v0.b.$ === 'HomePage') {
						var subMsg = _v0.a.a;
						var modelHome = _v0.b.a;
						var _v2 = A2($author$project$Home$update, subMsg, modelHome);
						var updatedPageModel = _v2.a;
						var updatedCmds = _v2.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pageModel: $author$project$Main$HomePage(updatedPageModel)
								}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$HomePageMsg, updatedCmds));
					} else {
						break _v0$9;
					}
				case 'NewGamePageMsg':
					if (_v0.b.$ === 'NewGamePage') {
						var subMsg = _v0.a.a;
						var modelNewGame = _v0.b.a;
						var _v3 = A2($author$project$NewGame$update, subMsg, modelNewGame);
						var updatedPageModel = _v3.a;
						var updatedCmds = _v3.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pageModel: $author$project$Main$NewGamePage(updatedPageModel)
								}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$NewGamePageMsg, updatedCmds));
					} else {
						break _v0$9;
					}
				case 'GamePageMsg':
					if (_v0.b.$ === 'GamePage') {
						var subMsg = _v0.a.a;
						var modelGame = _v0.b.a;
						var _v4 = A2($author$project$Game$update, subMsg, modelGame);
						var updatedPageModel = _v4.a;
						var updatedCmds = _v4.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pageModel: $author$project$Main$GamePage(updatedPageModel)
								}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$GamePageMsg, updatedCmds));
					} else {
						break _v0$9;
					}
				case 'LoadGamePageMsg':
					if (_v0.b.$ === 'LoadGamePage') {
						var subMsg = _v0.a.a;
						var modelLoadGame = _v0.b.a;
						var _v5 = A2($author$project$LoadGame$update, subMsg, modelLoadGame);
						var updatedPageModel = _v5.a;
						var updatedCmds = _v5.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pageModel: $author$project$Main$LoadGamePage(updatedPageModel)
								}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$LoadGamePageMsg, updatedCmds));
					} else {
						break _v0$9;
					}
				case 'HighScoresPageMsg':
					if (_v0.b.$ === 'HighScoresPage') {
						var subMsg = _v0.a.a;
						var modelHighScores = _v0.b.a;
						var _v6 = A2($author$project$HighScores$update, subMsg, modelHighScores);
						var updatedPageModel = _v6.a;
						var updatedCmds = _v6.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pageModel: $author$project$Main$HighScoresPage(updatedPageModel)
								}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$HighScoresPageMsg, updatedCmds));
					} else {
						break _v0$9;
					}
				case 'SettingsPageMsg':
					if (_v0.b.$ === 'SettingsPage') {
						var subMsg = _v0.a.a;
						var modelSettings = _v0.b.a;
						var _v7 = A2($author$project$Settings$update, subMsg, modelSettings);
						var updatedPageModel = _v7.a;
						var updatedCmds = _v7.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pageModel: $author$project$Main$SettingsPage(updatedPageModel)
								}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$SettingsPageMsg, updatedCmds));
					} else {
						break _v0$9;
					}
				default:
					if (_v0.b.$ === 'HelpPage') {
						var subMsg = _v0.a.a;
						var modelHelp = _v0.b.a;
						var _v8 = A2($author$project$Help$update, subMsg, modelHelp);
						var updatedPageModel = _v8.a;
						var updatedCmds = _v8.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pageModel: $author$project$Main$HelpPage(updatedPageModel)
								}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$HelpPageMsg, updatedCmds));
					} else {
						break _v0$9;
					}
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $elm$html$Html$audio = _VirtualDom_node('audio');
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$autoplay = $elm$html$Html$Attributes$boolProperty('autoplay');
var $elm$html$Html$Attributes$controls = $elm$html$Html$Attributes$boolProperty('controls');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$loop = $elm$html$Html$Attributes$boolProperty('loop');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Main$backgroundMusic = function (settings) {
	if (settings.$ === 'Just') {
		var s = settings.a;
		var _v1 = s.music;
		if (_v1.$ === 'On') {
			return A2(
				$elm$html$Html$audio,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src('assets/audio/music/CaveLoop.wav'),
						$elm$html$Html$Attributes$autoplay(true),
						$elm$html$Html$Attributes$controls(false),
						$elm$html$Html$Attributes$loop(true)
					]),
				_List_Nil);
		} else {
			return A2($elm$html$Html$div, _List_Nil, _List_Nil);
		}
	} else {
		return A2($elm$html$Html$div, _List_Nil, _List_Nil);
	}
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$img = _VirtualDom_node('img');
var $Zinggi$elm_game_resources$Game$Resources$getTexture = F2(
	function (url, _v0) {
		var res = _v0.a;
		return A2($elm$core$Dict$get, url, res);
	});
var $Zinggi$elm_2d_game$Game$TwoD$Render$Rectangle = {$: 'Rectangle'};
var $Zinggi$elm_2d_game$Game$TwoD$Shaders$fragTextured = {
	src: '\n\nprecision mediump float;\n\nuniform sampler2D texture;\nuniform vec2 tileWH;\nvarying vec2 vcoord;\n\nvoid main () {\n    gl_FragColor = texture2D(texture, vcoord*tileWH);\n}\n',
	attributes: {},
	uniforms: {texture: 'texture', tileWH: 'tileWH'}
};
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 'RgbaSpace', a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$grey = A4($avh4$elm_color$Color$RgbaSpace, 211 / 255, 215 / 255, 207 / 255, 1.0);
var $elm_explorations$linear_algebra$Math$Matrix4$makeRotate = _MJS_m4x4makeRotate;
var $elm_explorations$linear_algebra$Math$Matrix4$makeScale = _MJS_m4x4makeScale;
var $elm_explorations$linear_algebra$Math$Matrix4$makeTranslate = _MJS_m4x4makeTranslate;
var $elm_explorations$linear_algebra$Math$Matrix4$mul = _MJS_m4x4mul;
var $elm_explorations$linear_algebra$Math$Vector3$vec3 = _MJS_v3;
var $Zinggi$elm_2d_game$Game$TwoD$Shaders$makeTransform = F4(
	function (_v0, rotation, _v1, _v2) {
		var x = _v0.a;
		var y = _v0.b;
		var z = _v0.c;
		var w = _v1.a;
		var h = _v1.b;
		var px = _v2.a;
		var py = _v2.b;
		var trans = $elm_explorations$linear_algebra$Math$Matrix4$makeTranslate(
			A3($elm_explorations$linear_algebra$Math$Vector3$vec3, x, y, z));
		var scale = $elm_explorations$linear_algebra$Math$Matrix4$makeScale(
			A3($elm_explorations$linear_algebra$Math$Vector3$vec3, w, h, 1));
		var rot = A2(
			$elm_explorations$linear_algebra$Math$Matrix4$makeRotate,
			rotation,
			A3($elm_explorations$linear_algebra$Math$Vector3$vec3, 0, 0, 1));
		var pivot = $elm_explorations$linear_algebra$Math$Matrix4$makeTranslate(
			A3($elm_explorations$linear_algebra$Math$Vector3$vec3, -px, -py, 0));
		return A2(
			$elm_explorations$linear_algebra$Math$Matrix4$mul,
			A2(
				$elm_explorations$linear_algebra$Math$Matrix4$mul,
				A2($elm_explorations$linear_algebra$Math$Matrix4$mul, trans, rot),
				scale),
			pivot);
	});
var $elm_explorations$webgl$WebGL$Internal$Blend = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return {$: 'Blend', a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm_explorations$webgl$WebGL$Settings$Blend$custom = function (_v0) {
	var r = _v0.r;
	var g = _v0.g;
	var b = _v0.b;
	var a = _v0.a;
	var color = _v0.color;
	var alpha = _v0.alpha;
	var expand = F2(
		function (_v1, _v2) {
			var eq1 = _v1.a;
			var f11 = _v1.b;
			var f12 = _v1.c;
			var eq2 = _v2.a;
			var f21 = _v2.b;
			var f22 = _v2.c;
			return $elm_explorations$webgl$WebGL$Internal$Blend(eq1)(f11)(f12)(eq2)(f21)(f22)(r)(g)(b)(a);
		});
	return A2(expand, color, alpha);
};
var $elm_explorations$webgl$WebGL$Settings$Blend$Blender = F3(
	function (a, b, c) {
		return {$: 'Blender', a: a, b: b, c: c};
	});
var $elm_explorations$webgl$WebGL$Settings$Blend$customAdd = F2(
	function (_v0, _v1) {
		var factor1 = _v0.a;
		var factor2 = _v1.a;
		return A3($elm_explorations$webgl$WebGL$Settings$Blend$Blender, 32774, factor1, factor2);
	});
var $elm_explorations$webgl$WebGL$Internal$DepthTest = F4(
	function (a, b, c, d) {
		return {$: 'DepthTest', a: a, b: b, c: c, d: d};
	});
var $elm_explorations$webgl$WebGL$Settings$DepthTest$less = function (_v0) {
	var write = _v0.write;
	var near = _v0.near;
	var far = _v0.far;
	return A4($elm_explorations$webgl$WebGL$Internal$DepthTest, 513, write, near, far);
};
var $elm_explorations$webgl$WebGL$Settings$DepthTest$default = $elm_explorations$webgl$WebGL$Settings$DepthTest$less(
	{far: 1, near: 0, write: true});
var $elm_explorations$webgl$WebGL$Internal$enableOption = F2(
	function (ctx, option) {
		switch (option.$) {
			case 'Alpha':
				return A2(_WebGL_enableAlpha, ctx, option);
			case 'Depth':
				return A2(_WebGL_enableDepth, ctx, option);
			case 'Stencil':
				return A2(_WebGL_enableStencil, ctx, option);
			case 'Antialias':
				return A2(_WebGL_enableAntialias, ctx, option);
			case 'ClearColor':
				return A2(_WebGL_enableClearColor, ctx, option);
			default:
				return A2(_WebGL_enablePreserveDrawingBuffer, ctx, option);
		}
	});
var $elm_explorations$webgl$WebGL$Internal$enableSetting = F2(
	function (cache, setting) {
		switch (setting.$) {
			case 'Blend':
				return A2(_WebGL_enableBlend, cache, setting);
			case 'DepthTest':
				return A2(_WebGL_enableDepthTest, cache, setting);
			case 'StencilTest':
				return A2(_WebGL_enableStencilTest, cache, setting);
			case 'Scissor':
				return A2(_WebGL_enableScissor, cache, setting);
			case 'ColorMask':
				return A2(_WebGL_enableColorMask, cache, setting);
			case 'CullFace':
				return A2(_WebGL_enableCullFace, cache, setting);
			case 'PolygonOffset':
				return A2(_WebGL_enablePolygonOffset, cache, setting);
			case 'SampleCoverage':
				return A2(_WebGL_enableSampleCoverage, cache, setting);
			default:
				return _WebGL_enableSampleAlphaToCoverage(cache);
		}
	});
var $elm_explorations$webgl$WebGL$entityWith = _WebGL_entity;
var $elm_explorations$webgl$WebGL$Settings$Blend$Factor = function (a) {
	return {$: 'Factor', a: a};
};
var $elm_explorations$webgl$WebGL$Settings$Blend$one = $elm_explorations$webgl$WebGL$Settings$Blend$Factor(1);
var $elm_explorations$webgl$WebGL$Settings$Blend$oneMinusSrcAlpha = $elm_explorations$webgl$WebGL$Settings$Blend$Factor(771);
var $elm_explorations$webgl$WebGL$Settings$Blend$srcAlpha = $elm_explorations$webgl$WebGL$Settings$Blend$Factor(770);
var $Zinggi$elm_2d_game$Game$TwoD$Render$renderTransparent = $elm_explorations$webgl$WebGL$entityWith(
	_List_fromArray(
		[
			$elm_explorations$webgl$WebGL$Settings$Blend$custom(
			{
				a: 0,
				alpha: A2($elm_explorations$webgl$WebGL$Settings$Blend$customAdd, $elm_explorations$webgl$WebGL$Settings$Blend$one, $elm_explorations$webgl$WebGL$Settings$Blend$oneMinusSrcAlpha),
				b: 0,
				color: A2($elm_explorations$webgl$WebGL$Settings$Blend$customAdd, $elm_explorations$webgl$WebGL$Settings$Blend$srcAlpha, $elm_explorations$webgl$WebGL$Settings$Blend$oneMinusSrcAlpha),
				g: 0,
				r: 0
			}),
			$elm_explorations$webgl$WebGL$Settings$DepthTest$default
		]));
var $Zinggi$elm_2d_game$Game$TwoD$Shapes$Vertex = function (position) {
	return {position: position};
};
var $elm_explorations$webgl$WebGL$Mesh3 = F2(
	function (a, b) {
		return {$: 'Mesh3', a: a, b: b};
	});
var $elm_explorations$webgl$WebGL$triangles = $elm_explorations$webgl$WebGL$Mesh3(
	{elemSize: 3, indexSize: 0, mode: 4});
var $elm_explorations$linear_algebra$Math$Vector2$vec2 = _MJS_v2;
var $Zinggi$elm_2d_game$Game$TwoD$Shapes$unitSquare = $elm_explorations$webgl$WebGL$triangles(
	_List_fromArray(
		[
			_Utils_Tuple3(
			$Zinggi$elm_2d_game$Game$TwoD$Shapes$Vertex(
				A2($elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 0)),
			$Zinggi$elm_2d_game$Game$TwoD$Shapes$Vertex(
				A2($elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 1)),
			$Zinggi$elm_2d_game$Game$TwoD$Shapes$Vertex(
				A2($elm_explorations$linear_algebra$Math$Vector2$vec2, 1, 0))),
			_Utils_Tuple3(
			$Zinggi$elm_2d_game$Game$TwoD$Shapes$Vertex(
				A2($elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 1)),
			$Zinggi$elm_2d_game$Game$TwoD$Shapes$Vertex(
				A2($elm_explorations$linear_algebra$Math$Vector2$vec2, 1, 0)),
			$Zinggi$elm_2d_game$Game$TwoD$Shapes$Vertex(
				A2($elm_explorations$linear_algebra$Math$Vector2$vec2, 1, 1)))
		]));
var $Zinggi$elm_2d_game$Game$TwoD$Shaders$vertTexturedRect = {
	src: '\nattribute vec2 position;\n\nuniform mat4 transform;\nuniform mat4 cameraProj;\n\nvarying vec2 vcoord;\nvoid main () {\n    vec4 pos = cameraProj*transform*vec4(position, 0, 1);\n    gl_Position = pos;\n    vcoord = position.xy;\n}\n',
	attributes: {position: 'position'},
	uniforms: {cameraProj: 'cameraProj', transform: 'transform'}
};
var $Zinggi$elm_2d_game$Game$TwoD$Render$rectWithFragment = F2(
	function (frag, uniforms) {
		return A4($Zinggi$elm_2d_game$Game$TwoD$Render$renderTransparent, $Zinggi$elm_2d_game$Game$TwoD$Shaders$vertTexturedRect, frag, $Zinggi$elm_2d_game$Game$TwoD$Shapes$unitSquare, uniforms);
	});
var $avh4$elm_color$Color$toRgba = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	return {alpha: a, blue: b, green: g, red: r};
};
var $Zinggi$elm_2d_game$Game$TwoD$Shaders$colorToRGBVector = function (color) {
	var _v0 = $avh4$elm_color$Color$toRgba(color);
	var red = _v0.red;
	var green = _v0.green;
	var blue = _v0.blue;
	return A3($elm_explorations$linear_algebra$Math$Vector3$vec3, red, green, blue);
};
var $Zinggi$elm_2d_game$Game$TwoD$Shaders$fragUniColor = {
	src: '\n\nprecision mediump float;\n\nuniform vec3 color;\nvarying vec2 vcoord;\n\nvoid main() {\n    gl_FragColor = vec4(color, 1);\n}\n',
	attributes: {},
	uniforms: {color: 'color'}
};
var $Zinggi$elm_2d_game$Game$TwoD$Shaders$fragUniColorCircle = {
	src: '\n\nprecision mediump float;\n\nuniform vec3 color;\nvarying vec2 vcoord;\n\nvoid main () {\n  float dist = length(vec2(0.5, 0.5) - vcoord);\n\n  float alpha = 1.0 - smoothstep(0.5 - 0.01, 0.5, dist);\n  vec4 color = vec4(color, alpha);\n\n  if (alpha <= 0.01) {\n      discard;\n  }\n\n  gl_FragColor = color;\n}\n',
	attributes: {},
	uniforms: {color: 'color'}
};
var $Zinggi$elm_2d_game$Game$TwoD$Shaders$fragUniColorRing = {
	src: '\n\nprecision mediump float;\n\nuniform vec3 color;\nvarying vec2 vcoord;\n\nvoid main () {\n  float dist = length(vec2(0.5, 0.5) - vcoord);\n\n  float alpha = smoothstep(0.5, 0.5 - 0.01, dist) * smoothstep(0.49 - 0.01, 0.49, dist);\n  vec4 color = vec4(color, alpha);\n\n  if (alpha <= 0.01) {\n      discard;\n  }\n\n  gl_FragColor = color;\n}\n',
	attributes: {},
	uniforms: {color: 'color'}
};
var $Zinggi$elm_2d_game$Game$TwoD$Shapes$unitTriangle = $elm_explorations$webgl$WebGL$triangles(
	_List_fromArray(
		[
			_Utils_Tuple3(
			$Zinggi$elm_2d_game$Game$TwoD$Shapes$Vertex(
				A2($elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 0)),
			$Zinggi$elm_2d_game$Game$TwoD$Shapes$Vertex(
				A2($elm_explorations$linear_algebra$Math$Vector2$vec2, 0, 1)),
			$Zinggi$elm_2d_game$Game$TwoD$Shapes$Vertex(
				A2($elm_explorations$linear_algebra$Math$Vector2$vec2, 1, 0)))
		]));
var $Zinggi$elm_2d_game$Game$TwoD$Shaders$vertColoredShape = {
	src: '\nattribute vec2 position;\n\nuniform mat4 transform;\nuniform mat4 cameraProj;\nvarying vec2 vcoord;\nvoid main() {\n    gl_Position = cameraProj*transform*vec4(position, 0, 1);\n    vcoord = position.xy;\n}\n',
	attributes: {position: 'position'},
	uniforms: {cameraProj: 'cameraProj', transform: 'transform'}
};
var $Zinggi$elm_2d_game$Game$TwoD$Render$Renderable = function (a) {
	return {$: 'Renderable', a: a};
};
var $Zinggi$elm_2d_game$Game$TwoD$Render$veryCustom = $Zinggi$elm_2d_game$Game$TwoD$Render$Renderable;
var $Zinggi$elm_2d_game$Game$TwoD$Camera$getViewSize = F2(
	function (_v0, _v1) {
		var w = _v0.a;
		var h = _v0.b;
		var size = _v1.a.size;
		switch (size.$) {
			case 'Width':
				var x = size.a;
				return _Utils_Tuple2(x, (x * h) / w);
			case 'Height':
				var y = size.a;
				return _Utils_Tuple2((y * w) / h, y);
			case 'Area':
				var a = size.a;
				return _Utils_Tuple2(
					$elm$core$Basics$sqrt((a * w) / h),
					$elm$core$Basics$sqrt((a * h) / w));
			default:
				var fn = size.a;
				return fn(
					_Utils_Tuple2(w, h));
		}
	});
var $elm_explorations$linear_algebra$Math$Matrix4$makeOrtho2D = _MJS_m4x4makeOrtho2D;
var $Zinggi$elm_2d_game$Game$Helpers$scale = F2(
	function (a, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(a * x, a * y);
	});
var $Zinggi$elm_2d_game$Game$TwoD$Camera$view = F2(
	function (camera, size) {
		var position = camera.a.position;
		var _v0 = position;
		var x = _v0.a;
		var y = _v0.b;
		var _v1 = A2(
			$Zinggi$elm_2d_game$Game$Helpers$scale,
			0.5,
			A2($Zinggi$elm_2d_game$Game$TwoD$Camera$getViewSize, size, camera));
		var w = _v1.a;
		var h = _v1.b;
		var _v2 = _Utils_Tuple2(
			_Utils_Tuple2(x - w, x + w),
			_Utils_Tuple2(y - h, y + h));
		var _v3 = _v2.a;
		var l = _v3.a;
		var r = _v3.b;
		var _v4 = _v2.b;
		var d = _v4.a;
		var u = _v4.b;
		return A4($elm_explorations$linear_algebra$Math$Matrix4$makeOrtho2D, l, r, d, u);
	});
var $Zinggi$elm_2d_game$Game$TwoD$Render$shapeWithOptions = F2(
	function (theShape, _v0) {
		var color = _v0.color;
		var rotation = _v0.rotation;
		var position = _v0.position;
		var size = _v0.size;
		var pivot = _v0.pivot;
		var _v1 = function () {
			switch (theShape.$) {
				case 'Rectangle':
					return _Utils_Tuple2($Zinggi$elm_2d_game$Game$TwoD$Shaders$fragUniColor, $Zinggi$elm_2d_game$Game$TwoD$Shapes$unitSquare);
				case 'Triangle':
					return _Utils_Tuple2($Zinggi$elm_2d_game$Game$TwoD$Shaders$fragUniColor, $Zinggi$elm_2d_game$Game$TwoD$Shapes$unitTriangle);
				case 'Circle':
					return _Utils_Tuple2($Zinggi$elm_2d_game$Game$TwoD$Shaders$fragUniColorCircle, $Zinggi$elm_2d_game$Game$TwoD$Shapes$unitSquare);
				default:
					return _Utils_Tuple2($Zinggi$elm_2d_game$Game$TwoD$Shaders$fragUniColorRing, $Zinggi$elm_2d_game$Game$TwoD$Shapes$unitSquare);
			}
		}();
		var frag = _v1.a;
		var attribs = _v1.b;
		return $Zinggi$elm_2d_game$Game$TwoD$Render$veryCustom(
			function (_v3) {
				var camera = _v3.camera;
				var screenSize = _v3.screenSize;
				return A4(
					$Zinggi$elm_2d_game$Game$TwoD$Render$renderTransparent,
					$Zinggi$elm_2d_game$Game$TwoD$Shaders$vertColoredShape,
					frag,
					attribs,
					{
						cameraProj: A2($Zinggi$elm_2d_game$Game$TwoD$Camera$view, camera, screenSize),
						color: $Zinggi$elm_2d_game$Game$TwoD$Shaders$colorToRGBVector(color),
						transform: A4($Zinggi$elm_2d_game$Game$TwoD$Shaders$makeTransform, position, rotation, size, pivot)
					});
			});
	});
var $Zinggi$elm_2d_game$Game$TwoD$Render$shapeZ = F2(
	function (theShape, _v0) {
		var color = _v0.color;
		var position = _v0.position;
		var size = _v0.size;
		return A2(
			$Zinggi$elm_2d_game$Game$TwoD$Render$shapeWithOptions,
			theShape,
			{
				color: color,
				pivot: _Utils_Tuple2(0, 0),
				position: position,
				rotation: 0,
				size: size
			});
	});
var $Zinggi$elm_2d_game$Game$Helpers$v2FromTuple = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return A2($elm_explorations$linear_algebra$Math$Vector2$vec2, x, y);
};
var $Zinggi$elm_2d_game$Game$TwoD$Render$spriteWithOptions = function (args) {
	var texture = args.texture;
	var position = args.position;
	var size = args.size;
	var tiling = args.tiling;
	var rotation = args.rotation;
	var pivot = args.pivot;
	if (texture.$ === 'Just') {
		var t = texture.a;
		return $Zinggi$elm_2d_game$Game$TwoD$Render$veryCustom(
			function (_v1) {
				var camera = _v1.camera;
				var screenSize = _v1.screenSize;
				return A2(
					$Zinggi$elm_2d_game$Game$TwoD$Render$rectWithFragment,
					$Zinggi$elm_2d_game$Game$TwoD$Shaders$fragTextured,
					{
						cameraProj: A2($Zinggi$elm_2d_game$Game$TwoD$Camera$view, camera, screenSize),
						texture: t,
						tileWH: $Zinggi$elm_2d_game$Game$Helpers$v2FromTuple(tiling),
						transform: A4($Zinggi$elm_2d_game$Game$TwoD$Shaders$makeTransform, position, rotation, size, pivot)
					});
			});
	} else {
		return A2(
			$Zinggi$elm_2d_game$Game$TwoD$Render$shapeZ,
			$Zinggi$elm_2d_game$Game$TwoD$Render$Rectangle,
			{color: $avh4$elm_color$Color$grey, position: position, size: size});
	}
};
var $Zinggi$elm_2d_game$Game$TwoD$Render$spriteZ = function (_v0) {
	var texture = _v0.texture;
	var position = _v0.position;
	var size = _v0.size;
	return $Zinggi$elm_2d_game$Game$TwoD$Render$spriteWithOptions(
		{
			pivot: _Utils_Tuple2(0, 0),
			position: position,
			rotation: 0,
			size: size,
			texture: texture,
			tiling: _Utils_Tuple2(1, 1)
		});
};
var $author$project$Game$renderBackground = F2(
	function (resources, mapTexture) {
		return _List_fromArray(
			[
				$Zinggi$elm_2d_game$Game$TwoD$Render$spriteZ(
				{
					position: _Utils_Tuple3(0, 0, -0.9),
					size: _Utils_Tuple2(128, 128),
					texture: A2($Zinggi$elm_game_resources$Game$Resources$getTexture, mapTexture, resources)
				})
			]);
	});
var $Zinggi$elm_2d_game$Game$TwoD$Shaders$fragAnimTextured = {
	src: '\n\nprecision mediump float;\n\nuniform sampler2D texture;\nuniform vec2 bottomLeft;\nuniform vec2 topRight;\nuniform int numberOfFrames;\nuniform float duration;\nuniform float time;\nvarying vec2 vcoord;\n\nvoid main () {\n    float n = float(numberOfFrames);\n    float framePos = floor((mod(time, duration) / duration) * n );\n    vec2 stripSize = topRight - bottomLeft;\n    vec2 frameSize = vec2(stripSize.x / n, stripSize.y);\n    vec2 texCoord = bottomLeft + vec2(frameSize.x * framePos, 0) + vcoord * frameSize;\n\n    gl_FragColor = texture2D(texture, texCoord.xy);\n}\n',
	attributes: {},
	uniforms: {bottomLeft: 'bottomLeft', duration: 'duration', numberOfFrames: 'numberOfFrames', texture: 'texture', time: 'time', topRight: 'topRight'}
};
var $Zinggi$elm_2d_game$Game$TwoD$Render$animatedSpriteWithOptions = function (_v0) {
	var texture = _v0.texture;
	var position = _v0.position;
	var size = _v0.size;
	var bottomLeft = _v0.bottomLeft;
	var topRight = _v0.topRight;
	var duration = _v0.duration;
	var numberOfFrames = _v0.numberOfFrames;
	var rotation = _v0.rotation;
	var pivot = _v0.pivot;
	if (texture.$ === 'Just') {
		var tex = texture.a;
		return $Zinggi$elm_2d_game$Game$TwoD$Render$veryCustom(
			function (_v2) {
				var camera = _v2.camera;
				var screenSize = _v2.screenSize;
				var time = _v2.time;
				return A2(
					$Zinggi$elm_2d_game$Game$TwoD$Render$rectWithFragment,
					$Zinggi$elm_2d_game$Game$TwoD$Shaders$fragAnimTextured,
					{
						bottomLeft: $Zinggi$elm_2d_game$Game$Helpers$v2FromTuple(bottomLeft),
						cameraProj: A2($Zinggi$elm_2d_game$Game$TwoD$Camera$view, camera, screenSize),
						duration: duration,
						numberOfFrames: numberOfFrames,
						texture: tex,
						time: time,
						topRight: $Zinggi$elm_2d_game$Game$Helpers$v2FromTuple(topRight),
						transform: A4($Zinggi$elm_2d_game$Game$TwoD$Shaders$makeTransform, position, rotation, size, pivot)
					});
			});
	} else {
		return A2(
			$Zinggi$elm_2d_game$Game$TwoD$Render$shapeZ,
			$Zinggi$elm_2d_game$Game$TwoD$Render$Rectangle,
			{color: $avh4$elm_color$Color$grey, position: position, size: size});
	}
};
var $author$project$Enemy$renderEnemy = F2(
	function (resources, enemy) {
		return $Zinggi$elm_2d_game$Game$TwoD$Render$animatedSpriteWithOptions(
			{
				bottomLeft: _Utils_Tuple2(0, 0),
				duration: 1,
				numberOfFrames: 2,
				pivot: _Utils_Tuple2(0, 0),
				position: _Utils_Tuple3(enemy.x, enemy.y, -0.1),
				rotation: 0,
				size: _Utils_Tuple2(enemy.width, enemy.height),
				texture: function () {
					var _v0 = enemy.dir;
					switch (_v0.$) {
						case 'Left':
							return A2(
								$Zinggi$elm_game_resources$Game$Resources$getTexture,
								'assets/enemy/' + ($author$project$Enemy$enemyTypeToString(enemy) + '_left.png'),
								resources);
						case 'Right':
							return A2(
								$Zinggi$elm_game_resources$Game$Resources$getTexture,
								'assets/enemy/' + ($author$project$Enemy$enemyTypeToString(enemy) + '_right.png'),
								resources);
						case 'Up':
							return A2(
								$Zinggi$elm_game_resources$Game$Resources$getTexture,
								'assets/enemy/' + ($author$project$Enemy$enemyTypeToString(enemy) + '_up.png'),
								resources);
						default:
							return A2(
								$Zinggi$elm_game_resources$Game$Resources$getTexture,
								'assets/enemy/' + ($author$project$Enemy$enemyTypeToString(enemy) + '_down.png'),
								resources);
					}
				}(),
				topRight: _Utils_Tuple2(1, 1)
			});
	});
var $author$project$Item$renderItemStand = F2(
	function (resources, item) {
		return $Zinggi$elm_2d_game$Game$TwoD$Render$animatedSpriteWithOptions(
			{
				bottomLeft: _Utils_Tuple2(0, 0),
				duration: 1,
				numberOfFrames: 4,
				pivot: _Utils_Tuple2(0, 0),
				position: _Utils_Tuple3(item.x, item.y, -0.1),
				rotation: 0,
				size: _Utils_Tuple2(item.width, item.height),
				texture: A2(
					$Zinggi$elm_game_resources$Game$Resources$getTexture,
					'assets/item/item_stand_' + ($author$project$Item$itemTypeToString(item) + '.png'),
					resources),
				topRight: _Utils_Tuple2(1, 1)
			});
	});
var $author$project$Player$armorToTexturePath = function (armor) {
	var _v0 = armor.armorType;
	switch (_v0.$) {
		case 'None':
			return 'EEE';
		case 'Leather':
			return 'LLL';
		case 'Silver':
			return 'SSS';
		default:
			return 'DDD';
	}
};
var $author$project$Player$renderPlayer = F2(
	function (resources, player) {
		var playerImgPath = function () {
			var _v0 = player.dir;
			switch (_v0.$) {
				case 'Left':
					return 'assets/player/player_' + ($author$project$Player$armorToTexturePath(player.armor) + '_left.png');
				case 'Right':
					return 'assets/player/player_' + ($author$project$Player$armorToTexturePath(player.armor) + '_right.png');
				case 'Up':
					return 'assets/player/player_' + ($author$project$Player$armorToTexturePath(player.armor) + '_up.png');
				case 'Down':
					return 'assets/player/player_' + ($author$project$Player$armorToTexturePath(player.armor) + '_down.png');
				default:
					return 'assets/player/player_' + ($author$project$Player$armorToTexturePath(player.armor) + '_idle.png');
			}
		}();
		return $Zinggi$elm_2d_game$Game$TwoD$Render$animatedSpriteWithOptions(
			{
				bottomLeft: _Utils_Tuple2(0, 0),
				duration: 1,
				numberOfFrames: 2,
				pivot: _Utils_Tuple2(0, 0),
				position: _Utils_Tuple3(player.x, player.y, -0.1),
				rotation: 0,
				size: _Utils_Tuple2(player.width, player.height),
				texture: A2($Zinggi$elm_game_resources$Game$Resources$getTexture, playerImgPath, resources),
				topRight: _Utils_Tuple2(1, 1)
			});
	});
var $author$project$Sword$swordDirectionToString = function (sword) {
	var _v0 = sword.dir;
	switch (_v0.$) {
		case 'Left':
			return 'left';
		case 'Right':
			return 'right';
		case 'Up':
			return 'up';
		case 'Down':
			return 'down';
		default:
			return 'left';
	}
};
var $author$project$Sword$renderSword = F2(
	function (resources, sword) {
		var swordImgPath = function () {
			var _v0 = sword.action;
			if (_v0.$ === 'NotAttack') {
				return 'assets/sword/sword_' + ($author$project$Sword$swordTypeToString(sword) + '.png');
			} else {
				return 'assets/sword/sword_' + ($author$project$Sword$swordTypeToString(sword) + ('_attack_' + ($author$project$Sword$swordDirectionToString(sword) + '.png')));
			}
		}();
		return $Zinggi$elm_2d_game$Game$TwoD$Render$spriteWithOptions(
			{
				pivot: _Utils_Tuple2(0, 0),
				position: _Utils_Tuple3(sword.x, sword.y, 0.1),
				rotation: 0,
				size: _Utils_Tuple2(sword.width, sword.height),
				texture: A2($Zinggi$elm_game_resources$Game$Resources$getTexture, swordImgPath, resources),
				tiling: _Utils_Tuple2(1, 1)
			});
	});
var $author$project$Game$render = function (model) {
	return $elm$core$List$concat(
		_List_fromArray(
			[
				A2($author$project$Game$renderBackground, model.resources, model.level.mapTexture),
				_List_fromArray(
				[
					A2($author$project$Player$renderPlayer, model.resources, model.player),
					A2($author$project$Sword$renderSword, model.resources, model.player.sword)
				]),
				A2(
				$elm$core$List$map,
				$author$project$Enemy$renderEnemy(model.resources),
				A2($elm$core$List$filter, $author$project$Enemy$isAlive, model.level.enemies)),
				A2(
				$elm$core$List$map,
				$author$project$Item$renderItemStand(model.resources),
				model.level.items)
			]));
};
var $elm_explorations$webgl$WebGL$Internal$Alpha = function (a) {
	return {$: 'Alpha', a: a};
};
var $elm_explorations$webgl$WebGL$alpha = $elm_explorations$webgl$WebGL$Internal$Alpha;
var $elm_explorations$webgl$WebGL$Internal$Antialias = {$: 'Antialias'};
var $elm_explorations$webgl$WebGL$antialias = $elm_explorations$webgl$WebGL$Internal$Antialias;
var $elm_explorations$webgl$WebGL$Internal$Depth = function (a) {
	return {$: 'Depth', a: a};
};
var $elm_explorations$webgl$WebGL$depth = $elm_explorations$webgl$WebGL$Internal$Depth;
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm_explorations$webgl$WebGL$toHtmlWith = F3(
	function (options, attributes, entities) {
		return A3(_WebGL_toHtml, options, attributes, entities);
	});
var $Zinggi$elm_2d_game$Game$TwoD$Render$toWebGl = F4(
	function (time, camera, screenSize, _v0) {
		var f = _v0.a;
		return f(
			{camera: camera, screenSize: screenSize, time: time});
	});
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $Zinggi$elm_2d_game$Game$TwoD$renderWithOptions = F3(
	function (attributes, _v0, objects) {
		var time = _v0.time;
		var size = _v0.size;
		var camera = _v0.camera;
		var _v1 = size;
		var w = _v1.a;
		var h = _v1.b;
		var _v2 = _Utils_Tuple2(w, h);
		var wf = _v2.a;
		var hf = _v2.b;
		return A3(
			$elm_explorations$webgl$WebGL$toHtmlWith,
			_List_fromArray(
				[
					$elm_explorations$webgl$WebGL$alpha(false),
					$elm_explorations$webgl$WebGL$depth(1),
					$elm_explorations$webgl$WebGL$antialias
				]),
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$width(w),
						$elm$html$Html$Attributes$height(h)
					]),
				attributes),
			A2(
				$elm$core$List$map,
				A3(
					$Zinggi$elm_2d_game$Game$TwoD$Render$toWebGl,
					time,
					camera,
					_Utils_Tuple2(wf, hf)),
				objects));
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Armor$Chestplate = {$: 'Chestplate'};
var $author$project$Armor$Helmet = {$: 'Helmet'};
var $author$project$Armor$Legs = {$: 'Legs'};
var $author$project$Armor$armorPieceToString = function (armorPiece) {
	switch (armorPiece.$) {
		case 'Helmet':
			return 'helmet';
		case 'Chestplate':
			return 'chest';
		default:
			return 'legs';
	}
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $author$project$Game$armorInfo = F5(
	function (left, top, imgSize, armor, armorPiece) {
		var armorPieceDefValue = function () {
			switch (armorPiece.$) {
				case 'Helmet':
					return armor.helmetDef;
				case 'Chestplate':
					return armor.chestDef;
				default:
					return armor.legsDef;
			}
		}();
		var armorName = $elm$core$String$toUpper(
			$author$project$Armor$armorTypeToString(armor) + (' ' + $author$project$Armor$armorPieceToString(armorPiece)));
		var armorImgPath = function () {
			var _v0 = armor.armorType;
			switch (_v0.$) {
				case 'None':
					return 'assets/item/default_' + ($author$project$Armor$armorPieceToString(armorPiece) + ('_' + (imgSize + ('_' + (imgSize + '.png')))));
				case 'Leather':
					return 'assets/item/leather_' + ($author$project$Armor$armorPieceToString(armorPiece) + ('_' + (imgSize + ('_' + (imgSize + '.png')))));
				case 'Silver':
					return 'assets/item/silver_' + ($author$project$Armor$armorPieceToString(armorPiece) + ('_' + (imgSize + ('_' + (imgSize + '.png')))));
				default:
					return 'assets/item/dragon_' + ($author$project$Armor$armorPieceToString(armorPiece) + ('_' + (imgSize + ('_' + (imgSize + '.png')))));
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2(
							$elm$html$Html$Attributes$style,
							'left',
							$elm$core$String$fromInt(150) + 'px'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '0em'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'consolas'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.5em'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A3(
								$elm$core$String$padLeft,
								15,
								_Utils_chr(' '),
								armorName) + '\n')
						])),
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2(
							$elm$html$Html$Attributes$style,
							'left',
							$elm$core$String$fromInt(150) + 'px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'consolas'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A3(
								$elm$core$String$padLeft,
								15,
								_Utils_chr(' '),
								'DEF ' + $elm$core$String$fromInt(armorPieceDefValue)))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2(
							$elm$html$Html$Attributes$style,
							'left',
							$elm$core$String$fromInt(left) + 'px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(armorImgPath)
								]),
							_List_Nil)
						]))
				]));
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Game$healthPotionInfo = F3(
	function (left, top, healthPotion) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/item/health_potion_128_128.png')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'margin-left', '4em'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'consolas'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.5em'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
							A2($elm$html$Html$Attributes$style, 'color', 'red')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Health potion  x' + $elm$core$String$fromInt(healthPotion.count))
						])),
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '2.5em'),
							A2($elm$html$Html$Attributes$style, 'margin-left', '5em'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'- restores ' + ($elm$core$String$fromFloat(healthPotion.ratio * 100.0) + '% of max HP'))
						]))
				]));
	});
var $author$project$Game$speedPotionInfo = F3(
	function (left, top, speedPotion) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/item/speed_potion_128_128.png')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'margin-left', '4em'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'consolas'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.5em'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
							A2($elm$html$Html$Attributes$style, 'color', 'green')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Speed potion  x' + $elm$core$String$fromInt(speedPotion.count))
						])),
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '2.5em'),
							A2($elm$html$Html$Attributes$style, 'margin-left', '5em'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'- increase speed by ' + ($elm$core$String$fromFloat((speedPotion.ratio - 1) * 100.0) + '%\n')),
							$elm$html$Html$text(
							'- duration: ' + ($elm$core$String$fromFloat(speedPotion.duration) + 's'))
						]))
				]));
	});
var $author$project$Game$swordInfo = F4(
	function (left, top, imgSize, sword) {
		var swordName = $elm$core$String$toUpper(
			$author$project$Sword$swordTypeToString(sword) + ' sword');
		var swordImgPath = function () {
			var _v0 = sword.swordType;
			switch (_v0.$) {
				case 'Wood':
					return 'assets/sword/sword_wood_' + (imgSize + ('_' + (imgSize + '.png')));
				case 'Stone':
					return 'assets/sword/sword_stone_' + (imgSize + ('_' + (imgSize + '.png')));
				case 'Iron':
					return 'assets/sword/sword_iron_' + (imgSize + ('_' + (imgSize + '.png')));
				default:
					return 'assets/sword/sword_dragon_' + (imgSize + ('_' + (imgSize + '.png')));
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2(
							$elm$html$Html$Attributes$style,
							'left',
							$elm$core$String$fromInt(150) + 'px'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '0em'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'consolas'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.5em'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A3(
								$elm$core$String$padLeft,
								15,
								_Utils_chr(' '),
								swordName) + '\n')
						])),
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2(
							$elm$html$Html$Attributes$style,
							'left',
							$elm$core$String$fromInt(150) + 'px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'consolas'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A3(
								$elm$core$String$padLeft,
								15,
								_Utils_chr(' '),
								'ATK ' + $elm$core$String$fromInt(sword.attack)))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2(
							$elm$html$Html$Attributes$style,
							'left',
							$elm$core$String$fromInt(left) + 'px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(swordImgPath)
								]),
							_List_Nil)
						]))
				]));
	});
var $author$project$Game$viewPlayerInfo = F4(
	function (left, top, playerName, player) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'margin', '0em'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.75em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(playerName)
						])),
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '1.5em'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'LVL: ' + $elm$core$String$fromInt(player.playerLevel)),
							$elm$html$Html$text(
							'\nEXP: ' + ($elm$core$String$fromInt(player.currentExp) + (' / ' + $elm$core$String$fromInt(player.maxExp)))),
							$elm$html$Html$text(
							'\n\nHealth: ' + ($elm$core$String$fromInt(player.currentHealth) + (' / ' + $elm$core$String$fromInt(player.maxHealth)))),
							$elm$html$Html$text(
							'\nDefense: ' + ($elm$core$String$fromInt(player.armor.totalDef) + (' / ' + $elm$core$String$fromInt(player.maxDefense)))),
							$elm$html$Html$text(
							'\nAttack: ' + $elm$core$String$fromInt(player.sword.attack)),
							$elm$html$Html$text(
							'\nSpeed: ' + $elm$core$String$fromFloat(player.currentSpeed))
						]))
				]));
	});
var $author$project$Game$viewCharacterScreen = F5(
	function (left, top, keys, name, player) {
		var itemsImgSize = '64';
		var characterImgPath = function () {
			var _v0 = player.armor.armorType;
			switch (_v0.$) {
				case 'None':
					return 'assets/player/player_EEE_256_512.png';
				case 'Leather':
					return 'assets/player/player_LLL_256_512.png';
				case 'Silver':
					return 'assets/player/player_SSS_256_512.png';
				default:
					return 'assets/player/player_DDD_256_512.png';
			}
		}();
		return A2(
			$elm$core$List$member,
			$ohanhi$keyboard$Keyboard$Character('C'),
			keys) ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px'),
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('assets/character_screen_scroll_background_1200_600.png'),
							A2($elm$html$Html$Attributes$style, 'position', 'absolute')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '472px'),
							A2($elm$html$Html$Attributes$style, 'top', '48px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(characterImgPath)
								]),
							_List_Nil)
						])),
					A5($author$project$Game$armorInfo, 375, 100, itemsImgSize, player.armor, $author$project$Armor$Helmet),
					A5($author$project$Game$armorInfo, 375, 196, itemsImgSize, player.armor, $author$project$Armor$Chestplate),
					A5($author$project$Game$armorInfo, 375, 292, itemsImgSize, player.armor, $author$project$Armor$Legs),
					A4($author$project$Game$swordInfo, 375, 388, itemsImgSize, player.sword),
					A4($author$project$Game$viewPlayerInfo, 766, 75, name, player),
					A3($author$project$Game$healthPotionInfo, 710, 310, player.healthPotions),
					A3($author$project$Game$speedPotionInfo, 710, 420, player.speedPotions)
				])) : A2($elm$html$Html$div, _List_Nil, _List_Nil);
	});
var $author$project$Game$viewConsumableKeyCooldown = F4(
	function (keys, key, time, potion) {
		var tmpPercentage = ((time - potion.timeOfLastUse) * 100.0) / potion.cooldown;
		var cooldownPercentage = ((tmpPercentage > 100.0) || (potion.timeOfLastUse === 0.0)) ? 100.0 : tmpPercentage;
		var assetPath = (cooldownPercentage === 100.0) ? 'assets/button/consumable_key_48_48_ready.png' : 'assets/button/consumable_key_48_48_cooldown.svg';
		return A2(
			$elm$core$List$member,
			$ohanhi$keyboard$Keyboard$Character(key),
			keys) ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'left', '0px'),
					A2($elm$html$Html$Attributes$style, 'top', '0px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src(assetPath),
							A2(
							$elm$html$Html$Attributes$style,
							'width',
							$elm$core$String$fromFloat(cooldownPercentage) + '%'),
							A2($elm$html$Html$Attributes$style, 'height', '48px')
						]),
					_List_Nil)
				]));
	});
var $author$project$Game$viewConsumable1 = F5(
	function (left, top, keys, time, healthPotion) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('assets/item/consumable_background_96_96.png')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '0px'),
							A2($elm$html$Html$Attributes$style, 'top', '0px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/item/health_potion_96_96.png')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '45px'),
							A2($elm$html$Html$Attributes$style, 'top', '78px'),
							A2($elm$html$Html$Attributes$style, 'color', 'white')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(healthPotion.count))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '24px'),
							A2($elm$html$Html$Attributes$style, 'top', '100px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/button/consumable_key_48_48_pressed.png')
								]),
							_List_Nil),
							A4($author$project$Game$viewConsumableKeyCooldown, keys, 'Q', time, healthPotion),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
									A2($elm$html$Html$Attributes$style, 'left', '0px'),
									A2($elm$html$Html$Attributes$style, 'top', '0px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src('assets/button/q_48_48_transparent.png')
										]),
									_List_Nil)
								]))
						]))
				]));
	});
var $author$project$Game$viewConsumable2 = F5(
	function (left, top, keys, time, speedPotion) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('assets/item/consumable_background_96_96.png')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '0px'),
							A2($elm$html$Html$Attributes$style, 'top', '0px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/item/speed_potion_96_96.png')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '45px'),
							A2($elm$html$Html$Attributes$style, 'top', '78px'),
							A2($elm$html$Html$Attributes$style, 'color', 'white')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(speedPotion.count))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '24px'),
							A2($elm$html$Html$Attributes$style, 'top', '100px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/button/consumable_key_48_48_pressed.png')
								]),
							_List_Nil),
							A4($author$project$Game$viewConsumableKeyCooldown, keys, 'E', time, speedPotion),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
									A2($elm$html$Html$Attributes$style, 'left', '0px'),
									A2($elm$html$Html$Attributes$style, 'top', '0px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src('assets/button/e_48_48_transparent.png')
										]),
									_List_Nil)
								]))
						]))
				]));
	});
var $author$project$Game$DeathScreenRespawn = {$: 'DeathScreenRespawn'};
var $author$project$Game$DeathScreenReturn = {$: 'DeathScreenReturn'};
var $author$project$Game$Hover = function (a) {
	return {$: 'Hover', a: a};
};
var $author$project$Game$MouseOut = function (a) {
	return {$: 'MouseOut', a: a};
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $author$project$Route$routeToString = function (route) {
	switch (route.$) {
		case 'NotFound':
			return 'not-found';
		case 'Home':
			return 'index.html';
		case 'NewGame':
			return 'new-game';
		case 'Game1':
			return 'game1';
		case 'Game2':
			return 'game2';
		case 'Game3':
			return 'game3';
		case 'LoadGame':
			return 'load-game';
		case 'HighScores':
			return 'highscores';
		case 'Settings':
			return 'settings';
		default:
			return 'help';
	}
};
var $author$project$Route$href = function (targetRoute) {
	return $elm$html$Html$Attributes$href(
		$author$project$Route$routeToString(targetRoute));
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onMouseOut = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseout',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseOver = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseover',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Game$viewDeathScreen = F6(
	function (left, top, pathRespawn, pathReturn, player, pos) {
		return (!player.currentHealth) ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px'),
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('assets/death_screen_background_1200_600.png'),
							A2($elm$html$Html$Attributes$style, 'position', 'absolute')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '390px'),
							A2($elm$html$Html$Attributes$style, 'top', '300px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									function () {
									switch (pos.$) {
										case 'First':
											return $author$project$Route$href($author$project$Route$Game1);
										case 'Second':
											return $author$project$Route$href($author$project$Route$Game2);
										default:
											return $author$project$Route$href($author$project$Route$Game3);
									}
								}()
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(pathRespawn),
											$elm$html$Html$Events$onMouseOver(
											$author$project$Game$Hover($author$project$Game$DeathScreenRespawn)),
											$elm$html$Html$Events$onMouseOut(
											$author$project$Game$MouseOut($author$project$Game$DeathScreenRespawn))
										]),
									_List_Nil)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '390px'),
							A2($elm$html$Html$Attributes$style, 'top', '400px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$author$project$Route$href($author$project$Route$Home)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(pathReturn),
											$elm$html$Html$Events$onMouseOver(
											$author$project$Game$Hover($author$project$Game$DeathScreenReturn)),
											$elm$html$Html$Events$onMouseOut(
											$author$project$Game$MouseOut($author$project$Game$DeathScreenReturn))
										]),
									_List_Nil)
								]))
						]))
				])) : A2($elm$html$Html$div, _List_Nil, _List_Nil);
	});
var $author$project$Game$viewDefenseInfo = F2(
	function (maxDef, currDef) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
					A2($elm$html$Html$Attributes$style, 'color', 'white'),
					A2($elm$html$Html$Attributes$style, 'top', '30%'),
					A2($elm$html$Html$Attributes$style, 'left', '47.5%')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$elm$core$String$fromInt(currDef) + (' / ' + $elm$core$String$fromInt(maxDef)))
				]));
	});
var $author$project$Game$viewDefenseBar = F4(
	function (left, top, maxDef, currDef) {
		var defensePercentage = (currDef / maxDef) * 100.0;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('assets/defense_bar.png')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '16px'),
							A2($elm$html$Html$Attributes$style, 'top', '16px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/defense_bar_current.svg'),
									A2($elm$html$Html$Attributes$style, 'height', '16px'),
									A2(
									$elm$html$Html$Attributes$style,
									'width',
									$elm$core$String$fromFloat(defensePercentage) + '%')
								]),
							_List_Nil)
						])),
					A2($author$project$Game$viewDefenseInfo, maxDef, currDef)
				]));
	});
var $author$project$Game$FinishedGame = {$: 'FinishedGame'};
var $author$project$Game$PauseScreenReturn = {$: 'PauseScreenReturn'};
var $myrho$elm_round$Round$addSign = F2(
	function (signed, str) {
		var isNotZero = A2(
			$elm$core$List$any,
			function (c) {
				return (!_Utils_eq(
					c,
					_Utils_chr('0'))) && (!_Utils_eq(
					c,
					_Utils_chr('.')));
			},
			$elm$core$String$toList(str));
		return _Utils_ap(
			(signed && isNotZero) ? '-' : '',
			str);
	});
var $elm$core$Char$fromCode = _Char_fromCode;
var $myrho$elm_round$Round$increaseNum = function (_v0) {
	var head = _v0.a;
	var tail = _v0.b;
	if (_Utils_eq(
		head,
		_Utils_chr('9'))) {
		var _v1 = $elm$core$String$uncons(tail);
		if (_v1.$ === 'Nothing') {
			return '01';
		} else {
			var headtail = _v1.a;
			return A2(
				$elm$core$String$cons,
				_Utils_chr('0'),
				$myrho$elm_round$Round$increaseNum(headtail));
		}
	} else {
		var c = $elm$core$Char$toCode(head);
		return ((c >= 48) && (c < 57)) ? A2(
			$elm$core$String$cons,
			$elm$core$Char$fromCode(c + 1),
			tail) : '0';
	}
};
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $elm$core$String$reverse = _String_reverse;
var $myrho$elm_round$Round$splitComma = function (str) {
	var _v0 = A2($elm$core$String$split, '.', str);
	if (_v0.b) {
		if (_v0.b.b) {
			var before = _v0.a;
			var _v1 = _v0.b;
			var after = _v1.a;
			return _Utils_Tuple2(before, after);
		} else {
			var before = _v0.a;
			return _Utils_Tuple2(before, '0');
		}
	} else {
		return _Utils_Tuple2('0', '0');
	}
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $myrho$elm_round$Round$toDecimal = function (fl) {
	var _v0 = A2(
		$elm$core$String$split,
		'e',
		$elm$core$String$fromFloat(
			$elm$core$Basics$abs(fl)));
	if (_v0.b) {
		if (_v0.b.b) {
			var num = _v0.a;
			var _v1 = _v0.b;
			var exp = _v1.a;
			var e = A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(
					A2($elm$core$String$startsWith, '+', exp) ? A2($elm$core$String$dropLeft, 1, exp) : exp));
			var _v2 = $myrho$elm_round$Round$splitComma(num);
			var before = _v2.a;
			var after = _v2.b;
			var total = _Utils_ap(before, after);
			var zeroed = (e < 0) ? A2(
				$elm$core$Maybe$withDefault,
				'0',
				A2(
					$elm$core$Maybe$map,
					function (_v3) {
						var a = _v3.a;
						var b = _v3.b;
						return a + ('.' + b);
					},
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapFirst($elm$core$String$fromChar),
						$elm$core$String$uncons(
							_Utils_ap(
								A2(
									$elm$core$String$repeat,
									$elm$core$Basics$abs(e),
									'0'),
								total))))) : A3(
				$elm$core$String$padRight,
				e + 1,
				_Utils_chr('0'),
				total);
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				zeroed);
		} else {
			var num = _v0.a;
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				num);
		}
	} else {
		return '';
	}
};
var $myrho$elm_round$Round$roundFun = F3(
	function (functor, s, fl) {
		if ($elm$core$Basics$isInfinite(fl) || $elm$core$Basics$isNaN(fl)) {
			return $elm$core$String$fromFloat(fl);
		} else {
			var signed = fl < 0;
			var _v0 = $myrho$elm_round$Round$splitComma(
				$myrho$elm_round$Round$toDecimal(
					$elm$core$Basics$abs(fl)));
			var before = _v0.a;
			var after = _v0.b;
			var r = $elm$core$String$length(before) + s;
			var normalized = _Utils_ap(
				A2($elm$core$String$repeat, (-r) + 1, '0'),
				A3(
					$elm$core$String$padRight,
					r,
					_Utils_chr('0'),
					_Utils_ap(before, after)));
			var totalLen = $elm$core$String$length(normalized);
			var roundDigitIndex = A2($elm$core$Basics$max, 1, r);
			var increase = A2(
				functor,
				signed,
				A3($elm$core$String$slice, roundDigitIndex, totalLen, normalized));
			var remains = A3($elm$core$String$slice, 0, roundDigitIndex, normalized);
			var num = increase ? $elm$core$String$reverse(
				A2(
					$elm$core$Maybe$withDefault,
					'1',
					A2(
						$elm$core$Maybe$map,
						$myrho$elm_round$Round$increaseNum,
						$elm$core$String$uncons(
							$elm$core$String$reverse(remains))))) : remains;
			var numLen = $elm$core$String$length(num);
			var numZeroed = (num === '0') ? num : ((s <= 0) ? _Utils_ap(
				num,
				A2(
					$elm$core$String$repeat,
					$elm$core$Basics$abs(s),
					'0')) : ((_Utils_cmp(
				s,
				$elm$core$String$length(after)) < 0) ? (A3($elm$core$String$slice, 0, numLen - s, num) + ('.' + A3($elm$core$String$slice, numLen - s, numLen, num))) : _Utils_ap(
				before + '.',
				A3(
					$elm$core$String$padRight,
					s,
					_Utils_chr('0'),
					after))));
			return A2($myrho$elm_round$Round$addSign, signed, numZeroed);
		}
	});
var $myrho$elm_round$Round$round = $myrho$elm_round$Round$roundFun(
	F2(
		function (signed, str) {
			var _v0 = $elm$core$String$uncons(str);
			if (_v0.$ === 'Nothing') {
				return false;
			} else {
				if ('5' === _v0.a.a.valueOf()) {
					if (_v0.a.b === '') {
						var _v1 = _v0.a;
						return !signed;
					} else {
						var _v2 = _v0.a;
						return true;
					}
				} else {
					var _v3 = _v0.a;
					var _int = _v3.a;
					return function (i) {
						return ((i > 53) && signed) || ((i >= 53) && (!signed));
					}(
						$elm$core$Char$toCode(_int));
				}
			}
		}));
var $author$project$Game$viewEndScreen = F4(
	function (left, top, pathReturn, model) {
		var exitReached = _Utils_eq(
			$elm$core$Basics$floor(model.player.x),
			$elm$core$Basics$floor(model.level.endX)) && _Utils_eq(
			$elm$core$Basics$floor(model.player.y),
			$elm$core$Basics$floor(model.level.endY));
		var difficultyPenalty = function () {
			var _v0 = model.difficulty;
			switch (_v0.$) {
				case 'Easy':
					return 3.0;
				case 'Medium':
					return 2.0;
				default:
					return 1.0;
			}
		}();
		var score = ((model.player.playerLevel / model.time) / difficultyPenalty) * 1000.0;
		return (exitReached && _Utils_eq(model.level.map, $author$project$Level$Lvl3)) ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px'),
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('assets/background_1200_600.png'),
							A2($elm$html$Html$Attributes$style, 'position', 'absolute')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '470px'),
							A2($elm$html$Html$Attributes$style, 'top', '25px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'Consolas'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
							A2($elm$html$Html$Attributes$style, 'font-size', '2em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('CONGRATULATIONS')
						])),
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '350px'),
							A2($elm$html$Html$Attributes$style, 'top', '200px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'Consolas'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('You finished the game with a score of')
						])),
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '560px'),
							A2($elm$html$Html$Attributes$style, 'top', '250px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'Consolas'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.75em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($myrho$elm_round$Round$round, 2, score))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '392px'),
							A2($elm$html$Html$Attributes$style, 'top', '450px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$author$project$Route$href($author$project$Route$Home),
									$elm$html$Html$Events$onMouseOver($author$project$Game$FinishedGame)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(pathReturn),
											$elm$html$Html$Events$onMouseOver(
											$author$project$Game$Hover($author$project$Game$PauseScreenReturn)),
											$elm$html$Html$Events$onMouseOut(
											$author$project$Game$MouseOut($author$project$Game$PauseScreenReturn))
										]),
									_List_Nil)
								]))
						]))
				])) : A2($elm$html$Html$div, _List_Nil, _List_Nil);
	});
var $author$project$Game$viewExpInfo = F2(
	function (maxExp, currExp) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
					A2($elm$html$Html$Attributes$style, 'color', 'white'),
					A2($elm$html$Html$Attributes$style, 'top', '30%'),
					A2($elm$html$Html$Attributes$style, 'left', '47.5%')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$elm$core$String$fromInt(currExp) + (' / ' + $elm$core$String$fromInt(maxExp)))
				]));
	});
var $author$project$Game$viewExpBar = F4(
	function (left, top, maxExp, currExp) {
		var expPercentage = (currExp / maxExp) * 100.0;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('assets/exp_bar.png')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '16px'),
							A2($elm$html$Html$Attributes$style, 'top', '16px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/exp_bar_current.svg'),
									A2($elm$html$Html$Attributes$style, 'height', '16px'),
									A2(
									$elm$html$Html$Attributes$style,
									'width',
									$elm$core$String$fromFloat(expPercentage) + '%')
								]),
							_List_Nil)
						])),
					A2($author$project$Game$viewExpInfo, maxExp, currExp)
				]));
	});
var $author$project$Game$viewHealthInfo = F2(
	function (maxHp, currHp) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
					A2($elm$html$Html$Attributes$style, 'color', 'white'),
					A2($elm$html$Html$Attributes$style, 'top', '30%'),
					A2($elm$html$Html$Attributes$style, 'left', '47.5%')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$elm$core$String$fromInt(currHp) + (' / ' + $elm$core$String$fromInt(maxHp)))
				]));
	});
var $author$project$Game$viewHealthBar = F4(
	function (left, top, maxHp, currHp) {
		var healthPercentage = (currHp / maxHp) * 100.0;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('assets/health_bar.png')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '16px'),
							A2($elm$html$Html$Attributes$style, 'top', '12px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/health_bar_current.svg'),
									A2($elm$html$Html$Attributes$style, 'height', '24px'),
									A2(
									$elm$html$Html$Attributes$style,
									'width',
									$elm$core$String$fromFloat(healthPercentage) + '%')
								]),
							_List_Nil)
						])),
					A2($author$project$Game$viewHealthInfo, maxHp, currHp)
				]));
	});
var $author$project$Game$ClickResume = {$: 'ClickResume'};
var $author$project$Game$PauseScreenHelp = {$: 'PauseScreenHelp'};
var $author$project$Game$PauseScreenResume = {$: 'PauseScreenResume'};
var $author$project$Game$PauseScreenSettings = {$: 'PauseScreenSettings'};
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Game$viewPauseScreen = F9(
	function (left, top, pathResume, pathSettings, pathHelp, pathReturn, pauseToggle, player, level) {
		var exitReached = _Utils_eq(
			$elm$core$Basics$floor(player.x),
			$elm$core$Basics$floor(level.endX)) && _Utils_eq(
			$elm$core$Basics$floor(player.y),
			$elm$core$Basics$floor(level.endY));
		return (pauseToggle && ((player.currentHealth > 0) && (!exitReached))) ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px'),
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('assets/background_1200_600.png'),
							A2($elm$html$Html$Attributes$style, 'position', 'absolute')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$pre,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '500px'),
							A2($elm$html$Html$Attributes$style, 'top', '25px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'Consolas'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.75em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('PAUSE SCREEN')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '392px'),
							A2($elm$html$Html$Attributes$style, 'top', '150px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(pathResume),
									$elm$html$Html$Events$onMouseOver(
									$author$project$Game$Hover($author$project$Game$PauseScreenResume)),
									$elm$html$Html$Events$onMouseOut(
									$author$project$Game$MouseOut($author$project$Game$PauseScreenResume)),
									$elm$html$Html$Events$onClick($author$project$Game$ClickResume),
									A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '392px'),
							A2($elm$html$Html$Attributes$style, 'top', '250px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$author$project$Route$href($author$project$Route$Settings)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(pathSettings),
											$elm$html$Html$Events$onMouseOver(
											$author$project$Game$Hover($author$project$Game$PauseScreenSettings)),
											$elm$html$Html$Events$onMouseOut(
											$author$project$Game$MouseOut($author$project$Game$PauseScreenSettings))
										]),
									_List_Nil)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '392px'),
							A2($elm$html$Html$Attributes$style, 'top', '350px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$author$project$Route$href($author$project$Route$Help)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(pathHelp),
											$elm$html$Html$Events$onMouseOver(
											$author$project$Game$Hover($author$project$Game$PauseScreenHelp)),
											$elm$html$Html$Events$onMouseOut(
											$author$project$Game$MouseOut($author$project$Game$PauseScreenHelp))
										]),
									_List_Nil)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '392px'),
							A2($elm$html$Html$Attributes$style, 'top', '450px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$author$project$Route$href($author$project$Route$Home)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(pathReturn),
											$elm$html$Html$Events$onMouseOver(
											$author$project$Game$Hover($author$project$Game$PauseScreenReturn)),
											$elm$html$Html$Events$onMouseOut(
											$author$project$Game$MouseOut($author$project$Game$PauseScreenReturn))
										]),
									_List_Nil)
								]))
						]))
				])) : A2($elm$html$Html$div, _List_Nil, _List_Nil);
	});
var $author$project$Game$viewPlayerDebugInfo = F5(
	function (left, top, name, diff, player) {
		return A2(
			$elm$html$Html$pre,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('name: ' + name),
					$elm$html$Html$text(
					'\ndifficulty: ' + $author$project$DecodingJson$difficultyToString(diff)),
					$elm$html$Html$text(
					'\nx: ' + $elm$core$String$fromFloat(player.x)),
					$elm$html$Html$text(
					'\ny: ' + $elm$core$String$fromFloat(player.y)),
					$elm$html$Html$text(
					'\nvx: ' + $elm$core$String$fromFloat(player.vx)),
					$elm$html$Html$text(
					'\nvy: ' + $elm$core$String$fromFloat(player.vy)),
					$elm$html$Html$text(
					'\ncurrentSpeed: ' + $elm$core$String$fromFloat(player.currentSpeed)),
					$elm$html$Html$text(
					'\nsword: ' + $author$project$Sword$swordTypeToString(player.sword)),
					$elm$html$Html$text(
					'\narmor: ' + $author$project$Armor$armorTypeToString(player.armor))
				]));
	});
var $author$project$Game$keyButtonTexture = F2(
	function (keyButton, keys) {
		var assetPath = 'assets/button/' + (keyButton + '_48_48.png');
		var pressedPath = A3($elm$core$String$replace, '.', '_pressed.', assetPath);
		return (keyButton === 'spacebar') ? (A2($elm$core$List$member, $ohanhi$keyboard$Keyboard$Spacebar, keys) ? 'assets/button/spacebar_192_48_pressed.png' : 'assets/button/spacebar_192_48.png') : ((keyButton === 'w') ? (A2(
			$elm$core$List$member,
			$ohanhi$keyboard$Keyboard$Character('W'),
			keys) ? pressedPath : assetPath) : ((keyButton === 'a') ? (A2(
			$elm$core$List$member,
			$ohanhi$keyboard$Keyboard$Character('A'),
			keys) ? pressedPath : assetPath) : ((keyButton === 's') ? (A2(
			$elm$core$List$member,
			$ohanhi$keyboard$Keyboard$Character('S'),
			keys) ? pressedPath : assetPath) : ((keyButton === 'd') ? (A2(
			$elm$core$List$member,
			$ohanhi$keyboard$Keyboard$Character('D'),
			keys) ? pressedPath : assetPath) : ((keyButton === 'arrowUp') ? (A2($elm$core$List$member, $ohanhi$keyboard$Keyboard$ArrowUp, keys) ? pressedPath : assetPath) : ((keyButton === 'arrowRight') ? (A2($elm$core$List$member, $ohanhi$keyboard$Keyboard$ArrowRight, keys) ? pressedPath : assetPath) : ((keyButton === 'arrowDown') ? (A2($elm$core$List$member, $ohanhi$keyboard$Keyboard$ArrowDown, keys) ? pressedPath : assetPath) : ((keyButton === 'arrowLeft') ? (A2($elm$core$List$member, $ohanhi$keyboard$Keyboard$ArrowLeft, keys) ? pressedPath : assetPath) : ''))))))));
	});
var $author$project$Game$viewPlayerInput = F4(
	function (left, top, keys, movement) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(
									function () {
										if (movement.$ === 'WASD') {
											return A2($author$project$Game$keyButtonTexture, 'w', keys);
										} else {
											return A2($author$project$Game$keyButtonTexture, 'arrowUp', keys);
										}
									}())
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'top', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(
									function () {
										if (movement.$ === 'WASD') {
											return A2($author$project$Game$keyButtonTexture, 'a', keys);
										} else {
											return A2($author$project$Game$keyButtonTexture, 'arrowLeft', keys);
										}
									}())
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '52px'),
							A2($elm$html$Html$Attributes$style, 'top', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(
									function () {
										if (movement.$ === 'WASD') {
											return A2($author$project$Game$keyButtonTexture, 's', keys);
										} else {
											return A2($author$project$Game$keyButtonTexture, 'arrowDown', keys);
										}
									}())
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '104px'),
							A2($elm$html$Html$Attributes$style, 'top', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(
									function () {
										if (movement.$ === 'WASD') {
											return A2($author$project$Game$keyButtonTexture, 'd', keys);
										} else {
											return A2($author$project$Game$keyButtonTexture, 'arrowRight', keys);
										}
									}())
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '260px'),
							A2($elm$html$Html$Attributes$style, 'top', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(
									A2($author$project$Game$keyButtonTexture, 'spacebar', keys))
								]),
							_List_Nil)
						]))
				]));
	});
var $author$project$Game$viewTime = F3(
	function (left, top, dt) {
		var seconds = $elm$core$Basics$floor(dt) % 60;
		var minutes = $elm$core$Basics$floor(dt / 60);
		return A2(
			$elm$html$Html$pre,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromInt(left) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromInt(top) + 'px'),
					A2($elm$html$Html$Attributes$style, 'font-size', 'x-large'),
					A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$elm$core$String$fromInt(minutes) + (' : ' + $elm$core$String$fromInt(seconds)))
				]));
	});
var $author$project$Game$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src('assets/default_background_1920_969.png'),
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						A2($elm$html$Html$Attributes$style, 'position', 'relative'),
						A2($elm$html$Html$Attributes$style, 'left', '0px'),
						A2($elm$html$Html$Attributes$style, 'top', '0px')
					]),
				_List_Nil),
				A3(
				$Zinggi$elm_2d_game$Game$TwoD$renderWithOptions,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '320px'),
						A2($elm$html$Html$Attributes$style, 'top', '100px'),
						A2($elm$html$Html$Attributes$style, 'border', 'solid 1px #FFF')
					]),
				{camera: model.camera, size: model.screen, time: model.time},
				$author$project$Game$render(model)),
				A5($author$project$Game$viewPlayerDebugInfo, 100, 100, model.name, model.difficulty, model.player),
				A3($author$project$Game$viewTime, 950, 50, model.time),
				A4($author$project$Game$viewDefenseBar, 448, 685, model.player.maxDefense, model.player.armor.totalDef),
				A4($author$project$Game$viewHealthBar, 448, 725, model.player.maxHealth, model.player.currentHealth),
				A4($author$project$Game$viewExpBar, 448, 765, model.player.maxExp, model.player.currentExp),
				A5($author$project$Game$viewConsumable1, 336, 650, model.keys, model.time, model.player.healthPotions),
				A5($author$project$Game$viewConsumable2, 1485, 650, model.keys, model.time, model.player.speedPotions),
				A5($author$project$Game$viewCharacterScreen, 360, 160, model.keys, model.name, model.player),
				A4($author$project$Game$viewEndScreen, 360, 160, model.button_PS_return, model),
				A9($author$project$Game$viewPauseScreen, 360, 160, model.button_PS_resume, model.button_PS_settings, model.button_PS_help, model.button_PS_return, model.pauseToggle, model.player, model.level),
				A6($author$project$Game$viewDeathScreen, 360, 160, model.button_DS_respawn, model.button_DS_return, model.player, model.savePosition),
				A4($author$project$Game$viewPlayerInput, 820, 835, model.keys, model.movement)
			]));
};
var $author$project$Help$Armors = {$: 'Armors'};
var $author$project$Help$Enemies = {$: 'Enemies'};
var $author$project$Help$HoverBack = {$: 'HoverBack'};
var $author$project$Help$MouseOut = {$: 'MouseOut'};
var $author$project$Help$Weapons = {$: 'Weapons'};
var $author$project$Help$ActiveTabTo = function (a) {
	return {$: 'ActiveTabTo', a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$Help$tabToString = function (tab) {
	switch (tab.$) {
		case 'Controls':
			return 'Controls';
		case 'Armors':
			return 'Armors';
		case 'Weapons':
			return 'Weapons';
		default:
			return 'Enemies';
	}
};
var $author$project$Help$viewTabButton = F2(
	function (tab, activeTab) {
		var buttonBgColor = _Utils_eq(tab, activeTab) ? '#deb787' : '#fad1a0';
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'block'),
					A2($elm$html$Html$Attributes$style, 'color', 'black'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '3em'),
					A2($elm$html$Html$Attributes$style, 'border', 'none'),
					A2($elm$html$Html$Attributes$style, 'outline', 'none'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'transition', '0.3s'),
					A2($elm$html$Html$Attributes$style, 'font-size', '2em'),
					A2($elm$html$Html$Attributes$style, 'border-right', '2px solid black'),
					A2($elm$html$Html$Attributes$style, 'background-color', buttonBgColor),
					$elm$html$Html$Events$onClick(
					$author$project$Help$ActiveTabTo(tab))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$author$project$Help$tabToString(tab))
				]));
	});
var $author$project$Help$tabContentHeaderStyle = F3(
	function (left, top, size) {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-size', size),
				A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
				A2($elm$html$Html$Attributes$style, 'text-decoration', 'underline'),
				A2($elm$html$Html$Attributes$style, 'margin', 'unset'),
				A2($elm$html$Html$Attributes$style, 'display', 'unset'),
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'left', left),
				A2($elm$html$Html$Attributes$style, 'top', top)
			]);
	});
var $author$project$Help$tabContentImageStyle = F3(
	function (left, top, imgPath) {
		return _List_fromArray(
			[
				$elm$html$Html$Attributes$src(imgPath),
				A2($elm$html$Html$Attributes$style, 'margin', 'unset'),
				A2($elm$html$Html$Attributes$style, 'display', 'unset'),
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'left', left),
				A2($elm$html$Html$Attributes$style, 'top', top)
			]);
	});
var $author$project$Help$tabContentTextStyle = F2(
	function (left, top) {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-size', '1.5em'),
				A2($elm$html$Html$Attributes$style, 'margin', 'unset'),
				A2($elm$html$Html$Attributes$style, 'display', 'unset'),
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'left', left),
				A2($elm$html$Html$Attributes$style, 'top', top)
			]);
	});
var $author$project$Help$viewArmorsContent = _List_fromArray(
	[
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-evenly')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_Utils_ap(
					A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/player/player_EEE_256_512.png'),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'height', '30em')
						])),
				_List_Nil),
				A2(
				$elm$html$Html$img,
				_Utils_ap(
					A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/player/player_LLL_256_512.png'),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'height', '30em')
						])),
				_List_Nil),
				A2(
				$elm$html$Html$img,
				_Utils_ap(
					A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/player/player_SSS_256_512.png'),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'height', '30em')
						])),
				_List_Nil),
				A2(
				$elm$html$Html$img,
				_Utils_ap(
					A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/player/player_DDD_256_512.png'),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'height', '30em')
						])),
				_List_Nil)
			])),
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-evenly')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$pre,
				A3($author$project$Help$tabContentHeaderStyle, '0%', '20%', '2.5em'),
				_List_fromArray(
					[
						$elm$html$Html$text('None Set')
					])),
				A2(
				$elm$html$Html$pre,
				A3($author$project$Help$tabContentHeaderStyle, '0%', '20%', '2.5em'),
				_List_fromArray(
					[
						$elm$html$Html$text('Leather Set')
					])),
				A2(
				$elm$html$Html$pre,
				A3($author$project$Help$tabContentHeaderStyle, '0%', '20%', '2.5em'),
				_List_fromArray(
					[
						$elm$html$Html$text('Silver Set')
					])),
				A2(
				$elm$html$Html$pre,
				A3($author$project$Help$tabContentHeaderStyle, '0%', '20%', '2.5em'),
				_List_fromArray(
					[
						$elm$html$Html$text('Dragon Set')
					]))
			])),
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-around')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$pre,
				A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
				_List_fromArray(
					[
						$elm$html$Html$text('Helmet\t    0\nChestplate  5\nLegs\t    5\n\nTotal DEF:  10')
					])),
				A2(
				$elm$html$Html$pre,
				A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
				_List_fromArray(
					[
						$elm$html$Html$text('Helmet\t    10\nChestplate  10\nLegs\t    10\n\nTotal DEF:  30')
					])),
				A2(
				$elm$html$Html$pre,
				A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
				_List_fromArray(
					[
						$elm$html$Html$text('Helmet\t    20\nChestplate  20\nLegs\t    20\n\nTotal DEF:  60')
					])),
				A2(
				$elm$html$Html$pre,
				A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
				_List_fromArray(
					[
						$elm$html$Html$text('Helmet\t    30\nChestplate  30\nLegs\t    30\n\nTotal DEF:  90')
					]))
			]))
	]);
var $author$project$Help$viewControlsContent = _List_fromArray(
	[
		A2(
		$elm$html$Html$pre,
		A3($author$project$Help$tabContentHeaderStyle, '40%', '0%', '2.5em'),
		_List_fromArray(
			[
				$elm$html$Html$text('Movement')
			])),
		A2(
		$elm$html$Html$pre,
		A2($author$project$Help$tabContentTextStyle, '-0.5%', '10%'),
		_List_fromArray(
			[
				$elm$html$Html$text('Up')
			])),
		A2(
		$elm$html$Html$pre,
		A2($author$project$Help$tabContentTextStyle, '-11%', '40%'),
		_List_fromArray(
			[
				$elm$html$Html$text('Left')
			])),
		A2(
		$elm$html$Html$pre,
		A2($author$project$Help$tabContentTextStyle, '-9.5%', '40%'),
		_List_fromArray(
			[
				$elm$html$Html$text('Down')
			])),
		A2(
		$elm$html$Html$pre,
		A2($author$project$Help$tabContentTextStyle, '-8%', '40%'),
		_List_fromArray(
			[
				$elm$html$Html$text('Right')
			])),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '-21.5%', '23%', 'assets/button/w_48_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '-34%', '35%', 'assets/button/a_48_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '-33%', '35%', 'assets/button/s_48_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '-32%', '35%', 'assets/button/d_48_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$pre,
		A2($author$project$Help$tabContentTextStyle, '-13%', '25%'),
		_List_fromArray(
			[
				$elm$html$Html$text('Or')
			])),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '9.5%', '23%', 'assets/button/arrowUp_48_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '-3%', '35%', 'assets/button/arrowLeft_48_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '-2%', '35%', 'assets/button/arrowDown_48_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '-1%', '35%', 'assets/button/arrowRight_48_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$pre,
		A3($author$project$Help$tabContentHeaderStyle, '-73%', '56%', '2.5em'),
		_List_fromArray(
			[
				$elm$html$Html$text('Attack')
			])),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '7%', '60%', 'assets/button/spacebar_192_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$pre,
		A2($author$project$Help$tabContentTextStyle, '-8%', '65%'),
		_List_fromArray(
			[
				$elm$html$Html$text('Press')
			])),
		A2(
		$elm$html$Html$pre,
		A3($author$project$Help$tabContentHeaderStyle, '25%', '45%', '2.5em'),
		_List_fromArray(
			[
				$elm$html$Html$text('Use Consumables')
			])),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '-7%', '60%', 'assets/button/q_48_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$pre,
		A2($author$project$Help$tabContentTextStyle, '-13%', '65%'),
		_List_fromArray(
			[
				$elm$html$Html$text('Press')
			])),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '7%', '60%', 'assets/button/e_48_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$pre,
		A2($author$project$Help$tabContentTextStyle, '81%', '54%'),
		_List_fromArray(
			[
				$elm$html$Html$text('Press')
			])),
		A2(
		$elm$html$Html$pre,
		A3($author$project$Help$tabContentHeaderStyle, '-2%', '77%', '2.5em'),
		_List_fromArray(
			[
				$elm$html$Html$text('Show Character Details')
			])),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '-30%', '94%', 'assets/button/c_48_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$pre,
		A2($author$project$Help$tabContentTextStyle, '-35.5%', '100%'),
		_List_fromArray(
			[
				$elm$html$Html$text('Hold')
			])),
		A2(
		$elm$html$Html$pre,
		A3($author$project$Help$tabContentHeaderStyle, '0%', '77%', '2.5em'),
		_List_fromArray(
			[
				$elm$html$Html$text('Pause the Game')
			])),
		A2(
		$elm$html$Html$img,
		A3($author$project$Help$tabContentImageStyle, '75%', '83%', 'assets/button/esc_96_48.png'),
		_List_Nil),
		A2(
		$elm$html$Html$pre,
		A2($author$project$Help$tabContentTextStyle, '66%', '88%'),
		_List_fromArray(
			[
				$elm$html$Html$text('Press')
			]))
	]);
var $author$project$Help$viewEnemiesContent = _List_fromArray(
	[
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-evenly')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_Utils_ap(
					A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/enemy/bandit_256_512.png'),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'height', '30em')
						])),
				_List_Nil),
				A2(
				$elm$html$Html$img,
				_Utils_ap(
					A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/enemy/zombie_256_512.png'),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'height', '30em')
						])),
				_List_Nil),
				A2(
				$elm$html$Html$img,
				_Utils_ap(
					A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/enemy/skeleton_256_512.png'),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'height', '30em')
						])),
				_List_Nil),
				A2(
				$elm$html$Html$img,
				_Utils_ap(
					A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/enemy/dragonKnight_256_512.png'),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'height', '30em')
						])),
				_List_Nil)
			])),
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$pre,
				A3($author$project$Help$tabContentHeaderStyle, '7%', '20%', '2.0em'),
				_List_fromArray(
					[
						$elm$html$Html$text('Bandit')
					])),
				A2(
				$elm$html$Html$pre,
				A3($author$project$Help$tabContentHeaderStyle, '21%', '20%', '2.0em'),
				_List_fromArray(
					[
						$elm$html$Html$text('Zombie')
					])),
				A2(
				$elm$html$Html$pre,
				A3($author$project$Help$tabContentHeaderStyle, '34%', '20%', '2.0em'),
				_List_fromArray(
					[
						$elm$html$Html$text('Skeleton')
					])),
				A2(
				$elm$html$Html$pre,
				A3($author$project$Help$tabContentHeaderStyle, '41%', '20%', '2.0em'),
				_List_fromArray(
					[
						$elm$html$Html$text('Dragon Knight')
					]))
			])),
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-around')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$pre,
				A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
				_List_fromArray(
					[
						$elm$html$Html$text('Health:\t10\nAttack:\t2\nSpeed:\t2.0\nEXP drop: 2')
					])),
				A2(
				$elm$html$Html$pre,
				A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
				_List_fromArray(
					[
						$elm$html$Html$text('Health:\t15\nAttack:\t4\nSpeed:\t1.0\nEXP drop: 3')
					])),
				A2(
				$elm$html$Html$pre,
				A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
				_List_fromArray(
					[
						$elm$html$Html$text('Health:\t25\nAttack:\t7\nSpeed:\t2.5\nEXP drop: 5')
					])),
				A2(
				$elm$html$Html$pre,
				A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
				_List_fromArray(
					[
						$elm$html$Html$text('Health:\t100\nAttack:\t20\nSpeed:\t4.0\nEXP drop: 20')
					]))
			]))
	]);
var $author$project$Help$viewWeaponsContent = _List_fromArray(
	[
		A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-evenly')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_Utils_ap(
							A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/sword/sword_wood_128_128.png'),
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'height', '50%')
								])),
						_List_Nil),
						A2(
						$elm$html$Html$img,
						_Utils_ap(
							A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/sword/sword_stone_128_128.png'),
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'height', '50%')
								])),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-evenly')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$pre,
						A3($author$project$Help$tabContentHeaderStyle, '0%', '20%', '2.5em'),
						_List_fromArray(
							[
								$elm$html$Html$text('Wooden Sword')
							])),
						A2(
						$elm$html$Html$pre,
						A3($author$project$Help$tabContentHeaderStyle, '0%', '20%', '2.5em'),
						_List_fromArray(
							[
								$elm$html$Html$text('Stone Sword')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-evenly')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$pre,
						A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
						_List_fromArray(
							[
								$elm$html$Html$text('Attack\t5')
							])),
						A2(
						$elm$html$Html$pre,
						A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
						_List_fromArray(
							[
								$elm$html$Html$text('Attack\t10')
							]))
					]))
			])),
		A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-evenly')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_Utils_ap(
							A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/sword/sword_iron_128_128.png'),
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'height', '50%')
								])),
						_List_Nil),
						A2(
						$elm$html$Html$img,
						_Utils_ap(
							A3($author$project$Help$tabContentImageStyle, '0%', '0%', 'assets/sword/sword_dragon_128_128.png'),
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'height', '50%')
								])),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-evenly')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$pre,
						A3($author$project$Help$tabContentHeaderStyle, '0%', '20%', '2.5em'),
						_List_fromArray(
							[
								$elm$html$Html$text('Iron Sword')
							])),
						A2(
						$elm$html$Html$pre,
						A3($author$project$Help$tabContentHeaderStyle, '0%', '20%', '2.5em'),
						_List_fromArray(
							[
								$elm$html$Html$text('Dragon Sword')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-evenly')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$pre,
						A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
						_List_fromArray(
							[
								$elm$html$Html$text('Attack\t15')
							])),
						A2(
						$elm$html$Html$pre,
						A2($author$project$Help$tabContentTextStyle, '0%', '25%'),
						_List_fromArray(
							[
								$elm$html$Html$text('Attack\t20')
							]))
					]))
			]))
	]);
var $author$project$Help$viewTabContent = function (tab) {
	var content = function () {
		switch (tab.$) {
			case 'Controls':
				return $author$project$Help$viewControlsContent;
			case 'Armors':
				return $author$project$Help$viewArmorsContent;
			case 'Weapons':
				return $author$project$Help$viewWeaponsContent;
			default:
				return $author$project$Help$viewEnemiesContent;
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'float', 'left'),
				A2($elm$html$Html$Attributes$style, 'width', '80%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
				A2($elm$html$Html$Attributes$style, 'overflow-x', 'hidden'),
				A2($elm$html$Html$Attributes$style, 'display', 'block')
			]),
		content);
};
var $author$project$Help$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src('assets/default_background_1920_969.png'),
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						A2($elm$html$Html$Attributes$style, 'position', 'relative'),
						A2($elm$html$Html$Attributes$style, 'left', '0px'),
						A2($elm$html$Html$Attributes$style, 'top', '0px')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '46.28%'),
						A2($elm$html$Html$Attributes$style, 'top', '7%'),
						A2($elm$html$Html$Attributes$style, 'font-size', '5em'),
						A2($elm$html$Html$Attributes$style, 'margin', '0px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Help')
					])),
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src('assets/character_screen_scroll_background_1200_600.png'),
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '15%'),
						A2($elm$html$Html$Attributes$style, 'top', '18%'),
						A2($elm$html$Html$Attributes$style, 'width', '70%')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '15%'),
						A2($elm$html$Html$Attributes$style, 'top', '18%'),
						A2($elm$html$Html$Attributes$style, 'width', '55%'),
						A2($elm$html$Html$Attributes$style, 'height', '50%'),
						A2($elm$html$Html$Attributes$style, 'padding-left', '7.5%'),
						A2($elm$html$Html$Attributes$style, 'padding-right', '7.5%'),
						A2($elm$html$Html$Attributes$style, 'padding-top', '5%')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'float', 'left'),
								A2($elm$html$Html$Attributes$style, 'width', '20%'),
								A2($elm$html$Html$Attributes$style, 'height', 'auto')
							]),
						_List_fromArray(
							[
								A2($author$project$Help$viewTabButton, $author$project$Help$Controls, model.activeTab),
								A2($author$project$Help$viewTabButton, $author$project$Help$Armors, model.activeTab),
								A2($author$project$Help$viewTabButton, $author$project$Help$Weapons, model.activeTab),
								A2($author$project$Help$viewTabButton, $author$project$Help$Enemies, model.activeTab)
							])),
						$author$project$Help$viewTabContent(model.activeTab)
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$author$project$Route$href($author$project$Route$Home)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.buttonBack),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '752px'),
								A2($elm$html$Html$Attributes$style, 'top', '864px'),
								$elm$html$Html$Events$onMouseOver($author$project$Help$HoverBack),
								$elm$html$Html$Events$onMouseOut($author$project$Help$MouseOut)
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$HighScores$HoverBack = {$: 'HoverBack'};
var $author$project$HighScores$MouseOut = {$: 'MouseOut'};
var $author$project$HighScores$viewScoreEntry = function (entry) {
	if (entry.$ === 'Just') {
		var s = entry.a;
		return A2(
			$elm$html$Html$pre,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'relative'),
					A2($elm$html$Html$Attributes$style, 'display', 'block'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'Consolas'),
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '1em'),
					A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					s.name + ('\t' + (s.difficulty + ('\t\t' + A2($myrho$elm_round$Round$round, 2, s.score)))))
				]));
	} else {
		return A2($elm$html$Html$div, _List_Nil, _List_Nil);
	}
};
var $author$project$HighScores$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src('assets/default_background_1920_969.png'),
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						A2($elm$html$Html$Attributes$style, 'position', 'relative'),
						A2($elm$html$Html$Attributes$style, 'left', '0px'),
						A2($elm$html$Html$Attributes$style, 'top', '0px')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '760px'),
						A2($elm$html$Html$Attributes$style, 'top', '100px'),
						A2($elm$html$Html$Attributes$style, 'font-size', '5em'),
						A2($elm$html$Html$Attributes$style, 'margin', '0px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('High Scores')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '760px'),
						A2($elm$html$Html$Attributes$style, 'top', '300px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$pre,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'relative'),
								A2($elm$html$Html$Attributes$style, 'display', 'block'),
								A2($elm$html$Html$Attributes$style, 'border-bottom', '5px double black'),
								A2($elm$html$Html$Attributes$style, 'font-family', 'Consolas'),
								A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
								A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Name\tDifficulty\tScore')
							])),
						$author$project$HighScores$viewScoreEntry(
						A2(
							$elm$core$Array$get,
							0,
							$elm$core$Array$fromList(model.scores))),
						$author$project$HighScores$viewScoreEntry(
						A2(
							$elm$core$Array$get,
							1,
							$elm$core$Array$fromList(model.scores))),
						$author$project$HighScores$viewScoreEntry(
						A2(
							$elm$core$Array$get,
							2,
							$elm$core$Array$fromList(model.scores))),
						$author$project$HighScores$viewScoreEntry(
						A2(
							$elm$core$Array$get,
							3,
							$elm$core$Array$fromList(model.scores))),
						$author$project$HighScores$viewScoreEntry(
						A2(
							$elm$core$Array$get,
							4,
							$elm$core$Array$fromList(model.scores)))
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$author$project$Route$href($author$project$Route$Home)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.buttonBack),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '752px'),
								A2($elm$html$Html$Attributes$style, 'top', '864px'),
								$elm$html$Html$Events$onMouseOver($author$project$HighScores$HoverBack),
								$elm$html$Html$Events$onMouseOut($author$project$HighScores$MouseOut)
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$Home$HoverHelp = {$: 'HoverHelp'};
var $author$project$Home$HoverHighScore = {$: 'HoverHighScore'};
var $author$project$Home$HoverLoadGame = {$: 'HoverLoadGame'};
var $author$project$Home$HoverNewGame = {$: 'HoverNewGame'};
var $author$project$Home$HoverSettings = {$: 'HoverSettings'};
var $author$project$Home$MouseOut = {$: 'MouseOut'};
var $author$project$Home$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src('assets/mainMenu_background_1920_969.png'),
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						A2($elm$html$Html$Attributes$style, 'position', 'relative'),
						A2($elm$html$Html$Attributes$style, 'left', '0px'),
						A2($elm$html$Html$Attributes$style, 'top', '0px')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$author$project$Route$href($author$project$Route$NewGame)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.button_newGame),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '752px'),
								A2($elm$html$Html$Attributes$style, 'top', '416px'),
								$elm$html$Html$Events$onMouseOver($author$project$Home$HoverNewGame),
								$elm$html$Html$Events$onMouseOut($author$project$Home$MouseOut)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$author$project$Route$href($author$project$Route$LoadGame)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.button_loadGame),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '752px'),
								A2($elm$html$Html$Attributes$style, 'top', '528px'),
								$elm$html$Html$Events$onMouseOver($author$project$Home$HoverLoadGame),
								$elm$html$Html$Events$onMouseOut($author$project$Home$MouseOut)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$author$project$Route$href($author$project$Route$HighScores)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.button_highScore),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '752px'),
								A2($elm$html$Html$Attributes$style, 'top', '640px'),
								$elm$html$Html$Events$onMouseOver($author$project$Home$HoverHighScore),
								$elm$html$Html$Events$onMouseOut($author$project$Home$MouseOut)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$author$project$Route$href($author$project$Route$Settings)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.button_settings),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '752px'),
								A2($elm$html$Html$Attributes$style, 'top', '752px'),
								$elm$html$Html$Events$onMouseOver($author$project$Home$HoverSettings),
								$elm$html$Html$Events$onMouseOut($author$project$Home$MouseOut)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$author$project$Route$href($author$project$Route$Help)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.button_help),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '752px'),
								A2($elm$html$Html$Attributes$style, 'top', '864px'),
								$elm$html$Html$Events$onMouseOver($author$project$Home$HoverHelp),
								$elm$html$Html$Events$onMouseOut($author$project$Home$MouseOut)
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$LoadGame$HoverBack = {$: 'HoverBack'};
var $author$project$LoadGame$HoverGame1 = {$: 'HoverGame1'};
var $author$project$LoadGame$HoverGame2 = {$: 'HoverGame2'};
var $author$project$LoadGame$HoverGame3 = {$: 'HoverGame3'};
var $author$project$LoadGame$MouseOut = {$: 'MouseOut'};
var $author$project$LoadGame$viewEmptyGame = A2(
	$elm$html$Html$pre,
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
			A2($elm$html$Html$Attributes$style, 'left', '125px'),
			A2($elm$html$Html$Attributes$style, 'top', '33px'),
			A2($elm$html$Html$Attributes$style, 'font-family', 'Consolas'),
			A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
			A2($elm$html$Html$Attributes$style, 'font-size', '3rem'),
			A2($elm$html$Html$Attributes$style, 'margin', '0px')
		]),
	_List_fromArray(
		[
			$elm$html$Html$text('--- empty ---')
		]));
var $author$project$LoadGame$viewSavedGame = function (save) {
	var playerName = function () {
		var _v3 = save.name;
		if (_v3.$ === 'Just') {
			var name = _v3.a;
			return name;
		} else {
			return 'PLAYER';
		}
	}();
	var playerLvl = function () {
		var _v2 = save.player;
		if (_v2.$ === 'Just') {
			var player = _v2.a;
			return $elm$core$String$fromInt(player.playerLevel);
		} else {
			return '-';
		}
	}();
	var playerHp = function () {
		var _v1 = save.player;
		if (_v1.$ === 'Just') {
			var player = _v1.a;
			return A2($myrho$elm_round$Round$round, 2, (player.currentHealth / player.maxHealth) * 100.0) + '%';
		} else {
			return '-';
		}
	}();
	var gameLvl = function () {
		var _v0 = save.level;
		if (_v0.$ === 'Just') {
			var level = _v0.a;
			return $author$project$Level$mapToString(level);
		} else {
			return '-';
		}
	}();
	return A2(
		$elm$html$Html$pre,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
				A2($elm$html$Html$Attributes$style, 'left', '35px'),
				A2($elm$html$Html$Attributes$style, 'top', '20px'),
				A2($elm$html$Html$Attributes$style, 'font-family', 'Consolas'),
				A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
				A2($elm$html$Html$Attributes$style, 'margin', '0px'),
				A2($elm$html$Html$Attributes$style, 'font-size', '1.5rem')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Name: ' + playerName),
				$elm$html$Html$text(
				'\tDifficulty: ' + $author$project$DecodingJson$difficultyToString(save.difficulty)),
				$elm$html$Html$text('\nGame: ' + gameLvl),
				$elm$html$Html$text(
				'\tTime: ' + (A2($myrho$elm_round$Round$round, 3, save.time) + 's')),
				$elm$html$Html$text('\nPlayer LvL: ' + playerLvl),
				$elm$html$Html$text('\tHealth: ' + playerHp)
			]));
};
var $author$project$LoadGame$viewLoadGameInfo = function (save) {
	if (save.$ === 'Just') {
		var s = save.a;
		return $author$project$LoadGame$viewSavedGame(s);
	} else {
		return $author$project$LoadGame$viewEmptyGame;
	}
};
var $author$project$LoadGame$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src('assets/default_background_1920_969.png'),
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						A2($elm$html$Html$Attributes$style, 'position', 'relative'),
						A2($elm$html$Html$Attributes$style, 'left', '0px'),
						A2($elm$html$Html$Attributes$style, 'top', '0px')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '760px'),
						A2($elm$html$Html$Attributes$style, 'top', '50px'),
						A2($elm$html$Html$Attributes$style, 'font-size', '5rem')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Load Game')
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '660px'),
						A2($elm$html$Html$Attributes$style, 'top', '250px'),
						$author$project$Route$href($author$project$Route$Game1),
						A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
						$elm$html$Html$Events$onMouseOver($author$project$LoadGame$HoverGame1),
						$elm$html$Html$Events$onMouseOut($author$project$LoadGame$MouseOut)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.buttonGame1)
							]),
						_List_Nil),
						$author$project$LoadGame$viewLoadGameInfo(model.save1)
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '660px'),
						A2($elm$html$Html$Attributes$style, 'top', '428px'),
						$author$project$Route$href($author$project$Route$Game2),
						A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
						$elm$html$Html$Events$onMouseOver($author$project$LoadGame$HoverGame2),
						$elm$html$Html$Events$onMouseOut($author$project$LoadGame$MouseOut)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.buttonGame2)
							]),
						_List_Nil),
						$author$project$LoadGame$viewLoadGameInfo(model.save2)
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '660px'),
						A2($elm$html$Html$Attributes$style, 'top', '606px'),
						$author$project$Route$href($author$project$Route$Game3),
						A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
						$elm$html$Html$Events$onMouseOver($author$project$LoadGame$HoverGame3),
						$elm$html$Html$Events$onMouseOut($author$project$LoadGame$MouseOut)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.buttonGame3)
							]),
						_List_Nil),
						$author$project$LoadGame$viewLoadGameInfo(model.save3)
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$author$project$Route$href($author$project$Route$Home)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.buttonBack),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '752px'),
								A2($elm$html$Html$Attributes$style, 'top', '864px'),
								$elm$html$Html$Events$onMouseOver($author$project$LoadGame$HoverBack),
								$elm$html$Html$Events$onMouseOut($author$project$LoadGame$MouseOut)
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$NewGame$DifficultyTo = function (a) {
	return {$: 'DifficultyTo', a: a};
};
var $author$project$NewGame$HoverBack = {$: 'HoverBack'};
var $author$project$NewGame$HoverStart = {$: 'HoverStart'};
var $author$project$NewGame$MouseOut = {$: 'MouseOut'};
var $author$project$NewGame$NameChanged = function (a) {
	return {$: 'NameChanged', a: a};
};
var $author$project$NewGame$SaveTo = function (a) {
	return {$: 'SaveTo', a: a};
};
var $author$project$NewGame$Second = {$: 'Second'};
var $author$project$NewGame$Third = {$: 'Third'};
var $elm$html$Html$Attributes$autofocus = $elm$html$Html$Attributes$boolProperty('autofocus');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$NewGame$radio = F3(
	function (msg, isChecked, value) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					$elm$html$Html$Events$onClick(msg)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('radio'),
							A2($elm$html$Html$Attributes$style, 'margin-left', '40px'),
							A2($elm$html$Html$Attributes$style, 'width', '5em'),
							A2($elm$html$Html$Attributes$style, 'height', '5em'),
							$elm$html$Html$Attributes$checked(isChecked)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '110%'),
							A2($elm$html$Html$Attributes$style, 'top', '25%')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(value)
						]))
				]));
	});
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$NewGame$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src('assets/default_background_1920_969.png'),
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						A2($elm$html$Html$Attributes$style, 'position', 'relative'),
						A2($elm$html$Html$Attributes$style, 'left', '0px'),
						A2($elm$html$Html$Attributes$style, 'top', '0px')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '800px'),
						A2($elm$html$Html$Attributes$style, 'top', '100px'),
						A2($elm$html$Html$Attributes$style, 'font-size', '5em'),
						A2($elm$html$Html$Attributes$style, 'margin', '0px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('New Game')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '500px'),
						A2($elm$html$Html$Attributes$style, 'top', '250px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Enter name:'),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$autofocus(true),
										$elm$html$Html$Events$onInput($author$project$NewGame$NameChanged),
										$elm$html$Html$Attributes$value(model.playerName),
										A2($elm$html$Html$Attributes$style, 'margin-left', '40px'),
										A2($elm$html$Html$Attributes$style, 'height', '2em'),
										A2($elm$html$Html$Attributes$style, 'width', '500px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '28px'),
										A2($elm$html$Html$Attributes$style, 'padding', '12px 20px')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap'),
								A2($elm$html$Html$Attributes$style, 'top', '175px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2($elm$html$Html$Attributes$style, 'top', '20px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Difficulty:')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2($elm$html$Html$Attributes$style, 'left', '175px'),
										A2($elm$html$Html$Attributes$style, 'top', '0px')
									]),
								_List_fromArray(
									[
										A3(
										$author$project$NewGame$radio,
										$author$project$NewGame$DifficultyTo($author$project$DecodingJson$Easy),
										_Utils_eq(model.difficulty, $author$project$DecodingJson$Easy),
										'easy')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2($elm$html$Html$Attributes$style, 'left', '375px'),
										A2($elm$html$Html$Attributes$style, 'top', '0px')
									]),
								_List_fromArray(
									[
										A3(
										$author$project$NewGame$radio,
										$author$project$NewGame$DifficultyTo($author$project$DecodingJson$Medium),
										_Utils_eq(model.difficulty, $author$project$DecodingJson$Medium),
										'medium')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2($elm$html$Html$Attributes$style, 'left', '625px'),
										A2($elm$html$Html$Attributes$style, 'top', '0px')
									]),
								_List_fromArray(
									[
										A3(
										$author$project$NewGame$radio,
										$author$project$NewGame$DifficultyTo($author$project$DecodingJson$Hard),
										_Utils_eq(model.difficulty, $author$project$DecodingJson$Hard),
										'hard')
									]))
							])),
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'top', '300px'),
								A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2($elm$html$Html$Attributes$style, 'top', '20px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Save position:')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2($elm$html$Html$Attributes$style, 'left', '175px'),
										A2($elm$html$Html$Attributes$style, 'top', '0px')
									]),
								_List_fromArray(
									[
										A3(
										$author$project$NewGame$radio,
										$author$project$NewGame$SaveTo($author$project$NewGame$First),
										_Utils_eq(model.savePosition, $author$project$NewGame$First),
										'1')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2($elm$html$Html$Attributes$style, 'left', '375px'),
										A2($elm$html$Html$Attributes$style, 'top', '0px')
									]),
								_List_fromArray(
									[
										A3(
										$author$project$NewGame$radio,
										$author$project$NewGame$SaveTo($author$project$NewGame$Second),
										_Utils_eq(model.savePosition, $author$project$NewGame$Second),
										'2')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2($elm$html$Html$Attributes$style, 'left', '625px'),
										A2($elm$html$Html$Attributes$style, 'top', '0px')
									]),
								_List_fromArray(
									[
										A3(
										$author$project$NewGame$radio,
										$author$project$NewGame$SaveTo($author$project$NewGame$Third),
										_Utils_eq(model.savePosition, $author$project$NewGame$Third),
										'3')
									]))
							]))
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$author$project$Route$href($author$project$Route$Home)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.buttonBack),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '524px'),
								A2($elm$html$Html$Attributes$style, 'top', '864px'),
								$elm$html$Html$Events$onMouseOver($author$project$NewGame$HoverBack),
								$elm$html$Html$Events$onMouseOut($author$project$NewGame$MouseOut)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						function () {
						var _v0 = model.savePosition;
						switch (_v0.$) {
							case 'First':
								return $author$project$Route$href($author$project$Route$Game1);
							case 'Second':
								return $author$project$Route$href($author$project$Route$Game2);
							default:
								return $author$project$Route$href($author$project$Route$Game3);
						}
					}()
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.buttonStart),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '980px'),
								A2($elm$html$Html$Attributes$style, 'top', '864px'),
								$elm$html$Html$Events$onMouseOver($author$project$NewGame$HoverStart),
								$elm$html$Html$Events$onMouseOut($author$project$NewGame$MouseOut)
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$Settings$HoverBack = {$: 'HoverBack'};
var $author$project$Settings$MouseOut = {$: 'MouseOut'};
var $author$project$Settings$MovementTo = function (a) {
	return {$: 'MovementTo', a: a};
};
var $author$project$Settings$MusicTo = function (a) {
	return {$: 'MusicTo', a: a};
};
var $author$project$Settings$radio = F3(
	function (msg, isChecked, value) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					$elm$html$Html$Events$onClick(msg)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('radio'),
							A2($elm$html$Html$Attributes$style, 'margin-left', '40px'),
							A2($elm$html$Html$Attributes$style, 'width', '5em'),
							A2($elm$html$Html$Attributes$style, 'height', '5em'),
							$elm$html$Html$Attributes$checked(isChecked)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '110%'),
							A2($elm$html$Html$Attributes$style, 'top', '25%')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(value)
						]))
				]));
	});
var $author$project$Settings$viewMovementKeys = function (mov) {
	if (mov.$ === 'WASD') {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'left', '150px'),
					A2($elm$html$Html$Attributes$style, 'top', '0px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/button/w_48_48.png')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'top', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/button/a_48_48.png')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '52px'),
							A2($elm$html$Html$Attributes$style, 'top', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/button/s_48_48.png')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '104px'),
							A2($elm$html$Html$Attributes$style, 'top', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/button/d_48_48.png')
								]),
							_List_Nil)
						]))
				]));
	} else {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'left', '150px'),
					A2($elm$html$Html$Attributes$style, 'top', '0px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/button/arrowUp_48_48.png')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'top', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/button/arrowLeft_48_48.png')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '52px'),
							A2($elm$html$Html$Attributes$style, 'top', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/button/arrowDown_48_48.png')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'left', '104px'),
							A2($elm$html$Html$Attributes$style, 'top', '52px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/button/arrowRight_48_48.png')
								]),
							_List_Nil)
						]))
				]));
	}
};
var $author$project$Settings$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src('assets/default_background_1920_969.png'),
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						A2($elm$html$Html$Attributes$style, 'position', 'relative'),
						A2($elm$html$Html$Attributes$style, 'left', '0px'),
						A2($elm$html$Html$Attributes$style, 'top', '0px')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'left', '800px'),
						A2($elm$html$Html$Attributes$style, 'top', '100px'),
						A2($elm$html$Html$Attributes$style, 'font-size', '5em'),
						A2($elm$html$Html$Attributes$style, 'margin', '0px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Settings')
					])),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap'),
						A2($elm$html$Html$Attributes$style, 'left', '500px'),
						A2($elm$html$Html$Attributes$style, 'top', '300px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'top', '10px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Music:')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '175px'),
								A2($elm$html$Html$Attributes$style, 'top', '0px')
							]),
						_List_fromArray(
							[
								A3(
								$author$project$Settings$radio,
								$author$project$Settings$MusicTo($author$project$Settings$Off),
								_Utils_eq(model.music, $author$project$Settings$Off),
								'off')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '600px'),
								A2($elm$html$Html$Attributes$style, 'top', '0px')
							]),
						_List_fromArray(
							[
								A3(
								$author$project$Settings$radio,
								$author$project$Settings$MusicTo($author$project$Settings$On),
								_Utils_eq(model.music, $author$project$Settings$On),
								'on')
							]))
					])),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap'),
						A2($elm$html$Html$Attributes$style, 'left', '500px'),
						A2($elm$html$Html$Attributes$style, 'top', '550px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'top', '10px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Movement:')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '180px'),
								A2($elm$html$Html$Attributes$style, 'top', '0px')
							]),
						_List_fromArray(
							[
								A3(
								$author$project$Settings$radio,
								$author$project$Settings$MovementTo($author$project$Settings$WASD),
								_Utils_eq(model.movement, $author$project$Settings$WASD),
								''),
								$author$project$Settings$viewMovementKeys($author$project$Settings$WASD)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '605px'),
								A2($elm$html$Html$Attributes$style, 'top', '0px')
							]),
						_List_fromArray(
							[
								A3(
								$author$project$Settings$radio,
								$author$project$Settings$MovementTo($author$project$Settings$Arrows),
								_Utils_eq(model.movement, $author$project$Settings$Arrows),
								''),
								$author$project$Settings$viewMovementKeys($author$project$Settings$Arrows)
							]))
					])),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$author$project$Route$href($author$project$Route$Home)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(model.buttonBack),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'left', '752px'),
								A2($elm$html$Html$Attributes$style, 'top', '864px'),
								$elm$html$Html$Events$onMouseOver($author$project$Settings$HoverBack),
								$elm$html$Html$Events$onMouseOut($author$project$Settings$MouseOut)
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$Main$viewBody = function (model) {
	var _v0 = model.pageModel;
	switch (_v0.$) {
		case 'NotFoundPage':
			return A2(
				$elm$html$Html$h1,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Oops! The page you requested was not found!')
					]));
		case 'HomePage':
			var modelHome = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$HomePageMsg,
				$author$project$Home$view(modelHome));
		case 'NewGamePage':
			var modelNewGame = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$NewGamePageMsg,
				$author$project$NewGame$view(modelNewGame));
		case 'GamePage':
			var modelGame = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$GamePageMsg,
				$author$project$Game$view(modelGame));
		case 'LoadGamePage':
			var modelLoadGame = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$LoadGamePageMsg,
				$author$project$LoadGame$view(modelLoadGame));
		case 'HighScoresPage':
			var modelHighScores = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$HighScoresPageMsg,
				$author$project$HighScores$view(modelHighScores));
		case 'SettingsPage':
			var modelSettings = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$SettingsPageMsg,
				$author$project$Settings$view(modelSettings));
		default:
			var modelHelp = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$HelpPageMsg,
				$author$project$Help$view(modelHelp));
	}
};
var $author$project$Main$viewTitle = function (model) {
	var _v0 = model.pageModel;
	switch (_v0.$) {
		case 'NotFoundPage':
			return 'Not Found';
		case 'HomePage':
			var modelHome = _v0.a;
			return 'Home';
		case 'NewGamePage':
			var modelNewGame = _v0.a;
			return 'New Game';
		case 'GamePage':
			var modelGame = _v0.a;
			return 'Game';
		case 'LoadGamePage':
			var modelLoadGame = _v0.a;
			return 'Load Game';
		case 'HighScoresPage':
			var modelHighScores = _v0.a;
			return 'HighScores';
		case 'SettingsPage':
			var modelSettings = _v0.a;
			return 'Settings';
		default:
			var modelHelp = _v0.a;
			return 'Help';
	}
};
var $author$project$Main$view = function (model) {
	return {
		body: _List_fromArray(
			[
				$author$project$Main$viewBody(model),
				$author$project$Main$backgroundMusic(model.flags.settings)
			]),
		title: $author$project$Main$viewTitle(model) + ' - The Elm Scrolls'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{init: $author$project$Main$init, onUrlChange: $author$project$Main$UrlChanged, onUrlRequest: $author$project$Main$LinkClicked, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));