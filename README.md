## Coderan: Validator
The smart React element validator

[![Build Status](https://travis-ci.org/machielsdev/validator.svg?branch=develop)](https://travis-ci.org/machielsdev/validator)
[![codecov](https://codecov.io/gh/machielsdev/validator/branch/develop/graph/badge.svg?token=OX5CACK0K0)](undefined)

### Introduction
The goal of this package, is to simplify the struggle of validating elements in React, with a simple system which allows
users to add their own rules.  
The system communicates directly with the elements in the DOM, and is therefore widely compatible with other libraries,
like [Bootstrap](https://react-bootstrap.github.io/).

### The concept
Validator consists of two main elements, an `Area` and a `Provider`. Areas are a sort of wrappers having elements that
need validation as their children. An area scans the underlying components and elements and indexes validatable elements.
  
Providers on the other hand are wrappers around areas, and allow them to communicate between each other. This communication
is needed in order to match with values in other areas. It can also be used to validate all areas at once, and preventing
actions to happen while not all areas are valid. 

### How to use
First, start with adding rules to the validator in order to use them. There are some rules pre-made, but more specific
rules you have to create yourself.

```javascript
import { Validator } from '@coderan/validator';
import { min } from '@coderan/rules/min';

Validator.extend('min', min);
```

#### Area
Basic usage:
```jsx
import { ValidatorArea } from '@coderan/validator';

<ValidatorArea rules="required">
    <input name="username" />
</ValidatorArea>
```
When the input is focused and blurred, the `required` rule is called.

Every area needs a name. This name is used to index areas in the provider, and make meaningful error messages. When using
multiple inputs within an area, i.e. when validating a multi-input date of birth, `name` prop is required when defining
the `ValidatorArea` component. Like so:

```jsx
import { ValidatorArea } from '@coderan/validator';

<ValidatorArea rules="min" name="dob">
    <input name="day" />
    <input name="month" />
    <input name="year" />
</ValidatorArea>
```

Showing errors:
```jsx
import { ValidatorArea } from '@coderan/validator';

<ValidatorArea rules="min" name="dob">
    {({ errors }) => (
        <>
            <input name="username" />
            { errors.length && <span>{errors[0]}</span> }
        </>
    )}
</ValidatorArea>
```

#### Provider
Basic usage:
```jsx
import { ValidatorProvider, ValidatorArea } from '@coderan/validator';

<ValidatorProvider>
    {({ validate }) => (
        <>
            <ValidatorArea rules="min" name="dob">
                <input name="day" />
                <input name="month" />
                <input name="year" />
            </ValidatorArea>
            <ValidatorArea rules="min" name="dob">
                <input name="day" />
                <input name="month" />
                <input name="year" />
            </ValidatorArea>
            <button
                onClick={() => validate(() => alert('valid'))}>Check</button>
        </>
    )}
</ValidatorProvider>
```

It is possible to give the validator a `rules` prop as well, whose rules apply to all underlying areas:

```jsx
import { ValidatorProvider, ValidatorArea } from '@coderan/validator';

<ValidatorProvider rules="required">
    <ValidatorArea rules="min:5">
        {/* on blur, both required and min rules are applied */}
        <input name="username" /> 
    </ValidatorArea>
</ValidatorProvider>
```

#### Adding rules

With access to validator
```javascript
import { Validator } from '@coderan/validator'
Validator.extend('test_types', (validator: Validator) => ({
    passed(): boolean {
        return validator.refs(undefined, HTMLInputElement).length === 1
            && validator.refs('test1', HTMLTextAreaElement).length === 1
            && validator.refs('test1').length === 1
            && validator.refs('test1', HTMLProgressElement).length === 0;
    },
    message(): string {
        return 'test';
    }
}));
```

or without
```javascript
import { getValue, isInputElement, isSelectElement } from '@/utils/dom';

export default {
    passed(elements: HTMLElement[]): boolean {
        return elements.every((element: HTMLElement) => {
            if (isInputElement(element) || isSelectElement(element)) {
                const value = getValue(element);

                return value && value.length;
            }

            return true;
        })
    },

    message(): string {
        return `{name} is required`;
    }
};
```

You can create your own rules, as long as it follows this interface:
```typescript
import { Validator } from '@coderan/validator';

/**
 * Function to access validator using the rule
 */
declare type RuleFunction = (validator: Validator) => RuleObject;

/**
 * Object structure rules must implement
 */
declare type RuleObject = {
    /**
     * Returns whether the rule passed with the given element(s)
     */
    passed(elements: HTMLElement[], ...args: string[]): boolean;
    /**
     * Message shown when the rule doesn't pass
     */
    message(): string;
}

export type Rule = RuleObject | RuleFunction;
```

Perhaps you would like to use a different name for the message than the `name`-attribute. That's perfectly fine! 
```tsx
import { ValidatorArea } from '@coderan/validator';

<ValidatorArea rules="required" validationName="Surname">
    {({ errors }) => (
        <>
            <input name="username" />
            { errors.length && <span>{errors[0]}</span> }
        </>
    )}
</ValidatorArea>
```
and when no value is present in the input, a message like "Surname is required" will appear. 

### Happy Coding!
