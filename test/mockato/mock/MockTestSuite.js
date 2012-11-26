Aria.testSuiteDefinition = function (testSuiteConfiguration) {
	testSuiteConfiguration.$extends = "aria.jsunit.TestSuite";
	var tests = testSuiteConfiguration.$tests;
	var userDefinedConstructor = testSuiteConfiguration.$constructor || function () {};
	testSuiteConfiguration.$constructor = function () {
		this.$TestSuite.constructor.call(this);
		userDefinedConstructor.call(this);
		this.addTests.apply(this, tests);
	};
	return Aria.classDefinition(testSuiteConfiguration);
};

Aria.testSuiteDefinition({
	$classpath : 'mockato.mock.MockTestSuite',
	$extends : 'aria.jsunit.TestCase',
	$tests : [
		'mockato.mock.MockTest',
		'mockato.mock.MockTestInterface',
		'mockato.mock.MockTestInheritedClasses',
		'mockato.mock.MockTestInheritedInterfaces',
		'mockato.mock.MockedClassDefinitionBuilderTest'
	]
});