Mockato - mocking in Aria Templates
=====================

Mockato is a mocking library, shamelessly inspired by Mockito.
It was designed to help me write tests for Aria Templates.
However looking back now I'm not sure that this kind of mocking is really extremely helpful in JavaScript.
The API is too heavily linked to Java and doesn't really take advantage of the dynamic nature of JS.

Warning - The current version is actually not compatible with Aria Templates. 
It was developped for a custom version of Aria Templates, and needs to be adapted.

Using Mockato
---------------------
Put the mockato folder at the root of your AT application.
Then simply add a $dependency to 'mockato.Mockato'.

Mocks
---------------------
Use `mockato.Mockato.mock` with the classpath of any available aria templates class or interface. 
It will return you a mock of this class/interface, with dummy implementations of all the methods.

This mock can then be used to verify the usage of the mocked methods, or to stub method calls.

Below is a sample from a setup method a test case written for a simple game engine :

    var mockedTimer = mockato.Mockato.mock('games.common.clock.Timer');
    var engine = new this.$GameEngine(context, mockedTimer);

My GameEngine happens to be very careful about what kind of arguments you pass to its constructor and would have exploded if it didn't get a proper Timer instance. With the mock, it's just fine !

In more details :

    Aria.interfaceDefinition({
        $classpath : 'ConfigurationReader',
        $interface : {
            getValue : function (paramName) {},
            hasParameter : function (paramName) {}
        }
    });
    
    Aria.classDefinition({
        $classpath : 'HelloWorld',
        $prototype : {
            sayHello : function (to) {
                return "Hello " + to;
            }
        }
    });
    
In your test : 

    setUp : function () {
        var mockedConfigReader = mockato.Mockato.mock('ConfigurationReader');
        mockedConfigReader.getValue("someParam"); // null
        mockedConfigReader.hasParameter("someParam"); // null
        mockedConfigReader.unknownMethod(); // ERROR
        
        var mockedHelloWorld = mockato.Mockato.mock('HelloWorld');
        aria.utils.Type.isInstanceOf(mockedHelloWorld, 'HelloWorld'); // true
    }
When
---------------------
If you want to add some default behaviour to your mock, use `mockato.Mockato.when` on an existing mock.

    var mockedConfigReader = mockato.Mockato.mock('ConfigurationReader');
    mockato.Mockato.when(mockedConfigReader).getValue().thenReturn(42);
    // when calling mockedConfigReader.getValue() then return 42
    mockedConfigReader.getValue(); // 42

Calling `when` on an existing mock gives you a wrapper on this mock. This wrapper has the same methods as the mock. Call them and chain with a behaviour : thenReturn, thenAnswer or thenThrow to change the behaviour of the mock.
As in Mockito, the arguments you use when calling the method on the wrapper are saved along with the behavior. Meaning this behaviour will only be used if the method is called on the mock with the same arguments list.

    mockato.Mockato.when(mockedConfigReader).getValue('language').thenReturn('FR');
    // when calling mockedConfigReader.getValue with attribute 'language' then return 'FR'
    mockedConfigReader.getValue('language'); // 'FR'
    // but still :
    mockedConfigReader.getValue(); // 42
    
In the example above the configReader is configured to return 42 when called with no argument. But actually this config reader is supposed to be always called with one argument, the name of the config parameter to evaluate.
If the mock was supposed to always return 42, you should use Matchers.

    mockato.Mockato.when(mockedConfigReader).getValue(mockato.Matchers.ANY).thenReturn(42);
    mockedConfigReader.getValue("some random argument"); // 42
    
There are 3 behaviours available : 
* thenReturn(value) : returns the provided value
* thenAnswer(method) : apply the provided method to the mock
* thenThrow(errorMessage) : throw an error

    mockato.Mockato.when(mockedConfigReader).
        getValue(mockato.Matchers.ANY).thenAnswer(function(paramName) {return paramName + ":value"});
    mockedConfigReader.getValue("myParam"); // "myParamValue"
    
    mockato.Mockato.when(mockedConfigReader).getValue().thenThrow('getValue should not be called without argument');

Verify
---------------------
A mock is automatically spied on by Mockato. It will log all the method calls that happened on this mock. 
So you can check if your mock was called as you expected, using `mockato.Mockato.verify`.

The syntax is very close to the one used for `when`.

    // check that the client never attempted to retrieve a forbidden parameter
    mockato.Mockato.verify(mockedConfigReader).getValue("forbiddenParam").wasNeverCalled();
    // check it called getValue at least once with the argument 'mandatoryParam'
    mockato.Mockato.verify(mockedConfigReader).getValue("mandatoryParam").wasCalled();
    // check that getValue was called at least 3 times with any parameter (you can use Matchers here as well)
    mockato.Mockato.verify(mockedConfigReader).getValue(mockato.Matchers.ANY).atLeast(3);

Verify, similarly to `when`, depends on the arguments list you provide to the method (here getValue). The verification is based on the list of calls to the method made with the exact sme arguments list.

The full list of verifiers is :
* **times(numberOfTimes)** : check the method was called exactly numberOfTimes
* **once()** : equivalent to times(1), check it was called exactly once
* **never()** : equivalent to times(0)
* **atLeast(numberOfTimes)** : called numberOfTimes or more
* **atMost(numberOfTimes)** : called numberOfTimes or less
* **atLeastOnce()** : equivalent to atLeast(1)
* **wasCalled()** : equivalent to atLeastOnce()
* **wasNeverCalled()** : equivalent to never()


Matchers
---------------------
To be used with `when` or `verify` : 
* **mockato.Matchers.ANY** : can represent any argument
* **mockato.Matchers.ANYALL** : to use only once in a signature. Will match any possible signature