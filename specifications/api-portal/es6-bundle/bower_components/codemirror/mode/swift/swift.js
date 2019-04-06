// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
// Swift mode created by Michael Kaminsky https://github.com/mkaminsky11
(function(mod){if("object"==typeof exports&&"object"==typeof module)mod(require("../../lib/codemirror"));else if("function"==typeof define&&define.amd)define(["../../lib/codemirror"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";function wordSet(words){for(var set={},i=0;i<words.length;i++)set[words[i]]=!0/* ignoreName */ /* skipSlots */;return set}var keywords=wordSet(["_","var","let","class","enum","extension","import","protocol","struct","func","typealias","associatedtype","open","public","internal","fileprivate","private","deinit","init","new","override","self","subscript","super","convenience","dynamic","final","indirect","lazy","required","static","unowned","unowned(safe)","unowned(unsafe)","weak","as","is","break","case","continue","default","else","fallthrough","for","guard","if","in","repeat","switch","where","while","defer","return","inout","mutating","nonmutating","catch","do","rethrows","throw","throws","try","didSet","get","set","willSet","assignment","associativity","infix","left","none","operator","postfix","precedence","precedencegroup","prefix","right","Any","AnyObject","Type","dynamicType","Self","Protocol","__COLUMN__","__FILE__","__FUNCTION__","__LINE__"]),definingKeywords=wordSet(["var","let","class","enum","extension","import","protocol","struct","func","typealias","associatedtype","for"]),atoms=wordSet(["true","false","nil","self","super","_"]),types=wordSet(["Array","Bool","Character","Dictionary","Double","Float","Int","Int8","Int16","Int32","Int64","Never","Optional","Set","String","UInt8","UInt16","UInt32","UInt64","Void"]),operators="+-/*%=|&<>~^?!",punc=":;,.(){}[]",binary=/^\-?0b[01][01_]*/,octal=/^\-?0o[0-7][0-7_]*/,hexadecimal=/^\-?0x[\dA-Fa-f][\dA-Fa-f_]*(?:(?:\.[\dA-Fa-f][\dA-Fa-f_]*)?[Pp]\-?\d[\d_]*)?/,decimal=/^\-?\d[\d_]*(?:\.\d[\d_]*)?(?:[Ee]\-?\d[\d_]*)?/,identifier=/^\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1/,property=/^\.(?:\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1)/,instruction=/^\#[A-Za-z]+/,attribute=/^@(?:\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1)/;//var regexp = /^\/(?!\s)(?:\/\/)?(?:\\.|[^\/])+\//
function tokenBase(stream,state,prev){if(stream.sol())state.indented=stream.indentation();if(stream.eatSpace())return null;var ch=stream.peek();if("/"==ch){if(stream.match("//")){stream.skipToEnd();return"comment"}if(stream.match("/*")){state.tokenize.push(tokenComment);return tokenComment(stream,state)}}if(stream.match(instruction))return"builtin";if(stream.match(attribute))return"attribute";if(stream.match(binary))return"number";if(stream.match(octal))return"number";if(stream.match(hexadecimal))return"number";if(stream.match(decimal))return"number";if(stream.match(property))return"property";if(-1<operators.indexOf(ch)){stream.next();return"operator"}if(-1<punc.indexOf(ch)){stream.next();stream.match("..");return"punctuation"}if(ch=stream.match(/("{3}|"|')/)){var tokenize=tokenString(ch[0]);state.tokenize.push(tokenize);return tokenize(stream,state)}if(stream.match(identifier)){var ident=stream.current();if(types.hasOwnProperty(ident))return"variable-2";if(atoms.hasOwnProperty(ident))return"atom";if(keywords.hasOwnProperty(ident)){if(definingKeywords.hasOwnProperty(ident))state.prev="define";return"keyword"}if("define"==prev)return"def";return"variable"}stream.next();return null}function tokenUntilClosingParen(){var depth=0;return function(stream,state,prev){var inner=tokenBase(stream,state,prev);if("punctuation"==inner){if("("==stream.current())++depth;else if(")"==stream.current()){if(0==depth){stream.backUp(1);state.tokenize.pop();return state.tokenize[state.tokenize.length-1](stream,state)}else--depth}}return inner}}function tokenString(quote){var singleLine=1==quote.length;return function(stream,state){var ch,escaped=/* eat */ /* ignoreName */!1/* skipSlots */ /* skipSlots */;while(ch=stream.next()){if(escaped){if("("==ch){state.tokenize.push(tokenUntilClosingParen());return"string"}escaped=!1}else if(stream.match(quote)){state.tokenize.pop();return"string"}else{escaped="\\"==ch}}if(singleLine){state.tokenize.pop()}return"string"}}function tokenComment(stream,state){var ch;while(!0){stream.match(/^[^/*]+/,!0);ch=stream.next();if(!ch)break;if("/"===ch&&stream.eat("*")){state.tokenize.push(tokenComment)}else if("*"===ch&&stream.eat("/")){state.tokenize.pop()}}return"comment"}function Context(prev,align,indented){this.prev=prev;this.align=align;this.indented=indented}function pushContext(state,stream){var align=stream.match(/^\s*($|\/[\/\*])/,!1)?null:stream.column()+1;state.context=new Context(state.context,align,state.indented)}function popContext(state){if(state.context){state.indented=state.context.indented;state.context=state.context.prev}}CodeMirror.defineMode("swift",function(config){return{startState:function(){return{prev:null,context:null,indented:0,tokenize:[]}},token:function(stream,state){var prev=state.prev;state.prev=null;var tokenize=state.tokenize[state.tokenize.length-1]||tokenBase,style=tokenize(stream,state,prev);if(!style||"comment"==style)state.prev=prev;else if(!state.prev)state.prev=style;if("punctuation"==style){var bracket=/[\(\[\{]|([\]\)\}])/.exec(stream.current());if(bracket)(bracket[1]?popContext:pushContext)(state,stream)}return style},indent:function(state,textAfter){var cx=state.context;if(!cx)return 0;var closing=/^[\]\}\)]/.test(textAfter);if(null!=cx.align)return cx.align-(closing?1:0);return cx.indented+(closing?0:config.indentUnit)},electricInput:/^\s*[\)\}\]]$/,lineComment:"//",blockCommentStart:"/*",blockCommentEnd:"*/",fold:"brace",closeBrackets:"()[]{}''\"\"``"}});CodeMirror.defineMIME("text/x-swift","swift")});