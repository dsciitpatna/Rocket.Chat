// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
(function(mod){if("object"==("undefined"===typeof exports?"undefined":babelHelpers.typeof(exports))&&"object"==("undefined"===typeof module?"undefined":babelHelpers.typeof(module)))// CommonJS
mod(require("../../lib/codemirror"));else if("function"==typeof define&&define.amd)// AMD
define(["../../lib/codemirror"],mod);else// Plain browser env
mod(CodeMirror)})(function(CodeMirror){"use strict";CodeMirror.defineMode("rpm-changes",function(){var headerSeperator=/^-+$/,headerLine=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)  ?\d{1,2} \d{2}:\d{2}(:\d{2})? [A-Z]{3,4} \d{4} - /,simpleEmail=/^[\w+.-]+@[\w.-]+/;return{token:function token(stream){if(stream.sol()){if(stream.match(headerSeperator)){return"tag"}if(stream.match(headerLine)){return"tag"}}if(stream.match(simpleEmail)){return"string"}stream.next();return null}}});CodeMirror.defineMIME("text/x-rpm-changes","rpm-changes");// Quick and dirty spec file highlighting
CodeMirror.defineMode("rpm-spec",function(){var arch=/^(i386|i586|i686|x86_64|ppc64le|ppc64|ppc|ia64|s390x|s390|sparc64|sparcv9|sparc|noarch|alphaev6|alpha|hppa|mipsel)/,preamble=/^[a-zA-Z0-9()]+:/,section=/^%(debug_package|package|description|prep|build|install|files|clean|changelog|preinstall|preun|postinstall|postun|pretrans|posttrans|pre|post|triggerin|triggerun|verifyscript|check|triggerpostun|triggerprein|trigger)/,control_flow_complex=/^%(ifnarch|ifarch|if)/,control_flow_simple=/^%(else|endif)/,operators=/^(\!|\?|\<\=|\<|\>\=|\>|\=\=|\&\&|\|\|)/;// operators in control flow macros
return{startState:function startState(){return{controlFlow:/* eat */ /* ignoreName */ /* ignoreName */!1/* skipSlots */ /* skipSlots */,macroParameters:!1,section:!1}},token:function token(stream,state){var ch=stream.peek();if("#"==ch){stream.skipToEnd();return"comment"}if(stream.sol()){if(stream.match(preamble)){return"header"}if(stream.match(section)){return"atom"}}if(stream.match(/^\$\w+/)){return"def"}// Variables like '$RPM_BUILD_ROOT'
if(stream.match(/^\$\{\w+\}/)){return"def"}// Variables like '${RPM_BUILD_ROOT}'
if(stream.match(control_flow_simple)){return"keyword"}if(stream.match(control_flow_complex)){state.controlFlow=!0/* skipSlots */;return"keyword"}if(state.controlFlow){if(stream.match(operators)){return"operator"}if(stream.match(/^(\d+)/)){return"number"}if(stream.eol()){state.controlFlow=!1}}if(stream.match(arch)){if(stream.eol()){state.controlFlow=!1}return"number"}// Macros like '%make_install' or '%attr(0775,root,root)'
if(stream.match(/^%[\w]+/)){if(stream.match(/^\(/)){state.macroParameters=!0}return"keyword"}if(state.macroParameters){if(stream.match(/^\d+/)){return"number"}if(stream.match(/^\)/)){state.macroParameters=!1;return"keyword"}}// Macros like '%{defined fedora}'
if(stream.match(/^%\{\??[\w \-\:\!]+\}/)){if(stream.eol()){state.controlFlow=!1}return"def"}//TODO: Include bash script sub-parser (CodeMirror supports that)
stream.next();return null}}});CodeMirror.defineMIME("text/x-rpm-spec","rpm-spec")});