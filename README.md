Mockato - mocking in Aria Templates
=====================

Mockato is a mocking library, shamelessly inspired by Mockito.
It was designed during a train trip to help me write tests for Aria Templates.
However looking back now I'm not sure that this kind of mocking is really extremely helpful in JavaScript.
The API is too heavily linked to Java and doesn't really take advantage of the dynamic nature of JavaScript.

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
When
---------------------
If you want to add some default behaviour to your mock, use `mockato.Mockato.when` on an existing mock.

    var mockedConfigReader = mockato.Mockato.mock('games.common.ConfigurationReader');
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
If the mock was supposed to always return 42, you should actually use Matchers.

    mockato.Mockato.when(mockedConfigReader).getValue(mockato.Matchers.ANY).thenReturn(42);
    mockedConfigReader.getValue("some random argument"); // 42

Verify
---------------------

Matchers
---------------------