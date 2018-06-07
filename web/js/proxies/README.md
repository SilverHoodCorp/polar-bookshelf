# Design

# Requirements

- support path structures such as /foo/bar and /

- Support primitive types (numbers, strings, etc) and objects but not arrays.
  Arrays can support append and re-order which isn't what we want to accomplish.

- do not allow dictionaries to be overwritten. If they are then we won't get
  notifications on the new objects.


https://github.com/melanke/Watch.JS/


# Detecting Deletes and Handling the previous values

DELETE is handles just like SET but the value is undefined.

```json
{
    "path": "/",
    "mutationType": "DELETE",
    "target": {
        "cat": "dog"
    },
    "property": "cat",
    "value": undefined
}
```

You can look at the mutationType or the value to see if it was removed.

You have the property name and the target so you can reference the previous
value if you want to do any type of cleanup.
