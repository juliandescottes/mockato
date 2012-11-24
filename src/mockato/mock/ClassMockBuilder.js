Aria.classDefinition({
	$classpath : 'mockato.mock.ClassMockBuilder',
	$dependencies : ['mockato.mock.MockedClassDefinitionBuilder', 'aria.utils.Json'],
	$constructor : function (classRef) {
		this.__classRef = classRef;
	},
	$prototype : {		
		build : function () {
			var classpath = this.__classRef.classDefinition.$classpath,
				methods = this.__getClassMethods(this.__classRef);

			var mockClassDef = new mockato.mock.MockedClassDefinitionBuilder(classpath, methods).build();
			mockClassDef.$extends = classpath;
			return this.__defineClassAndGetInstance(mockClassDef);
		},

		__getClassMethods : function (classObject) {
			var methods = classObject.classDefinition.$prototype;
			if (classObject.superclass) {
				aria.utils.Json.inject(this.__getClassMethods(classObject.superclass.constructor), methods);
			}
			return methods;
		},

		__defineClassAndGetInstance : function (classDef) {
			Aria.classDefinition(classDef);

			return new (Aria.getClassRef(classDef.$classpath))();
		}
	}
});