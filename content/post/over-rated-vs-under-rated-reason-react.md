+++
title = "Over rated vs under rated: ReasonReact"
Tags = ["programming", "react", "javascript"]
date = 2019-02-17T11:36:46-08:00
+++

Over rated vs under rated” is a game the economist [Tyler
Cowen](https://marginalrevolution.com/) plays at the end of his podcast. I
recently built a [simple wizard app](https://www.sheki.in/decision/) using
ReasonReact. The app walks you through a Cognitive Behavioral Therapy (CBT)
technique to make decisions. This post is my hot take on what is “over
rated/under rated” in ReasonReact. This is not a hot take on ReasonML the
language.


## Under rated

1. **The type inference**: I did not provide any type annotations. The
type checker inferred everything. It inferred the correct types and found bugs
in my code. Compared to Flow, the JS type thing I have used, this was
delightful. Not providing type annotations but still getting type checking is
extremely under rated.

2. **Compiler errors**: The error messages when compiling code
were spot on. ReasonML has the most helpful spot on obvious error messages
amongst all the programming languages I have used. I did not have to look up
what a particular error message meant. This is huge for a programming language
I am using for the first time.

3. **Automatic module resolution**: My code is not
littered with the noise of import/export statements. The compiler figures out
the modules or tells me politely when it cannot. Half my JS code is usually
import/export statements. Specifically the filenames have to be unique across
the whole project in a ReasonML app. This abstracts away the file system and
allows you to move files around without changing code.

4. **File local modules**: To
start a new scope within a file, I can use `module ChildComponent {` syntax. In
this scope I can have a local type called state or a variable called component.
My Flow/JS code when creating child components within the same file would have
names with a noisy prefix `type ChildSubcomponentFooState = ….`. Local modules
solves this problem elegantly.

5. **Built in reducer**: The built in reducer forces
code modularity, by pushing most of the business logic to the reducers. This
makes it easy for most of my components to be stateless.

6. **Miscellaneous**: Builds are fast. The switch statements are ergonomic. It is React adjacent, learning
ReasonReact is easy if you know React. The robust Ocaml standard library
available in ReasonML has most things I need.

## Over rated

1. **JSX support**: I had to
annotate every string inside JSX with `ReasonReact.string` . I can see why the
type-system needs it but, it was a buzzkill when writing a lot of layout jsx.

2. **Styles**: The current way of doing styles via a styles object is extremely
verbose. The API is type safe but it makes it cumbersome to use. The community
is working on fixing the styles story.

3. **No dynamic imports**: There is no story
around code-splitting a big ReasonApp yet. There is an open issue to support
dynamic imports.  I loved ReasonML. It made programming joyful again. It was
verbose than expected. The language and tooling seem quite well polished.

I am sheki and I approve of ReasonML.
