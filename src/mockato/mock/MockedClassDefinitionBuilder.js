Aria.classDefinition({
    $classpath : 'mockato.mock.MockedClassDefinitionBuilder',
    $dependencies : ['aria.utils.Type', 'mockato.StubStore', 'mockato.CallHistory'],
    $constructor : function (classpath, methods) {
        if (aria.utils.Type.isString(classpath) && aria.utils.Type.isObject(methods)) {
            this.__classpath = classpath;
            this.__methods = methods;  
        } else {
            throw new Error("Invalid arguments for MockedClassDefinitionBuilder.");
        }

    },
    $prototype : {
        build : function () {
            var mockClassDef = this.__createMockClass(this.__classpath);

            for(var methodName in this.__methods) {
                if (!this.__methods.hasOwnProperty(methodName)) continue;
                mockClassDef.$prototype[methodName] = this.__createMockedMethod(methodName);
            }

            return mockClassDef;
        },

        __createMockClass : function (classpath) {
            var mockedClassRef = {};
            var mockedClasspath = classpath + '_mock' + (this.__getUniqueId());
            mockedClassRef.$classpath = mockedClasspath;
            mockedClassRef.$constructor = function(){};
            mockedClassRef.$prototype = {};

            return mockedClassRef;
        },

        __createMockedMethod : function (methodName) {
            return function () {
                mockato.CallHistory.store(this, methodName, arguments);
                var stub = mockato.StubStore.get(this, methodName, arguments) || function () {};
                return stub.apply(this, arguments);
            };
        },

        __getUniqueId : function () {
            return Date.now() + Math.floor(Math.random()*10000);
        }
    }
});