Aria.classDefinition({
	$classpath:'mockato.ClassA',
	$statics : {
		RETURN_VALUE : "FOO"	
	},
	$constructor : function (classpath) {
	},
	$prototype : {
		basicMethod : function () {return this.RETURN_VALUE;},
		methodThrowingError : function () {
			throw new Error("some error");
		}
	}
});