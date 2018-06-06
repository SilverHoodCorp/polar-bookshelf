# Design

# Requirements

- support path structures such as /foo/bar and / 

- Support primitive types (numbers, strings, etc) and objects but not arrays.
  Arrays can support append and re-order which isn't what we want to accomplish.

- do not allow dictionaries to be overwritten. If they are then we won't get
  notifications on the new objects.
