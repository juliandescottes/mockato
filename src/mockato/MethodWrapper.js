Aria.classDefinition({
	$classpath : 'mockato.MethodWrapper',
	$constructor : function (methodName, mock, args) {
		this.__args = args;
		this.__mock = mock;
		this.__methodName = methodName;
	}
});